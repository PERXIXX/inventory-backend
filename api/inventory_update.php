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

// อ่าน JSON ที่ส่งมาจาก React
$data = json_decode(file_get_contents("php://input"), true);

$retailer_id      = $data['retailer_id'] ?? null;
$transaction_type = $data['transaction_type'] ?? null;  // OUT / IN
$product_sku      = $data['product_sku'] ?? null;
$quantity         = $data['quantity'] ?? null;

if (!$retailer_id) {
    echo json_encode(["success" => false, "message" => "Missing retailer_id"]);
    exit();
}

if (!$transaction_type || !$product_sku || !$quantity) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit();
}

// ----------------------------------------------------
// อัปเดตสต๊อกสินค้าในตาราง products
// ----------------------------------------------------
if ($transaction_type === "OUT") {
    // ลดสต๊อก
    $sql = "
        UPDATE products 
        SET current_stock = current_stock - ? 
        WHERE sku_id = ? AND retailer_id = ?
    ";
} else {
    // เพิ่มสต๊อก
    $sql = "
        UPDATE products 
        SET current_stock = current_stock + ? 
        WHERE sku_id = ? AND retailer_id = ?
    ";
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("isi", $quantity, $product_sku, $retailer_id);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Stock update failed"]);
    exit();
}

// ----------------------------------------------------
// คำนวณราคาขายเพื่อบันทึกลง transactions
// ----------------------------------------------------
$priceQuery = $conn->prepare("
    SELECT price FROM products 
    WHERE sku_id=? AND retailer_id=?
");
$priceQuery->bind_param("si", $product_sku, $retailer_id);
$priceQuery->execute();
$priceResult = $priceQuery->get_result()->fetch_assoc();

$total_price = floatval($priceResult["price"]) * $quantity;

// ----------------------------------------------------
// บันทึกประวัติการขายลง transactions
// ----------------------------------------------------
$insert = $conn->prepare("
    INSERT INTO transactions (retailer_id, product_sku, quantity, transaction_type, total_price)
    VALUES (?, ?, ?, ?, ?)
");
$insert->bind_param("isisd", $retailer_id, $product_sku, $quantity, $transaction_type, $total_price);
$insert->execute();

// ----------------------------------------------------
// ตอบกลับสำเร็จ
// ----------------------------------------------------
echo json_encode([
    "success" => true,
    "message" => "Transaction saved successfully",
    "total_price" => $total_price
]);
exit();
