var mongoose = require('mongoose');
var Categorie = require('../models/categorie.server.model');

exports.getCategorieen = function() {
	return new Promise(function(resolve,reject) {
		var query = Categorie
			.find()
			.populate('parent')
			.sort({naam:'asc'});

		query.exec(function(err,results) {
			if(err) {
				reject(err);
			} else {
				resolve(results);	
			}
		});
	});
}

exports.findCategorieByName = function(categorieNaam) {
	return new Promise(function(resolve,reject) {
		var query = Categorie
			.findOne({naam: categorieNaam});

		query.exec(function(err,results) {
			if(err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}