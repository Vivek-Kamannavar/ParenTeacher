import React from 'react';

const ContactUs = () => {
  return (
    <div className="card animate-scale-in contact-card-wrapper" style={{ maxWidth: '700px', margin: '2rem auto', overflow: 'hidden', position: 'relative' }}>
      {/* Decorative cyber corner highlights */}
      <div className="scanner-corner corner-tl"></div>
      <div className="scanner-corner corner-tr"></div>
      <div className="scanner-corner corner-bl"></div>
      <div className="scanner-corner corner-br"></div>
      
      <h2 className="card-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2.5rem', fontWeight: '800' }}>
        Contact Information
      </h2>

      <div className="contact-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Our Address */}
        <div className="contact-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div className="contact-icon-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>
              Our Address
            </h4>
            <p style={{ fontSize: '1.05rem', color: 'white', fontWeight: '700', lineHeight: '1.5' }}>
              KLE Society’s Bachelor of Computer Application (BCA) P.C.Jabin Science College Campus, Vidyanagar Hubballi.
            </p>
          </div>
        </div>

        {/* Hours Of Operation */}
        <div className="contact-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div className="contact-icon-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>
              Hours Of Operation
            </h4>
            <p style={{ fontSize: '1.05rem', color: 'white', fontWeight: '700', lineHeight: '1.5' }}>
              Mon - Sat: 9.00am to 5.00pm
            </p>
          </div>
        </div>

        {/* Contact Numbers and Email with Tel Redirect */}
        <div className="contact-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div className="contact-icon-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>
                Office Phone (Tap to Call)
              </h4>
              <a 
                href="tel:+918362372298" 
                style={{ fontSize: '1.15rem', color: 'var(--color-primary-hover)', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                📞 0836-237-2298
              </a>
            </div>
            
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>
                Mobile Number (Tap to Call)
              </h4>
              <a 
                href="tel:+919353000805" 
                style={{ fontSize: '1.15rem', color: 'var(--color-primary-hover)', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                📱 +91 9353000805
              </a>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>
                E-Mail
              </h4>
              <a href="mailto:infodesk@klebcahubli.in" style={{ fontSize: '1.15rem', color: 'var(--color-primary-hover)', fontWeight: '700', textDecoration: 'none' }}>
                ✉️ infodesk@klebcahubli.in
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Official Handles */}
        <div className="contact-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div className="contact-icon-circle" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>
              Official Social Profiles
            </h4>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/klesbcahubballi/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.85rem 1.1rem',
                background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(168,85,247,0.1))',
                border: '1px solid rgba(236,72,153,0.3)',
                borderRadius: '12px',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📸</span>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#f472b6', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Instagram</span>
                  <span style={{ fontSize: '0.95rem', color: 'white', fontWeight: '700' }}>klesbcahubballi</span>
                </div>
              </div>
              <span style={{ color: '#f472b6', fontWeight: '700' }}>Follow ↗</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/klesbcahubballi/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.85rem 1.1rem',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.1))',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '12px',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>💼</span>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>LinkedIn</span>
                  <span style={{ fontSize: '0.88rem', color: 'white', fontWeight: '700' }}>KLE'S BCA, P C Jabin Science College, HUBBALLI</span>
                </div>
              </div>
              <span style={{ color: '#60a5fa', fontWeight: '700' }}>Connect ↗</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/klesbcahubli"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.85rem 1.1rem',
                background: 'linear-gradient(135deg, rgba(24,119,242,0.1), rgba(99,102,241,0.1))',
                border: '1px solid rgba(24,119,242,0.3)',
                borderRadius: '12px',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📘</span>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Facebook</span>
                  <span style={{ fontSize: '0.88rem', color: 'white', fontWeight: '700' }}>KLE Society's BCA, P C J Sc College, Hubballi</span>
                </div>
              </div>
              <span style={{ color: '#38bdf8', fontWeight: '700' }}>Visit Page ↗</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
