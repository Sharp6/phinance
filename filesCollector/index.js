var fileHandler = require('../fileHandler');
var fs = require('fs');
var Verrichting = require('../models/verrichting.server.model');

exports.loadFiles = function() {
//	return emptyCollection()
	return listDataFiles();
}

function emptyCollection() {
	return new Promise(function(resolve,reject) {
		Verrichting.remove(function(err) {
			if(err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

function listDataFiles() {
	return new Promise(function(resolve,reject) {
		fs.readdir('./dataFiles', function(err, data) {
			if(err) {
				reject(err);
			} else {
				var selectedFiles = data.filter(function(filename) {
					if(filename.indexOf('belfius') !== -1 || filename.indexOf('argenta') !== -1 || filename.indexOf('kbc') !== -1) {
						return true;
					}	
				});
				console.log("Files to process: " + selectedFiles);
				resolve(selectedFiles);
			}
		});	
	});
}

