import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { noWrap } from '@/components/NoWrap';
import { InkwellDownload } from '@/components/InkwellDownload';
import { citationStyles, designs, downloadPage, downloadUrl, editions, fonts, formatSize, inkwellArticle, screenshots, templates, testing, updateFeed, wordCheck } from '@/data/inkwell';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/inkwell-social.jpg', width: 1200, height: 630, alt: 'Inkwell — write beautifully, without fighting your document. Free for Windows 7 to 11.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/inkwell-social.jpg'] },
};

/** "a, b and c" */
const and = (items: readonly string[]) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

const nw = (text: string) => noWrap(text, 'inkwell-nw');

const requirements = [
  ['Windows 10 & 11', 'x64 or ARM64, plus 32-bit Windows 10. Self-contained: nothing else to install.'],
  ['Windows 7 SP1 & 8.1', '32- or 64-bit. Uses Microsoft .NET Framework 4.8. If it’s missing, setup tells you and offers to open Microsoft’s download page.'],
  ['Windows 8', 'Needs the free update to Windows 8.1 first.'],
  ['Windows XP & Vista', 'Not supported. Inkwell needs Windows 7 Service Pack 1 or newer.'],
  ['Spell checking', 'Uses Windows’ own spell checker and the dictionaries installed in Windows, so it needs Windows 8 or later.'],
  ['Installation', 'For all users (the default; needs administrator permission) or only for you (no administrator rights needed).'],
] as const;

const features = [
  ['Word documents, kept intact', 'Opens and saves .docx (and .docm, .dotx and .dotm) directly. Parts Inkwell doesn’t edit, such as macros, charts and SmartArt, are kept exactly as they were, and it tells you when a file has them. Word 97–2003 .doc files aren’t supported.'],
  ['Beautiful by default', `${templates.length} templates, ${designs.length} designs that set fonts, colours and headings at once, and ${fonts.length} bundled font families, from Literata and Inter to Noto Nastaliq Urdu. A small, clear set of styles, and Update style when you like what you made.`],
  ['No ribbon', 'A slim command bar, an outline of your headings, the pages, and a panel that follows what you’re doing: Format, Picture or Table, then Page, Review, Reveal and Design. Press Ctrl+K for every command, or type / for the slash menu.'],
  ['Writing without friction', 'Markdown shortcuts and autocorrect, each undone by one Ctrl+Z, with a chip that offers Undo or Stop doing this. Paste takes your document’s look and keeps bold, italic, links, lists and tables; Ctrl+Shift+V pastes plain text.'],
  ['The fights, fixed', 'Pictures with wrap choices that preview, guides, a draggable anchor and Lock position. Lists that restart and continue when you say so. Reveal formatting and a style consistency check. Visible breaks and no stray blank last page. Tables that cooperate, one landscape page in one click, and click-to-edit headers and footers.'],
  ['Never lose work', 'Documents that have a file save themselves a few seconds after you stop typing, safely. Recovery copies of unsaved work, and version history you can browse, open and restore.'],
  ['Serious documents', `Tables of contents, footnotes and endnotes, captions and cross-references, bookmarks, and citations in ${and(citationStyles.map(style => style.replace(/ \(.*\)$/, '')))} with a bibliography. Comments with replies, and track changes with four views.`],
  ['Urdu and Arabic', 'Type Urdu or Arabic in an empty paragraph and it turns right to left by itself, in the bundled Noto Nastaliq Urdu or Noto Naskh Arabic. Lines that mix English and Urdu keep the right order.'],
  ['Focus', 'Focus mode (F11) fades everything but the paragraph you’re writing. Typewriter scrolling, a pageless view, pages side by side, live word counts and a word goal.'],
  ['PDF and other formats', 'Exports PDF with selectable, searchable text, bookmarks and links, plus Markdown, a web page and plain text, and prints through Windows. Opens Markdown, text, RTF, OpenDocument text and web pages.'],
  ['Keeps itself up to date', 'About 10 seconds after it starts, then at most once a day, Inkwell checks this site for a new version. Update now downloads the installer for your edition, checks its size and SHA-256 checksum, installs it and starts Inkwell again. Switch it off in Settings › Updates.'],
] as const;

export default function InkwellDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'Inkwell',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Word processor',
    operatingSystem: 'Windows 7 SP1, 8.1, 10, 11',
    softwareVersion: inkwellArticle.version,
    datePublished: inkwellArticle.date,
    dateModified: inkwellArticle.released,
    softwareRequirements: 'Windows 10 and 11: none (self-contained). Windows 7 SP1 and 8.1: Microsoft .NET Framework 4.8.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/inkwell-social.jpg`,
    screenshot: `${siteUrl}${screenshots.editor.src}`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${inkwellArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page inkwell-page"><Header/><main id="main" className="pawsip-dl inkwell-dl shell">
    <header className="pawsip-dl-hero">
      <a href={inkwellArticle.path} className="jev-back">← THE INKWELL FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE FOR WINDOWS</span><span>WRITE BEAUTIFULLY.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download Inkwell<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">A free word processor for Windows with a Windows 11 look and no ribbon. It opens and saves Word documents (.docx) and keeps what it doesn&apos;t edit, fixes the things that make word processors frustrating, writes Urdu and Arabic right to left, and exports PDF.</p></div>
        <figure className="inkwell-dl-stage"><div className="inkwell-shot-stage"><img src={screenshots.editor.src} width={screenshots.editor.width} height={screenshots.editor.height} alt="Inkwell’s editor: the outline on the left, the first page of an annual report with its contents, and the Format panel on the right" fetchPriority="high"/></div><figcaption>A real screenshot of Inkwell {screenshots.editor.version} on Windows 11, with a demo document.</figcaption></figure>
        <div className="pawsip-dl-get">
          <InkwellDownload/>
          <p className="pawsip-dl-release"><span>VERSION {inkwellArticle.version}</span><span>RELEASED <time dateTime={inkwellArticle.released}>{inkwellArticle.releasedLabel}</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Other Windows versions and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>WINDOWS SUPPORT</span><strong>4<small>builds</small></strong><p>Windows 7 SP1, 8.1, 10 &amp; 11 · x64, ARM64 and 32-bit</p></div><div><span>ENGINE TESTS</span><strong>{testing.engineTests}<small>tests</small></strong><p>.docx, layout, editing, paste, formats, PDF and citations, on .NET 10 and .NET Framework 4.8</p></div><div><span>CHECKED IN WORD</span><strong>{wordCheck.matched}<small>of {wordCheck.values}</small></strong><p>Values Word counted the same as Inkwell (pages, words, tables, pictures, notes and more) in {wordCheck.documents} documents</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {inkwellArticle.version} · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Every installer.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {inkwellArticle.version}</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download Inkwell for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary><span className="inkwell-nw">SHA-256</span> checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong> on Windows 10 or 11, or <strong>Control Panel › System</strong> on Windows 7 and 8.1. It shows your Windows edition and system type. Most PCs need the first installer. Windows 8 needs the free update to 8.1 first. Windows XP and Vista aren&apos;t supported.</p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>02 / SYSTEM REQUIREMENTS</span><span>WINDOWS 7 SP1 TO 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{nw(detail)}</dd></div>)}</dl>
        <p className="jev-small-note">What I tested: the {testing.engineTests} engine tests pass on .NET 10 and on .NET Framework 4.8; I ran the capture mode&apos;s {testing.smokeChecks} end-to-end checks on the {testing.smokeBuilds} builds on my Windows 11 PC, installed and uninstalled for one user ({testing.installerChecks} checks), and opened {wordCheck.documents} saved documents in Microsoft Word. Not tested yet: {and(testing.untested)}.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>03 / WHAT YOU GET</span><span>WITHOUT FIGHTING YOUR DOCUMENT.</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">Write beautifully.<br/><em>Without the fight.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{nw(text)}</p></li>)}</ul>
        <p className="inkwell-dl-more"><a href={`${inkwellArticle.path}#formats`}>What Inkwell does with every part of a Word file <Arrow/></a></p>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>04 / INSTALLING</span><span>FOR EVERYONE, OR JUST FOR YOU</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the <span className="inkwell-nw">SHA-256</span> checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Choose who it&apos;s for.</strong> All users is the default and needs administrator permission; only for you needs no administrator rights.</div></li>
          <li><div><strong>Pick the extras.</strong> Inkwell in <strong>Open with</strong> for Word documents (.docx) and Markdown files (.md), both ticked, and a desktop shortcut. Inkwell never makes itself the default app: Word, or whatever you use, keeps opening your documents on a double-click.</div></li>
        </ol>
        <p>Installing a newer version, or another edition, replaces the one you have and keeps your settings. You won&apos;t need to do that by hand, though. Inkwell looks for a new version about 10 seconds after it starts and at most once a day, and <strong>Update now</strong> installs it over the one you have, then starts Inkwell again. If it&apos;s installed for all users, Windows asks for permission first; if you installed it in a folder of your own, version {inkwellArticle.version} opens this page instead. The check only downloads a small file from this site, <code>{updateFeed}</code>, with an ordinary web request; nothing about you or your documents is sent. You can turn it off, or check yourself, in <strong>Settings › Updates</strong>.</p>
        <p>To remove Inkwell, uninstall it from <strong>Settings › Apps</strong>. That removes its files and its Open with entries; your settings stay in <code>%APPDATA%\Inkwell</code>, and version history and recovery copies in <code>%LOCALAPPDATA%\Inkwell</code>, in case you come back.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>05 / MORE ABOUT INKWELL</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it works?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about why I built Inkwell, the twelve things it fixes, how it keeps Word files intact (and where it doesn&apos;t yet), how it writes Urdu and Arabic, and how its own layout engine runs on every Windows from 7 to 11.</p>
        <div className="jev-downloads"><a href={inkwellArticle.path}>Read the story behind Inkwell <Arrow/></a><a href={inkwellArticle.repoUrl} target="_blank" rel="noopener noreferrer">Inkwell on GitHub <Arrow diagonal/></a><a href={inkwellArticle.checksumsUrl} target="_blank" rel="noopener noreferrer"><span><span className="inkwell-nw">SHA-256</span> checksums file</span> <Arrow diagonal/></a><a href={inkwellArticle.noticesUrl} target="_blank" rel="noopener noreferrer">Third-party notices <Arrow diagonal/></a></div>
        <p className="jev-small-note">Inkwell uses Microsoft&apos;s Open XML SDK (MIT) for .docx files, PDFsharp (MIT) for PDF export, Markdig (BSD-2-Clause) for Markdown, Microsoft&apos;s Fluent UI System Icons (MIT), and {fonts.length} font families under the SIL Open Font License 1.1. Inkwell is an independent project, not affiliated with or endorsed by Microsoft or any of them. Microsoft Word and Microsoft Office are trademarks of Microsoft Corporation.</p>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
