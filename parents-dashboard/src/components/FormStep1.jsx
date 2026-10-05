import React from 'react';

const FormStep1 = ({ formData, handleChange, handleStreamChange, files, setFormData, setFiles, user, onNext }) => {
  const [errors, setErrors] = React.useState({});
  const isParentPhoneReadOnly = !!(user && user.role === 'Parent' && (user.parentPhone || user.phone));
  const isParentEmailReadOnly = !!(user && user.role === 'Parent' && (user.parentEmail || user.email));
  const isParentAadhaarReadOnly = !!(user && user.role === 'Parent' && (user.parentAadhaar || user.studentAadhaar));

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother name is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
    
    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Aadhaar number must be exactly 12 digits';
    }

    if (!formData.parentPhone) {
      newErrors.parentPhone = 'Parent/guardian phone number is required';
    } else if (!/^\d{10}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Phone number must be 10 digits';
    }

    if (!formData.parentEmail) {
      newErrors.parentEmail = 'Parent email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    if (!formData.studentPhone) {
      newErrors.studentPhone = 'Student phone number is required';
    } else if (!/^\d{10}$/.test(formData.studentPhone)) {
      newErrors.studentPhone = 'Phone number must be 10 digits';
    }

    if (formData.studentEmail && !/^\S+@\S+\.\S+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email address';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.previousStream) {
      newErrors.previousStream = 'Please select a stream';
    }

    if (!formData.previousCollege.trim()) {
      newErrors.previousCollege = 'Previous college name is required';
    }

    // PUC II Validation
    const pucB = formData.pucBoard || 'State';
    if (pucB === 'State') {
      if (formData.pucMarks === undefined || formData.pucMarks === '') {
        newErrors.pucMarks = 'PUC II marks are required';
      } else if (isNaN(formData.pucMarks) || formData.pucMarks < 0 || formData.pucMarks > 600) {
        newErrors.pucMarks = 'PUC II marks must be between 0 and 600';
      }
    } else {
      if (formData.pucCgpa === undefined || formData.pucCgpa === '') {
        newErrors.pucCgpa = 'PUC II CGPA is required';
      } else if (isNaN(formData.pucCgpa) || formData.pucCgpa < 0 || formData.pucCgpa > 10) {
        newErrors.pucCgpa = 'PUC II CGPA must be between 0 and 10';
      }
    }

    // SSLC Validation
    const sslcB = formData.sslcBoard || 'State';
    if (sslcB === 'State') {
      if (formData.sslcMarks === undefined || formData.sslcMarks === '') {
        newErrors.sslcMarks = 'SSLC marks are required';
      } else if (isNaN(formData.sslcMarks) || formData.sslcMarks < 0 || formData.sslcMarks > 625) {
        newErrors.sslcMarks = 'SSLC marks must be between 0 and 625';
      }
    } else {
      if (formData.sslcCgpa === undefined || formData.sslcCgpa === '') {
        newErrors.sslcCgpa = 'SSLC CGPA is required';
      } else if (isNaN(formData.sslcCgpa) || formData.sslcCgpa < 0 || formData.sslcCgpa > 10) {
        newErrors.sslcCgpa = 'SSLC CGPA must be between 0 and 10';
      }
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Permanent address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSslcBoardChange = (board) => {
    setFormData(prev => ({
      ...prev,
      sslcBoard: board,
      sslcMarks: '',
      sslcCgpa: '',
      sslcPercentage: ''
    }));
  };

  const handleSslcMarksChange = (e) => {
    const val = e.target.value;
    let pct = '';
    if (val !== '' && !isNaN(val)) {
      const marks = parseFloat(val);
      if (marks >= 0 && marks <= 625) {
        pct = ((marks / 625) * 100).toFixed(2);
      }
    }
    setFormData(prev => ({
      ...prev,
      sslcMarks: val,
      sslcPercentage: pct
    }));
  };

  const handleSslcCgpaChange = (e) => {
    const val = e.target.value;
    let pct = '';
    if (val !== '' && !isNaN(val)) {
      const cgpa = parseFloat(val);
      if (cgpa >= 0 && cgpa <= 10) {
        pct = (cgpa * 9.5).toFixed(2);
      }
    }
    setFormData(prev => ({
      ...prev,
      sslcCgpa: val,
      sslcPercentage: pct
    }));
  };

  const handlePucBoardChange = (board) => {
    setFormData(prev => ({
      ...prev,
      pucBoard: board,
      pucMarks: '',
      pucCgpa: '',
      pucPercentage: ''
    }));
  };

  const handlePucMarksChange = (e) => {
    const val = e.target.value;
    let pct = '';
    if (val !== '' && !isNaN(val)) {
      const marks = parseFloat(val);
      if (marks >= 0 && marks <= 600) {
        pct = ((marks / 600) * 100).toFixed(2);
      }
    }
    setFormData(prev => ({
      ...prev,
      pucMarks: val,
      pucPercentage: pct
    }));
  };

  const handlePucCgpaChange = (e) => {
    const val = e.target.value;
    let pct = '';
    if (val !== '' && !isNaN(val)) {
      const cgpa = parseFloat(val);
      if (cgpa >= 0 && cgpa <= 10) {
        pct = (cgpa * 9.5).toFixed(2);
      }
    }
    setFormData(prev => ({
      ...prev,
      pucCgpa: val,
      pucPercentage: pct
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  // Helper to generate local signature preview URL
  const getSignaturePreview = () => {
    if (files && files.studentSignature) {
      return URL.createObjectURL(files.studentSignature);
    }
    return null;
  };

  const sigPreviewUrl = getSignaturePreview();

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="card-title">Student Admission Form</h2>
      <p className="card-subtitle">Please enter the candidate's personal and academic details.</p>

      <div className="form-grid">
        {/* Student Name */}
        <div className="form-group">
          <label htmlFor="studentName">Name of the Student <span className="required-star">*</span></label>
          <input
            id="studentName"
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter full name as in marksheet"
          />
          {errors.studentName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.studentName}</span>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="dob">Date of Birth 📅 <span className="required-star">*</span></label>
          <input
            id="dob"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.dob}</span>}
        </div>

        {/* Father Name */}
        <div className="form-group">
          <label htmlFor="fatherName">Father's Name <span className="required-star">*</span></label>
          <input
            id="fatherName"
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Enter father's name"
          />
          {errors.fatherName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.fatherName}</span>}
        </div>

        {/* Mother Name */}
        <div className="form-group">
          <label htmlFor="motherName">Mother's Name <span className="required-star">*</span></label>
          <input
            id="motherName"
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Enter mother's name"
          />
          {errors.motherName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.motherName}</span>}
        </div>

        {/* Parent Aadhaar Card Number (Freezed) */}
        <div className="form-group">
          <label htmlFor="parentAadhaarNumber">
            Parent's Aadhaar Card Number <span style={{ color: 'var(--color-primary-hover)', fontSize: '0.85rem' }}>🔒 (Freezed)</span>
          </label>
          <input
            id="parentAadhaarNumber"
            type="text"
            name="parentAadhaarNumber"
            value={formData.parentAadhaarNumber || (user && (user.parentAadhaar || user.studentAadhaar)) || ''}
            readOnly
            placeholder="Parent Aadhaar card number"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', cursor: 'not-allowed', opacity: 0.9, fontWeight: '600', letterSpacing: '0.03em' }}
            title="This field is locked since it was fetched from your parent account registration."
          />
        </div>

        {/* Student Aadhaar Card Number (Typed Manually) */}
        <div className="form-group">
          <label htmlFor="aadhaarNumber">
            Student's Aadhaar Card Number <span className="required-star">*</span> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Type Manually)</span>
          </label>
          <input
            id="aadhaarNumber"
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              handleChange({ target: { name: 'aadhaarNumber', value: val } });
            }}
            placeholder="Enter student's 12-digit Aadhaar number"
            maxLength={12}
          />
          {errors.aadhaarNumber && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.aadhaarNumber}</span>}
        </div>

        {/* Previous College Name */}
        <div className="form-group">
          <label htmlFor="previousCollege">Previous College Name <span className="required-star">*</span></label>
          <input
            id="previousCollege"
            type="text"
            name="previousCollege"
            value={formData.previousCollege}
            onChange={handleChange}
            placeholder="Enter name of high school / previous college"
          />
          {errors.previousCollege && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.previousCollege}</span>}
        </div>

        {/* Student Phone */}
        <div className="form-group">
          <label htmlFor="studentPhone">Student Phone Number <span className="required-star">*</span></label>
          <input
            id="studentPhone"
            type="tel"
            name="studentPhone"
            value={formData.studentPhone}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
          />
          {errors.studentPhone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.studentPhone}</span>}
        </div>

        {/* Student Email */}
        <div className="form-group">
          <label htmlFor="studentEmail">Student Email Address <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span></label>
          <input
            id="studentEmail"
            type="email"
            name="studentEmail"
            value={formData.studentEmail || ''}
            onChange={handleChange}
            placeholder="Enter student email address"
          />
          {errors.studentEmail && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.studentEmail}</span>}
        </div>

        {/* Parent Phone */}
        <div className="form-group">
          <label htmlFor="parentPhone">
            Parent Phone Number <span style={{ color: 'var(--color-primary-hover)', fontSize: '0.85rem' }}>🔒 (Freezed)</span>
          </label>
          <input
            id="parentPhone"
            type="tel"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleChange}
            placeholder="Enter parent mobile number"
            maxLength={10}
            readOnly={isParentPhoneReadOnly}
            style={isParentPhoneReadOnly ? { backgroundColor: 'rgba(255,255,255,0.04)', cursor: 'not-allowed', opacity: 0.9, fontWeight: '600' } : {}}
            title={isParentPhoneReadOnly ? "This field is locked since it was fetched from registration." : ""}
          />
          {errors.parentPhone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.parentPhone}</span>}
        </div>

        {/* Parent Email */}
        <div className="form-group">
          <label htmlFor="parentEmail">
            Parent Email Address <span style={{ color: 'var(--color-primary-hover)', fontSize: '0.85rem' }}>🔒 (Freezed)</span>
          </label>
          <input
            id="parentEmail"
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleChange}
            placeholder="Enter parent email address"
            readOnly={isParentEmailReadOnly}
            style={isParentEmailReadOnly ? { backgroundColor: 'rgba(255,255,255,0.04)', cursor: 'not-allowed', opacity: 0.9, fontWeight: '600' } : {}}
            title={isParentEmailReadOnly ? "This field is locked since it was fetched from registration." : ""}
          />
          {errors.parentEmail && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.parentEmail}</span>}
        </div>

        {/* Stream Selector */}
        <div className="form-group">
          <label>Stream Took in Previous College <span className="required-star">*</span></label>
          <div className="stream-selector">
            {['Science', 'Commerce', 'Arts'].map((stream) => (
              <label key={stream} className="stream-option">
                <input
                  type="radio"
                  name="previousStream"
                  value={stream}
                  checked={formData.previousStream === stream}
                  onChange={() => handleStreamChange(stream)}
                />
                <div className="stream-label-card">
                  <span className="stream-icon">
                    {stream === 'Science' && '🔬'}
                    {stream === 'Commerce' && '📈'}
                    {stream === 'Arts' && '🎨'}
                  </span>
                  <span>{stream}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.previousStream && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.previousStream}</span>}
        </div>

        {/* SSLC Academic Marks */}
        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>SSLC Academic Record <span className="required-star">*</span></span>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <button 
                type="button" 
                onClick={() => handleSslcBoardChange('State')}
                className={`nav-btn ${(formData.sslcBoard || 'State') === 'State' ? 'active' : ''}`}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
              >
                State Board
              </button>
              <button 
                type="button" 
                onClick={() => handleSslcBoardChange('CBSE')}
                className={`nav-btn ${formData.sslcBoard === 'CBSE' ? 'active' : ''}`}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
              >
                CBSE Board
              </button>
            </div>
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {(formData.sslcBoard || 'State') === 'State' ? (
              <div>
                <input
                  id="sslcMarks"
                  type="number"
                  name="sslcMarks"
                  value={formData.sslcMarks}
                  onChange={handleSslcMarksChange}
                  placeholder="SSLC Marks (Max 625)"
                />
                {errors.sslcMarks && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.sslcMarks}</span>}
              </div>
            ) : (
              <div>
                <input
                  id="sslcCgpa"
                  type="number"
                  name="sslcCgpa"
                  step="0.01"
                  value={formData.sslcCgpa}
                  onChange={handleSslcCgpaChange}
                  placeholder="SSLC CGPA (Max 10)"
                />
                {errors.sslcCgpa && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.sslcCgpa}</span>}
              </div>
            )}
            <div>
              <input
                type="text"
                value={formData.sslcPercentage ? `${formData.sslcPercentage}%` : ''}
                placeholder="Percentage"
                readOnly
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderStyle: 'dashed', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-primary-hover)' }}
              />
            </div>
          </div>
        </div>

        {/* PUC II Academic Marks */}
        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>PUC II Academic Record <span className="required-star">*</span></span>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <button 
                type="button" 
                onClick={() => handlePucBoardChange('State')}
                className={`nav-btn ${(formData.pucBoard || 'State') === 'State' ? 'active' : ''}`}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
              >
                State Board
              </button>
              <button 
                type="button" 
                onClick={() => handlePucBoardChange('CBSE')}
                className={`nav-btn ${formData.pucBoard === 'CBSE' ? 'active' : ''}`}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
              >
                CBSE Board
              </button>
            </div>
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {(formData.pucBoard || 'State') === 'State' ? (
              <div>
                <input
                  id="pucMarks"
                  type="number"
                  name="pucMarks"
                  value={formData.pucMarks}
                  onChange={handlePucMarksChange}
                  placeholder="PUC II Marks (Max 600)"
                />
                {errors.pucMarks && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.pucMarks}</span>}
              </div>
            ) : (
              <div>
                <input
                  id="pucCgpa"
                  type="number"
                  name="pucCgpa"
                  step="0.01"
                  value={formData.pucCgpa}
                  onChange={handlePucCgpaChange}
                  placeholder="PUC II CGPA (Max 10)"
                />
                {errors.pucCgpa && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.pucCgpa}</span>}
              </div>
            )}
            <div>
              <input
                type="text"
                value={formData.pucPercentage ? `${formData.pucPercentage}%` : ''}
                placeholder="Percentage"
                readOnly
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderStyle: 'dashed', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-primary-hover)' }}
              />
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="form-group full-width">
          <label htmlFor="permanentAddress">Permanent Address <span className="required-star">*</span></label>
          <textarea
            id="permanentAddress"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            placeholder="Enter your complete permanent address"
          />
          {errors.permanentAddress && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.permanentAddress}</span>}
        </div>
      </div>

      {/* Signature Preview below the page */}
      <div className="dynamic-signature-panel">
        <h4 className="signature-preview-title">Student Signature Verification</h4>
        <div className="signature-preview-box">
          {sigPreviewUrl ? (
            <img 
              src={sigPreviewUrl} 
              alt="Uploaded Student Signature" 
              className="signature-preview-img" 
            />
          ) : (
            <span className="signature-placeholder">
              Signature will appear here once uploaded in the next step
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
          * As requested, the student signature document is dynamically fetched from your uploads and displayed below.
        </p>
      </div>

      <div className="form-footer">
        <div></div> {/* Empty for alignment */}
        <button type="submit" className="btn btn-primary">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default FormStep1;
