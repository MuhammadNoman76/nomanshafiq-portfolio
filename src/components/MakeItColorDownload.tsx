'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, makeitcolorArticle, requirement } from '@/data/makeitcolor';

/** MakeItColor's "recommended for this PC" download box (x64 and ARM64 only, so it names the requirement elsewhere). */
export function MakeItColorDownload() {
  return <WindowsDownload appName="MakeItColor" version={makeitcolorArticle.version} editions={editions} downloadUrl={downloadUrl} requirement={requirement}/>;
}
