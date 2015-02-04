/*
	Communicates with the java application over websocket (which in turn communicates with the conductor)
	Receives commands such as play, pause, seek, volume etc. and sends back status of the youtube player to the control unit.
	Note: We only send back the status of one youtube player which is the one that is the last youtube player that was in use.
*/

ControlUnitCommunicator = (function(){
	var mURL = "ws://127.0.0.1:9001";		//URL of the control unit (server)

	init();
	
	//Set up event listeners
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
	
	//Event triggered when YouTube player has changed status
	function onPlayerStatusChanged(isPlaying){
		ClientSocket.sendJSON({ "propertyName": "playing", "propertyValue": isPlaying });
	}
	
	//Event triggered when YouTube player volume is changed
	function onPlayerVolumeChanged(volume){
		ClientSocket.sendJSON({ "propertyName": "volume", "propertyValue": volume });
	}
	
	//Event triggered when YouTube players track duration has changed
	function onPlayerDurationChanged(duration){
		ClientSocket.sendJSON({ "propertyName": "duration", "propertyValue": duration });
	}
	
	//Event triggered when YouTube players current seek position has changed
	function onPlayerCurrentTimeChanged(currentTime){
		ClientSocket.sendJSON({ "propertyName": "currentTime", "propertyValue": currentTime });
	}
	
	//Event triggered when YouTube players is muted or unmuted has changed
	function onPlayerIsMutedChanged(isMuted){
		ClientSocket.sendJSON({ "propertyName": "muted", "propertyValue": isMuted });
	}
	
	//Event triggered when YouTube players video url has changed
	function onPlayerVideoUrlChanged(videoUrl){
		ClientSocket.sendJSON({ "propertyName": "videoUri", "propertyValue": videoUrl });	
	}

	//Event triggered when connection to the server (control unit) disconnects
	function onClose(event){
		//Try to reconnect to server
		setTimeout(function(){
			ClientSocket.connect(mURL);	
		}, 3000);
	}

	//Event triggered when a message is received from the server (control unit)
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

	//Send command to YouTube player
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
