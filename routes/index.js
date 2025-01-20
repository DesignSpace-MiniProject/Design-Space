var express = require('express');
var router = express.Router();
const userModel = require('../models/users');
const passport = require('passport');
const adminModel = require('../models/admin');
const localstrategy = require("passport-local");
const upload = require("./multer");
const postModel = require('../models/post');
const Wishlist = require('../models/Wishlist');
const Contact = require('../models/contact');

// Passport setup for user and admin
passport.use('local', new localstrategy(userModel.authenticate()));
passport.use('admin-local', new localstrategy(adminModel.authenticate()));

// Route to render the home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Design Space' });
});

router.get('/home', function(req, res, next) {
  res.render('home');
});

// Static pages
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/wishlist', async (req, res) => {
  if (!req.user) {
      return res.redirect('/userlogin');
  }

  try {
      const wishlist = await Wishlist.find({ user: req.user._id }).populate('post');
      res.render('wishlist', { user: req.user, wishlist });
  } catch (error) {
      console.error(error);
      res.redirect('/');
  }
});

router.get('/services', function(req, res, next) {
  res.render('services');
});
router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'Design Space' });
});

router.get('/choose', function(req, res, next) {
  res.render('choose');
});
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/home'); // Redirect to home page after logout
  });
});

// Routes for user signup and login
router.get('/usersignup', function(req, res, next) {
  res.render('usersignup');
});

router.get('/userlogin', function(req, res, next) {
  res.render('userlogin');
});
router.get('/logout', (req, res) => {
  console.log("Logging out user...");
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return next(err);
    }
    console.log("User logged out successfully");
    res.redirect('/');
  });
});

// Admin routes
router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin');
});

router.get('/adminsignup', function(req, res, next) {
  res.render('adminsignup');
});

// Admin profile page with posts
router.get('/adminprofile', isAuthenticated('admin'), async function(req, res) {
  try {
    const admin = await adminModel.findById(req.user._id);
    const posts = await postModel.find({ createdBy: req.user._id });

    if (!admin) {
      return res.status(404).render('error', { message: 'Admin not found' });
    }

    const residentialPosts = posts.filter(post => post.category === 'residential');
    const commercialPosts = posts.filter(post => post.category === 'commercial');
    const conservationPosts = posts.filter(post => post.category === 'conservation');

    res.render('adminprofile', {
      admin: admin,
      residentialPosts: residentialPosts,
      commercialPosts: commercialPosts,
      conservationPosts: conservationPosts
    });
  } catch (error) {
    console.error('Error in /adminprofile:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

// Routes for posts by category
router.get('/residential', saveOriginalUrl, isLoggedIn, async (req, res) => {
  try {
    const residentialPosts = await postModel.find({ category: 'residential' });
    res.render('residential', { posts: residentialPosts,user: req.user });
  } catch (err) {
    console.error('Error fetching residential posts:', err);
    res.status(500).render('error', { message: 'Error fetching residential posts' });
  }
});

router.get('/commercial', saveOriginalUrl, isLoggedIn, async (req, res) => {
  try {
    const commercialPosts = await postModel.find({ category: 'commercial' });
    res.render('commercial', { posts: commercialPosts,user: req.user });
  } catch (err) {
    console.error('Error fetching commercial posts:', err);
    res.status(500).render('error', { message: 'Error fetching commercial posts' });
  }
});

router.get('/conservation', saveOriginalUrl, isLoggedIn, async (req, res) => {
  try {
    const conservationPosts = await postModel.find({ category: 'conservation' });
    res.render('conservation', { posts: conservationPosts,user: req.user });
  } catch (err) {
    console.error('Error fetching conservation posts:', err);
    res.status(500).render('error', { message: 'Error fetching conservation posts' });
  }
});

// Contact form submission
router.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.send('<script>alert("Contact saved successfully!"); window.location.href = "/contact";</script>');
  } catch (err) {
    res.send('<script>alert("Error saving contact: ' + err.message + '"); window.location.href = "/contact";</script>');
  }
});

// Post creation logic
router.post('/createpost', upload.single('postimage'), (req, res) => {
  const { title, description, category } = req.body;
  const postImage = req.file ? req.file.filename : null;

  if (!category || !['residential', 'commercial', 'conservation'].includes(category)) {
    return res.redirect('/adminprofile?error=Invalid category');
  }

  if (!postImage) {
    return res.redirect('/adminprofile?error=Image is required');
  }

  const newPost = new postModel({
    title,
    description,
    image: postImage,
    category,
    createdBy: req.user._id,
  });

  newPost.save()
    .then(() => {
      res.redirect('/adminprofile');
    })
    .catch((err) => {
      console.error('Error saving post:', err);
      res.status(500).render('error', { message: `Error creating post: ${err.message}` });
    });
});

// Admin login route
router.post('/adminlogin', function(req, res, next) {
  passport.authenticate('admin-local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/adminlogin');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      // Redirect to the originally requested page or /adminprofile
      const redirectTo = req.session.returnTo || '/adminprofile';
      delete req.session.returnTo;
      res.redirect(redirectTo);
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
    .then(() => {
      passport.authenticate("admin-local")(req, res, function() {
        res.redirect("/adminprofile");
      });
    })
    .catch(function(err) {
      res.redirect("/adminsignup");
    });
});

// User login route
router.post('/userlogin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/userlogin');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(req.session.returnTo);
      const redirectTo = req.session.returnTo || '/home'; // Default to /home or /residential
      delete req.session.returnTo; // Clear the saved URL from the session
      res.redirect(redirectTo); // Redirect the user to the intended page
    });
  })(req, res, next);
});
// User signup route
router.post('/usersignup', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    type: 'user'
  });

  userModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        const redirectTo = req.session.returnTo || '/home';
        delete req.session.returnTo;
        res.redirect(redirectTo);
      });
    })
    .catch(function(err) {
      res.redirect("/usersignup");
    });
});
router.get('/admin/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Fetch messages, most recent first
    res.render('adminmessages', { messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/wishlist/add', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
      const { postId } = req.body;

      // Check if the post is already in the user's wishlist
      const existingItem = await Wishlist.findOne({ user: req.user._id, post: postId });

      if (!existingItem) {
          const wishlistItem = new Wishlist({
              user: req.user._id,
              post: postId,
          });
          await wishlistItem.save();
      }

      res.json({ success: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.post('/wishlist/remove', async (req, res) => {
  const { postId } = req.body;

  if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
      // Remove the item from the wishlist collection
      const result = await Wishlist.findOneAndDelete({
          user: req.user._id,
          post: postId,
      });

      if (result) {
          res.json({ success: true, message: 'Removed from wishlist' });
      } else {
          res.status(404).json({ success: false, message: 'Item not found' });
      }
  } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Middleware to check if the user is logged in (Admin)
function isAuthenticated(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === role) {
      return next();
    }
    res.redirect(role === 'admin' ? '/adminlogin' : '/userlogin');
  };
}

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userlogin');
}

// Save the original URL for post-login redirection
function saveOriginalUrl(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    console.log(req.session.returnTo)
  }
  next();
}

module.exports = router;
