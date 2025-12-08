<?php
header("Content-Type: application/json; charset=utf-8");
require_once(__DIR__ . '/config.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if (!isset($_GET["retailer_id"])) {
    echo json_encode(["success" => false, "message" => "Missing retailer_id"]);
    exit();
}

$retailer_id = intval($_GET["retailer_id"]);

// ===============================
// 1) ดึงสินค้าทั้งหมดของร้านนี้
// ===============================
$sql = "SELECT product_id, sku_id, product_name, price, current_stock
        FROM products
        WHERE retailer_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $retailer_id);
$stmt->execute();
$result = $stmt->get_result();

$inventory = [];
while ($row = $result->fetch_assoc()) {
    $inventory[] = $row;
}

// ===============================
// 2) คำนวณยอดขายรวมจาก transactions
// ===============================
$revenue_sql = "
    SELECT SUM(total_price) AS totalRevenue
    FROM transactions
    WHERE retailer_id = ?
      AND transaction_type = 'OUT'
";
$rev_stmt = $conn->prepare($revenue_sql);
$rev_stmt->bind_param("i", $retailer_id);
$rev_stmt->execute();
$rev_result = $rev_stmt->get_result();
$rev_row = $rev_result->fetch_assoc();

$totalRevenue = $rev_row["totalRevenue"] ?? 0;

// ===============================
// 3) ส่งข้อมูลกลับ
// ===============================
echo json_encode([
    "success" => true,
    "inventory" => $inventory,
    "totalRevenue" => floatval($totalRevenue)
]);

exit();
