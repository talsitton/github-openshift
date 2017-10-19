var express = require('express');
var router  = express.Router();
var fs      = require('fs');

var htmlFile = fs.readFileSync('./routs/index.html', "utf8");

/* GET home page. */
router.get('/', function(req, res, next) {  res.send(htmlFile); });

module.exports = router;
