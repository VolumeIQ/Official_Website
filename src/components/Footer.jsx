import React from 'react';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/assets/logo.svg" alt="" width="20" height="20" style={{ marginRight: '8px', opacity: 0.8 }} />
            <span className="footer-brand-name">VolumeIQ</span>
          </div>
          <div className="footer-links">
            <NavLink smooth to="/#features" className="footer-link">Features</NavLink>
            <NavLink smooth to="/#how" className="footer-link">How It Works</NavLink>
            <NavLink smooth to="/#faq" className="footer-link">FAQ</NavLink>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
            <a href="mailto:404found1347@gmail.com" className="footer-link">
              Email Me
            </a>
            <a href="https://www.youtube.com/@404-Found/videos" target="_blank" rel="noopener noreferrer" className="footer-link" title="YouTube Channel">
              YouTube Channel
            </a>
          </div>
          <div className="footer-copy">© 2026 VolumeIQ. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
