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

exports.getVerrichtingen = function(queryParams) {
	return new Promise(function(resolve,reject) {
		var queryCriteria = [];
		queryCriteria.push({datum: {$gt:queryParams.beginDatum}});
		queryCriteria.push({datum: {$lt:queryParams.eindDatum}});
		console.log(queryParams.bank);
		if(queryParams.bank && queryParams.bank !== "undefined") {
			console.log("add QC based on bank " + queryParams.bank);
			queryCriteria.push({bank: {$eq:queryParams.bank}});
		}
		
		var query = Verrichting
			.find({$and: queryCriteria})
			//.find({$and: [{datum: {$gt:queryParams.beginDatum}},{datum: {$lt:queryParams.eindDatum}}]})
			.sort({datum: 'desc'});

		query.exec(function(err,results) {
			if(err) {
				reject(err);
			} else {
				resolve(results);	
			}
		});
	});
} 