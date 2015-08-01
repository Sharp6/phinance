var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorieSchema = new Schema({
	naam: String,
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Categorie'
	}
});

module.exports = mongoose.model('Categorie', categorieSchema);