import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { noWrap } from '@/components/NoWrap';
import { TroveDownload } from '@/components/TroveDownload';
import { downloadPage, downloadUrl, editions, engine, engineTests, formatSize, formats, screenshots, troveArticle, updateFeed } from '@/data/trove';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/trove-social.jpg', width: 1200, height: 630, alt: 'Trove — open any archive, make zips in a click. Free for Windows 7 to 11, on the 7-Zip engine.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/trove-social.jpg'] },
};

const requirements = [
  ['Windows 10 & 11', 'x64 or ARM64, plus 32-bit Windows 10. Self-contained: nothing else to install. Each installer carries the 7-Zip engine for its processor.'],
  ['Windows 7 SP1 & 8.1', '32- or 64-bit. Uses Microsoft .NET Framework 4.8. If it’s missing, setup tells you and offers to open Microsoft’s download page. Setup installs the 32- or 64-bit 7-Zip engine that matches Windows.'],
  ['Windows 8', 'Needs the free update to Windows 8.1 first.'],
  ['Windows XP & Vista', 'Not supported. Trove needs Windows 7 Service Pack 1 or newer.'],
  ['Installation', 'For all users (the default; needs administrator permission) or only for you (no administrator rights needed).'],
] as const;

const features = [
  ['Opens almost anything', 'ZIP, 7Z, RAR and RAR5 (including encrypted and multi-part archives), TAR, GZ, BZ2, XZ, ZST, ISO, CAB, WIM, DMG and many more formats the 7-Zip engine reads, plus split archives (.001) and self-extracting .exe archives.'],
  ['Browse it like a folder', 'Folders, a breadcrumb, Back and Up, search, Windows’ own icons and an Info pane. Double-click opens a file with its usual app, and Trove asks before running a program. Add and delete files inside ZIP, 7Z and TAR archives.'],
  ['Makes ZIP, 7Z and TAR', `${formats.creates.join(', ')}, with four simple levels: Store, Fastest, Balanced and Smallest (7-Zip levels 0, 1, 5 and 9). RAR archives can be opened and extracted, but not created: the format is proprietary.`],
  ['Passwords and parts', 'AES-256 for both ZIP and 7Z, “Hide file names too” for 7Z, and splitting into 100 MB, 700 MB (CD), 4 GB (FAT32 USB drive) or custom-sized parts.'],
  ['Safe extraction', 'Entries that try to leave the folder you chose (“zip slip”) are blocked and listed, links are never created, files are only put in place once their data checks out, nothing is overwritten without asking, and files from the internet keep Windows’ “downloaded” mark.'],
  ['A right-click menu', 'Compress to ZIP file, Compress to 7Z file, Add to archive…, Extract here, Extract to a new folder and more. Several selected files make one archive. On Windows 11 the menu is under “Show more options”.'],
  ['Keeps itself up to date', 'About 10 seconds after it starts, then at most once a day, Trove checks this site for a new version. Update now downloads the installer for your edition, checks its size and SHA-256 checksum, installs it and starts Trove again. Switch it off in Settings › Updates.'],
] as const;

export default function TroveDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'Trove',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Windows 7 SP1, 8.1, 10, 11',
    softwareVersion: troveArticle.version,
    datePublished: troveArticle.date,
    dateModified: troveArticle.released,
    softwareRequirements: 'Windows 10 and 11: none (self-contained). Windows 7 SP1 and 8.1: Microsoft .NET Framework 4.8.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/trove-social.jpg`,
    screenshot: `${siteUrl}${screenshots.archive.src}`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${troveArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page trove-page"><Header/><main id="main" className="pawsip-dl trove-dl shell">
    <header className="pawsip-dl-hero">
      <a href={troveArticle.path} className="jev-back">← THE TROVE FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE FOR WINDOWS</span><span>EVERY ARCHIVE. ONE TIDY APP.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download Trove<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">A free archive manager for Windows with a Windows 11 look, built on the official <span className="trove-nw">7-Zip</span> engine. Open ZIP, 7Z, RAR, TAR, ISO and many more, browse them like a folder, and make ZIP and 7Z archives with <span className="trove-nw">AES-256</span> passwords in a click.</p></div>
        <figure className="trove-dl-stage"><div className="trove-shot-stage"><img src={screenshots.archive.src} width={screenshots.archive.width} height={screenshots.archive.height} alt="Aurora Project.zip open in Trove: folders and files with sizes, ratios and types, and an Info pane" fetchPriority="high"/></div><figcaption>A real screenshot of Trove 1.0.0 on Windows 11, with demo files.</figcaption></figure>
        <div className="pawsip-dl-get">
          <TroveDownload/>
          <p className="pawsip-dl-release"><span>VERSION {troveArticle.version}</span><span>RELEASED <time dateTime={troveArticle.released}>13 OCTOBER 2026</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Other Windows versions and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>WINDOWS SUPPORT</span><strong>4<small>builds</small></strong><p>Windows 7 SP1, 8.1, 10 &amp; 11 · x64, ARM64 and 32-bit</p></div><div><span>ENGINE TESTS</span><strong>{engineTests}<small>tests</small></strong><p>Round trips, passwords, split archives, zip slip and RAR samples, on .NET 10 and .NET Framework 4.8</p></div><div><span>THE ENGINE</span><strong>{engine.version}<small>{engine.name}</small></strong><p>The official, unmodified 7z.dll, for x64, x86 and ARM64</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {troveArticle.version} · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Every installer.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {troveArticle.version}</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download Trove for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary><span className="trove-nw">SHA-256</span> checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong> on Windows 10 or 11, or <strong>Control Panel › System</strong> on Windows 7 and 8.1. It shows your Windows edition and system type. Most PCs need the first installer. Windows 8 needs the free update to 8.1 first. Windows XP and Vista aren&apos;t supported.</p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>02 / SYSTEM REQUIREMENTS</span><span>WINDOWS 7 SP1 TO 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{noWrap(detail)}</dd></div>)}</dl>
        <p className="jev-small-note">The {engineTests} engine tests pass on .NET 10 (64-bit) and on .NET Framework 4.8 as a 64- and a 32-bit process. I ran the 64-bit, 32-bit and Windows 7/8.1 (.NET Framework) builds on my Windows 11 PC, and installed and uninstalled for one user cleanly. The ARM64 edition is built natively for ARM, but I haven&apos;t run it on ARM hardware yet. I haven&apos;t run any build on an actual Windows 7 or 8.1 machine, or tested the all-users installation yet.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>03 / WHAT YOU GET</span><span>OPEN ANYTHING. ZIP IN A CLICK.</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">Every archive.<br/><em>One tidy app.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{noWrap(text)}</p></li>)}</ul>
        <p className="trove-dl-more"><a href={`${troveArticle.path}#safety`}>How Trove keeps extraction safe <Arrow/></a></p>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>04 / INSTALLING</span><span>FOR EVERYONE, OR JUST FOR YOU</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the <span className="trove-nw">SHA-256</span> checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Choose who it&apos;s for.</strong> All users is the default and needs administrator permission; only for you needs no administrator rights.</div></li>
          <li><div><strong>Pick the extras.</strong> Trove in <strong>Open with</strong> for archives and the <strong>right-click menu</strong> in File Explorer (both ticked), and a desktop shortcut.</div></li>
        </ol>
        <p>To make Trove the app that opens your archives, right-click one, choose <strong>Open with › Choose another app › Trove</strong> and tick <strong>Always</strong>. On Windows 11, the right-click commands are under <strong>Show more options</strong>. Installing a newer version, or another edition, replaces the one you have and keeps your settings.</p>
        <p>You won&apos;t need to do that by hand, though. Trove looks for a new version about 10 seconds after it starts and at most once a day, and <strong>Update now</strong> installs it over the one you have, then starts Trove again. If it&apos;s installed for all users, Windows asks for permission first. The check only downloads a small file from this site, <code>{updateFeed}</code>, with an ordinary web request; nothing about you or your files is sent. You can turn it off, or check yourself, in <strong>Settings › Updates</strong>.</p>
        <p>To remove Trove, uninstall it from <strong>Settings › Apps</strong>. That removes its files, menu entries and file-type registrations; your settings and recent archives stay in <code>%APPDATA%\Trove</code> in case you come back.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>05 / MORE ABOUT TROVE</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it works?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about why I built Trove, how it keeps extraction safe, what the right-click menu does, and what it took to talk to the <span className="trove-nw">7-Zip</span> engine directly from one app that runs on every Windows from 7 to 11.</p>
        <div className="jev-downloads"><a href={troveArticle.path}>Read the story behind Trove <Arrow/></a><a href={troveArticle.repoUrl} target="_blank" rel="noopener noreferrer">Trove on GitHub <Arrow diagonal/></a><a href={troveArticle.checksumsUrl} target="_blank" rel="noopener noreferrer"><span className="trove-nw">SHA-256</span> checksums file <Arrow diagonal/></a><a href={troveArticle.noticesUrl} target="_blank" rel="noopener noreferrer">Third-party notices <Arrow diagonal/></a></div>
        <p className="jev-small-note">Trove uses the <span className="trove-nw">7-Zip</span> engine (7z.dll) by Igor Pavlov under the GNU LGPL, with the unRAR licence restriction for the RAR decoder, which is why it can open RAR archives but never create them. Trove is an independent project, not affiliated with or endorsed by <span className="trove-nw">7-Zip</span>, Igor Pavlov or RARLAB.</p>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
