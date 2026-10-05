import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      {/* Header Panel */}
      <header className="header">
        <div className="logo-container">
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
      </header>

      {/* Main Content: Direct Admissions Dashboard */}
      <main style={{ flex: 1, marginTop: '1.5rem' }}>
        <AdminDashboard />
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
          &copy; {new Date().getFullYear()} KLE's BCA P. C. Jabin Science College Hubballi.
        </p>
      </footer>
    </div>
  );
}
