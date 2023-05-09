const User = require("../models/user.model");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

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

    return res.json({ success: true, redirectUrl: '/render/profile' });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

///////////////////////// READ /////////////////////////
const readUser = async (req, res, next) => {
  const { password } = req.body;

  try {
    const isValidPassword = await bcrypt.compare(
      password,
      req.foundUser.password
    );
    if (!isValidPassword) {
      return next(createError(400, "Invalid password"));
    }

    // Save the user data to the session
    req.session.user = {
      _id: req.foundUser._id,
      username: req.foundUser.username,
      fName: req.foundUser.firstName,
      lName: req.foundUser.lastName,
      role: req.foundUser.role,
    };

    return res.json({ success: true, redirectUrl: "/render/profile" });
  } catch (err) {
    next(err);
  }
};

///////////////////////// UPDATE /////////////////////////
const updateUser = async (req, res, next) => {
  try {
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
          : undefined,
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
};

///////////////////////// DELETE /////////////////////////
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.session.user._id);
    req.session.destroy();
    res.status(201).json("done");
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser,
};
