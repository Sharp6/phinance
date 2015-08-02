var VerrichtingDA = require('../dataAccess/verrichting.server.da');
var moment = require('moment');

exports.getVerrichtingen = function(req,res) {
	var beginDatumString = req.query.beginDatum || "18/04/1983";
	var beginDatumMoment = moment(beginDatumString, "DD/MM/YYYY");

	var eindDatumString = req.query.eindDatum || "31/12/2019"; // Let's create our own Y2020 bug
	var eindDatumMoment = moment(eindDatumString, "DD/MM/YYYY");

	VerrichtingDA.getVerrichtingen({beginDatum: beginDatumMoment, eindDatum: eindDatumMoment, bank: req.query.bank})
		.then(function(results) {
			res.json(results);
		})
		.catch(function(err) {
			console.log(err);
		});
}