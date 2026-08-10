import React, { useState } from 'react';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import AdminDashboard from './components/AdminDashboard';
import StatusPortal from './components/StatusPortal';
import CollegeHome from './components/CollegeHome';
import AuthScreen from './components/AuthScreen';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import './App.css';

const initialFormState = {
  studentName: '',
  motherName: '',
  fatherName: '',
  aadhaarNumber: '',
  parentPhone: '',
  parentEmail: '',
  studentPhone: '',
  dob: '',
  previousStream: 'Science', // default
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

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admission', 'status', 'admin'
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3, or 4 (success page)
  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState(initialFilesState);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = async (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    if (userData.role === 'Parent') {
      // Check if parent student already has admission
      try {
        const res = await fetch(`/api/admissions/aadhaar/${userData.studentAadhaar}`);
        if (res.ok) {
          setCurrentView('status');
        } else {
          setFormData(prev => ({
            ...prev,
            aadhaarNumber: userData.studentAadhaar,
            parentPhone: userData.phone
          }));
          setCurrentView('admission');
        }
      } catch (err) {
        console.error(err);
        setCurrentView('admission');
      }
    } else if (userData.role === 'Teacher') {
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
    resetForm();
  };



  // Toast notifications helper
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

  // Text inputs handler
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

  // File upload handler
  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast(`File size of ${file.name} exceeds 5MB limit.`, 'error');
      return;
    }

    // Check extension
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

  // Form submission handler
  const handleSubmitForm = async () => {
    setSubmitting(true);
    try {
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append file fields
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
      setCurrentStep(4); // Move to success view
    } catch (error) {
      console.error('Error submitting form:', error);
      addToast(error.message || 'Failed to submit application. Please check your network or MongoDB server.', 'error');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="app-container">
      {/* Header Panel */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            <img 
              src="https://tse2.mm.bing.net/th/id/OIP.vxH6bxBOpwhVrPCAy5BZcgHaHX?r=0&pid=Api&P=0&h=180" 
              alt="KLE Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
            />
          </div>
          <div className="logo-text">KLE's BCA P. C. Jabin</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
            {user && user.role === 'Parent' && (
              <button
                className={`nav-btn ${currentView === 'admission' ? 'active' : ''}`}
                onClick={() => {
                  handleLoginSuccess(user);
                  if (currentStep === 4) resetForm();
                }}
              >
                🏫 Admission Form
              </button>
            )}
            <button
              className={`nav-btn ${currentView === 'status' ? 'active' : ''}`}
              onClick={() => setCurrentView('status')}
            >
              🔍 Check Status
            </button>
            {user && user.role === 'Teacher' && (
              <button
                className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                🛡️ Admin Dashboard
              </button>
            )}
          </nav>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <span style={{ color: 'white', fontWeight: '600' }}>
                {user.role === 'Parent' ? `👨‍👩‍👦 Parent (${user.studentAadhaar.slice(-4)})` : `🛡️ Teachers/Principal (${user.teacherId})`}
              </span>
              <button 
                onClick={handleLogout}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', padding: '0 0 0 0.5rem', borderLeft: '1px solid var(--border-color)' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' ? (
          <CollegeHome 
            onStartAdmission={() => {
              if (user && user.role === 'Parent') {
                handleLoginSuccess(user);
              } else if (user && user.role === 'Teacher') {
                setCurrentView('admin');
              } else {
                setCurrentView('admission');
              }
            }}
            onCheckStatus={() => setCurrentView('status')}
          />
        ) : currentView === 'admission' ? (
          !user || user.role !== 'Parent' ? (
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
                <div className="card success-screen">
                  <div className="success-icon-wrapper">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h1 className="success-title">Application Submitted!</h1>
                  <p className="success-message">
                    Thank you, <strong>{submittedData.studentName}</strong>. Your provisional admission form has been received. 
                    Your Application reference ID is <code>{submittedData._id}</code>. Please note it down for future communications.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                      🖨️ Print Receipt
                    </button>
                    <button className="btn btn-primary" onClick={resetForm}>
                      Fill Another Admission Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        ) : currentView === 'about' ? (
          <AboutUs 
            onStartAdmission={() => {
              if (user && user.role === 'Parent') {
                handleLoginSuccess(user);
              } else if (user && user.role === 'Teacher') {
                setCurrentView('admin');
              } else {
                setCurrentView('admission');
              }
            }}
          />
        ) : currentView === 'status' ? (
          <StatusPortal user={user} />
        ) : currentView === 'contact' ? (
          <ContactUs />
        ) : (
          !user || user.role !== 'Teacher' ? (
            <AuthScreen onLoginSuccess={handleLoginSuccess} targetRole="Teacher" />
          ) : (
            <AdminDashboard />
          )
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
      <footer style={{ marginTop: '4rem', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} KLE's BCA P. C. Jabin Science College Hubballi. MERN Admission Portal.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Built with ⚡ React & Express.js
        </p>
      </footer>
    </div>
  );
}

export default App;
