define(['knockout', 'moment'], function(ko, moment) {
	var verrichtingModel = function(data) {
		var self = this;
		
		self.bedrag = ko.observable(data.bedrag);
		var parsedDate = moment.utc(data.datum);
		parsedDate.local();
		self.datum = ko.observable(parsedDate.format());
		self.bank = ko.observable(data.bank);
		self.info = ko.observable(data.info);
		self.databaseId = ko.observable(data._id);
	};
	
	return verrichtingModel;
});