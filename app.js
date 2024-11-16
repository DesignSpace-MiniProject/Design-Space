var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require("express-session");
const passport = require('passport');
const User = require('./models/users'); 
const Admin = require('./models/admin'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./models/users');
var adminsRouter = require('./models/admin');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(expressSession({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,

}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, { id: user._id, type: user.secretkey ? 'admin' : 'user' }); 
});


passport.deserializeUser(async function(serializedUser, done) {
  try {
    let user;
    if (serializedUser.type === 'admin') {
      user = await Admin.findById(serializedUser.id);
    } else {
      user = await User.findById(serializedUser.id);
    }

    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (err) {
    done(err);
  }
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter); 

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
