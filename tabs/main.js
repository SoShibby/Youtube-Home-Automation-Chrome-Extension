
function isHypemWebsite(){
	return document.URL.indexOf('hypem.com') != -1;
}
	
$(document).ready(function(){
	//This chrome extension doesn't work with hypem website. The hypem music player stops working.
	if(isHypemWebsite()){
		console.log("Hypem website detected, exiting");
		return;
	}
		
	console.log("Document ready, injecting player controllers and replacing youtube videos");
	
	Injector.handleYoutubeIframes();
	Injector.handleYoutubeEmbed();
	Injector.forceYoutubeHttps();
	
	$("body").bind("DOMSubtreeModified", function() {
		Injector.handleYoutubeIframes();
		Injector.handleYoutubeEmbed();
		Injector.forceYoutubeHttps();
	});
});

$( window ).unload(function() {
	console.log("Bye now!");
	var playerIds = PlayerHandler.getAllPlayerIds();

	for(var i = 0; i < playerIds.length; i++){
		var playerId = playerIds[i];
		chrome.extension.sendRequest({ player: { playerId: playerId, event: "removed" } }, function(response) {});	
	}
});