import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '../data/lessons';

export function LearnPage() {
  const [selectedLessonId, setSelectedLessonId] = useState(LESSONS[0].id);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('logiclab_completed_lessons') || '[]');
    } catch {
      return [];
    }
  });

  const activeLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

  const toggleComplete = (id) => {
    setCompletedLessons(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('logiclab_completed_lessons', JSON.stringify(next));
      return next;
    });
  };

  const progressPercent = Math.round((completedLessons.length / LESSONS.length) * 100);

  return (
    <div className="learn-page bg-dark text-light min-vh-100 d-flex flex-column">
      {/* Top Header */}
      <div className="bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25 py-4 px-4">
        <div className="container-fluid">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="d-inline-flex align-items-center gap-2 text-info small fw-bold text-uppercase mb-1">
                <i className="bi bi-mortarboard-fill"></i> Computer Engineering Curriculum
              </div>
              <h2 className="fw-bold text-white mb-0">Digital Logic Learning Center</h2>
            </div>

            {/* Progress Card */}
            <div className="d-flex align-items-center gap-3 bg-dark border border-secondary border-opacity-25 rounded-3 py-2 px-3">
              <div>
                <div className="small text-secondary">Course Progress</div>
                <div className="fw-bold text-white">{completedLessons.length} / {LESSONS.length} Lessons</div>
              </div>
              <div className="progress" style={{ width: '100px', height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="badge bg-success bg-opacity-25 text-success">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="container-fluid flex-grow-1 py-4 px-4">
        <div className="row g-4 h-100">
          {/* Left Column: Lesson Directory */}
          <div className="col-lg-4 col-xl-3">
            <div className="card bg-black bg-opacity-40 border-secondary border-opacity-25 rounded-4 p-3 sticky-top" style={{ top: '80px' }}>
              <div className="text-secondary small fw-bold text-uppercase mb-3 px-2">
                Curriculum Modules
              </div>

              <div className="d-flex flex-column gap-1">
                {LESSONS.map((lesson) => {
                  const isActive = lesson.id === selectedLessonId;
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      className={`btn text-start p-2 rounded-3 d-flex align-items-start justify-content-between transition-all ${isActive ? 'btn-primary' : 'btn-outline-dark text-light border-0 hover-bg-secondary'}`}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <div className="d-flex align-items-start gap-2 overflow-hidden">
                        <i className={`bi bi-${isDone ? 'check-circle-fill text-success' : 'circle text-secondary'} mt-1`}></i>
                        <div className="text-truncate">
                          <div className="fw-semibold text-truncate small">
                            {lesson.title}
                          </div>
                          <div className={`text-xs ${isActive ? 'text-white-50' : 'text-secondary'}`} style={{ fontSize: '11px' }}>
                            {lesson.category}
                          </div>
                        </div>
                      </div>

                      {isActive && <i className="bi bi-chevron-right small ms-1 mt-1"></i>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Lesson Workspace */}
          <div className="col-lg-8 col-xl-9">
            <div className="card bg-black bg-opacity-40 border-secondary border-opacity-25 rounded-4 p-4 mb-4">
              {/* Lesson Title & Action Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                <div>
                  <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 mb-2">
                    {activeLesson.category}
                  </span>
                  <h3 className="fw-bold text-white mb-2">{activeLesson.title}</h3>
                  <p className="text-secondary mb-0">{activeLesson.summary}</p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className={`btn btn-sm ${completedLessons.includes(activeLesson.id) ? 'btn-success' : 'btn-outline-secondary'} d-flex align-items-center gap-1`}
                    onClick={() => toggleComplete(activeLesson.id)}
                  >
                    <i className={`bi bi-${completedLessons.includes(activeLesson.id) ? 'check-lg' : 'check2'}`}></i>
                    {completedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark as Done'}
                  </button>

                  <Link
                    to={`/simulator?load=${activeLesson.id}`}
                    className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      border: 'none'
                    }}
                  >
                    <i className="bi bi-play-circle-fill"></i>
                    Open in Simulator
                  </Link>
                </div>
              </div>

              {/* Lesson Theory Content */}
              <div className="lesson-body text-light mb-4">
                <div
                  className="lesson-markdown small text-secondary"
                  style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}
                >
                  {activeLesson.content}
                </div>
              </div>

              {/* Truth or State Table */}
              {activeLesson.truthTable && (
                <div className="mb-4">
                  <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-table text-info"></i>
                    Truth & State Table
                  </h5>
                  <div className="table-responsive border border-secondary border-opacity-25 rounded-3">
                    <table className="table table-dark table-striped mb-0 text-center font-monospace small">
                      <thead className="table-secondary text-dark">
                        <tr>
                          {activeLesson.truthTable.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeLesson.truthTable.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>
                                {typeof cell === 'number' ? (
                                  <span className={`badge ${cell === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                    {cell}
                                  </span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Practical Exercise Box */}
              <div className="card bg-dark border-info border-opacity-25 p-3 rounded-3 mb-4">
                <div className="d-flex align-items-center gap-2 text-info fw-bold mb-2">
                  <i className="bi bi-lightbulb-fill"></i>
                  Guided Practical Exercise
                </div>
                <p className="text-light small mb-2">{activeLesson.exercise}</p>
                <div className="text-secondary small">
                  <strong>Expected Observation:</strong> {activeLesson.expectedBehavior}
                </div>
              </div>

              {/* Bottom Quick Launch Banner */}
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                <div className="small text-light">
                  Ready to test this circuit live? Launch the interactive laboratory with this example preloaded.
                </div>
                <Link
                  to={`/simulator?load=${activeLesson.id}`}
                  className="btn btn-sm btn-primary px-3 text-nowrap"
                >
                  Launch Lab <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
