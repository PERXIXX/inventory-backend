<?php

$DB_HOST = getenv("PGHOST");
$DB_NAME = getenv("PGDATABASE");
$DB_USER = getenv("PGUSER");
$DB_PASS = getenv("PGPASSWORD");

$dsn = "pgsql:host=$DB_HOST;port=5432;dbname=$DB_NAME;sslmode=require;";

try {
    $conn = new PDO($dsn, $DB_USER, $DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]));
}
