import React, { useState, useEffect } from 'react';

export default function AttendanceEntry({ admissions }) {
  const [selectedSubject, setSelectedSubject] = useState('Computer Organization & Architecture');
  const [customSubject, setCustomSubject] = useState('');
  const [globalTotalClasses, setGlobalTotalClasses] = useState(40);
  const [studentsState, setStudentsState] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Filter approved students & sort strictly in order of Roll Number
  const approvedStudents = admissions
    .filter(a => a.status === 'Approved')
    .sort((a, b) => {
      if (a.rollNo && b.rollNo) {
        return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true, sensitivity: 'base' });
      }
      if (a.rollNo && !b.rollNo) return -1;
      if (!a.rollNo && b.rollNo) return 1;
      return a.studentName.localeCompare(b.studentName);
    });

  const activeSubject = selectedSubject === 'Other' ? (customSubject.trim() || 'Custom Subject') : selectedSubject;

  // Fetch subject attendance records on subject change or load
  const loadSubjectAttendance = async () => {
    if (!activeSubject) return;
    try {
      const res = await fetch(`/api/records/attendance/subject/${encodeURIComponent(activeSubject)}`);
      let existingRecords = [];
      if (res.ok) {
        existingRecords = await res.json();
      }

      // Merge with approved students list
      const initialList = approvedStudents.map(stud => {
        const found = existingRecords.find(r => r.studentId === stud._id || r.studentId === stud._id.toString());
        const total = found ? found.totalClasses : globalTotalClasses;
        const present = found ? found.classesPresent : Math.min(36, total);
        return {
          studentId: stud._id,
          studentName: stud.studentName,
          rollNo: stud.rollNo || 'N/A',
          uucmsNo: stud.uucmsNo || 'N/A',
          stream: stud.previousStream,
          totalClasses: total,
          classesPresent: present
        };
      });

      setStudentsState(initialList);
    } catch (err) {
      console.error('Error loading subject attendance:', err);
    }
  };

  useEffect(() => {
    loadSubjectAttendance();
  }, [selectedSubject, customSubject, admissions]);

  // Update total classes globally for all students
  const handleApplyGlobalTotal = () => {
    setStudentsState(prev => prev.map(s => ({
      ...s,
      totalClasses: Math.max(0, parseInt(globalTotalClasses, 10) || 0)
    })));
    setMessage({ type: 'success', text: `Set Total Classes Conducted to ${globalTotalClasses} for all students in ${activeSubject}.` });
  };

  // Quick action: Mark All Present (+1 Total, +1 Present)
  const handleMarkAllPresentToday = () => {
    setStudentsState(prev => prev.map(s => ({
      ...s,
      totalClasses: s.totalClasses + 1,
      classesPresent: s.classesPresent + 1
    })));
    setMessage({ type: 'success', text: `Marked ALL students PRESENT (+1 Class) for ${activeSubject}.` });
  };

  // Handle student present change
  const handlePresentChange = (studentId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setStudentsState(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return { ...s, classesPresent: Math.min(num, s.totalClasses) };
      }
      return s;
    }));
  };

  // Handle student total classes change
  const handleTotalClassesChange = (studentId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setStudentsState(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return { ...s, totalClasses: num };
      }
      return s;
    }));
  };

  // Quick individual mark present (+1 Total, +1 Present)
  const handleIndividualPresent = (studentId) => {
    setStudentsState(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return { ...s, totalClasses: s.totalClasses + 1, classesPresent: s.classesPresent + 1 };
      }
      return s;
    }));
  };

  // Quick individual mark absent (+1 Total, +0 Present)
  const handleIndividualAbsent = (studentId) => {
    setStudentsState(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return { ...s, totalClasses: s.totalClasses + 1 };
      }
      return s;
    }));
  };

  // Save all attendance to backend
  const handleSaveAll = async () => {
    if (!activeSubject) {
      setMessage({ type: 'error', text: 'Please select a valid subject.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        subject: activeSubject,
        totalClasses: globalTotalClasses,
        records: studentsState.map(s => ({
          studentId: s.studentId,
          classesPresent: s.classesPresent
        }))
      };

      const res = await fetch('/api/records/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save subject attendance register');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: `✅ Attendance for "${activeSubject}" saved successfully! Calculated percentages are now live on Parents Portal.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Subject Header & Global Controls Card */}
      <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))', backdropFilter: 'blur(10px)' }}>
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.8rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.4rem 0.7rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>📚</span>
            <h3 style={{ fontSize: '1.75rem', color: 'white', fontWeight: '800', margin: 0 }}>
              Subject Attendance Register
            </h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Select your subject and enter attendance. Percentages are <strong>automatically calculated</strong> based on Total Classes Conducted and Classes Present. Updated in real-time on Parents Portal.
          </p>
        </div>

        {message && (
          <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            color: message.type === 'success' ? '#6ee7b7' : '#fca5a5'
          }}>
            {message.type === 'success' ? '✅ ' : '⚠️ '}{message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Subject Choice */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Select Teaching Subject *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-control animated-hover-select"
            >
              <option value="Computer Organization & Architecture">💻 Computer Organization & Architecture</option>
              <option value="Data Structures using C">📊 Data Structures using C</option>
              <option value="Java & Web Technologies">🌐 Java & Web Technologies</option>
              <option value="Database Management Systems">🗄️ Database Management Systems</option>
              <option value="Software Engineering">⚙️ Software Engineering</option>
              <option value="Operating Systems">🖥️ Operating Systems</option>
              <option value="Python Programming">🐍 Python Programming</option>
              <option value="Computer Networks">🔌 Computer Networks</option>
              <option value="Other">➕ Custom Subject Name...</option>
            </select>
          </div>

          {selectedSubject === 'Other' && (
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                Enter Custom Subject Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Cloud Computing / AI & ML"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="form-control animated-hover-input"
              />
            </div>
          )}

          {/* Global Total Classes Input */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Total Classes Conducted So Far *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                min="1"
                value={globalTotalClasses}
                onChange={(e) => setGlobalTotalClasses(e.target.value)}
                className="form-control animated-hover-input"
                style={{ width: '110px' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleApplyGlobalTotal}
                style={{ padding: '0.7rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                Apply to All
              </button>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleMarkAllPresentToday}
              className="btn btn-secondary"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: '700' }}
            >
              ✅ Mark All Present (+1 Class)
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={submitting}
            className="btn btn-primary animated-submit-btn"
            style={{ padding: '0.85rem 1.75rem', fontWeight: '800', fontSize: '0.95rem' }}
          >
            {submitting ? 'Saving Register...' : `💾 Save Attendance Register (${studentsState.length} Students)`}
          </button>
        </div>
      </div>

      {/* Class Attendance Register Table */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Student Register for <span style={{ color: 'var(--color-primary-hover)' }}>"{activeSubject}"</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Students sorted strictly by Roll Number. Attendance % is auto-calculated.
            </p>
          </div>

          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-hover)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
            Total Conducted: {globalTotalClasses} Classes
          </span>
        </div>

        {studentsState.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '2rem 0', textAlign: 'center' }}>No approved students registered yet.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>UUCMS No</th>
                  <th>Student Name</th>
                  <th>Classes Present</th>
                  <th>Total Classes</th>
                  <th>Attendance % (Auto)</th>
                  <th>Today's Action</th>
                </tr>
              </thead>
              <tbody>
                {studentsState.map((s) => {
                  const total = s.totalClasses || 1;
                  const pct = Math.round((s.classesPresent / total) * 100);
                  const isEligible = pct >= 75;

                  return (
                    <tr key={s.studentId}>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          background: s.rollNo !== 'N/A' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: s.rollNo !== 'N/A' ? 'var(--color-accent)' : 'var(--text-muted)',
                          border: `1px solid ${s.rollNo !== 'N/A' ? 'rgba(236, 72, 153, 0.3)' : 'var(--border-color)'}`
                        }}>
                          {s.rollNo}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: '700', color: s.uucmsNo !== 'N/A' ? 'var(--color-primary-hover)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {s.uucmsNo}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', color: 'white' }}>{s.studentName}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stream: {s.stream}</span>
                      </td>

                      {/* Classes Present counter */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handlePresentChange(s.studentId, s.classesPresent - 1)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={s.totalClasses}
                            value={s.classesPresent}
                            onChange={(e) => handlePresentChange(s.studentId, e.target.value)}
                            style={{
                              width: '60px',
                              textAlign: 'center',
                              background: 'rgba(15, 23, 42, 0.9)',
                              color: 'white',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              padding: '0.35rem',
                              fontWeight: '700'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handlePresentChange(s.studentId, s.classesPresent + 1)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Total Classes */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={s.totalClasses}
                          onChange={(e) => handleTotalClassesChange(s.studentId, e.target.value)}
                          style={{
                            width: '65px',
                            textAlign: 'center',
                            background: 'rgba(15, 23, 42, 0.9)',
                            color: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '0.35rem',
                            fontWeight: '600'
                          }}
                        />
                      </td>

                      {/* Auto Calculated Percentage */}
                      <td>
                        <span style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '20px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          background: isEligible ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                          color: isEligible ? '#6ee7b7' : '#fca5a5',
                          border: `1px solid ${isEligible ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                        }}>
                          {pct}% {isEligible ? '✅ Eligible' : '⚠️ Shortage'}
                        </span>
                      </td>

                      {/* Today's Action */}
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleIndividualPresent(s.studentId)}
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#6ee7b7',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            + Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIndividualAbsent(s.studentId)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#fca5a5',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            + Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        .animated-hover-select {
          width: 100%;
          background: rgba(15, 23, 42, 0.7);
          color: white;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.85rem 1.2rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animated-hover-select:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
        }

        .animated-hover-input {
          background: rgba(15, 23, 42, 0.7);
          color: white;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.85rem 1.2rem;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animated-hover-input:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
        }

        .animated-submit-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }

        .animated-submit-btn:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.45);
          background: linear-gradient(135deg, #059669, #047857);
        }
      `}</style>
    </div>
  );
}
