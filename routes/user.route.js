const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/user.model");

// middlewares
const {
  validateUpdate,
  checkAdminLimit,
  validatePassword,
  findUser,
} = require("../middlewares/validation/user.validation");

// controllers
const { deleteUser } = require("../controllers/user.controller");

// request handlers
router.delete("/delete", deleteUser);
router.put("/update", validateUpdate, async (req, res, next) => {
  try {
    console.log(req.session.user);

    // // Check that the new phone number is unique
    // const phoneExists = await User.findOne({
    //   phone: req.body.phone,
    //   _id: { $ne: req.session.user._id }, // exclude the current user
    // });
    // if (phoneExists) {
    //   return next(createError(400, "Phone number is already in use"));
    // }

    // // Check that the new username is unique
    // const usernameExists = await User.findOne({
    //   username: req.body.username,
    //   _id: { $ne: req.session.user._id }, // exclude the current user
    // });
    // if (usernameExists) {
    //   return next(createError(400, "Username is already in use"));
    // }

    // If validation passes, update the user object and save it to the database
    const user = await User.findByIdAndUpdate(
      req.session.user._id,
      {
        fName: req.validatedUser.firstName,
        lName: req.validatedUser.lastName,
        gender: req.validatedUser.gender,
        role: req.validatedUser.role,
        phone: req.validatedUser.phone,
        username: req.validatedUser.username,
        password: req.validatedUser.password
          ? await bcrypt.hash(req.validatedUser.password, 10)
          : user.password,
      },
      { new: true } // return the updated document
    );

    // Update the user data in the session
    req.session.user = {
      _id: user._id,
      username: user.username,
      firstName: user.fName,
      lastName: user.lName,
      role: user.role,
    };

    res.status(201).json(user);
  } catch (err) {
    return next(createError(500, err.message));
  }
});

module.exports = router;
