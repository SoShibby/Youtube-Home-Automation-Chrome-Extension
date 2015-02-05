/*
The injector replaces YouTube players on each website with a new YouTube player that we have control over
*/

//Event triggered when a YouTube player have finished loading
function onYouTubeIframeAPIReady() {
	if(isHypemWebsite()){
		console.log("Hypem website detected, exiting");
		return;
	}
	
	Injector.onYouTubeIframeAPIReady();		//Call the injector and tell that a YouTube player has been added to the DOM
}	

//Check if the current tab URL is Hypem.com
function isHypemWebsite(){
	return document.URL.indexOf('hypem.com') != -1;
}
	
Injector = (function() {
	//Check if the URL is a link to a YouTube iFrame
	function isYoutubeIframe(url){
		return url.indexOf('youtube.com/embed/') != -1;
	}

	//Check if the URL is a link to a YouTube embed
	function isYoutubeEmbed(url){
		return url.indexOf('youtube.com/v/') != -1;
	}

	//Check if the current website is YouTube.com
	function isYoutubeWebsite(){
		return window.location.href.indexOf("https://www.youtube.com/watch?v=") != -1;
	}

	//Get YouTube video id from a YouTube URL, this only works for URLs that contains the video id in the path of the URL, not in the URL parameter.
	function getYoutubeVideoId(url){
		var a = $('<a>', { href:url } )[0];
		var urlPathName = a.pathname;
		var splits = urlPathName.split('/');
		return splits[2];
	}

	//Injects a YouTube video (which we can control) into the DOM
	function injectPlayer(videoId, replaceElement, autoplay){
		console.log("injectPlayer");
		
		var playerId = HelpFunctions.createGUID();			//Create a unique id for our new YouTube player
		var classes = replaceElement.attr('class');			//Get the classes of the DOM element we are replacing (so the new YouTube player will look like the one we are replacing)
		replaceElement.replaceWith('<div id="player-' + playerId + '" class="loaded ' + classes + '" data-playerid="' + playerId + '"></div>');
		PlayerHandler.addPlayer(playerId, videoId, autoplay);
	}

	//Replace all YouTube iFrames with our YouTube player (which we can control)
	function handleYoutubeIframes(){
		$('iframe').each(function(){
			$this = $(this);
			if(!$this.hasClass('loaded')){				//If this doesn't have the class 'loaded' that means that we have not yet replaced this iFrame with our own YouTube video player
				var srcURL = $this.attr('src');
				
				if(isYoutubeIframe(srcURL)){			//Check if this iFrame URL links to a YouTube video
					var videoId = getYoutubeVideoId(srcURL);
					injectPlayer(videoId, $this);
					return;
				}
				
			}
		});
	}

	//Replace all YouTube embeds with our YouTube player
	function handleYoutubeEmbed(){
		$('embed').each(function(){
			$this = $(this);
			if(!$this.hasClass('loaded')){						//If this doesn't have the class 'loaded' that means that we have not yet replaced this embed with our own YouTube video player
				var srcURL = $this.attr('src');					//Get the URL of this embedded frame
				if(isYoutubeEmbed(srcURL)){						//Check if this embed links to a YouTube video
					var videoId = getYoutubeVideoId(srcURL);
					injectPlayer(videoId, $this);				//Inject and replace the old YouTube video player
					return;
				}
				
			}
		});
	}

	//Inject our YouTube player if the website URL is YouTube.com
	function onYouTubeIframeAPIReady() {
		console.log("onYouTubeIframeAPIReady");
		
		if(isYoutubeWebsite()){
			//Pause the existing YouTube player
			$('video').each(function(){
				this.onplay = function() {
					this.pause();
				};
			});
			
			//Remove theater-background from the YouTube website as this prevents the user from starting/pausing the video by clicking on the video
			$('#theater-background').remove();

			//Remove spf-link class from links. spf-link do so videos loads dynamically which prevents our extension from recognizing the new video			
			$('.spf-link').each(function(){ 	
				$(this).removeClass('spf-link');
			});	
			
			//Replace the existing YouTube player with our own YouTube player which we can control
			var parameters = HelpFunctions.getURLParameters();
			var videoId = parameters.v;						//Get YouTube video id
			injectPlayer(videoId, $('#player-api'), true);	//Inject and replace the old YouTube video player
		}
	}

	//Replace all YouTube iFrames with HTTP with HTTPS versions instead
	function forceYoutubeHttps(){
		$('iframe').each(function(){
			$this = $(this);
			var url = $this.attr('src');

			if(isYoutubeIframe(url)){		//Check if the iFrame URL is a link to a YouTube video
				if(!HelpFunctions.isURLHttps(url)){
					url = HelpFunctions.convertURLToHttps(url);
					$this.attr('src', url);
				}
			}
		});
	}

	//Return public functions
	return {
		handleYoutubeIframes: handleYoutubeIframes,
		handleYoutubeEmbed: handleYoutubeEmbed,
		forceYoutubeHttps: forceYoutubeHttps,
		onYouTubeIframeAPIReady: onYouTubeIframeAPIReady
	}
}());