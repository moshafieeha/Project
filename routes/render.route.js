const express = require("express");
const router = express.Router();
const path = require("path")

//////////////// login ////////////////
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/rendre/profile");
  }
  res.render("loginPage");
});

//////////////// register ////////////////
router.get("/register", (req, res) => {
    console.log(req.session.user)
  if (req.session.user) {
    return res.redirect("/render/profile");
  }
  res.render("registerPage");
});

//////////////// profile ////////////////
router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect(path.join("/render/login"));
  }
  res.render("profilePage", { user: req.session.user });
});

module.exports = router;
