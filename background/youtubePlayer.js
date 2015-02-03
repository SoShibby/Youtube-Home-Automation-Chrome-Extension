/*
	Controls the current youtube player that is in use
*/

YoutubePlayer = (function(){
	var mCurrentPlayerId;		//The last youtube player that was/is in use
	var eventListeners = [];
	var mVolume;
	var mCurrentTime;
	var mDuration;
	var mVideoUrl;
	var mIsMuted;
	
	init();
	
	function init(){
		PlayerManager.addEventListener('statusChanged', onPlayerStatusChanged);
		PlayerManager.addEventListener('volumeChanged', onPlayerVolumeChanged);
		PlayerManager.addEventListener('durationChanged', onPlayerDurationChanged);
		PlayerManager.addEventListener('currentTimeChanged', onPlayerCurrentTimeChanged);
	}
	
	function isCurrentPlayer(playerId){
		return (mCurrentPlayerId && mCurrentPlayerId === playerId);
	}
	
	function setCurrentPlayer(playerId){
		mCurrentPlayerId = playerId;
		
		if(mVolume !== PlayerManager.getPlayerVolume(playerId)){
			mVolume = PlayerManager.getPlayerVolume(playerId);
			castEvent('volumeChanged', mVolume);
		}
		
		if(mCurrentTime !== PlayerManager.getPlayerCurrentTime(playerId)){
			mCurrentTime = PlayerManager.getPlayerCurrentTime(playerId);
			castEvent('currentTimeChanged', mCurrentTime);
		}
		
		if(mDuration !== PlayerManager.getPlayerDuration(playerId)){
			mDuration = PlayerManager.getPlayerDuration(playerId);
			castEvent('durationChanged', mDuration);
		}
		
		if(mVideoUrl !== PlayerManager.getPlayerVideoUrl(playerId)){
			mVideoUrl = PlayerManager.getPlayerVideoUrl(playerId);
			castEvent('videoUrlChanged', mVideoUrl);
		}
		
		if(mIsMuted !== PlayerManager.getPlayerIsMuted(playerId)){
			mIsMuted = PlayerManager.getPlayerIsMuted(playerId);
			castEvent('isMutedChanged', mIsMuted);
		}
	}

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
	
	function onPlayerVolumeChanged(event){
		var playerId = event.playerId;
		var status = event.volume;
		
		if(isCurrentPlayer(playerId)){
			castEvent('volumeChanged', volume);
		}
	}
	
	function onPlayerDurationChanged(event){
		var playerId = event.playerId;
		var status = event.duration;
		
		if(isCurrentPlayer(playerId)){
			castEvent('durationChanged', duration);
		}
	}
	
	function onPlayerCurrentTimeChanged(event){
		var playerId = event.playerId;
		var status = event.currentTime;
		
		if(isCurrentPlayer(playerId)){
			castEvent('currentTimeChanged', currentTime);
		}
	}
	
	function play(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to play, no youtube player exists');
			return;
		}
	
		PlayerManager.play(mCurrentPlayerId);
	}
	
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
	
	return {
		addEventListener: addEventListener,
		play: play,
		pause: pause
	}
}());