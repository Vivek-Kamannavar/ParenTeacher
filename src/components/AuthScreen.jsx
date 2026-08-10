import React, { useState } from 'react';

const AuthScreen = ({ onLoginSuccess, targetRole }) => {
  const [roleTab, setRoleTab] = useState(targetRole || 'Parent'); // 'Parent' or 'Teacher'
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Parent inputs
  const [parentPhone, setParentPhone] = useState('');
  const [parentAadhaar, setParentAadhaar] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentConfirmPassword, setParentConfirmPassword] = useState('');

  // Teacher inputs
  const [teacherIdInput, setTeacherIdInput] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  // Newly generated Teacher ID display state
  const [generatedTeacherId, setGeneratedTeacherId] = useState('');

  // Password visibility states
  const [showParentPassword, setShowParentPassword] = useState(false);
  const [showParentConfirmPassword, setShowParentConfirmPassword] = useState(false);
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);

  const handleParentAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginMode) {
      if (!parentPhone || !parentPassword) {
        setError('Please fill in all fields.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/login/parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: parentPhone, password: parentPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        
        onLoginSuccess(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Register Mode
      if (!parentPhone || !parentAadhaar || !parentPassword || !parentConfirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (parentPassword !== parentConfirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/register/parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: parentPhone,
            studentAadhaar: parentAadhaar,
            password: parentPassword
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        
        setSuccess('Registration successful! Please log in below.');
        setIsLoginMode(true);
        setParentPassword('');
        setParentConfirmPassword('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTeacherAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginMode) {
      if (!teacherIdInput || !teacherPassword) {
        setError('Please fill in all fields.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/login/teacher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId: teacherIdInput, password: teacherPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        
        onLoginSuccess(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Register Mode
      if (!teacherPassword) {
        setError('Please enter a password.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/register/teacher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: teacherPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        
        setGeneratedTeacherId(data.teacherId);
        setSuccess('Account created successfully!');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card animate-scale-in" style={{ maxWidth: '480px', margin: '2rem auto' }}>
      {/* Role selector tab header */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          className={`nav-btn ${roleTab === 'Parent' ? 'active' : ''}`}
          onClick={() => {
            setRoleTab('Parent');
            setIsLoginMode(true);
            setError('');
            setSuccess('');
            setGeneratedTeacherId('');
          }}
          style={{ flex: 1, justifyContent: 'center' }}
          type="button"
        >
          👨‍👩‍👦 Parents Login
        </button>
        <button
          className={`nav-btn ${roleTab === 'Teacher' ? 'active' : ''}`}
          onClick={() => {
            setRoleTab('Teacher');
            setIsLoginMode(true);
            setError('');
            setSuccess('');
            setGeneratedTeacherId('');
          }}
          style={{ flex: 1, justifyContent: 'center' }}
          type="button"
        >
          🛡️ Teachers/Principal Login
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          {roleTab === 'Parent' ? 'Parents Login' : 'Teachers/Principal Login'}
        </h3>
        <p className="card-subtitle" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
          {isLoginMode ? 'Enter credentials to access your portal' : (roleTab === 'Parent' ? 'Create a new Parents Login' : 'Create a new Teachers/Principal Login')}
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {success && !generatedTeacherId && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          ✓ {success}
        </div>
      )}

      {/* Render Newly Generated Teacher ID Display Block */}
      {roleTab === 'Teacher' && !isLoginMode && generatedTeacherId ? (
        <div className="animate-scale-in" style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid var(--color-primary)', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🔑</span>
          <h4 style={{ color: 'white', fontWeight: '700', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Your Unique Teachers/Principal ID</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Copy and save this ID. You will use it to log into the Teachers/Principal Login in the future.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-block', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary-hover)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            {generatedTeacherId}
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setGeneratedTeacherId('');
                setIsLoginMode(true);
                setSuccess('');
                setError('');
                setTeacherIdInput(generatedTeacherId);
              }}
              style={{ width: '100%', borderRadius: '8px', padding: '0.6rem' }}
            >
              Proceed to Login
            </button>
          </div>
        </div>
      ) : (
        /* Standard Forms */
        <form onSubmit={roleTab === 'Parent' ? handleParentAuth : handleTeacherAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Parent Form Fields */}
          {roleTab === 'Parent' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Parent Phone Number <span className="required-star">*</span></label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  autoComplete="tel"
                  required
                />
              </div>

              {!isLoginMode && (
                <div className="form-group">
                  <label>Student Aadhaar Card Number <span className="required-star">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter student's 12-digit Aadhaar number"
                    value={parentAadhaar}
                    onChange={(e) => setParentAadhaar(e.target.value.replace(/\D/g, ''))}
                    maxLength={12}
                    autoComplete="off"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Password <span className="required-star">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showParentPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowParentPassword(!showParentPassword)}
                    title={showParentPassword ? "Hide password" : "Show password"}
                  >
                    {showParentPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isLoginMode && (
                <div className="form-group">
                  <label>Confirm Password <span className="required-star">*</span></label>
                  <div className="password-input-wrapper">
                    <input
                      type={showParentConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={parentConfirmPassword}
                      onChange={(e) => setParentConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowParentConfirmPassword(!showParentConfirmPassword)}
                      title={showParentConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showParentConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Teacher Form Fields */}
          {roleTab === 'Teacher' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isLoginMode ? (
                <div className="form-group">
                  <label>Teachers/Principal ID <span className="required-star">*</span></label>
                  <input
                    type="text"
                    placeholder="E.g., TCH-58291"
                    value={teacherIdInput}
                    onChange={(e) => setTeacherIdInput(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  ℹ️ A unique Teachers/Principal ID number will be generated for you automatically upon registration.
                </div>
              )}

              <div className="form-group">
                <label>{isLoginMode ? 'Password' : 'Create Unique Password'} <span className="required-star">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showTeacherPassword ? 'text' : 'password'}
                    placeholder={isLoginMode ? 'Enter password' : 'Enter unique password'}
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                    title={showTeacherPassword ? "Hide password" : "Show password"}
                  >
                    {showTeacherPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center' }}
          >
            {loading ? (
              <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255, 255, 255, 0.1)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            ) : isLoginMode ? (
              'Log In'
            ) : (
              roleTab === 'Teacher' ? 'Generate ID & Register' : 'Create Parents Login'
            )}
          </button>

          {/* Toggle Login/Signup option */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {isLoginMode ? "Don't have an account? " : 'Already registered? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setSuccess('');
                setGeneratedTeacherId('');
                setParentPassword('');
                setParentConfirmPassword('');
                setTeacherPassword('');
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
            >
              {isLoginMode ? 'Create New ID' : 'Log In here'}
            </button>
          </div>
        </form>
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

export default AuthScreen;
