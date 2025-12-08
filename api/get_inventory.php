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

$retailer_id = isset($_GET["retailer_id"]) ? intval($_GET["retailer_id"]) : 0;
// รับค่า role และแปลงเป็นตัวเล็กทันที
$role_raw = isset($_GET["role"]) ? $_GET["role"] : "ไม่ได้รับค่า";
$role = strtolower($role_raw);

try {
    // =========================================================
    // 1) สร้าง SQL
    // =========================================================
    if ($role === 'admin') {
        // กรณีเป็น Admin
        $sql = "SELECT product_id, sku_id, product_name, price, current_stock, retailer_id 
                FROM products ORDER BY product_id ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $query_mode = "ADMIN_MODE (ดึงทั้งหมด)";
    } else {
        // กรณีไม่ใช่ Admin (หรือระบบไม่รู้ว่าเป็น Admin)
        $sql = "SELECT product_id, sku_id, product_name, price, current_stock 
                FROM products 
                WHERE retailer_id = :retailer_id ORDER BY product_id ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['retailer_id' => $retailer_id]);
        $query_mode = "USER_MODE (ดึงเฉพาะ retailer_id: $retailer_id)";
    }
    
    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // =========================================================
    // 2) ยอดขาย
    // =========================================================
    // (ส่วนนี้ทำงานได้แล้ว เพราะได้เลข 15 มา)
    $revenue_sql = "SELECT SUM(total_price) AS total_revenue FROM transactions WHERE retailer_id = :retailer_id AND transaction_type = 'OUT'";
    if($role === 'admin') {
         $revenue_sql = "SELECT SUM(total_price) AS total_revenue FROM transactions WHERE transaction_type = 'OUT'";
         $rev_stmt = $pdo->prepare($revenue_sql);
         $rev_stmt->execute();
    } else {
         $rev_stmt = $pdo->prepare($revenue_sql);
         $rev_stmt->execute(['retailer_id' => $retailer_id]);
    }
    
    $rev_row = $rev_stmt->fetch(PDO::FETCH_ASSOC);
    $totalRevenue = $rev_row["total_revenue"] ?? 0;

    // ส่งค่ากลับพร้อม Debug Info
    echo json_encode([
        "success" => true,
        "inventory" => $inventory,
        "totalRevenue" => floatval($totalRevenue),
        // --- ส่วนสำคัญสำหรับการแก้ปัญหา ---
        "debug_info" => [
            "received_role_raw" => $role_raw, // ค่า Role ที่ส่งมาจริงๆ คืออะไร
            "processed_role" => $role,        // ค่า Role หลังแปลงเป็นตัวเล็ก
            "query_mode" => $query_mode,      // ระบบเลือกใช้ SQL แบบไหน
            "retailer_id" => $retailer_id
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
exit();
?>
