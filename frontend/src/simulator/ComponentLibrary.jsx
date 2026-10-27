import React, { useState } from 'react';
import { COMPONENT_CATEGORIES, COMPONENT_DEFINITIONS } from '../circuit/definitions';

export function ComponentLibrary({ onAddComponent }) {
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('application/logiclab-component', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Group definitions by category
  const categories = Object.values(COMPONENT_CATEGORIES);
  const definitions = Object.values(COMPONENT_DEFINITIONS);

  const filteredDefs = definitions.filter(def => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      def.name.toLowerCase().includes(q) ||
      def.type.toLowerCase().includes(q) ||
      def.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="component-library d-flex flex-column h-100 bg-dark text-light border-end border-secondary border-opacity-25" style={{ width: '280px' }}>
      {/* Search Header */}
      <div className="p-3 border-bottom border-secondary border-opacity-25 bg-black bg-opacity-20">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold small text-uppercase letter-spacing-1 text-secondary">
            Components
          </span>
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25">
            {filteredDefs.length} Available
          </span>
        </div>

        <div className="input-group input-group-sm">
          <span className="input-group-text bg-black bg-opacity-50 border-secondary border-opacity-50 text-secondary">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control bg-black bg-opacity-50 border-secondary border-opacity-50 text-light"
            placeholder="Search gates, ICs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-outline-secondary border-secondary border-opacity-50"
              onClick={() => setSearch('')}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Component Category Tree */}
      <div className="flex-grow-1 overflow-auto p-2">
        {categories.map(cat => {
          const items = filteredDefs.filter(d => d.category === cat);
          if (items.length === 0) return null;
          const isCollapsed = collapsedCategories[cat];

          return (
            <div key={cat} className="mb-2">
              {/* Category Header */}
              <button
                className="btn btn-sm w-100 text-start text-secondary fw-semibold py-1 px-2 d-flex align-items-center justify-content-between rounded hover-bg-secondary"
                onClick={() => toggleCategory(cat)}
              >
                <span>{cat}</span>
                <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'down'} small`}></i>
              </button>

              {/* Items List */}
              {!isCollapsed && (
                <div className="mt-1 ps-1 d-flex flex-column gap-1">
                  {items.map(item => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.type)}
                      onClick={() => onAddComponent(item.type)}
                      className="component-card p-2 rounded border border-secondary border-opacity-25 bg-black bg-opacity-25 hover-border-primary cursor-grab d-flex align-items-center justify-content-between transition-all"
                      title={`${item.description} (Drag or Click to place)`}
                    >
                      <div className="d-flex align-items-center gap-2 overflow-hidden">
                        <i className={`bi ${getCategoryIcon(item.category)} text-info`}></i>
                        <div className="text-truncate">
                          <div className="small fw-semibold text-light text-truncate">
                            {item.name}
                          </div>
                          <div className="text-secondary text-xs text-truncate" style={{ fontSize: '10px' }}>
                            {item.pins.length} pins
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-secondary border-0 p-1 text-secondary hover-text-light"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddComponent(item.type);
                        }}
                        title="Add to canvas"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getCategoryIcon(cat) {
  switch (cat) {
    case COMPONENT_CATEGORIES.INPUT_OUTPUT:
      return 'bi-toggles';
    case COMPONENT_CATEGORIES.GATES:
      return 'bi-cpu';
    case COMPONENT_CATEGORIES.MUX_DEMUX:
      return 'bi-signpost-split';
    case COMPONENT_CATEGORIES.ARITHMETIC:
      return 'bi-calculator';
    case COMPONENT_CATEGORIES.ENCODER_DECODER:
      return 'bi-binary';
    case COMPONENT_CATEGORIES.SEQUENTIAL:
      return 'bi-clock-history';
    default:
      return 'bi-box';
  }
}
