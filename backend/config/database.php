<?php
/**
 * LogicLab - Database Connection Handler
 */

declare(strict_types=1);

if (!defined('LOGICLAB_ROOT')) {
    define('LOGICLAB_ROOT', dirname(__DIR__));
}

require_once LOGICLAB_ROOT . '/database/init.php';

function getDb(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = getDatabaseConnection();
        // Ensure schemas exist automatically
        initializeDatabase($pdo);
    }
    return $pdo;
}

function sendJsonResponse(int $statusCode, array $data): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}
