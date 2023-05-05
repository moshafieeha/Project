const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route')
// const renderRoute = require('./render.route')
const userRoute = require('./user.route')

// divide the routes
router.use("/auth",authRoute)
// router.use("/render", renderRoute)
router.use("/user", userRoute)

module.exports = router;
