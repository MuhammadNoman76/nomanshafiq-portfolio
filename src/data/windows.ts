/** Windows installer editions, shared by the desktop apps' download pages (PawSip, VibePlayer, Trove). */
export type EditionId = 'x64' | 'arm64' | 'x86' | 'win7-8';

export interface Edition {
  id: EditionId;
  name: string;
  forWho: string;
  windows: string;
  cpu: string;
  runtime: string;
  file: string;
  bytes: number;
  sha256: string;
}

/** Decimal megabytes, like the rest of the site. */
export const formatSize = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;
