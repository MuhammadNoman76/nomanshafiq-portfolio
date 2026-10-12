'use client';

import { WindowsDownload } from '@/components/WindowsDownload';
import { downloadUrl, editions, pawsipArticle } from '@/data/pawsip';

/** PawSip's "recommended for this PC" download box. */
export function PawSipDownload() {
  return <WindowsDownload appName="PawSip" version={pawsipArticle.version} editions={editions} downloadUrl={downloadUrl}/>;
}
