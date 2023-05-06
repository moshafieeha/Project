const express = require("express");
const router = express.Router();

// middlewares
const {
  validateRegister,
  validateLogin,
  checkAdminLimit,
  findUser,
} = require("../middlewares/validation/user.validation");

// controllers
const { createUser, readUser } = require("../controllers/user.controller");

// request handlers
router.post("/register", validateRegister, checkAdminLimit, createUser);
router.post("/login", validateLogin, findUser, readUser);

module.exports = router;
