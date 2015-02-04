/*
	Simple web socket client for communicating with a web socket server
*/

ClientSocket = (function() {
	var ws = null;
	var mConnected = false;
	var mUrl;
	var mEventListeners = [];
	
	//Connect to server
	function connect(url){
		console.log("Client socket: Connecting to server");
		
		mUrl = url;
		ws = new WebSocket(url);
		ws.onopen = onOpen;
		ws.onclose = onClose;
		ws.onmessage = onMessage;
		ws.onerror = onError;
	}
	
	//Close socket connection
	function close() {
		if (ws) {
			console.log('CLOSING ...');
			ws.close();
		}
		mConnected = false;
	}
	
	//Event triggered when socket is connected to server
	function onOpen() {
		console.log('Client socket: Connected');
		mConnected = true;
		castEvent('onOpen', event);
	}
	
	//Event triggered when socket is disconnected
	function onClose() {
		console.log('Client socket: Connection closed');
		ws = null;
		castEvent('onClose', event);
	}
	
	//Event triggered when socket receives a message
	function onMessage(event) {
		console.log('Client socket: Message received: ' + event.data);
		castEvent('onMessage', event);
	}
	
	//Event triggered when an error occurs in the socket
	function onError(event) {
		console.log('Client socket: Error occured, messsage: ' + event.data);
		castEvent('onError', event);
	}
	
	//Send a message to the server
	function send(message) {
		console.log('Client socket: Sending message: ' + message);
		ws.send(message);
	}
	
	//Send a json message to the server
	function sendJSON(json){
		var message = JSON.stringify(json);
		console.log('Client socket: Sending json message: ' + message);
		ws.send(message);
	}
	
	//Cast event to all listeners
	function castEvent(eventName, eventValue){
		if(mEventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < mEventListeners[eventName].length; i++){
			mEventListeners[eventName][i](eventValue);
		}
	}
	
	//Add a new event listener
	function addEventListener(eventName, listener){
		console.log("addEventListener: " + eventName);
		
		if(mEventListeners[eventName] === undefined)
			mEventListeners[eventName] = [];
			
		mEventListeners[eventName].push(listener);
	}
		
	//Return public functions
	return{
		connect: connect,
		send: send,
		sendJSON: sendJSON,
		addEventListener: addEventListener
	}
}());