var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bankSchema = new Schema({
	naam: String,
});

module.exports = mongoose.model('Bank', bankSchema);