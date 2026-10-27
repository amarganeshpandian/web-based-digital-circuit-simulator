/**
 * LogicLab - Educational Curriculum & Interactive Lessons
 * Complete with theory, truth tables, exercises, and loadable starter circuits.
 */

export const LESSONS = [
  {
    id: 'boolean-basics',
    title: '1. Introduction to Digital Logic & Boolean States',
    category: 'Foundations',
    summary: 'Understand the fundamental binary states (0 and 1), digital voltage abstraction, and basic logic operations.',
    content: `
### What is Digital Logic?
In modern digital computing, all data and instructions are expressed in binary digits (**bits**):
- **0 (Logic Low / False)**: Typically represents Ground ($0\\text{ V}$).
- **1 (Logic High / True)**: Typically represents Positive Supply Voltage (e.g. $+3.3\\text{ V}$ or $+5\\text{ V}$).

### Basic Binary Operations
George Boole developed Boolean algebra in 1847. The three fundamental operations are:
1. **Conjunction (AND)**: True only if both conditions are true ($A \\cdot B$).
2. **Disjunction (OR)**: True if either condition is true ($A + B$).
3. **Negation (NOT)**: Inverts the condition ($A'$ or $\\overline{A}$).
    `,
    expectedBehavior: 'Toggle the switch to see the Probe value and LED lamp respond immediately.',
    exercise: 'Connect a Toggle Switch directly to an LED and a Signal Probe. Observe how toggling the switch updates the LED brightness and probe value.',
    truthTable: {
      headers: ['Input Switch', 'LED Output', 'Probe State'],
      rows: [
        [0, 0, '0 (LOW)'],
        [1, 1, '1 (HIGH)']
      ]
    },
    circuit: {
      components: [
        { id: 'sw1', type: 'SWITCH', x: 120, y: 160, label: 'Input Switch', state: { value: 1 } },
        { id: 'led1', type: 'LED', x: 340, y: 160, label: 'Indicator LED', state: { color: '#10b981' } },
        { id: 'probe1', type: 'PROBE', x: 340, y: 260, label: 'Logic Probe', state: {} }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'sw1', pinId: 'out' }, to: { componentId: 'led1', pinId: 'in' } },
        { id: 'w2', from: { componentId: 'sw1', pinId: 'out' }, to: { componentId: 'probe1', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'logic-gates',
    title: '2. Fundamental Logic Gates (AND, OR, NOT, XOR)',
    category: 'Gates',
    summary: 'Explore the building blocks of combinational circuits and compare their truth tables.',
    content: `
### The Primary Logic Gates
- **AND Gate**: Outputs \`1\` if and only if **both** inputs $A=1$ and $B=1$.
- **OR Gate**: Outputs \`1\` if **either** input $A=1$ or $B=1$.
- **NOT Gate (Inverter)**: Flips single input bit $A$ into $A'$.
- **XOR Gate (Exclusive OR)**: Outputs \`1\` if inputs **differ** ($A \\ne B$). Very important for arithmetic adders and parity checking!
- **NAND & NOR**: Known as **Universal Gates** because any digital circuit can be built exclusively from them.
    `,
    expectedBehavior: 'Verify that the XOR gate outputs 1 only when exactly one of the two switches is ON.',
    exercise: 'Try changing Input A and Input B to find the only condition where the AND gate turns on.',
    truthTable: {
      headers: ['A', 'B', 'AND (A·B)', 'OR (A+B)', 'XOR (A⊕B)', 'NAND ((A·B)\')'],
      rows: [
        [0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 0]
      ]
    },
    circuit: {
      components: [
        { id: 'sw_a', type: 'SWITCH', x: 100, y: 140, label: 'Switch A', state: { value: 1 } },
        { id: 'sw_b', type: 'SWITCH', x: 100, y: 240, label: 'Switch B', state: { value: 0 } },
        { id: 'gate_and', type: 'AND', x: 280, y: 100, label: 'AND Gate', state: {} },
        { id: 'gate_xor', type: 'XOR', x: 280, y: 220, label: 'XOR Gate', state: {} },
        { id: 'led_and', type: 'LED', x: 440, y: 100, label: 'AND Out', state: { color: '#3b82f6' } },
        { id: 'led_xor', type: 'LED', x: 440, y: 220, label: 'XOR Out', state: { color: '#ec4899' } }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'sw_a', pinId: 'out' }, to: { componentId: 'gate_and', pinId: 'in1' } },
        { id: 'w2', from: { componentId: 'sw_b', pinId: 'out' }, to: { componentId: 'gate_and', pinId: 'in2' } },
        { id: 'w3', from: { componentId: 'gate_and', pinId: 'out' }, to: { componentId: 'led_and', pinId: 'in' } },
        { id: 'w4', from: { componentId: 'sw_a', pinId: 'out' }, to: { componentId: 'gate_xor', pinId: 'in1' } },
        { id: 'w5', from: { componentId: 'sw_b', pinId: 'out' }, to: { componentId: 'gate_xor', pinId: 'in2' } },
        { id: 'w6', from: { componentId: 'gate_xor', pinId: 'out' }, to: { componentId: 'led_xor', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'adders-arithmetic',
    title: '3. Half Adders and Full Adders',
    category: 'Arithmetic',
    summary: 'Build binary addition circuits capable of computing binary sum and carry propagation.',
    content: `
### Binary Addition Principles
Binary arithmetic follows simple rules:
- $0 + 0 = 0$
- $0 + 1 = 1$
- $1 + 0 = 1$
- $1 + 1 = 10_2$ (Sum = 0, Carry = 1)
- $1 + 1 + 1 = 11_2$ (Sum = 1, Carry = 1)

### Half Adder vs Full Adder
- **Half Adder**: Adds two 1-bit inputs $A$ and $B$.
  - $\\text{Sum} = A \\oplus B$
  - $\\text{Carry} = A \\cdot B$
- **Full Adder**: Adds two inputs $A, B$ **plus** an incoming Carry ($C_{in}$).
  - $\\text{Sum} = A \\oplus B \\oplus C_{in}$
  - $C_{out} = (A \\cdot B) + C_{in} \\cdot (A \\oplus B)$
    `,
    expectedBehavior: 'When both A and B are 1, Sum becomes 0 and Carry Out illuminates.',
    exercise: 'Set A=1, B=1, and Cin=1 on the Full Adder to verify that both Sum and Cout equal 1.',
    truthTable: {
      headers: ['A', 'B', 'Cin', 'Sum (S)', 'Carry Out (Cout)'],
      rows: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ]
    },
    circuit: {
      components: [
        { id: 'sw_fa_a', type: 'SWITCH', x: 100, y: 120, label: 'Input A', state: { value: 1 } },
        { id: 'sw_fa_b', type: 'SWITCH', x: 100, y: 200, label: 'Input B', state: { value: 1 } },
        { id: 'sw_fa_cin', type: 'SWITCH', x: 100, y: 280, label: 'Carry In (Cin)', state: { value: 0 } },
        { id: 'fa1', type: 'FULL_ADDER', x: 300, y: 160, label: '1-Bit Full Adder', state: {} },
        { id: 'led_sum', type: 'LED', x: 500, y: 140, label: 'Sum (S)', state: { color: '#10b981' } },
        { id: 'led_cout', type: 'LED', x: 500, y: 220, label: 'Carry (Cout)', state: { color: '#f59e0b' } }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'sw_fa_a', pinId: 'out' }, to: { componentId: 'fa1', pinId: 'a' } },
        { id: 'w2', from: { componentId: 'sw_fa_b', pinId: 'out' }, to: { componentId: 'fa1', pinId: 'b' } },
        { id: 'w3', from: { componentId: 'sw_fa_cin', pinId: 'out' }, to: { componentId: 'fa1', pinId: 'cin' } },
        { id: 'w4', from: { componentId: 'fa1', pinId: 'sum' }, to: { componentId: 'led_sum', pinId: 'in' } },
        { id: 'w5', from: { componentId: 'fa1', pinId: 'cout' }, to: { componentId: 'led_cout', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'multiplexers-demux',
    title: '4. Multiplexers & Demultiplexers (Data Routing)',
    category: 'Combinational',
    summary: 'Learn how digital multiplexers channel multiple data streams into a single output line.',
    content: `
### What is a Multiplexer (MUX)?
A **Multiplexer** (data selector) connects one of $2^n$ data inputs to a single output line based on $n$ select lines:
- A **2:1 MUX** uses 1 select line: $Y = S' \\cdot I_0 + S \\cdot I_1$.
- A **4:1 MUX** uses 2 select lines to choose between 4 input channels.

### Demultiplexer (DEMUX)
A **Demultiplexer** performs the reverse: takes 1 input and distributes it to 1 of $2^n$ output channels.
    `,
    expectedBehavior: 'Toggle the Select switch: when S=0 the output matches I0; when S=1 the output matches I1.',
    exercise: 'Set I0=1, I1=0. Flip the Select line to observe immediate signal switching at the output LED.',
    truthTable: {
      headers: ['Select (S)', 'I0', 'I1', 'Output Y'],
      rows: [
        [0, 0, 0, 0],
        [0, 1, 0, 1],
        [1, 0, 1, 1],
        [1, 1, 0, 0]
      ]
    },
    circuit: {
      components: [
        { id: 'sw_i0', type: 'SWITCH', x: 100, y: 120, label: 'Data I0', state: { value: 1 } },
        { id: 'sw_i1', type: 'SWITCH', x: 100, y: 200, label: 'Data I1', state: { value: 0 } },
        { id: 'sw_sel', type: 'SWITCH', x: 100, y: 280, label: 'Select (S)', state: { value: 0 } },
        { id: 'mux1', type: 'MUX_2TO1', x: 300, y: 160, label: '2:1 Multiplexer', state: {} },
        { id: 'led_out', type: 'LED', x: 480, y: 160, label: 'Selected Output Y', state: { color: '#06b6d4' } }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'sw_i0', pinId: 'out' }, to: { componentId: 'mux1', pinId: 'i0' } },
        { id: 'w2', from: { componentId: 'sw_i1', pinId: 'out' }, to: { componentId: 'mux1', pinId: 'i1' } },
        { id: 'w3', from: { componentId: 'sw_sel', pinId: 'out' }, to: { componentId: 'mux1', pinId: 'sel' } },
        { id: 'w4', from: { componentId: 'mux1', pinId: 'out' }, to: { componentId: 'led_out', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'decoders-encoders',
    title: '5. Binary Decoders and Priority Encoders',
    category: 'Combinational',
    summary: 'Convert binary coded representations into distinct single-line activations and vice-versa.',
    content: `
### Binary Decoders
A **$n$-to-$2^n$ Decoder** activates exactly one output line corresponding to the binary value represented on its input pins:
- In a **2-to-4 Decoder**, inputs $(A_1, A_0)$ activate output $Y_0, Y_1, Y_2,$ or $Y_3$.
- Most decoders include an **Enable (EN)** pin; if EN=0, all outputs remain inactive (0).

### Priority Encoders
Encodes multiple active lines into a binary number, giving highest priority to the highest-order input line.
    `,
    expectedBehavior: 'Changing the 2 input switches activates exactly one corresponding output LED.',
    exercise: 'Set A1=1 and A0=0 to verify that Y2 illuminates while all other outputs stay OFF.',
    truthTable: {
      headers: ['A1', 'A0', 'EN', 'Y0', 'Y1', 'Y2', 'Y3'],
      rows: [
        ['X', 'X', 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0, 0, 1]
      ]
    },
    circuit: {
      components: [
        { id: 'sw_a0', type: 'SWITCH', x: 80, y: 120, label: 'Address A0', state: { value: 1 } },
        { id: 'sw_a1', type: 'SWITCH', x: 80, y: 190, label: 'Address A1', state: { value: 0 } },
        { id: 'sw_en', type: 'CONST_1', x: 80, y: 260, label: 'Enable (VCC)', state: {} },
        { id: 'dec1', type: 'DECODER_2TO4', x: 260, y: 140, label: '2:4 Decoder', state: {} },
        { id: 'led_y0', type: 'LED', x: 440, y: 90, label: 'Y0 (00)', state: { color: '#6366f1' } },
        { id: 'led_y1', type: 'LED', x: 440, y: 140, label: 'Y1 (01)', state: { color: '#6366f1' } },
        { id: 'led_y2', type: 'LED', x: 440, y: 190, label: 'Y2 (10)', state: { color: '#6366f1' } },
        { id: 'led_y3', type: 'LED', x: 440, y: 240, label: 'Y3 (11)', state: { color: '#6366f1' } }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'sw_a0', pinId: 'out' }, to: { componentId: 'dec1', pinId: 'in0' } },
        { id: 'w2', from: { componentId: 'sw_a1', pinId: 'out' }, to: { componentId: 'dec1', pinId: 'in1' } },
        { id: 'w3', from: { componentId: 'sw_en', pinId: 'out' }, to: { componentId: 'dec1', pinId: 'en' } },
        { id: 'w4', from: { componentId: 'dec1', pinId: 'y0' }, to: { componentId: 'led_y0', pinId: 'in' } },
        { id: 'w5', from: { componentId: 'dec1', pinId: 'y1' }, to: { componentId: 'led_y1', pinId: 'in' } },
        { id: 'w6', from: { componentId: 'dec1', pinId: 'y2' }, to: { componentId: 'led_y2', pinId: 'in' } },
        { id: 'w7', from: { componentId: 'dec1', pinId: 'y3' }, to: { componentId: 'led_y3', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'flip-flops-sequential',
    title: '6. Sequential Logic: Edge-Triggered Flip-Flops',
    category: 'Sequential',
    summary: 'Discover memory elements that store state and update synchronously on clock edges.',
    content: `
### What Makes Sequential Circuits Different?
Unlike combinational circuits whose outputs depend solely on present inputs, **sequential circuits** possess **memory**: their outputs depend on both present inputs and their internal history (state).

### The D Flip-Flop
The **Data (D) Flip-Flop** is the ubiquitous building block of computer memory and CPU registers:
- On the **rising edge** of the Clock ($0 \\to 1$), the state $Q$ captures the value of $D$.
- In between clock edges, the stored bit is securely retained regardless of any changes on $D$.
- Inverting output $\\overline{Q}$ always maintains the complement of $Q$.
    `,
    expectedBehavior: 'Changing D does not affect Q until the Clock pulses from 0 to 1.',
    exercise: 'Set D=1. Trigger the Clock generator and watch Q capture 1 on the rising edge.',
    truthTable: {
      headers: ['Clock Edge', 'Data (D)', 'Reset (R)', 'Q(next)', '~Q(next)'],
      rows: [
        ['No Edge', 'X', 0, 'Q (No change)', '~Q'],
        ['Rising (↑)', 0, 0, 0, 1],
        ['Rising (↑)', 1, 0, 1, 0],
        ['Any', 'X', 1, 0, 1]
      ]
    },
    circuit: {
      components: [
        { id: 'clk1', type: 'CLOCK', x: 100, y: 150, label: 'Clock Gen', state: { frequency: 1 } },
        { id: 'sw_d', type: 'SWITCH', x: 100, y: 240, label: 'Data Input D', state: { value: 1 } },
        { id: 'dff1', type: 'D_FLIPFLOP', x: 300, y: 170, label: 'D Flip-Flop', state: { q: 0 } },
        { id: 'led_q', type: 'LED', x: 480, y: 150, label: 'Stored Q', state: { color: '#10b981' } },
        { id: 'led_qn', type: 'LED', x: 480, y: 230, label: 'Inverse ~Q', state: { color: '#ef4444' } }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'clk1', pinId: 'out' }, to: { componentId: 'dff1', pinId: 'clk' } },
        { id: 'w2', from: { componentId: 'sw_d', pinId: 'out' }, to: { componentId: 'dff1', pinId: 'd' } },
        { id: 'w3', from: { componentId: 'dff1', pinId: 'q' }, to: { componentId: 'led_q', pinId: 'in' } },
        { id: 'w4', from: { componentId: 'dff1', pinId: 'qn' }, to: { componentId: 'led_qn', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'counters-registers',
    title: '7. Registers and Binary Counters',
    category: 'Sequential',
    summary: 'Assemble multi-bit storage registers and synchronous binary counters with carry out.',
    content: `
### Binary Counters
A **4-bit Binary Counter** counts from $0$ up to $15$ ($0000_2$ to $1111_2$) on each clock pulse:
- **Enable (EN)**: When $EN=1$, counting proceeds; when $EN=0$, the count holds its current value.
- **Reset (RST)**: Clears all bits to zero.
- **Ripple Carry Out (RCO)**: Asserts high when the counter reaches $15$ ($1111_2$), enabling cascading of multiple 4-bit counters into 8-bit or 16-bit counters!
    `,
    expectedBehavior: 'With the clock running, the 4 LEDs count upward in binary (0 to 15) and cycle back to 0.',
    exercise: 'Observe how the RCO indicator turns on when Q3..Q0 all light up at value 15.',
    truthTable: {
      headers: ['Clock Pulse', 'Q3 (MSB)', 'Q2', 'Q1', 'Q0 (LSB)', 'Decimal Value'],
      rows: [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 1],
        [2, 0, 0, 1, 0, 2],
        [3, 0, 0, 1, 1, 3],
        [4, 0, 1, 0, 0, 4],
        ['...', '...', '...', '...', '...', '...'],
        [15, 1, 1, 1, 1, '15 (RCO=1)']
      ]
    },
    circuit: {
      components: [
        { id: 'clk1', type: 'CLOCK', x: 90, y: 160, label: 'Clock Source', state: { frequency: 1 } },
        { id: 'sw_en', type: 'CONST_1', x: 90, y: 230, label: 'Enable (VCC)', state: {} },
        { id: 'cnt1', type: 'BINARY_COUNTER_4BIT', x: 270, y: 160, label: '4-Bit Counter', state: { count: 0 } },
        { id: 'led_q0', type: 'LED', x: 470, y: 100, label: 'Q0 (Bit 0)', state: { color: '#38bdf8' } },
        { id: 'led_q1', type: 'LED', x: 470, y: 140, label: 'Q1 (Bit 1)', state: { color: '#38bdf8' } },
        { id: 'led_q2', type: 'LED', x: 470, y: 180, label: 'Q2 (Bit 2)', state: { color: '#38bdf8' } },
        { id: 'led_q3', type: 'LED', x: 470, y: 220, label: 'Q3 (Bit 3)', state: { color: '#38bdf8' } },
        { id: 'led_rco', type: 'LED', x: 470, y: 270, label: 'RCO (Overflow)', state: { color: '#f59e0b' } }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'clk1', pinId: 'out' }, to: { componentId: 'cnt1', pinId: 'clk' } },
        { id: 'w2', from: { componentId: 'sw_en', pinId: 'out' }, to: { componentId: 'cnt1', pinId: 'en' } },
        { id: 'w3', from: { componentId: 'cnt1', pinId: 'q0' }, to: { componentId: 'led_q0', pinId: 'in' } },
        { id: 'w4', from: { componentId: 'cnt1', pinId: 'q1' }, to: { componentId: 'led_q1', pinId: 'in' } },
        { id: 'w5', from: { componentId: 'cnt1', pinId: 'q2' }, to: { componentId: 'led_q2', pinId: 'in' } },
        { id: 'w6', from: { componentId: 'cnt1', pinId: 'q3' }, to: { componentId: 'led_q3', pinId: 'in' } },
        { id: 'w7', from: { componentId: 'cnt1', pinId: 'rco' }, to: { componentId: 'led_rco', pinId: 'in' } }
      ]
    }
  },

  {
    id: 'timing-waveforms',
    title: '8. Clock Signals, Timing Diagrams & Propagation',
    category: 'Analysis',
    summary: 'Analyze digital waveforms, rising and falling edges, clock periods, and duty cycles.',
    content: `
### Reading Timing Waveforms
In digital hardware analysis, **timing diagrams** show voltage levels against the time axis:
- **Clock Period ($T$)**: The time taken to complete one full cycle (High + Low).
- **Frequency ($f$)**: $f = 1/T$, measured in Hertz (Hz).
- **Duty Cycle**: The percentage of the clock period during which the signal is High ($50\\%$ for a standard symmetrical square wave).
- **Setup Time & Hold Time**: The window around the clock edge during which data inputs must remain stable.
    `,
    expectedBehavior: 'Open the Timing Diagram panel in the inspector to see real-time square waveforms matching the simulation tick.',
    exercise: 'Switch to the Timing Diagram tab in the right inspector to watch live digital traces.',
    truthTable: {
      headers: ['Signal Name', 'Type', 'Waveform Behavior'],
      rows: [
        ['Clock', 'Square Wave', 'Alternates 0 and 1 periodically'],
        ['Input', 'Step Function', 'Changes on user toggle'],
        ['Output', 'Response', 'Reflects gate or flip-flop transition']
      ]
    },
    circuit: {
      components: [
        { id: 'clk_gen', type: 'CLOCK', x: 100, y: 150, label: 'Clock Signal', state: { frequency: 1 } },
        { id: 'gate_not', type: 'NOT', x: 280, y: 150, label: 'Inverted Clock', state: {} },
        { id: 'probe_clk', type: 'PROBE', x: 440, y: 110, label: 'CLK Wave', state: {} },
        { id: 'probe_inv', type: 'PROBE', x: 440, y: 190, label: '~CLK Wave', state: {} }
      ],
      wires: [
        { id: 'w1', from: { componentId: 'clk_gen', pinId: 'out' }, to: { componentId: 'gate_not', pinId: 'in' } },
        { id: 'w2', from: { componentId: 'clk_gen', pinId: 'out' }, to: { componentId: 'probe_clk', pinId: 'in' } },
        { id: 'w3', from: { componentId: 'gate_not', pinId: 'out' }, to: { componentId: 'probe_inv', pinId: 'in' } }
      ]
    }
  }
];
