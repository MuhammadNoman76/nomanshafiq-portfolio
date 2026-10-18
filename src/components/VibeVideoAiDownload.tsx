'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, requirement, vibevideoArticle } from '@/data/vibevideo-ai';

/** VibeVideo AI's "recommended for this PC" download box (x64 and ARM64 only, so it names the requirement elsewhere). */
export function VibeVideoAiDownload() {
  return <WindowsDownload appName="VibeVideo AI" version={vibevideoArticle.version} editions={editions} downloadUrl={downloadUrl} requirement={requirement}/>;
}
