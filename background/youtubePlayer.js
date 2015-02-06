/**
 * YouTubePlayer controls the last YouTube player that was in use
 */
YoutubePlayer = (function(){
	var mCurrentPlayerId;		// The id of the last YouTube player that was in use
	var mEventListeners = [];
	var mVolume;
	var mCurrentTime;
	var mDuration;
	var mVideoUrl;
	var mIsMuted;
	
	init();
	
	/**
	 * Set up event listeners
	 */
	function init(){
		PlayerManager.addEventListener('statusChanged', onPlayerStatusChanged);
		PlayerManager.addEventListener('volumeChanged', onPlayerVolumeChanged);
		PlayerManager.addEventListener('durationChanged', onPlayerDurationChanged);
		PlayerManager.addEventListener('currentTimeChanged', onPlayerCurrentTimeChanged);
		PlayerManager.addEventListener('playerRemoved', onPlayerRemoved);
	}
	
	/**
	 * Check if the specified YouTube player id is the 
	 * same id as the last YouTube player that was in use
	 *
	 * @param playerId  the id of the player that is to be checked if it is the current player
	 * @return          true if the playerId is the same as the current players id,
	 *                  otherwise return false
	 */
	function isCurrentPlayer(playerId){
		return (mCurrentPlayerId && mCurrentPlayerId === playerId);
	}
	
	/**
	 * Set a new YouTube player as our primary player
	 *
	 * @param playerId  the id of the new player
	 */
	function setCurrentPlayer(playerId){
		mCurrentPlayerId = playerId;
		
		// Check if the volume of the new player differs from the previous one, if that is the case then report that the volume has changed
		if(mVolume !== PlayerManager.getPlayerVolume(playerId)){
			mVolume = PlayerManager.getPlayerVolume(playerId);
			castEvent('volumeChanged', mVolume);
		}
		
		// Check if the current time (seek position) of the new player differs from the previous one, if that is the case then report that the current time has changed
		if(mCurrentTime !== PlayerManager.getPlayerCurrentTime(playerId)){
			mCurrentTime = PlayerManager.getPlayerCurrentTime(playerId);
			castEvent('currentTimeChanged', mCurrentTime);
		}
		
		// Check if the duration (video length) of the new player differs from the previous one, if that is the case then report that the duration (video length) has changed
		if(mDuration !== PlayerManager.getPlayerDuration(playerId)){
			mDuration = PlayerManager.getPlayerDuration(playerId);
			castEvent('durationChanged', mDuration);
		}
		
		// Check if the YouTube video URL of the new player differs from the previous one, if that is the case then report that the video URL has changed
		if(mVideoUrl !== PlayerManager.getPlayerVideoUrl(playerId)){
			mVideoUrl = PlayerManager.getPlayerVideoUrl(playerId);
			castEvent('videoUrlChanged', mVideoUrl);
		}
		
		// Check if the new player was muted while the previous one wasn't, if that is the case then report that the new player is muted or unmuted
		if(mIsMuted !== PlayerManager.getPlayerIsMuted(playerId)){
			mIsMuted = PlayerManager.getPlayerIsMuted(playerId);
			castEvent('isMutedChanged', mIsMuted);
		}
	}

	/**
	 * Event that is triggered when the state (buffering, paused, playing) 
	 * has changed for any of the YouTube players in the collection
	 *
	 * @param event  the event that was thrown
	 */
	function onPlayerStatusChanged(event){
		var playerId = event.playerId;
		var status = event.status;
		
		console.log("onPlayerStatusChanged - " + playerId + " - " + status);
		
		var isPlaying = (status === "playing" || status === "buffering");
		
		//If this player is playing a video then set this player as the new "primary" player
		if(isPlaying){		
			setCurrentPlayer(playerId);
		}
		
		if(isCurrentPlayer(playerId)){
			castEvent('statusChanged', status);
			castEvent('isPlaying', isPlaying);
		}
	}
	
	/**
	 * Event that is triggered when a YouTube player has changed its volume
	 *
	 * @param event  the event that was thrown
	 */
	function onPlayerVolumeChanged(event){
		var playerId = event.playerId;
		var status = event.volume;
		
		if(isCurrentPlayer(playerId)){
			castEvent('volumeChanged', volume);
		}
	}
	
	/**
	 * Event that is triggered when the video duration has changed
	 * for a specific YouTube player
	 *
	 * @param event  the event that was thrown
	 */
	function onPlayerDurationChanged(event){
		var playerId = event.playerId;
		var status = event.duration;
		
		if(isCurrentPlayer(playerId)){
			castEvent('durationChanged', duration);
		}
	}
	
	/**
	 * Event that is triggered when the current time (seek position)
	 * of a specific YouTube player has changed
	 *
	 * @param event  the event that was thrown
	 */
	function onPlayerCurrentTimeChanged(event){
		var playerId = event.playerId;
		var status = event.currentTime;
		
		if(isCurrentPlayer(playerId)){
			castEvent('currentTimeChanged', currentTime);
		}
	}
	
	/**
	 * Event that is triggered when a YouTube player has been removed
	 * or ceased to exist
	 *
	 * @param event  the event that was thrown
	 */
	function onPlayerRemoved(event){
		var playerId = event.playerId;
		
		if(isCurrentPlayer(playerId)){
			castEvent('isPlaying', false);
		}
	}
	
	/**
	 * Send command to the YouTube player to start playback
	 */
	function play(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to play, no youtube player exists');
			return;
		}
	
		PlayerManager.play(mCurrentPlayerId);
	}
	
	/**
	 * Send command to the YouTube player to pause playback
	 */
	function pause(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to pause, no youtube player exists');
			return;
		}
	
		PlayerManager.pause(mCurrentPlayerId);
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
	return {
		addEventListener: addEventListener,
		play: play,
		pause: pause
	}
}());