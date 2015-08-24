var mongoose = require('mongoose');
var Bank = require('../models/bank.server.model');

exports.getBanken = function() {
	return new Promise(function(resolve,reject) {
		var query = Bank
			.find();

		query.exec(function(err,results) {
			if(err) {
				reject(err);
			} else {
				resolve(results);	
			}
		});
	});
}