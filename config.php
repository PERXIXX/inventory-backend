<?php
$host = getenv("PGHOST");
$user = getenv("PGUSER");
$pass = getenv("PGPASSWORD");
$dbname = getenv("PGDATABASE");

// หากเป็น MySQL ให้สลับ mysqli ด้านล่างเป็นสิ่งที่คุณใช้ตอนนี้
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "details" => $conn->connect_error]);
    exit;
}
?>
