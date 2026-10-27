<?php
/**
 * LogicLab - Health Check & Diagnostics API
 */

declare(strict_types=1);

define('LOGICLAB_ROOT', dirname(__DIR__));
require_once LOGICLAB_ROOT . '/config/database.php';

$pdoSqliteLoaded = extension_loaded('pdo_sqlite');
$phpVersion = PHP_VERSION;
$dbPath = getDatabasePath();
$dbExists = file_exists($dbPath);
$dbWritable = is_writable(dirname($dbPath)) || ($dbExists && is_writable($dbPath));

$status = [
    'status' => 'ok',
    'timestamp' => date('c'),
    'php_version' => $phpVersion,
    'php_version_compatible' => version_compare($phpVersion, '8.0.0', '>='),
    'pdo_sqlite_installed' => $pdoSqliteLoaded,
    'database_path' => basename($dbPath),
    'database_file_exists' => $dbExists,
    'database_writable' => $dbWritable,
    'circuits_count' => 0
];

if ($pdoSqliteLoaded) {
    try {
        $db = getDb();
        $count = (int)$db->query('SELECT COUNT(*) FROM circuits')->fetchColumn();
        $status['circuits_count'] = $count;
        $status['connected'] = true;
    } catch (Throwable $e) {
        $status['connected'] = false;
        $status['db_error'] = $e->getMessage();
    }
} else {
    $status['connected'] = false;
    $status['db_error'] = 'PHP pdo_sqlite extension is not loaded';
}

sendJsonResponse(200, ['success' => true, 'data' => $status]);
