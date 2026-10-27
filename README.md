# LogicLab — Interactive Digital Logic Circuit Simulator

**LogicLab** is a full-featured, educational digital logic circuit simulation platform built for computer engineering and computer science students. It enables interactive schematic capture, real-time combinational and sequential simulation, automated truth-table generation, multi-channel waveform timing diagrams, and guided laboratory lessons.

---

## ⚡ Key Features

1. **Visual Circuit Editor (SVG)**:
   - Snapping grid (20px), intuitive drag-and-drop component placement.
   - Click-and-drag wire routing with single-driver input validation.
   - Dynamic wire logic coloring: **Logic 1 (HIGH)** illuminates in electric cyan/emerald with animated current flow; **Logic 0 (LOW)** renders in slate blue.
   - Direct interactive toggle switches and push buttons on the canvas.
   - Pan, zoom (40% to 200%), fit view, and multi-step Undo/Redo.

2. **Complete 22+ Component Catalog**:
   - **Inputs & Outputs**: Toggle Switch, Momentary Push Button, Constant 0 (GND), Constant 1 (VCC), Clock Generator, Indicator LED (custom colors), Logic Signal Probe, 7-Segment Digital Display.
   - **Logic Gates**: AND, OR, NOT (Inverter), NAND, NOR, XOR, XNOR.
   - **Multiplexers & Demultiplexers**: 2:1 MUX, 4:1 MUX, 1:2 DEMUX, 1:4 DEMUX.
   - **Arithmetic Units**: 1-bit Half Adder, 1-bit Full Adder, Half Subtractor, 4-bit Ripple-Carry Adder.
   - **Encoders & Decoders**: 2-to-4 Decoder, 3-to-8 Decoder, 4-to-2 Priority Encoder.
   - **Sequential Storage & Counters**: D Flip-Flop, SR Flip-Flop, JK Flip-Flop, T Flip-Flop, 4-Bit Parallel Register, 4-Bit Serial Shift Register, 4-Bit Synchronous Binary Up-Counter.

3. **In-Browser Simulation Engine**:
   - 100% JavaScript browser-side simulation engine (zero server dependency for logic evaluation).
   - Iterative combinational propagation with combinational loop/oscillation detection.
   - Edge-triggered clock transitions for sequential circuits with pause, run, and single-step edge controls.

4. **Automated Truth Table Generator**:
   - Enumerates all $2^N$ binary combinations of primary switch inputs.
   - Displays real-time output states in an interactive table.
   - One-click **Copy to Clipboard** and **Export to CSV**.

5. **Timing Diagrams & Digital Waveforms**:
   - Canvas-based multi-channel square-wave display for clock, inputs, intermediate gates, flip-flop states, and counters.
   - Time-axis divisions ($T_0, T_5, T_{10}, \dots$), channel selection toggles, and variable clock frequencies ($1\text{ Hz}$ to $10\text{ Hz}$).

6. **Interactive Curriculum Learning Center**:
   - 8 structured lessons covering Boolean algebra, basic gates, adders, multiplexers, decoders, flip-flops, counters, and timing diagrams.
   - Theory explanations, schematics, truth tables, exercises, and **1-click "Open in Simulator"** buttons.

7. **SQLite Persistence & Offline Resilience**:
   - Uses a local SQLite database (`backend/database/logiclab.sqlite`) via PHP PDO.
   - Automatic database file and table creation upon startup.
   - **Zero-Block Standalone Mode**: If PHP is not installed on the system, the frontend automatically falls back to browser `localStorage` and JSON file Import/Export without crashing or losing functionality.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Bootstrap 5, Bootstrap Icons, HTML5 Canvas & SVG.
- **Backend API**: PHP 8+ REST API with PDO SQLite (`logiclab.sqlite`).
- **Testing**: Vitest automated unit tests for gate logic, adders, multiplexers, flip-flops, and truth-table generation.

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites Check

Check that **Node.js (v18+)** is available:
```powershell
node -v
npm -v
```

Check whether **PHP 8+** is installed on your computer:
```powershell
php -v
```

> **What to do if `php` is not recognized?**
>
> 1. You do **not** need a database server like MySQL or Docker.
> 2. You can still immediately run and use the full frontend and circuit simulator! It automatically uses local storage mode.
> 3. To enable the optional PHP + SQLite backend on Windows:
>    - Download the PHP zip (VS16 x64 Thread Safe) from [windows.php.net/download](https://windows.php.net/download/).
>    - Extract it (e.g. to `C:\php`) and add `C:\php` to your Windows `PATH` environment variable.
>    - In `php.ini`, ensure `extension=pdo_sqlite` and `extension=sqlite3` are uncommented.

---

### 2. Starting the Application

For full full-stack operation, start the backend and frontend in separate terminal windows:

#### Terminal 1: Backend API (PHP Built-in Server)
```powershell
# From the project root:
php -S 127.0.0.1:8000 backend/index.php
```
The PHP server will automatically initialize `backend/database/logiclab.sqlite` on first request.
You can verify the backend health in your browser at:
`http://127.0.0.1:8000/api/health`

#### Terminal 2: Frontend (React / Vite)
```powershell
cd frontend
npm install
npm run dev
```
Open your browser and navigate to the Vite local server:
**`http://localhost:5173`**

The Vite development server is pre-configured with a proxy that routes `/api/*` requests directly to `http://127.0.0.1:8000`.

---

## 🧪 Running Automated Tests

Run the Vitest test suite covering logic gates, arithmetic adders, 2:1 multiplexers, edge-triggered flip-flops, binary counters, and truth-table generators:

```powershell
cd frontend
npm test
```

---

## 📁 Project Architecture

```text
web_prog_project/
├── backend/
│   ├── api/
│   │   ├── circuits.php        # REST CRUD API for circuits
│   │   └── health.php          # Diagnostics & SQLite driver check
│   ├── config/
│   │   └── database.php        # PDO connection helper & JSON responder
│   ├── database/
│   │   ├── init.php            # Auto-initializes tables & seeds templates
│   │   └── logiclab.sqlite     # SQLite database file (created automatically)
│   └── index.php               # Front controller & router
├── frontend/
│   ├── src/
│   │   ├── circuit/
│   │   │   ├── components/     # ComponentSVG.jsx, WireSVG.jsx
│   │   │   ├── __tests__/      # Vitest unit test suite
│   │   │   ├── definitions.js  # Catalog metadata, pins, dimensions, equations
│   │   │   ├── evaluator.js    # Combinational & sequential simulation engine
│   │   │   ├── graph.js        # Graph validation, pin positions, wire routing
│   │   │   ├── history.js      # Ring buffer for timing waveform histories
│   │   │   └── truthTable.js   # Automated 2^N truth-table generator & CSV export
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Top navigation header
│   │   ├── data/
│   │   │   └── lessons.js      # Curriculum data with preloaded circuit schematics
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Hero, feature showcase, starter circuit links
│   │   │   ├── SimulatorPage.jsx # 3-panel interactive circuit simulator
│   │   │   ├── LearnPage.jsx   # Learning Center curriculum & interactive labs
│   │   │   ├── CircuitsPage.jsx# Saved circuit manager & file import/export
│   │   │   └── DashboardPage.jsx# Telemetry, diagnostics & verification checklist
│   │   ├── services/
│   │   │   └── circuitStorage.js# Dual-mode SQLite + LocalStorage service
│   │   ├── simulator/
│   │   │   ├── CircuitCanvas.jsx   # SVG canvas with pan, zoom, wire drawing
│   │   │   ├── ComponentLibrary.jsx# Left panel with categories and search
│   │   │   ├── InspectorPanel.jsx  # Right panel with pin telemetry & equations
│   │   │   ├── SimulatorToolbar.jsx# Top actions, undo/redo, save, export
│   │   │   ├── TimingDiagram.jsx   # Real-time multi-channel waveform renderer
│   │   │   └── TruthTableModal.jsx # Truth-table view with CSV export
│   │   ├── App.jsx
│   │   ├── index.css           # High-tech electronics lab CSS design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js          # Proxy config for /api to PHP server
├── .env.example
├── .gitignore
└── README.md
```

---

## 💾 Circuit Export & Import Format

Circuits can be exported and imported as JSON files compatible across sessions:

```json
{
  "app": "LogicLab",
  "version": "1.0.0",
  "title": "Half Adder Circuit",
  "description": "Calculates Sum and Carry",
  "components": [
    { "id": "sw-a", "type": "SWITCH", "x": 120, "y": 140, "label": "Input A", "state": { "value": 1 } },
    { "id": "xor-1", "type": "XOR", "x": 320, "y": 140, "label": "XOR Gate", "state": {} }
  ],
  "wires": [
    {
      "id": "w1",
      "from": { "componentId": "sw-a", "pinId": "out" },
      "to": { "componentId": "xor-1", "pinId": "in1" }
    }
  ]
}
```

---

## 🎓 Acceptance Criteria Verification

- [x] **AND gate**: Evaluated for all 4 input combinations in unit tests and simulator.
- [x] **XOR gate**: Evaluated for all 4 input combinations in unit tests and simulator.
- [x] **2:1 Multiplexer**: Selects correct input based on select bit in unit tests and simulator.
- [x] **Half Adder & Full Adder**: Calculates Sum and Carry across all input combinations.
- [x] **Encoders & Decoders**: 2-to-4 decoder and priority encoder activate expected lines.
- [x] **D Flip-Flop**: Captures $D$ strictly on rising clock edges and holds state between edges.
- [x] **Binary Counter**: Advances synchronously on clock edge and resets to 0.
- [x] **Timing Diagrams**: Live multi-channel square waveforms rendered from real simulation histories.
- [x] **Automated Truth Tables**: Generates complete truth tables with CSV download.
- [x] **Persistence**: Automatic SQLite initialization, PDO prepared statements, and graceful local storage fallback.
