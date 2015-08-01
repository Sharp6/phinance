var mongoose = require('mongoose');
var Verrichting = require('../models/verrichting.server.model');

exports.saveVerrichting = function(verrichtingData) {
	return new Promise(function(resolve,reject) {
		var verrichting = new Verrichting({ 
			bedrag: verrichtingData.bedrag,
			datum: verrichtingData.datumObject,
			info: verrichtingData.info,
			bank: verrichtingData.bank,
			status: 'imported'
		});

		verrichting.save(function (err) {
		  if (err) {
		  	reject(err);
		  } else {
		  	resolve();
		  }
		});
	});
}