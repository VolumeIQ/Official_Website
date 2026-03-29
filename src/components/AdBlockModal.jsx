import React, { useState, useEffect } from 'react';
import './AdBlockModal.css';

const AdBlockModal = () => {
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Basic ad-blocker detection
    const detectAdBlock = async () => {
      try {
        const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        // If it was blocked, fetch might throw or response might be empty depending on the blocker
      } catch (error) {
        setIsAdBlockActive(true);
        // Delay showing the modal for better UX
        setTimeout(() => setIsVisible(true), 2500);
      }
    };

    // Another method: Check if an ad script failed to load
    const checkScript = () => {
      if (!window.adsbygoogle || window.adsbygoogle.loaded === false) {
        setIsAdBlockActive(true);
        setTimeout(() => setIsVisible(true), 2500);
      }
    };

    detectAdBlock();
    // Re-check after a short delay to allow scripts to load
    setTimeout(checkScript, 3000);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  if (!isAdBlockActive || !isVisible || dismissed) return null;

  return (
    <div className="ab-overlay">
      <div className="ab-glass-card animate-in">
        <div className="ab-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M12 16" />
          </svg>
        </div>
        
        <h3 className="ab-title">Supporting Development</h3>
        
        <p className="ab-desc">
          VolumeIQ is crafted by a <span className="highlight"><a href="https://www.youtube.com/@404-Found" target="_blank" rel="noopener noreferrer">solo developer</a></span> and thrives on your support. 
          If you enjoy the extension, please consider disabling your ad blocker for this site. 
        </p>

        <strong>
          We know ads can be distracting, so the choice is entirely yours. ❤️
        </strong>

        <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '12px' }}>
          <a href="https://www.youtube.com/@404-Found" target="_blank" rel="noopener noreferrer" className="link-orange">
            Check out my YouTube channel
          </a>
        </div>

        <div className="ab-actions">
          <button className="ab-btn-primary" onClick={() => window.location.reload()}>
            I've Disabled It
          </button>
          <button className="ab-btn-text" onClick={handleDismiss}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBlockModal;
