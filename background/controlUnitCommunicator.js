/**
 * Communicates with the Java application over web socket 
 * (which in turn communicates with the conductor).
 * Receives commands such as play, pause, seek, volume from the server 
 * and sends back the status of the YouTube player to the control unit.
 * Note: We only send back the status of one YouTube player which is 
 * the one that was last in use.
 */
ControlUnitCommunicator = (function(){
	var mURL = "ws://127.0.0.1:9001";		// URL of the control unit (server)

	init();
	
	/**
	 * Set up event listeners
	 */
	function init(){
		ClientSocket.addEventListener('onMessage', onMessageReceived);
		ClientSocket.addEventListener('onClose', onClose);
		ClientSocket.connect(mURL);
		
		YoutubePlayer.addEventListener('isPlaying', onPlayerStatusChanged);
		YoutubePlayer.addEventListener('volumeChanged', onPlayerVolumeChanged);
		YoutubePlayer.addEventListener('durationChanged', onPlayerDurationChanged);
		YoutubePlayer.addEventListener('currentTimeChanged', onPlayerCurrentTimeChanged);
		YoutubePlayer.addEventListener('isMutedChanged', onPlayerIsMutedChanged);
		YoutubePlayer.addEventListener('videoUrlChanged', onPlayerVideoUrlChanged);
	}
	
	/**
	 * Event that is triggered when the YouTube player has changed status
	 *
	 * @param isPlaying  true if the YouTube player is currently playing otherwise return false
	 */
	function onPlayerStatusChanged(isPlaying){
		ClientSocket.sendJSON({ "propertyName": "playing", "propertyValue": isPlaying });
	}
	
	/**
	 * Event that is triggered when the volume of the YouTube player is changed
	 *
	 * @param volume  the new volume of the YouTube player, the value is between 0 and 100
	 */
	function onPlayerVolumeChanged(volume){
		ClientSocket.sendJSON({ "propertyName": "volume", "propertyValue": volume });
	}
	
	/**
	 * Event that is triggered when the YouTube players video duration (video length) has changed
	 *
	 * @param duration  the duration of the video in seconds
	 */
	function onPlayerDurationChanged(duration){
		ClientSocket.sendJSON({ "propertyName": "duration", "propertyValue": duration });
	}
	
	/**
	 * Event that is triggered when the current seek position has changed of the YouTube player
	 *
	 * @param currentTime  the current time (seek position), in seconds
	 */
	function onPlayerCurrentTimeChanged(currentTime){
		ClientSocket.sendJSON({ "propertyName": "currentTime", "propertyValue": currentTime });
	}
	
	/**
	 * Event that is triggered when the YouTube player is muted or unmuted 
	 *
	 * @param isMuted  true if the YouTube player is now muted or false if the player is unmuted
	 */
	function onPlayerIsMutedChanged(isMuted){
		ClientSocket.sendJSON({ "propertyName": "muted", "propertyValue": isMuted });
	}
	
	/**
	 * Event that is triggered when the video URL of the YouTube player has changed
	 *
	 * @param videoUrl  the URL of the new video that is playing
	 */
	function onPlayerVideoUrlChanged(videoUrl){
		ClientSocket.sendJSON({ "propertyName": "videoUri", "propertyValue": videoUrl });	
	}

	/**
	 * Event that is triggered when the connection to the server (control unit) disconnects
	 *
	 * @param event  the event that was thrown from the client socket
	 */
	function onClose(event){
		// Try to reconnect to the server after 3 seconds
		setTimeout(function(){
			ClientSocket.connect(mURL);	
		}, 3000);
	}
 
	/**
	 * Event that is triggered when a message is received from the server (control unit)
	 *
	 * @param event  the event that was casted from the client socket
	 */
	function onMessageReceived(event){
		try{
			var message = event.data;
			var json = JSON.parse(message);
			
			if(json.errorMessage){
				console.log("Error message received from server (control unit), error message was: " + json.errorMessage);
			}else if(json.propertyName || json.propertyValue !== undefined){
				setPropertyValue(json.propertyName, json.propertyValue);
				return;
			}else{
				console.log("Invalid incoming data from server, expected data to contain propertyName and propertyValue");
				return;
			}
		}catch(e){
			console.log("onMessageReceived, Exception occurred with message: " + e.message);
			console.log(e.stack);
		}
	}

	/**
	 * Send command to the YouTube player
	 *
	 * @param propertyName   the name of the property that is to be set
	 * @param propertyValue  the value of the property that is to be set
	 */
	function setPropertyValue(propertyName, propertyValue){
		if(propertyName === "playing"){
			Assert.isBoolean(propertyValue, "Invalid propertyValue, expected boolean value for propertyName '" + propertyName + "'");
			var play = propertyValue;
			
			if(play)
				YoutubePlayer.play();
			else
				YoutubePlayer.pause();
		}
	}
}());
