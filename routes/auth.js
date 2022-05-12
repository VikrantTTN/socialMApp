const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not Found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid Credentials");

    const token = user.generateToken();

    res.send(token);
  } catch (error) {
    res.status(500).send(error)
  }
});

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
}

module.exports = router;
