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
router.get('/choose', function(req, res, next) {
  res.render('choose');
});
router.get('/usersignup', function(req, res, next) {
  res.render('usersignup');
});
router.get('/userlogin', function(req, res, next) {
  res.render('login');
});
router.get('/portfolio', function(req, res, next) {
  res.render('portfolio');
});
router.post('/usersignup',function(req,res,next){
  const data = new userModel({
    username:req.body.username,
    email:req.body.email,
    contact :req.body.contact,
  
  })
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/home");
    })
  })
  });

  router.post('/userlogin',passport.authenticate("local",{
    failureRedirect:"/",
    successRedirect:"/home",
    }));

module.exports = router;

