var CategorieDA = require('../dataAccess/categorie.server.da');

exports.getCategorieen = function(req,res) {
	CategorieDA.getCategorieen()
		.then(function(results) {
			res.json(results);
		})
		.catch(function(err) {
			console.log(err);
		});
}