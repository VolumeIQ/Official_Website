import React from 'react';

const Footer = ({ onShowMain, onShowPage }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/assets/logo.svg" alt="" width="20" height="20" style={{ marginRight: '8px', opacity: 0.8 }} />
            <span className="footer-brand-name">VolumeIQ</span>
          </div>
          <div className="footer-links">
            <a href="#features" className="footer-link" onClick={(e) => { e.preventDefault(); onShowMain(); document.getElementById('features')?.scrollIntoView({behavior: 'smooth'}); }}>Features</a>
            <a href="#faq" className="footer-link" onClick={(e) => { e.preventDefault(); onShowMain(); document.getElementById('faq')?.scrollIntoView({behavior: 'smooth'}); }}>FAQ</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onShowPage('privacy'); }}>Privacy Policy</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onShowPage('terms'); }}>Terms</a>
            <a href="mailto:404found1347@gmail.com" className="footer-link">Contact</a>
            <a href="https://www.youtube.com/@404-Found/videos" target="_blank" rel="noopener noreferrer" className="footer-link" title="YouTube Channel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
              </svg>
            </a>
            <a href="https://www.patreon.com/c/404_Found/membership" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: '#ef4444', fontWeight: 700 }}>Support Us</a>
          </div>
          <div className="footer-copy">© 2026 VolumeIQ. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
