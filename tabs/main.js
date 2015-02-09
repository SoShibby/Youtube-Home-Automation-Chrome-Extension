/**
 * Check if the current tab URL is hypem.com
 */
function isHypemWebsite(){
	return document.URL.indexOf('hypem.com') != -1;
}
	
/**
 * Event that is triggered when the current tab has finished loading
 */
$(document).ready(function(){

	// This chrome extension doesn't work with the Hypem website. 
	// The Hypem music player stops working, so just exit if it's the Hypem website.
	if(isHypemWebsite()){
		console.log("Hypem website detected, exiting");
		return;
	}
		
	console.log("Document ready, injecting player controllers and replacing youtube videos");
	
	// Start replacing YouTube players with new YouTube players 
	// that we can send and receive commands from
	Injector.handleYoutubeIframes();
	Injector.handleYoutubeEmbed();
	Injector.forceYoutubeHttps();
	
	// When the DOM has been changed then start looking for new 
	// YouTube players that might need to be replaced
	$("body").bind("DOMSubtreeModified", function() {
		Injector.handleYoutubeIframes();
		Injector.handleYoutubeEmbed();
		Injector.forceYoutubeHttps();
	});
});

/**
 * Event that is triggered when the current tab is closing
 */
$( window ).unload(function() {
	console.log("Bye now!");
	var playerIds = PlayerHandler.getAllPlayerIds();

	for(var i = 0; i < playerIds.length; i++){
		var playerId = playerIds[i];
		chrome.extension.sendRequest({ player: { playerId: playerId, event: "removed" } }, function(response) {});	
	}
});