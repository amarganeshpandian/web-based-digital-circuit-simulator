import React from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '../data/lessons';

export function HomePage() {
  return (
    <div className="home-page bg-dark text-light min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <section className="py-5 position-relative overflow-hidden border-bottom border-secondary border-opacity-25" style={{ background: 'radial-gradient(ellipse at 50% -20%, #1e293b 0%, #0a0f1d 75%)' }}>
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success small mb-3">
                <span className="rounded-circle bg-success d-inline-block" style={{ width: '8px', height: '8px' }}></span>
                Educational Digital Logic Simulator for Engineering Students
              </div>

              <h1 className="display-4 fw-bold text-white mb-3 tracking-tight">
                Design, Wire & Simulate{' '}
                <span style={{ background: 'linear-gradient(135deg, #00f59b 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Digital Circuits
                </span>{' '}
                in Real-Time.
              </h1>

              <p className="lead text-secondary mb-4" style={{ fontSize: '1.15rem' }}>
                LogicLab provides an interactive visual circuit laboratory with zero installation. Connect logic gates, multiplexers, adders, edge-triggered flip-flops, and counters. Observe live signal flows, generate truth tables, and analyze timing diagrams.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/simulator"
                  className="btn btn-lg px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <i className="bi bi-play-circle-fill fs-5"></i>
                  Open Simulator Now
                </Link>

                <Link
                  to="/learn"
                  className="btn btn-lg btn-outline-secondary px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                >
                  <i className="bi bi-book-half"></i>
                  Explore Guided Lessons
                </Link>
              </div>

              <div className="mt-4 pt-2 d-flex align-items-center gap-4 text-secondary small">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2-circle text-success"></i> 100% In-Browser Engine
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2-circle text-success"></i> SQLite & Local JSON
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2-circle text-success"></i> No Setup Required
                </div>
              </div>
            </div>

            {/* Interactive Visual Graphic */}
            <div className="col-lg-5">
              <div className="card bg-black bg-opacity-60 border-secondary border-opacity-50 p-4 shadow-lg rounded-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger rounded-circle p-1" style={{ width: '10px', height: '10px' }}></span>
                    <span className="badge bg-warning rounded-circle p-1" style={{ width: '10px', height: '10px' }}></span>
                    <span className="badge bg-success rounded-circle p-1" style={{ width: '10px', height: '10px' }}></span>
                    <span className="small text-secondary font-monospace ms-2">HalfAdder.circuit</span>
                  </div>
                  <span className="badge bg-success bg-opacity-25 text-success">Simulating 100Hz</span>
                </div>

                <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25">
                  <svg viewBox="0 0 360 200" className="w-100">
                    {/* Wires */}
                    <path d="M 60 60 C 110 60, 110 50, 160 50" fill="none" stroke="#00f59b" strokeWidth="2.5" />
                    <path d="M 60 140 C 110 140, 110 70, 160 70" fill="none" stroke="#475569" strokeWidth="2" />
                    <path d="M 60 60 C 110 60, 110 130, 160 130" fill="none" stroke="#00f59b" strokeWidth="2.5" />
                    <path d="M 60 140 C 110 140, 110 150, 160 150" fill="none" stroke="#475569" strokeWidth="2" />
                    <path d="M 230 60 L 300 60" fill="none" stroke="#00f59b" strokeWidth="2.5" />
                    <path d="M 230 140 L 300 140" fill="none" stroke="#475569" strokeWidth="2" />

                    {/* Input Switches */}
                    <rect x="20" y="45" width="40" height="30" rx="6" fill="#059669" />
                    <circle cx="50" cy="60" r="10" fill="#ffffff" />
                    <text x="32" y="64" fill="#ffffff" fontSize="10" fontWeight="bold">1</text>

                    <rect x="20" y="125" width="40" height="30" rx="6" fill="#334155" />
                    <circle cx="30" cy="140" r="10" fill="#ffffff" />
                    <text x="48" y="144" fill="#ffffff" fontSize="10" fontWeight="bold">0</text>

                    {/* XOR Gate */}
                    <path d="M 160 45 Q 175 60 160 75 Q 195 73 220 60 Q 195 47 160 45 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="185" y="64" fill="#e2e8f0" fontSize="10" fontWeight="bold">XOR</text>

                    {/* AND Gate */}
                    <path d="M 160 125 L 185 125 A 15 15 0 0 1 215 140 A 15 15 0 0 1 185 155 L 160 155 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="180" y="144" fill="#e2e8f0" fontSize="10" fontWeight="bold">AND</text>

                    {/* Outputs */}
                    <circle cx="315" cy="60" r="14" fill="#10b981" filter="drop-shadow(0 0 8px #10b981)" />
                    <text x="315" y="64" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">S=1</text>

                    <circle cx="315" cy="140" r="14" fill="#1e293b" stroke="#475569" />
                    <text x="315" y="144" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">C=0</text>
                  </svg>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 small text-secondary">
                  <span>Logic Equation: <strong className="text-info">Sum = A ⊕ B</strong></span>
                  <Link to="/simulator?load=adders-arithmetic" className="text-info text-decoration-none">
                    Test Interactive <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-5 bg-black bg-opacity-40">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white tracking-tight">Engineered for Academic Rigor & Intuitive Design</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '640px' }}>
              Everything computer science and electrical engineering students need to master foundational combinational and sequential circuit design.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4 hover-shadow transition-all">
                <div className="rounded-3 p-3 bg-primary bg-opacity-10 text-primary d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <i className="bi bi-diagram-3 fs-3"></i>
                </div>
                <h5 className="fw-bold text-white mb-2">SVG Visual Editor</h5>
                <p className="text-secondary small mb-0">
                  Full drag-and-drop workspace with snapping grid, smart pin snapping, rubber-band wire routing, zoom & pan, multi-color signal rendering, and full undo/redo.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4 hover-shadow transition-all">
                <div className="rounded-3 p-3 bg-success bg-opacity-10 text-success d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <i className="bi bi-table fs-3"></i>
                </div>
                <h5 className="fw-bold text-white mb-2">Automated Truth Tables</h5>
                <p className="text-secondary small mb-0">
                  Instantly compute and verify all $2^N$ input combinations for combinational circuits. Inspect results row-by-row and export formatted tables directly to CSV.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4 hover-shadow transition-all">
                <div className="rounded-3 p-3 bg-info bg-opacity-10 text-info d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <i className="bi bi-activity fs-3"></i>
                </div>
                <h5 className="fw-bold text-white mb-2">Timing Diagrams & Waveforms</h5>
                <p className="text-secondary small mb-0">
                  Inspect multi-channel square waveforms for clocks, inputs, flip-flops, and counters with real recorded signal histories, configurable clock speeds, and step-edge triggers.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4 hover-shadow transition-all">
                <div className="rounded-3 p-3 bg-warning bg-opacity-10 text-warning d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <i className="bi bi-cpu fs-3"></i>
                </div>
                <h5 className="fw-bold text-white mb-2">Extensive IC Component Suite</h5>
                <p className="text-secondary small mb-0">
                  Includes 22+ components: basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR), multiplexers, adders, decoders, D/SR/JK/T flip-flops, registers, and 4-bit counters.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4 hover-shadow transition-all">
                <div className="rounded-3 p-3 bg-danger bg-opacity-10 text-danger d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <i className="bi bi-database fs-3"></i>
                </div>
                <h5 className="fw-bold text-white mb-2">PHP 8+ & SQLite Persistence</h5>
                <p className="text-secondary small mb-0">
                  Zero-config local database storage with automatic SQLite file initialization, paired with robust browser offline persistence and portable JSON file export/import.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 rounded-4 hover-shadow transition-all">
                <div className="rounded-3 p-3 bg-primary bg-opacity-10 text-primary d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <i className="bi bi-journal-check fs-3"></i>
                </div>
                <h5 className="fw-bold text-white mb-2">Interactive Course Curriculum</h5>
                <p className="text-secondary small mb-0">
                  Step-by-step modular lessons covering Boolean algebra, universal gates, binary adders, routing logic, edge-triggered memory, and timing analysis with 1-click loadable circuits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starter Templates Showcase */}
      <section className="py-5">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold text-white tracking-tight mb-1">Starter Circuits</h3>
              <p className="text-secondary small mb-0">Load pre-built verified circuits directly into the editor.</p>
            </div>
            <Link to="/circuits" className="btn btn-sm btn-outline-secondary">
              View All Circuits <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {LESSONS.slice(1, 5).map(l => (
              <div key={l.id} className="col-md-3">
                <div className="card h-100 bg-dark border-secondary border-opacity-25 rounded-4 p-3 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-secondary bg-opacity-25 text-info mb-2">{l.category}</span>
                    <h6 className="fw-bold text-white mb-2">{l.title.split('. ')[1]}</h6>
                    <p className="text-secondary small mb-3">{l.summary}</p>
                  </div>
                  <Link
                    to={`/simulator?load=${l.id}`}
                    className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="bi bi-play-fill"></i> Load in Simulator
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-4 bg-black border-top border-secondary border-opacity-25 text-secondary small">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-white">LogicLab</span>
            <span>— Interactive Digital Logic Circuit Simulator</span>
          </div>
          <div>
            Built with React, Vite, Bootstrap 5, SVG, and PHP 8 + SQLite.
          </div>
        </div>
      </footer>
    </div>
  );
}
