<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// ----------------------
// AUTO SWITCH LOCAL / LIVE
// ----------------------
if (
    isset($_SERVER['HTTP_HOST']) && 
    ($_SERVER['HTTP_HOST'] === "localhost" || $_SERVER['HTTP_HOST'] === "127.0.0.1")
) {
    require_once __DIR__ . "/config.local.php";    // ใช้ฐานข้อมูลในเครื่อง
} else {
    require_once __DIR__ . "/config.live.php";     // ใช้ฐานข้อมูล InfinityFree
}

// ----------------------
// CONNECT DATABASE
// ----------------------
$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

// หากเชื่อมต่อไม่ได้ ส่ง JSON error (เพื่อ debug)
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");
?>
