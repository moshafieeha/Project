const express = require('express');
const router = express.Router();
const authRoute = require('./auth.router')
// const renderRoute = require('./render.router')
// const userRoute = require('./user.router')

// divide the routes
router.use("/auth",authRoute)
// router.use("/render", renderRoute)
// router.use("/user", userRoute)

module.exports = router;
