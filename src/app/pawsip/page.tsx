import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { PawSipCat } from '@/components/PawSipCat';
import { PawSipDownload } from '@/components/PawSipDownload';
import { downloadPage, downloadUrl, editions, formatSize, pawsipArticle } from '@/data/pawsip';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/pawsip-social.jpg', width: 1200, height: 630, alt: 'PawSip — a desktop cat that keeps you hydrated. Windows 7, 8.1, 10 and 11.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/pawsip-social.jpg'] },
};

const requirements = [
  ['Windows 10 & 11', 'x64 or ARM64, plus 32-bit Windows 10. Self-contained: nothing else to install.'],
  ['Windows 7 SP1 & 8.1', '32- or 64-bit. Uses Microsoft .NET Framework 4.8. If it’s missing, setup tells you and links to Microsoft’s download page.'],
  ['Windows 8', 'Needs the free update to Windows 8.1 first.'],
  ['Windows XP & Vista', 'Not supported. PawSip needs Windows 7 Service Pack 1 or newer.'],
  ['Installation', 'For your account only. No administrator prompt.'],
] as const;

const features = [
  ['A cat on your desktop', 'An animated vector cat sits above a small water gauge. It naps between reminders, waves when it’s time to drink, and drinks with you. Hover it to log a glass; drag it anywhere.'],
  ['Reminders that follow you', 'It only asks while you’re at the PC: screen on, unlocked, keyboard or mouse used in the last five minutes. Fullscreen games, videos and presentations are never interrupted.'],
  ['It keeps asking', 'Dismiss or ignore the cat without drinking and it comes back after 15 minutes, until you have some water. Busy? Remind me later in 5, 10, 15 or 30 minutes, or an hour.'],
  ['A daily goal', 'Set it in glasses or milliliters, log a drink in one click, undo a mistake, and watch the water ring fill. The goal resets at midnight.'],
  ['Your history', 'Every day is kept, with weekly and monthly statistics and a hydration calendar.'],
  ['Light and private', 'Under 1% CPU with the desktop cat on screen, measured on my PC. No account, no network access, no tracking: everything stays on the PC.'],
] as const;

export default function PawSipDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'PawSip',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Windows 7 SP1, 8.1, 10, 11',
    softwareVersion: pawsipArticle.version,
    datePublished: pawsipArticle.date,
    softwareRequirements: 'Windows 10 and 11: none (self-contained). Windows 7 SP1 and 8.1: Microsoft .NET Framework 4.8.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/pawsip-social.jpg`,
    screenshot: `${siteUrl}/art/pawsip-dashboard.png`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${pawsipArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page"><Header/><main id="main" className="pawsip-dl shell">
    <header className="pawsip-dl-hero">
      <a href={pawsipArticle.path} className="jev-back">← THE PAWSIP FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE FOR WINDOWS</span><span>WATER, ON TIME.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download PawSip<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">A free Windows water reminder with an animated desktop cat: it reminds you only when you&apos;re at the PC, and everything it records stays on the PC.</p></div>
        <figure className="pawsip-dl-stage"><div className="pawsip-cat-frame"><PawSipCat/></div><figcaption>CLICK THE CAT TO PET IT</figcaption></figure>
        <div className="pawsip-dl-get">
          <PawSipDownload/>
          <p className="pawsip-dl-release"><span>VERSION {pawsipArticle.version}</span><span>RELEASED <time dateTime={pawsipArticle.date}>12 OCTOBER 2026</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Other Windows versions and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>WINDOWS SUPPORT</span><strong>4<small>builds</small></strong><p>Windows 7 SP1, 8.1, 10 &amp; 11 · x64, ARM64 and 32-bit</p></div><div><span>IF YOU DON&apos;T DRINK</span><strong>15<small>min</small></strong><p>The cat comes back, again and again, until you do</p></div><div><span>BACKGROUND COST</span><strong>&lt;1<small>% CPU</small></strong><p>With the desktop cat on screen · measured on my PC</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {pawsipArticle.version} · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Every installer.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {pawsipArticle.version}</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download PawSip for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary>SHA-256 checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong> on Windows 10 or 11, or <strong>Control Panel › System</strong> on Windows 7 and 8.1. It shows your Windows edition and system type. Most PCs need the first installer. Windows 8 needs the free update to 8.1 first. Windows XP and Vista aren&apos;t supported.</p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>02 / SYSTEM REQUIREMENTS</span><span>WINDOWS 7 SP1 TO 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl>
        <p className="jev-small-note">I tested the 64-bit, 32-bit and Windows 7/8.1 editions on my Windows 11 PC, including installing and uninstalling. The ARM64 edition is built natively for ARM, but I haven&apos;t run it on ARM hardware yet, and I haven&apos;t tested the Windows 7/8.1 edition on an actual Windows 7 or 8.1 machine.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>03 / WHAT YOU GET</span><span>A SMALL HABIT. A NATIVE APP.</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">A small cat.<br/><em>A complete tracker.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></li>)}</ul>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>04 / INSTALLING</span><span>NO ADMINISTRATOR PROMPT</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the SHA-256 checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Follow setup.</strong> It installs for your account only, with no administrator prompt. Keep <strong>Start PawSip with Windows</strong> ticked so the cat is there every day.</div></li>
        </ol>
        <p>To remove PawSip, uninstall it from <strong>Settings › Apps</strong>. Your history stays in <code>%APPDATA%\PawSip</code> in case you come back.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>05 / MORE ABOUT PAWSIP</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it works?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about why I built PawSip, how a reminder decides when to appear, and how the app stays light while it runs all day.</p>
        <div className="jev-downloads"><a href={pawsipArticle.path}>Read the story behind PawSip <Arrow/></a><a href={pawsipArticle.repoUrl} target="_blank" rel="noopener noreferrer">View the source on GitHub <Arrow diagonal/></a><a href={pawsipArticle.checksumsUrl} target="_blank" rel="noopener noreferrer">SHA-256 checksums file <Arrow diagonal/></a><a href={`${pawsipArticle.repoUrl}#readme`} target="_blank" rel="noopener noreferrer">Read the README <Arrow diagonal/></a></div>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
