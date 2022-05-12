const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");

const router = express.Router();

const User = require("../models/user");

router.get("/", (req, res) => {
  res.send("This is users Route");
});

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already Registered");
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(200).send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    res.status(400).send("Something Went wrong", error);
  }
});

//User Update.

router.put("/update/:id", async (req, res) => {
  let { userId, name, email, password } = req.body;

  if (req.body.userId === req.params.id) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } catch (error) {
        res.status(500).send(error);
      }
    }

    try {
      let user = await User.findByIdAndUpdate(userId, {
        name: name,
        email: email,
        password: password,
      });
      res.status(200).send("Account has been Updated");
    } catch {
      res.status(500).send("user not found");
    }
  } else {
    res.send("You can update only your account.");
  }

  let user = await User.findOne({ _id: req.params.id });
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
}

module.exports = router;
