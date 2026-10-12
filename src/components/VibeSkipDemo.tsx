'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { skipDemo } from '@/data/vibeplayer';

type Range = { start: number; end: number };

const preset: Range[] = [{ ...skipDemo.preset }];

/** m:ss, truncated like VibePlayer's own FormatTime. */
const fmt = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds + 1e-6));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};
const span = (range: Range) => `${fmt(range.start)} – ${fmt(range.end)}`;

/** Same rule as the app's AddSkip: overlapping or touching parts merge into one. */
function addRange(ranges: Range[], next: Range): Range[] {
  const merged: Range[] = [];
  for (const range of [...ranges, next].sort((a, b) => a.start - b.start)) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) last.end = Math.max(last.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}

const PlayIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z" fill="currentColor"/></svg>;
const SkipIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M3 6v12l8.5-6zm9 0v12l8.5-6z" fill="currentColor"/></svg>;

/**
 * A web imitation of VibePlayer's skip mode, for the field note. It plays a short muted clip and, while
 * "Skip marked parts" is on, a requestAnimationFrame loop jumps past every marked part, much like the app's
 * 40 ms check. It is not the app: it runs entirely in the browser and stores nothing.
 */
export function VibeSkipDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [ranges, setRanges] = useState<Range[]>(preset);
  const [skipOn, setSkipOn] = useState(true);
  const [notice, setNotice] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number>(skipDemo.length);
  const [pendingStart, setPendingStart] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(false);
  const [chip, setChip] = useState<{ range: Range; id: number } | null>(null);
  const [status, setStatus] = useState('Tip: press [ where a part starts and ] where it ends.');

  // The animation loop reads these without restarting.
  const rangesRef = useRef(ranges);
  const skipOnRef = useRef(skipOn);
  const noticeRef = useRef(notice);
  const draggingRef = useRef(false);
  const lastSkipRef = useRef<{ end: number; at: number } | null>(null);
  const userPausedRef = useRef(false);
  const autoPausedRef = useRef(false);
  useEffect(() => { rangesRef.current = ranges; }, [ranges]);
  useEffect(() => { skipOnRef.current = skipOn; }, [skipOn]);
  useEffect(() => { noticeRef.current = notice; }, [notice]);

  // Hide the "Skipped" chip after two seconds, like the app's message.
  useEffect(() => {
    if (!chip) return;
    const timer = window.setTimeout(() => setChip(null), 2000);
    return () => window.clearTimeout(timer);
  }, [chip]);

  // While playing: follow the time and jump over marked parts.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const video = videoRef.current;
      if (!video) return;
      const now = video.currentTime;
      if (skipOnRef.current && !draggingRef.current) {
        for (const range of rangesRef.current) {
          if (now < range.start || now >= range.end - 0.05) continue;
          // Give a jump a moment to land before trying the same part again.
          const last = lastSkipRef.current;
          if (last && last.end === range.end && performance.now() - last.at < 400) break;
          lastSkipRef.current = { end: range.end, at: performance.now() };
          video.currentTime = Math.min(range.end, Number.isFinite(video.duration) ? video.duration : range.end);
          if (noticeRef.current) setChip({ range: { ...range }, id: performance.now() });
          break;
        }
      }
      setTime(video.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  // Start muted playback when the demo scrolls into view, unless the visitor prefers reduced motion
  // or paused it themselves. Pause it again while it is off screen.
  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;
    video.muted = true;
    video.defaultMuted = true;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (autoPausedRef.current || (!reduced && !userPausedRef.current && video.paused && video.currentTime === 0)) {
          autoPausedRef.current = false;
          video.play().catch(() => { /* autoplay blocked: the play button still works */ });
        }
      } else if (!video.paused) {
        autoPausedRef.current = true;
        video.pause();
      }
    }, { threshold: 0.5 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    autoPausedRef.current = false;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => setStatus('This browser could not play the clip.'));
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, []);

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    setTime(seconds);
  };

  const current = () => videoRef.current?.currentTime ?? time;

  const markStart = () => {
    const at = Math.round(current() * 10) / 10;
    setPendingStart(at);
    setStatus(`Skip starts at ${fmt(at)} · play to where it should end and press ]`);
  };

  const markEnd = () => {
    if (pendingStart === null) {
      setStatus('First press [ where the part you want to skip begins.');
      return;
    }
    const end = Math.round(current() * 10) / 10;
    if (end <= pendingStart + 0.5) {
      setStatus('The end must be after the start. Play forward a bit and press ] again.');
      return;
    }
    const range = { start: pendingStart, end };
    setRanges(previous => addRange(previous, range));
    setPendingStart(null);
    lastSkipRef.current = null;
    setStatus(`Will skip ${span(range)} every time the clip plays.`);
  };

  const removeRange = (range: Range) => {
    setRanges(previous => previous.filter(r => r !== range));
    lastSkipRef.current = null;
    setStatus(`Removed skip ${span(range)}.`);
  };

  const toggleSkipping = () => {
    const next = !skipOn;
    setSkipOn(next);
    setStatus(next ? 'Skipping on.' : 'Skipping off: playing everything.');
  };

  const reset = () => {
    setRanges(preset.map(range => ({ ...range })));
    setSkipOn(true);
    setNotice(true);
    setPendingStart(null);
    lastSkipRef.current = null;
    setStatus(`Back to the marked part ${span(preset[0])}.`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    const onControl = target.closest('button, input') !== null;
    if (event.key === '[') { event.preventDefault(); markStart(); }
    else if (event.key === ']') { event.preventDefault(); markEnd(); }
    else if (!onControl && (event.key === ' ' || event.key === 'k' || event.key === 'K')) { event.preventDefault(); togglePlay(); }
  };

  const length = duration > 0 ? duration : skipDemo.length;
  const pct = (seconds: number) => `${Math.min(100, Math.max(0, (seconds / length) * 100))}%`;
  const timeLabel = remaining ? `-${fmt(length - time)} / ${fmt(length)}` : `${fmt(time)} / ${fmt(length)}`;

  return <div className="vibe-demo" ref={rootRef} role="group" tabIndex={0} aria-labelledby="vibe-demo-title" aria-describedby="vibe-demo-keys" onKeyDown={onKeyDown}>
    <div className="vibe-demo-window">
      <div className="vibe-demo-titlebar"><span className="vibe-demo-logo" aria-hidden="true"/><span id="vibe-demo-title">Big Buck Bunny clip · skip mode</span><span className="vibe-demo-badge">WEB DEMO</span></div>
      <div className="vibe-demo-screen">
        <video ref={videoRef} src={skipDemo.src} poster={skipDemo.poster} muted playsInline loop preload="metadata" aria-label="A 20-second silent clip from Big Buck Bunny"
          onPlay={() => setPlaying(true)} onPause={() => { setPlaying(false); setTime(videoRef.current?.currentTime ?? 0); }}
          onLoadedMetadata={event => { const d = event.currentTarget.duration; if (Number.isFinite(d) && d > 0) setDuration(d); }}
          onSeeked={event => setTime(event.currentTarget.currentTime)}
          onTimeUpdate={event => { if (event.currentTarget.paused) setTime(event.currentTarget.currentTime); }}/>
        {!playing && <button type="button" className="vibe-demo-bigplay" onClick={togglePlay} aria-label="Play the demo"><PlayIcon/></button>}
        {chip && <div key={chip.id} className="vibe-demo-chip" style={{ left: pct(Math.min(Math.max((chip.range.start + chip.range.end) / 2, length * 0.16), length * 0.84)) }} aria-hidden="true"><SkipIcon/>Skipped {span(chip.range)}</div>}
        <div className="vibe-demo-controls">
          <div className="vibe-demo-bar">
            <div className="vibe-demo-track" aria-hidden="true">
              <span className="vibe-demo-played" style={{ width: pct(time) }}/>
              {ranges.map(range => <span key={`${range.start}-${range.end}`} className={skipOn ? 'vibe-demo-mark' : 'vibe-demo-mark is-off'} style={{ left: pct(range.start), width: pct(range.end - range.start) }}/>)}
              {pendingStart !== null && <span className="vibe-demo-pending" style={{ left: pct(pendingStart) }}/>}
              <span className="vibe-demo-thumb" style={{ left: pct(time) }}/>
            </div>
            <input type="range" className="vibe-demo-seek" min={0} max={length} step={0.1} value={Math.min(time, length)} aria-label="Seek" aria-valuetext={`${fmt(time)} of ${fmt(length)}`}
              onChange={event => seek(Number(event.target.value))}
              onPointerDown={() => { draggingRef.current = true; }} onPointerUp={() => { draggingRef.current = false; }} onPointerCancel={() => { draggingRef.current = false; }} onBlur={() => { draggingRef.current = false; }}/>
          </div>
          <div className="vibe-demo-row">
            <button type="button" className="vibe-demo-circle" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <PauseIcon/> : <PlayIcon/>}</button>
            <button type="button" className="vibe-demo-time" onClick={() => setRemaining(r => !r)} aria-label={`${remaining ? 'Remaining' : 'Elapsed'} time ${timeLabel}. Switch to ${remaining ? 'elapsed' : 'remaining'} time.`}>{timeLabel}</button>
          </div>
        </div>
      </div>
      <div className="vibe-demo-menu">
        <span className="vibe-demo-menu-title">SKIP SCENES</span>
        <button type="button" className="vibe-demo-toggle" aria-pressed={skipOn} onClick={toggleSkipping}><span>Skip marked parts</span><span className="vibe-demo-switch" aria-hidden="true"/></button>
        <button type="button" className="vibe-demo-toggle" aria-pressed={notice} onClick={() => setNotice(on => !on)}><span>Show “Skipped” message <small>(off by default in the app)</small></span><span className="vibe-demo-switch" aria-hidden="true"/></button>
        <ul className="vibe-demo-ranges" aria-label="Marked parts">
          {ranges.length === 0 && <li className="vibe-demo-empty">No marked parts. Mark one with the buttons below.</li>}
          {ranges.map(range => <li key={`${range.start}-${range.end}`}><span><SkipIcon/>{span(range)}</span><button type="button" onClick={() => removeRange(range)} aria-label={`Remove skip ${span(range)}`}>Remove</button></li>)}
        </ul>
        <div className="vibe-demo-actions">
          <button type="button" onClick={markStart} aria-keyshortcuts="[">Start skip here <kbd>[</kbd></button>
          <button type="button" onClick={markEnd} aria-keyshortcuts="]">{pendingStart === null ? 'End skip here' : `End skip here (${fmt(pendingStart)} → now)`} <kbd>]</kbd></button>
          <button type="button" className="vibe-demo-reset" onClick={reset}>Reset demo</button>
        </div>
        <p className="vibe-demo-status" role="status" aria-live="polite">{status}</p>
        <p id="vibe-demo-keys" className="vibe-sr">Keyboard: with focus anywhere in the demo, press [ where a part starts and ] where it ends. Space or K plays and pauses.</p>
      </div>
    </div>
  </div>;
}
