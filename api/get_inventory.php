<?php
header("Content-Type: application/json; charset=utf-8");
// Header CORS
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
    // ===============================
    // 1) ดึงสินค้าทั้งหมด (ใช้ PDO)
    // ===============================
    $sql = "SELECT product_id, sku_id, product_name, price, current_stock
            FROM products
            WHERE retailer_id = :retailer_id";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['retailer_id' => $retailer_id]);
    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ===============================
    // 2) คำนวณยอดขายรวม (ใช้ PDO)
    // ===============================
    $revenue_sql = "
        SELECT SUM(total_price) AS totalRevenue
        FROM transactions
        WHERE retailer_id = :retailer_id
          AND transaction_type = 'OUT'
    ";
    
    $rev_stmt = $pdo->prepare($revenue_sql);
    $rev_stmt->execute(['retailer_id' => $retailer_id]);
    $rev_row = $rev_stmt->fetch(PDO::FETCH_ASSOC);

    $totalRevenue = $rev_row["totalrevenue"] ?? 0; // PostgreSQL มักคืนชื่อคอลัมน์เป็นตัวพิมพ์เล็ก

    // ===============================
    // 3) ส่งข้อมูลกลับ
    // ===============================
    echo json_encode([
        "success" => true,
        "inventory" => $inventory,
        "totalRevenue" => floatval($totalRevenue)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}
exit();
?>