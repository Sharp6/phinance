var Verrichting = require('../models/verrichting.server.model');

exports.getVerrichtingen = function(req,res) {
	var query = Verrichting.find();

	query.exec(function(err,results) {
		res.json(results);
	});
}