var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res, next) {
  res.render('home');
});
/*user and admin login page*/
router.get('/user',function(req,res,next){
  res.render('usersignup');
})
router.get('/login',function(req,res,next){
  res.render('login')
})
module.exports = router;

