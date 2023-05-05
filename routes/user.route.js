const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// middlewares
const {
  validateUpdate,
  checkAdminLimit,
} = require("../middlewares/validation/user.validation");

// controllers
const { updateUser, deleteUser } = require("../controllers/user.controller");

// request handlers
router.put("/update", validateUpdate, checkAdminLimit, updateUser);
router.delete("/delete", deleteUser);

module.exports = router;
