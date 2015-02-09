/**
 * PlayerHandler handles all the YouTube players that exist in one tab.
 * It receives events such as paused, playing and can send commands to a 
 * YouTube player to stop playback and to resume playback
 */
PlayerHandler = (function(){
	var mPlayers = [];			// Array containing all YouTube players in this tab
	var mEventListeners = []; 

	/**
	 * Add a new YouTube player to the collection
	 *
	 * @param playerId  the id that the new YouTube player should have
	 * @param videoId   the YouTube video id that the new player should load
	 * @param autoplay  auto start playback when the new player has finished loading
	 */
	function addPlayer(playerId, videoId, autoplay){
		autoplay = autoplay ? 1 : 0;
		
		// Check if the DOM element where we want the new YouTube player to be inserted exists
		if($('#player-' + playerId).length === 0){
			console.log("Unable to add a new YouTube player, couldn't find a DOM element with id '" + playerId + "'");
			return;
		}
		
		// Add a new YouTube player to the DOM
		var youtubePlayer = new YT.Player("player-" + playerId, {
			height: '390',
			width: '640',
			playerVars: { 'autoplay': autoplay },
			videoId: videoId,
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChanged
			}
		});
	}
	
	/**
	 * Event triggered when the YouTube player changes state. 
	 * Possible states are:
     * -1 – unstarted, 
	 *  0 – ended, 
	 *  1 – playing, 
	 *  2 – paused, 
	 *  3 – buffering, 
	 *  5 - video cued
	 *
	 * @param event  the event that was thrown from the YouTube player
	 */
	function onPlayerStateChanged(event) {
		console.log("onPlayerStateChanged");
		var playerState = getPlayerStateString(event.data);
		castEvent("onPlayerStateChanged", { player: event.target, playerState: playerState, originalEvent: event });
	}
	
	/**
	 * Convert player state number to player state string
	 *
	 * @param playerStateNumber  an int value that represent the current state of the YouTube player
	 * @return                   a string that represent the current state of the YouTube player
	 */
	function getPlayerStateString(playerStateNumber){
		switch(playerStateNumber){
			case YT.PlayerState.UNSTARTED:
				return "unstarted";
			case YT.PlayerState.ENDED:
				return "ended";
			case YT.PlayerState.PLAYING:
				return "playing";
			case YT.PlayerState.PAUSED:
				return "paused";
			case YT.PlayerState.BUFFERING:
				return "buffering";
			case YT.PlayerState.CUED:
				return "cued";
		}
		
		return "unknown";
	}
	
	/**
	 * Event triggered when a YouTube player has finished loading and is 
	 * ready to receive commands
	 *
	 * @param event  the event that was thrown from the YouTube player
	 */
	function onPlayerReady(event) {
		console.log("onPlayerReady");
		
		var player = event.target;
		var playerId = $(player.a).data('playerid');
		player.initialized = false;
		player.playerId = playerId;
		
		mPlayers[playerId] = player;
		
		castEvent("onPlayerReady", { player: player, originalEvent: event });
	}

	/**
	 * Check if a YouTube player exists with a given id
	 *
	 * @param playerId  the id of the YouTube player that is to be checked
	 * @return          true if the YouTube player exists, otherwise return false
	 */
	function existsPlayer(playerId){
		return getPlayer(playerId) !== null && getPlayer(playerId) !== undefined;
	}
	
	/**
	 * Send command to a YouTube player to start playing
	 *
	 * @param playerId  the id of the YouTube player that should start playback
	 */
	function play(playerId){
		if(!existsPlayer(playerId)){
			console.log("Unable to play video, couldn't find player with id: " + playerId);
			return;
		}
		
		var player = getPlayer(playerId);
		player.playVideo();
	}

	/**
	 * Send command to YouTube player to pause playback
	 *
	 * @param playerId  the id of the YouTube player that should pause playback
	 */
	function pause(playerId){
		if(!existsPlayer(playerId)){
			console.log("Unable to pause video, couldn't find player with id: " + playerId);
			return;
		}
		
		var player = getPlayer(playerId);
		player.pauseVideo();
	}
	
	/**
	 * Get the length of the current video of the specified YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want the video duration of
	 * @return          the video duration (video length) in seconds
	 */
	function getDuration(playerId){
		return getPlayer(playerId).getDuration();
	}
	
	/**
	 * Get the current volume of the specified YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want the current volume of
	 * @return          a value between 0 and 100 that represent the current volume
	 */
	function getVolume(playerId){
		return getPlayer(playerId).getVolume();
	}
	
	/**
	 * Set the volume of a given YouTube player
	 *
	 * @param playerId  the id of the YouTube player that should change its volume
	 * @param volume    the new volume that should be set
	 */
	function setVolume(playerId, volume){
		return getPlayer(playerId).setVolume(volume);
	}

	/**
	 * Get the current status of a given YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want the status of
	 * @return          a string that represent the current status of the YouTube player
	 */
	function getStatus(playerId){
		return getPlayerStateString(getPlayer(playerId).getPlayerState());
	}
	
	/**
	 * Check if a given YouTube player is muted or not
	 *
	 * @param playerId  the id of the YouTube player that we want to check if 
	 *                  muted or not
	 * @return          true if the YouTube player is muted, otherwise return false
	 */
	function isMuted(playerId){
		return getPlayer(playerId).isMuted();
	}
	
	/**
	 * Mute a specific YouTube player
	 *
	 * @param playerId  the id of the YouTube player that is to be muted
	 */
	function mute(playerId){
		return getPlayer(playerId).mute();
	}
	
	/**
	 * UnMute a specific YouTube player
	 *
	 * @param playerId  the id of the YouTube player that is to be unmuted
	 */
	function unMute(playerId){
		return getPlayer(playerId).unMute();
	}
	
	/**
	 * Get the current YouTube video URL of the specified YouTube player
	 *
	 * @param playerId  the id of the YouTube player
	 * @return          the URL of the currently loaded video
	 */
	function getVideoUrl(playerId){
		return getPlayer(playerId).getVideoUrl();
	}
	
	/**
	 * Get the video quality of the specified YouTube player
	 *
	 * @param playerId  the id of the YouTube player
	 * @return          the quality of the currently loaded YouTube video
	 */
	function getPlaybackQuality(playerId){
		return getPlayer(playerId).getPlaybackQuality();
	}
	
	/**
	 * Set the playback quality (video quality) of a specific YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want to set the playback quality of
	 * @param quality   the new quality that we want the YouTube video to have
	 */
	function setPlaybackQuality(playerId, quality){
		return getPlayer(playerId).setPlaybackQuality(quality);
	}
	
	/**
	 * Get all available video qualities that exists for the specified YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want the available video qualities for
	 * @return          an array containing all the available video qualities 
	 */
	function getAvailableQualityLevels(playerId){
		return getPlayer(playerId).getAvailableQualityLevels();
	}
	
	/**
	 * Get the current time (seek position) of the specified YouTube player
	 *
	 * @param playerId  the id of the YouTube player that we want the current time of
	 * @return          the number of seconds that has passed since the start of the video
	 */
	function getCurrentTime(playerId){
		return getPlayer(playerId).getCurrentTime();
	}
	
	/**
	 * Get the YouTube player object with a specific id
	 *
	 * @param playerId  the id of the YouTube player that we want to retrieve
	 * @return          a YouTube player object
	 */
	function getPlayer(playerId){
		return mPlayers[playerId];
	}
	
	/**
	 * Get the ids of all YouTube players in this tab
	 *
	 * @return  an array containing all player ids
	 */
	function getAllPlayerIds(){
		return Object.keys(mPlayers);
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
	
	/**
	 * Cast an event to all event listeners
	 *
	 * @param eventName   the name of the event
	 * @param eventValue  the value of the event
	 */
	function castEvent(eventName, eventValue){
		console.log("Casting event,  eventName: " + eventName + ", eventValue: " + eventValue);
		if(mEventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < mEventListeners[eventName].length; i++){
			mEventListeners[eventName][i](eventValue);
		}
	}
	
	// Return public functions
	return {
		addEventListener: addEventListener,
		addPlayer: addPlayer,
		play: play,
		pause: pause,
		existsPlayer: existsPlayer,
		getAllPlayerIds: getAllPlayerIds,
		getDuration: getDuration,
		getVolume: getVolume,
		setVolume: setVolume,
		getStatus: getStatus,
		isMuted: isMuted,
		mute: mute,
		unMute: unMute,
		getVideoUrl: getVideoUrl,
		getPlaybackQuality: getPlaybackQuality,
		setPlaybackQuality: setPlaybackQuality,
		getAvailableQualityLevels: getAvailableQualityLevels,
		getCurrentTime: getCurrentTime
	}
}());