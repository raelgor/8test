<?php
$_CONFIG = (array)json_decode(file_get_contents('../config.json'));

$query = $_POST['q'];

$headers = array();
$headers[] = "Authorization: Basic " . base64_encode($_CONFIG["k"] . ":" . $_CONFIG["s"]);

$data = array("grant_type" => "client_credentials");

$authResponse = json_decode(post("https://api.twitter.com/oauth2/token", $data, $headers, false));

if(!$authResponse->access_token) {
  var_dump($authResponse);
  exit();
}

$response = post("https://api.twitter.com/1.1/search/tweets.json?q=" . rawurlencode($query), array(), array(
  "Authorization: Bearer " . $authResponse->access_token
), true);

function post($url, $data, $headers, $makeGet) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, !$makeGet);

  if(!$makeGet)
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  $res = curl_exec ($ch);
  curl_close ($ch);
  return $res;
}

echo $response;
?>
