var natural = require('natural');
var verrichtingDA = require('../dataAccess/verrichting.server.da')
var classifier = new natural.BayesClassifier();

exports.classify = function() {
	return verrichtingDA.getVerrichtingen({status:'categorized'})
		.then(function(response) {
			response.results.forEach(function(verrichting) {
				classifier.addDocument(verrichting.info, verrichting.categorie.naam);
			});
			classifier.train();
			return;
		})
		.then(function(){
			return verrichtingDA.getVerrichtingen({})
		})
		.then(function(response) {
			var promises = []
			response.results.forEach(function(verrichting) {
				var attempt = classifier.classify(verrichting.info);
				promises.push(verrichtingDA.addCategorizationGuess({
					databaseId: verrichting._id,
					guessedCategorie: attempt
				}));
			});
			return Promise.all(promises);
		});
}