import React from 'react';
import { COMPONENT_DEFINITIONS } from '../circuit/definitions';

export function InspectorPanel({
  selectedComponent,
  selectedWire,
  circuit,
  pinValues,
  wireValues,
  onUpdateComponentLabel,
  onUpdateComponentState,
  onDeleteComponent,
  onDeleteWire,
  onOpenTruthTable,
  onToggleClock,
  onStepClock,
  onResetSimulation,
  isClockRunning,
  activeRightTab,
  setActiveRightTab
}) {
  const compDef = selectedComponent ? COMPONENT_DEFINITIONS[selectedComponent.type] : null;
  const compInputs = selectedComponent ? pinValues[selectedComponent.id] || {} : {};

  return (
    <div className="inspector-panel d-flex flex-column h-100 bg-dark text-light border-start border-secondary border-opacity-25" style={{ width: '340px' }}>
      {/* Tab Switcher: Properties vs Timing Diagram */}
      <div className="p-2 border-bottom border-secondary border-opacity-25 d-flex gap-1 bg-black bg-opacity-25">
        <button
          className={`btn btn-sm flex-fill ${activeRightTab === 'properties' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setActiveRightTab('properties')}
        >
          <i className="bi bi-sliders me-1"></i>
          Inspector
        </button>
        <button
          className={`btn btn-sm flex-fill ${activeRightTab === 'timing' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setActiveRightTab('timing')}
        >
          <i className="bi bi-activity me-1"></i>
          Timing
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto p-3">
        {/* Quick Simulation Bar */}
        <div className="card bg-black bg-opacity-40 border-secondary border-opacity-25 p-2 mb-3">
          <div className="small text-secondary fw-bold mb-2 text-uppercase letter-spacing-1">
            Engine Controls
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm flex-fill ${isClockRunning ? 'btn-warning' : 'btn-success'} d-flex align-items-center justify-content-center gap-1`}
              onClick={onToggleClock}
            >
              <i className={`bi bi-${isClockRunning ? 'pause-fill' : 'play-fill'}`}></i>
              {isClockRunning ? 'Pause' : 'Run'}
            </button>
            <button
              className="btn btn-sm btn-outline-info flex-fill d-flex align-items-center justify-content-center gap-1"
              onClick={onStepClock}
              disabled={isClockRunning}
            >
              <i className="bi bi-chevron-bar-right"></i>
              Step
            </button>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
              onClick={onResetSimulation}
              title="Reset simulation state"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>

          <button
            className="btn btn-sm btn-outline-primary w-100 mt-2 d-flex align-items-center justify-content-center gap-1"
            onClick={onOpenTruthTable}
          >
            <i className="bi bi-table"></i>
            Truth Table Analysis
          </button>
        </div>

        {/* Selected Component Inspection */}
        {selectedComponent && compDef ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-info d-flex align-items-center gap-2">
                <i className="bi bi-cpu"></i>
                {compDef.name}
              </h6>
              <span className="badge bg-secondary font-monospace">{selectedComponent.type}</span>
            </div>

            <p className="text-secondary small mb-3">{compDef.description}</p>

            {/* Characteristic Equation */}
            {compDef.equation && (
              <div className="mb-3 p-2 rounded bg-black bg-opacity-50 border border-secondary border-opacity-25 font-monospace small">
                <div className="text-secondary text-xs text-uppercase mb-1">Equation:</div>
                <div className="text-info fw-bold">{compDef.equation}</div>
              </div>
            )}

            {/* Component Label Input */}
            <div className="mb-3">
              <label className="form-label small text-secondary">Component Label</label>
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-light border-secondary"
                value={selectedComponent.label || ''}
                onChange={(e) => onUpdateComponentLabel(selectedComponent.id, e.target.value)}
              />
            </div>

            {/* Custom Component Settings */}
            {selectedComponent.type === 'SWITCH' && (
              <div className="mb-3">
                <label className="form-label small text-secondary">Switch State</label>
                <button
                  className={`btn btn-sm w-100 ${selectedComponent.state?.value ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => onUpdateComponentState(selectedComponent.id, { value: selectedComponent.state?.value ? 0 : 1 })}
                >
                  {selectedComponent.state?.value ? 'Logic HIGH (1)' : 'Logic LOW (0)'}
                </button>
              </div>
            )}

            {selectedComponent.type === 'LED' && (
              <div className="mb-3">
                <label className="form-label small text-secondary">LED Color</label>
                <div className="d-flex gap-2">
                  {['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#ec4899'].map(c => (
                    <button
                      key={c}
                      className="btn btn-sm rounded-circle p-2"
                      style={{
                        backgroundColor: c,
                        width: '24px',
                        height: '24px',
                        outline: selectedComponent.state?.color === c ? '2px solid white' : 'none'
                      }}
                      onClick={() => onUpdateComponentState(selectedComponent.id, { color: c })}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedComponent.type === 'CLOCK' && (
              <div className="mb-3">
                <label className="form-label small text-secondary">Clock Frequency</label>
                <select
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  value={selectedComponent.state?.frequency || 1}
                  onChange={(e) => onUpdateComponentState(selectedComponent.id, { frequency: Number(e.target.value) })}
                >
                  <option value={0.5}>0.5 Hz (2 sec period)</option>
                  <option value={1}>1 Hz (1 sec period)</option>
                  <option value={2}>2 Hz</option>
                  <option value={5}>5 Hz</option>
                </select>
              </div>
            )}

            {/* Pin States Table */}
            <div className="mb-3">
              <label className="form-label small text-secondary mb-1">Pin Telemetry</label>
              <div className="border border-secondary border-opacity-25 rounded overflow-hidden">
                <table className="table table-dark table-sm mb-0 small">
                  <thead>
                    <tr className="table-secondary text-dark">
                      <th>Pin</th>
                      <th>Type</th>
                      <th className="text-end">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compDef.pins.map(pin => {
                      const val = compInputs[pin.id];
                      return (
                        <tr key={pin.id}>
                          <td className="fw-bold">{pin.name}</td>
                          <td className="text-secondary text-uppercase">{pin.type}</td>
                          <td className="text-end">
                            <span className={`badge ${val === 1 ? 'bg-success' : val === 0 ? 'bg-secondary' : 'bg-dark'}`}>
                              {val === 1 ? '1' : val === 0 ? '0' : 'Z'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Position Coordinates */}
            <div className="text-secondary small font-monospace mb-3">
              Pos: X={selectedComponent.x}, Y={selectedComponent.y}
            </div>

            {/* Delete Component Button */}
            <button
              className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onDeleteComponent(selectedComponent.id)}
            >
              <i className="bi bi-trash"></i>
              Delete Component
            </button>
          </div>
        ) : selectedWire ? (
          <div>
            <h6 className="text-info d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-bezier2"></i>
              Wire Connection
            </h6>
            <div className="card bg-black bg-opacity-40 border-secondary border-opacity-25 p-2 small font-monospace mb-3">
              <div>From: <strong>{selectedWire.from.componentId}</strong> ({selectedWire.from.pinId})</div>
              <div>To: <strong>{selectedWire.to.componentId}</strong> ({selectedWire.to.pinId})</div>
              <div className="mt-2">
                Level: <span className={`badge ${wireValues[selectedWire.id] ? 'bg-success' : 'bg-secondary'}`}>
                  {wireValues[selectedWire.id] ?? 0}
                </span>
              </div>
            </div>

            <button
              className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onDeleteWire(selectedWire.id)}
            >
              <i className="bi bi-trash"></i>
              Delete Wire
            </button>
          </div>
        ) : (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-cursor-fill fs-2 d-block mb-2 text-secondary opacity-50"></i>
            <div className="fw-semibold">No Selection</div>
            <div className="small mt-1">Click any gate or wire on the canvas to inspect pins, toggle inputs, and adjust parameters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
