import React, { useState, useEffect, useRef, useCallback } from 'react';

const InteractiveDemo = () => {
  // --- Simulation & UI State ---
  const [vol, setVol] = useState(100);
  const [muted, setMuted] = useState(false);
  const [normActive, setNormActive] = useState(false);
  const [duckingActive, setDuckingActive] = useState(true);
  const [rememberActive, setRememberActive] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const [tabs, setTabs] = useState([
    { id: 1, name: 'YouTube - Lo-fi Beats', vol: 150, muted: false, color: '#eab308' },
    { id: 2, name: 'Spotify - Podcast', vol: 80, muted: false, color: '#22d3a0' },
    { id: 3, name: 'Twitch - Live Stream', vol: 0, muted: true, color: '#94a3af' }
  ]);

  // --- Animation Refs ---
  const cursorRef = useRef({ x: 200, y: 350 });
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 350 });
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const muteBtnRef = useRef(null);
  const normToggleRef = useRef(null);
  const duckingToggleRef = useRef(null);
  const rememberToggleRef = useRef(null);
  const volPercentRef = useRef(null);
  const tabRefs = useRef({});
  const tabMuteRefs = useRef({});

  // Helper for scale-aware relative positioning
  const getRel = useCallback((el) => {
    if (!el || !containerRef.current) return { x: 0, y: 0, w: 0, h: 0 };
    const r = el.getBoundingClientRect();
    const c = containerRef.current.getBoundingClientRect();
    const s = c.width / 400; // Original width is 400px
    return {
      x: (r.left - c.left) / s,
      y: (r.top - c.top) / s,
      w: r.width / s,
      h: r.height / s
    };
  }, []);

  const stateRef = useRef('IDLE');
  const targetPosRef = useRef({ x: 200, y: 350 });
  const startPosRef = useRef({ x: 200, y: 350 });
  const progressRef = useRef(0);
  const actionTargetRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const nextActionDelayRef = useRef(2000);

  const stopAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      setIsTyping(false);
      stateRef.current = 'STOPPED';
    }
  }, [isAutoPlaying]);

  const resumeAutoPlay = useCallback(() => {
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
      stateRef.current = 'IDLE';
      lastUpdateRef.current = Date.now();
      nextActionDelayRef.current = 2000;
    }
  }, [isAutoPlaying]);

  // Ultra-Smooth Easing
  const easeInOutQuint = (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

  const getVolColor = (v) => {
    if (v > 400) return '#ef4444';
    if (v > 200) return '#f97316';
    if (v > 100) return '#fbbf24';
    return '#22d3a0';
  };

  // --- SIMULATION LOOP ---
  useEffect(() => {
    if (!isAutoPlaying) return;
    let animId;
    
    const tick = () => {
      const now = Date.now();
      const cont = containerRef.current;
      if (!cont) return;

      if (stateRef.current === 'IDLE') {
        if (now - lastUpdateRef.current > nextActionDelayRef.current) {
          const r = Math.random();
          let el = null;
          
          if (r < 0.2) { el = sliderRef.current; actionTargetRef.current = 'main-slider'; }
          else if (r < 0.35) { el = muteBtnRef.current; actionTargetRef.current = 'main-mute'; }
          else if (r < 0.45) { el = normToggleRef.current; actionTargetRef.current = 'norm'; }
          else if (r < 0.55) { el = duckingToggleRef.current; actionTargetRef.current = 'duck'; }
          else if (r < 0.65) { el = rememberToggleRef.current; actionTargetRef.current = 'remember'; }
          else if (r < 0.85) {
            const tid = tabs[Math.floor(Math.random() * tabs.length)].id;
            el = tabRefs.current[`tab-${tid}`];
            actionTargetRef.current = { type: 'tab-click', id: tid };
          } else { el = volPercentRef.current; actionTargetRef.current = 'type'; }

          if (el) {
            const rel = getRel(el);
            
            // Adjust for tab items: target the mute button specifically
            let tx = rel.x;
            let ty = rel.y;
            let tw = rel.w;
            let th = rel.h;

            if (actionTargetRef.current && typeof actionTargetRef.current === 'object' && actionTargetRef.current.type === 'tab-click') {
              const muteEl = tabMuteRefs.current[`mute-${actionTargetRef.current.id}`];
              if (muteEl) {
                const mRel = getRel(muteEl);
                tx = mRel.x; ty = mRel.y; tw = mRel.w; th = mRel.h;
              }
            }
            
            startPosRef.current = { ...cursorRef.current };
            targetPosRef.current = { 
              x: tx + tw / 2 - 5.5, 
              y: ty + th / 2 - 3.2 
            };
            progressRef.current = 0; 
            stateRef.current = 'MOVING';
          }
        }
      } 
      else if (stateRef.current === 'MOVING') {
        progressRef.current += 0.0018;
        if (progressRef.current >= 1) { 
          progressRef.current = 1; 
          stateRef.current = 'ACTION'; 
        }
        
        const t = easeInOutQuint(progressRef.current);
        const curX = startPosRef.current.x + (targetPosRef.current.x - startPosRef.current.x) * t;
        const curY = startPosRef.current.y + (targetPosRef.current.y - startPosRef.current.y) * t;
        
        // Gentle realistic curve
        const dist = Math.hypot(targetPosRef.current.x - startPosRef.current.x, targetPosRef.current.y - startPosRef.current.y);
        const arcAmt = Math.min(dist * 0.15, 25);
        const arc = Math.sin(progressRef.current * Math.PI) * arcAmt;
        const nx = curX + (startPosRef.current.x < targetPosRef.current.x ? arc/3 : -arc/3);
        const ny = curY - arc;
        
        cursorRef.current = { x: nx, y: ny };
        setCursorPos({ x: nx, y: ny });
      }
      else if (stateRef.current === 'ACTION') {
        const act = actionTargetRef.current;
        if (act === 'main-mute') setMuted(m => !m);
        else if (act === 'norm') setNormActive(n => !n);
        else if (act === 'duck') setDuckingActive(d => !d);
        else if (act === 'remember') setRememberActive(r => !r);
        else if (act === 'track') { /* logic placeholder */ }
        else if (act === 'main-slider') {
          stateRef.current = 'SLIDING'; progressRef.current = 0; startPosRef.current = { ...cursorRef.current };
          const el = sliderRef.current;
          const rel = getRel(el);
          const tVol = [60, 140, 220, 380, 450, 520][Math.floor(Math.random() * 6)];
          targetPosRef.current = { 
            x: rel.x + (tVol / 600) * rel.w - 5.5, 
            y: rel.y + rel.h / 2 - 3.2 
          };
          actionTargetRef.current = { type: 'main-slide', tVol };
        } else if (act === 'type') {
          stateRef.current = 'TYPING'; setIsTyping(true); const newVal = [120, 200, 320, 450][Math.floor(Math.random()*4)];
          const tStr = newVal.toString(); setVol(0); let i = 0;
          const tInt = setInterval(() => {
            setVol(parseInt(tStr.substring(0, i + 1)) || 0); i++;
            if (i >= tStr.length) { clearInterval(tInt); setTimeout(() => { setIsTyping(false); stateRef.current = 'IDLE'; lastUpdateRef.current = Date.now(); nextActionDelayRef.current = 2500; }, 2000); }
          }, 350); return;
        } else if (act && act.type === 'tab-click') {
           const tid = act.id;
           setTabs(prev => prev.map(t => t.id === tid ? { ...t, muted: !t.muted, vol: t.muted ? (t.id === 1 ? 150 : 80) : 0 } : t));
        }
        
        if (stateRef.current !== 'SLIDING') {
          stateRef.current = 'IDLE'; 
          lastUpdateRef.current = Date.now(); 
          nextActionDelayRef.current = 2000 + Math.random() * 800;
        }
      }
      else if (stateRef.current === 'SLIDING') {
        progressRef.current += 0.0015; // Slow human-like drag
        const t = easeInOutQuint(progressRef.current);
        const curX = startPosRef.current.x + (targetPosRef.current.x - startPosRef.current.x) * t;
        const curY = startPosRef.current.y + (targetPosRef.current.y - startPosRef.current.y) * t;
        cursorRef.current = { x: curX, y: curY }; setCursorPos({ x: curX, y: curY });
        
        const el = sliderRef.current;
        const rel = getRel(el);
        const rx = (curX + 5.5 - rel.x) / rel.w;
        setVol(Math.max(0, Math.min(600, Math.round(rx * 600)))); 
        
        if (progressRef.current >= 1) { 
          stateRef.current = 'IDLE'; 
          lastUpdateRef.current = Date.now(); 
          nextActionDelayRef.current = 2500; 
        }
      }
      if (stateRef.current !== 'STOPPED') animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isAutoPlaying, tabs]);

  // --- CANVAS EQ & RING RENDER ---
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
    let aId; const draw = () => {
      ctx.clearRect(0, 0, 130, 130);
      const cx = 65, cy = 65, R = 55, sa = Math.PI * 0.75, ta = Math.PI * 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, sa, sa + ta); ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
      const pct = Math.min(vol / 600, 1);
      const va = ta * pct;
      if (va > 0) {
        const ex = cx + R * Math.cos(sa + va); const ey = cy + R * Math.sin(sa + va);
        const g = ctx.createLinearGradient(cx + R * Math.cos(sa), cy + R * Math.sin(sa), ex, ey);
        g.addColorStop(0, '#22d3a0'); g.addColorStop(0.38, '#f59e0b'); g.addColorStop(0.72, '#f97316'); g.addColorStop(1, '#ef4444');
        ctx.beginPath(); ctx.arc(cx, cy, R, sa, sa + va); ctx.strokeStyle = g; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
      }
      const now = Date.now();
      for (let i = 0; i < 10; i++) {
        const h = muted ? 2 : Math.max(3, 12 * Math.abs(Math.sin(now / 300 + i * 0.7)) * Math.min(vol / 200, 1));
        const x = cx - 27 + i * 6;
        ctx.beginPath(); ctx.moveTo(x, cy + 12); ctx.lineTo(x, cy + 12 - h);
        ctx.strokeStyle = `rgba(234, 179, 8, ${muted ? 0.1 : 0.3 + Math.sin(now / 200 + i) * 0.3})`;
        ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
      }
      aId = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(aId);
  }, [vol, muted]);

  return (
    <div 
      className="sim-frame" 
      ref={containerRef} 
      onMouseMove={(e) => { if (Math.abs(e.movementX) > 6 || Math.abs(e.movementY) > 6) stopAutoPlay(); }}
      onMouseLeave={resumeAutoPlay}
      onClick={stopAutoPlay} 
      style={{ scale: "0.9", transformOrigin: 'top center', position: 'relative' }}
    >
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
      
      {/* Simulation Mouse */}
      {isAutoPlaying && (
        <div style={{ position: 'absolute', left: `${cursorPos.x}px`, top: `${cursorPos.y}px`, zIndex: 1000, pointerEvents: 'none', filter: 'drop-shadow(2px 5px 12px rgba(0,0,0,0.6))' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.2">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.83-4.83 3.3 5.3c.12.2.33.31.55.31.1 0 .2-.02.29-.07l2.1-1.21c.25-.15.35-.48.2-.74l-3.3-5.3 6.64-.58c.32-.03.48-.41.27-.64L6.35 2.85a.5.5 0 0 0-.85.36z"/>
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="sim-hdr">
        <div className="sim-hdr-left">
          <img src="/assets/logo.svg" alt="" className="sim-hdr-logo" />
          <span className="sim-hdr-site">VolumeIQ</span>
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
            <div className="sim-ring-center" ref={volPercentRef}>
              <span className="sim-ring-num" style={{ color: getVolColor(vol) }}>{vol}{isTyping && <span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid' }}></span>}</span>
              <span className="sim-ring-pct">%</span>
              {vol > 100 && <span className="sim-ring-badge">BOOST</span>}
            </div>
          </div>
          <div className="sim-slider-wrap">
            <input 
              ref={sliderRef}
              type="range" 
              className="sim-slider" 
              min="0" max="600" step="1" 
              value={vol} 
              onChange={(e) => setVol(parseInt(e.target.value))}
              style={{
                '--vol-pct': `${(vol/600)*100}%`,
                '--vol-color': getVolColor(vol),
              }}
            />
            <div className="sim-marks"><span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span><span>600</span></div>
          </div>
          <div className="sim-ctl">
            <button ref={muteBtnRef} className={`sim-mute-btn ${muted ? 'muted' : ''}`} onClick={() => setMuted(!muted)}>
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
          <div className="sim-feat-row" onClick={() => setNormActive(!normActive)}>
            <div><div className="sim-feat-name">Normalize Audio</div></div>
            <div ref={normToggleRef} className={`sim-toggle ${normActive ? 'on' : ''}`}></div>
          </div>
          <div className="sim-feat-row" onClick={() => setDuckingActive(!duckingActive)}>
            <div><div className="sim-feat-name">Smart Ducking</div><div className="sim-feat-sub">Lower background tabs</div></div>
            <div ref={duckingToggleRef} className={`sim-toggle ${duckingActive ? 'on' : ''}`}></div>
          </div>
          <div className="sim-feat-row" onClick={() => setRememberActive(!rememberActive)}>
            <div><div className="sim-feat-name">Remember this site</div></div>
            <div ref={rememberToggleRef} className={`sim-toggle ${rememberActive ? 'on' : ''}`}></div>
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
            {tabs.map(tab => (
              <div 
                key={tab.id} 
                className="sim-mix-item" 
                ref={el => tabRefs.current[`tab-${tab.id}`] = el}
                onClick={() => setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, muted: !t.muted, vol: t.muted ? (t.id === 1 ? 150 : 80) : 0 } : t))}
              >
                <div className="sim-mix-dot" style={{ background: tab.color }}></div>
                <span className="sim-mix-name">{tab.name}</span>
                <span className="sim-mix-vol" style={{ color: tab.muted ? '#ef4444' : (tab.vol > 100 ? '#ebb308' : '#fff') }}>
                  {tab.muted ? 'MUT' : `${tab.vol}%`}
                </span>
                <div className="sim-mix-mute" ref={el => tabMuteRefs.current[`mute-${tab.id}`] = el} style={tab.muted ? { color: '#f87171', borderColor: 'rgba(239,68,68,0.22)', background: 'rgba(239,68,68,0.08)' } : {}}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    {!tab.muted ? <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/> : <><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>}
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sim-footer">
          <span>All settings & shortcuts</span>
          <span>Export</span>
          <span>Import</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
