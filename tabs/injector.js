function onYouTubeIframeAPIReady() {
	if(isHypemWebsite()){
		console.log("Hypem website detected, exiting");
		return;
	}
	
	Injector.onYouTubeIframeAPIReady();
}	

function isHypemWebsite(){
	return document.URL.indexOf('hypem.com') != -1;
}
	
Injector = (function() {
	//Check if the url is an youtube iframe
	function isYoutubeIframe(url){
		return url.indexOf('youtube.com/embed/') != -1;
	}

	//Check if the url is an youtube embed
	function isYoutubeEmbed(url){
		return url.indexOf('youtube.com/v/') != -1;
	}

	//Check if the current website is youtube.com
	function isYoutubeWebsite(){
		return window.location.href.indexOf("https://www.youtube.com/watch?v=") != -1;
	}

	//Get youtube video id from a youtube url, this only works for urls that contains the video id in the path of the url, not in the url parameter.
	function getYoutubeVideoId(url){
		var a = $('<a>', { href:url } )[0];
		var urlPathName = a.pathname;
		var splits = urlPathName.split('/');
		return splits[2];
	}

	//Injects a youtube video (which we can control) into the dom
	function injectPlayer(videoId, replaceElement){
		console.log("injectPlayer");
		
		var playerId = HelpFunctions.createGUID();
		var classes = replaceElement.attr('class');
		replaceElement.replaceWith('<div id="player-' + playerId + '" class="loaded ' + classes + '" data-playerid="' + playerId + '"></div>');
		PlayerHandler.addPlayer(playerId, videoId, false);
	}

	//Replace all youtube iframes with our youtube player
	function handleYoutubeIframes(){
		//console.log("handleYoutubeIframes");
		
		$('iframe').each(function(){
			$this = $(this);
			if(!$this.hasClass('loaded')){
				var srcURL = $this.attr('src');
				
				if(isYoutubeIframe(srcURL)){
					console.log('Adding youtube video.');
					
					var videoId = getYoutubeVideoId(srcURL);
					injectPlayer(videoId, $this);
					return;
				}
				
			}
		});
	}

	//Replace all youtube embeds with our youtube player
	function handleYoutubeEmbed(){
		$('embed').each(function(){
			$this = $(this);
			if(!$this.hasClass('loaded')){
				var srcURL = $this.attr('src');
				if(isYoutubeEmbed(srcURL)){
					console.log('Adding youtube video.');
					
					var videoId = getYoutubeVideoId(srcURL);
					injectPlayer(videoId, $this);
					return;
				}
				
			}
		});
	}

	//Inject our youtube player if the website url is youtube.com
	function onYouTubeIframeAPIReady() {
		console.log("onYouTubeIframeAPIReady");
		
		if(isYoutubeWebsite()){
			$('#theater-background').remove();	//Remove theater-background from youtube website, this prevents the user from starting/pausing the video by clicking on the video
			$('.spf-link').each(function(){ 	//Remove spf-link class from links, spf-link do so videos loads dynamically which prevents our extension from recognizing the new video
				$(this).removeClass('spf-link');
			});	
			
			var parameters = HelpFunctions.getURLParameters();
			var videoId = parameters.v;
			injectPlayer(videoId, $('#player-api'));
		}
	}

	//Replace all youtube iframes with http with https versions instead
	function forceYoutubeHttps(){
		$('iframe').each(function(){
			$this = $(this);
			var url = $this.attr('src');
			
			if(isYoutubeIframe(url)){
				if(!HelpFunctions.isURLHttps(url)){
					url = HelpFunctions.convertURLToHttps(url);
					$this.attr('src', url);
				}
			}
		});
	}
	
	return {
		handleYoutubeIframes: handleYoutubeIframes,
		handleYoutubeEmbed: handleYoutubeEmbed,
		forceYoutubeHttps: forceYoutubeHttps,
		onYouTubeIframeAPIReady: onYouTubeIframeAPIReady
	}
}());