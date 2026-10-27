/**
 * LogicLab - Circuit Persistence & Storage Service
 * Handles SQLite API persistence with seamless local storage fallback and JSON file import/export.
 */

import { validateCircuitSchema } from '../circuit/graph';
import { LESSONS } from '../data/lessons';

const LOCAL_STORAGE_KEY = 'logiclab_saved_circuits';

// Built-in templates available offline
const DEFAULT_STARTER_CIRCUITS = [
  {
    id: 'tpl_half_adder',
    title: 'Half Adder Circuit',
    description: 'Calculates Sum (A XOR B) and Carry (A AND B) for two 1-bit inputs.',
    tags: 'arithmetic,basic',
    created_at: new Date().toISOString(),
    circuit_data: LESSONS[2].circuit
  },
  {
    id: 'tpl_full_adder',
    title: '1-Bit Full Adder with Carry In',
    description: 'Complete 3-input binary adder calculating Sum and Carry Out.',
    tags: 'arithmetic,adder',
    created_at: new Date().toISOString(),
    circuit_data: LESSONS[2].circuit
  },
  {
    id: 'tpl_mux_2to1',
    title: '2-to-1 Multiplexer',
    description: 'Direct data path selector using 1 select bit.',
    tags: 'combinational,routing',
    created_at: new Date().toISOString(),
    circuit_data: LESSONS[3].circuit
  },
  {
    id: 'tpl_counter_4bit',
    title: '4-Bit Synchronous Counter',
    description: 'Binary up-counter cycling 0 to 15 with overflow indicator.',
    tags: 'sequential,counter',
    created_at: new Date().toISOString(),
    circuit_data: LESSONS[6].circuit
  }
];

function getLocalCircuits() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_STARTER_CIRCUITS));
      return DEFAULT_STARTER_CIRCUITS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STARTER_CIRCUITS;
  }
}

function saveLocalCircuits(circuits) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(circuits));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const circuitStorage = {
  /**
   * Check backend connection health
   */
  async checkBackendHealth() {
    try {
      const res = await fetch('/api/health', { method: 'GET', headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        return { online: true, ...data.data };
      }
      return { online: false, error: `HTTP ${res.status}` };
    } catch {
      return { online: false, error: 'Cannot connect to PHP server' };
    }
  },

  /**
   * Get all saved circuits
   */
  async listCircuits() {
    try {
      const res = await fetch('/api/circuits', { method: 'GET' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return { source: 'backend', circuits: json.data };
        }
      }
    } catch {
      // Backend not running, fallback to localStorage
    }

    return { source: 'local', circuits: getLocalCircuits() };
  },

  /**
   * Fetch a single circuit by ID
   */
  async getCircuit(id) {
    try {
      const res = await fetch(`/api/circuits?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { source: 'backend', circuit: json.data };
        }
      }
    } catch {
      // Fallback
    }

    const locals = getLocalCircuits();
    const found = locals.find(c => c.id === id);
    if (found) {
      return { source: 'local', circuit: found };
    }
    throw new Error('Circuit not found');
  },

  /**
   * Save (create or update) a circuit
   */
  async saveCircuit({ id, title, description, tags, circuit_data }) {
    const isUpdate = Boolean(id);
    const targetId = id || 'c_' + Math.random().toString(36).substring(2, 10);

    const payload = {
      id: targetId,
      title: title || 'Untitled Circuit',
      description: description || '',
      tags: tags || 'custom',
      circuit_data
    };

    // Try backend first
    try {
      const method = isUpdate ? 'PUT' : 'POST';
      const url = isUpdate ? `/api/circuits?id=${encodeURIComponent(targetId)}` : '/api/circuits';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          // Also sync with local storage
          this._saveToLocalStorage({ ...payload, updated_at: new Date().toISOString() });
          return { source: 'backend', id: targetId, success: true };
        }
      }
    } catch {
      // Continue to local storage fallback
    }

    // Save to local storage
    this._saveToLocalStorage({
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return { source: 'local', id: targetId, success: true };
  },

  _saveToLocalStorage(circuitObj) {
    const list = getLocalCircuits();
    const idx = list.findIndex(c => c.id === circuitObj.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...circuitObj };
    } else {
      list.unshift(circuitObj);
    }
    saveLocalCircuits(list);
  },

  /**
   * Delete a circuit
   */
  async deleteCircuit(id) {
    try {
      await fetch(`/api/circuits?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }

    const list = getLocalCircuits().filter(c => c.id !== id);
    saveLocalCircuits(list);
    return { success: true };
  },

  /**
   * Export circuit definition as a downloadable JSON file
   */
  exportToFile(circuit, filename = null) {
    const name = filename || `${(circuit.title || 'circuit').toLowerCase().replace(/\s+/g, '_')}.json`;
    const exportData = {
      app: 'LogicLab',
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      title: circuit.title || 'Exported Circuit',
      description: circuit.description || '',
      components: circuit.circuit_data?.components || circuit.components || [],
      wires: circuit.circuit_data?.wires || circuit.wires || []
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Parse and validate imported JSON file content
   */
  importFromFile(jsonContent) {
    try {
      const data = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      const circuitToValidate = {
        components: data.components || data.circuit_data?.components,
        wires: data.wires || data.circuit_data?.wires
      };

      const validation = validateCircuitSchema(circuitToValidate);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      return {
        success: true,
        circuit: {
          title: data.title || 'Imported Circuit',
          description: data.description || '',
          components: circuitToValidate.components,
          wires: circuitToValidate.wires
        }
      };
    } catch (e) {
      return { success: false, error: 'Malformed JSON file: ' + e.message };
    }
  }
};
