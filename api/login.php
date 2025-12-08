<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// โหลด config
require_once __DIR__ . "/../config.php";

// รับข้อมูล JSON จาก request body
$input = json_decode(file_get_contents("php://input"), true);

// ตรวจสอบ input
if (!$input || !isset($input['username']) || !isset($input['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"
    ]);
    exit;
}

$username = $input['username'];
$password = $input['password'];

try {
    // Query ค้นหาผู้ใช้
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
    $stmt->execute([":username" => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "ไม่พบบัญชีผู้ใช้"]);
        exit;
    }

    // ตรวจสอบรหัสผ่าน
    if (!password_verify($password, $user['password'])) {
        echo json_encode(["success" => false, "message" => "รหัสผ่านไม่ถูกต้อง"]);
        exit;
    }

    // Login สำเร็จ
    echo json_encode([
        "success" => true,
        "message" => "เข้าสู่ระบบสำเร็จ",
        "user" => [
            "id" => $user['id'],
            "username" => $user['username']
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "เกิดข้อผิดพลาด: " . $e->getMessage()
    ]);
}
?>
