import React from 'react';

const HowTo = () => {
  return (
    <section className="section" id="how" style={{ background: 'var(--glass-1)' }}>
      <div className="container">
        <div className="section-label animate">How It Works</div>
        <h2 className="section-title animate d1">Three steps to perfect audio</h2>
        <div className="steps-row">
          <div className="step-card animate d1">
            <div className="step-title">Install Extension</div>
            <div className="step-desc">Click "Add to Chrome" - free, zero config. Works immediately on every website with HTML5 media.</div>
          </div>
          <div className="step-card animate d2">
            <div className="step-title">Click the Icon</div>
            <div className="step-desc">Open VolumeIQ from the toolbar. See the VU ring, slider, presets, and all audio settings for the current site.</div>
          </div>
          <div className="step-card animate d3">
            <div className="step-title">Adjust & Forget</div>
            <div className="step-desc">Set your preferred volume. VolumeIQ remembers it per site. Next visit - your volume is already applied.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowTo;
