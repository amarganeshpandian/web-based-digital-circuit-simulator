import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { circuitStorage } from '../services/circuitStorage';

export function CircuitsPage() {
  const [circuits, setCircuits] = useState([]);
  const [storageSource, setStorageSource] = useState('local');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadList = async () => {
    setLoading(true);
    try {
      const { source, circuits: list } = await circuitStorage.listCircuits();
      setStorageSource(source);
      setCircuits(list || []);
    } catch {
      showToast('Error retrieving circuits', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete circuit "${title}"?`)) {
      await circuitStorage.deleteCircuit(id);
      showToast(`Deleted ${title}`, 'success');
      loadList();
    }
  };

  const handleDuplicate = async (circuit) => {
    const full = await circuitStorage.getCircuit(circuit.id);
    const dupTitle = `${circuit.title} (Copy)`;
    await circuitStorage.saveCircuit({
      id: null,
      title: dupTitle,
      description: full.circuit?.description || '',
      tags: full.circuit?.tags || 'custom',
      circuit_data: full.circuit?.circuit_data || full.circuit?.data || {}
    });
    showToast(`Duplicated as "${dupTitle}"`, 'success');
    loadList();
  };

  const handleExport = async (c) => {
    try {
      const full = await circuitStorage.getCircuit(c.id);
      circuitStorage.exportToFile(full.circuit);
      showToast(`Exported ${c.title}`, 'success');
    } catch {
      showToast('Export failed', 'danger');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const res = circuitStorage.importFromFile(event.target.result);
      if (!res.success) {
        showToast(`Import error: ${res.error}`, 'danger');
        return;
      }

      await circuitStorage.saveCircuit({
        id: null,
        title: res.circuit.title,
        description: res.circuit.description,
        circuit_data: {
          components: res.circuit.components,
          wires: res.circuit.wires
        }
      });
      showToast(`Imported "${res.circuit.title}"`, 'success');
      loadList();
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const filtered = circuits.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.tags && c.tags.toLowerCase().includes(q))
    );
  });

  return (
    <div className="circuits-page bg-dark text-light min-vh-100 py-4 px-4 d-flex flex-column">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`position-fixed bottom-0 end-0 m-4 z-3 alert alert-${toastMessage.type} shadow-lg py-2 px-3`}>
          {toastMessage.text}
        </div>
      )}

      <div className="container">
        {/* Header Bar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="fw-bold text-white mb-0">Saved Circuit Library</h2>
              <span
                className={`badge ${storageSource === 'backend' ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50' : 'bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50'}`}
              >
                {storageSource === 'backend' ? 'SQLite Database' : 'Local Storage Mode'}
              </span>
            </div>
            <p className="text-secondary small mb-0">Manage, export, and load your custom digital schematics.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json,application/json"
              onChange={handleImportFile}
            />
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="bi bi-upload"></i> Import JSON
            </button>

            <Link to="/simulator" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <i className="bi bi-plus-lg"></i> New Circuit
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-black bg-opacity-50 border-secondary border-opacity-50 text-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-black bg-opacity-50 border-secondary border-opacity-50 text-light"
              placeholder="Filter circuits by title or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <div>Loading circuits...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 border border-secondary border-opacity-25 rounded-4 bg-black bg-opacity-25">
            <i className="bi bi-folder-x fs-1 text-secondary opacity-50 d-block mb-2"></i>
            <h5 className="text-white">No circuits found</h5>
            <p className="text-secondary small mb-3">Build a new circuit in the simulator or import a JSON file.</p>
            <Link to="/simulator" className="btn btn-primary btn-sm">
              Launch Simulator
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(c => (
              <div key={c.id} className="col-md-6 col-lg-4">
                <div className="card h-100 bg-black bg-opacity-40 border-secondary border-opacity-25 rounded-4 p-3 d-flex flex-column justify-content-between hover-border-primary transition-all">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-white mb-0 text-truncate">{c.title}</h5>
                      <span className="badge bg-secondary bg-opacity-25 text-info font-monospace small">
                        {c.tags || 'custom'}
                      </span>
                    </div>

                    <p className="text-secondary small mb-3" style={{ minHeight: '38px' }}>
                      {c.description || 'No description provided.'}
                    </p>

                    <div className="small text-secondary font-monospace mb-3" style={{ fontSize: '11px' }}>
                      Updated: {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                    <Link
                      to={`/simulator?circuit=${c.id}`}
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1 px-3"
                    >
                      <i className="bi bi-play-fill"></i> Open
                    </Link>

                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary border-0 text-secondary hover-text-light"
                        onClick={() => handleExport(c)}
                        title="Export JSON"
                      >
                        <i className="bi bi-download"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary border-0 text-secondary hover-text-light"
                        onClick={() => handleDuplicate(c)}
                        title="Duplicate"
                      >
                        <i className="bi bi-copy"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger border-0 hover-text-danger"
                        onClick={() => handleDelete(c.id, c.title)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
