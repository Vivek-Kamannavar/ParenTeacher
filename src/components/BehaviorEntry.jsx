import React, { useState } from 'react';

export default function BehaviorEntry({ admissions }) {
  const [studentId, setStudentId] = useState('');
  const [rating, setRating] = useState('Excellent');
  const [category, setCategory] = useState('Classroom Conduct & Participation');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const approvedStudents = admissions.filter(a => a.status === 'Approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !remarks) {
      setMessage({ type: 'error', text: 'Please select a student and provide teacher remarks.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/records/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          rating,
          category,
          remarks
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to record behavior report');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: `Behavior report for ${data.studentName} logged! Parents can view this feedback in their portal.` });
      setRemarks('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
          🌟 Student Behavior & Conduct Assessment
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Enter behavior ratings and feedback regarding classroom conduct, teamwork, and discipline. Reports are displayed live in the Parents Portal.
        </p>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
          color: message.type === 'success' ? '#6ee7b7' : '#fca5a5'
        }}>
          {message.type === 'success' ? '✅ ' : '⚠️ '}{message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Select Student *</label>
          <select
            className="form-control"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            required
          >
            <option value="">-- Choose Student --</option>
            {approvedStudents.map(s => (
              <option key={s._id} value={s._id}>
                {s.studentName} {s.uucmsNo ? `[UUCMS: ${s.uucmsNo}]` : ''} - Stream: {s.previousStream}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Conduct Rating *</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            >
              <option value="Excellent">⭐ Excellent - Outstanding Participation</option>
              <option value="Good">👍 Good - Well Behaved</option>
              <option value="Satisfactory">👌 Satisfactory - Normal Conduct</option>
              <option value="Needs Improvement">⚠️ Needs Improvement - Inattentive</option>
              <option value="Disruptive">🚫 Disruptive - Discipline Required</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Assessment Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Lab Discipline, Team Project Behavior"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Detailed Teacher Remarks *</label>
          <textarea
            rows={4}
            placeholder="Write constructive remarks on the student's attitude, punctuality, and behavior in class..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'inherit' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', padding: '0.8rem', fontWeight: '700', fontSize: '0.95rem' }}
        >
          {submitting ? 'Saving Behavior Report...' : '⭐ Submit Behavior Report'}
        </button>
      </form>
    </div>
  );
}
