/*
	Manages all the YouTube players on all the separate tabs
*/

PlayerManager = (function(){
	var mPlayers = [];		//Array of all the YouTube players that exists on every tab
	var mEventListeners = [];
	
	function setPlayerStatus(playerId, status){
		mPlayers[playerId].status = status;
		castEvent('statusChanged', { playerId: playerId, status: status });
	}

	function setPlayerVolume(playerId, volume){
		mPlayers[playerId].volume = volume;
		castEvent('volumeChanged', { playerId: playerId, volume: volume });
	}
	
	//Get the current volume of the YouTube player with the specified id
	function getPlayerVolume(playerId){
		return mPlayers[playerId].volume;
	}

	function setPlayerDuration(playerId, duration){
		mPlayers[playerId].duration = duration;
		castEvent('durationChanged', { playerId: playerId, duration: duration });
	}

	//Get the duration (video length) of the YouTube player with the specified id
	function getPlayerDuration(playerId){
		return mPlayers[playerId].duration;
	}

	function setPlayerCurrentTime(playerId, currentTime){
		mPlayers[playerId].currentTime = currentTime;
		castEvent('currentTimeChanged', { playerId: playerId, currentTime: currentTime });
	}
	
	//Get the current time (seek position) of the YouTube player with the specified id
	function getPlayerCurrentTime(playerId){
		return mPlayers[playerId].currentTime;
	}
	
	function setPlayerIsMuted(playerId, isMuted){
		mPlayers[playerId].isMuted = isMuted;
		castEvent('isMuted', { playerId: playerId, isMuted: isMuted });
	}
	
	//Check if a specific YouTube player is muted or not
	function getPlayerIsMuted(playerId){
		return mPlayers[playerId].isMuted;
	}
	
	function setPlayerVideoUrl(playerId, videoUrl){
		mPlayers[playerId].videoUrl = videoUrl;
		castEvent('videoUrl', { playerId: playerId, videoUrl: videoUrl });
	}
	
	//Get the video URL of a specific YouTube player
	function getPlayerVideoUrl(playerId){
		return mPlayers[playerId].videoUrl;
	}

	//Add a new YouTube player to the collection
	function addPlayer(tabId, playerId){
		mPlayers[playerId] = { status: "paused", isPlaying: false, tabId: tabId, playerId: playerId };
	}

	//Remove a YouTube player from the collection
	function removePlayer(playerId){
		delete mPlayers[playerId];
		castEvent('playerRemoved', { playerId: playerId });
	}

	//Remove all YouTube players that are associated with a specific tab id
	function removePlayerByTabId(tabId){
		for (var playerId in mPlayers) {
			if(mPlayers[playerId].tabId === tabId){
				removePlayer(playerId);
			}
		}
	}
	
	//Send command to YouTube player to start playback
	function play(playerId){
		var tabId = mPlayers[playerId].tabId;
		TabManager.send(tabId, { playerId: playerId, setStatus: "play" });
	}
	
	//Send command to YouTube player to pause playback
	function pause(playerId){
		var tabId = mPlayers[playerId].tabId;
		TabManager.send(tabId, { playerId: playerId, setStatus: "pause" });
	}
	
	function addEventListener(eventName, listener){
		if(mEventListeners[eventName] === undefined)
			mEventListeners[eventName] = [];
			
		mEventListeners[eventName].push(listener);
	}
	
	function castEvent(eventName, eventValue){
		if(mEventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < mEventListeners[eventName].length; i++){
			mEventListeners[eventName][i](eventValue);
		}
	}
	
	//Return public functions
	return{
		setPlayerStatus: setPlayerStatus,
		setPlayerVolume: setPlayerVolume,
		getPlayerVolume: getPlayerVolume,
		setPlayerDuration: setPlayerDuration,
		getPlayerDuration: getPlayerDuration,
		setPlayerCurrentTime: setPlayerCurrentTime,
		getPlayerCurrentTime: getPlayerCurrentTime,
		getPlayerIsMuted: getPlayerIsMuted,
		setPlayerIsMuted: setPlayerIsMuted,
		getPlayerVideoUrl: getPlayerVideoUrl,
		setPlayerVideoUrl: setPlayerVideoUrl,
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		removePlayerByTabId: removePlayerByTabId,
		play: play,
		pause: pause,
		addEventListener: addEventListener
	}
}());