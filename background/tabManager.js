/* 
	Handles communication with all the YouTube players in each tabs
*/

TabManager = (function(){

	//Send message to a tab
	function send(tabId, message){
		chrome.tabs.sendMessage(tabId, message, function(response) {
			console.log(response);
		});
	}

	//Incoming message from a tab
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
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
		}else if(event === "removed"){
			PlayerManager.removePlayer(playerId);
		}else if(event === "statusChanged"){
			PlayerManager.onPlayerStatusChanged(playerId, status);
		}else{
			console.log("Invalid request received, unknown event '" + event + "'");
		}
	});

	//Tab is closing
	chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
		//Remove all YouTube players that are associated with this tab
		PlayerManager.removePlayerByTabId(tabId);
	});

	//Tab is refreshed
	chrome.tabs.onUpdated.addListener(function(tabId, removeInfo, tab){
		//Check that this tab is really refreshing, if it's not then just exit
		if(removeInfo.status !== "loading"){
			return;
		}
		
		//Remove all YouTube players that are associated with this tab
		PlayerManager.removePlayerByTabId(tabId);
	});
	
	//Return public functions
	return {
		send: send
	}
}());