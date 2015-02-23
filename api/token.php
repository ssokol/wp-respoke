<?php

/*
 * Copyright 2015, Digium, Inc.
 * All rights reserved.
 *
 * This source code is licensed under The MIT License found in the
 * LICENSE file in the root directory of this source tree.
 *
 * For all details and documentation:  https://www.respoke.io
 */
 

define('DOING_AJAX', true);
define('WP_USE_THEMES', false);
require_once('../../../../wp-load.php');

$respokeEndpointId = "";

$opt = get_option("widget_wp_respoke_visitor_plugin");

$respokeRoleId = $opt[2]['visitorRoleId'];
$respokeAppSecret = $opt[2]['appSecret'];
$respokeAppId = $opt[2]['appId'];

$current_user = wp_get_current_user();

if ($current_user->ID == 0) {
	// ok, check to see if there's a cookie called 'respokeId'
	if (isset($_COOKIE["respokeClientId"])) {
		$respokeEndpointId = $_COOKIE["respokeClientId"];
	} else {
		$respokeEndpointId = generateRandomString(20);
		setcookie("respokeEndpointId", $respokeEndpointId);
	}	
} else {
	$respokeEndpointId = generateRandomString(20);
	setcookie("respokeEndpointId", $respokeEndpointId);
}

$data = array();
$data['appId'] = $respokeAppId;
$data['endpointId'] = $respokeEndpointId;
$data['roleId'] = $respokeRoleId;
$data['ttl'] = 86400;
$json = json_encode($data);

//$ch = curl_init('https://api-st.respoke.io/v1/tokens');
$ch = curl_init('https://api.respoke.io/v1/tokens');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'App-Secret: ' . $respokeAppSecret,
    'Content-Type: application/json',
    'Content-Length: ' . strlen($json))                                                                       
);
$result = curl_exec($ch);
wp_send_json($result);


function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

?>
