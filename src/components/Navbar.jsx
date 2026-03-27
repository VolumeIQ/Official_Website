import React, { useState, useEffect } from 'react';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
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
        <Link to="/" className="nav-brand" onClick={handleNavClick}>
          <img src="/assets/logo.svg" alt="VolumeIQ Logo" className="nav-logo" />
          <span className="nav-name">VolumeIQ</span>
        </Link>
        
        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink smooth to="/#features" className="nav-link" onClick={handleNavClick}>Features</NavLink>
          <NavLink smooth to="/#how" className="nav-link" onClick={handleNavClick}>How It Works</NavLink>
          <NavLink smooth to="/#shortcuts" className="nav-link" onClick={handleNavClick}>Shortcuts</NavLink>
          <NavLink smooth to="/#support" className="nav-link" onClick={handleNavClick}>Contact</NavLink>
          <NavLink smooth to="/#faq" className="nav-link" onClick={handleNavClick}>FAQ</NavLink>
          <a href="https://chromewebstore.google.com/detail/YOUR_EXTENSION_ID" target="_blank" rel="noopener noreferrer" className="nav-cta">Add to Chrome</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
