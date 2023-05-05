const express = require("express");
const router = express.Router();

// middlewares
const {
  validateRegister,
  validateLogin,
  checkAdminLimit,
  validatePassword,
  findUser,
} = require("../middlewares/validation/user.validation");

// controllers
const { createUser, readUser } = require("../controllers/user.controller");

// request handlers
router.post("/Register", validateRegister, checkAdminLimit, createUser);
router.post("/login", validateLogin, findUser, validatePassword, readUser);

module.exports = router;
