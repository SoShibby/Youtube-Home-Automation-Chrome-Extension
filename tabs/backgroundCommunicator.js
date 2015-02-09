/**
 * Handles communication with the background script.
 * Sends back statuses (volume, current seek time, duration, is playing, current track) 
 * of this YouTube player to the background script
 * and receives commands such as play, pause from the background script.
 */
Communicator = (function() {

	init();
	
	/**
	 * Set up event listeners
	 */
	function init(){
		PlayerHandler.addEventListener("onPlayerReady", onPlayerReady);
		PlayerHandler.addEventListener("onPlayerStateChanged", onPlayerStateChanged);
	}

	/**
	 * Event that is triggered when a new YouTube player has been added
	 * and is ready to receive commands
	 *
	 * @param event  the event that was sent from the playerHandler
	 */
	function onPlayerReady(event) {
		var playerId = event.player.playerId;
		var volume = PlayerHandler.getVolume(playerId);
		var isMuted = PlayerHandler.isMuted(playerId);
		var duration = PlayerHandler.getDuration(playerId);
		var videoUrl = PlayerHandler.getVideoUrl(playerId);
		var currentTime = PlayerHandler.getCurrentTime(playerId);
		var status = PlayerHandler.getStatus(playerId);
		
		chrome.extension.sendRequest({ player: { playerId: playerId, event: "added", status: status, volume: volume, isMuted: isMuted, duration: duration, videoUrl: videoUrl, currentTime: currentTime } }, function(response) {});	
	}

	/**
	 * Event that is triggered when a YouTube player has changed state 
	 * (buffering, playing, paused etc).
	 *
	 * @param event  the event that was sent from the playerHandler
	 */
	function onPlayerStateChanged(event) {
		console.log("onPlayerStateChanged");
		
		var player = event.player;
		player.initialized = true;
		
		chrome.extension.sendRequest({ player: { playerId: event.player.playerId, status: event.playerState, event: "statusChanged" } }, function(response) {});	//Send message to the background script that a YouTube player has changed state
	}
	
	/**
	 * Listen for commands from the background script to pause, play etc.
	 *
	 * @param request       the request that was sent from the background script
	 * @param sender        the one who sent the request
	 * @param sendResponse  callback function
	 */
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

}());