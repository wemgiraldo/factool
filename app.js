var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash=require('connect-flash');
const passport = require('passport');

var indexRouter = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'B3Pow3rM3rC4tUs', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// SET AUTHENTICATION with PASSPORT
require("./config/passport.js");
app.use(passport.initialize());
app.use(passport.session());

// SEND FLASH MESSAGES TO PAGE IF ANY
app.use(function(req, res, next){
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
