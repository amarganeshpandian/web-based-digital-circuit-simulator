import React from 'react';
import { COMPONENT_DEFINITIONS, PIN_TYPE } from '../definitions';

/**
 * SVG Component Renderer for all digital logic elements
 */
export function ComponentSVG({
  component,
  isSelected,
  pinValues = {},
  onPinMouseDown,
  onPinMouseUp,
  onToggleSwitch,
  connectingPin
}) {
  const def = COMPONENT_DEFINITIONS[component.type];
  if (!def) return null;

  const { width, height, pins = [] } = def;
  const isSwitch = component.type === 'SWITCH';
  const isButton = component.type === 'PUSH_BUTTON';
  const isLed = component.type === 'LED';
  const isProbe = component.type === 'PROBE';
  const isClock = component.type === 'CLOCK';
  const isSevenSeg = component.type === 'SEVENSEG';

  const inputs = pinValues[component.id] || {};

  // Render ANSI standard gate paths
  const renderGateBody = () => {
    switch (component.type) {
      case 'AND':
        return (
          <path
            d="M 15 10 L 45 10 A 20 20 0 0 1 70 30 A 20 20 0 0 1 45 50 L 15 50 Z"
            className="circuit-gate-body"
          />
        );

      case 'NAND':
        return (
          <g>
            <path
              d="M 15 10 L 40 10 A 20 20 0 0 1 65 30 A 20 20 0 0 1 40 50 L 15 50 Z"
              className="circuit-gate-body"
            />
            <circle cx="70" cy="30" r="4.5" className="circuit-bubble" />
          </g>
        );

      case 'OR':
        return (
          <path
            d="M 15 10 Q 30 30 15 50 Q 50 48 70 30 Q 50 12 15 10 Z"
            className="circuit-gate-body"
          />
        );

      case 'NOR':
        return (
          <g>
            <path
              d="M 15 10 Q 30 30 15 50 Q 45 48 65 30 Q 45 12 15 10 Z"
              className="circuit-gate-body"
            />
            <circle cx="70" cy="30" r="4.5" className="circuit-bubble" />
          </g>
        );

      case 'NOT':
        return (
          <g>
            <path d="M 15 12 L 60 25 L 15 38 Z" className="circuit-gate-body" />
            <circle cx="65" cy="25" r="4.5" className="circuit-bubble" />
          </g>
        );

      case 'XOR':
        return (
          <g>
            <path d="M 10 10 Q 25 30 10 50" className="circuit-xor-arc" fill="none" />
            <path
              d="M 18 10 Q 33 30 18 50 Q 53 48 73 30 Q 53 12 18 10 Z"
              className="circuit-gate-body"
            />
          </g>
        );

      case 'XNOR':
        return (
          <g>
            <path d="M 10 10 Q 25 30 10 50" className="circuit-xor-arc" fill="none" />
            <path
              d="M 18 10 Q 33 30 18 50 Q 48 48 68 30 Q 48 12 18 10 Z"
              className="circuit-gate-body"
            />
            <circle cx="73" cy="30" r="4.5" className="circuit-bubble" />
          </g>
        );

      // Modular IC Chip Box for Multi-pin Blocks
      default:
        return (
          <g>
            <rect
              x="5"
              y="5"
              width={width - 10}
              height={height - 10}
              rx="6"
              className="circuit-chip-body"
            />
            {/* Chip notch on top */}
            <circle cx={width / 2} cy="5" r="3.5" fill="#1e293b" />
          </g>
        );
    }
  };

  return (
    <g
      id={`comp-${component.id}`}
      transform={`translate(${component.x}, ${component.y})`}
      className={`circuit-component ${isSelected ? 'selected' : ''}`}
    >
      {/* Component Shadow / Selection Outline */}
      {isSelected && (
        <rect
          x="-6"
          y="-6"
          width={width + 12}
          height={height + 12}
          rx="10"
          className="circuit-selection-box"
        />
      )}

      {/* Internal Gate / Chip Graphic */}
      {renderGateBody()}

      {/* Interactive Switch Rendering */}
      {isSwitch && (
        <g
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSwitch && onToggleSwitch(component.id);
          }}
        >
          <rect
            x="12"
            y="12"
            width="56"
            height="26"
            rx="13"
            fill={component.state?.value ? '#059669' : '#334155'}
            stroke="#475569"
            strokeWidth="1.5"
          />
          <circle
            cx={component.state?.value ? 54 : 26}
            cy="25"
            r="10"
            fill="#ffffff"
            className="transition-all"
            filter="drop-shadow(0 2px 3px rgba(0,0,0,0.5))"
          />
          <text
            x={component.state?.value ? 28 : 52}
            y="29"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {component.state?.value ? '1' : '0'}
          </text>
        </g>
      )}

      {/* Push Button */}
      {isButton && (
        <g
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.stopPropagation();
            onToggleSwitch && onToggleSwitch(component.id, 1);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            onToggleSwitch && onToggleSwitch(component.id, 0);
          }}
        >
          <circle cx="40" cy="25" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <circle
            cx="40"
            cy="25"
            r="11"
            fill={component.state?.value ? '#ef4444' : '#991b1b'}
          />
          <text x="40" y="28" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
            PULSE
          </text>
        </g>
      )}

      {/* Constant 0 / 1 */}
      {component.type === 'CONST_0' && (
        <g>
          <rect x="10" y="8" width="45" height="24" rx="4" fill="#0f172a" stroke="#475569" />
          <text x="32" y="24" fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="middle">
            0 (GND)
          </text>
        </g>
      )}

      {component.type === 'CONST_1' && (
        <g>
          <rect x="10" y="8" width="45" height="24" rx="4" fill="#0f172a" stroke="#10b981" />
          <text x="32" y="24" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
            1 (VCC)
          </text>
        </g>
      )}

      {/* Clock Generator */}
      {isClock && (
        <g>
          <rect x="10" y="8" width="65" height="34" rx="5" fill="#0f172a" stroke="#0284c7" />
          <path
            d="M 22 25 L 28 25 L 28 17 L 36 17 L 36 31 L 44 31 L 44 25 L 50 25"
            stroke={inputs.out || component.state?.value ? '#38bdf8' : '#64748b'}
            strokeWidth="2"
            fill="none"
          />
          <text x="58" y="22" fill="#38bdf8" fontSize="8" fontWeight="bold">
            CLK
          </text>
          <text x="58" y="32" fill="#94a3b8" fontSize="8">
            {component.state?.frequency || 1}Hz
          </text>
        </g>
      )}

      {/* Output LED */}
      {isLed && (
        <g>
          {/* LED Ring */}
          <circle cx="35" cy="25" r="16" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          {/* LED Core */}
          <circle
            cx="35"
            cy="25"
            r="11"
            fill={inputs.in === 1 ? (component.state?.color || '#10b981') : '#1e293b'}
            className="transition-colors"
            style={{
              filter: inputs.in === 1 ? `drop-shadow(0 0 10px ${component.state?.color || '#10b981'})` : 'none'
            }}
          />
        </g>
      )}

      {/* Signal Probe Readout */}
      {isProbe && (
        <g>
          <rect x="10" y="8" width="55" height="34" rx="5" fill="#020617" stroke="#334155" strokeWidth="2" />
          <text
            x="37"
            y="31"
            fill={inputs.in === 1 ? '#00f59b' : '#64748b'}
            fontSize="18"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {inputs.in === 1 ? '1' : inputs.in === 0 ? '0' : 'Z'}
          </text>
        </g>
      )}

      {/* 7-Segment Display */}
      {isSevenSeg && (
        <g transform="translate(15, 10)">
          <rect x="0" y="0" width="60" height="100" rx="6" fill="#020617" stroke="#334155" />
          {/* Segments a-g */}
          {/* a (top horizontal) */}
          <rect x="15" y="10" width="30" height="6" rx="2" fill={inputs.a === 1 ? '#ef4444' : '#1e293b'} />
          {/* b (top right) */}
          <rect x="43" y="16" width="6" height="28" rx="2" fill={inputs.b === 1 ? '#ef4444' : '#1e293b'} />
          {/* c (bottom right) */}
          <rect x="43" y="48" width="6" height="28" rx="2" fill={inputs.c === 1 ? '#ef4444' : '#1e293b'} />
          {/* d (bottom horizontal) */}
          <rect x="15" y="76" width="30" height="6" rx="2" fill={inputs.d === 1 ? '#ef4444' : '#1e293b'} />
          {/* e (bottom left) */}
          <rect x="11" y="48" width="6" height="28" rx="2" fill={inputs.e === 1 ? '#ef4444' : '#1e293b'} />
          {/* f (top left) */}
          <rect x="11" y="16" width="6" height="28" rx="2" fill={inputs.f === 1 ? '#ef4444' : '#1e293b'} />
          {/* g (middle horizontal) */}
          <rect x="15" y="44" width="30" height="6" rx="2" fill={inputs.g === 1 ? '#ef4444' : '#1e293b'} />
        </g>
      )}

      {/* Component Title / Label for IC Chips & Adders */}
      {!isSwitch && !isButton && !isLed && !isProbe && !isClock && !isSevenSeg && (
        <text
          x={width / 2}
          y={height / 2 + 4}
          fill="#e2e8f0"
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
          pointerEvents="none"
        >
          {def.name.split(' ')[0]}
        </text>
      )}

      {/* Custom Component Top Label */}
      <text
        x={width / 2}
        y="-8"
        fill="#94a3b8"
        fontSize="10"
        textAnchor="middle"
        pointerEvents="none"
        className="font-monospace"
      >
        {component.label}
      </text>

      {/* Render All Component Pins */}
      {pins.map((pin) => {
        const isInput = pin.type === PIN_TYPE.INPUT;
        const currentVal = inputs[pin.id];
        const isConnecting =
          connectingPin &&
          connectingPin.componentId === component.id &&
          connectingPin.pinId === pin.id;

        return (
          <g
            key={pin.id}
            id={`pin-${component.id}-${pin.id}`}
            transform={`translate(${pin.x}, ${pin.y})`}
            className="circuit-pin-group cursor-crosshair"
            onMouseDown={(e) => {
              e.stopPropagation();
              onPinMouseDown && onPinMouseDown(component.id, pin.id, pin.type);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              onPinMouseUp && onPinMouseUp(component.id, pin.id, pin.type);
            }}
          >
            {/* Pin Target Hotspot (larger hitbox for easy clicking) */}
            <circle cx="0" cy="0" r="10" fill="transparent" />

            {/* Visual Pin Circle */}
            <circle
              cx="0"
              cy="0"
              r={isConnecting ? "6" : "4.5"}
              fill={currentVal === 1 ? '#00f59b' : currentVal === 0 ? '#475569' : '#64748b'}
              stroke={isConnecting ? '#38bdf8' : '#0f172a'}
              strokeWidth={isConnecting ? "2.5" : "1.5"}
              className="circuit-pin transition-transform"
            />

            {/* Pin Label */}
            <text
              x={isInput ? 8 : -8}
              y="3"
              fill="#94a3b8"
              fontSize="8"
              fontWeight="bold"
              textAnchor={isInput ? 'start' : 'end'}
              pointerEvents="none"
            >
              {pin.label || pin.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}
