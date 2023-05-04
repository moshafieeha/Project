const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

// middlewares
const {
  validateRegister,
  validateLogin,
  checkAdminLimit,
  validatePassword,
  findUser,
} = require("../middlewares/validation/user.validation");

//////////////// Register ////////////////
router.post(
  "/Register",
  checkAdminLimit,
  validateRegister,
  async (req, res, next) => {
    try {
      const user = new User(req.validatedUser);
      await user.save();

      // Save the user data to the session
      req.session.user = {
        _id: user._id,
        username: user.username,
        fName: user.firstName,
        lName: user.lastName,
        role: user.role,
      };

      res.status(201).json(user);
    } catch (err) {
      return next(createError(500, err.message));
    }
  }
);

//////////////// Login ////////////////
router.post(
  "/login",
  validateLogin,
  findUser,
  validatePassword,
  async (req, res, next) => {
    try {
      // Save the user data to the session
      req.session.user = {
        _id: req.foundUser._id,
        username: req.foundUser.username,
        fName: req.foundUser.firstName,
        lName: req.foundUser.lastName,
        role: req.foundUser.role,
      };

      res.status(201).json(req.foundUser);
    } catch (err) {
      return next(createError(500, err.message));
    }
  }
);

module.exports = router;
