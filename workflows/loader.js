var filesCollector = require('../filesCollector');
var fileHandler = require('../fileHandler');
var categorizer = require('../categorizer');
var classifier = require('../classifier');

exports.load = function() {
	return filesCollector.loadFiles()
		.then(processListOfFiles)
		.then(categorizer.checkForDuplicates)
		.then(classifier.classify);
}

function processListOfFiles(fileList) {
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
