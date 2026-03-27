import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center',
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <div className="hero-bg-orb hero-orb-1" style={{ opacity: 0.3 }}></div>
      <div className="hero-bg-orb hero-orb-2" style={{ opacity: 0.2 }}></div>

      <div className="animate channel-logo-wrapper float-anim" style={{ marginBottom: '48px' }}>
        <a href="https://www.youtube.com/@404-Found/videos" target="_blank" rel="noopener noreferrer">
          <img 
            src="/assets/404found_channel.jpg" 
            alt="404 Found Logo" 
            style={{ 
              width: '220px', 
              height: '220px', 
              borderRadius: '50%', 
              border: '4px solid var(--acc-bdr)',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 2
            }} 
            className="pulse-glow"
          />
        </a>
      </div>
      
      <div className="animate d1">
        <h1 className="hero-title glitch-anim" style={{ 
          fontSize: 'clamp(50px, 12vw, 100px)', 
          marginBottom: '16px',
          letterSpacing: '-2px'
        }}>
          404 Found
        </h1>
      </div>
      
      <p className="section-desc animate d2" style={{ 
        marginBottom: '48px', 
        fontSize: '22px', 
        color: 'var(--t1)',
        fontWeight: 500,
        maxWidth: '100%'
      }}>
        We Found The Channel You Looking For
      </p>
      
      <div className="animate d3" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="https://www.youtube.com/@404-Found/videos" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '18px 48px', fontSize: '17px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}>
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
          </svg>
          Go to YouTube Channel
        </a>
        <Link to="/" className="btn-ghost" style={{ padding: '18px 48px', fontSize: '17px' }}>
          Back to Website
        </Link>
      </div>

      {/* Decorative dots/elements */}
      <div className="animate d4" style={{ marginTop: '64px', opacity: 0.4 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--acc)' }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
