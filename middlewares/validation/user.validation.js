const Joi = require("joi");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const { isMobilePhone } = require("validator");

// ---- check uniqueness of username
// ---- check uniqueness of phone


// checking phone number in the server-side
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

// Joi object to validate
const validateUser = (user) => {
  const schema = Joi.object({
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

  const { error, value } = schema.validate(user);
  if (error) {
    error.message = `Validation Error: ${error.details
      .map((detail) => detail.message)
      .join(", ")}`;
  }

  return { error, value };
};

module.exports = { validateUser };
