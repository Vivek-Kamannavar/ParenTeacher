import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  // States for Rejection Prompts
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionInput, setRejectionInput] = useState('');

  // Simulator Logs States
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'logs'
  const [smsLogs, setSmsLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admissions');
      if (!res.ok) {
        throw new Error('Failed to fetch admissions');
      }
      const data = await res.json();
      setAdmissions(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error connecting to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const [smsRes, emailRes] = await Promise.all([
        fetch('/api/admissions/sms-logs'),
        fetch('/api/admissions/email-logs')
      ]);
      if (smsRes.ok) {
        const smsData = await smsRes.json();
        setSmsLogs(smsData);
      }
      if (emailRes.ok) {
        const emailData = await emailRes.json();
        setEmailLogs(emailData);
      }
    } catch (err) {
      console.error('Error fetching simulator logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admissions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const updated = await res.json();
      
      // Update local state
      setAdmissions(admissions.map(adm => adm._id === id ? updated : adm));
      if (selectedAdmission && selectedAdmission._id === id) {
        setSelectedAdmission(updated);
      }
      fetchLogs();
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmRejection = (e) => {
    e.preventDefault();
    if (!rejectionInput.trim()) {
      alert('Please enter a reason for rejection.');
      return;
    }
    handleStatusUpdate(selectedAdmission._id, 'Rejected', rejectionInput);
    setShowRejectionModal(false);
    setRejectionInput('');
  };

  // Filter & Search logic for admissions
  const filteredAdmissions = admissions.filter((adm) => {
    const matchesSearch = 
      adm.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.aadhaarNumber.includes(searchTerm) ||
      adm.studentPhone.includes(searchTerm);
      
    const matchesStream = streamFilter === 'All' || adm.previousStream === streamFilter;
    
    return matchesSearch && matchesStream;
  });

  const getDocNameFriendly = (key) => {
    const names = {
      aadhaarCard: 'Aadhaar Card',
      panCard: 'PAN Card',
      incomeCaste: 'Income & Caste Certificate',
      fatherAadhaar: 'Father Aadhaar',
      motherAadhaar: 'Mother Aadhaar',
      pucMarksCard: 'PUC II Marks Card',
      sslcMarksCard: 'SSLC Marks Card',
      studentSignature: 'Student Signature'
    };
    return names[key] || key;
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="card-title" style={{ fontSize: '2rem' }}>College Admissions Registry</h2>
          <p className="card-subtitle" style={{ marginBottom: 0 }}>Review and approve submitted freshman admission requests.</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={fetchAdmissions} 
          style={{ padding: '0.6rem 1.2rem' }}
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: '8px', color: 'white', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>⚠️ {error}</span>
          <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setError(null)}>✕</span>
        </div>
      )}

      {/* Admin Tab Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
          style={{ flex: 1, justifyContent: 'center' }}
          type="button"
        >
          📂 Applications Registry
        </button>
        <button
          className={`nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('logs');
            fetchLogs();
          }}
          style={{ flex: 1, justifyContent: 'center' }}
          type="button"
        >
          💬 Notification Simulator Logs
        </button>
      </div>

      {activeTab === 'applications' ? (
        <>
          {/* Filters Bar */}
          <div className="admin-header-actions">
            <div className="admin-search-filter">
              <div className="search-input-wrapper">
                <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search by student, Aadhaar, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['All', 'Science', 'Commerce', 'Arts'].map((stream) => (
                  <button
                    key={stream}
                    className={`btn btn-secondary ${streamFilter === stream ? 'active' : ''}`}
                    onClick={() => setStreamFilter(stream)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredAdmissions.length}</strong> of <strong>{admissions.length}</strong> applications
            </div>
          </div>

          {/* Admissions Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching admission requests...</p>
            </div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No applications found</h3>
              <p>We couldn't find any student admissions matching the criteria.</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Stream</th>
                    <th>PUC II %</th>
                    <th>Aadhaar Number</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.map((adm) => (
                    <tr key={adm._id}>
                      <td style={{ fontWeight: '600', color: 'white' }}>{adm.studentName}</td>
                      <td>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          background: adm.previousStream === 'Science' ? 'rgba(99, 102, 241, 0.15)' : adm.previousStream === 'Commerce' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                          color: adm.previousStream === 'Science' ? 'var(--color-primary-hover)' : adm.previousStream === 'Commerce' ? 'var(--color-accent)' : 'var(--color-secondary)'
                        }}>
                          {adm.previousStream}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>
                        {Math.round((adm.pucMarks / 600) * 100)}% ({adm.pucMarks})
                      </td>
                      <td>{adm.aadhaarNumber}</td>
                      <td>{adm.studentPhone}</td>
                      <td>
                        <span className={`status-chip ${adm.status.toLowerCase()}`}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span>
                          {adm.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setSelectedAdmission(adm)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Logs tab body markup */
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* SMS Simulation Log Column */}
            <div className="card" style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.25)', marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: '700' }}>
                📱 Cellular SMS Simulator Logs
              </h3>
              {logsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : smsLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No SMS logs found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {smsLogs.map(log => (
                    <div key={log._id} style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', animation: 'fadeIn 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-primary-hover)', fontWeight: '700' }}>To: +91 {log.recipientPhone}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(log.sentAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'white', background: 'rgba(0,0,0,0.35)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', lineHeight: '1.4' }}>
                        {log.message}
                      </p>
                      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Candidate: <strong>{log.studentName}</strong></span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '800', 
                          textTransform: 'uppercase',
                          color: log.type === 'Approval' ? 'var(--success)' : 'var(--danger)',
                          background: log.type === 'Approval' ? 'var(--success-bg)' : 'var(--danger-bg)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          border: `1px solid ${log.type === 'Approval' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                        }}>{log.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Simulation Log Column */}
            <div className="card" style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.25)', marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: '700' }}>
                ✉️ SMTP Email Simulator Logs
              </h3>
              {logsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : emailLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No Email logs found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {emailLogs.map(log => (
                    <div key={log._id} style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', animation: 'fadeIn 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-secondary)', fontWeight: '700' }}>To: {log.recipientEmail}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(log.sentAt).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        Subject: <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>{log.subject}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.35)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'pre-wrap', maxHeight: '180px', overflowY: 'auto', lineHeight: '1.4' }}>
                        {log.body}
                      </p>
                      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Candidate: <strong>{log.studentName}</strong></span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '800', 
                          textTransform: 'uppercase',
                          color: log.type === 'Approval' ? 'var(--success)' : 'var(--danger)',
                          background: log.type === 'Approval' ? 'var(--success-bg)' : 'var(--danger-bg)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          border: `1px solid ${log.type === 'Approval' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                        }}>{log.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {selectedAdmission && (
        <div className="modal-overlay" onClick={() => setSelectedAdmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedAdmission(null)}>✕</button>
            <div className="modal-body">
              <div className="modal-header-info">
                <span className={`status-chip ${selectedAdmission.status.toLowerCase()}`} style={{ marginBottom: '0.5rem' }}>
                  {selectedAdmission.status}
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white' }}>{selectedAdmission.studentName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Application ID: {selectedAdmission._id}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1.5rem' }}>
                {/* Details Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem', color: 'var(--color-primary-hover)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Personal Details</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem', fontSize: '0.85rem' }}>
                      <p><strong style={{ color: 'white' }}>Father Name:</strong> {selectedAdmission.fatherName}</p>
                      <p><strong style={{ color: 'white' }}>Mother Name:</strong> {selectedAdmission.motherName}</p>
                      <p><strong style={{ color: 'white' }}>Date of Birth:</strong> {new Date(selectedAdmission.dob).toLocaleDateString('en-IN')}</p>
                      <p><strong style={{ color: 'white' }}>Aadhaar Card:</strong> {selectedAdmission.aadhaarNumber}</p>
                      <p><strong style={{ color: 'white' }}>Student Phone:</strong> {selectedAdmission.studentPhone}</p>
                      <p><strong style={{ color: 'white' }}>Parent Phone:</strong> {selectedAdmission.parentPhone}</p>
                      <p><strong style={{ color: 'white' }}>Address:</strong> {selectedAdmission.permanentAddress}</p>
                      
                      {/* Render Rejection Reason if Declined */}
                      {selectedAdmission.status === 'Rejected' && (
                        <p style={{ background: 'var(--danger-bg)', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)', marginTop: '0.5rem' }}>
                          <strong style={{ color: 'var(--danger)' }}>Rejection Reason:</strong><br />
                          <span style={{ fontStyle: 'italic', color: '#fca5a5' }}>"{selectedAdmission.rejectionReason}"</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem', color: 'var(--color-primary-hover)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Academic Score</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem', fontSize: '0.85rem' }}>
                      <p><strong style={{ color: 'white' }}>Previous Stream:</strong> {selectedAdmission.previousStream}</p>
                      <p><strong style={{ color: 'white' }}>Previous College:</strong> {selectedAdmission.previousCollege}</p>
                      <p><strong style={{ color: 'white' }}>PUC II Marks:</strong> {selectedAdmission.pucMarks} / 600 ({Math.round((selectedAdmission.pucMarks/600)*100)}%)</p>
                      <p><strong style={{ color: 'white' }}>SSLC Marks:</strong> {selectedAdmission.sslcMarks} / 625 ({Math.round((selectedAdmission.sslcMarks/625)*100)}%)</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents List */}
                <div>
                  <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem', color: 'var(--color-primary-hover)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Uploaded Documents</h4>
                  <div className="admin-docs-list">
                    {Object.keys(selectedAdmission.documents).map((docKey) => {
                      const file = selectedAdmission.documents[docKey];
                      if (!file) return null;
                      
                      const downloadUrl = `/uploads/${file}`;
                      const isSignature = docKey === 'studentSignature';

                      return (
                        <div key={docKey} className="admin-doc-card">
                          <div style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>
                            {isSignature ? '✍️' : '📄'}
                          </div>
                          <span className="admin-doc-name">{getDocNameFriendly(docKey)}</span>
                          
                          {isSignature ? (
                            <img 
                              src={downloadUrl} 
                              alt="Signature" 
                              style={{ width: '80px', height: '35px', objectFit: 'contain', margin: '0.3rem 0', filter: 'invert(1) brightness(2)', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }} 
                            />
                          ) : null}

                          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="admin-doc-link">
                            View File ↗
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Status Update */}
              <div className="modal-actions-bar">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedAdmission(null)}
                  disabled={updatingId !== null}
                >
                  Close
                </button>
                
                {selectedAdmission.status !== 'Rejected' && (
                  <button
                    className="btn btn-secondary"
                    style={{ background: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'white' }}
                    onClick={() => {
                      setRejectionInput('');
                      setShowRejectionModal(true);
                    }}
                    disabled={updatingId !== null}
                  >
                    Reject Admission
                  </button>
                )}

                {selectedAdmission.status !== 'Approved' && (
                  <button
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, var(--success), #059669)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }}
                    onClick={() => handleStatusUpdate(selectedAdmission._id, 'Approved')}
                    disabled={updatingId !== null}
                  >
                    {updatingId === selectedAdmission._id ? 'Updating...' : 'Approve Admission'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Prompt Dialog Modal */}
      {showRejectionModal && (
        <div className="modal-overlay" style={{ zIndex: 110 }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Provide Rejection Reason</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Please write a short note explaining why this admission is declined. This reason will be displayed in the candidate status portal.
              </p>
              
              <form onSubmit={handleConfirmRejection}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <textarea
                    rows={4}
                    value={rejectionInput}
                    onChange={(e) => setRejectionInput(e.target.value)}
                    placeholder="E.g., Marks card is blurred, Aadhaar number is invalid, etc."
                    style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', padding: '0.75rem', width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowRejectionModal(false);
                      setRejectionInput('');
                    }}
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ background: 'var(--danger)', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Animation spinner style */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
