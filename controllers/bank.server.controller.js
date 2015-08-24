var BankDA = require('../dataAccess/bank.server.da');

exports.getBanken = function(req,res) {
	BankDA.getBanken()
		.then(function(results) {
			res.json(results);
		})
		.catch(function(err) {
			console.log(err);
		});
}