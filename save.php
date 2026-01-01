<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "sql306.infinityfree.com";
$user = "if0_40602136";       
$pass = "Kaapi2025";            
$db   = "if0_40602136_XXX";


$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die(json_encode(["error" => "DB connection failed"]));

// Get data from JS
$name1 = trim(strtolower(preg_replace('/\s+/', '', $_POST['name1'])));
$name2 = trim(strtolower(preg_replace('/\s+/', '', $_POST['name2'])));
$result = $_POST['result'];
$percentage = (int)$_POST['percentage'];

// Normalize order so "parth+jace" = "jace+parth"
if ($name1 > $name2) { $temp = $name1; $name1 = $name2; $name2 = $temp; }

// Check if reverse pair already exists → MATCH!
$check = $conn->prepare("SELECT created_at FROM results WHERE name1 = ? AND name2 = ?");
$check->bind_param("ss", $name2, $name1);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    // MATCH FOUND!
    $row = $res->fetch_assoc();
    $minutes_ago = round((time() - strtotime($row['created_at'])) / 60);
    echo json_encode([
        "match" => true,
        "minutes_ago" => $minutes_ago,
        "result" => $result,
        "percentage" => $percentage
    ]);
    // Still save this direction too
    $stmt = $conn->prepare("INSERT INTO results (name1, name2, result, percentage) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $name1, $name2, $result, $percentage);
    $stmt->execute();
    exit;
}

// No match yet → just save
$stmt = $conn->prepare("INSERT INTO results (name1, name2, result, percentage) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sssi", $name1, $name2, $result, $percentage);
$stmt->execute();

echo json_encode(["match" => false, "result" => $result, "percentage" => $percentage]);
?>