import { Fragment } from 'react';

const terms = /(7-Zip|AES-256|SHA-256|Ctrl\+(?:Alt\+|Shift\+)?\w|Alt\+Shift\+\w|(?:Alt|Shift)\+F\d+)/;

/**
 * Keeps hyphenated names such as 7-Zip, AES-256 and SHA-256, and shortcuts such as Ctrl+Alt+T, on one line
 * (browsers otherwise break after the hyphen or the plus). Each app's pages pass their own class (trove-nw, stagecraft-nw, inkwell-nw).
 */
export function noWrap(text: string, className = 'trove-nw') {
  return text.split(terms).map((part, index) => index % 2 ? <span key={index} className={className}>{part}</span> : <Fragment key={index}>{part}</Fragment>);
}
