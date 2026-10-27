import { describe, it, expect } from 'vitest';
import { evaluateComponentOutputs, evaluateCircuit, stepSequentialState } from '../evaluator';
import { generateTruthTable } from '../truthTable';

describe('LogicLab Simulation Engine', () => {
  // Test 1: AND gate
  it('evaluates AND gate correctly for all 4 combinations', () => {
    const comp = { id: 'and1', type: 'AND' };
    expect(evaluateComponentOutputs(comp, { in1: 0, in2: 0 }).out).toBe(0);
    expect(evaluateComponentOutputs(comp, { in1: 0, in2: 1 }).out).toBe(0);
    expect(evaluateComponentOutputs(comp, { in1: 1, in2: 0 }).out).toBe(0);
    expect(evaluateComponentOutputs(comp, { in1: 1, in2: 1 }).out).toBe(1);
  });

  // Test 2: XOR gate
  it('evaluates XOR gate correctly for all 4 combinations', () => {
    const comp = { id: 'xor1', type: 'XOR' };
    expect(evaluateComponentOutputs(comp, { in1: 0, in2: 0 }).out).toBe(0);
    expect(evaluateComponentOutputs(comp, { in1: 0, in2: 1 }).out).toBe(1);
    expect(evaluateComponentOutputs(comp, { in1: 1, in2: 0 }).out).toBe(1);
    expect(evaluateComponentOutputs(comp, { in1: 1, in2: 1 }).out).toBe(0);
  });

  // Test 3: 2:1 Multiplexer
  it('evaluates 2:1 multiplexer selecting correct input based on Sel', () => {
    const comp = { id: 'mux1', type: 'MUX_2TO1' };
    // Sel = 0 -> select i0
    expect(evaluateComponentOutputs(comp, { i0: 1, i1: 0, sel: 0 }).out).toBe(1);
    expect(evaluateComponentOutputs(comp, { i0: 0, i1: 1, sel: 0 }).out).toBe(0);
    // Sel = 1 -> select i1
    expect(evaluateComponentOutputs(comp, { i0: 1, i1: 0, sel: 1 }).out).toBe(0);
    expect(evaluateComponentOutputs(comp, { i0: 0, i1: 1, sel: 1 }).out).toBe(1);
  });

  // Test 4: Half Adder
  it('evaluates Half Adder calculating Sum and Carry', () => {
    const comp = { id: 'ha1', type: 'HALF_ADDER' };
    expect(evaluateComponentOutputs(comp, { a: 0, b: 0 })).toEqual({ sum: 0, cout: 0 });
    expect(evaluateComponentOutputs(comp, { a: 1, b: 0 })).toEqual({ sum: 1, cout: 0 });
    expect(evaluateComponentOutputs(comp, { a: 0, b: 1 })).toEqual({ sum: 1, cout: 0 });
    expect(evaluateComponentOutputs(comp, { a: 1, b: 1 })).toEqual({ sum: 0, cout: 1 });
  });

  // Test 5: Full Adder (all 8 combinations)
  it('evaluates Full Adder for all 8 input combinations', () => {
    const comp = { id: 'fa1', type: 'FULL_ADDER' };
    const cases = [
      { a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
      { a: 0, b: 0, cin: 1, sum: 1, cout: 0 },
      { a: 0, b: 1, cin: 0, sum: 1, cout: 0 },
      { a: 0, b: 1, cin: 1, sum: 0, cout: 1 },
      { a: 1, b: 0, cin: 0, sum: 1, cout: 0 },
      { a: 1, b: 0, cin: 1, sum: 0, cout: 1 },
      { a: 1, b: 1, cin: 0, sum: 0, cout: 1 },
      { a: 1, b: 1, cin: 1, sum: 1, cout: 1 }
    ];

    cases.forEach(({ a, b, cin, sum, cout }) => {
      const res = evaluateComponentOutputs(comp, { a, b, cin });
      expect(res.sum).toBe(sum);
      expect(res.cout).toBe(cout);
    });
  });

  // Test 6: 2-to-4 Decoder
  it('evaluates 2-to-4 Decoder activating correct output', () => {
    const comp = { id: 'dec1', type: 'DECODER_2TO4' };
    expect(evaluateComponentOutputs(comp, { in0: 0, in1: 0, en: 1 })).toEqual({ y0: 1, y1: 0, y2: 0, y3: 0 });
    expect(evaluateComponentOutputs(comp, { in0: 1, in1: 0, en: 1 })).toEqual({ y0: 0, y1: 1, y2: 0, y3: 0 });
    expect(evaluateComponentOutputs(comp, { in0: 0, in1: 1, en: 1 })).toEqual({ y0: 0, y1: 0, y2: 1, y3: 0 });
    expect(evaluateComponentOutputs(comp, { in0: 1, in1: 1, en: 1 })).toEqual({ y0: 0, y1: 0, y2: 0, y3: 1 });
    // Disable EN = 0
    expect(evaluateComponentOutputs(comp, { in0: 1, in1: 1, en: 0 })).toEqual({ y0: 0, y1: 0, y2: 0, y3: 0 });
  });

  // Test 7: D Flip-Flop
  it('captures D on active clock edge and retains state', () => {
    let comp = { id: 'dff1', type: 'D_FLIPFLOP', state: { q: 0, prevClk: 0 } };

    // Before edge: D=1, CLK=0 -> Q remains 0
    let step = stepSequentialState([comp], { dff1: { d: 1, clk: 0 } });
    comp = step.updatedComponents[0];
    expect(comp.state.q).toBe(0);

    // Rising edge: CLK goes 0 -> 1 with D=1 -> Q becomes 1
    step = stepSequentialState([comp], { dff1: { d: 1, clk: 1 } });
    comp = step.updatedComponents[0];
    expect(comp.state.q).toBe(1);

    // Retain state while CLK remains 1 even if D changes to 0
    step = stepSequentialState([comp], { dff1: { d: 0, clk: 1 } });
    comp = step.updatedComponents[0];
    expect(comp.state.q).toBe(1);

    // Reset signal asserts
    step = stepSequentialState([comp], { dff1: { d: 0, clk: 1, rst: 1 } });
    comp = step.updatedComponents[0];
    expect(comp.state.q).toBe(0);
  });

  // Test 8: 4-bit Binary Counter
  it('advances correctly on clock edges and responds to reset', () => {
    let comp = { id: 'cnt1', type: 'BINARY_COUNTER_4BIT', state: { count: 0, prevClk: 0 } };

    // Tick 1: CLK 0 -> 1 -> Count 1
    let step = stepSequentialState([comp], { cnt1: { clk: 1, en: 1, rst: 0 } });
    comp = step.updatedComponents[0];
    expect(comp.state.count).toBe(1);

    // Falling edge: CLK 1 -> 0 -> Count stays 1
    step = stepSequentialState([comp], { cnt1: { clk: 0, en: 1, rst: 0 } });
    comp = step.updatedComponents[0];
    expect(comp.state.count).toBe(1);

    // Tick 2: CLK 0 -> 1 -> Count 2
    step = stepSequentialState([comp], { cnt1: { clk: 1, en: 1, rst: 0 } });
    comp = step.updatedComponents[0];
    expect(comp.state.count).toBe(2);

    // Reset active
    step = stepSequentialState([comp], { cnt1: { clk: 1, en: 1, rst: 1 } });
    comp = step.updatedComponents[0];
    expect(comp.state.count).toBe(0);
  });

  // Test 9: Truth table generation
  it('generates accurate truth table for a 2-input XOR circuit', () => {
    const graph = {
      components: [
        { id: 's1', type: 'SWITCH', state: { value: 0 } },
        { id: 's2', type: 'SWITCH', state: { value: 0 } },
        { id: 'x1', type: 'XOR', state: {} },
        { id: 'led1', type: 'LED', state: {} }
      ],
      wires: [
        { id: 'w1', from: { componentId: 's1', pinId: 'out' }, to: { componentId: 'x1', pinId: 'in1' } },
        { id: 'w2', from: { componentId: 's2', pinId: 'out' }, to: { componentId: 'x1', pinId: 'in2' } },
        { id: 'w3', from: { componentId: 'x1', pinId: 'out' }, to: { componentId: 'led1', pinId: 'in' } }
      ]
    };

    const tt = generateTruthTable(graph);
    expect(tt.success).toBe(true);
    expect(tt.rows.length).toBe(4);

    // Outputs for rows [00, 01, 10, 11] should be 0, 1, 1, 0
    expect(tt.rows[0].outputs['led1']).toBe(0);
    expect(tt.rows[1].outputs['led1']).toBe(1);
    expect(tt.rows[2].outputs['led1']).toBe(1);
    expect(tt.rows[3].outputs['led1']).toBe(0);
  });
});
