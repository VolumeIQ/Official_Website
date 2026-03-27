import React from 'react';

const Support = () => {
  return (
    <section className="patron-section" id="support">
      <div className="container">
        <div className="patron-card animate">
          <div className="section-label">Support Development</div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>Built by a solo developer</h2>
          <p className="section-desc" style={{ margin: '0 auto 24px', textAlign: 'center' }}>
            VolumeIQ is free, ad-free, and collects zero data. Your support keeps it alive and unlocks exclusive themes.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <a
              href="https://www.patreon.com/c/404_Found/membership"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                color: '#f3f3f3',
                fontSize: '15px',
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #ef4444, #e34949)',
                boxShadow: '0 4px 24px rgba(239, 68, 68, 0.2)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Become a Patron
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
