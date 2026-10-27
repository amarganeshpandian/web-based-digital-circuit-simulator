import React, { useState } from 'react';
import { generateTruthTable, exportTruthTableToCSV } from '../circuit/truthTable';

export function TruthTableModal({ circuit, onClose }) {
  const [tableData, setTableData] = useState(() => generateTruthTable(circuit));
  const [copySuccess, setCopySuccess] = useState(false);

  const handleRefresh = () => {
    setTableData(generateTruthTable(circuit));
  };

  const handleDownloadCSV = () => {
    if (!tableData.success) return;
    const csvContent = exportTruthTableToCSV(tableData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truth_table_${(circuit.title || 'circuit').toLowerCase().replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    if (!tableData.success) return;
    const csvContent = exportTruthTableToCSV(tableData);
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-dark text-light border-secondary">
          <div className="modal-header border-secondary border-opacity-50">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-table text-primary"></i>
              Truth Table Generator
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {!tableData.success ? (
              <div className="alert alert-warning d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <div>{tableData.error}</div>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="small text-secondary">
                    Total Input Combinations: <strong className="text-light">{tableData.rows.length}</strong> ({tableData.inputs.length} Variable Inputs)
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={handleRefresh}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                      Recalculate
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                      onClick={handleCopyClipboard}
                    >
                      <i className="bi bi-clipboard"></i>
                      {copySuccess ? 'Copied!' : 'Copy Table'}
                    </button>
                    <button
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                      onClick={handleDownloadCSV}
                    >
                      <i className="bi bi-download"></i>
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="table-responsive border border-secondary border-opacity-25 rounded" style={{ maxHeight: '400px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 text-center font-monospace">
                    <thead className="table-secondary text-dark sticky-top">
                      <tr>
                        <th style={{ width: '60px' }}>#</th>
                        {tableData.inputs.map(input => (
                          <th key={input.id} className="bg-primary text-white border-start">
                            {input.label}
                          </th>
                        ))}
                        {tableData.outputs.map(output => (
                          <th key={output.id} className="bg-success text-white border-start">
                            {output.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.rows.map((row) => (
                        <tr key={row.index}>
                          <td className="text-secondary">{row.index}</td>
                          {tableData.inputs.map(input => (
                            <td key={input.id} className="border-start">
                              <span className={`badge ${row.inputs[input.id] ? 'bg-primary' : 'bg-secondary'}`}>
                                {row.inputs[input.id]}
                              </span>
                            </td>
                          ))}
                          {tableData.outputs.map(output => {
                            const val = row.outputs[output.id];
                            return (
                              <td key={output.id} className="border-start">
                                <span className={`badge ${val ? 'bg-success' : 'bg-dark border border-secondary'}`}>
                                  {val}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-secondary border-opacity-50">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
