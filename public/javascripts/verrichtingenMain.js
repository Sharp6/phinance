require.config({
	paths: {
		jquery: '/libraries/jquery-2.1.3.min',
		knockout: '/libraries/knockout-3.3.0',
		bootstrap: '/libraries/bootstrap.min',
		moment: '/libraries/moment-with-locales.min'
	}
});

require(["knockout", "viewmodels/verrichtingen.client.vm"], function(ko, VerrichtingenVM) {
	var verrichtingenVm = new VerrichtingenVM();
	verrichtingenVm.init();
	ko.applyBindings(verrichtingenVm);
});