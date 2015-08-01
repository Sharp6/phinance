var express = require('express');
var router = express.Router();

var fc = require('../filesCollector');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/verrichtingen', function(req,res) {
	res.render('verrichtingen');
});

router.get('/loadVerrichtingen', function(req,res) {
	fc.loadFiles()
		.then(function() {
			res.render('verrichtingen');
		})
		.catch(function(error) {
			console.log("This error: " + error + " at stack " + error.stack);
		});
});

module.exports = router;
