function onPlayerReady(event) {
	console.log(event);
}

PlayerHandler = (function(){
	var mPlayers = [];
	var eventListeners = [];
	
	function addEventListener(eventName, listener){
		console.log("addEventListener: " + eventName);
		
		if(eventListeners[eventName] === undefined)
			eventListeners[eventName] = [];
			
		eventListeners[eventName].push(listener);
	}
	
	function castEvent(eventName, eventValue){
		console.log("Casting event,  eventName: " + eventName + ", eventValue: " + eventValue);
		if(eventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < eventListeners[eventName].length; i++){
			eventListeners[eventName][i](eventValue);
		}
	}
	
	function addPlayer(playerId, videoId, autoplay){
		autoplay = autoplay ? 1 : 0;
		
		if($('#player-' + playerId).length === 0){
			console.log("Unable to addPlayer, couldn't find a dom element with id '" + playerId + "'");
			return;
		}
		
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
	
	function onPlayerStateChanged(event) {
		console.log("onPlayerStateChanged");
	
		var player = event.target;
		
		castEvent("onPlayerStateChanged", { player: player, originalEvent: event });
	}
	
	function onPlayerReady(event) {
		console.log("onPlayerReady");
		
		var player = event.target;
		player.initialized = false;
		var playerId = $(player.a).data('playerid');
		player.playerId = playerId;
		
		mPlayers[playerId] = player;
		
		castEvent("onPlayerReady", { player: player, originalEvent: event });
	}

	function existsPlayer(playerId){
		return getPlayer(playerId) !== null && getPlayer(playerId) !== undefined;
	}
	
	function play(playerId){
		if(!existsPlayer(playerId)){
			console.log("Unable to play video, couldn't find player with id: " + playerId);
			return;
		}
		
		var player = getPlayer(playerId);
		player.playVideo();
	}

	function pause(playerId){
		if(!existsPlayer(playerId)){
			console.log("Unable to pause video, couldn't find player with id: " + playerId);
			return;
		}
		
		var player = getPlayer(playerId);
		player.pauseVideo();
	}
	
	function getDuration(playerId){
		return getPlayer(playerId).getDuration();
	}
	
	function getVolume(playerId){
		return getPlayer(playerId).getVolume();
	}
	
	function setVolume(playerId, volume){
		return getPlayer(playerId).setVolume(volume);
	}
	
	function isMuted(playerId){
		return getPlayer(playerId).isMuted();
	}
	
	function mute(playerId){
		return getPlayer(playerId).mute();
	}
	
	function unMute(playerId){
		return getPlayer(playerId).unMute();
	}
	
	function getVideoUrl(playerId){
		return getPlayer(playerId).getVideoUrl();
	}
	
	function getPlaybackQuality(playerId){
		return getPlayer(playerId).getPlaybackQuality();
	}
	
	function setPlaybackQuality(playerId, quality){
		return getPlayer(playerId).setPlaybackQuality(quality);
	}
	
	function getAvailableQualityLevels(playerId){
		return getPlayer(playerId).getAvailableQualityLevels();
	}
	
	function getCurrentTime(playerId){
		return getPlayer(playerId).getCurrentTime();
	}
	
	function getPlayer(playerId){
		return mPlayers[playerId];
	}
	
	function getAllPlayerIds(){
		return Object.keys(mPlayers);
	}
	
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