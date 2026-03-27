import React, { useState, useEffect } from 'react';

const Navbar = ({ onShowMain, onShowPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    onShowMain();
  };

  return (
    <nav 
      className="nav" 
      style={{
        background: scrolled ? 'rgba(4, 4, 10, 0.92)' : 'rgba(4, 4, 10, 0.75)',
        borderBottomColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)'
      }}
    >
      <div className="nav-inner">
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); onShowMain(); }}>
          <img src="/assets/logo.svg" alt="VolumeIQ Logo" className="nav-logo" />
          <span className="nav-name">VolumeIQ</span>
        </a>
        
        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => handleNavClick('features')}>Features</a>
          <a href="#how" className="nav-link" onClick={() => handleNavClick('how')}>How It Works</a>
          <a href="#shortcuts" className="nav-link" onClick={() => handleNavClick('shortcuts')}>Shortcuts</a>
          <a href="#support" className="nav-link" onClick={() => handleNavClick('support')}>Contact</a>
          <a href="#faq" className="nav-link" onClick={() => handleNavClick('faq')}>FAQ</a>
          <a href="https://chromewebstore.google.com/detail/YOUR_EXTENSION_ID" target="_blank" rel="noopener noreferrer" className="nav-cta">Add to Chrome</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
