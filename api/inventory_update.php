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

// อ่าน JSON
$data = json_decode(file_get_contents("php://input"), true);

$retailer_id      = $data['retailer_id'] ?? null;
$transaction_type = $data['transaction_type'] ?? null;
$product_sku      = $data['product_sku'] ?? null;
$quantity         = $data['quantity'] ?? null;

if (!$retailer_id || !$transaction_type || !$product_sku || !$quantity) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit();
}

try {
    // ----------------------------------------------------
    // อัปเดตสต๊อกสินค้า (ใช้ PDO)
    // ----------------------------------------------------
    if ($transaction_type === "OUT") {
        $sql = "UPDATE products SET current_stock = current_stock - :qty WHERE sku_id = :sku AND retailer_id = :rid";
    } else {
        $sql = "UPDATE products SET current_stock = current_stock + :qty WHERE sku_id = :sku AND retailer_id = :rid";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'qty' => $quantity,
        'sku' => $product_sku,
        'rid' => $retailer_id
    ]);

    // ----------------------------------------------------
    // ดึงราคา (ใช้ PDO)
    // ----------------------------------------------------
    $priceQuery = $pdo->prepare("SELECT price FROM products WHERE sku_id = :sku AND retailer_id = :rid");
    $priceQuery->execute(['sku' => $product_sku, 'rid' => $retailer_id]);
    $priceResult = $priceQuery->fetch(PDO::FETCH_ASSOC);

    if (!$priceResult) {
        echo json_encode(["success" => false, "message" => "Product not found"]);
        exit();
    }

    $total_price = floatval($priceResult["price"]) * $quantity;

    // ----------------------------------------------------
    // บันทึก Transaction (ใช้ PDO)
    // ----------------------------------------------------
    $insert = $pdo->prepare("
        INSERT INTO transactions (retailer_id, product_sku, quantity, transaction_type, total_price)
        VALUES (:rid, :sku, :qty, :type, :total)
    ");
    
    $insert->execute([
        'rid' => $retailer_id,
        'sku' => $product_sku,
        'qty' => $quantity,
        'type' => $transaction_type,
        'total' => $total_price
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Transaction saved successfully",
        "total_price" => $total_price
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
exit();
?>