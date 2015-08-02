var express = require('express');
var router = express.Router();

var verrichtingController = require('../controllers/verrichting.controller');
var bankController = require('../controllers/bank.server.controller');

router.get('/verrichtingen', function(req,res) {
	return verrichtingController.getVerrichtingen(req,res);
});

router.get('/banken', function(req,res) {
	return bankController.getBanken(req,res);
})

module.exports = router;



