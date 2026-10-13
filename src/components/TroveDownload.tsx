'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, troveArticle } from '@/data/trove';

/** Trove's "recommended for this PC" download box. */
export function TroveDownload() {
  return <WindowsDownload appName="Trove" version={troveArticle.version} editions={editions} downloadUrl={downloadUrl}/>;
}
