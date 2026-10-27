/**
 * LogicLab - Component Library Definitions
 * Metadata, pin definitions, visual dimensions, and equations for all logic components.
 */

export const COMPONENT_CATEGORIES = {
  INPUT_OUTPUT: 'Inputs & Outputs',
  GATES: 'Logic Gates',
  MUX_DEMUX: 'Multiplexers & Demux',
  ARITHMETIC: 'Arithmetic Circuits',
  ENCODER_DECODER: 'Encoders & Decoders',
  SEQUENTIAL: 'Sequential & Storage',
};

export const PIN_TYPE = {
  INPUT: 'input',
  OUTPUT: 'output',
};

export const COMPONENT_DEFINITIONS = {
  // ===================== INPUTS & OUTPUTS =====================
  SWITCH: {
    type: 'SWITCH',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'Toggle Switch',
    description: 'Manual binary input source (0 or 1)',
    width: 80,
    height: 50,
    pins: [
      { id: 'out', name: 'OUT', type: PIN_TYPE.OUTPUT, x: 80, y: 25, label: 'Q' }
    ],
    defaultState: { value: 0 },
    equation: 'OUT = User State (0 or 1)'
  },

  PUSH_BUTTON: {
    type: 'PUSH_BUTTON',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'Push Button',
    description: 'Momentary pulse button (1 while held, 0 released)',
    width: 80,
    height: 50,
    pins: [
      { id: 'out', name: 'OUT', type: PIN_TYPE.OUTPUT, x: 80, y: 25, label: 'Q' }
    ],
    defaultState: { value: 0 },
    equation: 'OUT = 1 (Held) | 0 (Released)'
  },

  CONST_0: {
    type: 'CONST_0',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'Constant 0 (GND)',
    description: 'Permanent logic low (0) source',
    width: 70,
    height: 40,
    pins: [
      { id: 'out', name: '0', type: PIN_TYPE.OUTPUT, x: 70, y: 20, label: '0' }
    ],
    defaultState: {},
    equation: 'OUT = 0'
  },

  CONST_1: {
    type: 'CONST_1',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'Constant 1 (VCC)',
    description: 'Permanent logic high (1) source',
    width: 70,
    height: 40,
    pins: [
      { id: 'out', name: '1', type: PIN_TYPE.OUTPUT, x: 70, y: 20, label: '1' }
    ],
    defaultState: {},
    equation: 'OUT = 1'
  },

  CLOCK: {
    type: 'CLOCK',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'Clock Generator',
    description: 'Periodic square-wave oscillation signal',
    width: 90,
    height: 50,
    pins: [
      { id: 'out', name: 'CLK', type: PIN_TYPE.OUTPUT, x: 90, y: 25, label: 'CLK' }
    ],
    defaultState: { value: 0, frequency: 1 },
    equation: 'OUT = Alternates on simulation tick'
  },

  LED: {
    type: 'LED',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'LED Output',
    description: 'Visual indicator lamp (illuminates when 1)',
    width: 70,
    height: 50,
    pins: [
      { id: 'in', name: 'IN', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'D' }
    ],
    defaultState: { color: '#10b981' }, // emerald green default
    equation: 'Glows when IN = 1'
  },

  PROBE: {
    type: 'PROBE',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: 'Signal Probe',
    description: 'Digital readout showing exact logic level (0/1)',
    width: 80,
    height: 50,
    pins: [
      { id: 'in', name: 'IN', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'IN' }
    ],
    defaultState: {},
    equation: 'Displays 0 or 1'
  },

  SEVENSEG: {
    type: 'SEVENSEG',
    category: COMPONENT_CATEGORIES.INPUT_OUTPUT,
    name: '7-Segment Display',
    description: 'Standard 7-segment digital LED display (segments a-g)',
    width: 90,
    height: 120,
    pins: [
      { id: 'a', name: 'a', type: PIN_TYPE.INPUT, x: 0, y: 15, label: 'a' },
      { id: 'b', name: 'b', type: PIN_TYPE.INPUT, x: 0, y: 30, label: 'b' },
      { id: 'c', name: 'c', type: PIN_TYPE.INPUT, x: 0, y: 45, label: 'c' },
      { id: 'd', name: 'd', type: PIN_TYPE.INPUT, x: 0, y: 60, label: 'd' },
      { id: 'e', name: 'e', type: PIN_TYPE.INPUT, x: 0, y: 75, label: 'e' },
      { id: 'f', name: 'f', type: PIN_TYPE.INPUT, x: 0, y: 90, label: 'f' },
      { id: 'g', name: 'g', type: PIN_TYPE.INPUT, x: 0, y: 105, label: 'g' },
    ],
    defaultState: { color: '#ef4444' },
    equation: 'Segments a,b,c,d,e,f,g'
  },

  // ===================== LOGIC GATES =====================
  AND: {
    type: 'AND',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'AND Gate',
    description: 'Outputs 1 if both inputs are 1',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 18, label: 'A' },
      { id: 'in2', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 42, label: 'B' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 90, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = A · B'
  },

  OR: {
    type: 'OR',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'OR Gate',
    description: 'Outputs 1 if at least one input is 1',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 18, label: 'A' },
      { id: 'in2', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 42, label: 'B' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 90, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = A + B'
  },

  NOT: {
    type: 'NOT',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'NOT Gate (Inverter)',
    description: 'Inverts input (1 becomes 0, 0 becomes 1)',
    width: 80,
    height: 50,
    pins: [
      { id: 'in', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'A' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 80, y: 25, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = A\''
  },

  NAND: {
    type: 'NAND',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'NAND Gate',
    description: 'Universal gate: Inverted AND',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 18, label: 'A' },
      { id: 'in2', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 42, label: 'B' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 90, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = (A · B)\''
  },

  NOR: {
    type: 'NOR',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'NOR Gate',
    description: 'Universal gate: Inverted OR',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 18, label: 'A' },
      { id: 'in2', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 42, label: 'B' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 90, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = (A + B)\''
  },

  XOR: {
    type: 'XOR',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'XOR Gate',
    description: 'Exclusive OR: outputs 1 if inputs differ',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 18, label: 'A' },
      { id: 'in2', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 42, label: 'B' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 90, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = A ⊕ B'
  },

  XNOR: {
    type: 'XNOR',
    category: COMPONENT_CATEGORIES.GATES,
    name: 'XNOR Gate',
    description: 'Equivalence gate: outputs 1 if inputs are identical',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 18, label: 'A' },
      { id: 'in2', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 42, label: 'B' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 90, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = (A ⊕ B)\''
  },

  // ===================== MULTIPLEXERS & DEMULTIPLEXERS =====================
  MUX_2TO1: {
    type: 'MUX_2TO1',
    category: COMPONENT_CATEGORIES.MUX_DEMUX,
    name: '2:1 Multiplexer',
    description: 'Selects between 2 data inputs using 1 select line',
    width: 100,
    height: 80,
    pins: [
      { id: 'i0', name: 'I0', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'I0' },
      { id: 'i1', name: 'I1', type: PIN_TYPE.INPUT, x: 0, y: 40, label: 'I1' },
      { id: 'sel', name: 'S', type: PIN_TYPE.INPUT, x: 50, y: 80, label: 'S' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 100, y: 30, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = S\'·I0 + S·I1'
  },

  MUX_4TO1: {
    type: 'MUX_4TO1',
    category: COMPONENT_CATEGORIES.MUX_DEMUX,
    name: '4:1 Multiplexer',
    description: 'Selects between 4 data inputs using 2 select lines',
    width: 110,
    height: 110,
    pins: [
      { id: 'i0', name: 'I0', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'I0' },
      { id: 'i1', name: 'I1', type: PIN_TYPE.INPUT, x: 0, y: 40, label: 'I1' },
      { id: 'i2', name: 'I2', type: PIN_TYPE.INPUT, x: 0, y: 60, label: 'I2' },
      { id: 'i3', name: 'I3', type: PIN_TYPE.INPUT, x: 0, y: 80, label: 'I3' },
      { id: 's0', name: 'S0', type: PIN_TYPE.INPUT, x: 40, y: 110, label: 'S0' },
      { id: 's1', name: 'S1', type: PIN_TYPE.INPUT, x: 70, y: 110, label: 'S1' },
      { id: 'out', name: 'Y', type: PIN_TYPE.OUTPUT, x: 110, y: 50, label: 'Y' }
    ],
    defaultState: {},
    equation: 'Y = I[S1 S0]'
  },

  DEMUX_1TO2: {
    type: 'DEMUX_1TO2',
    category: COMPONENT_CATEGORIES.MUX_DEMUX,
    name: '1:2 Demultiplexer',
    description: 'Routes 1 input to 1 of 2 outputs based on select line',
    width: 100,
    height: 80,
    pins: [
      { id: 'in', name: 'IN', type: PIN_TYPE.INPUT, x: 0, y: 40, label: 'D' },
      { id: 'sel', name: 'S', type: PIN_TYPE.INPUT, x: 50, y: 80, label: 'S' },
      { id: 'y0', name: 'Y0', type: PIN_TYPE.OUTPUT, x: 100, y: 25, label: 'Y0' },
      { id: 'y1', name: 'Y1', type: PIN_TYPE.OUTPUT, x: 100, y: 55, label: 'Y1' }
    ],
    defaultState: {},
    equation: 'Y0 = S\'·D, Y1 = S·D'
  },

  DEMUX_1TO4: {
    type: 'DEMUX_1TO4',
    category: COMPONENT_CATEGORIES.MUX_DEMUX,
    name: '1:4 Demultiplexer',
    description: 'Routes 1 input to 1 of 4 outputs based on 2 select lines',
    width: 110,
    height: 110,
    pins: [
      { id: 'in', name: 'IN', type: PIN_TYPE.INPUT, x: 0, y: 55, label: 'D' },
      { id: 's0', name: 'S0', type: PIN_TYPE.INPUT, x: 40, y: 110, label: 'S0' },
      { id: 's1', name: 'S1', type: PIN_TYPE.INPUT, x: 70, y: 110, label: 'S1' },
      { id: 'y0', name: 'Y0', type: PIN_TYPE.OUTPUT, x: 110, y: 20, label: 'Y0' },
      { id: 'y1', name: 'Y1', type: PIN_TYPE.OUTPUT, x: 110, y: 40, label: 'Y1' },
      { id: 'y2', name: 'Y2', type: PIN_TYPE.OUTPUT, x: 110, y: 60, label: 'Y2' },
      { id: 'y3', name: 'Y3', type: PIN_TYPE.OUTPUT, x: 110, y: 80, label: 'Y3' }
    ],
    defaultState: {},
    equation: 'Yk = D when [S1 S0] == k'
  },

  // ===================== ARITHMETIC CIRCUITS =====================
  HALF_ADDER: {
    type: 'HALF_ADDER',
    category: COMPONENT_CATEGORIES.ARITHMETIC,
    name: 'Half Adder',
    description: 'Adds two 1-bit numbers, produces Sum and Carry',
    width: 110,
    height: 80,
    pins: [
      { id: 'a', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'A' },
      { id: 'b', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 55, label: 'B' },
      { id: 'sum', name: 'S', type: PIN_TYPE.OUTPUT, x: 110, y: 25, label: 'S' },
      { id: 'cout', name: 'C', type: PIN_TYPE.OUTPUT, x: 110, y: 55, label: 'C' }
    ],
    defaultState: {},
    equation: 'S = A ⊕ B, C = A · B'
  },

  FULL_ADDER: {
    type: 'FULL_ADDER',
    category: COMPONENT_CATEGORIES.ARITHMETIC,
    name: 'Full Adder',
    description: 'Adds two 1-bit inputs plus Carry In, produces Sum and Carry Out',
    width: 120,
    height: 90,
    pins: [
      { id: 'a', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'A' },
      { id: 'b', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 45, label: 'B' },
      { id: 'cin', name: 'Cin', type: PIN_TYPE.INPUT, x: 0, y: 70, label: 'Cin' },
      { id: 'sum', name: 'S', type: PIN_TYPE.OUTPUT, x: 120, y: 30, label: 'S' },
      { id: 'cout', name: 'Cout', type: PIN_TYPE.OUTPUT, x: 120, y: 60, label: 'Cout' }
    ],
    defaultState: {},
    equation: 'S = A ⊕ B ⊕ Cin, Cout = (A·B) + Cin·(A ⊕ B)'
  },

  HALF_SUBTRACTOR: {
    type: 'HALF_SUBTRACTOR',
    category: COMPONENT_CATEGORIES.ARITHMETIC,
    name: 'Half Subtractor',
    description: 'Subtracts B from A, produces Difference and Borrow',
    width: 110,
    height: 80,
    pins: [
      { id: 'a', name: 'A', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'A' },
      { id: 'b', name: 'B', type: PIN_TYPE.INPUT, x: 0, y: 55, label: 'B' },
      { id: 'diff', name: 'D', type: PIN_TYPE.OUTPUT, x: 110, y: 25, label: 'D' },
      { id: 'borrow', name: 'Bo', type: PIN_TYPE.OUTPUT, x: 110, y: 55, label: 'Bo' }
    ],
    defaultState: {},
    equation: 'D = A ⊕ B, Bo = A\' · B'
  },

  RIPPLE_ADDER_4BIT: {
    type: 'RIPPLE_ADDER_4BIT',
    category: COMPONENT_CATEGORIES.ARITHMETIC,
    name: '4-Bit Ripple Carry Adder',
    description: 'Adds two 4-bit numbers (A3..A0 + B3..B0 + Cin)',
    width: 150,
    height: 140,
    pins: [
      { id: 'a0', name: 'A0', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'A0' },
      { id: 'a1', name: 'A1', type: PIN_TYPE.INPUT, x: 0, y: 35, label: 'A1' },
      { id: 'a2', name: 'A2', type: PIN_TYPE.INPUT, x: 0, y: 50, label: 'A2' },
      { id: 'a3', name: 'A3', type: PIN_TYPE.INPUT, x: 0, y: 65, label: 'A3' },
      { id: 'b0', name: 'B0', type: PIN_TYPE.INPUT, x: 0, y: 85, label: 'B0' },
      { id: 'b1', name: 'B1', type: PIN_TYPE.INPUT, x: 0, y: 100, label: 'B1' },
      { id: 'b2', name: 'B2', type: PIN_TYPE.INPUT, x: 0, y: 115, label: 'B2' },
      { id: 'b3', name: 'B3', type: PIN_TYPE.INPUT, x: 0, y: 130, label: 'B3' },
      { id: 'cin', name: 'Cin', type: PIN_TYPE.INPUT, x: 75, y: 0, label: 'Cin' },
      { id: 's0', name: 'S0', type: PIN_TYPE.OUTPUT, x: 150, y: 25, label: 'S0' },
      { id: 's1', name: 'S1', type: PIN_TYPE.OUTPUT, x: 150, y: 45, label: 'S1' },
      { id: 's2', name: 'S2', type: PIN_TYPE.OUTPUT, x: 150, y: 65, label: 'S2' },
      { id: 's3', name: 'S3', type: PIN_TYPE.OUTPUT, x: 150, y: 85, label: 'S3' },
      { id: 'cout', name: 'Cout', type: PIN_TYPE.OUTPUT, x: 150, y: 115, label: 'Cout' }
    ],
    defaultState: {},
    equation: 'S = A + B + Cin'
  },

  // ===================== ENCODERS & DECODERS =====================
  DECODER_2TO4: {
    type: 'DECODER_2TO4',
    category: COMPONENT_CATEGORIES.ENCODER_DECODER,
    name: '2-to-4 Decoder',
    description: 'Decodes 2-bit binary code to 1 of 4 active outputs (with EN)',
    width: 120,
    height: 100,
    pins: [
      { id: 'in0', name: 'A0', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'A0' },
      { id: 'in1', name: 'A1', type: PIN_TYPE.INPUT, x: 0, y: 50, label: 'A1' },
      { id: 'en', name: 'EN', type: PIN_TYPE.INPUT, x: 0, y: 75, label: 'EN' },
      { id: 'y0', name: 'Y0', type: PIN_TYPE.OUTPUT, x: 120, y: 20, label: 'Y0' },
      { id: 'y1', name: 'Y1', type: PIN_TYPE.OUTPUT, x: 120, y: 40, label: 'Y1' },
      { id: 'y2', name: 'Y2', type: PIN_TYPE.OUTPUT, x: 120, y: 60, label: 'Y2' },
      { id: 'y3', name: 'Y3', type: PIN_TYPE.OUTPUT, x: 120, y: 80, label: 'Y3' }
    ],
    defaultState: {},
    equation: 'Yk = EN · (code == k)'
  },

  DECODER_3TO8: {
    type: 'DECODER_3TO8',
    category: COMPONENT_CATEGORIES.ENCODER_DECODER,
    name: '3-to-8 Decoder',
    description: 'Decodes 3-bit code to 1 of 8 active outputs',
    width: 130,
    height: 150,
    pins: [
      { id: 'in0', name: 'A0', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'A0' },
      { id: 'in1', name: 'A1', type: PIN_TYPE.INPUT, x: 0, y: 55, label: 'A1' },
      { id: 'in2', name: 'A2', type: PIN_TYPE.INPUT, x: 0, y: 85, label: 'A2' },
      { id: 'en', name: 'EN', type: PIN_TYPE.INPUT, x: 0, y: 120, label: 'EN' },
      { id: 'y0', name: 'Y0', type: PIN_TYPE.OUTPUT, x: 130, y: 15, label: 'Y0' },
      { id: 'y1', name: 'Y1', type: PIN_TYPE.OUTPUT, x: 130, y: 32, label: 'Y1' },
      { id: 'y2', name: 'Y2', type: PIN_TYPE.OUTPUT, x: 130, y: 49, label: 'Y2' },
      { id: 'y3', name: 'Y3', type: PIN_TYPE.OUTPUT, x: 130, y: 66, label: 'Y3' },
      { id: 'y4', name: 'Y4', type: PIN_TYPE.OUTPUT, x: 130, y: 83, label: 'Y4' },
      { id: 'y5', name: 'Y5', type: PIN_TYPE.OUTPUT, x: 130, y: 100, label: 'Y5' },
      { id: 'y6', name: 'Y6', type: PIN_TYPE.OUTPUT, x: 130, y: 117, label: 'Y6' },
      { id: 'y7', name: 'Y7', type: PIN_TYPE.OUTPUT, x: 130, y: 134, label: 'Y7' }
    ],
    defaultState: {},
    equation: 'Yk = EN · (code == k)'
  },

  ENCODER_4TO2: {
    type: 'ENCODER_4TO2',
    category: COMPONENT_CATEGORIES.ENCODER_DECODER,
    name: '4-to-2 Priority Encoder',
    description: 'Encodes 4 input lines to 2-bit binary code with Valid signal',
    width: 120,
    height: 110,
    pins: [
      { id: 'd0', name: 'D0', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'D0' },
      { id: 'd1', name: 'D1', type: PIN_TYPE.INPUT, x: 0, y: 40, label: 'D1' },
      { id: 'd2', name: 'D2', type: PIN_TYPE.INPUT, x: 0, y: 60, label: 'D2' },
      { id: 'd3', name: 'D3', type: PIN_TYPE.INPUT, x: 0, y: 80, label: 'D3' },
      { id: 'y0', name: 'Y0', type: PIN_TYPE.OUTPUT, x: 120, y: 30, label: 'Y0' },
      { id: 'y1', name: 'Y1', type: PIN_TYPE.OUTPUT, x: 120, y: 60, label: 'Y1' },
      { id: 'v', name: 'V', type: PIN_TYPE.OUTPUT, x: 120, y: 90, label: 'V' }
    ],
    defaultState: {},
    equation: 'Highest active input sets Y1,Y0; V = any active'
  },

  // ===================== SEQUENTIAL CIRCUITS =====================
  D_FLIPFLOP: {
    type: 'D_FLIPFLOP',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: 'D Flip-Flop',
    description: 'Positive edge-triggered Data Flip-Flop (with Rst & En)',
    width: 110,
    height: 90,
    pins: [
      { id: 'd', name: 'D', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'D' },
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 65, label: '▶' },
      { id: 'rst', name: 'RST', type: PIN_TYPE.INPUT, x: 55, y: 90, label: 'R' },
      { id: 'en', name: 'EN', type: PIN_TYPE.INPUT, x: 55, y: 0, label: 'EN' },
      { id: 'q', name: 'Q', type: PIN_TYPE.OUTPUT, x: 110, y: 25, label: 'Q' },
      { id: 'qn', name: '~Q', type: PIN_TYPE.OUTPUT, x: 110, y: 65, label: 'Q\'' }
    ],
    defaultState: { q: 0, prevClk: 0 },
    equation: 'Q(next) = D on CLK ↑'
  },

  SR_FLIPFLOP: {
    type: 'SR_FLIPFLOP',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: 'SR Flip-Flop',
    description: 'Set-Reset Flip-Flop with Clock trigger',
    width: 110,
    height: 90,
    pins: [
      { id: 's', name: 'S', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'S' },
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 45, label: '▶' },
      { id: 'r', name: 'R', type: PIN_TYPE.INPUT, x: 0, y: 70, label: 'R' },
      { id: 'q', name: 'Q', type: PIN_TYPE.OUTPUT, x: 110, y: 25, label: 'Q' },
      { id: 'qn', name: '~Q', type: PIN_TYPE.OUTPUT, x: 110, y: 65, label: 'Q\'' }
    ],
    defaultState: { q: 0, prevClk: 0 },
    equation: 'Q(next) = S + R\'·Q (S=R=1 forbidden)'
  },

  JK_FLIPFLOP: {
    type: 'JK_FLIPFLOP',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: 'JK Flip-Flop',
    description: 'Universal Flip-Flop: Set, Reset, or Toggle on J=K=1',
    width: 110,
    height: 90,
    pins: [
      { id: 'j', name: 'J', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'J' },
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 45, label: '▶' },
      { id: 'k', name: 'K', type: PIN_TYPE.INPUT, x: 0, y: 70, label: 'K' },
      { id: 'rst', name: 'RST', type: PIN_TYPE.INPUT, x: 55, y: 90, label: 'R' },
      { id: 'q', name: 'Q', type: PIN_TYPE.OUTPUT, x: 110, y: 25, label: 'Q' },
      { id: 'qn', name: '~Q', type: PIN_TYPE.OUTPUT, x: 110, y: 65, label: 'Q\'' }
    ],
    defaultState: { q: 0, prevClk: 0 },
    equation: 'Q(next) = J·Q\' + K\'·Q'
  },

  T_FLIPFLOP: {
    type: 'T_FLIPFLOP',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: 'T Flip-Flop',
    description: 'Toggle Flip-Flop: inverts state when T=1 on clock edge',
    width: 110,
    height: 80,
    pins: [
      { id: 't', name: 'T', type: PIN_TYPE.INPUT, x: 0, y: 25, label: 'T' },
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 55, label: '▶' },
      { id: 'rst', name: 'RST', type: PIN_TYPE.INPUT, x: 55, y: 80, label: 'R' },
      { id: 'q', name: 'Q', type: PIN_TYPE.OUTPUT, x: 110, y: 25, label: 'Q' },
      { id: 'qn', name: '~Q', type: PIN_TYPE.OUTPUT, x: 110, y: 55, label: 'Q\'' }
    ],
    defaultState: { q: 0, prevClk: 0 },
    equation: 'Q(next) = T ⊕ Q'
  },

  REGISTER_4BIT: {
    type: 'REGISTER_4BIT',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: '4-Bit Register',
    description: 'Parallel load 4-bit storage register with clock & enable',
    width: 130,
    height: 120,
    pins: [
      { id: 'd0', name: 'D0', type: PIN_TYPE.INPUT, x: 0, y: 20, label: 'D0' },
      { id: 'd1', name: 'D1', type: PIN_TYPE.INPUT, x: 0, y: 40, label: 'D1' },
      { id: 'd2', name: 'D2', type: PIN_TYPE.INPUT, x: 0, y: 60, label: 'D2' },
      { id: 'd3', name: 'D3', type: PIN_TYPE.INPUT, x: 0, y: 80, label: 'D3' },
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 105, label: '▶' },
      { id: 'en', name: 'EN', type: PIN_TYPE.INPUT, x: 45, y: 0, label: 'EN' },
      { id: 'rst', name: 'RST', type: PIN_TYPE.INPUT, x: 85, y: 0, label: 'R' },
      { id: 'q0', name: 'Q0', type: PIN_TYPE.OUTPUT, x: 130, y: 20, label: 'Q0' },
      { id: 'q1', name: 'Q1', type: PIN_TYPE.OUTPUT, x: 130, y: 40, label: 'Q1' },
      { id: 'q2', name: 'Q2', type: PIN_TYPE.OUTPUT, x: 130, y: 60, label: 'Q2' },
      { id: 'q3', name: 'Q3', type: PIN_TYPE.OUTPUT, x: 130, y: 80, label: 'Q3' }
    ],
    defaultState: { val: 0, prevClk: 0 },
    equation: 'Loads D[3..0] when EN=1 on CLK ↑'
  },

  SHIFT_REGISTER_4BIT: {
    type: 'SHIFT_REGISTER_4BIT',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: '4-Bit Shift Register',
    description: 'Serial In - Parallel Out (SIPO) shift register',
    width: 130,
    height: 120,
    pins: [
      { id: 'din', name: 'DIN', type: PIN_TYPE.INPUT, x: 0, y: 30, label: 'DIN' },
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 80, label: '▶' },
      { id: 'en', name: 'EN', type: PIN_TYPE.INPUT, x: 45, y: 0, label: 'EN' },
      { id: 'rst', name: 'RST', type: PIN_TYPE.INPUT, x: 85, y: 0, label: 'R' },
      { id: 'q0', name: 'Q0', type: PIN_TYPE.OUTPUT, x: 130, y: 20, label: 'Q0' },
      { id: 'q1', name: 'Q1', type: PIN_TYPE.OUTPUT, x: 130, y: 40, label: 'Q1' },
      { id: 'q2', name: 'Q2', type: PIN_TYPE.OUTPUT, x: 130, y: 60, label: 'Q2' },
      { id: 'q3', name: 'Q3', type: PIN_TYPE.OUTPUT, x: 130, y: 80, label: 'Q3' }
    ],
    defaultState: { val: 0, prevClk: 0 },
    equation: 'Shifts right: Q3<=Q2<=Q1<=Q0<=DIN'
  },

  BINARY_COUNTER_4BIT: {
    type: 'BINARY_COUNTER_4BIT',
    category: COMPONENT_CATEGORIES.SEQUENTIAL,
    name: '4-Bit Binary Counter',
    description: 'Synchronous binary up-counter (0 to 15) with RCO carry out',
    width: 130,
    height: 120,
    pins: [
      { id: 'clk', name: 'CLK', type: PIN_TYPE.INPUT, x: 0, y: 40, label: '▶' },
      { id: 'en', name: 'EN', type: PIN_TYPE.INPUT, x: 0, y: 80, label: 'EN' },
      { id: 'rst', name: 'RST', type: PIN_TYPE.INPUT, x: 65, y: 120, label: 'R' },
      { id: 'q0', name: 'Q0', type: PIN_TYPE.OUTPUT, x: 130, y: 20, label: 'Q0' },
      { id: 'q1', name: 'Q1', type: PIN_TYPE.OUTPUT, x: 130, y: 40, label: 'Q1' },
      { id: 'q2', name: 'Q2', type: PIN_TYPE.OUTPUT, x: 130, y: 60, label: 'Q2' },
      { id: 'q3', name: 'Q3', type: PIN_TYPE.OUTPUT, x: 130, y: 80, label: 'Q3' },
      { id: 'rco', name: 'RCO', type: PIN_TYPE.OUTPUT, x: 130, y: 105, label: 'RCO' }
    ],
    defaultState: { count: 0, prevClk: 0 },
    equation: 'Count = (Count + 1) mod 16 on CLK ↑; RCO=1 at 15'
  }
};
