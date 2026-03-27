import React from 'react';
import InteractiveDemo from './InteractiveDemo';
import { EXTENSION_LINK } from '../constants';

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-orb hero-orb-1"></div>
      <div className="hero-bg-orb hero-orb-2"></div>
      <div className="container">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge animate">Free Chrome Extension - Zero Data Collection</div>
            <h1 className="hero-title animate d1">Total Audio<br />Control for<br /><span>Every Tab</span></h1>
            <p className="hero-desc animate d2">Boost volume up to 600%, normalize loud & quiet audio automatically, and mix every tab independently - like a pro audio console for your browser.</p>
            <div className="hero-actions animate d3">
              <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Add to Chrome - Free
              </a>
              <a href="#features" className="btn-ghost">See Features</a>
            </div>
            <div className="hero-stats animate d4">
              <div><div className="hero-stat-num">600%</div><div className="hero-stat-label">Max Volume</div></div>
              <div><div className="hero-stat-num">0</div><div className="hero-stat-label">Data Collected</div></div>
              <div><div className="hero-stat-num">∞</div><div className="hero-stat-label">Tabs Supported</div></div>
            </div>
          </div>
          <div className="hero-visual animate d2">
            <InteractiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
