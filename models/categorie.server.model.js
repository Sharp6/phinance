var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorieSchema = new Schema({
	naam: String,
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Categorie'
	},
	indicatorStrings: [ String ]
});

module.exports = mongoose.model('Categorie', categorieSchema);