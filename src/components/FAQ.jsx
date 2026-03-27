import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "Is VolumeIQ free?", a: "Yes, completely free with all features. Optional patron themes support development but are purely cosmetic." },
    { q: "Does it collect my data?", a: "No. Zero analytics, zero tracking, zero servers. All data stays in your browser's local storage and optional Chrome Sync." },
    { q: "Will boosting above 100% damage speakers?", a: "The boost amplifies the browser's audio signal, not system volume. Use the Safe Volume feature to set a cap for hearing protection." },
    { q: "Does it work on Netflix / Spotify?", a: "DRM sites work at up to 100%. Boost, normalization require non-DRM audio. Per-site memory, mute, and mixer work on all sites." },
    { q: "How is this different from other volume boosters?", a: "Most boosters just amplify. VolumeIQ offers per-tab mixing, normalization, per-site memory, smart ducking, keyboard shortcuts, and a premium UI - all with zero data collection." },
    { q: "Can I export / import settings?", a: "Yes. Settings → Data → Export downloads a JSON file. Import on another device to restore everything." }
  ];

  return (
    <section className="section" id="faq" style={{ background: 'var(--glass-1)' }}>
      <div className="container">
        <div className="section-label animate">FAQ</div>
        <h2 className="section-title animate d1">Common Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {faq.q}
              </div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
