const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
// const token  = require("morgan");

exports.user_signup = async (req, res, next) => {
  try {
    let existsUser = await User.find({ email: req.body.email });
    if (existsUser.length >= 1) {
      return res.status(409).json({
        message: "Mail already exists",
      });
    } else {
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hashedPassword,
      });
      const result = await user.save();
      console.log(result);
      res.status(201).json({
        message: "User created",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.user_login = async (req, res, next) => {
  try {
    let user = await User.find({ email: req.body.email });
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    let match = await bcrypt.compare(req.body.password, user[0].password);
    if (match) {
      const token = jwt.sign(
        {
          email: user[0].email,
          userId: user[0]._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        message: "auth successful",
        token: token,
      });
    } else {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.delete_user = async (req, res, next) => {
  try {
    let result = await User.deleteOne({ _id: req.params.userId });
    res.status(200).json({
      message: "User was deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
