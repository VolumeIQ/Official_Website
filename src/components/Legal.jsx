import React from 'react';

export const Privacy = ({ onBack }) => (
  <div className="legal-page container" id="privacy-page">
    <h1>Privacy Policy</h1><p className="legal-updated">Last updated: March 2026</p>
    <h2>Overview</h2><p>VolumeIQ is committed to protecting your privacy. This policy explains what data the Extension accesses and how it's used.</p>
    <h2>Data Collection</h2><p><strong>VolumeIQ collects zero personal data.</strong></p>
    <ul><li>No analytics or usage data</li><li>No cookies or tracking</li><li>No external server communication</li><li>No browsing history access beyond active tab hostname</li><li>No personally identifiable information</li></ul>
    <h2>Data Stored Locally</h2><p>Stored locally using Chrome storage APIs:</p>
    <ul><li><strong>Site preferences:</strong> hostname + volume level</li><li><strong>Settings:</strong> normalization, ducking, theme, presets</li><li><strong>Session state:</strong> per-tab volume/mute (cleared on tab close)</li></ul>
    <p>Chrome Sync may sync settings across devices through your Google account. VolumeIQ has no access to your Google account.</p>
    <h2>Permissions</h2>
    <ul><li><strong>"Access data on all websites"</strong> - Injects audio processing script. Only interacts with &lt;audio&gt;/&lt;video&gt; elements.</li><li><strong>"tabs"</strong> - Tab Mixer feature.</li><li><strong>"storage"</strong> - Save preferences.</li><li><strong>"favicon"</strong> - Display site icons.</li></ul>
    <h2>Third-Party Services</h2><p>Zero third-party services, SDKs, or analytics. No ads, no telemetry.</p>
    <h2>Data Deletion</h2><p>Delete all data: Settings → Data → "Reset All Data", or uninstall the Extension.</p>
    <h2>Contact</h2><p><a href="mailto:404found1347@gmail.com">404found1347@gmail.com</a></p>
    <p style={{ marginTop: '32px' }}><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>← Back to home</a></p>
  </div>
);

export const Terms = ({ onBack }) => (
  <div className="legal-page container" id="terms-page">
    <h1>Terms of Service</h1><p className="legal-updated">Last updated: March 2026 </p>
    <h2>Acceptance</h2><p>By installing VolumeIQ, you agree to these Terms. If you disagree, uninstall the Extension.</p>
    <h2>Service</h2><p>VolumeIQ is a free browser extension for audio control in Google Chrome. Operates entirely within your browser.</p>
    <h2>License</h2><p>Freeware for personal or commercial use. You may not reverse-engineer, redistribute outside Chrome Web Store, or use to circumvent DRM.</p>
    <h2>Donor Themes</h2><p>Optional cosmetic themes unlocked via patron codes. Non-refundable, non-transferable, visual only.</p>
    <h2>Disclaimer</h2><p>Provided "as is" without warranties. Not liable for hearing damage from excessive volume - use Safe Volume feature.</p>
    <h2>DRM</h2><p>Respects DRM protections. Boost disabled on encrypted media sites. Does not bypass content protection.</p>
    <h2>Contact</h2><p><a href="mailto:404found1347@gmail.com">404found1347@gmail.com</a></p>
    <p style={{ marginTop: '32px' }}><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>← Back to home</a></p>
  </div>
);
