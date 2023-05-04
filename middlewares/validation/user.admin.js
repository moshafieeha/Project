const User = require("../../models/user.model");

async function checkAdminLimit(req, res, next) {
  try {
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
}

module.exports = {checkAdminLimit};
