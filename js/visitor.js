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

    respoke.log.setLevel("debug");
    
	// create the Respoke client object
	var client = respoke.createClient({
		appId: wpData.appId,
		developmentMode: false
	});

	var endpoint 	= null;		// reference to the blog owner's endpoint
	var group 		= null;		// reference to the visitors group
	var visitor 	= null;		// caches the visitor profile information
	var call  		= null; 	// used for live voice and/or video call
	var call2 		= null; 	// used for screen sharing session if active

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
		
	var onConnected1 = function() {
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
		
		// TESTING SOMETHING OUT HERE - IGNORE
		var ep = client.getEndpoint({"id": "steven.sokol@gmail.com"});
		var pres = ep.getPresence();
		ep.sendMessage({
		    "message": {
		        "type": "background",
		        "presence": pres
		    }
		});
		
		// END TEST
		
		$("#respoke-visitor-chat").removeAttr("disabled");
		$("#respoke-visitor-chat").removeClass("respoke-disabled");

	};

	var onError = function(err) {
		console.log(err);
	};
	
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

		
		//fetch a token from: /plugins/wp-respoke/api/token.php
		connectToRespoke();

		// let the console know that everything worked
		console.log("Loaded Respoke visitor plugin.");
	});

}(jQuery));
