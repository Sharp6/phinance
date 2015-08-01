var express = require('express');
var router = express.Router();

var verrichtingController = require('../controllers/verrichting.controller');

router.get('/verrichtingen', function(req,res) {
	return verrichtingController.getVerrichtingen(req,res);
});

module.exports = router;



