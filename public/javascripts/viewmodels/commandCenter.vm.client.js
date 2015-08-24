define(['knockout', "jquery"], function(ko, $) {
	var commandCenterVM = function() {
		var self = this;

		self.doWorkflowLoad = function() {
			$.ajax({
				dataType: "json",
				url: "/workflowLoad"
			}).promise()
			.then(function(jsonResponse) {
				$("#serverResponse").html(jsonResponse);
			});
		}

		self.init = function() {
			return;
		};

	};

	return commandCenterVM;
});
