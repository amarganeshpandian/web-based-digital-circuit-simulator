/**
 * LogicLab - Circuit Evaluation & Simulation Engine
 * Deterministic multi-pass combinational propagation and sequential edge updates.
 */

/**
 * Evaluates the output pins of a single component given its input pin values and current internal state.
 * Returns an object mapping pinId -> logic value (0 or 1).
 */
export function evaluateComponentOutputs(component, inputValues) {
  const { type, state = {} } = component;

  const inVal = (pinId, fallback = 0) => {
    const val = inputValues[pinId];
    return (val === 1 || val === 0) ? val : fallback;
  };

  switch (type) {
    // ----------------- Inputs & Sources -----------------
    case 'SWITCH':
      return { out: state.value ? 1 : 0 };

    case 'PUSH_BUTTON':
      return { out: state.value ? 1 : 0 };

    case 'CONST_0':
      return { out: 0 };

    case 'CONST_1':
      return { out: 1 };

    case 'CLOCK':
      return { out: state.value ? 1 : 0 };

    // ----------------- Outputs & Displays -----------------
    case 'LED':
    case 'PROBE':
    case 'SEVENSEG':
      // Sinks have no output pins, but their displayed value is in inputValues
      return {};

    // ----------------- Logic Gates -----------------
    case 'AND': {
      const a = inVal('in1', 0);
      const b = inVal('in2', 0);
      return { out: (a === 1 && b === 1) ? 1 : 0 };
    }

    case 'OR': {
      const a = inVal('in1', 0);
      const b = inVal('in2', 0);
      return { out: (a === 1 || b === 1) ? 1 : 0 };
    }

    case 'NOT': {
      const a = inVal('in', 0);
      return { out: a === 1 ? 0 : 1 };
    }

    case 'NAND': {
      const a = inVal('in1', 0);
      const b = inVal('in2', 0);
      return { out: (a === 1 && b === 1) ? 0 : 1 };
    }

    case 'NOR': {
      const a = inVal('in1', 0);
      const b = inVal('in2', 0);
      return { out: (a === 1 || b === 1) ? 0 : 1 };
    }

    case 'XOR': {
      const a = inVal('in1', 0);
      const b = inVal('in2', 0);
      return { out: (a ^ b) === 1 ? 1 : 0 };
    }

    case 'XNOR': {
      const a = inVal('in1', 0);
      const b = inVal('in2', 0);
      return { out: (a ^ b) === 0 ? 1 : 0 };
    }

    // ----------------- Multiplexers & Demultiplexers -----------------
    case 'MUX_2TO1': {
      const i0 = inVal('i0', 0);
      const i1 = inVal('i1', 0);
      const sel = inVal('sel', 0);
      return { out: sel === 1 ? i1 : i0 };
    }

    case 'MUX_4TO1': {
      const i0 = inVal('i0', 0);
      const i1 = inVal('i1', 0);
      const i2 = inVal('i2', 0);
      const i3 = inVal('i3', 0);
      const s0 = inVal('s0', 0);
      const s1 = inVal('s1', 0);
      const index = (s1 << 1) | s0;
      const inputs = [i0, i1, i2, i3];
      return { out: inputs[index] ?? 0 };
    }

    case 'DEMUX_1TO2': {
      const d = inVal('in', 0);
      const sel = inVal('sel', 0);
      return {
        y0: sel === 0 ? d : 0,
        y1: sel === 1 ? d : 0
      };
    }

    case 'DEMUX_1TO4': {
      const d = inVal('in', 0);
      const s0 = inVal('s0', 0);
      const s1 = inVal('s1', 0);
      const index = (s1 << 1) | s0;
      return {
        y0: index === 0 ? d : 0,
        y1: index === 1 ? d : 0,
        y2: index === 2 ? d : 0,
        y3: index === 3 ? d : 0
      };
    }

    // ----------------- Arithmetic -----------------
    case 'HALF_ADDER': {
      const a = inVal('a', 0);
      const b = inVal('b', 0);
      return {
        sum: (a ^ b) & 1,
        cout: (a & b) & 1
      };
    }

    case 'FULL_ADDER': {
      const a = inVal('a', 0);
      const b = inVal('b', 0);
      const cin = inVal('cin', 0);
      const sum = (a ^ b ^ cin) & 1;
      const cout = ((a & b) | (cin & (a ^ b))) & 1;
      return { sum, cout };
    }

    case 'HALF_SUBTRACTOR': {
      const a = inVal('a', 0);
      const b = inVal('b', 0);
      const diff = (a ^ b) & 1;
      const borrow = ((~a) & b) & 1;
      return { diff, borrow };
    }

    case 'RIPPLE_ADDER_4BIT': {
      const a0 = inVal('a0', 0);
      const a1 = inVal('a1', 0);
      const a2 = inVal('a2', 0);
      const a3 = inVal('a3', 0);
      const b0 = inVal('b0', 0);
      const b1 = inVal('b1', 0);
      const b2 = inVal('b2', 0);
      const b3 = inVal('b3', 0);
      const cin = inVal('cin', 0);

      const valA = a0 | (a1 << 1) | (a2 << 2) | (a3 << 3);
      const valB = b0 | (b1 << 1) | (b2 << 2) | (b3 << 3);
      const total = valA + valB + cin;

      return {
        s0: (total >> 0) & 1,
        s1: (total >> 1) & 1,
        s2: (total >> 2) & 1,
        s3: (total >> 3) & 1,
        cout: (total >> 4) & 1
      };
    }

    // ----------------- Encoders & Decoders -----------------
    case 'DECODER_2TO4': {
      const in0 = inVal('in0', 0);
      const in1 = inVal('in1', 0);
      // EN defaults to 1 if unconnected
      const en = inputValues.en !== undefined ? inputValues.en : 1;

      if (en === 0) {
        return { y0: 0, y1: 0, y2: 0, y3: 0 };
      }
      const code = (in1 << 1) | in0;
      return {
        y0: code === 0 ? 1 : 0,
        y1: code === 1 ? 1 : 0,
        y2: code === 2 ? 1 : 0,
        y3: code === 3 ? 1 : 0
      };
    }

    case 'DECODER_3TO8': {
      const in0 = inVal('in0', 0);
      const in1 = inVal('in1', 0);
      const in2 = inVal('in2', 0);
      const en = inputValues.en !== undefined ? inputValues.en : 1;

      const res = { y0: 0, y1: 0, y2: 0, y3: 0, y4: 0, y5: 0, y6: 0, y7: 0 };
      if (en === 0) return res;

      const code = (in2 << 2) | (in1 << 1) | in0;
      res[`y${code}`] = 1;
      return res;
    }

    case 'ENCODER_4TO2': {
      const d0 = inVal('d0', 0);
      const d1 = inVal('d1', 0);
      const d2 = inVal('d2', 0);
      const d3 = inVal('d3', 0);

      // Priority encoder: d3 highest priority
      if (d3 === 1) return { y0: 1, y1: 1, v: 1 };
      if (d2 === 1) return { y0: 0, y1: 1, v: 1 };
      if (d1 === 1) return { y0: 1, y1: 0, v: 1 };
      if (d0 === 1) return { y0: 0, y1: 0, v: 1 };
      return { y0: 0, y1: 0, v: 0 };
    }

    // ----------------- Sequential: Output driven by internal state -----------------
    case 'D_FLIPFLOP':
    case 'SR_FLIPFLOP':
    case 'JK_FLIPFLOP':
    case 'T_FLIPFLOP': {
      const q = state.q ?? 0;
      return {
        q: q ? 1 : 0,
        qn: q ? 0 : 1
      };
    }

    case 'REGISTER_4BIT':
    case 'SHIFT_REGISTER_4BIT': {
      const val = state.val ?? 0;
      return {
        q0: (val >> 0) & 1,
        q1: (val >> 1) & 1,
        q2: (val >> 2) & 1,
        q3: (val >> 3) & 1
      };
    }

    case 'BINARY_COUNTER_4BIT': {
      const count = state.count ?? 0;
      return {
        q0: (count >> 0) & 1,
        q1: (count >> 1) & 1,
        q2: (count >> 2) & 1,
        q3: (count >> 3) & 1,
        rco: count === 15 ? 1 : 0
      };
    }

    default:
      return {};
  }
}

/**
 * Evaluates the full circuit graph combinational state.
 * Uses relaxation propagation with cycle detection.
 *
 * @param {Object} graph - { components, wires }
 * @param {number} maxIterations - safety limit for circular combinational loops
 * @returns {Object} { pinValues, wireValues, hasCycle, cycleComponents }
 */
export function evaluateCircuit(graph, maxIterations = 35) {
  const { components = [], wires = [] } = graph;

  // pinValues: { [componentId]: { [pinId]: 0 | 1 } }
  const pinValues = {};
  components.forEach(c => {
    pinValues[c.id] = {};
  });

  let wireValues = {};
  let changed = true;
  let iteration = 0;
  let hasCycle = false;

  while (changed && iteration < maxIterations) {
    changed = false;
    iteration++;

    // 1. Evaluate outputs for every component based on its current input pin values
    for (const comp of components) {
      const currentInputs = pinValues[comp.id] || {};
      const newOutputs = evaluateComponentOutputs(comp, currentInputs);

      for (const [pinId, val] of Object.entries(newOutputs)) {
        if (pinValues[comp.id][pinId] !== val) {
          pinValues[comp.id][pinId] = val;
          changed = true;
        }
      }
    }

    // 2. Propagate values across all wires: from driver output to receiver input
    for (const wire of wires) {
      const driverCompId = wire.from.componentId;
      const driverPinId = wire.from.pinId;
      const receiverCompId = wire.to.componentId;
      const receiverPinId = wire.to.pinId;

      const driverVal = pinValues[driverCompId]?.[driverPinId] ?? 0;
      wireValues[wire.id] = driverVal;

      if (pinValues[receiverCompId]?.[receiverPinId] !== driverVal) {
        if (!pinValues[receiverCompId]) {
          pinValues[receiverCompId] = {};
        }
        pinValues[receiverCompId][receiverPinId] = driverVal;
        changed = true;
      }
    }
  }

  // If changed is still true after maxIterations, an unstable combinational cycle exists
  if (iteration >= maxIterations && changed) {
    hasCycle = true;
  }

  return {
    pinValues,
    wireValues,
    hasCycle,
    iterations: iteration
  };
}

/**
 * Advances sequential components on active clock edges.
 * Updates state for D, SR, JK, T flip-flops, Registers, and Counters.
 *
 * @param {Array} components
 * @param {Object} pinValues - current evaluated pin values
 * @returns {Array} updatedComponents with new states
 */
export function stepSequentialState(components, pinValues) {
  let anyStateChanged = false;

  const updatedComponents = components.map(comp => {
    const { type, state = {} } = comp;
    const inputs = pinValues[comp.id] || {};

    const inVal = (pinId, fallback = 0) => {
      const v = inputs[pinId];
      return (v === 1 || v === 0) ? v : fallback;
    };

    switch (type) {
      case 'D_FLIPFLOP': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const rst = inVal('rst', 0);
        const en = inputs.en !== undefined ? inputs.en : 1;
        const d = inVal('d', 0);
        let q = state.q ?? 0;

        // Asynchronous or synchronous reset
        if (rst === 1) {
          q = 0;
        } else if (prevClk === 0 && clk === 1) { // Rising edge
          if (en === 1) {
            q = d;
          }
        }

        if (q !== state.q || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, q, prevClk: clk }
          };
        }
        return comp;
      }

      case 'SR_FLIPFLOP': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const s = inVal('s', 0);
        const r = inVal('r', 0);
        let q = state.q ?? 0;

        if (prevClk === 0 && clk === 1) { // Rising edge
          if (s === 1 && r === 0) {
            q = 1;
          } else if (s === 0 && r === 1) {
            q = 0;
          } else if (s === 1 && r === 1) {
            // Forbidden state: default to 0 / error state
            q = 0;
          }
        }

        if (q !== state.q || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, q, prevClk: clk }
          };
        }
        return comp;
      }

      case 'JK_FLIPFLOP': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const j = inVal('j', 0);
        const k = inVal('k', 0);
        const rst = inVal('rst', 0);
        let q = state.q ?? 0;

        if (rst === 1) {
          q = 0;
        } else if (prevClk === 0 && clk === 1) { // Rising edge
          if (j === 0 && k === 1) q = 0;
          else if (j === 1 && k === 0) q = 1;
          else if (j === 1 && k === 1) q = q === 1 ? 0 : 1; // Toggle
        }

        if (q !== state.q || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, q, prevClk: clk }
          };
        }
        return comp;
      }

      case 'T_FLIPFLOP': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const t = inVal('t', 0);
        const rst = inVal('rst', 0);
        let q = state.q ?? 0;

        if (rst === 1) {
          q = 0;
        } else if (prevClk === 0 && clk === 1) { // Rising edge
          if (t === 1) {
            q = q === 1 ? 0 : 1; // Toggle
          }
        }

        if (q !== state.q || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, q, prevClk: clk }
          };
        }
        return comp;
      }

      case 'REGISTER_4BIT': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const rst = inVal('rst', 0);
        const en = inputs.en !== undefined ? inputs.en : 1;
        let val = state.val ?? 0;

        if (rst === 1) {
          val = 0;
        } else if (prevClk === 0 && clk === 1) {
          if (en === 1) {
            val = (inVal('d0', 0)) |
                  (inVal('d1', 0) << 1) |
                  (inVal('d2', 0) << 2) |
                  (inVal('d3', 0) << 3);
          }
        }

        if (val !== state.val || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, val, prevClk: clk }
          };
        }
        return comp;
      }

      case 'SHIFT_REGISTER_4BIT': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const rst = inVal('rst', 0);
        const en = inputs.en !== undefined ? inputs.en : 1;
        const din = inVal('din', 0);
        let val = state.val ?? 0;

        if (rst === 1) {
          val = 0;
        } else if (prevClk === 0 && clk === 1) {
          if (en === 1) {
            // Shift right: Q3 <= Q2 <= Q1 <= Q0 <= din
            val = ((val << 1) & 0b1110) | (din & 1);
          }
        }

        if (val !== state.val || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, val, prevClk: clk }
          };
        }
        return comp;
      }

      case 'BINARY_COUNTER_4BIT': {
        const clk = inVal('clk', 0);
        const prevClk = state.prevClk ?? 0;
        const rst = inVal('rst', 0);
        const en = inputs.en !== undefined ? inputs.en : 1;
        let count = state.count ?? 0;

        if (rst === 1) {
          count = 0;
        } else if (prevClk === 0 && clk === 1) {
          if (en === 1) {
            count = (count + 1) % 16;
          }
        }

        if (count !== state.count || clk !== state.prevClk) {
          anyStateChanged = true;
          return {
            ...comp,
            state: { ...state, count, prevClk: clk }
          };
        }
        return comp;
      }

      default:
        return comp;
    }
  });

  return { updatedComponents, anyStateChanged };
}
