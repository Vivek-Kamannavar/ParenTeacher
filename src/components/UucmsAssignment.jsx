import React, { useState } from 'react';

export default function UucmsAssignment({ admissions, onAssignSuccess }) {
  const [selectedId, setSelectedId] = useState('');
  const [uucmsNo, setUucmsNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Filter approved students
  const approvedStudents = admissions.filter(a => a.status === 'Approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !uucmsNo || !rollNo) {
      setMessage({ type: 'error', text: 'Please select a student and fill both UUCMS & Roll Number.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admissions/${selectedId}/uucms-roll`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uucmsNo, rollNo })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to assign UUCMS & Roll No');
      }

      const updatedStudent = await res.json();
      setMessage({ type: 'success', text: `Successfully assigned UUCMS (${uucmsNo}) & Roll No (${rollNo}) to ${updatedStudent.studentName}. Credentials updated in Parents Portal!` });
      setUucmsNo('');
      setRollNo('');
      setSelectedId('');
      if (onAssignSuccess) onAssignSuccess();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStudent = approvedStudents.find(s => s._id === selectedId);

  return (
    <div className="card uucms-assign-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow decoration */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)', pointerEvents: 'none' }}></div>

      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.4rem 0.7rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>🆔</span>
          <h3 style={{ fontSize: '1.75rem', color: 'white', fontWeight: '800', margin: 0 }}>
            Manual UUCMS & Roll Number Assignment
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
          Assign official University (UUCMS) and College Roll numbers to admitted students. Once assigned, students appear sorted by Roll Number in the class attendance sheet and profile details are updated instantly in the Parents Portal.
        </p>
      </div>

      {message && (
        <div style={{
          padding: '1rem 1.4rem',
          borderRadius: '12px',
          marginBottom: '1.75rem',
          fontSize: '0.92rem',
          fontWeight: '600',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
          color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
          animation: 'fadeIn 0.3s ease'
        }}>
          {message.type === 'success' ? '✅ ' : '⚠️ '}{message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Animated Select Box Section */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Select Admitted Student</span>
            <span style={{ color: '#ec4899' }}>*</span>
          </label>

          <div className="hover-select-wrapper">
            <select
              className="form-control animated-hover-select"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                const stud = approvedStudents.find(s => s._id === e.target.value);
                if (stud) {
                  setUucmsNo(stud.uucmsNo || '');
                  setRollNo(stud.rollNo || '');
                }
              }}
              required
            >
              <option value="">-- Choose Approved Student --</option>
              {approvedStudents.map(s => (
                <option key={s._id} value={s._id}>
                  {s.studentName} ({s.previousStream}) {s.rollNo ? `• Roll: ${s.rollNo}` : ''} {s.uucmsNo ? `• UUCMS: ${s.uucmsNo}` : '[Unassigned]'}
                </option>
              ))}
            </select>
            <div className="select-arrow-icon">▼</div>
          </div>
        </div>

        {selectedStudent && (
          <div className="student-preview-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Student Name:</span> <strong style={{ color: 'white' }}>{selectedStudent.studentName}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Degree Program:</span> <strong style={{ color: '#6ee7b7' }}>BCA (Degree)</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>PUC Stream:</span> <strong style={{ color: 'var(--color-primary-hover)' }}>{selectedStudent.previousStream}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Parent Email:</span> <strong style={{ color: 'white' }}>{selectedStudent.parentEmail || 'N/A'}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Aadhaar:</span> <strong style={{ color: 'white' }}>{selectedStudent.aadhaarNumber}</strong></div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', marginBottom: '0.6rem' }}>
              UUCMS Number *
            </label>
            <input
              type="text"
              placeholder="e.g. U15BC24S001"
              value={uucmsNo}
              onChange={(e) => setUucmsNo(e.target.value)}
              className="form-control animated-hover-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', marginBottom: '0.6rem' }}>
              College Roll Number *
            </label>
            <input
              type="text"
              placeholder="e.g. 24BCA01"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="form-control animated-hover-input"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary animated-submit-btn"
          style={{ marginTop: '0.5rem', padding: '0.95rem', fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {submitting ? 'Assigning Credentials...' : '💾 Assign Credentials'}
        </button>
      </form>

      {/* Embedded High-End Hover CSS Animation Rules */}
      <style>{`
        .hover-select-wrapper {
          position: relative;
          width: 100%;
        }

        .select-arrow-icon {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-primary-hover);
          pointer-events: none;
          font-size: 0.75rem;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .animated-hover-select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background: rgba(15, 23, 42, 0.7);
          color: white;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.9rem 2.8rem 0.9rem 1.2rem;
          font-size: 0.98rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .animated-hover-select:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25), 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .hover-select-wrapper:hover .select-arrow-icon {
          color: #a855f7;
          transform: translateY(-50%) rotate(180deg);
        }

        .animated-hover-select:focus {
          outline: none;
          background: rgba(15, 23, 42, 0.95);
          border-color: #a855f7;
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.25);
        }

        .animated-hover-select option {
          background: #0f172a;
          color: white;
          padding: 10px;
        }

        .animated-hover-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.7);
          color: white;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.9rem 1.2rem;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animated-hover-input:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
        }

        .animated-hover-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
        }

        .animated-submit-btn {
          background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }

        .animated-submit-btn:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.45);
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
        }

        .animated-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
