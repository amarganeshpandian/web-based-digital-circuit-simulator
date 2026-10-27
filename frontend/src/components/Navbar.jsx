import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary border-opacity-25 px-3 py-2 sticky-top">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="rounded d-flex align-items-center justify-content-center text-dark fw-bold"
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #00f59b 0%, #00e5ff 100%)',
              boxShadow: '0 0 12px rgba(0, 245, 155, 0.4)'
            }}
          >
            <i className="bi bi-cpu-fill text-dark fs-5"></i>
          </div>
          <span className="fw-bold tracking-tight text-white fs-5">
            Logic<span style={{ color: '#00f59b' }}>Lab</span>
          </span>
          <span className="badge bg-secondary bg-opacity-25 text-info border border-info border-opacity-25 ms-1" style={{ fontSize: '10px' }}>
            v1.0
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#logiclabNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="logiclabNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'text-white fw-bold active' : 'text-secondary'}`}
              >
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/simulator"
                className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'text-white fw-bold active' : 'text-secondary'}`}
              >
                <i className="bi bi-cpu me-1"></i> Circuit Simulator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/learn"
                className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'text-white fw-bold active' : 'text-secondary'}`}
              >
                <i className="bi bi-journal-bookmark me-1"></i> Learn Center
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/circuits"
                className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'text-white fw-bold active' : 'text-secondary'}`}
              >
                <i className="bi bi-folder2-open me-1"></i> Saved Circuits
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'text-white fw-bold active' : 'text-secondary'}`}
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/simulator"
              className="btn btn-sm btn-primary d-flex align-items-center gap-1 px-3 py-1 fw-semibold"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                border: 'none',
                boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)'
              }}
            >
              <i className="bi bi-play-circle-fill"></i>
              Launch Simulator
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
