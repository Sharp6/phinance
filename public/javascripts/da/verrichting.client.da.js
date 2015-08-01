define(['jquery'], function($){
	"use strict";
	
	var loadVerrichtingServer = function() {
		// FIX THIS ... 
		return $.getJSON("/api/verrichtingen").promise();
	};
	
	return {
		//save : saveIngredientServer,
		load : loadVerrichtingServer
		//remove: removeIngredientServer
	};
});