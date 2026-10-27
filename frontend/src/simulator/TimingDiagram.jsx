import React, { useRef, useEffect } from 'react';

/**
 * Timing Diagram Canvas
 * Renders multi-channel digital waveforms with square pulses, rising/falling edges, and time markers.
 */
export function TimingDiagram({
  historyRecorder,
  selectedSignalIds = [],
  onToggleSignal,
  availableSignals = [],
  isClockRunning,
  onToggleClock,
  onStepClock,
  onResetClock,
  clockSpeed,
  onChangeClockSpeed,
  timingTick
}) {
  const canvasRef = useRef(null);

  const channels = historyRecorder ? historyRecorder.getChannels() : [];
  const currentTick = historyRecorder ? historyRecorder.getCurrentTick() : 0;

  // Filter channels based on selected signal ids or show all if none selected
  const visibleChannels = selectedSignalIds.length > 0
    ? channels.filter(ch => selectedSignalIds.includes(ch.id))
    : channels;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, width, height);

    if (visibleChannels.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No signals recorded yet. Start simulation clock or toggle inputs to view waveforms.', width / 2, height / 2);
      return;
    }

    const rowHeight = 44;
    const labelWidth = 130;
    const waveformWidth = width - labelWidth - 20;

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Time ticks axis
    const maxTicks = 40;
    const stepX = waveformWidth / maxTicks;

    for (let i = 0; i <= maxTicks; i += 5) {
      const x = labelWidth + i * stepX;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`T${Math.max(0, currentTick - (maxTicks - i))}`, x, 14);
    }

    // Draw each signal channel
    visibleChannels.forEach((ch, idx) => {
      const yBase = 35 + idx * rowHeight;
      const yHigh = yBase + 8;
      const yLow = yBase + 32;

      // Channel background alternate strip
      if (idx % 2 === 0) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.25)';
        ctx.fillRect(0, yBase, width, rowHeight);
      }

      // Signal Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(ch.name.length > 14 ? ch.name.substring(0, 13) + '…' : ch.name, 12, yBase + 22);

      // Latest Logic Value badge
      const latestVal = ch.data.length > 0 ? ch.data[ch.data.length - 1].val : 0;
      ctx.fillStyle = latestVal === 1 ? '#00f59b' : '#64748b';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(latestVal === 1 ? 'HIGH (1)' : 'LOW (0)', 75, yBase + 22);

      // Channel baseline guide
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
      ctx.beginPath();
      ctx.moveTo(labelWidth, yLow);
      ctx.lineTo(width - 15, yLow);
      ctx.stroke();

      // Render square digital waveform
      if (ch.data.length > 1) {
        ctx.strokeStyle = latestVal === 1 ? '#00f59b' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const dataWindow = ch.data.slice(-maxTicks);
        const startIndex = maxTicks - dataWindow.length;

        dataWindow.forEach((point, pIdx) => {
          const x = labelWidth + (startIndex + pIdx) * stepX;
          const y = point.val === 1 ? yHigh : yLow;

          if (pIdx === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevPoint = dataWindow[pIdx - 1];
            const prevY = prevPoint.val === 1 ? yHigh : yLow;
            // Square wave transition
            ctx.lineTo(x, prevY);
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
      }
    });
  }, [visibleChannels, currentTick, timingTick]);

  return (
    <div className="timing-diagram-container bg-dark rounded border border-secondary border-opacity-25 p-3">
      {/* Waveform Controls Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm ${isClockRunning ? 'btn-warning' : 'btn-success'} d-flex align-items-center gap-1`}
            onClick={onToggleClock}
            title={isClockRunning ? 'Pause simulation clock' : 'Start simulation clock'}
          >
            <i className={`bi bi-${isClockRunning ? 'pause-fill' : 'play-fill'}`}></i>
            {isClockRunning ? 'Pause' : 'Run Clock'}
          </button>

          <button
            className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
            onClick={onStepClock}
            disabled={isClockRunning}
            title="Single-step simulation clock edge"
          >
            <i className="bi bi-chevron-bar-right"></i>
            Step Edge
          </button>

          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={onResetClock}
            title="Reset history and clock tick"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            Reset
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="text-secondary small">Speed:</label>
          <select
            className="form-select form-select-sm bg-dark text-light border-secondary border-opacity-50"
            style={{ width: '110px' }}
            value={clockSpeed}
            onChange={(e) => onChangeClockSpeed(Number(e.target.value))}
          >
            <option value={1000}>1 Hz (Slow)</option>
            <option value={500}>2 Hz (Normal)</option>
            <option value={200}>5 Hz (Fast)</option>
            <option value={100}>10 Hz (Max)</option>
          </select>
          <span className="badge bg-secondary font-monospace">Tick: {currentTick}</span>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="canvas-wrapper overflow-auto border border-secondary border-opacity-25 rounded bg-black">
        <canvas
          ref={canvasRef}
          width={720}
          height={Math.max(220, 45 + visibleChannels.length * 44)}
          className="d-block w-100"
        />
      </div>

      {/* Monitored Signals Checkboxes */}
      {availableSignals.length > 0 && (
        <div className="mt-3">
          <div className="text-secondary small fw-bold mb-2">Monitored Signal Channels:</div>
          <div className="d-flex flex-wrap gap-2">
            {availableSignals.map(sig => {
              const active = selectedSignalIds.length === 0 || selectedSignalIds.includes(sig.id);
              return (
                <button
                  key={sig.id}
                  className={`btn btn-sm py-0 px-2 ${active ? 'btn-outline-primary' : 'btn-outline-secondary opacity-50'}`}
                  onClick={() => onToggleSignal(sig.id)}
                >
                  <i className={`bi bi-${active ? 'check-circle-fill' : 'circle'} me-1`}></i>
                  {sig.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
