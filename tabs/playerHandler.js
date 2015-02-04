/*
PlayerHandler handles all the YouTube players that exist in one tab.
It receives events such as paused, playing and can send commands to a YouTube player to stop playback and to resume playback
*/
PlayerHandler = (function(){
	var mPlayers = [];			//Array of all YouTube players in this tab
	var eventListeners = []; 

	//Add a new YouTube player to the collection
	function addPlayer(playerId, videoId, autoplay){
		autoplay = autoplay ? 1 : 0;
		
		//Check if the DOM element where we want the new YouTube player to be inserted exists
		if($('#player-' + playerId).length === 0){
			console.log("Unable to add a new YouTube player, couldn't find a DOM element with id '" + playerId + "'");
			return;
		}
		
		//Add a new YouTube player to the DOM
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
	
	//Event triggered when the YouTube player changes state. Possible states are -1 – unstarted, 0 – ended, 1 – playing, 2 – paused, 3 – buffering, 5 - video cued
	function onPlayerStateChanged(event) {
		console.log("onPlayerStateChanged");
	
		var player = event.target;	
		castEvent("onPlayerStateChanged", { player: player, originalEvent: event });
	}
	
	//Event triggered when a YouTube player has finished loading
	function onPlayerReady(event) {
		console.log("onPlayerReady");
		
		var player = event.target;
		player.initialized = false;
		var playerId = $(player.a).data('playerid');
		player.playerId = playerId;
		
		mPlayers[playerId] = player;
		
		castEvent("onPlayerReady", { player: player, originalEvent: event });
	}

	//Check if a YouTube player exists with the specified id
	function existsPlayer(playerId){
		return getPlayer(playerId) !== null && getPlayer(playerId) !== undefined;
	}
	
	//Send command to YouTube player to start playing
	function play(playerId){
		if(!existsPlayer(playerId)){
			console.log("Unable to play video, couldn't find player with id: " + playerId);
			return;
		}
		
		var player = getPlayer(playerId);
		player.playVideo();
	}

	//Send command to YouTube player to pause playback
	function pause(playerId){
		if(!existsPlayer(playerId)){
			console.log("Unable to pause video, couldn't find player with id: " + playerId);
			return;
		}
		
		var player = getPlayer(playerId);
		player.pauseVideo();
	}
	
	//Get the length of the current video of the specified YouTube player
	function getDuration(playerId){
		return getPlayer(playerId).getDuration();
	}
	
	//Get the current volume of the specified YouTube player
	function getVolume(playerId){
		return getPlayer(playerId).getVolume();
	}
	
	function setVolume(playerId, volume){
		return getPlayer(playerId).setVolume(volume);
	}
	
	//Check if the specified YouTube player is muted or not
	function isMuted(playerId){
		return getPlayer(playerId).isMuted();
	}
	
	function mute(playerId){
		return getPlayer(playerId).mute();
	}
	
	function unMute(playerId){
		return getPlayer(playerId).unMute();
	}
	
	//Get the current YouTube video URL of the specified YouTube player
	function getVideoUrl(playerId){
		return getPlayer(playerId).getVideoUrl();
	}
	
	//Get the video quality of the specified YouTube player
	function getPlaybackQuality(playerId){
		return getPlayer(playerId).getPlaybackQuality();
	}
	
	function setPlaybackQuality(playerId, quality){
		return getPlayer(playerId).setPlaybackQuality(quality);
	}
	
	//Get available video qualities that exists for the specified YouTube player
	function getAvailableQualityLevels(playerId){
		return getPlayer(playerId).getAvailableQualityLevels();
	}
	
	//Get the current time (seek position) of the specified YouTube player
	function getCurrentTime(playerId){
		return getPlayer(playerId).getCurrentTime();
	}
	
	//Get the YouTube player object with a specific id
	function getPlayer(playerId){
		return mPlayers[playerId];
	}
	
	//Get the ids of all YouTube players in this tab
	function getAllPlayerIds(){
		return Object.keys(mPlayers);
	}
		
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
	
	//Return public functions
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