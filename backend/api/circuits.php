<?php
/**
 * LogicLab - Circuits API
 * Handles CRUD operations for digital logic circuits
 */

declare(strict_types=1);

define('LOGICLAB_ROOT', dirname(__DIR__));
require_once LOGICLAB_ROOT . '/config/database.php';

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(200, ['status' => 'ok']);
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDb();

    switch ($method) {
        case 'GET':
            if (isset($_GET['id']) && trim($_GET['id']) !== '') {
                $id = trim($_GET['id']);
                $stmt = $db->prepare('SELECT id, user_id, title, description, circuit_data, is_public, tags, created_at, updated_at FROM circuits WHERE id = :id');
                $stmt->execute([':id' => $id]);
                $circuit = $stmt->fetch();

                if (!$circuit) {
                    sendJsonResponse(404, ['success' => false, 'error' => 'Circuit not found']);
                }

                // Decode circuit_data JSON
                $circuit['circuit_data'] = json_decode($circuit['circuit_data'], true);
                sendJsonResponse(200, ['success' => true, 'data' => $circuit]);
            } else {
                // List circuits
                $search = isset($_GET['search']) ? '%' . trim($_GET['search']) . '%' : null;
                if ($search) {
                    $stmt = $db->prepare('
                        SELECT id, title, description, tags, created_at, updated_at 
                        FROM circuits 
                        WHERE title LIKE :search OR description LIKE :search OR tags LIKE :search
                        ORDER BY updated_at DESC
                    ');
                    $stmt->execute([':search' => $search]);
                } else {
                    $stmt = $db->query('
                        SELECT id, title, description, tags, created_at, updated_at 
                        FROM circuits 
                        ORDER BY updated_at DESC
                    ');
                }
                $list = $stmt->fetchAll();
                sendJsonResponse(200, ['success' => true, 'data' => $list]);
            }
            break;

        case 'POST':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true);

            if (!is_array($payload)) {
                sendJsonResponse(400, ['success' => false, 'error' => 'Invalid JSON payload']);
            }

            $title = trim((string)($payload['title'] ?? 'Untitled Circuit'));
            if ($title === '') {
                $title = 'Untitled Circuit';
            }
            $description = trim((string)($payload['description'] ?? ''));
            $tags = trim((string)($payload['tags'] ?? 'custom'));
            $circuitData = $payload['circuit_data'] ?? $payload['data'] ?? null;

            if (!$circuitData || !is_array($circuitData)) {
                sendJsonResponse(400, ['success' => false, 'error' => 'Missing or invalid circuit_data']);
            }

            // Generate UUID-like ID or accept provided unique ID
            $id = !empty($payload['id']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$payload['id']) : 'c_' . bin2hex(random_bytes(8));
            $jsonString = json_encode($circuitData, JSON_UNESCAPED_SLASHES);

            $stmt = $db->prepare('
                INSERT INTO circuits (id, user_id, title, description, circuit_data, is_public, tags, created_at, updated_at)
                VALUES (:id, NULL, :title, :description, :circuit_data, 1, :tags, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ');
            $stmt->execute([
                ':id' => $id,
                ':title' => $title,
                ':description' => $description,
                ':circuit_data' => $jsonString,
                ':tags' => $tags
            ]);

            sendJsonResponse(201, [
                'success' => true,
                'message' => 'Circuit saved successfully',
                'id' => $id
            ]);
            break;

        case 'PUT':
            $id = isset($_GET['id']) ? trim($_GET['id']) : '';
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true);

            if (!$id && !empty($payload['id'])) {
                $id = trim($payload['id']);
            }

            if (!$id) {
                sendJsonResponse(400, ['success' => false, 'error' => 'Circuit ID is required for update']);
            }

            if (!is_array($payload)) {
                sendJsonResponse(400, ['success' => false, 'error' => 'Invalid JSON payload']);
            }

            // Check existence
            $stmt = $db->prepare('SELECT id FROM circuits WHERE id = :id');
            $stmt->execute([':id' => $id]);
            if (!$stmt->fetch()) {
                sendJsonResponse(404, ['success' => false, 'error' => 'Circuit not found']);
            }

            $title = trim((string)($payload['title'] ?? ''));
            $description = isset($payload['description']) ? trim((string)$payload['description']) : null;
            $circuitData = $payload['circuit_data'] ?? $payload['data'] ?? null;

            $updateFields = [];
            $params = [':id' => $id];

            if ($title !== '') {
                $updateFields[] = 'title = :title';
                $params[':title'] = $title;
            }
            if ($description !== null) {
                $updateFields[] = 'description = :description';
                $params[':description'] = $description;
            }
            if ($circuitData !== null && is_array($circuitData)) {
                $updateFields[] = 'circuit_data = :circuit_data';
                $params[':circuit_data'] = json_encode($circuitData, JSON_UNESCAPED_SLASHES);
            }
            if (isset($payload['tags'])) {
                $updateFields[] = 'tags = :tags';
                $params[':tags'] = trim((string)$payload['tags']);
            }

            $updateFields[] = 'updated_at = CURRENT_TIMESTAMP';

            $sql = 'UPDATE circuits SET ' . implode(', ', $updateFields) . ' WHERE id = :id';
            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            sendJsonResponse(200, [
                'success' => true,
                'message' => 'Circuit updated successfully',
                'id' => $id
            ]);
            break;

        case 'DELETE':
            $id = isset($_GET['id']) ? trim($_GET['id']) : '';
            if (!$id) {
                sendJsonResponse(400, ['success' => false, 'error' => 'Circuit ID is required for deletion']);
            }

            $stmt = $db->prepare('DELETE FROM circuits WHERE id = :id');
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() === 0) {
                sendJsonResponse(404, ['success' => false, 'error' => 'Circuit not found']);
            }

            sendJsonResponse(200, [
                'success' => true,
                'message' => 'Circuit deleted successfully',
                'id' => $id
            ]);
            break;

        default:
            sendJsonResponse(405, ['success' => false, 'error' => 'Method not allowed']);
    }
} catch (Throwable $e) {
    sendJsonResponse(500, [
        'success' => false,
        'error' => 'A backend error occurred: ' . $e->getMessage()
    ]);
}
