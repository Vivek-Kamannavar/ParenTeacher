import React from 'react';

const FormStep2 = ({ files, handleFileChange, handleRemoveFile, onBack, onNext }) => {
  const [errors, setErrors] = React.useState({});

  const documentTypes = [
    { key: 'aadhaarCard', label: 'Student Aadhaar Card', required: true },
    { key: 'panCard', label: 'PAN Card (Optional)', required: false },
    { key: 'incomeCaste', label: 'Income & Caste Certificate', required: true },
    { key: 'fatherAadhaar', label: 'Father\'s Aadhaar Card', required: true },
    { key: 'motherAadhaar', label: 'Mother\'s Aadhaar Card', required: true },
    { key: 'pucMarksCard', label: 'PUC II Marks Card', required: true },
    { key: 'sslcMarksCard', label: 'SSLC Marks Card', required: true },
    { key: 'studentSignature', label: 'Student Signature (Signature Document)', required: true },
  ];

  const validate = () => {
    const newErrors = {};
    documentTypes.forEach((doc) => {
      if (doc.required && !files[doc.key]) {
        newErrors[doc.key] = `${doc.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="card-title">Upload Documents</h2>
      <p className="card-subtitle">Please upload copies of the following documents. File types accepted: PDF, JPG, PNG. Max size: 5MB.</p>

      <div className="document-upload-grid">
        {documentTypes.map((doc) => {
          const file = files[doc.key];
          return (
            <div key={doc.key} className="form-group">
              <label>
                {doc.label} {doc.required && <span className="required-star">*</span>}
              </label>
              
              <div className={`upload-box ${file ? 'has-file' : ''}`}>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="upload-input"
                  onChange={(e) => handleFileChange(doc.key, e)}
                />
                
                <div className="upload-icon-container">
                  {file ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  )}
                </div>
                
                <div className="upload-title">
                  {file ? 'File Uploaded Successfully' : 'Choose File or Drag Here'}
                </div>
                <div className="upload-hint">
                  {file ? 'Click or drag to replace file' : 'JPEG, PNG, or PDF up to 5MB'}
                </div>

                {file && (
                  <div className="file-preview" onClick={(e) => e.stopPropagation()}>
                    <span className="file-name" title={file.name}>{file.name}</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(doc.key)}
                      title="Remove file"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {errors[doc.key] && (
                <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {errors[doc.key]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
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

export default FormStep2;
