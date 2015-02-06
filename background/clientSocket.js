/**
 * A simple web socket client wrapper used for communicating with a web socket server
 */
ClientSocket = (function() {
	var mWebSocket = null;
	var mEventListeners = [];
	
	/**
	 * Connect to a web socket server with a given url
	 *
	 * @param url  the URL of the web socket server
	 */
	function connect(url){
		console.log("Client socket: Connecting to server");
		
		mWebSocket = new WebSocket(url);
		mWebSocket.onopen = onOpen;
		mWebSocket.onclose = onClose;
		mWebSocket.onmessage = onMessage;
		mWebSocket.onerror = onError;
	}
	
	/**
	 * Close the connection to the server
	 */
	function close() {
		if (mWebSocket) {
			console.log('Client socket: Closing');
			mWebSocket.close();
		}
	}
	
	/**
	 * Event that is triggered when the connection to the server is established
	 */
	function onOpen() {
		console.log('Client socket: Connected');
		castEvent('onOpen', event);
	}
	
	/**
	 * Event that is triggered when the connection to the server is closed
	 */
	function onClose() {
		console.log('Client socket: Connection closed');
		mWebSocket = null;
		castEvent('onClose', event);
	}
	
	/**
	 * Event that is triggered when a message is received from the server
	 *
	 * @param event  the event that contains the received message
	 */
	function onMessage(event) {
		console.log('Client socket: Message received: ' + event.data);
		castEvent('onMessage', event);
	}
	
	/**
	 * Event that is triggered when an error occurs in the socket
	 *
	 * @param event  the event that contains the error
	 */
	function onError(event) {
		console.log('Client socket: Error occured, messsage: ' + event.data);
		castEvent('onError', event);
	}
	
	/**
	 * Send a string message to the server
	 *
	 * @param message  the message that is to be sent
	 */
	function send(message) {
		console.log('Client socket: Sending message: ' + message);
		mWebSocket.send(message);
	}
	
	/**
	 * Send a JSON object to the server
	 *
	 * @param json  the JSON object that is to be sent
	 */
	function sendJSON(json){
		var message = JSON.stringify(json);
		console.log('Client socket: Sending json message: ' + message);
		mWebSocket.send(message);
	}
	
	/**
	 * Cast an event to all event listeners
	 *
	 * @param eventName   the name of the event
	 * @param eventValue  the value of the event
	 */
	function castEvent(eventName, eventValue){
		if(mEventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < mEventListeners[eventName].length; i++){
			mEventListeners[eventName][i](eventValue);
		}
	}
	
	/**
	 * Add a new event listener which will be triggered when an event 
     * with a certain name is cast
	 *
	 * @param eventName  name of the event that we want to listen for
	 * @param listener   a function which will be called when an event
	 *                   is triggered.
	 */
	function addEventListener(eventName, listener){
		console.log("addEventListener: " + eventName);
		
		if(mEventListeners[eventName] === undefined)
			mEventListeners[eventName] = [];
			
		mEventListeners[eventName].push(listener);
	}
		
	// Return public functions
	return{
		connect: connect,
		send: send,
		sendJSON: sendJSON,
		addEventListener: addEventListener
	}
}());