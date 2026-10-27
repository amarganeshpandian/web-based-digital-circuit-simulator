/**
 * LogicLab - Automated Truth Table Generator & Exporter
 * Systematically iterates over 2^N binary input combinations and records circuit outputs.
 */

import { evaluateCircuit } from './evaluator';
import { cloneGraph } from './graph';

/**
 * Generate truth table for a given circuit graph.
 *
 * @param {Object} graph - { components, wires }
 * @param {number} maxInputs - maximum number of variable inputs supported (default 8 => 256 rows)
 * @returns {Object} { success: boolean, inputs: Array, outputs: Array, rows: Array, error?: string }
 */
export function generateTruthTable(graph, maxInputs = 8) {
  if (!graph || !graph.components) {
    return { success: false, error: 'No circuit loaded' };
  }

  // 1. Identify primary input sources (Switches)
  const inputComponents = graph.components.filter(c => c.type === 'SWITCH');

  if (inputComponents.length === 0) {
    return {
      success: false,
      error: 'No variable inputs found. Add at least one Toggle Switch to generate a truth table.'
    };
  }

  if (inputComponents.length > maxInputs) {
    return {
      success: false,
      error: `Circuit has ${inputComponents.length} inputs. Truth table is limited to ${maxInputs} inputs (${Math.pow(2, maxInputs)} rows) for performance.`
    };
  }

  // 2. Identify primary outputs (LEDs and Probes)
  const outputComponents = graph.components.filter(c => c.type === 'LED' || c.type === 'PROBE');

  // If no LEDs or Probes are present, fallback to terminal gate outputs
  let monitoredOutputs = [];
  if (outputComponents.length > 0) {
    monitoredOutputs = outputComponents.map(c => ({
      id: c.id,
      label: c.label || (c.type === 'LED' ? 'LED' : 'Probe'),
      type: 'sink',
      pinId: 'in'
    }));
  } else {
    // Find gates that have outputs not feeding into another gate, or all gates
    const gates = graph.components.filter(c => !['SWITCH', 'CONST_0', 'CONST_1', 'CLOCK', 'PUSH_BUTTON'].includes(c.type));
    monitoredOutputs = gates.map(c => ({
      id: c.id,
      label: c.label || `${c.type} Out`,
      type: 'gate',
      pinId: 'out'
    }));
  }

  if (monitoredOutputs.length === 0) {
    return {
      success: false,
      error: 'No outputs found. Add an LED or Signal Probe to monitor circuit outputs.'
    };
  }

  const inputsMeta = inputComponents.map((c, idx) => ({
    id: c.id,
    label: c.label || `In ${idx + 1}`
  }));

  const totalCombinations = Math.pow(2, inputComponents.length);
  const rows = [];

  // 3. Evaluate each binary combination
  for (let i = 0; i < totalCombinations; i++) {
    // Clone graph to isolate each test run
    const testGraph = cloneGraph(graph);

    const inputValues = {};
    inputComponents.forEach((c, bitIdx) => {
      // Bit order: leftmost is MSB
      const bit = (i >> (inputComponents.length - 1 - bitIdx)) & 1;
      inputValues[c.id] = bit;

      const compInGraph = testGraph.components.find(comp => comp.id === c.id);
      if (compInGraph) {
        compInGraph.state = { ...(compInGraph.state || {}), value: bit };
      }
    });

    const { pinValues } = evaluateCircuit(testGraph);

    const outputValues = {};
    monitoredOutputs.forEach(outMeta => {
      let val = 0;
      if (outMeta.type === 'sink') {
        val = pinValues[outMeta.id]?.[outMeta.pinId] ?? 0;
      } else {
        val = pinValues[outMeta.id]?.[outMeta.pinId] ?? 0;
      }
      outputValues[outMeta.id] = val;
    });

    rows.push({
      index: i,
      inputs: inputValues,
      outputs: outputValues
    });
  }

  return {
    success: true,
    inputs: inputsMeta,
    outputs: monitoredOutputs,
    rows
  };
}

/**
 * Format truth table data as a downloadable CSV string
 */
export function exportTruthTableToCSV(tableData) {
  if (!tableData || !tableData.rows || tableData.rows.length === 0) {
    return '';
  }

  const inHeaders = tableData.inputs.map(i => `"${i.label}"`);
  const outHeaders = tableData.outputs.map(o => `"${o.label}"`);
  const headerLine = [...inHeaders, ...outHeaders].join(',');

  const lines = [headerLine];

  tableData.rows.forEach(row => {
    const inVals = tableData.inputs.map(i => row.inputs[i.id]);
    const outVals = tableData.outputs.map(o => row.outputs[o.id]);
    lines.push([...inVals, ...outVals].join(','));
  });

  return lines.join('\n');
}
