import { footage } from '@/data/vibevideo-ai';

/** Credit for the public-domain test reel in the VibeVideo AI figures and launch video. */
export function ReelCredit() {
  return <span className="vibe-credit">Test reel: {footage.map((f, index) => <span key={f.title}>{index > 0 && (index === footage.length - 1 ? ' and ' : ', ')}<a href={f.url} target="_blank" rel="noopener noreferrer">{f.title}</a> ({f.year}, {f.by})</span>)}, all in the public domain.</span>;
}
