<?php
define('DOING_AJAX', true);
define('WP_USE_THEMES', false);
require_once('../../../../wp-load.php');

$opt = get_option("widget_wp_respoke_visitor_plugin");

$respokeEndpointId = "";
$respokeRoleId = $opt[2]['authorRoleId'];
$respokeAppSecret = $opt[2]['appSecret'];
$respokeAppId = $opt[2]['appId'];

$creds = array();
$creds['user_login'] = $_POST['username'];
$creds['user_password'] = $_POST['password'];
$creds['remember'] = true;
$current_user = wp_signon( $creds, false );
if ( is_wp_error($current_user) ) {
	header('Access-Control-Allow-Origin: *');
	echo $current_user->get_error_message();
	return;
}

$respokeEndpointId = $current_user->data->user_email;

$data = array();
$data['appId'] = $respokeAppId;
$data['endpointId'] = $respokeEndpointId;
$data['roleId'] = $respokeRoleId;
$data['ttl'] = 86400;
$json = json_encode($data);

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

// Allow cross-site access to this API
header('Access-Control-Allow-Origin: *');
wp_send_json($result);

?>
