import React from 'react';

const FormStep1 = ({ formData, handleChange, handleStreamChange, files, setFormData, setFiles, onNext }) => {
  const [errors, setErrors] = React.useState({});

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

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.previousStream) {
      newErrors.previousStream = 'Please select a stream';
    }

    if (!formData.previousCollege.trim()) {
      newErrors.previousCollege = 'Previous college name is required';
    }

    if (formData.pucMarks === '') {
      newErrors.pucMarks = 'PUC II marks are required';
    } else if (isNaN(formData.pucMarks) || formData.pucMarks < 0 || formData.pucMarks > 600) {
      newErrors.pucMarks = 'PUC II marks must be between 0 and 600';
    }

    if (formData.sslcMarks === '') {
      newErrors.sslcMarks = 'SSLC marks are required';
    } else if (isNaN(formData.sslcMarks) || formData.sslcMarks < 0 || formData.sslcMarks > 625) {
      newErrors.sslcMarks = 'SSLC marks must be between 0 and 625';
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Permanent address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          <label htmlFor="dob">Date of Birth <span className="required-star">*</span></label>
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

        {/* Aadhaar Number */}
        <div className="form-group">
          <label htmlFor="aadhaarNumber">Aadhaar Card Number <span className="required-star">*</span></label>
          <input
            id="aadhaarNumber"
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            placeholder="Enter 12-digit Aadhaar number"
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

        {/* Parent Phone */}
        <div className="form-group">
          <label htmlFor="parentPhone">Parent or Guardian Phone Number <span className="required-star">*</span></label>
          <input
            id="parentPhone"
            type="tel"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleChange}
            placeholder="Enter parent mobile number"
            maxLength={10}
          />
          {errors.parentPhone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.parentPhone}</span>}
        </div>

        {/* Parent Email */}
        <div className="form-group">
          <label htmlFor="parentEmail">Parent Email Address <span className="required-star">*</span></label>
          <input
            id="parentEmail"
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleChange}
            placeholder="Enter parent email address (for status updates)"
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

        {/* Academic Marks */}
        <div className="form-group">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="pucMarks">PUC II Marks (Max 600) <span className="required-star">*</span></label>
              <input
                id="pucMarks"
                type="number"
                name="pucMarks"
                value={formData.pucMarks}
                onChange={handleChange}
                placeholder="Obtained marks"
              />
              {errors.pucMarks && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.pucMarks}</span>}
            </div>
            <div>
              <label htmlFor="sslcMarks">SSLC Marks (Max 625) <span className="required-star">*</span></label>
              <input
                id="sslcMarks"
                type="number"
                name="sslcMarks"
                value={formData.sslcMarks}
                onChange={handleChange}
                placeholder="Obtained marks"
              />
              {errors.sslcMarks && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.sslcMarks}</span>}
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
