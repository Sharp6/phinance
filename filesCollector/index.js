var fileHandler = require('../fileHandler');
var fs = require('fs');
var Verrichting = require('../models/verrichting.server.model');

exports.loadFiles = function() {
	return emptyCollection()
		.then(listDataFiles)
		.then(processListOfFiles);
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

function processListOfFiles(fileList) {
	/*
	// THIS IS THE PARALLEL EXECUTION
	var promises = fileList.map(function(file) {
		console.log("Commanding processing of file " + file);
		return fileHandler.handleFile('./dataFiles/' + file);
	});
	return Promise.all(promises);
	*/

	
	// THIS IS THE SEQUENTIAL EXECUTION
	// BASED ON NODE.JS DESIGN PATTERNS, p. 96-97
	return new Promise(function(resolve,reject) {
		var promise = Promise.resolve();
		fileList.forEach(function(file) {
			promise = promise.then(function() {
				console.log("Commanding processing of file " + file);
				return fileHandler.handleFile('./dataFiles/' + file);
			});
		});
		promise.then(function() {
			resolve();
		})
		.catch(function(err) {
			reject(err);	
		});
	});
}