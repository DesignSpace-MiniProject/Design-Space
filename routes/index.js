var express = require('express');
var router = express.Router();
const userModel = require('../models/users');
const passport = require('passport');
const adminModel = require('../models/admin');
const localstrategy = require("passport-local");
const upload = require("./multer")




passport.use(new localstrategy(userModel.authenticate()));
passport.use('admin-local', new localstrategy(adminModel.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, { id: user._id, type: user.secretkey ? 'admin' : 'user' }); 
});

passport.deserializeUser(async function(obj, done) {
  try {
    let user;
    if (obj.type === 'admin') {
      user = await adminModel.findById(obj.id);
    } else {
      user = await userModel.findById(obj.id);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

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

router.get('/commercial', function(req, res, next) {
  res.render('commercial');
});

router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin');
});

router.get('/adminsignup', function(req, res, next) {
  res.render('adminsignup');
});

router.get('/adminprofile', isAuthenticated, function(req, res) {
  if (req.user && req.user.type === 'admin') {
    res.render('adminprofile', { user: req.user });  
  } else {
    res.redirect('/adminlogin'); 
  }
});

router.post('/createpost',isLoggedIn,upload.single("postimage") ,async function(req,res,next){
  const admin=await adminModel.findOne({
    username:req.session.passport.admin
  })
  const post =await postModel.create({
    admin:admin._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/home");
});

router.get('/show/posts/:id', async (req, res) => {
  try {
    console.log('User ID:', req.params.id);  
    const admin = await postModel.findById(req.params.id);
    console.log(admin);
    if (!admin) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    res.render('showpost', {user, nav: true });
  } catch (error) {
    console.error('Error fetching user:', error);  
    res.status(500).send('Server error');
  }
});

router.post('/adminsignup', function(req, res, next) {
  const data = new adminModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    secretkey: req.body.secretkey,
     type: 'admin'
  });

  adminModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate("admin-local")(req, res, function() {
        res.redirect("/adminprofile");
      });
    })
    .catch(function(err) {
      console.error(err);
      res.redirect("/adminsignup");
    });
});

router.get('/add',isLoggedIn,async function(req,res,next){
  const admin=await adminModel.findOne({
    username:req.session.passport.admin
  })
  res.render("add",{admin}); 
});

router.post('/adminlogin', function(req, res, next) {
  passport.authenticate('admin-local', function(err, user, info) {
    if (err) {
      console.error('Error during admin login:', err);
      return next(err);
    }
    if (!user) {
      console.log('Admin authentication failed:', info);
      return res.redirect('/adminlogin');
    }
    req.logIn(user, function(err) {
      if (err) {
        console.error('Error during login:', err);
        return next(err);
      }
      console.log('Admin successfully logged in:', user);
      console.log('Session after login:', req.session); 
       res.redirect('/adminprofile');
    });
  })(req, res, next);
});




router.post('/usersignup', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
  });
  
  userModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      });
    });
});

router.post('/userlogin', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/home",
}));

function isAuthenticated(req, res, next) {
  console.log("Is Authenticated:", req.isAuthenticated());
  if (req.isAuthenticated()) {
  
    return next();
  }
  console.log("Redirecting to admin login");
  res.redirect('/adminlogin'); 
}
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}


module.exports = router;
