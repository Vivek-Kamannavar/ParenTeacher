import React, { useState } from 'react';

export default function NoticeEntry({ admissions }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [targetStream, setTargetStream] = useState('All');
  const [targetStudentId, setTargetStudentId] = useState('');
  const [eventDate, setEventDate] = useState('2026-09-25 10:00 AM');
  const [venue, setVenue] = useState("KLE's BCA Main Auditorium / CS Lab");
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const approvedStudents = admissions.filter(a => a.status === 'Approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !eventDate || !venue) {
      setMessage({ type: 'error', text: 'Please fill out all notice fields.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/records/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          targetStream,
          targetStudentId: targetStudentId || null,
          eventDate,
          venue,
          description
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to publish event notice');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: `Event Notice "${data.title}" published successfully! Registered parents can now view it in their portal.` });
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
          📢 Event & Competition Notice Publishing
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Publish notices regarding competitions like <strong>Hackathons</strong>, <strong>E-Sports / Gaming</strong>, <strong>Sports Tournaments</strong>, and <strong>Cultural Events</strong>. Notices will immediately display in the Parents Portal.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Event Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            >
              <option value="Hackathon">💻 Hackathon / Coding Sprint</option>
              <option value="Gaming">🎮 Gaming & E-Sports Championship</option>
              <option value="Sports">🏆 Sports & Athletics Meet</option>
              <option value="Cultural">🎭 Cultural Fest & Music</option>
              <option value="Academic">📚 Academic Seminar / Quiz</option>
              <option value="General">📢 General Announcement</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Target Stream</label>
            <select
              value={targetStream}
              onChange={(e) => setTargetStream(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            >
              <option value="All">All Streams (Science, Commerce, Arts)</option>
              <option value="Science">Science Stream Only</option>
              <option value="Commerce">Commerce Stream Only</option>
              <option value="Arts">Arts Stream Only</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Event / Competition Title *</label>
          <input
            type="text"
            placeholder="e.g. Annual CodeFest Hackathon 2026 / LAN Gaming Tournament"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Date & Time *</label>
            <input
              type="text"
              placeholder="e.g. Sept 25th 2026, 10:00 AM"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Venue / Location *</label>
            <input
              type="text"
              placeholder="e.g. College Campus Grounds / Computer Lab 2"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Target Specific Student (Optional)</label>
          <select
            className="form-control"
            value={targetStudentId}
            onChange={(e) => setTargetStudentId(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
          >
            <option value="">-- All Students (Broadcast Notice) --</option>
            {approvedStudents.map(s => (
              <option key={s._id} value={s._id}>
                {s.studentName} ({s.previousStream})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '700', color: 'white' }}>Event Rules & Detailed Description *</label>
          <textarea
            rows={4}
            placeholder="Write prize money, registration instructions, rules, and event details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          {submitting ? 'Publishing Notice...' : '📢 Publish Event Notice'}
        </button>
      </form>
    </div>
  );
}
