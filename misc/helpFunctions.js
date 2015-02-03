HelpFunctions = (function() {
	
	function getURLParameters() {
		var prmstr = window.location.search.substr(1);
		return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
	}
	
	function transformToAssocArray( prmstr ) {
		var params = {};
		var prmarr = prmstr.split("&");
		for ( var i = 0; i < prmarr.length; i++) {
			var tmparr = prmarr[i].split("=");
			params[tmparr[0]] = tmparr[1];
		}
		return params;
	}
	
	function isURLHttps(url){
		return url.substring(0,5) === "https";
	}
	
	function convertURLToHttps(url){
		return "https" + url.substring(4);
	}

	var createGUID = (function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return function() {
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		};
	})();

	//Return public functions
	return {
		getURLParameters: getURLParameters,
		createGUID: createGUID,
		isURLHttps: isURLHttps,
		convertURLToHttps: convertURLToHttps
	}
}());