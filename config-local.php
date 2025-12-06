<?php
header("Content-Type: application/json; charset=utf-8");

// กำหนดข้อมูลการเชื่อมต่อฐานข้อมูล MySQL

// LOCAL DEV (Laragon)
$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "";
$DB_NAME = "webshop1";


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
