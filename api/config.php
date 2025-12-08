<?php
$host = getenv("PGHOST");
$db   = getenv("PGDATABASE");
$user = getenv("PGUSER");
$pass = getenv("PGPASSWORD");
$ssl  = getenv("PGSSLMODE") ?: "require";

$dsn = "pgsql:host=$host;dbname=$db;sslmode=$ssl";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}
