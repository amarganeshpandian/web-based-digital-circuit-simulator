<?php
/**
 * LogicLab - SQLite Database Initialization Script
 * Auto-creates the SQLite database and schemas if not present.
 */

declare(strict_types=1);

// Prevent direct execution output pollution if included
if (!defined('LOGICLAB_ROOT')) {
    define('LOGICLAB_ROOT', dirname(__DIR__));
}

function getDatabasePath(): string {
    $dbDir = LOGICLAB_ROOT . DIRECTORY_SEPARATOR . 'database';
    if (!is_dir($dbDir)) {
        mkdir($dbDir, 0755, true);
    }
    return $dbDir . DIRECTORY_SEPARATOR . 'logiclab.sqlite';
}

function getDatabaseConnection(): PDO {
    if (!extension_loaded('pdo_sqlite')) {
        throw new RuntimeException("The PHP 'pdo_sqlite' extension is required but not enabled.");
    }

    $dbFile = getDatabasePath();
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON;');
    return $pdo;
}

function initializeDatabase(?PDO $pdo = null): array {
    if ($pdo === null) {
        $pdo = getDatabaseConnection();
    }

    // 1. Users table
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ');

    // 2. Circuits table
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS circuits (
            id TEXT PRIMARY KEY,
            user_id INTEGER NULL,
            title TEXT NOT NULL,
            description TEXT,
            circuit_data TEXT NOT NULL,
            is_public INTEGER DEFAULT 1,
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
    ');

    // 3. Lessons progress table
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS lessons_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NULL,
            lesson_id TEXT NOT NULL,
            completed INTEGER DEFAULT 1,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, lesson_id)
        );
    ');

    // 4. Seed built-in circuits if table is empty
    $count = (int)$pdo->query('SELECT COUNT(*) FROM circuits')->fetchColumn();
    $seededCount = 0;

    if ($count === 0) {
        $starterCircuits = [
            [
                'id' => 'half-adder-template',
                'title' => 'Half Adder',
                'description' => 'Calculates Sum (A XOR B) and Carry (A AND B) for two 1-bit binary inputs.',
                'tags' => 'arithmetic,adder,basic',
                'data' => json_encode([
                    'components' => [
                        ['id' => 'sw-a', 'type' => 'SWITCH', 'x' => 120, 'y' => 140, 'label' => 'Input A', 'state' => ['value' => 0]],
                        ['id' => 'sw-b', 'type' => 'SWITCH', 'x' => 120, 'y' => 260, 'label' => 'Input B', 'state' => ['value' => 0]],
                        ['id' => 'xor-1', 'type' => 'XOR', 'x' => 320, 'y' => 140, 'label' => 'Sum (XOR)', 'state' => [:]],
                        ['id' => 'and-1', 'type' => 'AND', 'x' => 320, 'y' => 260, 'label' => 'Carry (AND)', 'state' => [:]],
                        ['id' => 'led-s', 'type' => 'LED', 'x' => 520, 'y' => 140, 'label' => 'Sum (S)', 'state' => ['color' => '#10b981']],
                        ['id' => 'led-c', 'type' => 'LED', 'x' => 520, 'y' => 260, 'label' => 'Carry (C)', 'state' => ['color' => '#3b82f6']],
                    ],
                    'wires' => [
                        ['id' => 'w1', 'from' => ['componentId' => 'sw-a', 'pinId' => 'out'], 'to' => ['componentId' => 'xor-1', 'pinId' => 'in1']],
                        ['id' => 'w2', 'from' => ['componentId' => 'sw-b', 'pinId' => 'out'], 'to' => ['componentId' => 'xor-1', 'pinId' => 'in2']],
                        ['id' => 'w3', 'from' => ['componentId' => 'sw-a', 'pinId' => 'out'], 'to' => ['componentId' => 'and-1', 'pinId' => 'in1']],
                        ['id' => 'w4', 'from' => ['componentId' => 'sw-b', 'pinId' => 'out'], 'to' => ['componentId' => 'and-1', 'pinId' => 'in2']],
                        ['id' => 'w5', 'from' => ['componentId' => 'xor-1', 'pinId' => 'out'], 'to' => ['componentId' => 'led-s', 'pinId' => 'in']],
                        ['id' => 'w6', 'from' => ['componentId' => 'and-1', 'pinId' => 'out'], 'to' => ['componentId' => 'led-c', 'pinId' => 'in']],
                    ]
                ], JSON_UNESCAPED_SLASHES)
            ],
            [
                'id' => 'mux-2to1-template',
                'title' => '2-to-1 Multiplexer',
                'description' => 'Selects between Input I0 (when Sel=0) and Input I1 (when Sel=1).',
                'tags' => 'multiplexer,combinational,routing',
                'data' => json_encode([
                    'components' => [
                        ['id' => 'sw-i0', 'type' => 'SWITCH', 'x' => 100, 'y' => 120, 'label' => 'Data I0', 'state' => ['value' => 1]],
                        ['id' => 'sw-i1', 'type' => 'SWITCH', 'x' => 100, 'y' => 220, 'label' => 'Data I1', 'state' => ['value' => 0]],
                        ['id' => 'sw-sel', 'type' => 'SWITCH', 'x' => 100, 'y' => 320, 'label' => 'Select (S)', 'state' => ['value' => 0]],
                        ['id' => 'mux-1', 'type' => 'MUX_2TO1', 'x' => 320, 'y' => 180, 'label' => '2:1 MUX', 'state' => [:]],
                        ['id' => 'led-y', 'type' => 'LED', 'x' => 500, 'y' => 180, 'label' => 'Output (Y)', 'state' => ['color' => '#f59e0b']]
                    ],
                    'wires' => [
                        ['id' => 'w1', 'from' => ['componentId' => 'sw-i0', 'pinId' => 'out'], 'to' => ['componentId' => 'mux-1', 'pinId' => 'i0']],
                        ['id' => 'w2', 'from' => ['componentId' => 'sw-i1', 'pinId' => 'out'], 'to' => ['componentId' => 'mux-1', 'pinId' => 'i1']],
                        ['id' => 'w3', 'from' => ['componentId' => 'sw-sel', 'pinId' => 'out'], 'to' => ['componentId' => 'mux-1', 'pinId' => 'sel']],
                        ['id' => 'w4', 'from' => ['componentId' => 'mux-1', 'pinId' => 'out'], 'to' => ['componentId' => 'led-y', 'pinId' => 'in']]
                    ]
                ], JSON_UNESCAPED_SLASHES)
            ],
            [
                'id' => 'd-flipflop-clocked-template',
                'title' => 'Clocked D Flip-Flop with Timing Monitor',
                'description' => 'Positive edge-triggered D flip-flop with automated clock generator and output monitoring.',
                'tags' => 'sequential,flip-flop,clock',
                'data' => json_encode([
                    'components' => [
                        ['id' => 'clk-1', 'type' => 'CLOCK', 'x' => 120, 'y' => 160, 'label' => 'Clock Gen', 'state' => ['frequency' => 1]],
                        ['id' => 'sw-d', 'type' => 'SWITCH', 'x' => 120, 'y' => 260, 'label' => 'Data Input (D)', 'state' => ['value' => 1]],
                        ['id' => 'dff-1', 'type' => 'D_FLIPFLOP', 'x' => 320, 'y' => 180, 'label' => 'D Flip-Flop', 'state' => ['q' => 0]],
                        ['id' => 'led-q', 'type' => 'LED', 'x' => 500, 'y' => 160, 'label' => 'Output Q', 'state' => ['color' => '#10b981']],
                        ['id' => 'led-qn', 'type' => 'LED', 'x' => 500, 'y' => 240, 'label' => 'Output ~Q', 'state' => ['color' => '#ef4444']]
                    ],
                    'wires' => [
                        ['id' => 'w1', 'from' => ['componentId' => 'clk-1', 'pinId' => 'out'], 'to' => ['componentId' => 'dff-1', 'pinId' => 'clk']],
                        ['id' => 'w2', 'from' => ['componentId' => 'sw-d', 'pinId' => 'out'], 'to' => ['componentId' => 'dff-1', 'pinId' => 'd']],
                        ['id' => 'w3', 'from' => ['componentId' => 'dff-1', 'pinId' => 'q'], 'to' => ['componentId' => 'led-q', 'pinId' => 'in']],
                        ['id' => 'w4', 'from' => ['componentId' => 'dff-1', 'pinId' => 'qn'], 'to' => ['componentId' => 'led-qn', 'pinId' => 'in']]
                    ]
                ], JSON_UNESCAPED_SLASHES)
            ]
        ];

        $stmt = $pdo->prepare('
            INSERT INTO circuits (id, user_id, title, description, circuit_data, is_public, tags)
            VALUES (:id, NULL, :title, :description, :circuit_data, 1, :tags)
        ');

        foreach ($starterCircuits as $sc) {
            $stmt->execute([
                ':id' => $sc['id'],
                ':title' => $sc['title'],
                ':description' => $sc['description'],
                ':circuit_data' => $sc['data'],
                ':tags' => $sc['tags']
            ]);
            $seededCount++;
        }
    }

    return [
        'success' => true,
        'message' => 'Database initialized successfully',
        'database_file' => getDatabasePath(),
        'seeded_templates' => $seededCount
    ];
}

// If invoked directly from CLI or web
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    header('Content-Type: application/json; charset=utf-8');
    try {
        $result = initializeDatabase();
        echo json_encode($result, JSON_PRETTY_PRINT);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ], JSON_PRETTY_PRINT);
    }
}
