/**
 * Event that is triggered when a YouTube player has finished loading
 */
function onYouTubeIframeAPIReady() {
	if(isHypemWebsite()){
		console.log("Hypem website detected, exiting");
		return;
	}
	
	Injector.onYouTubeIframeAPIReady();		//Call the injector and tell that a YouTube player has been added to the DOM
}	

/**
 * Check if the current tab URL is Hypem.com
 */
function isHypemWebsite(){
	return document.URL.indexOf('hypem.com') != -1;
}

/**
 * The injector replaces YouTube players on each website with a new 
 * YouTube player that we have control over
 */
Injector = (function() {
	/**
	 * Check if the URL is a link to a YouTube iFrame
	 *
	 * @param url  the URL that is to be checked
	 * @return     true if it is a link to a YouTube iframe, otherwise return false
	 */
	function isYoutubeIframe(url){
		return url.indexOf('youtube.com/embed/') != -1;
	}

	/**
	 * Check if the URL is a link to a YouTube embed
	 *
	 * @param url  the URL that is to be checked
	 * @return     true if it is a link to a YouTube embed, otherwise return false
	 */
	function isYoutubeEmbed(url){
		return url.indexOf('youtube.com/v/') != -1;
	}

	/**
	 * Check if the URL of the current tab is YouTube.com
	 *
	 * @return  true if the tab URL is youtube.com, otherwise return false
	 */
	function isYoutubeWebsite(){
		return window.location.href.indexOf("https://www.youtube.com") != -1;
	}

	/**
	 * Get YouTube video id from a YouTube URL, this only works for URLs that 
	 * contains the video id in the path of the URL, not in the URL parameter.
	 *
	 * @param url  the YouTube video URL
	 * @return     the id of the video
	 */
	function getYoutubeVideoId(url){
		var a = $('<a>', { href:url } )[0];
		var urlPathName = a.pathname;
		var splits = urlPathName.split('/');
		return splits[2];
	}

	/**
	 * Injects a YouTube player (which we can control) into the DOM
	 *
	 * @param videoId         the id of the YouTube video that is to be played
	 * @param replaceElement  the jQuery DOM element that is to be replaced with the new player
	 * @param autoplay        auto start playback when the new player has been added to the DOM
	 */
	function injectPlayer(videoId, replaceElement, autoplay){
		console.log("injectPlayer");
		
		var playerId = HelpFunctions.createGUID();			//Create a unique id for our new YouTube player
		var classes = replaceElement.attr('class');			//Get the classes of the DOM element we are replacing (so the new YouTube player will look like the one we are replacing)
		replaceElement.replaceWith('<div id="player-' + playerId + '" class="loaded ' + classes + '" data-playerid="' + playerId + '"></div>');
		PlayerHandler.addPlayer(playerId, videoId, autoplay);
	}

	/**
	 * Replace all YouTube iFrames with our YouTube player (which we can control)
	*/
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

	/**
	 * Replace all YouTube embeds with our YouTube player (which we can control)
	 */
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

	/**
	 * Inject our YouTube player if the website URL is YouTube.com
	 */
	function onYouTubeIframeAPIReady() {
		console.log("onYouTubeIframeAPIReady");
		
		if(isYoutubeWebsite()){
			// Remove spf-link class from links. spf-link do so YouTube videos loads dynamically
			// which prevents our extension from recognizing the new video			
			removeSpfLinks();
			
			// Remove spf-links from new DOM elements that has been added dynamically 
			// to the YouTube website
			$("body").bind("DOMSubtreeModified", function() {
				removeSpfLinks();
			});
			
			// When the user clicks on the YouTube search button then go to the page 
			// with the search results. We use this instead of the native 
			// YouTube search button code, which loads search results dynamically, 
			// as our video player doesn't stop playing when the search button is pressed
			$('#search-btn').click(function(){
				var searchTerm = $('#masthead-search-term').val();
				window.location.href = 'https://www.youtube.com/results?search_query=' + searchTerm;
			});
			
			var parameters = HelpFunctions.getURLParameters();
			var videoId = parameters.v;						// Get YouTube video id
			
			if(videoId){
				// Pause the original YouTube player
				$('video').each(function(){
					this.onplay = function() {
						this.pause();
					};
				});
				
				// Remove theater-background from the YouTube website as this prevents the user from starting/pausing the video by clicking on the video
				$('#theater-background').remove();

				// Replace the existing YouTube player with our own YouTube player which we can control
				injectPlayer(videoId, $('#player-api'), true);
			}
		}
	}
	
	/**
	 * Remove spf-link class from DOM elements. spf-link do so videos loads 
	 * dynamically which prevents our extension from recognizing new videos
	 */
	function removeSpfLinks(){
		$('.spf-link').each(function(){ 	
			$(this).removeClass('spf-link');
		});			
	}

	/**
	 * Replace all HTTP YouTube iFrames with HTTPS versions instead
	 */
	function forceYoutubeHttps(){
		$('iframe').each(function(){
			$this = $(this);
			var url = $this.attr('src');

			if(isYoutubeIframe(url)){		// Check if the iFrame URL is a link to a YouTube video
				if(!HelpFunctions.isURLHttps(url)){
					url = HelpFunctions.convertURLToHttps(url);
					$this.attr('src', url);
				}
			}
		});
	}

	// Return public functions
	return {
		handleYoutubeIframes: handleYoutubeIframes,
		handleYoutubeEmbed: handleYoutubeEmbed,
		forceYoutubeHttps: forceYoutubeHttps,
		onYouTubeIframeAPIReady: onYouTubeIframeAPIReady
	}
}());