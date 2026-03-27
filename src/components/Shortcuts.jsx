import React from 'react';

const Shortcuts = () => {
  return (
    <section className="section" id="shortcuts">
      <div className="container">
        <div className="section-label animate">Keyboard Shortcuts</div>
        <h2 className="section-title animate d1">Power user controls</h2>
        <p className="section-desc animate d2">All shortcuts use Alt+Shift. Customizable in Chrome settings.</p>
        <div className="shortcut-grid">
          <div className="shortcut-item animate"><span className="sc-label">Volume Up</span><div className="sc-keys"><span className="sc-key">Alt</span><span class="sc-key">Shift</span><span class="sc-key">↑</span></div></div>
          <div className="shortcut-item animate d1"><span className="sc-label">Volume Down</span><div className="sc-keys"><span className="sc-key">Alt</span><span class="sc-key">Shift</span><span class="sc-key">↓</span></div></div>
          <div className="shortcut-item animate d2"><span className="sc-label">Toggle Mute</span><div className="sc-keys"><span className="sc-key">Alt</span><span class="sc-key">Shift</span><span class="sc-key">M</span></div></div>
          <div className="shortcut-item animate d3"><span className="sc-label">Reset to 100%</span><div className="sc-keys"><span className="sc-key">Alt</span><span class="sc-key">Shift</span><span class="sc-key">R</span></div></div>
        </div>
      </div>
    </section>
  );
};

export default Shortcuts;
