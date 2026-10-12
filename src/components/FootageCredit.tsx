import { footage } from '@/data/vibeplayer';

/** Attribution for the Big Buck Bunny footage (CC BY 3.0) wherever it appears on the VibePlayer pages. */
export function FootageCredit() {
  return <span className="vibe-credit">{footage.title} {footage.holder} (<a href={footage.site} target="_blank" rel="noopener noreferrer">{footage.siteLabel}</a>), licensed <a href={footage.licenseUrl} target="_blank" rel="noopener noreferrer license">{footage.license}</a>.</span>;
}
