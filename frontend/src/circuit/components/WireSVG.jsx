import React from 'react';
import { getPinPosition } from '../graph';

/**
 * Computes an aesthetic curved or orthogonal cubic bezier path between two pin positions
 */
export function getWirePath(start, end) {
  const dx = Math.abs(end.x - start.x);
  const offset = Math.max(30, Math.min(dx * 0.5, 120));

  // If wire loops back to the left
  if (end.x < start.x) {
    const dy = end.y - start.y;
    return `M ${start.x} ${start.y} C ${start.x + 60} ${start.y + (dy > 0 ? 30 : -30)}, ${end.x - 60} ${end.y - (dy > 0 ? 30 : -30)}, ${end.x} ${end.y}`;
  }

  return `M ${start.x} ${start.y} C ${start.x + offset} ${start.y}, ${end.x - offset} ${end.y}, ${end.x} ${end.y}`;
}

export function WireSVG({
  wire,
  components,
  wireValues = {},
  isSelected,
  onSelectWire,
  onDeleteWire
}) {
  const srcComp = components.find(c => c.id === wire.from.componentId);
  const tgtComp = components.find(c => c.id === wire.to.componentId);

  if (!srcComp || !tgtComp) return null;

  const start = getPinPosition(srcComp, wire.from.pinId);
  const end = getPinPosition(tgtComp, wire.to.pinId);
  const pathD = getWirePath(start, end);

  const value = wireValues[wire.id] ?? 0;
  const isHigh = value === 1;

  // Midpoint for delete button or indicator
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  return (
    <g
      id={`wire-${wire.id}`}
      className={`circuit-wire-group ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectWire && onSelectWire(wire.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteWire && onDeleteWire(wire.id);
      }}
    >
      {/* Invisible thick path for easy mouse clicking and hovering */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="14"
        className="cursor-pointer"
      />

      {/* Wire Glow when High or Selected */}
      {isHigh && (
        <path
          d={pathD}
          fill="none"
          stroke="#00f59b"
          strokeWidth="6"
          strokeOpacity="0.25"
          className="circuit-wire-glow"
        />
      )}

      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="6"
          strokeOpacity="0.4"
          className="circuit-wire-selection"
        />
      )}

      {/* Main Solid Wire Line */}
      <path
        d={pathD}
        fill="none"
        stroke={isSelected ? '#38bdf8' : isHigh ? '#00f59b' : '#475569'}
        strokeWidth={isHigh ? '2.5' : '2'}
        className={`circuit-wire ${isHigh ? 'high' : 'low'}`}
      />

      {/* Animated current pulses when signal is HIGH */}
      {isHigh && (
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          className="circuit-wire-pulse"
        />
      )}

      {/* Midpoint Junction Marker if selected */}
      {isSelected && (
        <circle cx={midX} cy={midY} r="4" fill="#38bdf8" />
      )}
    </g>
  );
}
