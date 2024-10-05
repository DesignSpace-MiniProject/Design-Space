var express = require('express');
var router = express.Router();
const userModel =require("./users");
const passport = require('passport');
const localstrategy=require("passport-local")

/* GET home page. */
passport.use(new localstrategy(userModel.authenticate()));
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res, next) {
  res.render('home');
});

module.exports = router;

