/*
	Manages all the Youtube players on all the separate tabs
*/

PlayerManager = (function(){
	var mPlayers = [];		//Array of youtube players that exists on every tab
	var eventListeners = [];
	
	function setPlayerStatus(playerId, status){
		mPlayers[playerId].status = status;
		castEvent('statusChanged', { playerId: playerId, status: status });
	}

	function setPlayerVolume(playerId, volume){
		mPlayers[playerId].volume = volume;
		castEvent('volumeChanged', { playerId: playerId, volume: volume });
	}
	
	function getPlayerVolume(playerId){
		return mPlayers[playerId].volume;
	}

	function setPlayerDuration(playerId, duration){
		mPlayers[playerId].duration = duration;
		castEvent('durationChanged', { playerId: playerId, duration: duration });
	}
	
	function getPlayerDuration(playerId){
		return mPlayers[playerId].duration;
	}

	function setPlayerCurrentTime(playerId, currentTime){
		mPlayers[playerId].currentTime = currentTime;
		castEvent('currentTimeChanged', { playerId: playerId, currentTime: currentTime });
	}
	
	function getPlayerCurrentTime(playerId){
		return mPlayers[playerId].currentTime;
	}
	
	function setPlayerIsMuted(playerId, isMuted){
		mPlayers[playerId].isMuted = isMuted;
		castEvent('isMuted', { playerId: playerId, isMuted: isMuted });
	}
	
	function getPlayerIsMuted(playerId){
		return mPlayers[playerId].isMuted;
	}
	
	function setPlayerVideoUrl(playerId, videoUrl){
		mPlayers[playerId].videoUrl = videoUrl;
		castEvent('videoUrl', { playerId: playerId, videoUrl: videoUrl });
	}
	
	function getPlayerVideoUrl(playerId){
		return mPlayers[playerId].videoUrl;
	}

	function addPlayer(tabId, playerId){
		mPlayers[playerId] = { status: "paused", isPlaying: false, tabId: tabId, playerId: playerId };
	}

	function removePlayer(playerId){
		delete mPlayers[playerId];
		castEvent('playerRemoved', { playerId: playerId });
	}

	function removePlayerByTabId(tabId){
		for (var playerId in mPlayers) {
			if(mPlayers[playerId].tabId === tabId){
				removePlayer(playerId);
			}
		}
	}
	
	function play(playerId){
		var tabId = mPlayers[playerId].tabId;
		TabManager.send(tabId, { playerId: playerId, setStatus: "play" });
	}
	
	function pause(playerId){
		var tabId = mPlayers[playerId].tabId;
		TabManager.send(tabId, { playerId: playerId, setStatus: "pause" });
	}
	
	function addEventListener(eventName, listener){
		if(eventListeners[eventName] === undefined)
			eventListeners[eventName] = [];
			
		eventListeners[eventName].push(listener);
	}
	
	function castEvent(eventName, eventValue){
		if(eventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < eventListeners[eventName].length; i++){
			eventListeners[eventName][i](eventValue);
		}
	}
	
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