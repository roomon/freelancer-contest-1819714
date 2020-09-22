<?php

$id = $_GET['id'];
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (count($data) > 0) {
  $K = [];
  $P = [];
  $V = [];
  array_push($K, 'TestID');
  array_push($P, '?');
  array_push($V, $id);
  try {
    $pdo = require_once './_.php';
    foreach ($data as $k => $v) {
      array_push($K, $k);
      array_push($P, '?');
      array_push($V, $v);
    }
    $stmt = $pdo->prepare('INSERT INTO `GlobalTestAnswer` (' . implode(',', $K) . ') VALUES (' . implode(',', $P) . ')');
    $stmt->execute($V);
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
