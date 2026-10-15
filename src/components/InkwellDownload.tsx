'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, inkwellArticle } from '@/data/inkwell';

/** Inkwell's "recommended for this PC" download box. */
export function InkwellDownload() {
  return <WindowsDownload appName="Inkwell" version={inkwellArticle.version} editions={editions} downloadUrl={downloadUrl}/>;
}
