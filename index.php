<?php
// Auto route simple API
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$file = __DIR__ . $path;

if (file_exists($file) && is_file($file)) {
    include $file;
    exit;
}

http_response_code(404);
echo "API Not Found: " . $path;
