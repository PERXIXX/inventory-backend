<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// โหลด config
require_once __DIR__ . "/config.php";  // ต้อง include ก่อน

$data = json_decode(file_get_contents("php://input"));

if (empty($data->username) || empty($data->password)) {
    echo json_encode(['success' => false, 'message' => 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน']);
    exit;
}

$username = $data->username;
$password = $data->password;

// ↑ ไม่ต้อง escape เพราะ PDO ใช้ prepared statement แล้ว

$sql = "SELECT retailer_id, password_hash, shop_name, role FROM retailers WHERE username = :username LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute(['username' => $username]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'ไม่พบผู้ใช้']);
    exit;
}

if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'รหัสผ่านไม่ถูกต้อง']);
    exit;
}

echo json_encode([
    'success' => true,
    'retailer_id' => $user['retailer_id'],
    'role' => $user['role'],
    'shop_name' => $user['shop_name'],
]);

?>
