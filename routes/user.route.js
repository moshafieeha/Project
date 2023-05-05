const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/user.model");

// middlewares
const {
  validateRegister,
  checkAdminLimit,
  validatePassword,
  findUser,
} = require("../middlewares/validation/user.validation");

// controllers
const { deleteUser } = require("../controllers/user.controller");

// request handlers
router.delete("/delete", deleteUser);
router.put("/update", async (req, res, next) => {
  try {
    console.log(req.session.user);
    const { error } = validateRegister(req.body);
    if (error) return next(createError(500, error.message));

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
        fName: req.body.firstName,
        lName: req.body.lastName,
        gender: req.body.gender,
        role: req.body.role,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password
          ? await bcrypt.hash(req.body.password, 10)
          : user.password,
      },
      { new: true } // return the updated document
    );

    // Update the user data in the session
    req.session.user = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    res.status(201).json(user);
  } catch (err) {
    return next(createError(500, err.message));
  }
});

module.exports = router;
