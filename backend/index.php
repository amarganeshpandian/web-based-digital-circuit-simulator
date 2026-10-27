<?php
/**
 * LogicLab - Backend Front Controller
 * Handles routing when running via PHP built-in server:
 * php -S localhost:8000 backend/index.php
 */

declare(strict_types=1);

define('LOGICLAB_ROOT', __DIR__);

// Normalize request path
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Serve static file directly if it exists
if ($uri !== '/' && file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}

// Route API endpoints
if (str_starts_with($uri, '/api/circuits')) {
    require __DIR__ . '/api/circuits.php';
    exit;
}

if (str_starts_with($uri, '/api/health')) {
    require __DIR__ . '/api/health.php';
    exit;
}

if (str_starts_with($uri, '/api/init')) {
    require __DIR__ . '/database/init.php';
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'app' => 'LogicLab API',
    'version' => '1.0.0',
    'endpoints' => [
        'GET /api/health' => 'Check PHP & SQLite status',
        'GET /api/circuits' => 'List all saved circuits',
        'GET /api/circuits?id=:id' => 'Get circuit details',
        'POST /api/circuits' => 'Create new circuit',
        'PUT /api/circuits?id=:id' => 'Update circuit',
        'DELETE /api/circuits?id=:id' => 'Delete circuit',
        'GET /api/init' => 'Initialize SQLite database'
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
