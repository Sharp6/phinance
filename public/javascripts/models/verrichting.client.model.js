define(['knockout', 'moment', 'da/verrichting.client.da'], function(ko, moment, verrichtingDA) {
	var verrichtingModel = function(data) {
		var self = this;

		var parsedDate = moment.utc(data.datum);
		parsedDate.local();
		
		self.bedrag = ko.observable(data.bedrag);
		self.datum = ko.observable(parsedDate.format("DD/MM/YYYY"));
		self.bank = ko.observable(data.bank);
		self.info = ko.observable(data.info);
		self.status = ko.observable(data.status);
		self.databaseId = ko.observable(data._id);
		self.guessedCategorie = ko.observable(data.guessedCategorie);

		self.saveEnabled = ko.computed(function() {
			return self.status() === "notDuplicate" || self.status() === "categorized";
		});

		self.categorie = ko.observable();
		if(data.categorie) {
			self.categorie(data.categorie.naam);	
		} else {
			//self.categorie("Geen categorie");
		}

		self.save = function() {
			verrichtingDA.save(self.databaseId(),ko.toJSON(self));
		}

		self.notify = function() {
			console.log(ko.toJSON(self));
		};
	};

	
	return verrichtingModel;
});