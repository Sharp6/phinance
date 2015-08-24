var mongoose = require('mongoose');
var Status = require('../models/status.server.model');

exports.getStatuses = function() {
	return new Promise(function(resolve,reject) {
		var query = Status
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