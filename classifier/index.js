var natural = require('natural');
var verrichtingDA = require('../dataAccess/verrichting.server.da');
var categorieDA = require('../dataAccess/categorie.server.da');

var classifier = new natural.BayesClassifier();


exports.classify = function() {
	return verrichtingDA.getVerrichtingen({status:'categorized'})
		.then(trainMachineClassifier) 
		.then(function(){
			return verrichtingDA.getVerrichtingen({});
		})
		.then(performClassifications);
}

function trainMachineClassifier(classifiedVerrichtingen) {
	classifiedVerrichtingen.results.forEach(function(verrichting) {
		classifier.addDocument(verrichting.info, verrichting.categorie.naam);
	});
	classifier.train();
	return;
}

function loadBusinessRules() {
	var businessRules = {};
	
	return categorieDA.getCategorieen()
		.then(function(categorieen) {
			categorieen.forEach(function(categorie) {

				if(categorie.indicatorStrings.length > 0) {
					
					categorie.indicatorStrings.forEach(function(aString) {
						// add strings to businessRules object 
						businessRules[aString] = categorie.naam;
					});
				}
			});
			return businessRules;
		});
}

function performClassifications(verrichtingen) {

	var promises = [];


	
	promises.push(classifyByMachine(verrichtingen));
	promises.push(classifyByBusinessRules(verrichtingen));



	return Promise.all(promises);
}

function classifyByMachine(verrichtingen) {
	var promises = [];
	verrichtingen.results.forEach(function(verrichting) {
		var attempt = classifier.classify(verrichting.info);
		promises.push(verrichtingDA.addCategorizationGuessByMachine({
			databaseId: verrichting._id,
			guessedCategorie: attempt
		}));
	});
	return Promise.all(promises);
}

function classifyByBusinessRules(verrichtingen) {

	return loadBusinessRules().then(function(businessRules) {
		var promises = [];
		verrichtingen.results.forEach(function(verrichting) {
			var attempt = applyBusinessRules(verrichting, businessRules) || null;
			if(attempt) {
				promises.push(verrichtingDA.addCategorizationGuessByBusinessRule({
					databaseId: verrichting._id,
					guessedCategorie: attempt
				}));
			}
		});
		return Promise.all(promises);
	});
	/*
	return new Promise(function(resolve,reject) {

		// addCategorizationGuessByBusinessRule
		resolve();
	});
	*/
}

function applyBusinessRules(verrichting, businessRules) {

	for(aString in businessRules) {
		if(verrichting.info.indexOf(aString) !== -1) {
			return businessRules[aString];
		}
	}
	return null;
}