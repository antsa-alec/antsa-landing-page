import { useEffect, useRef } from 'react';

/**
 * PROBLEM — "10,000 minutes between appointments"
 * A calendar-to-calendar dashed connector with an animated count-up (0 → 10,000)
 * that fires when the number scrolls into view and gently loops.
 *
 * SSR renders the final "10,000" so the no-JS / first-paint value is correct and
 * hydration matches; the effect (client only) resets to 0 and animates.
 */

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function GapBetweenSessions() {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    let counted = false;
    let raf = 0;
    let loopTimer: ReturnType<typeof setTimeout> | undefined;

    const animate = () => {
      const target = 10000;
      const dur = 1800;
      const run = () => {
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-US');
          if (t < 1) raf = requestAnimationFrame(tick);
          else loopTimer = setTimeout(run, 2400);
        };
        raf = requestAnimationFrame(tick);
      };
      run();
    };

    el.textContent = '0';
    const check = () => {
      if (counted) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.9 && r.bottom > 0) {
        counted = true;
        animate();
        window.removeEventListener('scroll', check);
      }
    };
    check();
    window.addEventListener('scroll', check, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (loopTimer) clearTimeout(loopTimer);
      window.removeEventListener('scroll', check);
    };
  }, []);

  const iconBox: React.CSSProperties = {
    flexShrink: 0,
    width: 64,
    height: 64,
    borderRadius: 16,
    background: '#fff',
    border: '1px solid #E6E9EE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#48ABE2',
    boxShadow: '0 4px 16px rgba(15,22,34,.04)',
  };
  const dash: React.CSSProperties = { flex: 1, height: 0, borderTop: '2px dashed #C2D4EA' };

  return (
    <section style={{ background: '#F3F7FC', padding: '88px 0' }}>
      <div
        className="dc-container"
        style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <div className="dc-eyebrow" style={{ marginBottom: 30 }}>The gap between sessions</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%', maxWidth: 760, marginBottom: 24 }}>
          <div style={iconBox}><CalendarIcon /></div>
          <div style={dash} />
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 84, lineHeight: 1, fontWeight: 700, color: '#48ABE2', letterSpacing: '-0.02em' }}>
              <span ref={counterRef}>10,000</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#5B6472', letterSpacing: '.06em', marginTop: 6 }}>minutes</div>
          </div>
          <div style={dash} />
          <div style={iconBox}><CalendarIcon /></div>
        </div>
        <h2 style={{ fontSize: 34, lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 14px' }}>
          between appointments
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: '#5B6472', maxWidth: 600, margin: 0 }}>
          Between weekly sessions, clients spend thousands of minutes on their own. That's where progress is made, or lost.
          <br />
          ANTSA® helps you stay connected to it.
        </p>
      </div>
    </section>
  );
}
