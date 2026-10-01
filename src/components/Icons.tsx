export function Arrow({ diagonal = false, className = '' }: {diagonal?: boolean; className?: string}) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal?'M5 19 19 5M5 5h14v14':'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Asterisk({className=''}:{className?:string}) {
  return <svg className={className} width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3v42M3 24h42M9 9l30 30M9 39 39 9" fill="none" stroke="currentColor" strokeWidth="8"/></svg>;
}
