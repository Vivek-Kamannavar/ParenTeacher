import React, { useState, useEffect } from 'react';

const StatusPortal = ({ user }) => {
  const [aadhaarInput, setAadhaarInput] = useState(user && user.role === 'Parent' ? user.studentAadhaar : '');
  const [loading, setLoading] = useState(false);
  const [admission, setAdmission] = useState(null);
  const [error, setError] = useState(null);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setLogIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLogIndex((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [loading]);

  // Auto search on mount if parent is logged in
  useEffect(() => {
    if (user && user.role === 'Parent' && user.studentAadhaar) {
      const autoSearch = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/admissions/aadhaar/${user.studentAadhaar}`);
          if (!res.ok) {
            if (res.status === 404) {
              throw new Error('No admission application found for your Student Aadhaar card.');
            }
            throw new Error('Server error looking up status.');
          }
          const data = await res.json();
          setAdmission(data);
        } catch (err) {
          setError(err.message);
          setAdmission(null);
        } finally {
          setLoading(false);
        }
      };
      autoSearch();
    }
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(aadhaarInput)) {
      setError('Please enter a valid 12-digit Aadhaar Card number.');
      setAdmission(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admissions/aadhaar/${aadhaarInput}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No admission application found for this Aadhaar card number.');
        }
        throw new Error('Server error looking up status.');
      }
      const data = await res.json();
      setAdmission(data);
    } catch (err) {
      setError(err.message);
      setAdmission(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDownloadPDF = () => {
    if (!admission) return;
    const element = document.getElementById('admission-receipt');
    element.classList.add('printable-receipt');
    
    const opt = {
      margin:       [0.4, 0.4, 0.4, 0.4],
      filename:     `Admission_Receipt_${admission._id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(opt).from(element).save().then(() => {
        element.classList.remove('printable-receipt');
      }).catch(err => {
        console.error(err);
        element.classList.remove('printable-receipt');
      });
    } else {
      alert('PDF generation engine is still loading. Please try again in a few seconds.');
      element.classList.remove('printable-receipt');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="card-title" style={{ textAlign: 'center' }}>Admissions Status Desk</h2>
      <p className="card-subtitle" style={{ textAlign: 'center' }}>
        Parents and candidates can query their provisional admission status and retrieve official slips using their Aadhaar Number.
      </p>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Enter Student's 12-digit Aadhaar Number"
            value={aadhaarInput}
            onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
            maxLength={12}
            style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.05em' }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '150px' }}>
          {loading ? 'Searching...' : 'Check Status'}
        </button>
      </form>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '1.25rem', borderRadius: '10px', color: 'white', textAlign: 'center', animation: 'slideIn 0.3s ease' }}>
          <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>⚠️</span> {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', margin: '2rem 0' }}>
          <div className="tech-scanner-container" style={{ width: '100%' }}>
            <div className="scanner-box">
              <div className="scanner-line"></div>
              <div className="scanner-corner corner-tl"></div>
              <div className="scanner-corner corner-tr"></div>
              <div className="scanner-corner corner-bl"></div>
              <div className="scanner-corner corner-br"></div>
              <span className="scanner-badge-icon">🪪</span>
            </div>
            <div className="tech-terminal-logs">
              {[
                'Initializing secure telemetry link to admissions database...',
                'Querying MongoDB cluster for record matching Aadhaar key...',
                `Matching hashes for Aadhaar ID: **** **** ${aadhaarInput ? aadhaarInput.slice(-4) : 'XXXX'}`,
                'Decrypting candidate credential profiles...',
                'Success! Handshake completed. Rendering status dashboard.'
              ].slice(0, logIndex + 1).map((line, idx) => (
                <div key={idx} className={`log-line ${idx === logIndex && logIndex < 4 ? 'active' : ''}`}>
                  <span className="log-time">[{new Date().toLocaleTimeString()}]</span>
                  <span className={idx === 4 ? "log-success" : "log-text"}>
                    {idx === 4 ? "✓ " : "> "} {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Details Render */}
      {admission && !loading && (
        <div style={{ animation: 'slideIn 0.4s ease' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'white' }}>
            Application Status: <span style={{ color: 'var(--color-primary-hover)' }}>{admission.studentName}</span>
          </h3>

          {/* Pending view */}
          {admission.status === 'Pending' && (
            <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: '12px', padding: '2rem', color: 'white', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--warning)', marginBottom: '0.5rem' }}>Application Under Verification</h4>
              <p style={{ fontSize: '0.95rem', color: '#fef3c7', lineHeight: '1.6' }}>
                Your provisional application is successfully received and currently in the verification queue.
                Our admissions committee is reviewing your details and uploaded documents. Please check back later.
              </p>

              {/* Status Timeline */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', position: 'relative', padding: '0 1rem' }}>
                <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', top: '15px', left: '10%', width: '30%', height: '2px', background: 'var(--warning)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--warning)', color: 'black', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>Submitted</span>
                </div>
                
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid var(--warning)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>⏳</div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600', color: 'var(--warning)' }}>Verifying</span>
                </div>

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Provisional Slip</span>
                </div>
              </div>
            </div>
          )}

          {/* Rejected view */}
          {admission.status === 'Rejected' && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '2rem', color: 'white', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❌</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--danger)', marginBottom: '0.5rem' }}>Admission Request Rejected</h4>
              <p style={{ fontSize: '0.95rem', color: '#fee2e2', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                We regret to inform you that your application for freshman admission has been declined by the college staff.
              </p>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--danger)' }}>
                <strong style={{ color: 'white', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason for Rejection:</strong>
                <p style={{ fontStyle: 'italic', marginTop: '0.4rem', color: '#fca5a5', fontSize: '1rem' }}>
                  "{admission.rejectionReason || 'Documents verification criteria not satisfied.'}"
                </p>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Please contact the college admissions desk if you believe this is in error or require further help.
              </p>
            </div>
          )}

          {/* Approved view */}
          {admission.status === 'Approved' && (
            <div style={{ textAlign: 'left' }}>
              {/* Approval Notification Card */}
              <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: '12px', padding: '2rem', color: 'white', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                <h4 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--success)', marginBottom: '0.5rem' }}>Congratulations! Admission Approved</h4>
                <p style={{ fontSize: '1rem', color: '#d1fae5', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Your provisional admission to <strong>KLE's BCA P. C. Jabin Science College Hubballi</strong> has been approved by the admissions desk.
                  Please proceed with the fee payment by visiting the college campus directly.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--success), #059669)', border: 'none', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} onClick={handleDownloadPDF}>
                    📥 Download PDF Slip
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} onClick={() => window.print()}>
                    🖨️ Print Slip
                  </button>
                </div>
              </div>

              {/* Renders provisional admission card */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Official Provisional Admission Card
              </h4>
              
              <div id="admission-receipt" className="official-admission-card holographic" style={{ pointerEvents: 'none' }}>
                <div className="admission-card-header">
                  <h1 className="college-title">KLE's BCA P. C. Jabin Science College Hubballi</h1>
                  <p className="college-subtitle">Admissions Division • Session 2026-27</p>
                  <span className="admission-badge" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)', color: 'var(--success)' }}>
                    FRESHER STUDENT PROVISIONAL ADMISSION CARD
                  </span>
                </div>

                <div className="admission-details-grid">
                  <div>
                    <h3 className="detail-section-title">Personal Details</h3>
                    <div className="detail-list">
                      <div className="detail-row">
                        <span className="detail-label">Student Name:</span>
                        <span className="detail-value">{admission.studentName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Date of Birth:</span>
                        <span className="detail-value">{formatDate(admission.dob)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Aadhaar Card:</span>
                        <span className="detail-value">{admission.aadhaarNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Father's Name:</span>
                        <span className="detail-value">{admission.fatherName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Mother's Name:</span>
                        <span className="detail-value">{admission.motherName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Student Phone:</span>
                        <span className="detail-value">{admission.studentPhone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Parent Phone:</span>
                        <span className="detail-value">{admission.parentPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="detail-section-title">Academic Details</h3>
                    <div className="detail-list">
                      <div className="detail-row">
                        <span className="detail-label">Stream Allocated:</span>
                        <span className="detail-value" style={{ color: 'var(--success)', fontWeight: '700' }}>
                          {admission.previousStream}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Previous College:</span>
                        <span className="detail-value">{admission.previousCollege}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">PUC II Board:</span>
                        <span className="detail-value">{admission.pucBoard || 'State'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">PUC II Academic Score:</span>
                        <span className="detail-value">
                          {(admission.pucBoard || 'State') === 'CBSE' 
                            ? `CGPA: ${admission.pucCgpa} / 10` 
                            : `Marks: ${admission.pucMarks} / 600`}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">PUC II Percentage:</span>
                        <span className="detail-value" style={{ color: 'var(--success)', fontWeight: '700' }}>
                          {admission.pucPercentage || (admission.pucMarks ? Math.round((admission.pucMarks / 600) * 100) : 0)}%
                        </span>
                      </div>

                      <div className="detail-row" style={{ marginTop: '0.5rem' }}>
                        <span className="detail-label">SSLC Board:</span>
                        <span className="detail-value">{admission.sslcBoard || 'State'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">SSLC Academic Score:</span>
                        <span className="detail-value">
                          {(admission.sslcBoard || 'State') === 'CBSE' 
                            ? `CGPA: ${admission.sslcCgpa} / 10` 
                            : `Marks: ${admission.sslcMarks} / 625`}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">SSLC Percentage:</span>
                        <span className="detail-value" style={{ color: 'var(--success)', fontWeight: '700' }}>
                          {admission.sslcPercentage || (admission.sslcMarks ? Math.round((admission.sslcMarks / 625) * 100) : 0)}%
                        </span>
                      </div>
                      <div className="detail-row" style={{ flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                        <span className="detail-label">Permanent Address:</span>
                        <span className="detail-value" style={{ textAlign: 'left', maxWidth: '100%', wordBreak: 'break-word', marginTop: '0.2rem' }}>
                          {admission.permanentAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admission-card-footer">
                  <div className="official-seal">
                    <span>KLE's P. C. Jabin College</span>
                    <div className="seal-graphic">SEAL</div>
                  </div>

                  <div className="signature-box-wrapper">
                    {admission.documents.studentSignature ? (
                      <img 
                        src={`/uploads/${admission.documents.studentSignature}`} 
                        alt="Signature" 
                        className="sig-image" 
                      />
                    ) : (
                      <div style={{ height: '60px' }}></div>
                    )}
                    <div className="sig-line"></div>
                    <span className="sig-caption">Student Signature</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StatusPortal;
