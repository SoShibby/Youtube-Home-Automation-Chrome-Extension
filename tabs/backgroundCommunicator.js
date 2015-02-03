Communicator = (function() {

	function init(){
		PlayerHandler.addEventListener("onPlayerReady", onPlayerReady);
		PlayerHandler.addEventListener("onPlayerStateChanged", onPlayerStateChanged);
	}

	function onPlayerReady(event) {
		var playerId = event.player.playerId;
		var volume = PlayerHandler.getVolume(playerId);
		var isMuted = PlayerHandler.isMuted(playerId);
		var duration = PlayerHandler.getDuration(playerId);
		var videoUrl = PlayerHandler.getVideoUrl(playerId);
		var currentTime = PlayerHandler.getCurrentTime(playerId);
		
		chrome.extension.sendRequest({ player: { playerId: playerId, event: "added", volume: volume, isMuted: isMuted, duration: duration, videoUrl: videoUrl, currentTime: currentTime } }, function(response) {});	
	}

	function onPlayerStateChanged(event) {
		console.log("onPlayerStateChanged");
		var player = event.player;
		player.initialized = true;
		
		var status;
		switch(event.originalEvent.data){
			case YT.PlayerState.UNSTARTED:
				status = "unstarted";
				break;
			case YT.PlayerState.ENDED:
				status = "ended";
				break;
			case YT.PlayerState.PLAYING:
				status = "playing";
				break;
			case YT.PlayerState.PAUSED:
				status = "paused";
				break;
			case YT.PlayerState.BUFFERING:
				status = "buffering";
				break;
			case YT.PlayerState.CUED:
				status = "cued";
				break;
		}
		
		chrome.extension.sendRequest({ player: { playerId: event.player.playerId, status: status, event: "statusChanged" } }, function(response) {});	
	}
	
	return {
		init: init
	}
}());

Communicator.init();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var playerId = request.playerId;
	var setStatus = request.setStatus;
	
	if(playerId && setStatus){
		if(setStatus === "play"){
			PlayerHandler.play(playerId);
		}else if(setStatus === "pause"){
			PlayerHandler.pause(playerId);
		}
	}else{
		console.log("Data missing, you must supply playerId and setStatus");
	}
});