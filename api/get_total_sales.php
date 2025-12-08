<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once(__DIR__ . '/config.php');

if (!isset($_GET["retailer_id"])) {
    echo json_encode(["success" => false, "message" => "Missing retailer_id"]);
    exit();
}

$retailer_id = intval($_GET["retailer_id"]);

try {
    // คิวรี่ยอดขายรวมเฉพาะ OUT (ใช้ PDO)
    $sql = "
        SELECT 
            COALESCE(SUM(total_price), 0) AS total_sales
        FROM transactions
        WHERE retailer_id = :retailer_id AND transaction_type = 'OUT'
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['retailer_id' => $retailer_id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    // PostgreSQL มักคืน key เป็นตัวพิมพ์เล็กเสมอ เช็คดีๆ
    $sales = $data["total_sales"] ?? 0;

    echo json_encode([
        "success" => true,
        "total_sales" => floatval($sales)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
exit();
?>