const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const createError = require("http-errors");

// middlewares
const {
  validateRegister,
  validateLogin,
  checkAdminLimit,
  validatePassword,
  findUser,
} = require("../middlewares/validation/user.validation");

//controllers
const { createUser, readUser } = require("../controllers/user.controller");

// Register
router.post("/Register", validateRegister, checkAdminLimit, createUser);

// Login
router.post("/login", validateLogin, findUser, validatePassword, readUser);

module.exports = router;
