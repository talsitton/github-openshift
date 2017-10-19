var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/',  function(req, res){
	req.isAuthenticated()?	res.render('index'): res.redirect('/api/login');
});

module.exports = router;
