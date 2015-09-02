var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var verrichtingSchema = new Schema({
	bedrag: Number, 
	datum: Date,
	info: String,
	bank: String,
	rekeningTegenpartij: String,
	status: String,
	categorie: {
		type: String,
		ref: 'Categorie'
	},
	categorieGuessedByMachine: String,
	categorieGuessedByBusinessRule: String
});

module.exports = mongoose.model('Verrichting', verrichtingSchema);