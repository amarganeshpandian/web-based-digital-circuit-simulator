import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ComponentSVG } from '../circuit/components/ComponentSVG';
import { WireSVG, getWirePath } from '../circuit/components/WireSVG';
import { getPinPosition, validateWireConnection } from '../circuit/graph';

export function CircuitCanvas({
  circuit,
  pinValues,
  wireValues,
  selectedComponentId,
  selectedWireId,
  onSelectComponent,
  onSelectWire,
  onMoveComponent,
  onAddWire,
  onDeleteComponent,
  onDeleteWire,
  onToggleSwitch,
  hasCycle,
  zoom,
  pan,
  setPan,
  onDropComponent
}) {
  const containerRef = useRef(null);

  // Wire drawing state: { componentId, pinId, pinType, startPos, currentPos }
  const [connectingPin, setConnectingPin] = useState(null);

  // Component dragging state: { componentId, startMouseX, startMouseY, startCompX, startCompY }
  const [draggingComp, setDraggingComp] = useState(null);

  // Canvas panning state: { startMouseX, startMouseY, startPanX, startPanY }
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Handle pin mouse down: start drawing wire
  const handlePinMouseDown = (componentId, pinId, pinType) => {
    const comp = circuit.components.find(c => c.id === componentId);
    if (!comp) return;

    const pinPos = getPinPosition(comp, pinId);
    setConnectingPin({
      componentId,
      pinId,
      pinType,
      startPos: pinPos,
      currentPos: pinPos
    });
  };

  // Handle pin mouse up: complete wire connection
  const handlePinMouseUp = (componentId, pinId, pinType) => {
    if (!connectingPin) return;

    if (connectingPin.componentId === componentId && connectingPin.pinId === pinId) {
      setConnectingPin(null);
      return;
    }

    const sourceEnd = {
      componentId: connectingPin.componentId,
      pinId: connectingPin.pinId
    };
    const targetEnd = {
      componentId,
      pinId
    };

    const validation = validateWireConnection(circuit, sourceEnd, targetEnd);
    if (validation.valid && validation.normalizedWire) {
      onAddWire(validation.normalizedWire);
    } else {
      // Show tooltip or visual flash for invalid connection
      console.warn('Invalid connection:', validation.error);
    }

    setConnectingPin(null);
  };

  // Start dragging a component
  const handleComponentMouseDown = (e, comp) => {
    e.stopPropagation();
    onSelectComponent(comp.id);
    onSelectWire(null);

    setDraggingComp({
      componentId: comp.id,
      startX: e.clientX,
      startY: e.clientY,
      compX: comp.x,
      compY: comp.y
    });
  };

  // Canvas mouse down: panning or unselecting
  const handleCanvasMouseDown = (e) => {
    // If middle click or space key held, pan
    if (e.button === 1 || e.spaceKey || e.altKey) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y
      };
      return;
    }

    // Normal click unselects
    onSelectComponent(null);
    onSelectWire(null);
    setConnectingPin(null);
  };

  // Global mouse move on canvas container
  const handleMouseMove = useCallback((e) => {
    // Panning canvas
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy
      });
      return;
    }

    // Dragging component
    if (draggingComp) {
      const dx = (e.clientX - draggingComp.startX) / zoom;
      const dy = (e.clientY - draggingComp.startY) / zoom;
      const newX = Math.round((draggingComp.compX + dx) / 20) * 20;
      const newY = Math.round((draggingComp.compY + dy) / 20) * 20;

      onMoveComponent(draggingComp.componentId, Math.max(0, newX), Math.max(0, newY));
      return;
    }

    // Drawing wire rubberband line
    if (connectingPin && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      setConnectingPin(prev => prev ? {
        ...prev,
        currentPos: { x: mouseX, y: mouseY }
      } : null);
    }
  }, [isPanning, draggingComp, connectingPin, pan, zoom, onMoveComponent, setPan]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) setIsPanning(false);
    if (draggingComp) setDraggingComp(null);
    if (connectingPin) setConnectingPin(null);
  }, [isPanning, draggingComp, connectingPin]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle Drag & Drop from component library
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/logiclab-component');
    if (!type || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dropX = (e.clientX - rect.left - pan.x) / zoom;
    const dropY = (e.clientY - rect.top - pan.y) / zoom;

    onDropComponent(type, dropX, dropY);
  };

  return (
    <div
      ref={containerRef}
      className="circuit-canvas-container position-relative w-100 h-100 overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Combinational Cycle Alert Banner */}
      {hasCycle && (
        <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-3 alert alert-danger shadow-lg py-2 px-4 d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
          <div>
            <strong>Combinational Cycle Detected!</strong>
            <span className="small ms-2 text-danger-emphasis">
              Unsupported unclocked loop. Break circular connection or insert a Flip-Flop.
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        className="w-100 h-100 circuit-svg"
        style={{
          backgroundColor: '#0a0f1d',
          cursor: isPanning ? 'grabbing' : connectingPin ? 'crosshair' : 'default'
        }}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern
            id="logiclab-grid"
            width={20 * zoom}
            height={20 * zoom}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${pan.x % (20 * zoom)}, ${pan.y % (20 * zoom)})`}
          >
            <circle cx="2" cy="2" r="1" fill="#1e293b" />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#logiclab-grid)" />

        {/* Canvas World Transform */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Render all Wires */}
          <g className="wires-layer">
            {circuit.wires.map(wire => (
              <WireSVG
                key={wire.id}
                wire={wire}
                components={circuit.components}
                wireValues={wireValues}
                isSelected={selectedWireId === wire.id}
                onSelectWire={onSelectWire}
                onDeleteWire={onDeleteWire}
              />
            ))}
          </g>

          {/* 2. Rubber-band wire being drawn right now */}
          {connectingPin && (
            <path
              d={getWirePath(connectingPin.startPos, connectingPin.currentPos)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              className="connecting-rubberband"
            />
          )}

          {/* 3. Render all Components */}
          <g className="components-layer">
            {circuit.components.map(comp => (
              <g
                key={comp.id}
                onMouseDown={(e) => handleComponentMouseDown(e, comp)}
              >
                <ComponentSVG
                  component={comp}
                  isSelected={selectedComponentId === comp.id}
                  pinValues={pinValues}
                  onPinMouseDown={handlePinMouseDown}
                  onPinMouseUp={handlePinMouseUp}
                  onToggleSwitch={onToggleSwitch}
                  connectingPin={connectingPin}
                />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
