var express = require('express');
var router = express.Router();
const userModel = require('../models/users');
const passport = require('passport');
const adminModel = require('../models/admin');
const localstrategy = require("passport-local");
const upload = require("./multer");
const postModel = require('../models/post');

// Passport setup for user and admin
passport.use(new localstrategy(userModel.authenticate()));
passport.use('admin-local', new localstrategy(adminModel.authenticate()));



// Route to render the home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Design Space' });
});
router.get('/home', function(req, res, next) {
  res.render('home');
});
router.get('/choose', function(req, res, next) {
  res.render('choose');
});

// Routes for user signup and login
router.get('/usersignup', function(req, res, next) {
  res.render('usersignup');
});

router.get('/userlogin', function(req, res, next) {
  res.render('login');
});

// Admin routes
router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin');
});

router.get('/adminsignup', function(req, res, next) {
  res.render('adminsignup');
});

// Admin profile page with posts
router.get('/adminprofile', isAuthenticated, async function(req, res) {
  try {
    if (req.user && req.user.type === 'admin') {
      const admin = await adminModel.findById(req.user._id);
      const posts = await postModel.find({createdBy:req.user._id});
      console.log(admin);
      if (!admin) {
        return res.status(404).send('Admin not found');
      }

      // Filter posts by category
      const residentialPosts = posts.filter(post => post.category === 'residential');
      const commercialPosts = posts.filter(post => post.category === 'commercial');
      const conservationPosts = posts.filter(post => post.category === 'conservation');

      // Debugging: Check the contents of the posts
      console.log('Residential Posts:', residentialPosts);
      console.log('Commercial Posts:', commercialPosts);
      console.log('Conservation Posts:', conservationPosts);

      res.render('adminprofile', { 
        admin: admin,
      residentialPosts: residentialPosts,
     commercialPosts: commercialPosts,
      conservationPosts: conservationPosts
      });
    } else {
      res.redirect('/adminlogin');
    }
  } catch (error) {
    console.error('Error in /adminprofile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for creating a post
router.post('/createpost', upload.single('postimage'), (req, res) => {
  console.log("Form Data:", req.body); // Log the form data
  console.log("Uploaded File:", req.file); // Log the uploaded file

  const { title, description, category } = req.body;
  const postImage = req.file ? req.file.filename : null;

  // Validate the category and file
  if (!category || !['residential', 'commercial', 'conservation'].includes(category)) {
    return res.redirect('/adminprofile?error=Invalid category');
  }

  if (!postImage) {
    return res.redirect('/adminprofile?error=Image is required');
  } 

  // Create a new post object
  const newPost = new postModel({
    title,
    description,
    image: postImage,
    category,
    createdBy:req.user._id,
  });

  console.log("New Post Object:", newPost); // Log the post object before saving

  // Save the post
  newPost.save()
    .then(() => {
      res.redirect('/adminprofile');
    })
    .catch((err) => {
      console.error('Error saving post:', err); // Log the error
      res.status(500).send(`Error creating post: ${err.message}`);
    });
});




// Admin login route
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
      res.redirect('/adminprofile');
    });
  })(req, res, next);
});

// Admin signup route
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

// Middleware to check if the user is logged in (Admin)
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/adminlogin');
}

// Middleware to check if the user is logged in (Any user)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;
