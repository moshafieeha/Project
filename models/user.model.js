const mongoose = require("mongoose");
const { isMobilePhone } = require("validator");
const bcrypt = require("bcrypt");

// user shema
const UserSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true, "firstname is required"],
    minlength: [3, "firstname must be equal or more than 3 characters"],
    maxlength: [30, "firstname must be equal or less than 30 characters"],
    trim: true,
  },
  lName: {
    type: String,
    required: [true, "lastname is required"],
    minlength: [3, "lastname must be equal or more than 3 characters"],
    maxlength: [30, "lastname must be equal or less than 30 characters"],
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
      },
    },
  },
  gender: {
    type: String,
    enum: {
      values: ["not-set", "male", "female"],
      message: "invalid gender ({VALUE}): gender is eather male or female",
    },
    default: "not-set",
    trim: true,
    lowercase: true,
  },
  phone: {
    type: [String],
    unique: true,
    validate: {
      validator: (value) => {
        if (!value.length) return false;

        for (const phone of value) {
          if (!isMobilePhone(phone, "ir-IR")) return false;
        }

        return true;
      },
      message: "provide valid phoneNumber and at least one phoneNumber",
    },
    set: (value) => {
      const formattedPhoneNumbers = value.map((phone) => {
        if (phone.startsWith("0")) return `+98${phone.slice(1)}`;

        return phone;
      });

      return formattedPhoneNumbers;
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "blogger"],
      message: "invalid role ({VALUE}): role is eather blogger or admin",
    },
    default: "blogger",
    lowercase: true,
    trim: true,
  },
});

// hash the password
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// compare the password
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
