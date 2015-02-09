/**
 * Manages all the YouTube players on all the separate tabs
 */
PlayerManager = (function(){
	var mPlayers = [];		// Array of all the YouTube players that exists on every tab
	var mEventListeners = [];
	
	/**
	 * Event that is triggered when the status of a YouTube player changes
	 *
	 * @param playerId  the id of the player of which the status changed
	 * @param status    the new status of the player
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function onPlayerStatusChanged(playerId, status){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		mPlayers[playerId].status = status;
		castEvent('statusChanged', { playerId: playerId, status: status });
	}

	/**
	 * Event that is triggered when the volume of a YouTube player is changed
	 *
	 * @param playerId  the id of the player of which the volume was changed
	 * @param volume    the new volume of the player
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function onPlayerVolumeChanged(playerId, volume){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		mPlayers[playerId].volume = volume;
		castEvent('volumeChanged', { playerId: playerId, volume: volume });
	}
	
	/**
	 * Get the current volume of a YouTube player with a given id
	 *
	 * @param playerId  the id of the player that we want the volume of
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function getPlayerVolume(playerId){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		return mPlayers[playerId].volume;
	}
	
	/**
	 * Get whether a player with a given id exists in the player collection
	 *
	 * @param playerId  the id of the player that is to be checked
	 * @return          true if a player exist with the given id, otherwise return false
	 */
	function existsPlayer(playerId){
		return mPlayers[playerId] !== undefined;
	}

	/**
	 * Event that is triggered when the duration (video length) of a YouTube
	 * player changes
	 *
	 * @param playerId  the id of the player of which the duration changed
	 * @param duration  the new duration (video length) of the YouTube player
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function onPlayerDurationChanged(playerId, duration){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		mPlayers[playerId].duration = duration;
		castEvent('durationChanged', { playerId: playerId, duration: duration });
	}

	/**
	 * Get the duration (video length) of the YouTube player with the specified id
	 *
	 * @param playerId  the id of the player that we want the duration of
	 * @return          the video duration (video length)
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function getPlayerDuration(playerId){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		return mPlayers[playerId].duration;
	}

	/**
	 * Event that is triggered when the current time (seek position) of a 
	 * YouTube player is changed
	 *
	 * @param playerId     the id of the player of which the current time was changed
	 * @param currentTime  the current time (seek position) of the video
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function onPlayerCurrentTimeChanged(playerId, currentTime){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		mPlayers[playerId].currentTime = currentTime;
		castEvent('currentTimeChanged', { playerId: playerId, currentTime: currentTime });
	}
	
	/**
	 * Get the current time (seek position) of the YouTube player with a given id
	 *
	 * @param playerId  the id of the player that we want the current time of
	 * @return          the current time (seek position) of the YouTube player
	 * @throw Error     if no YouTube player exist with the given id
	 */
	function getPlayerCurrentTime(playerId){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		return mPlayers[playerId].currentTime;
	}
	
	/**
	 * Event that is triggered when a YouTube player is muted or unmuted
	 *
	 * @param playerId  the id of the player of which is muted or unmuted
	 * @param isMuted   true if the volume is muted or false otherwise
	 * @throw Error     if no player exist with the given id
	 */
	function onPlayerIsMutedChanged(playerId, isMuted){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		mPlayers[playerId].isMuted = isMuted;
		castEvent('isMuted', { playerId: playerId, isMuted: isMuted });
	}
	
	/**
	 * Get whether a specific YouTube player is muted or not 
	 *
	 * @param playerId  the id of the YouTube player
	 * @return          true if the YouTube player is muted otherwise return false
	 * @throw Error     if no player exist with the given id
	 */
	function getPlayerIsMuted(playerId){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		return mPlayers[playerId].isMuted;
	}
	
	/**
	 * Event triggered when the video URL of a YouTube player changes
	 *
	 * @param playerId  the id of the YouTube player
	 * @param videoUrl  the URL of the new video that is playing
	 * @throw Error     if no player exist with the given id
	 */
	function onPlayerVideoUrlChanged(playerId, videoUrl){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		mPlayers[playerId].videoUrl = videoUrl;
		castEvent('videoUrl', { playerId: playerId, videoUrl: videoUrl });
	}
	
	/**
	 * Get the video URL of a specific YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want to
	 *                  get the URL of the current playing video
	 * @return          the URL to the video
	 * @throw Error     if no player exist with the given id
	 */
	function getPlayerVideoUrl(playerId){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		return mPlayers[playerId].videoUrl;
	}

	/**
	 * Add a new YouTube player to the collection
	 *
	 * @param tabId     the id of the tab in which this YouTube player exists in
	 * @param playerId  the id of the YouTube player 
	 */
	function addPlayer(tabId, playerId){
		mPlayers[playerId] = { status: "paused", isPlaying: false, tabId: tabId, playerId: playerId };
	}

	/**
	 * Remove a YouTube player from the collection
	 *
	 * @param playerId  the if of the player that is to be removed
	 * @throw Error     if no player exists with the given id
	 */
	function removePlayer(playerId){
		if(!existsPlayer(playerId)){
			throw new Error("No player exists with the id '" + playerId + "'");
		}
		
		delete mPlayers[playerId];
		castEvent('playerRemoved', { playerId: playerId });
	}

	/**
	 * Remove all YouTube players that are associated with a specific tab id
	 *
	 * @param tabId  the id of the tab of which all YouTube players should removed 
	 */
	function removePlayerByTabId(tabId){
		for (var playerId in mPlayers) {
			if(mPlayers[playerId].tabId === tabId){
				removePlayer(playerId);
			}
		}
	}
	
	/**
	 * Send command to YouTube player to start playback
	 *
	 * @param playerId  the id of the YouTube player that should start playback
	 */
	function play(playerId){
		var tabId = mPlayers[playerId].tabId;
		TabManager.send(tabId, { playerId: playerId, setStatus: "play" });
	}
	
	/**
	 * Send command to YouTube player to pause playback
	 *
	 * @param playerId  the id of the YouTube player that should pause playback
	 */
	function pause(playerId){
		var tabId = mPlayers[playerId].tabId;
		TabManager.send(tabId, { playerId: playerId, setStatus: "pause" });
	}
	
	/**
	 * Add a new event listener which will be triggered when an event 
     * with a certain name is cast
	 *
	 * @param eventName  name of the event that we want to listen for
	 * @param listener   the function which will be called when an event
	 *                   is triggered.
	 */
	function addEventListener(eventName, listener){
		if(mEventListeners[eventName] === undefined)
			mEventListeners[eventName] = [];
			
		mEventListeners[eventName].push(listener);
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
	
	// Return public functions
	return{
		onPlayerStatusChanged: onPlayerStatusChanged,
		onPlayerVolumeChanged: onPlayerVolumeChanged,
		getPlayerVolume: getPlayerVolume,
		onPlayerDurationChanged: onPlayerDurationChanged,
		getPlayerDuration: getPlayerDuration,
		onPlayerCurrentTimeChanged: onPlayerCurrentTimeChanged,
		getPlayerCurrentTime: getPlayerCurrentTime,
		getPlayerIsMuted: getPlayerIsMuted,
		onPlayerIsMutedChanged: onPlayerIsMutedChanged,
		getPlayerVideoUrl: getPlayerVideoUrl,
		onPlayerVideoUrlChanged: onPlayerVideoUrlChanged,
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		removePlayerByTabId: removePlayerByTabId,
		play: play,
		pause: pause,
		addEventListener: addEventListener
	}
}());