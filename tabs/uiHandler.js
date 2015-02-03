$(document).on('click', '#playerController .play', function(e){
	console.log('play');
	var playerId = $(this).data('playerid');
	PlayerHandler.play(playerId);
	e.preventDefault();
	return false;
});

$(document).on('click', '#playerController .pause', function(e){
	console.log('pause');
	var playerId = $(this).data('playerid');
	PlayerHandler.pause(playerId);
	e.preventDefault();
	return false;
});

$(document).on('click', '#playerController .scroll', function(e){
	console.log('scroll');
	var playerId = $(this).data('playerid');
	UIHandler.scrollIntoView(playerId);
	e.preventDefault();
	return false;
});

UIHandler = (function(){

	function init(){
		//addPlayerController();
		PlayerHandler.addEventListener("onPlayerReady", onPlayerReady);
		//PlayerHandler.addEventListener("onPlayerStateChanged", onPlayerStateChanged);
	}

	function addPlayerController(){
		$('body').append('<div id="playerController" style="position: fixed;top: 0;right: 0;height: 100px;width: 360px;background-color: white;z-index: 1000000000000;"></div>');
	}

	function onPlayerReady(event) {
		console.log("onPlayerReady");
		
		var playerId = event.player.playerId;
		
		$('#playerController').append('<div>' + playerId + '</a>\
										<a href="" class="play" data-playerid=' + playerId + '>Play</a>\
										<a href="" class="pause" data-playerid=' + playerId + '>Pause</a>\
										<a href="" class="scroll" data-playerid=' + playerId + '>Scroll</a>');
		
	}

	/*
	function onPlayerStateChanged(event) {
		console.log("onPlayerStateChanged");

		var player = event.player;
		
		if(player.initialized === false){
			var bestQuality = getBestQuality(player);
			player.setPlaybackQuality(bestQuality);
			player.initialized = true;
		}
	}
	*/

	function scrollIntoView(playerId){
		var player = $('#player-' + playerId);
		$('body').scrollTo(player);
	}

	/*
	var qualites = ["hd720", "large", "medium", "small", "auto"];

	function getBestQuality(player){
		var availableQualityLevels = player.getAvailableQualityLevels();
		if(availableQualityLevels[0] === "hd1080")
			return availableQualityLevels[1];
		else
			return availableQualityLevels[0];
	}
	*/
	
	return {
		init: init,
		addPlayerController: addPlayerController,
		scrollIntoView: scrollIntoView
	}
}());

UIHandler.init();