import { Arrow } from '@/components/Icons';
import { chromeWebStore, downloadUrl, extensionZip, formatKB, tallScreenshotArticle } from '@/data/tall-screenshot';

/**
 * Tall Screenshot's download box: one ZIP for Chrome and Edge, so no detection is needed. Same look as the
 * Windows download box (the .pawsip-download rules in src/app/pawsip.css).
 */
export function ExtensionDownload() {
  return <div className="pawsip-download ts-download">
    <div className="pawsip-download-top"><span>FOR CHROME AND EDGE</span><span>Chrome Web Store: {chromeWebStore.status}</span></div>
    <a className="pawsip-download-main" href={downloadUrl}>
      <span className="pawsip-download-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
      <span className="pawsip-download-label"><strong>{`Download Tall Screenshot ${tallScreenshotArticle.version}`}</strong><small>ZIP for Chrome and Edge · {formatKB(extensionZip.bytes)}</small></span>
      <Arrow/>
    </a>
    <p className="pawsip-download-note">Unzip it, then add it in <strong>chrome://extensions</strong> (or <strong>edge://extensions</strong>): turn on Developer mode and choose Load unpacked. The steps are below. Once the Chrome Web Store approves it, you&apos;ll be able to add it from there in one click instead.</p>
  </div>;
}
