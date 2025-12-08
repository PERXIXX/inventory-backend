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
// รับค่า role ที่ส่งมาจาก Frontend (ถ้าไม่มีให้เป็นค่าว่าง)
$role = $_GET["role"] ?? "";

try {
    // =========================================================
    // 1) ดึงสินค้า (เช็ค Role ตรงนี้)
    // =========================================================
    if ($role === 'admin') {
        // ถ้าเป็น Admin: เลือกสินค้าทั้งหมด (ไม่สน retailer_id)
        $sql = "SELECT product_id, sku_id, product_name, price, current_stock, retailer_id 
                FROM products ORDER BY product_id ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    } else {
        // ถ้าไม่ใช่ Admin: เลือกเฉพาะของตัวเอง (เหมือนเดิม)
        $sql = "SELECT product_id, sku_id, product_name, price, current_stock 
                FROM products 
                WHERE retailer_id = :retailer_id ORDER BY product_id ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['retailer_id' => $retailer_id]);
    }
    
    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // =========================================================
    // 2) คำนวณยอดขายรวม (ปรับให้ Admin เห็นยอดรวมทั้งหมดด้วยก็ได้)
    // =========================================================
    if ($role === 'admin') {
        $revenue_sql = "SELECT SUM(total_price) AS total_revenue FROM transactions WHERE transaction_type = 'OUT'";
        $rev_stmt = $pdo->prepare($revenue_sql);
        $rev_stmt->execute();
    } else {
        $revenue_sql = "SELECT SUM(total_price) AS total_revenue FROM transactions WHERE retailer_id = :retailer_id AND transaction_type = 'OUT'";
        $rev_stmt = $pdo->prepare($revenue_sql);
        $rev_stmt->execute(['retailer_id' => $retailer_id]);
    }

    $rev_row = $rev_stmt->fetch(PDO::FETCH_ASSOC);
    $totalRevenue = $rev_row["total_revenue"] ?? 0;

    echo json_encode([
        "success" => true,
        "inventory" => $inventory,
        "totalRevenue" => floatval($totalRevenue)
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
exit();
?>
