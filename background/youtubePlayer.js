/*
	Controls the last YouTube player that was in use
*/

YoutubePlayer = (function(){
	var mCurrentPlayerId;		//The last YouTube player that was/is in use
	var eventListeners = [];
	var mVolume;
	var mCurrentTime;
	var mDuration;
	var mVideoUrl;
	var mIsMuted;
	
	init();
	
	//Set up event handlers
	function init(){
		PlayerManager.addEventListener('statusChanged', onPlayerStatusChanged);
		PlayerManager.addEventListener('volumeChanged', onPlayerVolumeChanged);
		PlayerManager.addEventListener('durationChanged', onPlayerDurationChanged);
		PlayerManager.addEventListener('currentTimeChanged', onPlayerCurrentTimeChanged);
	}
	
	//Check if the specified YouTube player id is the same id of the last YouTube player that was in use
	function isCurrentPlayer(playerId){
		return (mCurrentPlayerId && mCurrentPlayerId === playerId);
	}
	
	//Set a new YouTube player as the primary player
	function setCurrentPlayer(playerId){
		mCurrentPlayerId = playerId;
		
		//Check if the volume of the new player differs from the previous one, if that is the case then report that the volume has changed
		if(mVolume !== PlayerManager.getPlayerVolume(playerId)){
			mVolume = PlayerManager.getPlayerVolume(playerId);
			castEvent('volumeChanged', mVolume);
		}
		
		//Check if the current time (seek position) of the new player differs from the previous one, if that is the case then report that the current time has changed
		if(mCurrentTime !== PlayerManager.getPlayerCurrentTime(playerId)){
			mCurrentTime = PlayerManager.getPlayerCurrentTime(playerId);
			castEvent('currentTimeChanged', mCurrentTime);
		}
		
		//Check if the duration (video length) of the new player differs from the previous one, if that is the case then report that the duration (video length) has changed
		if(mDuration !== PlayerManager.getPlayerDuration(playerId)){
			mDuration = PlayerManager.getPlayerDuration(playerId);
			castEvent('durationChanged', mDuration);
		}
		
		//Check if the YouTube video URL of the new player differs from the previous one, if that is the case then report that the video URL has changed
		if(mVideoUrl !== PlayerManager.getPlayerVideoUrl(playerId)){
			mVideoUrl = PlayerManager.getPlayerVideoUrl(playerId);
			castEvent('videoUrlChanged', mVideoUrl);
		}
		
		//Check if the new player was muted while the previous one wasn't, if that is the case then report that the new player is muted or unmuted
		if(mIsMuted !== PlayerManager.getPlayerIsMuted(playerId)){
			mIsMuted = PlayerManager.getPlayerIsMuted(playerId);
			castEvent('isMutedChanged', mIsMuted);
		}
	}

	//Event triggered when the state (buffering, paused, playing) has changed for any of the available YouTube players
	function onPlayerStatusChanged(event){
		var playerId = event.playerId;
		var status = event.status;
		
		console.log("onPlayerStatusChanged - " + playerId + " - " + status);
		
		var isPlaying = (status === "playing");
		
		//If this player is playing a video then set this player as the new "primary" player
		if(isPlaying){		
			setCurrentPlayer(playerId);
		}
		
		if(isCurrentPlayer(playerId)){
			castEvent('statusChanged', status);
			castEvent('isPlaying', isPlaying);
		}
	}
	
	//Event triggered when a YouTube player has changed its volume
	function onPlayerVolumeChanged(event){
		var playerId = event.playerId;
		var status = event.volume;
		
		if(isCurrentPlayer(playerId)){
			castEvent('volumeChanged', volume);
		}
	}
	
	//Event triggered when the video duration has changed for a specific YouTube player
	function onPlayerDurationChanged(event){
		var playerId = event.playerId;
		var status = event.duration;
		
		if(isCurrentPlayer(playerId)){
			castEvent('durationChanged', duration);
		}
	}
	
	//Event triggered when the current time (seek position) of a specific YouTube player has changed
	function onPlayerCurrentTimeChanged(event){
		var playerId = event.playerId;
		var status = event.currentTime;
		
		if(isCurrentPlayer(playerId)){
			castEvent('currentTimeChanged', currentTime);
		}
	}
	
	//Send command to a YouTube player to start playback
	function play(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to play, no youtube player exists');
			return;
		}
	
		PlayerManager.play(mCurrentPlayerId);
	}
	
	//Send command to a YouTube player to pause playback
	function pause(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to pause, no youtube player exists');
			return;
		}
	
		PlayerManager.pause(mCurrentPlayerId);
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
	
	//Return public functions
	return {
		addEventListener: addEventListener,
		play: play,
		pause: pause
	}
}());