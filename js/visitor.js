/*
 * Copyright 2015, Digium, Inc.
 * All rights reserved.
 *
 * This source code is licensed under The MIT License found in the
 * LICENSE file in the root directory of this source tree.
 *
 * For all details and documentation:  https://www.respoke.io
 */

/*
 *
 * Note: the Wordpress module injects data into the JS environment using a
 * POJO called "wpData". It contains all of the blog owner / endpoint info
 * and anything else that needs to be shared with the widget.
 *
 */
 
var wpr = (function($) {

	// create the Respoke client object
	var client = respoke.createClient({
		appId: wpData.appId,
		// baseURL: "https://api-st.respoke.io",
		developmentMode: false
	});

	var endpoint 	= null;		// reference to the blog owner's endpoint
	var group 		= null;		// reference to the visitors group
	var visitor 	= null;		// caches the visitor profile information
	var call  		= null; 	// used for live voice and/or video call
	var call2 		= null; 	// used for screen sharing session if active
	
/*
	// initialize facebook when the FB SDK is loaded
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '519597968143474',
			cookie     : true,
			xfbml      : true,
			version    : 'v2.1'
		});
	};

	// loads the FB SDK asynchronously
	(function(d, s, id){
	 	var js, fjs = d.getElementsByTagName(s)[0];
	 	if (d.getElementById(id)) {return;}
	 	js = d.createElement(s); js.id = id;
	 	js.src = "//connect.facebook.net/en_US/sdk.js";
	 	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));


	// display the chat dialog
	var displayDialog = function(type) {
		Custombox.open({
            target: '#respoke-visitor-dialog',
            effect: 'fadein',
            width: 560,
            overlayClose: false,
            escKey: false,
            complete: function() {
            	checkLoginState();
            }
        });
	};	
*/

	var displayPstnDialog = function(type) {
		Custombox.open({
            target: '#respoke-pstn-dialog',
            effect: 'fadein',
            width: 260,
            overlayClose: false,
            escKey: false,
            complete: function() {
            	//checkLoginState();
            }
        });
	};	
	var onDisconnected = function() {
		console.log("Disconnected from Respoke");
		
	};
	
	/*
		Handle the connect event. Create an endpoint for the blog owner
		and request presence. Send a message indicating that the user has
		initiated a conversation.

	var onConnected = function() {
		console.log("Connected to Respoke");
		
		// process incoming messages
		client.listen('message', function(evt) {
			console.log(evt);
			addMessage(evt.message.message, "remote");
		});
		
		client.listen('call', function(evt) {
			call = evt.call;
			if (call.caller === true) return;
			call.listen('hangup', function(evt) {
				call = null;
			});
			call.listen('connect', function(evt) {
				$("#respoke-chat-conversation").append(evt.element);
			});
			call.answer();
		});
		
		// join the visitors group
		client.join({
			"id": "visitors",
			"onSuccess": function (evt) {
				 group = evt.group;
			 }
		});
		
		// create an endpoint for the blog owner
		endpoint = client.getEndpoint({"id": wpData.endpointId});
		if (endpoint) {
			// listen for presence updates
			endpoint.listen('presence', function(evt) {
				console.dir(evt);
				// if the blog owner is available...
				if (evt.presence === "available") {
					$("#respoke-visitor-chat").removeAttr("disabled");
					$("#respoke-visitor-chat").removeClass("respoke-disabled");
				} else {
					// disable the chat button
					$("#respoke-visitor-chat").attr("disabled", "disabled");
					$("#respoke-visitor-chat").addClass("respoke-disabled");
					
					// dismiss the chat dialog if active
					Custombox.close('first');
				}
			});
			endpoint.getPresence();
		}
		
	};
		
*/
		
	var onConnected1 = function() {
		console.log("Connected to Respoke again!!!!");
		
		// process incoming messages
		client.listen('message', function(evt) {
			console.log(evt);
			addMessage(evt.message.message, "remote");
		});
		
		client.listen('call', function(evt) {
			call = evt.call;
			if (call.caller === true) return;
			call.listen('hangup', function(evt) {
				call = null;
			});
			call.listen('connect', function(evt) {
				$("#respoke-chat-conversation").append(evt.element);
			});
			call.answer();
		});
		
		// join the visitors group
		client.join({
			"id": "visitors",
			"onSuccess": function (evt) {
				 group = evt.group;
			 }
		});
		
		$("#respoke-visitor-chat").removeAttr("disabled");
		$("#respoke-visitor-chat").removeClass("respoke-disabled");
	/*	
		// create an endpoint for the blog owner
		endpoint = client.getEndpoint({"id": wpData.endpointId});
		if (endpoint) {
			// listen for presence updates
			endpoint.listen('presence', function(evt) {
				console.dir(evt);
				// if the blog owner is available...
				if (evt.presence === "available") {
					$("#respoke-visitor-chat").removeAttr("disabled");
					$("#respoke-visitor-chat").removeClass("respoke-disabled");
				} else {
					// disable the chat button
					$("#respoke-visitor-chat").attr("disabled", "disabled");
					$("#respoke-visitor-chat").addClass("respoke-disabled");
					
					// dismiss the chat dialog if active
					Custombox.close('first');
				}
			});
			endpoint.getPresence();
		}
*/
	};

	var onError = function(err) {
		console.log(err);
	};
	
/*	
	var lastFromClass = null;
	
	var addMessage = function(message, cls) {
		var from = "";
		var now = new Date().toLocaleTimeString();
		if (cls == "local") {
			from = "You";
		} else 
		if (cls == "remote") {
			from = wpData.friendlyName;
		} else
		if (cls == "system") {
			from = "Respoke";
		}
		
		
		var m = "<div class=\"respoke-message respoke-" + cls + "\">";
		
		if (cls !== lastFromClass) {
			m += "<div class=\"respoke-avatar respoke-avatar-" + cls +"\"></div>";
			m += "<div class=\"respoke-source\">" + from + " - " + now + "</div>";
			lastFromClass = cls;
		}
		
		m += "<div class=\"respoke-message-body\">" + message + "</div>";
		m += "</div>";
		$("#respoke-chat-conversation").append(m);
		
		setTimeout(function() {
			var objDiv = document.getElementById("respoke-chat-conversation");
			objDiv.scrollTop = objDiv.scrollHeight;
		}, 200);
		
	}
*/
	
	var connectToRespoke = function() {

		// get a token from the server
		$.post("/wp-content/plugins/wp-respoke/api/token.php", null).done(function(data){

			// parse the response from the server
			data = JSON.parse(data);

			// use the token to connect the client to respoke
			client.connect({
				token: data.tokenId,
				reconnect: false,
				onDisconnect: onDisconnected,
				onSuccess: onConnected1,
				onError: onError
			});
		});
	}

/*	
	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			facebookLoginComplete();
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			$(".respoke-fb-login").css("display", "block");
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			$(".respoke-fb-login").css("display", "block");
		}
	}
	
	function checkLoginState() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}
	
	function facebookLoginComplete() {
		$(".respoke-fb-login").css("display", "none");
		FB.api('/me', function(response) {
			
			// cache the visitor profile
			visitor = response;
			
			// add the local class
			var avatarURL = "http://www.gravatar.com/avatar/" + md5(visitor.email) + "?size=40";
			var style = $('<style type="text/css">.respoke-avatar-local { border: 1px solid green; background-image: URL("' + avatarURL + '"); }</style>')
			$('html > head').append(style);
			
			// let the blog owner know that somebody is chatting
			endpoint.sendMessage({
				"message": {
					"event": "visitor",
					"profile": visitor
				}
			});
			
			// post a message to the dialog letting the visitor know that
			// we're trying to get the blog owner's attension
			addMessage('Hello, ' + response.name + '. Hang on for a second and we\'ll try to connect you with ' + wpData.friendlyName + '.', "system");
			
			// enable the text entry box
			$("#respoke-message-to-send").removeAttr("disabled");
			$("#respoke-message-to-send").focus();
		});
    }
*/
    
	$(document).ready(function() {

    $("#respoke-hangup-button").click(function() {
      if (call) {
        call.hangup();
      }
    });
	
		$("#respoke-visitor-chat").click(function() {

      // pop open the "we're calling" modal dialog box
			displayPstnDialog("chat");

      // place the call to the number passed in from php
      call = client.startPhoneCall({
        number: wpData.endpointId
      });

      // listen for hangup events and reset the UI if one arrives
			call.listen('hangup', function(evt) {
				$("#respoke-visitor-chat").css('display', 'block');
				$("#respoke-hangup-button").css('display', 'none');
				Custombox.close('first');
				call = null;
			});

      // listen for the 'connect' event - this indicates that the 
      // gateway has accepted the call. User should hear ringback shortly
      // after this fires
			call.listen('connect', function(evt) {
				$("#respoke-visitor-chat").css('display', 'none');
				$("#respoke-hangup-button").css('display', 'block');
				Custombox.close('first');
			});
		});

/*
		$(".respoke-dialog-close-button").click(function() {
			Custombox.close('first');
		});
		
		$("#respoke-message-to-send").keydown(function (e) {
    		if (e.keyCode == 13) {
    			// grab the message
    			var message = $("#respoke-message-to-send").val();
    			
    			// clear out the message box
    			$("#respoke-message-to-send").val("");
    			
    			// append the message to the local display
    			addMessage(message, "local");
    			
    			// send the message
        		endpoint.sendMessage({
        			"message": message
        		});
        		
        		// don't bother appending an extra \n to the input
        		e.preventDefault();
        		return false;
    		}
		});
*/
		
		//fetch a token from: /plugins/wp-respoke/api/token.php
		connectToRespoke();
		
/*
		//create the display class for the blog owner
		var remoteAvatarURL = "http://www.gravatar.com/avatar/" + md5(wpData.endpointId) + "?size=40";
		var systemAvatarURL = "http://www.gravatar.com/avatar/" + md5("info@respoke.io") + "?size=40";
		var style = '<style type="text/css">\n';
		style += '.respoke-avatar-remote { background-image: URL("' + remoteAvatarURL + '"); }\n' 
		style += '.respoke-avatar-system { background-image: URL("' + systemAvatarURL + '"); }\n'
		style += '</style>';
		
		$('html > head').append($(style));
*/

		// let the console know that everything worked
		console.log("Loaded Respoke visitor plugin.");
	});
/*
	var exports = {};
	exports.checkLoginState = checkLoginState;
	exports.statusChangeCallback = statusChangeCallback;
	return exports;
*/

}(jQuery));
