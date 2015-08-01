var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commandSchema = new Schema({
	commandType: String,
	file: String, 
	timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Command', commandSchema);