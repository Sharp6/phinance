var Verrichting = require('../models/verrichting.server.model');

exports.checkForDuplicates = function() {
	return new Promise(function(resolve,reject) {
		Verrichting.find({status: 'imported'}, function(err,results) {
			if(err) {
				reject(err);
			} else {
				var promises = results.map(function(verrichting) {
					return checkOneDocumentForDuplicates(verrichting);
				});
				Promise.all(promises)
					.then(function(results) {
						resolve();
					})
					.catch(function(err) {
						reject(err);
					});
			}
		});
	});
};

function checkOneDocumentForDuplicates(verrichtingToCheck) {
	return new Promise(function(resolve,reject) {
		Verrichting.find({
			bank: verrichtingToCheck.bank,
			bedrag: verrichtingToCheck.bedrag,
			datum: verrichtingToCheck.datum,
			info: verrichtingToCheck.info
		}, function(err,results) {
			if(err) {
				reject(err);
			} else {
				if(results.length > 1) {
					if(results[0].status === "imported") {
						var promises = [];
						promises.push(updateVerrichting(results[0], "notDuplicate"));
						for(var i = 1; i < results.length; i++) {
							promises.push(updateVerrichting(results[i], "duplicate"));
						}
						Promise.all(promises)
							.then(function(results) {
								resolve(results);		
							});
					} else if(results[0].status === "notDuplicate") {
						var promises = [];
						for(var i = 1; i < results.length; i++) {
							promises.push(updateVerrichting(results[i], "duplicate"));
						}
						Promise.all(promises)
							.then(function(results) {
								resolve(results);		
							});
					} else {
						reject("Weird case for duplicates.");
					}
				} else {
					updateVerrichting(results[0], "notDuplicate")
						.then(function() {
							resolve(results[0]);
						});
				}
			}
		})
	});
}

// Moet deze hier zitten? 
function updateVerrichting(verrichting, newStatus) {
	return new Promise(function(resolve,reject) {
		Verrichting.update(
			{_id: verrichting._id}, 
			{$set: {status: newStatus}}, 
			function(err) {
				if(err) {
					return reject(err);
				} else {
					resolve(verrichting);
				}
			}
		);
	});
}