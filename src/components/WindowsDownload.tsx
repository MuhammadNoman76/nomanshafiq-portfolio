import { useEffect, useState } from 'react';
import { Arrow } from '@/components/Icons';
import { formatSize, type Edition, type EditionId } from '@/data/windows';

type Detection =
  | { state: 'pending' }
  | { state: 'windows'; label: string; edition: EditionId; note?: string }
  | { state: 'too-old'; label: string }
  | { state: 'other'; label: string };

type UserAgentData = {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ platformVersion?: string; architecture?: string; bitness?: string }>;
};

/** Works out which installer fits the visitor's PC. Runs only in the browser; nothing is sent anywhere. */
async function detect(appName: string): Promise<Detection> {
  const ua = navigator.userAgent;
  const uaData = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
  const platform = uaData?.platform ?? '';

  if (!/Windows/i.test(platform) && !/Windows NT/i.test(ua)) {
    const label = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iPhone or iPad'
      : /Mac/i.test(platform || ua) ? 'a Mac' : /Linux|CrOS/i.test(platform || ua) ? 'Linux or ChromeOS' : 'this device';
    return { state: 'other', label };
  }

  // Windows 7 / 8 / 8.1 are identifiable from the "Windows NT" version.
  const nt = /Windows NT (\d+)\.(\d+)/.exec(ua);
  const version = nt ? Number(nt[1]) + Number(nt[2]) / 10 : 10;
  if (version < 6.1) return { state: 'too-old', label: version >= 6 ? 'Windows Vista' : 'Windows XP' };
  if (version < 6.2) return { state: 'windows', label: 'Windows 7', edition: 'win7-8', note: 'Needs Windows 7 Service Pack 1 and .NET Framework 4.8. Setup checks both for you.' };
  if (version < 6.3) return { state: 'windows', label: 'Windows 8', edition: 'win7-8', note: `Windows 8 needs the free update to Windows 8.1 first. ${appName} runs on 8.1.` };
  if (version < 10) return { state: 'windows', label: 'Windows 8.1', edition: 'win7-8' };

  // Windows 10 and 11 share "NT 10.0"; Chromium browsers can tell them apart, and report the processor.
  let name = 'Windows 10 or 11';
  let cpu: 'x64' | 'arm64' | 'x86' = /ARM64|aarch64/i.test(ua) ? 'arm64' : /WOW64|Win64|x64|amd64/i.test(ua) ? 'x64' : 'x86';
  try {
    const hints = await uaData?.getHighEntropyValues?.(['platformVersion', 'architecture', 'bitness']);
    if (hints) {
      const major = parseInt(hints.platformVersion ?? '', 10);
      if (major >= 13) name = 'Windows 11';
      else if (major > 0) name = 'Windows 10';
      if (hints.architecture === 'arm') cpu = 'arm64';
      else if (hints.architecture === 'x86') cpu = hints.bitness === '32' ? 'x86' : 'x64';
    }
  } catch {
    // Keep the user-agent based guess.
  }
  const cpuLabel = cpu === 'arm64' ? 'ARM' : cpu === 'x86' ? '32-bit' : '64-bit';
  return { state: 'windows', label: `${name} · ${cpuLabel}`, edition: cpu };
}

export interface WindowsDownloadProps {
  /** Shown in the button and the notes, e.g. "PawSip". */
  appName: string;
  version: string;
  /** Every installer; the x64 one doubles as the default before detection finishes (and without JavaScript). */
  editions: Edition[];
  downloadUrl: (edition: Edition) => string;
}

/**
 * The "recommended for this PC" download box shared by the desktop app pages. It takes a function prop,
 * so render it from a small 'use client' wrapper (PawSipDownload, VibePlayerDownload, TroveDownload), not from a page.
 * Styles: the .pawsip-download rules in src/app/pawsip.css.
 */
export function WindowsDownload({ appName, version, editions, downloadUrl }: WindowsDownloadProps) {
  const [detection, setDetection] = useState<Detection>({ state: 'pending' });

  useEffect(() => {
    let active = true;
    detect(appName)
      .then(result => { if (active) setDetection(result); })
      .catch(() => { if (active) setDetection({ state: 'other', label: 'this device' }); });
    return () => { active = false; };
  }, [appName]);

  const editionId: EditionId = detection.state === 'windows' ? detection.edition : 'x64';
  const recommended = editions.find(edition => edition.id === editionId) ?? editions[0];
  const status = detection.state === 'pending' ? 'Checking your Windows version…'
    : detection.state === 'windows' ? `Detected: ${detection.label}`
    : detection.state === 'too-old' ? `Detected: ${detection.label}`
    : `You're on ${detection.label}`;

  return <div className="pawsip-download">
    <div className="pawsip-download-top"><span>{detection.state === 'other' ? 'FOR YOUR WINDOWS PC' : 'RECOMMENDED FOR THIS PC'}</span><span role="status" aria-live="polite">{status}</span></div>
    {detection.state === 'too-old'
      ? <p className="pawsip-download-note">{`${appName} needs Windows 7 Service Pack 1 or newer, so it won't run on ${detection.label}. Any of the installers below will work on a newer PC.`}</p>
      : <a className="pawsip-download-main" href={downloadUrl(recommended)}>
          <span className="pawsip-download-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          <span className="pawsip-download-label"><strong>{`Download ${appName} ${version}`}</strong><small>{recommended.name} · {formatSize(recommended.bytes)}</small></span>
          <Arrow/>
        </a>}
    {detection.state === 'other' && <p className="pawsip-download-note">{`${appName} is a Windows app. Open this page on your Windows PC, or pick the right installer from the table below.`}</p>}
    {detection.state === 'windows' && detection.note && <p className="pawsip-download-note">{detection.note}</p>}
    {detection.state === 'windows' && detection.label.startsWith('Windows 10 or 11') && <p className="pawsip-download-note">Your browser doesn&apos;t say whether this is Windows 10 or 11. The same installer works on both.</p>}
  </div>;
}
