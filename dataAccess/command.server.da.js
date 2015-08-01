var mongoose = require('mongoose');
var Command = require('../models/command.server.model');

exports.saveCommand = function(commandData) {
	return new Promise(function(resolve,reject) {
		var command = new Command({
			commandType: commandData.commandType,
			file: commandData.filename
		});
		command.save(function (err) {
		  if (err) {
		  	console.log(err);
		  } else {
		  	console.log("Succesfully saved command '" + command.commandType + "' for file '" + command.file + "'.");
		  	resolve();
		  }
		});
	});
}

exports.searchCommand = function(commandData) {
	return new Promise(function(resolve,reject) {
		Command.find({ commandType: commandData.commandType, file: commandData.filename }, function(err, commands) {
			if(err) {
				reject(err);
			} else {
				resolve(commands);
			}
		});
	});
}