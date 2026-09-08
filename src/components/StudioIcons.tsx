import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function Spark({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...props}><path d="M24 3v42M3 24h42M9.2 9.2l29.6 29.6M38.8 9.2 9.2 38.8" fill="none" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round"/></svg>;
}
export function Arrow({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 32 20" aria-hidden="true" {...props}><path d="M2 10h25M20 3l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function Play({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 28 28" aria-hidden="true" {...props}><circle cx="14" cy="14" r="12" fill="none" stroke="currentColor"/><path d="m11 9 8 5-8 5z" fill="currentColor"/></svg>;
}
export function Github({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.02-1.88-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .28.18.6.69.5A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"/></svg>;
}
export function Linkedin({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}><path fill="currentColor" d="M5.2 7.7H2V22h3.2V7.7ZM3.6 2A1.9 1.9 0 1 0 3.6 5.8 1.9 1.9 0 0 0 3.6 2ZM22 13.8c0-4.3-2.3-6.3-5.3-6.3-2.4 0-3.5 1.4-4.1 2.3V7.7H9.4V22h3.2v-7.1c0-1.9.4-3.8 2.8-3.8 2.4 0 2.4 2.3 2.4 3.9v7H21l1-8.2Z"/></svg>;
}
export function Mail({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M3 5.5h18v13H3zM4 6.5l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
}
export function Check({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="m5 12.5 4 4L19 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function Close({className="", ...props}: P){
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
