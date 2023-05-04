const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

// middlewares
const { validateUser } = require("../middlewares/validation/user.validation");
const { checkAdminLimit } = require("../middlewares/validation/user.admin");

//////////////// Register ////////////////
router.post("/Register", checkAdminLimit, async (req, res, next) => {
  try {
    const { error, value } = validateUser(req.body);
    if (error) return next(createError(500, error.message));

    // If validation passes, create a new user object and save it to the database
    const user = new User({
      fName: req.body.fName,
      lName: req.body.lName,
      username: req.body.username,
      password: req.body.password,
      gender: req.body.gender,
      phone: req.body.phone,
      role: req.body.role,
    });

    await user.save();

    // Save the user data to the session
    req.session.user = {
      _id: user._id,
      username: user.username,
      fName: user.firstName,
      lName: user.lastName,
      role: user.role,
    };

    console.log(req.session.user);

    res.status(201).json(user);
  } catch (err) {
    return next(createError(500, err.message));
  }
});

//////////////// Login ////////////////
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(400, "Invalid username"));
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createError(400, "Invalid password"));
    }

    // // Save the user data to the session
    // req.session.user = {
    //   _id: user._id,
    //   username: user.username,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   role: user.role,
    // };

    res.status(201).json(user);
  } catch (err) {
    return next(createError(500, err.message));
  }
});

module.exports = router;
