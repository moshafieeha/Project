const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const renderRoute = require('./render.route')

// divide the routes
router.use("/auth",authRoute)
router.use("/user", userRoute)
router.use("/render", renderRoute)


module.exports = router;
