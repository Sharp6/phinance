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
		type: Schema.Types.ObjectId,
		ref: 'Categorie'
	}
});

module.exports = mongoose.model('Verrichting', verrichtingSchema);