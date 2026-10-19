import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { ExtensionDownload } from '@/components/ExtensionDownload';
import { Arrow } from '@/components/Icons';
import { chromeWebStore, downloadPage, downloadUrl, extensionZip, formatKB, permissions, shortcuts, stitchTest, tallScreenshotArticle, tested } from '@/data/tall-screenshot';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/tall-screenshot-social.jpg', width: 1200, height: 630, alt: 'Tall Screenshot — the whole page, or exactly as much as you want. A free extension for Chrome and Edge.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/tall-screenshot-social.jpg'] },
};

const requirements = [
  ['Browsers', `Google Chrome 116 or later, or Microsoft Edge. Tested in ${tested.browsers}.`],
  ['Not tested yet', `${tested.untested[0].toUpperCase()}${tested.untested.slice(1)}. They use the same extension system, so they may well work.`],
  ['Firefox', 'Not supported yet.'],
  ['Disk and internet', `A ${formatKB(extensionZip.bytes)} download. It works offline and never connects to anything itself.`],
] as const;

const features = [
  ['Full page, stop any time', 'It scrolls the page for you and stitches every screen into one image. Stop the moment you have enough, with the popup, Esc or the toolbar button.'],
  ['Select an area of any height', 'Drag a box, and keep dragging past the bottom of the screen: the page scrolls under it.'],
  ['Custom length', 'Three screens, or 5,000 pixels: from the top of the page or from where you are.'],
  ['A crop editor', 'Crop with handles or exact numbers, undo with no quality lost, then copy a PNG or save a PNG, JPG or WebP.'],
  ['A colour picker', 'A magnifier shows every pixel. Click to copy HEX, RGB or HSL; your last 16 colours stay in the popup.'],
  ['A ruler', 'Distances to the nearest edges, boxes that snap to the content inside them, and any element’s size with Shift.'],
] as const;

export default function TallScreenshotDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'Tall Screenshot',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Google Chrome 116 or later, Microsoft Edge',
    softwareVersion: tallScreenshotArticle.version,
    datePublished: tallScreenshotArticle.date,
    dateModified: tallScreenshotArticle.released,
    softwareRequirements: 'Google Chrome 116 or later, or Microsoft Edge',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl,
    image: `${siteUrl}/art/tall-screenshot-social.jpg`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${tallScreenshotArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page ts-page"><Header/><main id="main" className="pawsip-dl ts-dl shell">
    <header className="pawsip-dl-hero">
      <a href={tallScreenshotArticle.path} className="jev-back">← THE TALL SCREENSHOT FIELD NOTE</a>
      <div className="section-eyebrow"><span>BROWSER EXTENSION / FREE FOR CHROME AND EDGE</span><span>THE WHOLE PAGE. OR JUST ENOUGH.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download Tall Screenshot<br/><em>for Chrome and Edge.</em></h1><p className="pawsip-dl-pitch">Screenshot a whole web page, a length you choose, or an area you drag past the edge of the screen. Crop it, copy it or save it, then pick colours and measure things on the same page. Nothing leaves your computer.</p></div>
        <figure className="ts-dl-stage"><div className="ts-shot-stage"><img src="/art/tall-screenshot-popup.png" width="680" height="1034" alt="Tall Screenshot’s popup: Full page, Select area and Visible area with their shortcuts, Custom length, the Pick color and Measure tools, and recent colours" fetchPriority="high"/></div><figcaption>The popup, a real screenshot of Tall Screenshot {tallScreenshotArticle.version}.</figcaption></figure>
        <div className="pawsip-dl-get">
          <ExtensionDownload/>
          <p className="pawsip-dl-release"><span>VERSION {tallScreenshotArticle.version}</span><span>RELEASED <time dateTime={tallScreenshotArticle.released}>19 OCTOBER 2026</time></span><span>FREE</span><span>CHROME WEB STORE: {chromeWebStore.status.toUpperCase()}</span></p>
          <a className="pawsip-dl-jump" href="#installing">How to install it <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>STITCHED</span><strong>{stitchTest.pageHeight.toLocaleString('en-US')}<small>px</small></strong><p>A test page with a ruler line every 250 px, every line on its exact pixel</p></div><div><span>SITE ACCESS</span><strong>0<small>sites</small></strong><p>It sees a tab only when you use it there</p></div><div><span>UPLOADED</span><strong>0<small>bytes</small></strong><p>No servers, no account, no tracking</p></div></div>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>01 / INSTALLING</span><span>FIVE STEPS, ABOUT A MINUTE</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Unzip it.<br/><em>Load it.</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I submitted Tall Screenshot to the Chrome Web Store on 19 October 2026, and it&apos;s {chromeWebStore.status}. Once it&apos;s approved, you&apos;ll be able to add it there in one click, and this page will link to it. Until then, install it from the ZIP:</p>
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the ZIP</strong> above and unzip it: right-click it and choose <strong>Extract All</strong>.</div></li>
          <li><div><strong>Open the extensions page</strong>: type <code>chrome://extensions</code> in Chrome&apos;s address bar, or <code>edge://extensions</code> in Edge.</div></li>
          <li><div><strong>Turn on Developer mode</strong>, the switch at the top right (bottom left in Edge).</div></li>
          <li><div><strong>Choose Load unpacked</strong> and select the folder you unzipped, the one with <code>manifest.json</code> directly inside it.</div></li>
          <li><div><strong>Pin it</strong>: click the puzzle icon next to the address bar, then the pin beside Tall Screenshot.</div></li>
        </ol>
        <p>Installed this way, it doesn&apos;t update itself; the Chrome Web Store version will. To remove it, click <strong>Remove</strong> on its card in the extensions page; that deletes its saved screenshots and settings too.</p>
        <details className="ts-checksum"><summary>SHA-256 checksum</summary><ul className="pawsip-checksums"><li><span>{extensionZip.file} · {formatKB(extensionZip.bytes)}</span><code>{extensionZip.sha256}</code></li></ul></details>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>02 / WHAT YOU GET</span><span>THREE TOOLS IN ONE BUTTON</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">The whole page.<br/><em>Or just enough.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></li>)}</ul>
        <div className="benchmark-data-table ts-keys"><div className="benchmark-table-scroll"><table><caption>Keyboard shortcuts · change them at chrome://extensions/shortcuts</caption><thead><tr><th scope="col">Action</th><th scope="col">Shortcut</th></tr></thead><tbody>{shortcuts.map(([name, key]) => <tr key={name}><th scope="row">{name}</th><td>{key.startsWith('Alt') ? <kbd>{key}</kbd> : key}</td></tr>)}</tbody></table></div></div>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>03 / WHAT IT RUNS ON</span><span>CHROME 116+ · EDGE</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl>
        <p className="jev-small-note">Chrome protects some pages from every extension. On the Chrome Web Store and chrome:// pages, Tall Screenshot can capture only what&apos;s on screen, and on view-source: pages nothing at all; the popup tells you which case you&apos;re in.</p>
      </div></div>
    </section>

    <section id="privacy" className="pawsip-dl-section" aria-labelledby="privacy-heading">
      <div className="section-eyebrow"><span>04 / PRIVACY</span><span>NO SITE ACCESS · NO UPLOADS</span></div>
      <div className="pawsip-dl-cols"><h2 id="privacy-heading">Your pages<br/><em>stay yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <p>It asks for no access to any website. Chrome lets it see the tab you&apos;re on only when you use it there. Screenshots are stitched in your browser and kept there, only the five most recent; there&apos;s no server, no account and no analytics.</p>
        <dl className="pawsip-dl-reqs">{permissions.map(([name, text]) => <div key={name}><dt><code>{name}</code></dt><dd>{text}</dd></div>)}</dl>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>05 / MORE ABOUT TALL SCREENSHOT</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it stitches?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about how it scrolls and stitches a page, the rules that keep headers from repeating, the editor, the colour picker and the ruler, and the pages no extension can touch. There&apos;s an 87-second launch video, too.</p>
        <div className="jev-downloads"><a href={tallScreenshotArticle.path}>Read the story behind Tall Screenshot <Arrow/></a><a href={tallScreenshotArticle.repoUrl} target="_blank" rel="noopener noreferrer">View the source on GitHub <Arrow diagonal/></a><a href={tallScreenshotArticle.checksumsUrl} target="_blank" rel="noopener noreferrer">SHA-256 checksums file <Arrow diagonal/></a></div>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
