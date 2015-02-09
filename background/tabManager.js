/**
 * Handles the communication with all tabs
 */
TabManager = (function(){

	/**
	 * Send a message to a tab
	 *
	 * @param tabId    the id of the tab that is the recipient of the message 
	 * @param message  the message that is to be sent to the tab
	 */
	function send(tabId, message){
		chrome.tabs.sendMessage(tabId, message, function(response) {
			console.log(response);
		});
	}

	/**
	 * Incoming message from a tab
	 *
	 * @param request       the request message received
	 * @param sender        the tab that sent the message
	 * @param sendResponse  send back a response to the tab
	 */
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		try{
			if(!request.player){
				console.log("Invalid request received, couldn't find field 'player' in the request");
				return;
			}
			
			var player = request.player;
			var playerId = player.playerId;
			var status = player.status;
			var event = player.event;
			var tabId = sender.tab.id;
			
			if(event === "added"){
				PlayerManager.addPlayer(tabId, playerId);
				PlayerManager.onPlayerVolumeChanged(playerId, player.volume);
				PlayerManager.onPlayerDurationChanged(playerId, player.duration);
				PlayerManager.onPlayerCurrentTimeChanged(playerId, player.currentTime);
				PlayerManager.onPlayerIsMutedChanged(playerId, player.isMuted);
				PlayerManager.onPlayerVideoUrlChanged(playerId, player.videoUrl);
				PlayerManager.onPlayerStatusChanged(playerId, player.status);
			}else if(event === "removed"){
				PlayerManager.removePlayer(playerId);
			}else if(event === "statusChanged"){
				PlayerManager.onPlayerStatusChanged(playerId, status);
			}else{
				console.log("Invalid request received, unknown event '" + event + "'");
			}
		}catch(e){
			console.log("An exception occured when handling request from tab");
			console.log(e.stack);
		}
	});

	/**
	 * Event that is triggered when a tab is closed
	 *
	 * @param tabId       the id of the tab that was closed
	 * @param removeInfo  additional information about the event
	 */
	chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
		// Remove all YouTube players that are associated with this tab
		PlayerManager.removePlayerByTabId(tabId);
	});

	/**
	 * Event that is triggered when a tab is refreshed
	 *
	 * @param tabId      the id of the tab that was refreshed
	 * @param removeInfo additional information about the event
	 * @param tab        information about the tab that was refreshed
	 */
	chrome.tabs.onUpdated.addListener(function(tabId, removeInfo, tab){
		// Check that this tab is really refreshing, if it's not then just exit
		if(removeInfo.status !== "loading"){
			return;
		}
		
		// Remove all YouTube players that are associated with this tab
		PlayerManager.removePlayerByTabId(tabId);
	});
	
	// Return public functions
	return {
		send: send
	}
}());