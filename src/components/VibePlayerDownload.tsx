'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, vibeplayerArticle } from '@/data/vibeplayer';

/** VibePlayer's "recommended for this PC" download box. */
export function VibePlayerDownload() {
  return <WindowsDownload appName="VibePlayer" version={vibeplayerArticle.version} editions={editions} downloadUrl={downloadUrl}/>;
}
