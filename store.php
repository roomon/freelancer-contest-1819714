<?php

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$id = 1;
if (count($data) > 0) {
  try {
    $pdo = require_once './_.php';
    foreach ($data as $k => $v) {
      $stmt = $pdo->prepare('UPDATE `GlobalTest` SET `' . $k . '` = ? WHERE `ID` = ?');
      $stmt->execute([$v, $id]);
    }
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Received!']);
  } catch (Exception $e) {
    file_put_contents('debug.log', $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Server Error!']);
  }
} else {
  http_response_code(400);
  header('Content-Type: application/json');
  echo json_encode(['message' => 'Not Received!']);
}
