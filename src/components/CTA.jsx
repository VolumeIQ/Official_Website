import React from 'react';
import { EXTENSION_LINK } from '../constants';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card animate">
          <div className="section-label">Ready?</div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Take control of your audio</h2>
          <p className="section-desc" style={{ margin: '0 auto 32px', textAlign: 'center' }}>
            Free forever. No account needed. Works on every website.
          </p>
          <a
            href={EXTENSION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '16px', padding: '16px 40px' }}
          >
            Add to Chrome - Free
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
