import { footage } from '@/data/makeitcolor';

/** Credit for the footage in a MakeItColor picture: the 1945 photo, the 1951 film or the 1967 song. */
export function MakeItColorCredit({ source }: { source: keyof typeof footage }) {
  if (source === 'doraha') {
    const f = footage.doraha;
    return <span className="mic-credit">Footage: {f.title} ({f.year}), {f.by}; {f.use}.</span>;
  }
  const f = footage[source];
  return <span className="mic-credit">{source === 'kiss' ? 'Photo' : 'Footage'}: <a href={f.url} target="_blank" rel="noopener noreferrer">{f.title}</a> ({f.year}, {f.by}), {f.use}.</span>;
}
