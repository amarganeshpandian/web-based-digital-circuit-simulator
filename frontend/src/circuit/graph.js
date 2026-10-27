/**
 * LogicLab - Circuit Graph Operations & Helper Functions
 */

import { COMPONENT_DEFINITIONS, PIN_TYPE } from './definitions';

/**
 * Returns absolute coordinates of a pin on the canvas
 */
export function getPinPosition(component, pinId) {
  const def = COMPONENT_DEFINITIONS[component.type];
  if (!def) return { x: component.x, y: component.y };

  const pin = def.pins.find(p => p.id === pinId);
  if (!pin) return { x: component.x, y: component.y };

  return {
    x: component.x + pin.x,
    y: component.y + pin.y
  };
}

/**
 * Find pin definition from component
 */
export function getPinDef(componentType, pinId) {
  const def = COMPONENT_DEFINITIONS[componentType];
  if (!def) return null;
  return def.pins.find(p => p.id === pinId) || null;
}

/**
 * Validate a proposed wire connection
 * Returns { valid: boolean, error?: string, normalizedWire?: object }
 */
export function validateWireConnection(graph, sourceEnd, targetEnd) {
  if (!sourceEnd || !targetEnd) {
    return { valid: false, error: 'Incomplete connection' };
  }

  // Cannot connect pin to itself
  if (sourceEnd.componentId === targetEnd.componentId && sourceEnd.pinId === targetEnd.pinId) {
    return { valid: false, error: 'Cannot connect a pin to itself' };
  }

  const srcComp = graph.components.find(c => c.id === sourceEnd.componentId);
  const tgtComp = graph.components.find(c => c.id === targetEnd.componentId);

  if (!srcComp || !tgtComp) {
    return { valid: false, error: 'Referenced component not found' };
  }

  const srcPinDef = getPinDef(srcComp.type, sourceEnd.pinId);
  const tgtPinDef = getPinDef(tgtComp.type, targetEnd.pinId);

  if (!srcPinDef || !tgtPinDef) {
    return { valid: false, error: 'Referenced pin not found' };
  }

  // One must be OUTPUT and one must be INPUT
  let driverEnd = null;
  let receiverEnd = null;

  if (srcPinDef.type === PIN_TYPE.OUTPUT && tgtPinDef.type === PIN_TYPE.INPUT) {
    driverEnd = sourceEnd;
    receiverEnd = targetEnd;
  } else if (srcPinDef.type === PIN_TYPE.INPUT && tgtPinDef.type === PIN_TYPE.OUTPUT) {
    driverEnd = targetEnd;
    receiverEnd = sourceEnd;
  } else if (srcPinDef.type === PIN_TYPE.OUTPUT && tgtPinDef.type === PIN_TYPE.OUTPUT) {
    return { valid: false, error: 'Short circuit: Cannot connect Output pin to Output pin' };
  } else {
    return { valid: false, error: 'Cannot connect Input pin directly to another Input pin' };
  }

  // Check if input pin already has a driver wire
  const existingInputWire = graph.wires.find(
    w => w.to.componentId === receiverEnd.componentId && w.to.pinId === receiverEnd.pinId
  );

  // Check for duplicate wire
  const isDuplicate = graph.wires.some(
    w => w.from.componentId === driverEnd.componentId &&
         w.from.pinId === driverEnd.pinId &&
         w.to.componentId === receiverEnd.componentId &&
         w.to.pinId === receiverEnd.pinId
  );

  if (isDuplicate) {
    return { valid: false, error: 'Connection already exists' };
  }

  const normalizedWire = {
    id: 'w_' + Math.random().toString(36).substring(2, 9),
    from: { componentId: driverEnd.componentId, pinId: driverEnd.pinId },
    to: { componentId: receiverEnd.componentId, pinId: receiverEnd.pinId },
    replaceWireId: existingInputWire ? existingInputWire.id : null
  };

  return { valid: true, normalizedWire };
}

/**
 * Creates a new component instance with default state
 */
export function createComponentInstance(type, x, y, customLabel = null) {
  const def = COMPONENT_DEFINITIONS[type];
  if (!def) throw new Error(`Unknown component type: ${type}`);

  const id = `${type.toLowerCase()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    id,
    type,
    x: Math.round(x / 20) * 20, // snap to 20px grid
    y: Math.round(y / 20) * 20,
    label: customLabel || def.name,
    state: { ...(def.defaultState || {}) }
  };
}

/**
 * Cleanly remove a component and all connected wires
 */
export function removeComponentFromGraph(graph, componentId) {
  return {
    components: graph.components.filter(c => c.id !== componentId),
    wires: graph.wires.filter(
      w => w.from.componentId !== componentId && w.to.componentId !== componentId
    )
  };
}

/**
 * Cleanly remove a wire
 */
export function removeWireFromGraph(graph, wireId) {
  return {
    ...graph,
    wires: graph.wires.filter(w => w.id !== wireId)
  };
}

/**
 * Deep clone circuit structure
 */
export function cloneGraph(graph) {
  return JSON.parse(JSON.stringify(graph));
}

/**
 * Validates imported JSON circuit schema
 */
export function validateCircuitSchema(circuitData) {
  if (!circuitData || typeof circuitData !== 'object') {
    return { valid: false, error: 'Invalid file format: root must be an object' };
  }

  if (!Array.isArray(circuitData.components)) {
    return { valid: false, error: 'Circuit data missing "components" array' };
  }

  if (!Array.isArray(circuitData.wires)) {
    return { valid: false, error: 'Circuit data missing "wires" array' };
  }

  // Validate components
  for (const c of circuitData.components) {
    if (!c.id || !c.type || typeof c.x !== 'number' || typeof c.y !== 'number') {
      return { valid: false, error: `Invalid component schema for ID ${c.id || 'unknown'}` };
    }
    if (!COMPONENT_DEFINITIONS[c.type]) {
      return { valid: false, error: `Unrecognized component type: ${c.type}` };
    }
  }

  // Validate wires
  for (const w of circuitData.wires) {
    if (!w.id || !w.from || !w.to || !w.from.componentId || !w.to.componentId) {
      return { valid: false, error: `Invalid wire structure for wire ${w.id || 'unknown'}` };
    }
  }

  return { valid: true };
}
