const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi=require('joi')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 50,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    friends: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.PRIVATEKEY);
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
}


module.exports = mongoose.model("User", userSchema);
exports.validate=validateUser;
