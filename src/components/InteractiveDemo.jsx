import React, { useState, useEffect, useRef } from 'react';

const InteractiveDemo = () => {
  const [vol, setVol] = useState(100);
  const [muted, setMuted] = useState(false);
  const [normActive, setNormActive] = useState(false);
  const canvasRef = useRef(null);

  // Volume slider gradient and color
  const getSliderStyle = () => {
    const pct = vol / 600;
    let color = '#22d3a0';
    if (vol > 100) color = '#fbbf24';
    if (vol > 200) color = '#f97316';
    if (vol > 400) color = '#ef4444';
    
    return {
      background: `linear-gradient(to right, ${color} left/${pct * 100}% 100% no-repeat, rgba(255, 255, 255, 0.06)`,
      color: color
    };
  };

  const sliderStyle = getSliderStyle();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, 130, 130);
      const cx = 65, cy = 65, R = 55, sa = Math.PI * 0.75, ta = Math.PI * 1.5;
      
      // Base Arc
      ctx.beginPath();
      ctx.arc(cx, cy, R, sa, sa + ta);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Progress Arc
      const pct = Math.min(vol / 600, 1);
      const va = ta * pct;
      if (va > 0) {
        const ex = cx + R * Math.cos(sa + va);
        const ey = cy + R * Math.sin(sa + va);
        const g = ctx.createLinearGradient(cx + R * Math.cos(sa), cy + R * Math.sin(sa), ex, ey);
        g.addColorStop(0, '#22d3a0');
        g.addColorStop(0.38, '#f59e0b');
        g.addColorStop(0.72, '#f97316');
        g.addColorStop(1, '#ef4444');
        
        ctx.beginPath();
        ctx.arc(cx, cy, R, sa, sa + va);
        ctx.strokeStyle = g;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Fake EQ bars
      const now = Date.now();
      for (let i = 0; i < 10; i++) {
        const h = muted ? 2 : Math.max(3, 12 * Math.abs(Math.sin(now / 300 + i * 0.7)) * Math.min(vol / 200, 1));
        const x = cx - 27 + i * 6;
        ctx.beginPath(); 
        ctx.moveTo(x, cy + 12); 
        ctx.lineTo(x, cy + 12 - h);
        ctx.strokeStyle = `rgba(234, 179, 8, ${muted ? 0.1 : 0.3 + Math.sin(now / 200 + i) * 0.3})`;
        ctx.lineWidth = 2.5; 
        ctx.lineCap = 'round'; 
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [vol, muted]);

  return (
    <div className="sim-frame" id="sim-frame">
      <div className="sim-hdr">
        <div className="sim-hdr-left">
          <img src="/assets/logo.svg" alt="" className="sim-hdr-logo" />
          <span className="sim-hdr-site">youtube.com</span>
        </div>
        <div className="sim-hdr-pills">
          {vol > 100 && <span className="sim-hdr-pill sim-pill-boost">{vol}%</span>}
          {normActive && <span className="sim-hdr-pill sim-pill-norm">NORM</span>}
        </div>
        <div className="sim-hdr-gear">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
      </div>
      <div className="sim-body">
        <div className="sim-vol-card">
          <div className="sim-ring">
            <canvas ref={canvasRef} width="130" height="130"></canvas>
            <div className="sim-ring-center">
              <span className="sim-ring-num" style={{color: sliderStyle.color}}>{vol}</span>
              <span className="sim-ring-pct">%</span>
              {vol > 100 && <span className="sim-ring-badge">BOOST</span>}
            </div>
          </div>
          <div className="sim-slider-wrap">
            <input 
              type="range" 
              className="sim-slider" 
              min="0" max="600" step="1" 
              value={vol} 
              onChange={(e) => setVol(parseInt(e.target.value))}
              style={{
                '--vol-pct': `${(vol/600)*100}%`,
                '--vol-color': sliderStyle.color,
              }}
            />
            <div className="sim-marks"><span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span><span>600</span></div>
          </div>
          <div className="sim-ctl">
            <button className={`sim-mute-btn ${muted ? 'muted' : ''}`} onClick={() => setMuted(!muted)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {!muted && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
              </svg>
              <span>{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <div className="sim-presets">
              {[50, 75, 100, 150, 200].map(v => (
                <div key={v} className={`sim-chip ${vol === v ? 'active' : ''}`} onClick={() => setVol(v)}>{v}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="sim-acc">
          <div className="sim-acc-hdr">
            <div className="sim-acc-left">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg> 
              Audio Settings
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div className="sim-feat-row">
            <div><div className="sim-feat-name">Normalize Audio</div></div>
            <div className={`sim-toggle ${normActive ? 'on' : ''}`} onClick={() => setNormActive(!normActive)}></div>
          </div>
          <div className="sim-feat-row">
            <div><div className="sim-feat-name">Smart Ducking</div><div className="sim-feat-sub">Lower background tabs</div></div>
            <div className="sim-toggle on"></div>
          </div>
          <div className="sim-feat-row">
            <div><div className="sim-feat-name">Remember this site</div></div>
            <div className="sim-toggle on"></div>
          </div>
        </div>
        <div className="sim-acc">
          <div className="sim-acc-hdr">
            <div className="sim-acc-left">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> 
              Tab Mixer <span className="sim-mixer-badge">3 tabs</span>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div className="sim-mixer-body">
            <div className="sim-mix-item"><div className="sim-mix-dot" style={{background:'var(--acc-h)'}}></div><span className="sim-mix-name">YouTube - Lo-fi Beats</span><span className="sim-mix-vol">150%</span><div className="sim-mix-mute"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></div></div>
            <div className="sim-mix-item"><div className="sim-mix-dot" style={{background:'var(--grn)'}}></div><span className="sim-mix-name">Spotify - Podcast</span><span className="sim-mix-vol">80%</span><div className="sim-mix-mute"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></div></div>
            <div className="sim-mix-item"><div className="sim-mix-dot" style={{background:'var(--t3)'}}></div><span className="sim-mix-name">Twitch - Live Stream</span><span className="sim-mix-vol" style={{color:'#f87171'}}>MUT</span><div className="sim-mix-mute" style={{color:'#f87171', borderColor:'rgba(239,68,68,0.22)', background:'rgba(239,68,68,0.08)'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg></div></div>
          </div>
        </div>
        <div className="sim-footer"><span>All settings & shortcuts</span><span>Export</span><span>Import</span></div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
