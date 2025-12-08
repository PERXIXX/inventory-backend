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

// ต้องมี retailer_id
if (!isset($_GET["retailer_id"])) {
    echo json_encode(["success" => false, "message" => "Missing retailer_id"]);
    exit();
}

$retailer_id = intval($_GET["retailer_id"]);

// คิวรี่ยอดขายรวมเฉพาะ OUT
$sql = "
    SELECT 
        COALESCE(SUM(total_price), 0) AS total_sales
    FROM transactions
    WHERE retailer_id = ? AND transaction_type = 'OUT'
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $retailer_id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "total_sales" => floatval($data["total_sales"])
]);
exit();
