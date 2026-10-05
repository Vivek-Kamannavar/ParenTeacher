import React, { useState } from 'react';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import StatusPortal from './components/StatusPortal';
import CollegeHome from './components/CollegeHome';
import AuthScreen from './components/AuthScreen';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import StudentInfoPortal from './components/StudentInfoPortal';
import './App.css';

const initialFormState = {
  studentName: '',
  motherName: '',
  fatherName: '',
  aadhaarNumber: '',
  parentAadhaarNumber: '',
  parentPhone: '',
  parentEmail: '',
  studentPhone: '',
  dob: '',
  previousStream: 'Science',
  previousCollege: '',
  pucMarks: '',
  sslcMarks: '',
  permanentAddress: '',
};

const initialFilesState = {
  aadhaarCard: null,
  panCard: null,
  incomeCaste: null,
  fatherAadhaar: null,
  motherAadhaar: null,
  pucMarksCard: null,
  sslcMarksCard: null,
  studentSignature: null,
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admission', 'status', 'about', 'contact'
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState(initialFilesState);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      return stored && stored.role === 'Parent' ? stored : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = async (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    if (userData.role === 'Parent') {
      const pAadhaar = userData.parentAadhaar || userData.studentAadhaar || '';
      setFormData(prev => ({
        ...prev,
        parentAadhaarNumber: pAadhaar,
        parentPhone: userData.parentPhone || userData.phone || prev.parentPhone,
        parentEmail: userData.parentEmail || prev.parentEmail,
        studentPhone: userData.studentPhone || prev.studentPhone,
        studentEmail: userData.studentEmail || prev.studentEmail,
        aadhaarNumber: ''
      }));
      setCurrentView('admission');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
    resetForm();
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStreamChange = (stream) => {
    setFormData((prev) => ({
      ...prev,
      previousStream: stream,
    }));
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast(`File size of ${file.name} exceeds 5MB limit.`, 'error');
      return;
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      addToast('Invalid file format. Only JPEG, PNG, and PDF are allowed.', 'error');
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
    addToast(`${file.name} added successfully!`, 'success');
  };

  const handleRemoveFile = (field) => {
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleSubmitForm = async () => {
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      const response = await fetch('/api/admissions', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Admission submission failed');
      }

      const result = await response.json();
      setSubmittedData(result);
      addToast('Admission Application Submitted Successfully!', 'success');
      setCurrentStep(4);
    } catch (error) {
      console.error('Error submitting form:', error);
      addToast(error.message || 'Failed to submit application.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!submittedData) return;
    const element = document.getElementById('admission-receipt');
    element.classList.add('printable-receipt');
    
    const opt = {
      margin:       [0.4, 0.4, 0.4, 0.4],
      filename:     `Admission_Receipt_${submittedData._id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    if (typeof window.html2pdf !== 'undefined') {
      window.html2pdf().set(opt).from(element).save().then(() => {
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

  const resetForm = () => {
    setFormData(initialFormState);
    setFiles(initialFilesState);
    setSubmittedData(null);
    setCurrentStep(1);
  };

  const getStepWidth = () => {
    switch (currentStep) {
      case 1: return '0%';
      case 2: return '50%';
      case 3: return '100%';
      default: return '100%';
    }
  };

  const navigateToTeacherPortal = () => {
    window.location.href = 'http://localhost:5174';
  };

  return (
    <div className="app-container">
      {/* Header Panel */}
      <header className="header">
        <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          <div className="logo-icon" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <img 
              src="/kle_logo.png" 
              alt="KLE Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
            />
          </div>
          <div>
            <div className="logo-text">KLE's BCA P. C. Jabin</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <nav className="nav-tabs">
            <button
              className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentView('home')}
            >
              🏠 Home
            </button>
            <button
              className={`nav-btn ${currentView === 'about' ? 'active' : ''}`}
              onClick={() => setCurrentView('about')}
            >
              ℹ️ About Us
            </button>
            <button
              className={`nav-btn ${currentView === 'admission' ? 'active' : ''}`}
              onClick={() => {
                if (user) handleLoginSuccess(user);
                else setCurrentView('admission');
              }}
            >
              🏫 Admission Form
            </button>
            <button
              className={`nav-btn ${currentView === 'status' ? 'active' : ''}`}
              onClick={() => setCurrentView('status')}
            >
              🔍 Check Status
            </button>
            <button
              className={`nav-btn ${currentView === 'student-info' ? 'active' : ''}`}
              onClick={() => setCurrentView('student-info')}
            >
              🎓 Student Info
            </button>
          </nav>

          {/* Header navigation tabs */}

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <span style={{ color: '#0f172a', fontWeight: '600' }}>
                👨‍👩‍👦 Parent ({(user.parentAadhaar || user.studentAadhaar || '').slice(-4)})
              </span>
              <button 
                onClick={handleLogout}
                style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', padding: '0 0 0 0.5rem', borderLeft: '1px solid #e2e8f0' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ flex: 1, marginTop: '1.5rem' }}>
        {currentView === 'home' ? (
          <CollegeHome 
            user={user}
            onStartAdmission={() => {
              if (user) {
                handleLoginSuccess(user);
              } else {
                setCurrentView('admission');
              }
            }}
            onCheckStatus={() => setCurrentView('status')}
            onLoginSuccess={handleLoginSuccess}
            onGoToAdmin={navigateToTeacherPortal}
          />
        ) : currentView === 'admission' ? (
          !user ? (
            <AuthScreen onLoginSuccess={handleLoginSuccess} targetRole="Parent" />
          ) : (
            <div>
              {/* Stepper Progress bar */}
              {currentStep <= 3 && (
                <div className="stepper-container">
                  <div className="stepper-line"></div>
                  <div className="stepper-progress" style={{ width: getStepWidth() }}></div>

                  <div className={`step-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                    <div className="step-bubble">{currentStep > 1 ? '✓' : '1'}</div>
                    <span className="step-label">Student Details</span>
                  </div>

                  <div className={`step-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                    <div className="step-bubble">{currentStep > 2 ? '✓' : '2'}</div>
                    <span className="step-label">Upload Documents</span>
                  </div>

                  <div className={`step-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                    <div className="step-bubble">{currentStep > 3 ? '✓' : '3'}</div>
                    <span className="step-label">Preview & Submit</span>
                  </div>
                </div>
              )}

              {/* Stepper Pages */}
              {currentStep === 1 && (
                <FormStep1
                  formData={formData}
                  handleChange={handleChange}
                  handleStreamChange={handleStreamChange}
                  files={files}
                  setFormData={setFormData}
                  setFiles={setFiles}
                  user={user}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <FormStep2
                  files={files}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <FormStep3
                  formData={formData}
                  files={files}
                  onBack={() => setCurrentStep(2)}
                  onSubmit={handleSubmitForm}
                  submitting={submitting}
                />
              )}

              {/* Success Page */}
              {currentStep === 4 && submittedData && (
                <div className="card success-screen" style={{ maxWidth: '800px', margin: '2rem auto' }}>
                  <div className="success-icon-wrapper">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h1 className="success-title">Application Submitted!</h1>
                  <p className="success-message">
                    Your admission application has been received. Please download and print your official receipt (Application ID: <code>{submittedData._id}</code>) and present it during fee payment.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                      📥 Download PDF Receipt
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                      🖨️ Print Receipt
                    </button>
                    <button className="btn btn-secondary" onClick={resetForm}>
                      Fill Another Form
                    </button>
                  </div>

                  {/* Provisional Admission Card Preview */}
                  <div style={{ marginTop: '2.5rem', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', textAlign: 'center' }}>
                      Official Admission Slip Preview
                    </h3>
                    
                    <div id="admission-receipt" className="official-admission-card">
                      <div className="admission-card-header">
                        <h1 className="college-title">KLE's BCA P. C. Jabin Science College Hubballi</h1>
                        <p className="college-subtitle">Admissions Division • Session 2026-27</p>
                        <span className="admission-badge">FRESHER STUDENT PROVISIONAL ADMISSION CARD</span>
                      </div>

                      <div className="admission-details-grid">
                        <div>
                          <h3 className="detail-section-title">Personal Details</h3>
                          <div className="detail-list">
                            <div className="detail-row">
                              <span className="detail-label">Student Name:</span>
                              <span className="detail-value">{submittedData.studentName}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Date of Birth:</span>
                              <span className="detail-value">
                                {new Date(submittedData.dob).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Aadhaar Card:</span>
                              <span className="detail-value">{submittedData.aadhaarNumber}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Father's Name:</span>
                              <span className="detail-value">{submittedData.fatherName}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Mother's Name:</span>
                              <span className="detail-value">{submittedData.motherName}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Student Phone:</span>
                              <span className="detail-value">{submittedData.studentPhone}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Parent Phone:</span>
                              <span className="detail-value">{submittedData.parentPhone}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="detail-section-title">Academic Details</h3>
                          <div className="detail-list">
                            <div className="detail-row">
                              <span className="detail-label">Stream Allocated:</span>
                              <span className="detail-value" style={{ color: 'var(--color-primary-hover)', fontWeight: '700' }}>
                                {submittedData.previousStream}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Previous College:</span>
                              <span className="detail-value">{submittedData.previousCollege}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">PUC II Board:</span>
                              <span className="detail-value">{submittedData.pucBoard || 'State'}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">PUC II Score:</span>
                              <span className="detail-value">
                                {(submittedData.pucBoard || 'State') === 'CBSE' 
                                  ? `CGPA: ${submittedData.pucCgpa} / 10` 
                                  : `Marks: ${submittedData.pucMarks} / 600`}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">PUC II Percentage:</span>
                              <span className="detail-value" style={{ fontWeight: '700' }}>
                                {submittedData.pucPercentage}%
                              </span>
                            </div>

                            <div className="detail-row" style={{ marginTop: '0.5rem' }}>
                              <span className="detail-label">SSLC Board:</span>
                              <span className="detail-value">{submittedData.sslcBoard || 'State'}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">SSLC Score:</span>
                              <span className="detail-value">
                                {(submittedData.sslcBoard || 'State') === 'CBSE' 
                                  ? `CGPA: ${submittedData.sslcCgpa} / 10` 
                                  : `Marks: ${submittedData.sslcMarks} / 625`}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">SSLC Percentage:</span>
                              <span className="detail-value" style={{ fontWeight: '700' }}>
                                {submittedData.sslcPercentage}%
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
                          {submittedData.documents && submittedData.documents.studentSignature ? (
                            <img 
                              src={`/uploads/${submittedData.documents.studentSignature}`} 
                              alt="Student Signature" 
                              className="sig-image" 
                            />
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
                  </div>
                </div>
              )}
            </div>
          )
        ) : currentView === 'about' ? (
          <AboutUs 
            onStartAdmission={() => {
              if (user) {
                handleLoginSuccess(user);
              } else {
                setCurrentView('admission');
              }
            }}
          />
        ) : currentView === 'status' ? (
          <StatusPortal user={user} />
        ) : currentView === 'student-info' ? (
          <StudentInfoPortal user={user} />
        ) : (
          <ContactUs />
        )}
      </main>

      {/* Toast Notification HUD */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <footer style={{ marginTop: '4rem', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
          &copy; {new Date().getFullYear()} KLE's BCA P. C. Jabin Science College Hubballi. Freshman Admission Portal.
        </p>
      </footer>
    </div>
  );
}
