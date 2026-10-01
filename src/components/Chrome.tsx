import { profile } from '@/data/portfolio';
import { Arrow, Asterisk } from './Icons';
export function Header({home=false}:{home?:boolean}) {
 const path=home?'':'/';
 return <><a href="#main" className="skip-link">Skip to content</a><div className="reading-progress" data-progress="" aria-hidden="true"/>
 <header className="site-header shell">
  <a className="wordmark" href="/" aria-label="Muhammad Noman homepage">noman<span>.</span><small>INDEPENDENT MIND.<br/>CONNECTED THINKING.</small></a>
  <nav aria-label="Main navigation" className="desktop-nav"><a href={`${path}#work`}>Selected work <sup>05</sup></a><a href="/blog/">Blog</a><a href={`${path}#about`}>The human</a><a href={`${path}#contact`} className="nav-contact">Let&apos;s talk <Arrow diagonal/></a></nav>
  <details className="mobile-menu"><summary>Menu <span aria-hidden="true">+</span></summary><nav aria-label="Mobile navigation"><a href={`${path}#work`}>Selected work</a><a href="/blog/">Blog</a><a href={`${path}#about`}>The human</a><a href={`${path}#contact`}>Let&apos;s talk</a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal/></a></nav></details>
 </header></>;
}
export function Footer() {
 return <footer className="contact" id="contact">
 <div className="shell">
  <div className="section-eyebrow"><span>04 / THE NEXT CHAPTER</span><span>A CONVERSATION IS A GOOD START.</span></div>
  <div className="contact-heading"><h2>What if we<br/><em>built it?</em></h2><a href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`} className="contact-orbit"><Arrow diagonal/></a></div>
  <div className="contact-details"><div><p>Ambitious idea? Interesting problem?<br/>Let&apos;s make something worth putting into the world.</p><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><button className="copy-button" data-copy-email={profile.email}>Copy email <span aria-hidden="true">&#10697;</span></button><span className="copy-status" data-copy-status="" role="status" aria-live="polite"/></div>
  <div className="social-links"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal/></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal/></a><a href={profile.resume} download>Download resume <Arrow diagonal/></a></div></div>
  <div className="footer-bottom"><a className="footer-mark" href="/">noman<Asterisk/></a><span>Made of curiosity.<br/>Based in Karachi. Building for everywhere.</span><a href="#top">Back to the top <span aria-hidden="true">&#8593;</span></a><span>&copy; 2026 Muhammad Noman</span></div>
 </div></footer>;
}
