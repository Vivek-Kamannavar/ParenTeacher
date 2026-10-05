import React, { useState } from 'react';

export default function MarksEntry({ admissions }) {
  const [studentId, setStudentId] = useState('');
  const [examType, setExamType] = useState('IA-1');
  const [semester, setSemester] = useState('Sem 1');
  const [subject, setSubject] = useState('C Programming & Data Structures');
  const [marksObtained, setMarksObtained] = useState('24');
  const [maxMarks, setMaxMarks] = useState('30');
  const [remarks, setRemarks] = useState('Good performance');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const approvedStudents = admissions.filter(a => a.status === 'Approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !subject || !marksObtained || !maxMarks) {
      setMessage({ type: 'error', text: 'Please fill in student, subject, and valid marks.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/records/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          examType,
          semester,
          subject,
          marksObtained,
          maxMarks,
          remarks
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit student marks');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: `Marks statement for ${data.studentName} (${data.examType} - ${data.subject}: ${data.marksObtained}/${data.maxMarks}) recorded successfully!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const calculatedPercentage = (parseFloat(marksObtained) && parseFloat(maxMarks)) 
    ? Math.round((parseFloat(marksObtained) / parseFloat(maxMarks)) * 100) 
    : 0;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
          📊 Student Marks Entry (IA & Sem End Exams)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Enter subject marks for <strong>IA-1</strong>, <strong>IA-2</strong>, <strong>IA-3</strong>, and <strong>Sem End Exams</strong>. System auto-calculates percentage and status, and displays the statement directly on the Parents Portal.
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
                {s.studentName} {s.uucmsNo ? `[UUCMS: ${s.uucmsNo}]` : ''} {s.rollNo ? `[Roll: ${s.rollNo}]` : ''} - Course: BCA (Prev: {s.previousStream})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Exam Type *</label>
            <select
              value={examType}
              onChange={(e) => {
                const val = e.target.value;
                setExamType(val);
                if (val === 'IA-1' || val === 'IA-2' || val === 'IA-3') setMaxMarks('30');
                else setMaxMarks('70');
              }}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            >
              <option value="IA-1">📝 Internal Assessment 1 (IA-1)</option>
              <option value="IA-2">📝 Internal Assessment 2 (IA-2)</option>
              <option value="IA-3">📝 Internal Assessment 3 (IA-3)</option>
              <option value="Sem End Exam">🎓 Sem End Exam (Semester Exam)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Semester *</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            >
              <option value="Sem 1">Semester 1</option>
              <option value="Sem 2">Semester 2</option>
              <option value="Sem 3">Semester 3</option>
              <option value="Sem 4">Semester 4</option>
              <option value="Sem 5">Semester 5</option>
              <option value="Sem 6">Semester 6</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Subject Name *</label>
          <input
            type="text"
            placeholder="e.g. Database Management Systems, Python Programming"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Marks Obtained *</label>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 24"
              value={marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Maximum Marks *</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Percentage & Result</label>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.65rem',
              color: calculatedPercentage >= 40 ? 'var(--success)' : 'var(--danger)',
              fontWeight: '700',
              textAlign: 'center',
              fontSize: '1rem'
            }}>
              {calculatedPercentage}% ({calculatedPercentage >= 40 ? 'PASS' : 'FAIL'})
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Faculty Remarks / Comments</label>
          <input
            type="text"
            placeholder="e.g. Excellent grasp of concepts, Needs practice in algorithms"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', padding: '0.8rem', fontWeight: '700', fontSize: '0.95rem' }}
        >
          {submitting ? 'Saving Marks Statement...' : '📊 Save Marks Statement'}
        </button>
      </form>
    </div>
  );
}
