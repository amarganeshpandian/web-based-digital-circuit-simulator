/**
 * LogicLab - Signal History & Waveform Recorder
 * Tracks discrete time-series logic levels for timing diagram rendering.
 */

export class SignalHistoryRecorder {
  constructor(maxTicks = 60) {
    this.maxTicks = maxTicks;
    this.currentTick = 0;
    // Map of signalKey -> Array of { tick: number, val: 0 | 1 }
    this.signals = new Map();
  }

  reset() {
    this.currentTick = 0;
    this.signals.clear();
  }

  /**
   * Record a snapshot of values at the current simulation tick.
   *
   * @param {Array} monitoredSignals - Array of { id, name, val }
   */
  recordStep(monitoredSignals) {
    this.currentTick++;

    monitoredSignals.forEach(({ id, name, val }) => {
      if (!this.signals.has(id)) {
        this.signals.set(id, {
          id,
          name,
          data: []
        });
      }

      const sig = this.signals.get(id);
      sig.name = name; // keep name up to date if renamed
      sig.data.push({
        tick: this.currentTick,
        val: val === 1 ? 1 : 0
      });

      // Maintain sliding window buffer
      if (sig.data.length > this.maxTicks) {
        sig.data.shift();
      }
    });
  }

  /**
   * Get all active waveform channels
   */
  getChannels() {
    return Array.from(this.signals.values());
  }

  getCurrentTick() {
    return this.currentTick;
  }
}
