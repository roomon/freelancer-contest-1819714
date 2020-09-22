<?php

try {
  $pdo = require_once './_.php';
  $rows = $pdo->query('SELECT `ID` FROM `GlobalTest`');
  $ids = [];
  foreach ($rows as $row) {
    array_push($ids, $row['ID']);
  }
  header('Content-Type: application/json');
  echo json_encode(['message' => 'Loaded!', 'data' => $ids]);
} catch (Exception $e) {
  file_put_contents('debug.log', $e->getMessage());
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['message' => 'Server Error!']);
}
