const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { validateUser } = require("../middlewares/validation/user.validation");


//////////////// Register ////////////////
router.post("/Register", async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    const { error, value } = validateUser(req.body);
    console.log("Validation result:", { error, value });
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

    console.log(user);
    await user.save();

    //   // Save the user data to the session
    //   req.session.user = {
    //     _id: user._id,
    //     username: user.username,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     role: user.role,
    //   };

    res.status(201).json(user);
  } catch (err) {
    console.log("Caught error:", err);

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
