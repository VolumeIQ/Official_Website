import React from 'react';

const Support = () => {
  return (
    <section className="patron-section" id="support">
      <div className="container">
        <div className="patron-card animate">
          <div className="section-label">Contact Me</div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>Get in Touch</h2>
          <p className="section-desc" style={{ margin: '0 auto 24px', textAlign: 'center' }}>
            VolumeIQ is free, ad-free, and collects zero data. Your support keeps it alive and unlocks exclusive themes.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <a
              href="mailto:404found1347@gmail.com"
              className="btn-primary"
              style={{
                color: '#f3f3f3',
                fontSize: '15px',
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 4px 24px rgba(59, 130, 246, 0.2)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Me - 404found1347@gmail.com
            </a>
            <a
              href="https://www.youtube.com/@404-Found/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ padding: '14px 32px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
              </svg>
              YouTube Channel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
