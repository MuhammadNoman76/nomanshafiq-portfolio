import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { noWrap } from '@/components/NoWrap';
import { StagecraftDownload } from '@/components/StagecraftDownload';
import { animations, downloadPage, downloadUrl, editions, fonts, formatSize, iconCount, layouts, media, screenshots, stagecraftArticle, testing, themes, transitions, updateFeed, variantsPerTheme, whatsNew } from '@/data/stagecraft';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/stagecraft-social.jpg', width: 1200, height: 630, alt: 'Stagecraft — presentations that look designed, without the effort. Free for Windows 7 to 11.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/stagecraft-social.jpg'] },
};

/** "a, b and c" */
const and = (items: readonly string[]) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

const nw = (text: string) => noWrap(text, 'stagecraft-nw');

const effectCount = animations.entrance.length + animations.emphasis.length + animations.exit.length;

const requirements = [
  ['Windows 10 & 11', 'x64 or ARM64, plus 32-bit Windows 10. Self-contained: nothing else to install.'],
  ['Windows 7 SP1 & 8.1', '32- or 64-bit. Uses Microsoft .NET Framework 4.8. If it’s missing, setup tells you and offers to open Microsoft’s download page.'],
  ['Windows 8', 'Needs the free update to Windows 8.1 first.'],
  ['Windows XP & Vista', 'Not supported. Stagecraft needs Windows 7 Service Pack 1 or newer.'],
  ['Video and sound', 'Played by Windows’ own media support, so nothing extra is installed. MP4 with H.264 / AAC is the safest choice. Windows “N” editions need Microsoft’s Media Feature Pack first.'],
  ['Installation', 'For all users (the default; needs administrator permission) or only for you (no administrator rights needed).'],
] as const;

const features = [
  ['Beautiful by default', `${themes.length} themes (${and(themes.map(theme => theme.name))}), each with ${variantsPerTheme} colour variants and its own typography, backgrounds and decorations. Switching theme re-lays every slide and keeps your words.`],
  ['Smart layouts', `${layouts.length} of them, from Title and Big number to Timeline, Comparison and Team. Change a slide’s layout at any time; its title, text and pictures move along.`],
  ['Text that fits, things that line up', 'Long text in a layout’s boxes shrinks to fit (Shrink text to fit can be switched per box), and titles wrap into balanced lines. Smart guides snap to edges, centres, margins and equal spacing, Tidy up (Ctrl+Alt+T) makes a neat row, column or grid, and rulers, gridlines and guides help with exact work.'],
  ['No ribbon', 'A slim command bar, the slide rail, the canvas and a properties panel that shows only what applies. Everything else is in the command palette: press Ctrl+K and type.'],
  ['Charts, tables, icons and pictures', `Bar, line, pie and donut charts from a small data grid (paste rows from a spreadsheet), tables with a header row and banding, ${iconCount.toLocaleString('en-US')} Fluent UI System Icons in the theme’s colours, shapes and connectors, and pictures you can crop with handles or to a circle.`],
  ['Morph and animations', `${and(transitions)} transitions; Morph glides the same object from one slide to the next. ${effectCount} animation effects and motion paths, with an animation pane, a timeline and a gallery that previews each effect on the slide.`],
  ['Links, video and sound', `Links to web pages, e-mail, slides and files, with safety checks. Video and sound on the slide, stored in the presentation (or linked above ${media.linkOfferMB} MB), with trim, fades and sound across slides.`],
  ['A presenter view', 'With two displays: your notes, the next slide, which click you’re on, a timer, the clock and a slide grid on your screen while the audience sees the slides. Laser, pen, highlighter, black and white screens, clickers and rehearse timings.'],
  ['PDF, pictures and PowerPoint', 'Vector PDF with selectable text and working links, PNG and JPG up to 3840 pixels wide, and .pptx export and import that carry animations, links, video and sound, with their limits stated in the field note. Your .stagecraft files are saved safely, and automatically once they have a file, with a recovery copy of unsaved work.'],
  ['Fonts included', `${and(fonts)}: ${fonts.length} families under the SIL Open Font License, used by Stagecraft only and never installed into Windows.`],
  ['Keeps itself up to date', 'About 10 seconds after it starts, then at most once a day, Stagecraft checks this site for a new version. Update now downloads the installer for your edition, checks its size and SHA-256 checksum, installs it and starts Stagecraft again. Switch it off in Settings › Updates.'],
] as const;

export default function StagecraftDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'Stagecraft',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Presentation software',
    operatingSystem: 'Windows 7 SP1, 8.1, 10, 11',
    softwareVersion: stagecraftArticle.version,
    datePublished: stagecraftArticle.date,
    dateModified: stagecraftArticle.released,
    softwareRequirements: 'Windows 10 and 11: none (self-contained). Windows 7 SP1 and 8.1: Microsoft .NET Framework 4.8.',
    releaseNotes: `${pageUrl}#whats-new`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/stagecraft-social.jpg`,
    screenshot: `${siteUrl}${screenshots.editor.src}`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${stagecraftArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page stagecraft-page"><Header/><main id="main" className="pawsip-dl stagecraft-dl shell">
    <header className="pawsip-dl-hero">
      <a href={stagecraftArticle.path} className="jev-back">← THE STAGECRAFT FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE FOR WINDOWS</span><span>DESIGNED BY DEFAULT.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download Stagecraft<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">A free presentation app for Windows with a Windows 11 look and no ribbon. Pick a theme, type your talk, and smart layouts, text that fits and Morph transitions make every slide look designed. Add animations, links, video and sound, present with a presenter view, and export PDF, pictures or PowerPoint.</p></div>
        <figure className="stagecraft-dl-stage"><div className="stagecraft-shot-stage"><img src={screenshots.editor.src} width={screenshots.editor.width} height={screenshots.editor.height} alt="Stagecraft’s editor: the slide rail on the left, a Big number slide reading “3x faster onboarding is our goal” on the canvas, and the layouts in the properties panel" fetchPriority="high"/></div><figcaption>A real screenshot of Stagecraft {screenshots.editor.version} on Windows 11, with a sample deck.</figcaption></figure>
        <div className="pawsip-dl-get">
          <StagecraftDownload/>
          <p className="pawsip-dl-release"><span>VERSION {stagecraftArticle.version}</span><span>RELEASED <time dateTime={stagecraftArticle.released}>{stagecraftArticle.releasedLabel}</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Other Windows versions and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>WINDOWS SUPPORT</span><strong>4<small>builds</small></strong><p>Windows 7 SP1, 8.1, 10 &amp; 11 · x64, ARM64 and 32-bit</p></div><div><span>ENGINE TESTS</span><strong>{testing.engineTests}<small>tests</small></strong><p>Files, PowerPoint, rendering, animation, links, media and Morph, on .NET 10 and .NET Framework 4.8</p></div><div><span>DESIGN</span><strong>{themes.length}<small>themes</small></strong><p>{variantsPerTheme} colour variants each, {layouts.length} smart layouts and {fonts.length} bundled font families</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {stagecraftArticle.version} · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Every installer.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {stagecraftArticle.version}</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download Stagecraft for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary><span className="stagecraft-nw">SHA-256</span> checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong> on Windows 10 or 11, or <strong>Control Panel › System</strong> on Windows 7 and 8.1. It shows your Windows edition and system type. Most PCs need the first installer. Windows 8 needs the free update to 8.1 first. Windows XP and Vista aren&apos;t supported.</p>
      </div></div>
    </section>

    <section id="whats-new" className="pawsip-dl-section" aria-labelledby="whats-new-heading">
      <div className="section-eyebrow"><span>02 / WHAT&apos;S NEW IN 1.1</span><span>RELEASED <time dateTime={stagecraftArticle.released}>{stagecraftArticle.releasedLabel}</time></span></div>
      <div className="pawsip-dl-cols"><h2 id="whats-new-heading">What&apos;s new<br/><em>in 1.1.</em></h2><div className="pawsip-dl-body jev-prose">
        <p>Stagecraft 1.1 adds animations, links, and video and sound, plus a set of everyday editing tools. If you have 1.0, it offers the update by itself (unless you switched the update check off); your presentations open with their builds turned into the same animations.</p>
        <ul className="pawsip-dl-features stagecraft-dl-new">{whatsNew.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{nw(text)}</p></li>)}</ul>
        <p className="stagecraft-dl-more"><a href={`${stagecraftArticle.path}#animations`}>See the new features in the field note <Arrow/></a></p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>03 / SYSTEM REQUIREMENTS</span><span>WINDOWS 7 SP1 TO 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{nw(detail)}</dd></div>)}</dl>
        <p className="jev-small-note">What I tested: the {testing.engineTests} engine tests pass on .NET 10 and on .NET Framework 4.8; I ran the {testing.smokeCommands}-command smoke run on the {testing.smokeBuilds} builds on my Windows 11 PC, and played {and(media.checked)} files. Not tested yet: {and(testing.untested)}.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>04 / WHAT YOU GET</span><span>PICK A THEME. TYPE YOUR TALK.</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">Slides that look designed.<br/><em>Without the effort.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{nw(text)}</p></li>)}</ul>
        <p className="stagecraft-dl-more"><a href={`${stagecraftArticle.path}#files`}>What PowerPoint import and export can and can&apos;t do <Arrow/></a></p>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>05 / INSTALLING</span><span>FOR EVERYONE, OR JUST FOR YOU</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the <span className="stagecraft-nw">SHA-256</span> checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Choose who it&apos;s for.</strong> All users is the default and needs administrator permission; only for you needs no administrator rights.</div></li>
          <li><div><strong>Pick the extras.</strong> Open <strong>.stagecraft</strong> files with Stagecraft, and Stagecraft in <strong>Open with</strong> for PowerPoint files (both ticked; a .pptx opened this way is imported as a copy), and a desktop shortcut.</div></li>
        </ol>
        <p>Installing a newer version, or another edition, replaces the one you have and keeps your settings. You won&apos;t need to do that by hand, though. Stagecraft looks for a new version about 10 seconds after it starts and at most once a day, and <strong>Update now</strong> installs it over the one you have, then starts Stagecraft again. If it&apos;s installed for all users, Windows asks for permission first. The check only downloads a small file from this site, <code>{updateFeed}</code>, with an ordinary web request; nothing about you or your presentations is sent. You can turn it off, or check yourself, in <strong>Settings › Updates</strong>.</p>
        <p>To remove Stagecraft, uninstall it from <strong>Settings › Apps</strong>. That removes its files and file-type registrations; your settings and recovery copies stay in <code>%APPDATA%\Stagecraft</code> in case you come back.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>06 / MORE ABOUT STAGECRAFT</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it works?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about why I built Stagecraft, how its themes, layouts, Morph and animations work, what the presenter view does, how honest its PowerPoint support is, and what it took to make one app that runs on every Windows from 7 to 11.</p>
        <div className="jev-downloads"><a href={stagecraftArticle.path}>Read the story behind Stagecraft <Arrow/></a><a href={stagecraftArticle.repoUrl} target="_blank" rel="noopener noreferrer">Stagecraft on GitHub <Arrow diagonal/></a><a href={stagecraftArticle.checksumsUrl} target="_blank" rel="noopener noreferrer"><span className="stagecraft-nw">SHA-256</span> checksums file <Arrow diagonal/></a><a href={stagecraftArticle.noticesUrl} target="_blank" rel="noopener noreferrer">Third-party notices <Arrow diagonal/></a></div>
        <p className="jev-small-note">Stagecraft uses Microsoft&apos;s Open XML SDK (MIT) for PowerPoint files, PDFsharp (MIT) for PDF export, Microsoft&apos;s Fluent UI System Icons (MIT), and {fonts.length} font families under the SIL Open Font License 1.1. Stagecraft is an independent project, not affiliated with or endorsed by any of them. PowerPoint and Office are trademarks of Microsoft Corporation.</p>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
