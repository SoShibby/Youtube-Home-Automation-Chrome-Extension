/*
	Simple web socket client for communicating with a web socket server
*/

ClientSocket = (function() {
	var mWebSocket = null;
	var mEventListeners = [];
	
	//Connect to server
	function connect(url){
		console.log("Client socket: Connecting to server");
		
		mWebSocket = new WebSocket(url);
		mWebSocket.onopen = onOpen;
		mWebSocket.onclose = onClose;
		mWebSocket.onmessage = onMessage;
		mWebSocket.onerror = onError;
	}
	
	//Close socket connection
	function close() {
		if (mWebSocket) {
			console.log('Client socket: Closing');
			mWebSocket.close();
		}
	}
	
	//Event triggered when socket is connected to server
	function onOpen() {
		console.log('Client socket: Connected');
		castEvent('onOpen', event);
	}
	
	//Event triggered when socket is disconnected
	function onClose() {
		console.log('Client socket: Connection closed');
		mWebSocket = null;
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
		mWebSocket.send(message);
	}
	
	//Send a json message to the server
	function sendJSON(json){
		var message = JSON.stringify(json);
		console.log('Client socket: Sending json message: ' + message);
		mWebSocket.send(message);
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