define(['knockout', 'models/verrichting.client.model', 'da/verrichting.client.da', 'da/misc.client.da'], function(ko,Verrichting,verrichtingDA,miscDA) {
	var verrichtingenVM = function() {
		var self = this;
		self.verrichtingen = ko.observableArray([]);
		self.banken = ko.observableArray([]);

		self.bankFilter = ko.observable('');
		self.beginDatum = ko.observable('');
		self.eindDatum = ko.observable('');
		
		self.loadVerrichtingen = function() {
			verrichtingDA.load()
				.then(function(results) {
					var mappedVerrichtingen = results.map(function(verrichting) {
						return new Verrichting(verrichting); 
					});
					self.verrichtingen(mappedVerrichtingen);	
			});
		};

		self.loadBanken = function() {
			miscDA.loadBanken()
				.then(function(results) {
					var mappedBanken = results.map(function(bank) {
						return bank.naam;
					});
					self.banken(mappedBanken);
				});
		}

		self.filterVerrichtingen = function() {
			// This function is very much like loadVerrichtingen. Should be refactored?
			var query = {
				beginDatum: self.beginDatum,
				eindDatum: self.eindDatum,
				bank: self.bankFilter 
			};
			verrichtingDA.loadWithFilter(query)
				.then(function(results) {
					var mappedVerrichtingen = results.map(function(verrichting) {
						return new Verrichting(verrichting);
					});
					self.verrichtingen(mappedVerrichtingen);
				});
		};
		
		self.init = function() {
			self.loadVerrichtingen();
			self.loadBanken();
		};
	};
	
	return verrichtingenVM;
});