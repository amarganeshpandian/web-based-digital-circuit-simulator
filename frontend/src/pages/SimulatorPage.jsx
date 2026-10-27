import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComponentLibrary } from '../simulator/ComponentLibrary';
import { CircuitCanvas } from '../simulator/CircuitCanvas';
import { InspectorPanel } from '../simulator/InspectorPanel';
import { SimulatorToolbar } from '../simulator/SimulatorToolbar';
import { TimingDiagram } from '../simulator/TimingDiagram';
import { TruthTableModal } from '../simulator/TruthTableModal';

import {
  createComponentInstance,
  removeComponentFromGraph,
  removeWireFromGraph,
  cloneGraph
} from '../circuit/graph';
import { evaluateCircuit, stepSequentialState } from '../circuit/evaluator';
import { SignalHistoryRecorder } from '../circuit/history';
import { circuitStorage } from '../services/circuitStorage';
import { LESSONS } from '../data/lessons';

export function SimulatorPage() {
  const [searchParams] = useSearchParams();

  // Primary circuit state
  const [circuit, setCircuit] = useState({
    id: null,
    title: 'New Digital Circuit',
    description: '',
    components: [],
    wires: []
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Selection states
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedWireId, setSelectedWireId] = useState(null);

  // Canvas Viewport transform
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });

  // Right Inspector Tab: 'properties' | 'timing'
  const [activeRightTab, setActiveRightTab] = useState('properties');

  // Truth Table modal state
  const [showTruthTable, setShowTruthTable] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Backend Health Status
  const [backendStatus, setBackendStatus] = useState(null);

  // Clock Simulation & Timing State
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [clockSpeed, setClockSpeed] = useState(500); // 2Hz default
  const [historyRecorder] = useState(() => new SignalHistoryRecorder(50));
  const [monitoredSignalIds, setMonitoredSignalIds] = useState([]);
  const [timingTick, setTimingTick] = useState(0);

  // Simulation Evaluation State
  const [simulationResult, setSimulationResult] = useState(() => evaluateCircuit({ components: [], wires: [] }));

  // Check backend health on mount
  useEffect(() => {
    circuitStorage.checkBackendHealth().then(setBackendStatus);
  }, []);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Push new state to undo/redo history
  const pushHistory = useCallback((newGraph) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, cloneGraph(newGraph)].slice(-30); // keep up to 30 steps
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Record a waveform step snapshot strictly on clock ticks or input toggles
  const recordTimingSnapshot = useCallback((graph, evalRes) => {
    const monitored = graph.components
      .filter(c => ['CLOCK', 'SWITCH', 'LED', 'PROBE', 'D_FLIPFLOP', 'SR_FLIPFLOP', 'JK_FLIPFLOP', 'T_FLIPFLOP', 'BINARY_COUNTER_4BIT'].includes(c.type))
      .map(c => {
        let val = 0;
        if (c.type === 'CLOCK' || c.type === 'SWITCH') {
          val = c.state?.value ?? 0;
        } else if (c.type === 'LED' || c.type === 'PROBE') {
          val = evalRes.pinValues[c.id]?.in ?? 0;
        } else if (['D_FLIPFLOP', 'SR_FLIPFLOP', 'JK_FLIPFLOP', 'T_FLIPFLOP'].includes(c.type)) {
          val = c.state?.q ?? 0;
        } else if (c.type === 'BINARY_COUNTER_4BIT') {
          val = evalRes.pinValues[c.id]?.rco ?? 0;
        }
        return {
          id: c.id,
          name: c.label || c.type,
          val
        };
      });

    if (monitored.length > 0) {
      historyRecorder.recordStep(monitored);
      setTimingTick(t => t + 1);
    }
  }, [historyRecorder]);

  // Reevaluate circuit whenever components, wires, or states change
  // Moving components or dragging wires does NOT record waveform ticks!
  useEffect(() => {
    const res = evaluateCircuit(circuit);
    setSimulationResult(res);
  }, [circuit]);

  // Handle Load from Query Parameter (e.g. ?load=boolean-basics or ?circuit=xyz)
  useEffect(() => {
    const loadLessonId = searchParams.get('load');
    const loadCircuitId = searchParams.get('circuit');

    if (loadLessonId) {
      const lesson = LESSONS.find(l => l.id === loadLessonId);
      if (lesson && lesson.circuit) {
        const loaded = {
          id: null,
          title: lesson.title,
          description: lesson.summary,
          components: cloneGraph(lesson.circuit).components,
          wires: cloneGraph(lesson.circuit).wires
        };
        setCircuit(loaded);
        setHistory([cloneGraph(loaded)]);
        setHistoryIndex(0);
        historyRecorder.reset();
        setTimingTick(0);
        const evalRes = evaluateCircuit(loaded);
        recordTimingSnapshot(loaded, evalRes);
        showToast(`Loaded lesson: ${lesson.title}`, 'success');
        return;
      }
    }

    if (loadCircuitId) {
      circuitStorage.getCircuit(loadCircuitId).then(({ circuit: c }) => {
        const loaded = {
          id: c.id,
          title: c.title,
          description: c.description || '',
          components: c.circuit_data?.components || c.components || [],
          wires: c.circuit_data?.wires || c.wires || []
        };
        setCircuit(loaded);
        setHistory([cloneGraph(loaded)]);
        setHistoryIndex(0);
        historyRecorder.reset();
        setTimingTick(0);
        const evalRes = evaluateCircuit(loaded);
        recordTimingSnapshot(loaded, evalRes);
        showToast(`Loaded circuit: ${c.title}`, 'success');
      }).catch(err => {
        showToast(`Failed to load circuit: ${err.message}`, 'danger');
      });
    }
  }, [searchParams, historyRecorder, recordTimingSnapshot]);

  // Clock generation timer - strictly advances timing snapshots on clock ticks
  useEffect(() => {
    if (!isClockRunning) return;

    const interval = setInterval(() => {
      setCircuit(prevCircuit => {
        // Toggle CLOCK components
        const updatedComps = prevCircuit.components.map(c => {
          if (c.type === 'CLOCK') {
            return {
              ...c,
              state: { ...c.state, value: c.state?.value ? 0 : 1 }
            };
          }
          return c;
        });

        // Intermediate combinational evaluation
        const intermediateGraph = { ...prevCircuit, components: updatedComps };
        const evalRes = evaluateCircuit(intermediateGraph);

        // Advance sequential edge-triggered states
        const { updatedComponents } = stepSequentialState(updatedComps, evalRes.pinValues);
        const finalGraph = { ...prevCircuit, components: updatedComponents };
        const finalEval = evaluateCircuit(finalGraph);

        // Record timing snapshot strictly on clock edge tick
        recordTimingSnapshot(finalGraph, finalEval);

        return finalGraph;
      });
    }, clockSpeed);

    return () => clearInterval(interval);
  }, [isClockRunning, clockSpeed, recordTimingSnapshot]);

  // Single step clock edge
  const handleStepClock = () => {
    setCircuit(prevCircuit => {
      // Toggle CLOCK or pulse
      const updatedComps = prevCircuit.components.map(c => {
        if (c.type === 'CLOCK') {
          return {
            ...c,
            state: { ...c.state, value: c.state?.value ? 0 : 1 }
          };
        }
        return c;
      });

      const intermediateGraph = { ...prevCircuit, components: updatedComps };
      const evalRes = evaluateCircuit(intermediateGraph);
      const { updatedComponents } = stepSequentialState(updatedComps, evalRes.pinValues);
      const finalGraph = { ...prevCircuit, components: updatedComponents };
      const finalEval = evaluateCircuit(finalGraph);

      recordTimingSnapshot(finalGraph, finalEval);

      return finalGraph;
    });
  };

  const handleResetSimulation = () => {
    setIsClockRunning(false);
    historyRecorder.reset();
    setTimingTick(0);
    setCircuit(prevCircuit => {
      const resetComps = prevCircuit.components.map(c => ({
        ...c,
        state: {
          ...(c.state || {}),
          value: c.type === 'SWITCH' ? (c.state?.value || 0) : 0,
          q: 0,
          count: 0,
          val: 0,
          prevClk: 0
        }
      }));
      const resetGraph = { ...prevCircuit, components: resetComps };
      const evalRes = evaluateCircuit(resetGraph);
      recordTimingSnapshot(resetGraph, evalRes);
      return resetGraph;
    });
    showToast('Simulation state reset to zero', 'info');
  };

  // ---------------- Undo / Redo Handlers ----------------
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setCircuit(cloneGraph(prev));
      setHistoryIndex(historyIndex - 1);
      setSelectedComponentId(null);
      setSelectedWireId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setCircuit(cloneGraph(next));
      setHistoryIndex(historyIndex + 1);
      setSelectedComponentId(null);
      setSelectedWireId(null);
    }
  };

  // ---------------- Canvas Component Actions ----------------
  const handleAddComponent = (type, customX = null, customY = null) => {
    // Default place near viewport center if not dropped
    const x = customX !== null ? customX : Math.round((-pan.x + 300) / 20) * 20;
    const y = customY !== null ? customY : Math.round((-pan.y + 200) / 20) * 20;

    const newComp = createComponentInstance(type, Math.max(20, x), Math.max(20, y));
    const nextCircuit = {
      ...circuit,
      components: [...circuit.components, newComp]
    };

    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    setSelectedComponentId(newComp.id);
    setSelectedWireId(null);
  };

  const handleMoveComponent = (componentId, x, y) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === componentId ? { ...c, x, y } : c)
    }));
  };

  const handleToggleSwitch = (componentId, explicitVal = null) => {
    setCircuit(prev => {
      const updatedComps = prev.components.map(c => {
        if (c.id === componentId) {
          const newVal = explicitVal !== null ? explicitVal : (c.state?.value ? 0 : 1);
          return {
            ...c,
            state: { ...c.state, value: newVal }
          };
        }
        return c;
      });
      const updatedGraph = { ...prev, components: updatedComps };
      const evalRes = evaluateCircuit(updatedGraph);
      recordTimingSnapshot(updatedGraph, evalRes);
      return updatedGraph;
    });
  };

  const handleUpdateComponentLabel = (componentId, label) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === componentId ? { ...c, label } : c)
    }));
  };

  const handleUpdateComponentState = (componentId, stateUpdate) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === componentId ? { ...c, state: { ...c.state, ...stateUpdate } } : c)
    }));
  };

  const handleDeleteComponent = (componentId) => {
    const nextCircuit = removeComponentFromGraph(circuit, componentId);
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    setSelectedComponentId(null);
  };

  const handleAddWire = (normalizedWire) => {
    let newWires = circuit.wires;
    if (normalizedWire.replaceWireId) {
      newWires = newWires.filter(w => w.id !== normalizedWire.replaceWireId);
    }
    const nextCircuit = {
      ...circuit,
      wires: [...newWires, normalizedWire]
    };
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
  };

  const handleDeleteWire = (wireId) => {
    const nextCircuit = removeWireFromGraph(circuit, wireId);
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    setSelectedWireId(null);
  };

  const handleDeleteSelected = () => {
    if (selectedComponentId) {
      handleDeleteComponent(selectedComponentId);
    } else if (selectedWireId) {
      handleDeleteWire(selectedWireId);
    } else {
      // If user clicks delete/bin without selection, clear the canvas
      handleClearCircuit();
    }
  };

  const handleClearCircuit = () => {
    if (circuit.components.length === 0 && circuit.wires.length === 0) {
      showToast('Canvas is already empty', 'info');
      return;
    }

    const cleared = {
      ...circuit,
      components: [],
      wires: []
    };
    setCircuit(cleared);
    pushHistory(cleared);
    setSelectedComponentId(null);
    setSelectedWireId(null);
    historyRecorder.reset();
    setTimingTick(0);
    showToast('Canvas cleared — Click Undo (Ctrl+Z) to restore', 'info');
  };

  // ---------------- Save / Export / Import ----------------
  const handleSaveCircuit = async () => {
    try {
      const res = await circuitStorage.saveCircuit({
        id: circuit.id,
        title: circuit.title,
        description: circuit.description,
        circuit_data: {
          components: circuit.components,
          wires: circuit.wires
        }
      });
      if (res.success) {
        setCircuit(prev => ({ ...prev, id: res.id }));
        showToast(
          res.source === 'backend'
            ? 'Circuit saved to SQLite database!'
            : 'Circuit saved locally (standalone mode)!',
          'success'
        );
      }
    } catch (err) {
      showToast(`Save error: ${err.message}`, 'danger');
    }
  };

  const handleExportJSON = () => {
    circuitStorage.exportToFile(circuit);
    showToast('Circuit exported as JSON file', 'success');
  };

  const handleImportJSON = (jsonText) => {
    const res = circuitStorage.importFromFile(jsonText);
    if (!res.success) {
      showToast(`Import failed: ${res.error}`, 'danger');
      return;
    }

    const imported = {
      id: null,
      title: res.circuit.title,
      description: res.circuit.description,
      components: res.circuit.components,
      wires: res.circuit.wires
    };

    setCircuit(imported);
    pushHistory(imported);
    setSelectedComponentId(null);
    setSelectedWireId(null);
    showToast(`Successfully imported: ${res.circuit.title}`, 'success');
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in text inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if (e.key === 'Escape') {
        setSelectedComponentId(null);
        setSelectedWireId(null);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, selectedWireId, historyIndex, history]);

  // Monitored channels list for Timing Diagram
  const availableSignals = circuit.components
    .filter(c => ['CLOCK', 'SWITCH', 'LED', 'PROBE', 'D_FLIPFLOP', 'BINARY_COUNTER_4BIT'].includes(c.type))
    .map(c => ({ id: c.id, name: c.label || c.type }));

  const handleToggleSignal = (id) => {
    setMonitoredSignalIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedComponent = circuit.components.find(c => c.id === selectedComponentId);
  const selectedWire = circuit.wires.find(w => w.id === selectedWireId);

  return (
    <div className="simulator-page d-flex flex-column vh-100 bg-dark overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`position-fixed bottom-0 end-0 m-4 z-3 alert alert-${toastMessage.type} shadow-lg py-2 px-3 d-flex align-items-center gap-2`}
        >
          <i className={`bi bi-${toastMessage.type === 'success' ? 'check-circle-fill' : 'info-circle-fill'}`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Simulator Toolbar */}
      <SimulatorToolbar
        circuitTitle={circuit.title}
        onChangeTitle={(title) => setCircuit(c => ({ ...c, title }))}
        backendStatus={backendStatus}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(2.0, Number((z + 0.1).toFixed(2))))}
        onZoomOut={() => setZoom(z => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
        onResetZoom={() => { setZoom(1); setPan({ x: 40, y: 40 }); }}
        onClearCircuit={handleClearCircuit}
        onSaveCircuit={handleSaveCircuit}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onOpenTruthTable={() => setShowTruthTable(true)}
        hasSelection={Boolean(selectedComponentId || selectedWireId)}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* 3-Panel Main Layout */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Left Panel: Component Library */}
        <ComponentLibrary onAddComponent={handleAddComponent} />

        {/* Center Panel: SVG Circuit Canvas & Bottom Timing Diagram */}
        <div className="d-flex flex-column flex-grow-1 overflow-hidden position-relative">
          <div className="flex-grow-1 h-100">
            <CircuitCanvas
              circuit={circuit}
              pinValues={simulationResult.pinValues}
              wireValues={simulationResult.wireValues}
              selectedComponentId={selectedComponentId}
              selectedWireId={selectedWireId}
              onSelectComponent={setSelectedComponentId}
              onSelectWire={setSelectedWireId}
              onMoveComponent={handleMoveComponent}
              onAddWire={handleAddWire}
              onDeleteComponent={handleDeleteComponent}
              onDeleteWire={handleDeleteWire}
              onToggleSwitch={handleToggleSwitch}
              hasCycle={simulationResult.hasCycle}
              zoom={zoom}
              pan={pan}
              setPan={setPan}
              onDropComponent={handleAddComponent}
            />
          </div>

          {/* Collapsible Bottom Timing Dock when Timing Tab selected */}
          {activeRightTab === 'timing' && (
            <div className="timing-dock border-top border-secondary border-opacity-25" style={{ height: '290px' }}>
              <TimingDiagram
                historyRecorder={historyRecorder}
                selectedSignalIds={monitoredSignalIds}
                onToggleSignal={handleToggleSignal}
                availableSignals={availableSignals}
                isClockRunning={isClockRunning}
                onToggleClock={() => setIsClockRunning(r => !r)}
                onStepClock={handleStepClock}
                onResetClock={handleResetSimulation}
                clockSpeed={clockSpeed}
                onChangeClockSpeed={setClockSpeed}
                timingTick={timingTick}
              />
            </div>
          )}
        </div>

        {/* Right Panel: Inspector */}
        <InspectorPanel
          selectedComponent={selectedComponent}
          selectedWire={selectedWire}
          circuit={circuit}
          pinValues={simulationResult.pinValues}
          wireValues={simulationResult.wireValues}
          onUpdateComponentLabel={handleUpdateComponentLabel}
          onUpdateComponentState={handleUpdateComponentState}
          onDeleteComponent={handleDeleteComponent}
          onDeleteWire={handleDeleteWire}
          onOpenTruthTable={() => setShowTruthTable(true)}
          onToggleClock={() => setIsClockRunning(r => !r)}
          onStepClock={handleStepClock}
          onResetSimulation={handleResetSimulation}
          isClockRunning={isClockRunning}
          activeRightTab={activeRightTab}
          setActiveRightTab={setActiveRightTab}
        />
      </div>

      {/* Truth Table Generator Modal */}
      {showTruthTable && (
        <TruthTableModal
          circuit={circuit}
          onClose={() => setShowTruthTable(false)}
        />
      )}
    </div>
  );
}
