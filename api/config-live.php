<?php
header("Content-Type: application/json; charset=utf-8");

// กำหนดข้อมูลการเชื่อมต่อฐานข้อมูล MySQL
define('DB_SERVER', 'sql100.infinityfree.com');
define('DB_USERNAME', 'if0_40605755');
define('DB_PASSWORD', 'Tonklax1');
define('DB_NAME', 'if0_40605755_webshop1');

// สร้างการเชื่อมต่อ
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถเชื่อมต่อฐานข้อมูลได้: " . $conn->connect_error
    ]);
    exit;
}

// ตั้งค่าให้รองรับภาษาไทย
$conn->set_charset("utf8mb4");
