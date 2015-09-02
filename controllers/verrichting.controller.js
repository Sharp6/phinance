var VerrichtingDA = require('../dataAccess/verrichting.server.da');
var CategorieDA = require('../dataAccess/categorie.server.da');
var moment = require('moment');

exports.getVerrichtingen = function(req,res) {
	var beginDatumString = req.query.beginDatum || "18/04/1983";
	var beginDatumMoment = moment(beginDatumString, "DD/MM/YYYY");

	var eindDatumString = req.query.eindDatum || "31/12/2019"; // Let's create our own Y2020 bug
	var eindDatumMoment = moment(eindDatumString, "DD/MM/YYYY");

	findCategorieId(req.query.categorie)
		.then(function(categorieId) {
			return VerrichtingDA.getVerrichtingen({
				beginDatum: beginDatumMoment, 
				eindDatum: eindDatumMoment, 
				bank: req.query.bank, 
				status: req.query.status, 
				categorieId: categorieId,
				limit: req.query.limit,
				skip: req.query.skip,
				businessRuleClassification: req.query.businessRuleClassification
			});		
		})
		.then(function(response) {
			res.json(response);
		})
		.catch(function(err) {
			console.log("Here: " + err.stack);
		});
}

exports.getVerrichting = function(req,res) {
	VerrichtingDA.getVerrichting(req.params.id)
		.then(function(verrichting) {
			res.json(verrichting);
		})
		.catch(function(err) {
			console.log(err);
		});	
}

exports.updateVerrichting = function(req,res) {
	var verrichtingData = JSON.parse(req.body.verrichting);
	findCategorieId(verrichtingData.categorie)
		.then(function(categorieId) {
			verrichtingData.categorieId = categorieId;
			return VerrichtingDA.updateVerrichting(verrichtingData);		
		})
		.then(function(updateVerrichting) {
			res.json(updateVerrichting);		
		})
		.catch(function(err) {
			res.json(err);
		});
}

function findCategorieId(categorieNaam) {
	return new Promise(function(resolve,reject) {
		if(categorieNaam && categorieNaam !== "undefined") {
			CategorieDA.findCategorieByName(categorieNaam)
				.then(function(categorie) {
					resolve(categorie._id);
				})
				.catch(function(err) {
					reject(err);
				})
		} else {
			//resolve("undefined");
			resolve();
		}
	});
}

