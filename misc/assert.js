Assert = (function() {
	function isBoolean(variable, messageOnError){
		if(!(typeof variable == "boolean")){
			throw new Error(messageOnError);
		}
	}
	
	//Return public functions
	return {
		isBoolean: isBoolean
	};
}());