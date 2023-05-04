const User = require("../models/user.model");
const createError = require("http-errors");

///////////////////////// CREAT /////////////////////////
const createUser = async (req, res, next) => {
  // add new doc to the DB and is the last param of "register" in the "auth" route
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
};

///////////////////////// READ /////////////////////////
const readUser = async (req, res, next) => {
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

module.exports = {
  createUser,
  readUser
};
