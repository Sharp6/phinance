var StatusDA = require('../dataAccess/status.server.da');

exports.getStatuses = function(req,res) {
	StatusDA.getStatuses()
		.then(function(results) {
			res.json(results);
		})
		.catch(function(err) {
			console.log(err);
		});
}