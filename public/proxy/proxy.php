<?php

/**
 * Simple proxy script to handle cors
 * Stole it from here: https://stackoverflow.com/a/65345569
 */

$url = ($_POST['url']) ? $_POST['url'] : $_GET['url'];

$whitelist = [
    "www.dualshockers.com",
    "dualshockers.com",
];

if(!checkUrl($url, $whitelist)) {
    http_response_code(403);
    die('Site is not whitelisted!');
}

$headers = ($_POST['headers']) ? $_POST['headers'] : $_GET['headers'];
$mimeType = ($_POST['mimeType']) ? $_POST['mimeType'] : $_GET['mimeType'];
$session = curl_init($url);

if ($_POST['url']) {
    $postvars = '';

    while ($element = current($_POST)) {
        $postvars .= key($_POST) . '=' . $element . '&';
        next($_POST);
    }

    curl_setopt($session, CURLOPT_POST, true);
    curl_setopt($session, CURLOPT_POSTFIELDS, $postvars);
}

curl_setopt($session, CURLOPT_HEADER, $headers == 'true');
curl_setopt($session, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($session);

if ($mimeType != '') {
    header('Content-Type: ' . $mimeType);
}

echo $response;

curl_close($session);

/**
 * Found this at https://stackoverflow.com/a/37070231
 */
function checkUrl($link,$whitelistDomains)
{
    $urlData = parse_url($link);
    $domain = isset($urlData['host'])? $urlData['host'] : $link;
    if (in_array($domain,$whitelistDomains)){
        return true;
    }
    else{
        return false;
    }
}