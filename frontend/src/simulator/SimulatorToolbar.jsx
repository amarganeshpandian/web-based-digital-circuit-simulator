import React, { useRef } from 'react';

export function SimulatorToolbar({
  circuitTitle,
  onChangeTitle,
  backendStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onClearCircuit,
  onSaveCircuit,
  onExportJSON,
  onImportJSON,
  onOpenTruthTable,
  hasSelection,
  onDeleteSelected
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onImportJSON(event.target.result);
      // Reset input
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="simulator-toolbar d-flex flex-wrap align-items-center justify-content-between px-3 py-2 bg-dark text-light border-bottom border-secondary border-opacity-25 gap-2">
      {/* Circuit Title & Backend Status */}
      <div className="d-flex align-items-center gap-2">
        <input
          type="text"
          className="form-control form-control-sm bg-black bg-opacity-40 border-secondary border-opacity-50 text-light fw-bold"
          style={{ width: '220px' }}
          value={circuitTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="Untitled Circuit"
        />

        {/* Backend health status badge */}
        <span
          className={`badge d-flex align-items-center gap-1 ${backendStatus?.online ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50' : 'bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50'}`}
          title={backendStatus?.online ? `Connected to SQLite (${backendStatus.database_path})` : 'Offline / Standalone mode: saving to browser localStorage'}
        >
          <span
            className="rounded-circle d-inline-block"
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: backendStatus?.online ? '#10b981' : '#f59e0b'
            }}
          />
          {backendStatus?.online ? 'SQLite Active' : 'Local Storage'}
        </span>
      </div>

      {/* Editing & History Controls */}
      <div className="d-flex align-items-center gap-1">
        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>

        <div className="vr bg-secondary mx-1 opacity-25"></div>

        {/* Zoom Controls */}
        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <i className="bi bi-zoom-out"></i>
        </button>
        <span className="small text-secondary px-1 font-monospace" style={{ minWidth: '42px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <i className="bi bi-zoom-in"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50"
          onClick={onResetZoom}
          title="Reset Zoom to 100%"
        >
          <i className="bi bi-aspect-ratio"></i>
        </button>

        <div className="vr bg-secondary mx-1 opacity-25"></div>

        {/* Delete / Clear Controls */}
        {hasSelection && (
          <button
            className="btn btn-sm btn-outline-warning border-warning border-opacity-50 d-flex align-items-center gap-1"
            onClick={onDeleteSelected}
            title="Delete Selected Component or Wire (Del)"
          >
            <i className="bi bi-x-circle"></i>
            <span>Delete Selected</span>
          </button>
        )}
        <button
          className="btn btn-sm btn-outline-danger border-danger border-opacity-50 d-flex align-items-center gap-1"
          onClick={onClearCircuit}
          title="Clear Entire Canvas (Reset all components and wires)"
        >
          <i className="bi bi-trash3-fill"></i>
          <span>Clear Canvas</span>
        </button>
      </div>

      {/* File & Export Actions */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
          onClick={onOpenTruthTable}
        >
          <i className="bi bi-table"></i>
          Truth Table
        </button>

        {/* Hidden file input for import */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json,application/json"
          onChange={handleFileChange}
        />
        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 d-flex align-items-center gap-1"
          onClick={() => fileInputRef.current?.click()}
          title="Import JSON circuit file"
        >
          <i className="bi bi-upload"></i>
          Import
        </button>

        <button
          className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 d-flex align-items-center gap-1"
          onClick={onExportJSON}
          title="Export circuit as JSON file"
        >
          <i className="bi bi-download"></i>
          Export
        </button>

        <button
          className="btn btn-sm btn-primary d-flex align-items-center gap-1"
          onClick={onSaveCircuit}
        >
          <i className="bi bi-floppy"></i>
          Save
        </button>
      </div>
    </div>
  );
}
