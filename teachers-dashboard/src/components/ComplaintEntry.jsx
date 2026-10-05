import React, { useState } from 'react';

export default function ComplaintEntry({ admissions }) {
  const [studentId, setStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('Parent Notification & Counseling Advised');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const approvedStudents = admissions.filter(a => a.status === 'Approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !title || !description) {
      setMessage({ type: 'error', text: 'Please fill in student, complaint title, and description.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/records/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          title,
          severity,
          description,
          actionTaken
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to file complaint');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: `Disciplinary complaint for ${data.studentName} logged. Disciplinary details are now visible on the Parents Portal.` });
      setTitle('');
      setDescription('');
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
          🚨 Student Disciplinary Complaint Filing
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Report misconduct, repeated absenteeism, or disciplinary concerns. Submitting makes the record accessible directly on the registered student's Parents Portal.
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
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Complaint Subject / Title *</label>
            <input
              type="text"
              placeholder="e.g. Unexcused Bunking, Disruption in Computer Lab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Severity Level *</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            >
              <option value="Low">🟡 Low - Minor Warning</option>
              <option value="Medium">🟠 Medium - Serious Concern</option>
              <option value="High">🔴 High - Urgent Parent Call Requested</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Incident Description *</label>
          <textarea
            rows={4}
            placeholder="Describe the incident, date, and context clearly..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'inherit' }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Action Recommended / Taken</label>
          <input
            type="text"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            placeholder="e.g. Parent call requested, Official warning issued"
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)', padding: '0.8rem', fontWeight: '700', fontSize: '0.95rem' }}
        >
          {submitting ? 'Filing Complaint...' : '🚨 File Disciplinary Complaint'}
        </button>
      </form>
    </div>
  );
}
