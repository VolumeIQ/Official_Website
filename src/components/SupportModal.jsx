import React, { useState, useEffect } from 'react';
import './SupportModal.css';

const SupportModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in the last 7 days
    const lastDismissed = localStorage.getItem('viq_support_modal_dismissed');
    const now = Date.now();
    
    if (lastDismissed) {
      const diff = now - parseInt(lastDismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (diff < sevenDays) {
        setDismissed(true);
        return;
      }
    }

    // Show after 8 seconds for new/returning users
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('viq_support_modal_dismissed', Date.now().toString());
  };

  const patreonLink = "https://www.patreon.com/c/404_Found/membership";

  if (!isVisible || dismissed) return null;

  return (
    <div className="sm-overlay">
      <div className="sm-glass-card animate-in">
        <button className="sm-close-x" onClick={handleDismiss} aria-label="Close">✕</button>
        
        <div className="sm-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        
        <h3 className="sm-title">Support VolumeIQ</h3>
        
        <p className="sm-desc">
          VolumeIQ is crafted by a <span className="highlight">solo developer</span> and remains free of ads and tracking. 
          If you enjoy the extension, please consider supporting its development on Patreon to help keep the project alive and unlock exclusive themes.
        </p>

        <div className="sm-actions">
          <a href={patreonLink} target="_blank" rel="noopener noreferrer" className="sm-btn-primary">
            Become a Patron
          </a>
          <button className="sm-btn-text" onClick={handleDismiss}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
