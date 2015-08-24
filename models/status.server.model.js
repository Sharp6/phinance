var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statusSchema = new Schema({
	naam: String,
});

module.exports = mongoose.model('Status', statusSchema);