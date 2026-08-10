import React from 'react';
import ContactUs from './ContactUs';

const CollegeHome = ({ onStartAdmission, onCheckStatus }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Welcome Card */}
      <div className="card animate-scale-in" style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120px', height: '120px', background: 'var(--color-primary)', filter: 'blur(70px)', borderRadius: '50%', opacity: 0.25 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '120px', height: '120px', background: 'var(--color-secondary)', filter: 'blur(70px)', borderRadius: '50%', opacity: 0.25 }}></div>

        {/* Circular Logo graphic in hero */}
        <div 
          className="animate-float"
          style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.08)', 
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem auto',
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
          fontSize: '2.5rem', 
          fontWeight: '800', 
          lineHeight: '1.2', 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Welcome to KLE's BCA P. C. Jabin Science College Hubballi
        </h1>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', justifySelf: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={onStartAdmission}
            style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            📝 Start Admission Form
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onCheckStatus}
            style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            🔍 Check Application Status
          </button>
        </div>
      </div>

      {/* Feature Grid Section */}
      <h2 style={{ 
        fontSize: '1.4rem', 
        fontWeight: '700', 
        color: 'white', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        marginBottom: '1.5rem',
        textAlign: 'center',
        marginTop: '3.5rem'
      }}>
        How it Works
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Feature Card 1 */}
        <div className="card animate-slide-up delay-1" style={{ padding: '2rem', marginBottom: 0, opacity: 0 }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📂</div>
          <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '0.5rem', fontWeight: '700' }}>1. Submit Application</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Fill in your personal, guardian, and academic details. Upload required certificates (Aadhaar, PUC, SSLC, Signatures) directly from your device.
          </p>
        </div>

        {/* Feature Card 2 */}
        <div className="card animate-slide-up delay-2" style={{ padding: '2rem', marginBottom: 0, opacity: 0 }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '0.5rem', fontWeight: '700' }}>2. Teachers/Principal Verification</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            The college admissions desk reviews your credentials. Real-time in-app status logs provide direct verification progress notes to parents.
          </p>
        </div>

        {/* Feature Card 3 */}
        <div className="card animate-slide-up delay-3" style={{ padding: '2rem', marginBottom: 0, opacity: 0 }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🖨️</div>
          <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '0.5rem', fontWeight: '700' }}>3. Print Admission Card</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Upon approval, retrieve and download your printable provisional admission card directly online. Proceed to college for fee payments.
          </p>
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
