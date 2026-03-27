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
            <a href="mailto:404found1347@gmail.com" className="footer-link">
              404found1347@gmail.com
            </a>
            <a href="https://www.youtube.com/@404-Found/videos" target="_blank" rel="noopener noreferrer" className="footer-link" title="YouTube Channel">
              YouTube Channel
            </a>
            <a href="https://www.patreon.com/c/404_Found/membership" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: '#ef4444', fontWeight: 700 }}>
              Donate
            </a>
          </div>
          <div className="footer-copy">© 2026 VolumeIQ. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
