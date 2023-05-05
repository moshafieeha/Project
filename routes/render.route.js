const express = require("express");
const router = express.Router();

// request handlers
// profile page
router.get("/profile", (req, res) => {
  const { user } = req.session;

  res.render("profilePage", { user });
});

module.exports = router;
