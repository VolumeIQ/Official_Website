import React from 'react';

const Features = () => {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-label animate">Features</div>
        <h2 className="section-title animate d1">Everything you need<br />for perfect audio</h2>
        <p className="section-desc animate d2">No more fumbling with system volume or browser tabs.</p>
        <div className="features-grid">
          <div className="feature-card animate">
            <div className="fc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--acc-h)" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>
            <div className="fc-title">Volume Boost - 600%</div>
            <div className="fc-desc">Go beyond the browser's 100% limit. Amplify quiet videos, podcasts, and music using Web Audio API gain processing.</div>
          </div>
          <div className="feature-card animate d1">
            <div className="fc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--acc-h)" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><circle cx="8" cy="6" r="2" fill="var(--acc-h)" stroke="none" />
                <line x1="4" y1="12" x2="20" y2="12" /><circle cx="16" cy="12" r="2" fill="var(--acc-h)" stroke="none" />
                <line x1="4" y1="18" x2="20" y2="18" /><circle cx="10" cy="18" r="2" fill="var(--acc-h)" stroke="none" />
              </svg>
            </div>
            <div className="fc-title">Tab Mixer</div>
            <div className="fc-desc">Independent volume sliders for every open tab. Mute, solo, play/pause, and mix tabs like a professional audio console.</div>
          </div>
          <div className="feature-card animate d2">
            <div className="fc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--acc-h)" strokeWidth="2">
                <path d="M2 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <div className="fc-title">Audio Normalization</div>
            <div className="fc-desc">Automatically balances loud and quiet audio in real-time using RMS analysis. No more volume jumps between content.</div>
          </div>
          <div className="feature-card animate d3">
            <div className="fc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--acc-h)" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
              </svg>
            </div>
            <div className="fc-title">Per-Site Memory</div>
            <div className="fc-desc">Remembers volume for each website automatically. YouTube at 150%, Netflix at 80% - set once, applied forever.</div>
            <span className="fc-badge new">Auto-Save</span>
          </div>
          <div className="feature-card animate d4">
            <div className="fc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--acc-h)" strokeWidth="2">
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            </div>
            <div className="fc-title">Smart Audio Ducking</div>
            <div className="fc-desc">When you switch tabs, background tabs automatically lower their volume. Your active content always takes priority.</div>
            <span className="fc-badge new">New</span>
          </div>
          <div className="feature-card animate">
            <div className="fc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <circle cx="13.5" cy="6.5" r="2.5" /><path d="M17 2H2v20h20V7" />
              </svg>
            </div>
            <div className="fc-title">Donor Themes</div>
            <div className="fc-desc">Unlock exclusive visual themes like Cyberpunk Neon and Matrix Terminal. Full UI color overhaul, not just a tint.</div>
            <span className="fc-badge donor">Patron</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
