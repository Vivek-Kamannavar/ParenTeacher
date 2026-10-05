import React, { useState, useEffect } from 'react';

export default function StudentInfoPortal({ user }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [subTab, setSubTab] = useState('attendance'); // 'attendance', 'marks', 'behavior', 'complaints', 'notices'

  const fetchStudentInfo = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/records/student-info/${encodeURIComponent(searchQuery.trim())}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'No student information found.');
      }
      const data = await res.json();
      setStudentData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const defaultQuery = user.parentAadhaar || user.studentAadhaar || user.parentEmail || user.email || user.parentPhone || user.phone || '';
      if (defaultQuery) {
        setQuery(defaultQuery);
        fetchStudentInfo(defaultQuery);
      }
    }
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudentInfo(query);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      {/* Portal Banner Header */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-primary-hover)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              🎓 Official Parents Portal
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white', margin: '0.5rem 0 0.25rem 0' }}>
              Student Information & Progress Hub
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              Track your ward's official UUCMS ID, Roll Number, Attendance, Academic Examination Marks, Behavior Ratings, and Competition Notices.
            </p>
          </div>

          {/* Quick Lookup Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="Search by UUCMS No, Roll No, Aadhaar, or Email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'white',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', borderRadius: '10px' }}
            >
              🔍 Search Ward
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary-hover)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching ward profile and academic progress...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>No Records Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{error}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Tip: Please ensure your ward's admission form is approved and search using their UUCMS No (e.g. U15BC24S001), Roll No (e.g. 24BCA01), or Aadhaar Number.
          </p>
        </div>
      )}

      {!loading && !error && !studentData && (
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👨‍🎓</div>
          <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Welcome to Student Info Lookup</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Enter your ward's UUCMS Number, College Roll Number, Aadhaar Number, or Parent Registered Email above to view full academic records.
          </p>
        </div>
      )}

      {!loading && studentData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Ward Credentials Card */}
          <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6))', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
                  👤
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', margin: 0 }}>
                      {studentData.student.studentName}
                    </h2>
                    <span className={`status-chip ${studentData.student.status.toLowerCase()}`}>
                      {studentData.student.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-primary-hover)', fontWeight: '600', fontSize: '0.95rem', margin: '0.2rem 0 0 0' }}>
                    Course: BCA (Bachelor of Computer Applications) | Prev Stream: {studentData.student.previousStream} | KLE's P. C. Jabin Science College
                  </p>
                </div>
              </div>

              {/* Official Credentials Pills */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.6rem 1rem', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>UUCMS Number</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                    {studentData.student.uucmsNo || 'Pending Assignment'}
                  </span>
                </div>

                <div style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '0.6rem 1rem', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>College Roll No</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                    {studentData.student.rollNo || 'Pending Assignment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Details Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Degree Program:</span>
                <strong style={{ color: '#6ee7b7', display: 'block' }}>BCA (Degree)</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Previous Stream (PUC):</span>
                <strong style={{ color: 'white', display: 'block' }}>{studentData.student.previousStream}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Father's Name:</span>
                <strong style={{ color: 'white', display: 'block' }}>{studentData.student.fatherName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Mother's Name:</span>
                <strong style={{ color: 'white', display: 'block' }}>{studentData.student.motherName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Parent Email:</span>
                <strong style={{ color: 'white', display: 'block' }}>{studentData.student.parentEmail}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Parent Phone:</span>
                <strong style={{ color: 'white', display: 'block' }}>{studentData.student.parentPhone}</strong>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            <button
              className={`nav-btn ${subTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setSubTab('attendance')}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            >
              📊 Attendance ({studentData.records.attendances.length})
            </button>
            <button
              className={`nav-btn ${subTab === 'marks' ? 'active' : ''}`}
              onClick={() => setSubTab('marks')}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            >
              📝 Academic Marks ({studentData.records.marks.length})
            </button>
            <button
              className={`nav-btn ${subTab === 'behavior' ? 'active' : ''}`}
              onClick={() => setSubTab('behavior')}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            >
              ⭐ Behavior ({studentData.records.behaviors.length})
            </button>
            <button
              className={`nav-btn ${subTab === 'complaints' ? 'active' : ''}`}
              onClick={() => setSubTab('complaints')}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            >
              🚨 Complaints ({studentData.records.complaints.length})
            </button>
            <button
              className={`nav-btn ${subTab === 'notices' ? 'active' : ''}`}
              onClick={() => setSubTab('notices')}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            >
              📢 Event Notices ({studentData.records.notices.length})
            </button>
          </div>

          {/* TAB 1: ATTENDANCE */}
          {subTab === 'attendance' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: '700' }}>
                📊 Classroom Subject Attendance Tracker
              </h3>
              {studentData.records.attendances.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No subject attendance recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
                    {studentData.records.attendances.map(att => {
                      const isEligible = att.percentage >= 75;
                      return (
                        <div key={att._id} style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontWeight: '800', color: 'white', fontSize: '1rem' }}>📚 {att.subject}</span>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: '800', 
                              padding: '0.25rem 0.6rem', 
                              borderRadius: '20px',
                              background: isEligible ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                              color: isEligible ? '#6ee7b7' : '#fca5a5',
                              border: `1px solid ${isEligible ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                            }}>
                              {isEligible ? 'ELIGIBLE ✅' : 'SHORTAGE ⚠️'}
                            </span>
                          </div>

                          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Classes Attended:</span>
                              <strong style={{ color: '#6ee7b7' }}>{att.classesPresent} Present</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Total Conducted:</span>
                              <strong>{att.totalClasses} Classes</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'white' }}>
                            <span style={{ fontWeight: '600', minWidth: '95px' }}>Attendance %:</span>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(100, att.percentage)}%`, height: '100%', background: isEligible ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #ef4444, #dc2626)' }}></div>
                            </div>
                            <span style={{ fontWeight: '800', fontSize: '1rem', color: isEligible ? '#6ee7b7' : '#fca5a5' }}>{att.percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MARKS */}
          {subTab === 'marks' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: '700' }}>
                📝 Academic Examination Marks Statement
              </h3>
              {studentData.records.marks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No examination marks entered yet.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Exam Type</th>
                        <th>Semester</th>
                        <th>Subject</th>
                        <th>Marks Obtained</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Faculty Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.records.marks.map(m => (
                        <tr key={m._id}>
                          <td>
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-hover)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
                              {m.examType}
                            </span>
                          </td>
                          <td style={{ color: 'white', fontWeight: '600' }}>{m.semester}</td>
                          <td style={{ color: 'white', fontWeight: '600' }}>{m.subject}</td>
                          <td style={{ fontWeight: '700', color: 'white' }}>
                            {m.marksObtained} / {m.maxMarks}
                          </td>
                          <td style={{ fontWeight: '700', color: m.percentage >= 40 ? '#6ee7b7' : '#fca5a5' }}>
                            {m.percentage}%
                          </td>
                          <td>
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              background: m.status === 'Pass' ? 'var(--success-bg)' : 'var(--danger-bg)',
                              color: m.status === 'Pass' ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {m.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {m.remarks || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BEHAVIOR */}
          {subTab === 'behavior' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: '700' }}>
                ⭐ Classroom Behavior & Conduct Feedback
              </h3>
              {studentData.records.behaviors.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No conduct feedback logged yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {studentData.records.behaviors.map(b => (
                    <div key={b._id} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>Category: {b.category}</span>
                        <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>
                          Rating: {b.rating}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'white', background: 'rgba(0,0,0,0.25)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', margin: '0.5rem 0' }}>
                        "{b.remarks}"
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Logged on: {new Date(b.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLAINTS */}
          {subTab === 'complaints' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: '700' }}>
                🚨 Disciplinary Warnings & Complaints Log
              </h3>
              {studentData.records.complaints.length === 0 ? (
                <p style={{ color: '#6ee7b7', fontStyle: 'italic', padding: '1rem 0' }}>✅ No disciplinary complaints recorded. Ward has a clean record!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {studentData.records.complaints.map(c => (
                    <div key={c._id} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>⚠️ {c.title}</span>
                        <span style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                          Severity: {c.severity.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'white', margin: '0.5rem 0' }}>
                        {c.description}
                      </p>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', color: '#fca5a5', marginTop: '0.5rem' }}>
                        Action Taken / Recommended: <strong>{c.actionTaken}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Reported on: {new Date(c.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NOTICES */}
          {subTab === 'notices' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: '700' }}>
                📢 Competitions & Event Announcements
              </h3>
              {studentData.records.notices.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No active event notices at the moment.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {studentData.records.notices.map(n => (
                    <div key={n._id} style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--color-secondary)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                            🏆 {n.category}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(n.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', margin: '0.4rem 0 0.5rem 0' }}>
                          {n.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', whiteSpace: 'pre-wrap' }}>
                          {n.description}
                        </p>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: 'white', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>📅 <strong>Date:</strong> {n.eventDate}</div>
                        <div>📍 <strong>Venue:</strong> {n.venue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
