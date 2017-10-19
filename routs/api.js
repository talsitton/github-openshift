var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

//var db = mongojs('mongodb://jangode:321321321@ds141232.mlab.com:41232/aspa-sandbox', ['users']);
var User = require('../models/user');

// web client redirection support (for now not supporting web client implementation...)
router.get('/',         function(req, res){  console.log('users test');  });
router.get('/register', function(req, res){ 	res.render('register');    });
router.get('/login',    function(req, res){ 	res.render('login');       });


// Session init
//------------------------------------------------------------------------------
router.post('/sessioninit',
  function(req, res)
  {
  	if(req.body.userToken && req.body.userToken != "")

    User.getUserByUsername(req.body.username, function(err, user){
    	if(err) throw err;
    	if(!user){    res.json({ message: 'Unknown User'});	return;  }
    	User.comparePassword(req.body.password, user.password, function(err, isMatch){
    		if(err) throw err;
    		isMatch ?  res.json({data:user}) :res.json({message: 'Invalid password'});
      });
    });
  });

// Register new User
//------------------------------------------------------------------------------
router.post('/register',
 function(req, res)  {
  	// Validation
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('email', 'Email is required').notEmpty();
  	req.checkBody('email', 'Email is not valid').isEmail();
  	req.checkBody('password', 'Password is required').notEmpty();
  	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  	var errors = req.validationErrors();
  	if(errors){	 res.json({	formErrors:errors	}); return;}

    User.getUserByUsername(req.body.username, function(err, user){
    	if(err) throw err;
    	if(user){  res.json({ errorMsg: 'user with username is already exist'});	return;  }
      var newUser = new User({username: req.body.username, email:req.body.email, password: req.body.password });
  	   User.createUser(newUser, function(err, user){
              if(err)  throw err;
              res.json({ activationUrl: user._id });
       });
     });
  });

// Login existing User
//------------------------------------------------------------------------------
router.post('/login',
  function(req, res)
  {
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){	res.json({	formErrors:errors	});	return;}

    User.getUserByUsername(req.body.username, function(err, user){
    	if(err) throw err;
    	if(!user){    res.json({ errorMsg: 'Unknown User'});	return;  }
    	User.comparePassword(req.body.password, user.password, function(err, isMatch){
    		if(err) throw err;
    		isMatch ?  res.json(user) :res.json({errorMsg: 'Invalid password'});
      });
    });
  });

router.post('/user/update', function(req,res){
    User.updateUser(req.body, function(err, results){
      console.log("results = " + results);
      if(err) throw err;
      res.json({status:0});
    });
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/api/login');
});

module.exports = router;
