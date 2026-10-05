import React from 'react';
import ContactUs from './ContactUs';

const CollegeHome = ({ onStartAdmission, onCheckStatus }) => {

  return (
    <div className="animate-fade-in">
      {/* Hero Welcome Header Card */}
      <div className="card animate-scale-in" style={{ 
        textAlign: 'center', 
        padding: '3rem 2rem', 
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        {/* Decorative blur elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120px', height: '120px', background: 'var(--color-primary)', filter: 'blur(70px)', borderRadius: '50%', opacity: 0.25 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '120px', height: '120px', background: 'var(--color-secondary)', filter: 'blur(70px)', borderRadius: '50%', opacity: 0.25 }}></div>

        {/* Circular Logo graphic */}
        <div 
          className="animate-float"
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.08)', 
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.25rem auto',
            padding: '6px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}
        >
          <img 
            src="https://tse2.mm.bing.net/th/id/OIP.vxH6bxBOpwhVrPCAy5BZcgHaHX?r=0&pid=Api&P=0&h=180" 
            alt="KLE Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
          />
        </div>

        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '800', 
          lineHeight: '1.25', 
          marginBottom: '0.5rem', 
          background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          KLE's BCA P. C. Jabin Science College Hubballi
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Autonomous • CPE Phase III • Accredited at A Grade by NAAC
        </p>
      </div>

      {/* Dual Portals Grid Layout with Enhanced Hover Animations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'stretch',
        marginBottom: '3rem'
      }}>
        {/* Left Portal: Parents & Admission Services */}
        <div className="card portal-hero-card left-portal-card animate-slide-up delay-1" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem',
          margin: 0,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="portal-icon-badge" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                👨‍👩‍👦
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary-hover)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student & Parent Portal</span>
                <h3 style={{ fontSize: '1.3rem', color: 'white', fontWeight: '800', margin: 0 }}>Freshman Admissions 2026</h3>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              Parents and candidate students can fill out the online admission form or check application status using student Aadhaar details.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              className="btn btn-primary btn-portal-primary" 
              onClick={onStartAdmission}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '10px', justifyContent: 'center' }}
            >
              📝 Start Admission Form
            </button>
            <button 
              className="btn btn-secondary btn-portal-secondary" 
              onClick={onCheckStatus}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '10px', justifyContent: 'center' }}
            >
              🔍 Check Application Status
            </button>
          </div>
        </div>

        {/* Right Card: Admission Guidelines & Checklist */}
        <div className="card portal-hero-card right-portal-card animate-slide-up delay-2" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem',
          margin: 0,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="portal-icon-badge" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                🎓
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Documents</span>
                <h3 style={{ fontSize: '1.3rem', color: 'white', fontWeight: '800', margin: 0 }}>Admission Checklist</h3>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              Please keep scanned copies of the following documents ready before filling out the form:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <div className="checklist-hover-item">
                <span className="check-icon">✓</span>
                <span>Student & Parent Aadhaar Card copies</span>
              </div>
              <div className="checklist-hover-item">
                <span className="check-icon">✓</span>
                <span>SSLC & PUC II Statement of Marks</span>
              </div>
              <div className="checklist-hover-item">
                <span className="check-icon">✓</span>
                <span>Income & Caste Certificate (if applicable)</span>
              </div>
              <div className="checklist-hover-item">
                <span className="check-icon">✓</span>
                <span>Digital Passport Photo & Signature</span>
              </div>
            </div>
          </div>

          <a 
            href="tel:+918362372259" 
            className="support-desk-hover-pill"
          >
            <span style={{ color: '#93c5fd', fontSize: '0.88rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="support-phone-icon">📞</span> Admissions Support Desk: +91 836 237 2259
            </span>
          </a>
        </div>
      </div>

      {/* Feature Grid Section - "HOW IT WORKS" Interactive Fan/Spread Deck */}
      <div className="how-it-works-section animate-slide-up delay-3">
        <div className="how-it-works-header-box">
          <div className="how-it-works-badge">
            <span>✨ Interactive Guide • Hover to Spread Steps</span>
          </div>
          <h2 className="how-it-works-title">
            How It Works
          </h2>
        </div>

        {/* Interactive Step Cards Deck */}
        <div className="how-it-works-deck">
          <div className="how-it-works-flow-line"></div>

          {/* Step 1 */}
          <div className="how-it-works-card step-1">
            <span className="step-number-badge">Step 01</span>
            <div className="step-icon-circle" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              📂
            </div>
            <h3 className="step-card-title">1. Submit Application</h3>
            <p className="step-card-desc">
              Fill in personal, guardian, and academic details. Upload required certificates (Aadhaar, PUC, SSLC, Signatures) directly online.
            </p>
          </div>

          {/* Step 2 */}
          <div className="how-it-works-card step-2">
            <span className="step-number-badge">Step 02</span>
            <div className="step-icon-circle" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
              ⚡
            </div>
            <h3 className="step-card-title">2. Teachers/Principal Verification</h3>
            <p className="step-card-desc">
              The college admissions desk reviews your credentials. Real-time in-app status logs provide direct verification progress notes to parents.
            </p>
          </div>

          {/* Step 3 */}
          <div className="how-it-works-card step-3">
            <span className="step-number-badge">Step 03</span>
            <div className="step-icon-circle" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
              🖨️
            </div>
            <h3 className="step-card-title">3. Print Admission Card</h3>
            <p className="step-card-desc">
              Upon approval, retrieve and download your printable provisional admission card directly online. Proceed to college for fee payments.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div style={{ marginTop: '4.5rem' }}>
        <ContactUs />
      </div>
    </div>
  );
};

export default CollegeHome;
