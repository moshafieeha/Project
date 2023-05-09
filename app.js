const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose")
const session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/blog')
.then(()=> console.log('Database is Up!'))

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 120000 // 2 minutes
  }
}));


// main router
app.use('/', indexRouter);


// Global error handler middleware
app.use((err, req, res, next) => {
  // Set the status code and default error message
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log the error to the console for debugging purposes
  console.error(`[${req.method} ${req.url}] Error:`, err);

  // Send the JSON response
  res.status(statusCode).json({ error: message });
});


module.exports = app;
