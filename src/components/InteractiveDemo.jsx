import React, { useState, useEffect, useRef, useCallback } from 'react';

const InteractiveDemo = () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [vol, setVol] = useState(100);
  const [muted, setMuted] = useState(false);
  const [normActive, setNormActive] = useState(false);
  const [monoActive, setMonoActive] = useState(false);
  const [duckingActive, setDuckingActive] = useState(false);
  const [duckLevel, setDuckLevel] = useState(20);
  const [rememberActive, setRememberActive] = useState(true);
  const [isGlobal, setIsGlobal] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [hoveredEl, setHoveredEl] = useState(null);
  const [scenarioLabel, setScenarioLabel] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mixerOpen, setMixerOpen] = useState(false);

  const [tabs, setTabs] = useState([
    { id: 1, name: 'YouTube - Lo-fi Beats',  vol: 150, muted: false, playing: true,  icon: '🎵', isSolo: false, isGlobal: false },
    { id: 2, name: 'Spotify - Podcast',       vol: 80,  muted: false, playing: true,  icon: '🎙️', isSolo: false, isGlobal: true },
    { id: 3, name: 'Twitch - Live Stream',    vol: 100, muted: true,  playing: false, icon: '🎮', isSolo: false, isGlobal: false },
  ]);

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const containerRef   = useRef(null);
  const canvasRef      = useRef(null);
  const cursorRef      = useRef({ x: 200, y: 100 });
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 100 });

  // Element refs
  const elRefs = useRef({});
  const setElRef = useCallback((key) => (el) => { elRefs.current[key] = el; }, []);

  // Animation state
  const stateRef          = useRef('IDLE');
  const targetPosRef      = useRef({ x: 200, y: 100 });
  const startPosRef       = useRef({ x: 200, y: 100 });
  const progressRef       = useRef(0);
  const actionRef         = useRef(null);
  const lastActionRef     = useRef(Date.now());
  const scenarioIdxRef    = useRef(0);
  const microJitterRef    = useRef({ x: 0, y: 0 });
  const hoverPauseRef     = useRef(0);
  const speedMultRef      = useRef(1);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getRel = useCallback((el) => {
    if (!el || !containerRef.current) return { x: 0, y: 0, w: 0, h: 0 };
    
    let x = 0, y = 0;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    
    let curr = el;
    while (curr && curr !== containerRef.current) {
      x += curr.offsetLeft;
      y += curr.offsetTop;
      curr = curr.offsetParent;
    }
    
    return { x, y, w, h };
  }, []);

  const getVolColor = (v) => {
    if (v > 800) return '#ef4444'; // Red
    if (v > 500) return '#f97316'; // Orange
    if (v > 200) return '#fbbf24'; // Yellow
    if (v > 100) return '#fbbf24';
    return '#22d3a0'; // Green
  };

  // Improved easing with overshoot for human feel
  const easeHuman = (t) => {
    if (t < 0.7) return 2.04 * t * t; // slow start
    const t2 = (t - 0.7) / 0.3;
    return 1 + Math.sin(t2 * Math.PI) * 0.015; // tiny overshoot then settle
  };

  const easeSmooth = (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // ─── Scenario System ─────────────────────────────────────────────────────
  // Instead of random actions, we tell a story
  const SCENARIOS = [
    {
      label: 'Boosting volume to 200%',
      target: 'slider',
      action: { type: 'slide', toVol: 200 },
      delay: 1500,
    },
    {
      label: 'Trying a preset',
      target: 'preset-400',
      action: { type: 'click-preset', vol: 400 },
      delay: 2000,
    },
    {
      label: 'Enabling normalization',
      target: 'norm-toggle',
      action: { type: 'toggle', key: 'norm' },
      delay: 2500,
    },
    {
      label: 'Using Mono Audio output',
      target: 'mono-toggle',
      action: { type: 'toggle', key: 'mono' },
      delay: 2000,
    },
    {
      label: 'Turning on Smart Ducking',
      target: 'duck-toggle',
      action: { type: 'toggle', key: 'duck' },
      delay: 2000,
    },
    {
      label: 'Adjusting duck level',
      target: 'duck-slider',
      action: { type: 'slide-duck', toLevel: 35 },
      delay: 2000,
    },
    {
      label: 'Muting a background tab',
      target: 'tab-mute-3',
      action: { type: 'tab-mute', id: 3 },
      delay: 2500,
    },
    {
      label: 'Switching to Global mode',
      target: 'mode-toggle',
      action: { type: 'toggle', key: 'global' },
      delay: 2200,
    },
    {
      label: 'Cranking it to 850%',
      target: 'slider',
      action: { type: 'slide', toVol: 850 },
      delay: 1800,
    },
    {
      label: 'Typing exact volume',
      target: 'vol-display',
      action: { type: 'type-vol', vol: 250 },
      delay: 3000,
    },
    {
      label: 'Testing mute',
      target: 'mute-btn',
      action: { type: 'toggle', key: 'mute' },
      delay: 1500,
    },
    {
      label: 'Unmuting',
      target: 'mute-btn',
      action: { type: 'toggle', key: 'mute' },
      delay: 2000,
    },
    {
      label: 'Unmuting Twitch tab',
      target: 'tab-mute-3',
      action: { type: 'tab-mute', id: 3 },
      delay: 2000,
    },
    {
      label: 'Resetting to 100%',
      target: 'preset-100',
      action: { type: 'click-preset', vol: 100 },
      delay: 2500,
    },
    {
      label: 'Disabling normalization',
      target: 'norm-toggle',
      action: { type: 'toggle', key: 'norm' },
      delay: 2000,
    },
  ];

  // ─── Auto/Manual Control ──────────────────────────────────────────────────
  const stopAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      setIsTyping(false);
      setShowHint(false);
      stateRef.current = 'STOPPED';
    }
  }, [isAutoPlaying]);

  const resumeAutoPlay = useCallback(() => {
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
      stateRef.current = 'IDLE';
      lastActionRef.current = Date.now();
    }
  }, [isAutoPlaying]);

  // Hide hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // ─── Simulation Loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAutoPlaying) return;
    let animId;

    const tick = () => {
      const now = Date.now();
      if (!containerRef.current) { animId = requestAnimationFrame(tick); return; }

      // Micro-jitter for human-like idle cursor
      if (stateRef.current === 'IDLE' || stateRef.current === 'HOVER_PAUSE') {
        microJitterRef.current = {
          x: Math.sin(now / 800) * 0.3 + Math.sin(now / 300) * 0.15,
          y: Math.cos(now / 900) * 0.25 + Math.cos(now / 350) * 0.1,
        };
        const jx = cursorRef.current.x + microJitterRef.current.x;
        const jy = cursorRef.current.y + microJitterRef.current.y;
        setCursorPos({ x: jx, y: jy });
      }

      // ── IDLE: Pick next scenario ──
      if (stateRef.current === 'IDLE') {
        const delay = scenarioIdxRef.current === 0 ? 1200 : SCENARIOS[scenarioIdxRef.current - 1]?.delay || 2000;
        if (now - lastActionRef.current > delay) {
          const sc = SCENARIOS[scenarioIdxRef.current % SCENARIOS.length];
          
          // Auto-open accordions if target is inside and close the other one to save space
          if (sc.target.includes('norm') || sc.target.includes('duck') || sc.target.includes('remember')) {
            if (!settingsOpen) { 
              setSettingsOpen(true); 
              setMixerOpen(false); 
              lastActionRef.current = now - delay + 600; 
              return; 
            }
          }
          if (sc.target.includes('tab-mute')) {
            if (!mixerOpen) { 
              setMixerOpen(true); 
              setSettingsOpen(false); 
              lastActionRef.current = now - delay + 600; 
              return; 
            }
          }
          
          // If moving to top section (slider/presets), close everything to stay compact
          if (sc.target === 'slider' || sc.target.startsWith('preset') || sc.target === 'mute-btn') {
            if (settingsOpen || mixerOpen) {
              setSettingsOpen(false);
              setMixerOpen(false);
              lastActionRef.current = now - delay + 400;
              return;
            }
          }

          const el = elRefs.current[sc.target];
          if (el) {
            setScenarioLabel(sc.label);
            const rel = getRel(el);
            startPosRef.current = { ...cursorRef.current };

            // Accurate targeting: aim for center of element
            // We subtract 4,4 because the cursor SVG tip is at 4,4 relative to its 20x20 box
            targetPosRef.current = {
              x: rel.x + rel.w / 2 - 4,
              y: rel.y + rel.h / 2 - 4,
            };

            actionRef.current = sc.action;
            progressRef.current = 0;
            
            const dist = Math.hypot(
              targetPosRef.current.x - startPosRef.current.x,
              targetPosRef.current.y - startPosRef.current.y,
            );
            speedMultRef.current = Math.max(0.5, Math.min(2, dist / 200));

            stateRef.current = 'MOVING';
            setHoveredEl(sc.target);
          } else {
            scenarioIdxRef.current++;
            lastActionRef.current = now;
          }
        }
      }

      // ── MOVING: Smooth cursor travel ──
      else if (stateRef.current === 'MOVING') {
        progressRef.current += 0.0022 / speedMultRef.current;

        if (progressRef.current >= 1) {
          progressRef.current = 1;
          stateRef.current = 'HOVER_PAUSE';
          hoverPauseRef.current = now;
        }

        const t = easeSmooth(Math.min(1, progressRef.current));
        const sx = startPosRef.current.x;
        const sy = startPosRef.current.y;
        const tx = targetPosRef.current.x;
        const ty = targetPosRef.current.y;

        // Natural arc curve
        const dist = Math.hypot(tx - sx, ty - sy);
        const arcHeight = Math.min(dist * 0.12, 20);
        const lateralArc = Math.min(dist * 0.06, 10);

        const baseX = sx + (tx - sx) * t;
        const baseY = sy + (ty - sy) * t;

        // Perpendicular offset for natural curve
        const angle = Math.atan2(ty - sy, tx - sx);
        const perpX = Math.sin(angle) * lateralArc * Math.sin(t * Math.PI);
        const perpY = -Math.cos(angle) * lateralArc * Math.sin(t * Math.PI);
        const archY = -arcHeight * Math.sin(t * Math.PI);

        // Micro tremor during movement
        const tremor = (1 - t) * 0.5;
        const jx = Math.sin(now / 120) * tremor;
        const jy = Math.cos(now / 150) * tremor;

        const nx = baseX + perpX + jx;
        const ny = baseY + perpY + archY + jy;

        cursorRef.current = { x: nx, y: ny };
        setCursorPos({ x: nx, y: ny });
      }

      // ── HOVER_PAUSE: Brief pause before clicking ──
      else if (stateRef.current === 'HOVER_PAUSE') {
        const pauseMs = 180 + Math.random() * 250;
        if (now - hoverPauseRef.current > pauseMs) {
          stateRef.current = 'CLICKING';
          setCursorClicking(true);
          setTimeout(() => setCursorClicking(false), 150);
        }
      }

      // ── CLICKING: Execute action ──
      else if (stateRef.current === 'CLICKING') {
        const act = actionRef.current;

        if (act.type === 'toggle') {
          if (act.key === 'norm') setNormActive(p => !p);
          else if (act.key === 'mono') setMonoActive(p => !p);
          else if (act.key === 'duck') setDuckingActive(p => !p);
          else if (act.key === 'remember') setRememberActive(p => !p);
          else if (act.key === 'mute') setMuted(p => !p);
          else if (act.key === 'global') setIsGlobal(p => !p);
          finishAction();
        }
        else if (act.type === 'click-preset') {
          setVol(act.vol);
          finishAction();
        }
        else if (act.type === 'tab-mute') {
          setTabs(prev => prev.map(t =>
            t.id === act.id ? { ...t, muted: !t.muted, playing: t.muted, vol: t.muted ? (t.id === 1 ? 150 : t.id === 2 ? 80 : 100) : 0 } : t
          ));
          finishAction();
        }
        else if (act.type === 'slide') {
          stateRef.current = 'SLIDING';
          progressRef.current = 0;
          startPosRef.current = { ...cursorRef.current };
          const el = elRefs.current['slider'];
          if (el) {
            const rel = getRel(el);
            targetPosRef.current = {
              x: rel.x + (act.toVol / 1000) * rel.w - 4,
              y: rel.y + rel.h / 2 - 4,
            };
          }
        }
        else if (act.type === 'slide-duck') {
          stateRef.current = 'SLIDING_DUCK';
          progressRef.current = 0;
          startPosRef.current = { ...cursorRef.current };
          const el = elRefs.current['duck-slider'];
          if (el) {
            const rel = getRel(el);
            targetPosRef.current = {
              x: rel.x + ((act.toLevel - 5) / 75) * rel.w - 4,
              y: rel.y + rel.h / 2 - 4,
            };
          }
        }
        else if (act.type === 'type-vol') {
          stateRef.current = 'TYPE_ANIM';
          setIsTyping(true);
          const str = act.vol.toString();
          setVol(0);
          let i = 0;
          const iv = setInterval(() => {
            setVol(parseInt(str.substring(0, i + 1)) || 0);
            i++;
            if (i >= str.length) {
              clearInterval(iv);
              setTimeout(() => {
                setIsTyping(false);
                finishAction();
              }, 1200);
            }
          }, 280);
          return;
        }
        else {
          finishAction();
        }
      }

      // ── SLIDING: Drag slider ──
      else if (stateRef.current === 'SLIDING') {
        progressRef.current += 0.0012;
        const t = easeSmooth(Math.min(1, progressRef.current));
        const cx = startPosRef.current.x + (targetPosRef.current.x - startPosRef.current.x) * t;
        const cy = startPosRef.current.y + (targetPosRef.current.y - startPosRef.current.y) * t;

        // Slider drag tremor
        const jx = Math.sin(Date.now() / 100) * 0.3;
        const jy = Math.cos(Date.now() / 130) * 0.2;

        cursorRef.current = { x: cx + jx, y: cy + jy };
        setCursorPos({ x: cx + jx, y: cy + jy });

        const el = elRefs.current['slider'];
        if (el) {
          const rel = getRel(el);
          const rx = Math.max(0, Math.min(1, (cx + 6 - rel.x) / rel.w));
          setVol(Math.round(rx * 1000));
        }
        if (progressRef.current >= 1) finishAction();
      }

      // ── SLIDING_DUCK: Drag duck slider ──
      else if (stateRef.current === 'SLIDING_DUCK') {
        progressRef.current += 0.0018;
        const t = easeSmooth(Math.min(1, progressRef.current));
        const cx = startPosRef.current.x + (targetPosRef.current.x - startPosRef.current.x) * t;
        const cy = startPosRef.current.y;
        cursorRef.current = { x: cx, y: cy };
        setCursorPos({ x: cx, y: cy });

        const el = elRefs.current['duck-slider'];
        if (el) {
          const rel = getRel(el);
          const rx = Math.max(0, Math.min(1, (cx + 6 - rel.x) / rel.w));
          setDuckLevel(Math.round(5 + rx * 75));
        }
        if (progressRef.current >= 1) finishAction();
      }

      if (stateRef.current !== 'STOPPED' && stateRef.current !== 'TYPE_ANIM') {
        animId = requestAnimationFrame(tick);
      }
    };

    function finishAction() {
      stateRef.current = 'IDLE';
      lastActionRef.current = Date.now();
      scenarioIdxRef.current++;
      setHoveredEl(null);
      setCursorClicking(false);

      // Loop scenarios
      if (scenarioIdxRef.current >= SCENARIOS.length) {
        scenarioIdxRef.current = 0;
      }
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isAutoPlaying, getRel]);

  // ─── Canvas VU Meter ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let aId;

    const draw = () => {
      ctx.clearRect(0, 0, 130, 130);
      const cx = 65, cy = 65, R = 55;
      const sa = Math.PI * 0.75, ta = Math.PI * 1.5;

      // Background track
      ctx.beginPath();
      ctx.arc(cx, cy, R, sa, sa + ta);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Volume arc with gradient
      const pct = Math.min(vol / 1000, 1);
      const va = ta * pct;
      if (va > 0.01) {
        const ex = cx + R * Math.cos(sa + va);
        const ey = cy + R * Math.sin(sa + va);
        const g = ctx.createLinearGradient(
          cx + R * Math.cos(sa), cy + R * Math.sin(sa), ex, ey,
        );
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

      // Frequency bars (12 bands)
      const now = Date.now();
      const barCount = 12;
      const barW = 2.2;
      const gap = 4.5;
      const totalW = barCount * barW + (barCount - 1) * gap;
      const startX = cx - totalW / 2 + barW / 2;

      for (let i = 0; i < barCount; i++) {
        const intensity = muted ? 0.05 : Math.min(vol / 200, 1.5);
        const wave1 = Math.sin(now / (200 + i * 30) + i * 0.8) * 0.5 + 0.5;
        const wave2 = Math.cos(now / (300 + i * 20) + i * 1.2) * 0.3 + 0.5;
        const h = Math.max(2, (wave1 * wave2 * 16 + 2) * intensity);

        const x = startX + i * (barW + gap);
        const alpha = muted ? 0.08 : (0.25 + wave1 * 0.55) * Math.min(intensity, 1);

        ctx.beginPath();
        ctx.moveTo(x, cy + 14);
        ctx.lineTo(x, cy + 14 - h);
        ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
        ctx.lineWidth = barW;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // RMS glow ring (inner)
      if (!muted && vol > 0) {
        const R2 = R - 10;
        const rmsLevel = Math.min(1, (Math.sin(now / 400) * 0.3 + 0.5) * (vol / 200));
        const rmsArc = ta * rmsLevel;
        if (rmsArc > 0.01) {
          ctx.beginPath();
          ctx.arc(cx, cy, R2, sa, sa + rmsArc);
          ctx.strokeStyle = `rgba(234, 179, 8, ${0.08 + rmsLevel * 0.25})`;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Glow dot at end
          const dotAngle = sa + rmsArc;
          const dx = cx + R2 * Math.cos(dotAngle);
          const dy = cy + R2 * Math.sin(dotAngle);
          ctx.beginPath();
          ctx.arc(dx, dy, 2 + rmsLevel * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234, 179, 8, ${0.4 + rmsLevel * 0.5})`;
          ctx.fill();
        }
      }

      aId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(aId);
  }, [vol, muted]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="sim-frame"
      ref={containerRef}
      onMouseMove={(e) => {
        if (Math.abs(e.movementX) > 4 || Math.abs(e.movementY) > 4) stopAutoPlay();
      }}
      onMouseLeave={() => { setTimeout(resumeAutoPlay, 1500); }}
      onClick={stopAutoPlay}
      style={{ scale: '0.9', transformOrigin: 'top center', position: 'relative' }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes demoPulse { 0%,100%{opacity:0.9;transform:scale(1)} 50%{opacity:1;transform:scale(1.03)} }
        @keyframes hintFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes clickRipple { 0%{transform:scale(0.8);opacity:0.6} 100%{transform:scale(2);opacity:0} }
      `}</style>

      {/* ── Interactive Demo Badge ── */}
      <div style={{
        position: 'absolute', top: -25, right: 100,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 16px', borderRadius: 20,
        background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.30)',
        backdropFilter: 'blur(8px)', zIndex: 1001,
        animation: 'demoPulse 3s ease infinite',
        boxShadow: '0 0 20px rgba(234,179,8,0.15)',
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="3">
          <circle cx="12" cy="12" r="4" fill="#fbbf24" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
        <span style={{
          fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 700,
          color: '#fbbf24', letterSpacing: 1.2, textTransform: 'uppercase',
        }}>
          Interactive Demo
        </span>
      </div>

      {/* ── "Take Control" Hint ── */}
      {showHint && isAutoPlaying && (
        <div style={{
          position: 'absolute', bottom: -38, left: '50%', transform: 'translateX(-50%)',
          padding: '6px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)', zIndex: 1001,
          animation: 'hintFloat 2s ease infinite, fadeInUp 0.5s ease',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'IBM Plex Sans', sans-serif" }}>
            👆 Click anywhere to take control
          </span>
        </div>
      )}

      {/* ── Manual Mode Badge ── */}
      {!isAutoPlaying && (
        <div style={{
          position: 'absolute', bottom: -38, left: '50%', transform: 'translateX(-50%)',
          padding: '6px 16px', borderRadius: 12,
          background: 'rgba(34,211,160,0.08)', border: '1px solid rgba(34,211,160,0.20)',
          backdropFilter: 'blur(8px)', zIndex: 1001,
          animation: 'fadeInUp 0.3s ease',
          cursor: 'pointer', whiteSpace: 'nowrap',
        }} onClick={(e) => { e.stopPropagation(); resumeAutoPlay(); }}>
          <span style={{ fontSize: 11, color: '#22d3a0', fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
            ✓ You're in control &nbsp;·&nbsp; <span style={{ opacity: 0.6, fontWeight: 400 }}>Click to resume demo</span>
          </span>
        </div>
      )}



      {/* ── Cursor ── */}
      {isAutoPlaying && (
        <div style={{
          position: 'absolute',
          left: cursorPos.x, top: cursorPos.y,
          zIndex: 1000, pointerEvents: 'none',
          filter: 'drop-shadow(1px 3px 8px rgba(0,0,0,0.5))',
          transition: cursorClicking ? 'transform 0.08s ease' : 'none',
          transform: cursorClicking ? 'scale(0.85)' : 'scale(1)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="rgba(0,0,0,0.4)" strokeWidth="1">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.83-4.83 3.3 5.3c.12.2.33.31.55.31.1 0 .2-.02.29-.07l2.1-1.21c.25-.15.35-.48.2-.74l-3.3-5.3 6.64-.58c.32-.03.48-.41.27-.64L6.35 2.85a.5.5 0 0 0-.85.36z" />
          </svg>
          {/* Click ripple */}
          {cursorClicking && (
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: 12, height: 12, borderRadius: '50%',
              border: '2px solid rgba(234,179,8,0.6)',
              animation: 'clickRipple 0.4s ease forwards',
            }} />
          )}
        </div>
      )}

      {/* ── Header ── */}
      <div className="sim-hdr">
        <div className="sim-hdr-left">
          <img src="/assets/logo.svg" alt="" className="sim-hdr-logo" />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
            youtube.com
          </span>
        </div>
        <div className="sim-hdr-pills">
          {vol > 100 && !muted && (
            <span className="sim-hdr-pill sim-pill-boost">{vol}%</span>
          )}
          {muted && (
            <span className="sim-hdr-pill" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.22)' }}>
              MUTED
            </span>
          )}
          {monoActive && <span className="sim-hdr-pill sim-pill-norm">MONO</span>}
          {normActive && <span className="sim-hdr-pill sim-pill-norm" style={{ borderLeft: 'none' }}>NORM</span>}
          {isGlobal && (
            <span className="sim-hdr-pill sim-pill-boost">GLOBAL</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Mode toggle */}
          <div
            ref={setElRef('mode-toggle')}
            className="sim-hdr-gear"
            onClick={() => setIsGlobal(p => !p)}
            title={isGlobal ? 'Global mode' : 'Per-site mode'}
            style={{ color: isGlobal ? '#fbbf24' : undefined, filter: isGlobal ? 'drop-shadow(0 0 6px rgba(234,179,8,0.4))' : undefined }}
          >
            {isGlobal ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            )}
          </div>
          <div className="sim-hdr-gear">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="sim-body">

        {/* Volume Card */}
        <div className="sim-vol-card" style={{ paddingTop: 14 }}>
          {/* Scenario Label (Integrated) */}
          {isAutoPlaying && scenarioLabel && (
            <div style={{
              padding: '3px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              marginBottom: 12,
              animation: 'fadeInUp 0.3s ease',
            }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
                {scenarioLabel}
              </span>
            </div>
          )}
          {/* VU Ring */}
          <div className="sim-ring">
            <canvas ref={canvasRef} width="130" height="130" />
            <div className="sim-ring-center" ref={setElRef('vol-display')}>
              <span className="sim-ring-num" style={{ color: getVolColor(vol) }}>
                {vol}
                {isTyping && <span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid' }} />}
              </span>
              <span className="sim-ring-pct">%</span>
              {vol > 100 && !muted && (
                <span className="sim-ring-badge">BOOST</span>
              )}
            </div>
          </div>

          {/* Volume Warning */}
          {vol > 200 && !muted && (
            <div style={{
              padding: '3px 12px', borderRadius: 20, marginBottom: 8,
              fontSize: 9, fontWeight: 500, letterSpacing: 0.5,
              color: '#f59e0b', background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.22)',
              fontFamily: "'JetBrains Mono', monospace",
              animation: 'fadeInUp 0.3s ease',
            }}>
              ⚠ High volume may affect hearing
            </div>
          )}

          {/* Slider */}
          <div className="sim-slider-wrap">
            <input
              ref={setElRef('slider')}
              type="range"
              className="sim-slider"
              min="0" max="1000" step="1"
              value={vol}
              onChange={(e) => setVol(parseInt(e.target.value))}
              style={{
                '--vol-pct': `${(vol / 1000) * 100}%`,
                '--vol-color': getVolColor(vol),
              }}
            />
            <div className="sim-marks">
              <span>0</span><span>200</span><span>400</span><span>600</span><span>800</span><span>1000</span>
            </div>
          </div>

          {/* Controls */}
          <div className="sim-ctl">
            <button
              ref={setElRef('mute-btn')}
              className={`sim-mute-btn ${muted ? 'muted' : ''}`}
              onClick={() => setMuted(!muted)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {muted ? (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : (
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                )}
              </svg>
              <span>{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <div className="sim-presets">
              {[100, 200, 400, 800, 1000].map(v => (
                <div
                  key={v}
                  ref={setElRef(`preset-${v}`)}
                  className={`sim-chip ${vol === v ? 'active' : ''}`}
                  onClick={() => setVol(v)}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Settings Accordion */}
        <div className="sim-acc">
          <div className="sim-acc-hdr" onClick={() => setSettingsOpen(p => !p)}>
            <div className="sim-acc-left">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
              </svg>
              Audio Settings
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div className={`sim-acc-content-wrap ${settingsOpen ? 'open' : ''}`}>
            <div className="sim-acc-content">
              {/* Normalize */}
              <div className="sim-feat-row" onClick={() => setNormActive(!normActive)}>
                <div>
                  <div className="sim-feat-name">Normalize Audio</div>
                </div>
                <div ref={setElRef('norm-toggle')} className={`sim-toggle ${normActive ? 'on' : ''}`} />
              </div>

              {/* Mono Audio */}
              <div className="sim-feat-row" onClick={() => setMonoActive(!monoActive)}>
                <div>
                  <div className="sim-feat-name">Mono Audio</div>
                  <div className="sim-feat-sub">Merge stereo channels</div>
                </div>
                <div ref={setElRef('mono-toggle')} className={`sim-toggle ${monoActive ? 'on' : ''}`} />
              </div>

              {/* Smart Ducking */}
              <div className="sim-feat-row" onClick={() => setDuckingActive(!duckingActive)}>
                <div>
                  <div className="sim-feat-name">Smart Audio Ducking</div>
                  <div className="sim-feat-sub">Lower background tabs volume</div>
                </div>
                <div ref={setElRef('duck-toggle')} className={`sim-toggle ${duckingActive ? 'on' : ''}`} />
              </div>

              {/* Duck Level (visible when ducking is on) */}
              {duckingActive && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 14px 10px 28px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  animation: 'fadeInUp 0.25s ease',
                }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Duck Level</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      ref={setElRef('duck-slider')}
                      type="range" min="5" max="80" step="5"
                      value={duckLevel}
                      onChange={(e) => setDuckLevel(parseInt(e.target.value))}
                      className="sim-duck-slider"
                      style={{
                        '--duck-pct': `${((duckLevel - 5) / 75) * 100}%`
                      }}
                    />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", minWidth: 28, textAlign: 'right' }}>
                      {duckLevel}%
                    </span>
                  </div>
                </div>
              )}

              {/* Remember */}
              <div className="sim-feat-row" onClick={() => setRememberActive(!rememberActive)}>
                <div>
                  <div className="sim-feat-name">Remember this site</div>
                  {rememberActive && (
                    <div style={{ fontSize: 9, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                      Saved at {vol}%
                    </div>
                  )}
                </div>
                <div ref={setElRef('remember-toggle')} className={`sim-toggle ${rememberActive ? 'on' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Mixer Accordion */}
        <div className="sim-acc">
          <div className="sim-acc-hdr" onClick={() => setMixerOpen(p => !p)}>
            <div className="sim-acc-left">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Tab Mixer <span className="sim-mixer-badge">3 tabs</span>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: mixerOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div className={`sim-acc-content-wrap ${mixerOpen ? 'open' : ''}`}>
            <div className="sim-acc-content">
              <div className="sim-mixer-body">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className="sim-mix-card"
                  style={{ opacity: tab.muted ? 0.6 : 1 }}
                >
                  {/* Top Row: Info & Controls */}
                  <div className="sim-mix-row-1">
                    <div className="sim-mix-info">
                      <span className="sim-mix-icon">{tab.icon}</span>
                      <span className="sim-mix-name">{tab.name}</span>
                    </div>
                    <div className="sim-mix-actions">
                      <button className={`sim-mix-btn ${tab.playing ? 'active' : ''}`} title="Pause/Play">
                        {tab.playing ? (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        )}
                      </button>
                      <button className={`sim-mix-btn ${tab.isSolo ? 'active-solo' : ''}`} title="Solo">Solo</button>
                      <button className={`sim-mix-btn ${tab.isGlobal ? 'active-global' : ''}`} title="Global">G</button>
                      <span className="sim-mix-num" style={{ color: tab.vol > 100 ? '#fbbf24' : '#22d3a0' }}>{tab.vol}%</span>
                    </div>
                  </div>

                  {/* Bottom Row: Slider & Mute */}
                  <div className="sim-mix-row-2">
                    <div className="sim-tab-slider-wrap">
                      <input 
                        type="range" min="0" max="1000"
                        value={tab.vol}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, vol: v, muted: v === 0 } : t));
                        }}
                        className="sim-tab-slider"
                        style={{ '--tab-vol-pct': `${(tab.vol / 1000) * 100}%`, '--tab-vol-color': getVolColor(tab.vol) }}
                      />
                    </div>
                    <div 
                      className={`sim-mix-mute-mini ${tab.muted ? 'muted' : ''}`}
                      onClick={() => setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, muted: !t.muted, playing: t.muted, vol: t.muted ? (t.id === 1 ? 150 : t.id === 2 ? 80 : 100) : 0 } : t))}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        {tab.muted && <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>}
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sim-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          </div>
          <span>All settings →</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;