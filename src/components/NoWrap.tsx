import { Fragment } from 'react';

const terms = /(7-Zip|AES-256|SHA-256)/;

/** Keeps hyphenated names such as 7-Zip, AES-256 and SHA-256 on one line (browsers otherwise break after the hyphen). */
export function noWrap(text: string) {
  return text.split(terms).map((part, index) => index % 2 ? <span key={index} className="trove-nw">{part}</span> : <Fragment key={index}>{part}</Fragment>);
}
