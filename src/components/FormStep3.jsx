import React from 'react';

const FormStep3 = ({ formData, files, onBack, onSubmit, submitting }) => {
  // Helper to format dates nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Helper to generate local signature URL
  const getSignaturePreview = () => {
    if (files && files.studentSignature) {
      return URL.createObjectURL(files.studentSignature);
    }
    return null;
  };

  const sigPreviewUrl = getSignaturePreview();

  // Documents listing
  const docsList = [
    { label: 'Aadhaar Card', file: files.aadhaarCard },
    { label: 'PAN Card', file: files.panCard, optional: true },
    { label: 'Income Caste Certificate', file: files.incomeCaste },
    { label: 'Father Aadhaar', file: files.fatherAadhaar },
    { label: 'Mother Aadhaar', file: files.motherAadhaar },
    { label: 'PUC II Marks Card', file: files.pucMarksCard },
    { label: 'SSLC Marks Card', file: files.sslcMarksCard },
    { label: 'Student Signature', file: files.studentSignature },
  ];

  return (
    <div className="admission-receipt-container">
      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="card-title">Review Admission Application</h2>
        <p className="card-subtitle">Verify all details carefully before final submission. Click submit to finish your registration.</p>

        {/* Official College Admission Card Layout */}
        <div className="official-admission-card">
          <div className="admission-card-header">
            <h1 className="college-title">KLE's BCA P. C. Jabin Science College Hubballi</h1>
            <p className="college-subtitle">Admissions Division • Session 2026-27</p>
            <span className="admission-badge">FRESHER STUDENT PROVISIONAL ADMISSION CARD</span>
          </div>

          <div className="admission-details-grid">
            {/* Personal Details */}
            <div>
              <h3 className="detail-section-title">Personal Details</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Student Name:</span>
                  <span className="detail-value">{formData.studentName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{formatDate(formData.dob)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Aadhaar Card:</span>
                  <span className="detail-value">{formData.aadhaarNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Father's Name:</span>
                  <span className="detail-value">{formData.fatherName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mother's Name:</span>
                  <span className="detail-value">{formData.motherName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Student Phone:</span>
                  <span className="detail-value">{formData.studentPhone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Parent Phone:</span>
                  <span className="detail-value">{formData.parentPhone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Parent Email:</span>
                  <span className="detail-value">{formData.parentEmail}</span>
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div>
              <h3 className="detail-section-title">Academic Details</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Stream Allocated:</span>
                  <span className="detail-value" style={{ color: 'var(--color-primary-hover)', fontWeight: '700' }}>
                    {formData.previousStream}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Previous College:</span>
                  <span className="detail-value">{formData.previousCollege}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">PUC II Marks:</span>
                  <span className="detail-value">{formData.pucMarks} / 600</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">SSLC Marks:</span>
                  <span className="detail-value">{formData.sslcMarks} / 625</span>
                </div>
                <div className="detail-row" style={{ flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                  <span className="detail-label">Permanent Address:</span>
                  <span className="detail-value" style={{ textAlign: 'left', maxWidth: '100%', wordBreak: 'break-word', marginTop: '0.2rem' }}>
                    {formData.permanentAddress}
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

            {/* Signature Rendered at the bottom of the details page */}
            <div className="signature-box-wrapper">
              {sigPreviewUrl ? (
                <img src={sigPreviewUrl} alt="Student Signature" className="sig-image" />
              ) : (
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', color: 'var(--danger)' }}>
                  Missing Signature
                </div>
              )}
              <div className="sig-line"></div>
              <span className="sig-caption">Student Signature</span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="uploaded-docs-summary" style={{ marginTop: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem' }}>Uploaded Documents Check</h4>
          <div className="docs-list-grid">
            {docsList.map((doc) => (
              <div key={doc.label} className="doc-summary-badge">
                <span className={`doc-badge-status ${doc.file ? 'present' : (doc.optional ? 'present' : 'missing')}`}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                  {doc.label} {doc.file ? `(${Math.round(doc.file.size / 1024)} KB)` : '(Not Uploaded)'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn btn-secondary" onClick={onBack} disabled={submitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          
          <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Submitting Form...' : 'Confirm & Submit Application'}
            {!submitting && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormStep3;
