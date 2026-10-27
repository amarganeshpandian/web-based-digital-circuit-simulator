import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SimulatorPage } from './pages/SimulatorPage';
import { LearnPage } from './pages/LearnPage';
import { CircuitsPage } from './pages/CircuitsPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container d-flex flex-column vh-100 bg-dark text-light overflow-hidden">
        <Navbar />
        <div className="flex-grow-1 overflow-auto position-relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/circuits" element={<CircuitsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
