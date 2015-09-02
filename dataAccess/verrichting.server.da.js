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

exports.updateVerrichting = function(verrichtingData) {
	return new Promise(function(resolve,reject) {
		Verrichting.findByIdAndUpdate(
			verrichtingData.databaseId, 
			{$set: {
				'categorie': verrichtingData.categorieId,
				'status': 'categorized'
			}}, 
			function(err,updatedVerrichting) {
				if(err) {
					reject(err);
				} else {
					resolve(updatedVerrichting);
				}
			}
		);
	});
};


// THESE TWO FUNCTIONS SHOULD BE REFACTORED, COPY PASTED!!
exports.addCategorizationGuessByMachine = function(verrichtingData) {
	return new Promise(function(resolve,reject) {
		Verrichting.findByIdAndUpdate(
			verrichtingData.databaseId, 
			{$set: {
				'categorieGuessedByMachine': verrichtingData.guessedCategorie
			}}, 
			function(err,updatedVerrichting) {
				if(err) {
					reject(err);
				} else {
					resolve(updatedVerrichting);
				}
			}
		);
	});
}

// COPY PASTED THIS FUNCTION FROM ABOVE
exports.addCategorizationGuessByBusinessRule = function(verrichtingData) {
	return new Promise(function(resolve,reject) {
		Verrichting.findByIdAndUpdate(
			verrichtingData.databaseId, 
			{$set: {
				'categorieGuessedByBusinessRule': verrichtingData.guessedCategorie
			}}, 
			function(err,updatedVerrichting) {
				if(err) {
					reject(err);
				} else {
					resolve(updatedVerrichting);
				}
			}
		);
	});
}

exports.getVerrichtingen = function(queryParams) {
	return new Promise(function(resolve,reject) {
		var queryCriteria = [];
		var options = {};
		if(queryParams.beginDatum && queryParams.beginDatum !== "undefined") {
			queryCriteria.push({datum: {$gt:queryParams.beginDatum}});	
		}
		if(queryParams.eindDatum && queryParams.eindDatum !== "undefined") {
			queryCriteria.push({datum: {$lt:queryParams.eindDatum}});
		}
		if(queryParams.bank && queryParams.bank !== "undefined") {
			queryCriteria.push({bank: {$eq:queryParams.bank}});
		}
		if(queryParams.status && queryParams.status !== "undefined") {
			queryCriteria.push({status: {$eq:queryParams.status}});
		}
		if(queryParams.categorieId && queryParams.categorieId !== "undefined") {
			queryCriteria.push({categorie: queryParams.categorieId});
		}
		if(queryParams.businessRuleClassification && queryParams.businessRuleClassification !== "false") {
			queryCriteria.push({categorieGuessedByBusinessRule: {$exists:true} });
		}

		var queryObject = {};
		if(queryCriteria.length > 0) {
			queryObject.$and = queryCriteria;
		}
		
		var query = Verrichting
			.find(queryObject)

		if(queryParams.limit && queryParams.limit !== "undefined") {
			query = query.limit(queryParams.limit);
		}
		if(queryParams.skip && queryParams.skip !== "undefined") {
			query = query.skip(queryParams.skip);
		}

		query = query
			.populate('categorie')
			.sort({datum: 'desc'});

		query.exec(function(err,results) {
			if(err) {
				reject(err);
			} else {
				Verrichting.count(queryObject, function(err, count) {
					if(err) {
						reject(err);
					} else {
						var response = {};
						response.results = results;
						response.count = count;
						resolve(response);	
					}
				});
			}
		});
	});
} 

exports.getVerrichting = function(id) {
	return new Promise(function(resolve,reject) {
		Verrichting.findById(id, function(err,result) {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};