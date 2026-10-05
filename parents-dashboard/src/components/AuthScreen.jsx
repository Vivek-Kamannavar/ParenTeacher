import React, { useState } from 'react';

const AuthScreen = ({ onLoginSuccess, targetRole }) => {
  const [roleTab, setRoleTab] = useState(targetRole || 'Parent'); // 'Parent' or 'Teacher'
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Parent inputs
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
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

  // Forgot password states
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Request OTP, 2: Verify OTP & Reset
  const [forgotInputKey, setForgotInputKey] = useState('');
  const [forgotParentEmail, setForgotParentEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [simulationOtpHint, setSimulationOtpHint] = useState('');
  const [forgotTeacherId, setForgotTeacherId] = useState('');
  const [forgotSecurityQuestionAnswer, setForgotSecurityQuestionAnswer] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  // Password complexity helper
  const validateClientPassword = (pwd) => {
    if (!pwd || pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter (A-Z).';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter (a-z).';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one digit (0-9).';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) return 'Password must contain at least one special character (!@#$%^&*).';
    return null;
  };

  // Handler to request Email OTP for Parent Forgot Password
  const handleRequestParentOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSimulationOtpHint('');

    if (!forgotInputKey.trim()) {
      setError('Please enter registered Parent Phone Number or Parent Email Address.');
      return;
    }

    setLoading(true);
    try {
      const isEmailInput = forgotInputKey.includes('@');
      const payload = isEmailInput 
        ? { parentEmail: forgotInputKey.trim() } 
        : { parentPhone: forgotInputKey.trim() };

      const res = await fetch('/api/auth/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch OTP email');

      setSuccess(data.message || 'OTP dispatched to parent email.');
      setForgotParentEmail(data.parentEmail || forgotInputKey);
      if (data.simulationOtp) {
        setSimulationOtpHint(data.simulationOtp);
      }
      setForgotStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler to verify 6-digit Email OTP before moving to New Password page (Step 2)
  const handleVerifyParentOtpOnly = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotOtp) {
      setError('Please enter the 6-digit verification OTP.');
      return;
    }
    if (forgotOtp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/verify-otp-only', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: forgotParentEmail,
          parentPhone: forgotInputKey,
          otp: forgotOtp.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      setSuccess('✓ OTP verified successfully! Please set your new password below.');
      setForgotStep(3); // Redirect to next page: Enter New Password
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler to update parent password on Step 3
  const handleSetNewParentPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotNewPassword || !forgotConfirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passErr = validateClientPassword(forgotNewPassword);
    if (passErr) {
      setError(passErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: forgotParentEmail,
          parentPhone: forgotInputKey,
          otp: forgotOtp.trim(),
          newPassword: forgotNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed');

      setSuccess(data.message || 'Password reset successful! Please log in below.');
      setIsForgotPasswordMode(false);
      setIsLoginMode(true);
      setForgotStep(1);
      setForgotInputKey('');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setSimulationOtpHint('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotTeacherPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotTeacherId || !forgotSecurityQuestionAnswer || !forgotNewPassword || !forgotConfirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passErr = validateClientPassword(forgotNewPassword);
    if (passErr) {
      setError(passErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: forgotTeacherId,
          securityQuestionAnswer: forgotSecurityQuestionAnswer,
          newPassword: forgotNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      setSuccess(data.message || 'Password reset successful! Please log in.');
      setIsForgotPasswordMode(false);
      setIsLoginMode(true);
      
      setTeacherIdInput(forgotTeacherId);
      setForgotTeacherId('');
      setForgotSecurityQuestionAnswer('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      const passErr = validateClientPassword(parentPassword);
      if (passErr) {
        setError(passErr);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/register/parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentPhone: parentPhone,
            phone: parentPhone,
            parentEmail: parentEmail,
            studentEmail: studentEmail,
            studentPhone: studentPhone,
            parentAadhaar: parentAadhaar,
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
      const passErr = validateClientPassword(teacherPassword);
      if (passErr) {
        setError(passErr);
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

  const renderPasswordRules = (pwd) => {
    const rules = [
      { label: '8+ Chars', ok: pwd.length >= 8 },
      { label: 'Uppercase (A-Z)', ok: /[A-Z]/.test(pwd) },
      { label: 'Lowercase (a-z)', ok: /[a-z]/.test(pwd) },
      { label: 'Digit (0-9)', ok: /[0-9]/.test(pwd) },
      { label: 'Special Char (!@#$...)', ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd) }
    ];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.6rem', marginTop: '0.4rem', fontSize: '0.72rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
        {rules.map((r, idx) => (
          <span key={idx} style={{ color: r.ok ? '#10b981' : 'var(--text-muted)', fontWeight: r.ok ? '700' : '400', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            {r.ok ? '✓' : '○'} {r.label}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="card animate-scale-in" style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          {isForgotPasswordMode 
            ? (forgotStep === 3 ? 'Set New Password 🔑' : (forgotStep === 2 ? 'Verify OTP 🔒' : 'Reset Password')) 
            : (isLoginMode ? 'Login' : 'Create Account')}
        </h3>
        <p className="card-subtitle" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
          {isForgotPasswordMode 
            ? (forgotStep === 1 
                ? 'Request verification OTP to your parent email' 
                : (forgotStep === 2 
                    ? 'Verify the 6-digit OTP sent to parent email' 
                    : 'Create a strong new password for your account'))
            : (isLoginMode ? 'Enter credentials to access your portal' : 'Create a new login account')}
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {success && !generatedTeacherId && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          {success}
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
      ) : isForgotPasswordMode ? (
        /* Forgot Password Form */
        <form onSubmit={roleTab === 'Parent' ? (forgotStep === 1 ? handleRequestParentOtp : forgotStep === 2 ? handleVerifyParentOtpOnly : handleSetNewParentPassword) : handleForgotTeacherPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {roleTab === 'Parent' ? (
            forgotStep === 1 ? (
              /* Parent Forgot Password Step 1: Request Email OTP */
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  📧 Enter your registered <strong>Parent Email Address</strong> or <strong>Parent Mobile Number</strong>. We will send a 6-digit verification OTP to your email.
                </div>

                <div className="form-group">
                  <label>Parent Email or Phone Number <span className="required-star">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter registered parent email or phone"
                    value={forgotInputKey}
                    onChange={(e) => setForgotInputKey(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center' }}
                >
                  {loading ? 'Sending OTP Email...' : 'Send Email Verification OTP 📧'}
                </button>
              </div>
            ) : forgotStep === 2 ? (
              /* Parent Forgot Password Step 2: Enter & Verify OTP */
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {simulationOtpHint && (
                  <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--color-primary-hover)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--color-primary-hover)', textAlign: 'center', fontWeight: 'bold' }}>
                    ⚡ Demo Simulation OTP Code: <code>{simulationOtpHint}</code>
                  </div>
                )}

                <div className="form-group">
                  <label>6-Digit Email Verification OTP <span className="required-star">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    style={{ letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center' }}
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP 🔒'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setError('');
                      setSuccess('');
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer' }}
                  >
                    ← Change Email / Resend OTP
                  </button>
                </div>
              </div>
            ) : (
              /* Parent Forgot Password Step 3: Redirected to Enter New Password */
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>New Password <span className="required-star">*</span></label>
                  <div className="password-input-wrapper">
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    >
                      {showForgotNewPassword ? (
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
                  {renderPasswordRules(forgotNewPassword)}
                </div>

                <div className="form-group">
                  <label>Confirm New Password <span className="required-star">*</span></label>
                  <div className="password-input-wrapper">
                    <input
                      type={showForgotConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                    >
                      {showForgotConfirmPassword ? (
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center' }}
                >
                  {loading ? 'Updating Password...' : 'Update Password 🔐'}
                </button>
              </div>
            )
          ) : (
            /* Teacher Forgot Password Form */
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Teachers/Principal ID <span className="required-star">*</span></label>
                <input
                  type="text"
                  placeholder="E.g., TCH-58291"
                  value={forgotTeacherId}
                  onChange={(e) => setForgotTeacherId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Security Verification: What is the name of your college? <span className="required-star">*</span></label>
                <input
                  type="text"
                  placeholder="Enter college name (e.g. Jabin)"
                  value={forgotSecurityQuestionAnswer}
                  onChange={(e) => setForgotSecurityQuestionAnswer(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password <span className="required-star">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  >
                    {showForgotNewPassword ? (
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
                {renderPasswordRules(forgotNewPassword)}
              </div>
              <div className="form-group">
                <label>Confirm New Password <span className="required-star">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showForgotConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                  >
                    {showForgotConfirmPassword ? (
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center' }}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsForgotPasswordMode(false);
                setForgotStep(1);
                setError('');
                setSuccess('');
                setForgotInputKey('');
                setForgotOtp('');
                setForgotTeacherId('');
                setForgotSecurityQuestionAnswer('');
                setForgotNewPassword('');
                setForgotConfirmPassword('');
                setSimulationOtpHint('');
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
            >
              Back to Login
            </button>
          </div>
        </form>
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
                  placeholder="Enter 10-digit parent mobile number"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  autoComplete="tel"
                  required
                />
              </div>

              {!isLoginMode && (
                <>
                  <div className="form-group">
                    <label>Parent Email Address <span className="required-star">*</span></label>
                    <input
                      type="email"
                      placeholder="Enter parent email (used for OTP reset)"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Student Email Address <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span></label>
                    <input
                      type="email"
                      placeholder="Enter student's email address"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Student Phone Number <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span></label>
                    <input
                      type="tel"
                      placeholder="Enter student's 10-digit mobile number"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                    />
                  </div>

                  <div className="form-group">
                    <label>Parent Aadhaar Card Number <span className="required-star">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter parent's 12-digit Aadhaar number"
                      value={parentAadhaar}
                      onChange={(e) => setParentAadhaar(e.target.value.replace(/\D/g, ''))}
                      maxLength={12}
                      autoComplete="off"
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Password <span className="required-star">*</span></label>
                  {isLoginMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordMode(true);
                        setError('');
                        setSuccess('');
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
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
                {!isLoginMode && renderPasswordRules(parentPassword)}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>{isLoginMode ? 'Password' : 'Create Unique Password'} <span className="required-star">*</span></label>
                  {isLoginMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordMode(true);
                        setError('');
                        setSuccess('');
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
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
                {!isLoginMode && renderPasswordRules(teacherPassword)}
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
