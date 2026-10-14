'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, stagecraftArticle } from '@/data/stagecraft';

/** Stagecraft's "recommended for this PC" download box. */
export function StagecraftDownload() {
  return <WindowsDownload appName="Stagecraft" version={stagecraftArticle.version} editions={editions} downloadUrl={downloadUrl}/>;
}
