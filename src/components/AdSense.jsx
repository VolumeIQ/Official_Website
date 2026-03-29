import React, { useEffect } from 'react';

/**
 * Reusable AdSense Component
 * @param {string} slot - The Ad slot ID
 * @param {string} format - 'auto', 'fluid', etc. (default: 'auto')
 * @param {boolean} responsive - Is it responsive (default: true)
 * @param {object} style - Custom styling
 */
const AdSense = ({ slot, format = 'auto', responsive = true, style = {} }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // In development, this will often fail - that's okay
      console.warn("AdSense logic skipped or blocked.");
    }
  }, []);

  // Placeholder style for development / empty state
  const isDev = window.location.hostname === 'localhost';

  return (
    <div className="ad-window" style={{ 
      margin: '4rem auto', 
      maxWidth: '1100px',
      background: 'var(--bg-mid)',
      borderRadius: 'var(--r-lg)',
      border: '1px solid var(--border-normal)',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      ...style 
    }}>
      {/* macOS Style Header */}
      <div className="ad-header" style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Traffic Lights */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', opacity: 0.8 }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', opacity: 0.8 }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', opacity: 0.8 }}></div>
        </div>

        {/* Title */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '11px',
          fontWeight: '600',
          fontFamily: 'var(--f-mono)',
          color: 'var(--t3)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Sponsored Advertisement
        </div>

        {/* Spacer for symmetry */}
        <div style={{ width: '42px' }}></div>
      </div>

      <div className="ad-content" style={{ padding: '24px' }}>
        {/* Rounded Card Placeholder for development */}
        <div className="ad-placeholder" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--r-md)',
          border: '1px dashed var(--border-strong)',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--t3)',
          fontSize: '12px',
          fontFamily: 'var(--f-mono)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          display: isDev || !slot.includes('_') ? 'block' : 'none'
        }}>
           Slot: {slot}
        </div>
        
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '300px', minHeight: '100px' }}
          data-ad-client="ca-pub-5588485767645567"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default AdSense;
