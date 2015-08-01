define(['knockout', 'models/verrichting.client.model', 'da/verrichting.client.da'], function(ko,Verrichting,verrichtingDA) {
	var verrichtingenVM = function() {
		var self = this;
		self.verrichtingen = ko.observableArray([]);
		
		self.loadVerrichtingen = function() {
			verrichtingDA.load()
				.then(function(results) {
					var mappedVerrichtingen = results.map(function(verrichting) {
						return new Verrichting(verrichting); 
					});
					self.verrichtingen(mappedVerrichtingen);	
			});
		};
		
		self.init = function() {
			self.loadVerrichtingen();
		};
	};
	
	return verrichtingenVM;
});