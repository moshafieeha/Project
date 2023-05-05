const Joi = require("joi");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const { isMobilePhone } = require("validator");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

// ---- check uniqueness of username
// ---- check uniqueness of phone

// check the phone number in the server-side
const joiPhoneNumber = Joi.extend((joi) => {
  return {
    type: "phoneNumber",
    base: joi.array(),
    messages: {
      "phoneNumber.invalid":
        "provide valid phoneNumber and at least one phoneNumber",
      "phoneNumber.duplicate": "phone numbers should be unique",
    },
    // responsible for formatting and transforming the input before applying the rules
    coerce: (value, helpers) => {
      if (!Array.isArray(value)) {
        value = [value];
      }

      const formattedPhoneNumbers = value.map((phone) => {
        if (phone.startsWith("0")) return `+98${phone.slice(1)}`;
        return phone;
      });

      return { value: formattedPhoneNumbers };
    },
    validate: (value, helpers) => {
      if (!value.length) {
        return { value, errors: helpers.error("phoneNumber.invalid") };
      }

      const uniquePhoneNumbers = new Set(value);
      if (uniquePhoneNumbers.size !== value.length) {
        return { value, errors: helpers.error("phoneNumber.duplicate") };
      }

      for (const phone of value) {
        if (!isMobilePhone(phone, "ir-IR")) {
          return { value, errors: helpers.error("phoneNumber.invalid") };
        }
      }

      return { value };
    },
  };
});
// Middleware to validate registeration (Joi object)
const validateRegister = (req, res, next) => {
  const registeSchema = Joi.object({
    fName: Joi.string().min(3).max(30).required().trim(),
    lName: Joi.string().min(3).max(30).required().trim(),
    username: Joi.string().min(3).max(30).required().trim(),
    password: Joi.string()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .required(),
    gender: Joi.string().valid("male", "female", "not-set"),
    role: Joi.string().valid("blogger", "admin").lowercase().trim(),
    phone: joiPhoneNumber.phoneNumber().required(),
  });

  const { error, value } = registeSchema.validate(req.body);
  if (error) return next(createError(500, error.message));

  // If validation passes, store the validated user data in the request object
  req.validatedUser = value;

  next();
};
// Middleware to check the limit of admins
const checkAdminLimit = async (req, res, next) => {
  try {
    const { role } = req.validatedUser;
    if (role !== "admin") {
      // Only restrict registration for admin role
      next();
      return;
    }

    const adminCount = await User.countDocuments({ role: "admin" });
    const maxAdmins = 1;

    if (adminCount >= maxAdmins) {
      return res.status(400).json({
        message: `The maximum number of admins (${maxAdmins}) has been reached.`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
// Middleware to validate update (Joi object)
const validateUpdate = (req, res, next) => {
  const updateSchema = Joi.object({
    fName: Joi.string().min(3).max(30).optional().trim(),
    lName: Joi.string().min(3).max(30).optional().trim(),
    username: Joi.string().min(3).max(30).optional().trim(),
    password: Joi.string()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .optional(),
    gender: Joi.string().valid("male", "female", "not-set").optional(),
    role: Joi.string().valid("blogger", "admin").lowercase().trim().optional(),
    phone: joiPhoneNumber.phoneNumber().optional(),
  });
  
  const { error, value } = updateSchema.validate(req.body);
  if (error) return next(createError(500, error.message));
  
  // If validation passes, merge the new values with existing ones, without overwriting any existing properties.
  req.validatedUser = Object.assign({}, req.validatedUser, value);

  next();
};
// Middleware to validate login (Joi object)
const validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().trim(),
    password: Joi.string().required(),
  });

  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return next(
      createError(
        400,
        `Validation Error: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`
      )
    );
  }

  req.validatedLoginData = value;
  next();
};
// Middleware to validate the password
const validatePassword = async (req, res, next) => {
  const { password } = req.body;

  try {
    const isValidPassword = await bcrypt.compare(
      password,
      req.foundUser.password
    );
    if (!isValidPassword) {
      return next(createError(400, "Invalid password"));
    }

    next();
  } catch (err) {
    return next(createError(500, err.message));
  }
};
// Middleware to find the user in the database
const findUser = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(400, "Invalid username"));
    }

    req.foundUser = user;
    next();
  } catch (err) {
    return next(createError(500, err.message));
  }
};

module.exports = {
  validateRegister,
  validateUpdate,
  validateLogin,
  checkAdminLimit,
  validatePassword,
  findUser,
};
