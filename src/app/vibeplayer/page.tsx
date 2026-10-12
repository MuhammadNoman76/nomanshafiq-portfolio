import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { FootageCredit } from '@/components/FootageCredit';
import { Arrow } from '@/components/Icons';
import { VibePlayerDownload } from '@/components/VibePlayerDownload';
import { downloadPage, downloadUrl, editions, fileTypes, formatSize, vibeplayerArticle } from '@/data/vibeplayer';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/vibeplayer-social.jpg', width: 1200, height: 630, alt: 'VibePlayer — skip the scenes you don’t want to see. Free for Windows 7 to 11.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/vibeplayer-social.jpg'] },
};

const requirements = [
  ['Windows 10 & 11', 'x64 or ARM64, plus 32-bit Windows 10. Self-contained: nothing else to install. Each installer carries the VLC engine for its processor.'],
  ['Windows 7 SP1 & 8.1', '32- or 64-bit. Uses Microsoft .NET Framework 4.8. If it’s missing, setup tells you and offers to open Microsoft’s download page. Setup installs the 32- or 64-bit VLC engine that matches Windows.'],
  ['Windows 8', 'Needs the free update to Windows 8.1 first.'],
  ['Windows XP & Vista', 'Not supported. VibePlayer needs Windows 7 Service Pack 1 or newer.'],
  ['Installation', 'For all users (the default; needs administrator permission) or only for you (no administrator rights needed).'],
] as const;

const features = [
  ['Skip mode', 'Mark the parts you don’t want to see, by typing the times or pressing [ and ] while you watch. They show in amber on the progress bar and are skipped every time that file plays. The file itself is never changed.'],
  ['Hold for 2x', 'Press and hold the right side of the video, or hold the right mouse button, to play at double speed. Let go to return to your speed.'],
  ['A familiar player', 'A YouTube-style interface: red progress bar with hover time, pill buttons, autoplay, captions, miniplayer and full screen, and the keyboard shortcuts you already know.'],
  ['One tidy menu', 'Loop, playback speed, subtitles, audio track, aspect ratio, brightness, skip scenes and snapshots, all in the settings menu.'],
  ['Plays almost anything', `${fileTypes.video} video and ${fileTypes.audio} audio file types through LibVLC, the engine inside VLC. Drop a subtitle file on a video to add it, or open a network stream.`],
  ['Picks up where you left off', 'Long videos resume where you stopped. Recent files wait on the start screen, and the rest of the folder plays next.'],
] as const;

export default function VibePlayerDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'VibePlayer',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows 7 SP1, 8.1, 10, 11',
    softwareVersion: vibeplayerArticle.version,
    datePublished: vibeplayerArticle.date,
    softwareRequirements: 'Windows 10 and 11: none (self-contained). Windows 7 SP1 and 8.1: Microsoft .NET Framework 4.8.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/vibeplayer-social.jpg`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${vibeplayerArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page vibe-page"><Header/><main id="main" className="pawsip-dl vibe-dl shell">
    <header className="pawsip-dl-hero">
      <a href={vibeplayerArticle.path} className="jev-back">← THE VIBEPLAYER FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE FOR WINDOWS</span><span>WATCH IT YOUR WAY.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download VibePlayer<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">A free media player for Windows on the VLC engine, with a YouTube-style interface. Mark the parts of a video you don&apos;t want to see, and it jumps over them every time, without changing the file.</p></div>
        <figure className="vibe-dl-stage"><img src="/art/vibeplayer-dialog.jpg" width="1600" height="958" alt="VibePlayer’s “Skip a part of this video” dialog over Big Buck Bunny, set to skip from 2:31 to 3:48" fetchPriority="high"/><figcaption>The skip dialog, recreated from VibePlayer&apos;s interface code. <FootageCredit/></figcaption></figure>
        <div className="pawsip-dl-get">
          <VibePlayerDownload/>
          <p className="pawsip-dl-release"><span>VERSION {vibeplayerArticle.version}</span><span>RELEASED <time dateTime={vibeplayerArticle.date}>12 OCTOBER 2026</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Other Windows versions and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>WINDOWS SUPPORT</span><strong>4<small>builds</small></strong><p>Windows 7 SP1, 8.1, 10 &amp; 11 · x64, ARM64 and 32-bit</p></div><div><span>SKIP CHECK</span><strong>40<small>ms</small></strong><p>How often the player looks for a marked part while a video plays</p></div><div><span>OPENS</span><strong>{fileTypes.video + fileTypes.audio}<small>file types</small></strong><p>{fileTypes.video} video and {fileTypes.audio} audio formats, plus subtitle files</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {vibeplayerArticle.version} · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Every installer.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {vibeplayerArticle.version}</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download VibePlayer for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary>SHA-256 checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong> on Windows 10 or 11, or <strong>Control Panel › System</strong> on Windows 7 and 8.1. It shows your Windows edition and system type. Most PCs need the first installer. Windows 8 needs the free update to 8.1 first. Windows XP and Vista aren&apos;t supported.</p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>02 / SYSTEM REQUIREMENTS</span><span>WINDOWS 7 SP1 TO 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl>
        <p className="jev-small-note">I ran the 64-bit, 32-bit and Windows 7/8.1 (.NET Framework) builds on my Windows 11 PC, playing video, and installed and uninstalled the Windows 7/8.1 edition silently. The ARM64 edition is built natively for ARM, but I haven&apos;t run it on ARM hardware yet, and it ships without VLC&apos;s prebuilt plugin cache, so it starts a little slower. I haven&apos;t run any build on an actual Windows 7 or 8.1 machine.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>03 / WHAT YOU GET</span><span>A FAMILIAR PLAYER. ONE NEW TRICK.</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">Skip what you<br/><em>don&apos;t want to see.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></li>)}</ul>
        <p className="vibe-dl-try"><a href={`${vibeplayerArticle.path}#try`}>Try skip mode in your browser <Arrow/></a></p>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>04 / INSTALLING</span><span>FOR EVERYONE, OR JUST FOR YOU</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the SHA-256 checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Choose who it&apos;s for.</strong> All users is the default and needs administrator permission; only for you needs no administrator rights.</div></li>
          <li><div><strong>Pick the extras.</strong> A desktop icon, VibePlayer in <strong>Open with</strong> for video and audio files, and <strong>Play with VibePlayer</strong> on the folder right-click menu.</div></li>
        </ol>
        <p>To make VibePlayer your default player, right-click a video, choose <strong>Open with › Choose another app › VibePlayer</strong> and tick <strong>Always</strong>. Installing a newer version, or another edition, replaces the one you have and keeps your settings. To remove VibePlayer, uninstall it from <strong>Settings › Apps</strong>. Your settings, resume positions and skips stay in <code>%APPDATA%\VibePlayer</code> in case you come back.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>05 / MORE ABOUT VIBEPLAYER</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it works?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about why I built VibePlayer, how skip mode works, and what it took to run one player on every Windows from 7 to 11. There&apos;s an interactive demo of skip mode, too.</p>
        <div className="jev-downloads"><a href={vibeplayerArticle.path}>Read the story behind VibePlayer <Arrow/></a><a href={vibeplayerArticle.repoUrl} target="_blank" rel="noopener noreferrer">View the source on GitHub <Arrow diagonal/></a><a href={vibeplayerArticle.checksumsUrl} target="_blank" rel="noopener noreferrer">SHA-256 checksums file <Arrow diagonal/></a><a href={`${vibeplayerArticle.repoUrl}#readme`} target="_blank" rel="noopener noreferrer">Read the README <Arrow diagonal/></a></div>
        <p className="jev-small-note">VibePlayer uses LibVLC, the open-source engine of the VLC project, under the LGPL. It is not affiliated with or endorsed by VideoLAN. The image above is a recreation of the app&apos;s interface, not a screenshot.</p>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
