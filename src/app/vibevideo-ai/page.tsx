import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { ReelCredit } from '@/components/ReelCredit';
import { VibeVideoAiDownload } from '@/components/VibeVideoAiDownload';
import { downloadPage, downloadUrl, editions, formatSize, fullHdSpeed, models, updateFeed, vibevideoArticle } from '@/data/vibevideo-ai';
import { downloadPage as vibeplayerDownloadPage } from '@/data/vibeplayer';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/vibevideo-ai-social.jpg', width: 1200, height: 630, alt: 'VibeVideo AI — finds the scenes you’d rather skip, and skips them. Free preview for Windows 10 and 11.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/vibevideo-ai-social.jpg'] },
};

const requirements = [
  ['Windows 10 & 11', '64-bit Windows 10, version 1903 or later, or Windows 11, on an x64 or ARM64 PC. Self-contained: nothing else to install.'],
  ['Chips', 'Any PC works. An NPU is used first if there is one, then the graphics card (any DirectX 12 GPU), then the CPU.'],
  ['Disk and internet', `About ${Math.round(models.clipFp16.bytes / 1_000_000)} MB for the scene model on an NPU or graphics card, ${Math.round(models.clipFp32.bytes / 1_000_000)} MB on the CPU, downloaded once on the first scan. Scans then work offline.`],
  ['32-bit, Windows 7 & 8.1', 'Not supported: Windows ML, which runs the AI, doesn’t exist there. VibePlayer runs on them, with skip mode by hand.'],
  ['Installation', 'For all users (needs administrator permission) or only for you (no administrator rights needed). It installs beside VibePlayer, never over it.'],
] as const;

const features = [
  ['Finds the scenes', 'Open a video and VibeVideo AI looks through it on your PC, two pictures for every second of film, starting where you are watching. Scenes with nudity, sex or kissing turn pink on the progress bar.'],
  ['Skips them', 'When playback reaches a pink part, the player jumps to its end and says so: “Skipped a scene (AI filter)”.'],
  ['Your choice of what and how strict', 'Switch nudity and sex, or kissing, on or off. Low, Medium or High sensitivity, changed at any time without a new scan.'],
  ['Don’t skip', 'Every found scene is listed in the menu with its times. One click keeps a scene you’d like to see.'],
  ['On your own PC', `Nothing is uploaded, and the file is never changed. It uses the NPU if there is one: on my laptop it scans full-HD video at about ${fullHdSpeed}× real time.`],
  ['Everything VibePlayer does', 'The YouTube-style player, hold for 2x, the mouse-wheel tricks, resume, and skip mode for the parts you mark yourself.'],
] as const;

export default function VibeVideoAiDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'VibeVideo AI',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows 10 (1903 or later), Windows 11 (x64, ARM64)',
    softwareVersion: vibevideoArticle.version,
    datePublished: vibevideoArticle.date,
    dateModified: vibevideoArticle.released,
    softwareRequirements: '64-bit Windows 10 version 1903 or later, or Windows 11. The AI models download on first use.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/vibevideo-ai-social.jpg`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${vibevideoArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page vibe-page vv-page"><Header/><main id="main" className="pawsip-dl vibe-dl shell">
    <header className="pawsip-dl-hero">
      <a href={vibevideoArticle.path} className="jev-back">← THE VIBEVIDEO AI FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE PREVIEW FOR WINDOWS</span><span>IT FINDS THE SCENES. YOU DECIDE.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download VibeVideo AI<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">VibePlayer with an AI scene filter that runs on your own PC. It finds scenes with nudity, sex or kissing, marks them in pink, and skips them. Nothing is uploaded, and the file is never changed.</p></div>
        <figure className="vibe-dl-stage"><img src="/art/vibevideo-ai-scan.jpg" width="1600" height="958" alt="VibeVideo AI playing a black-and-white film, with the pill “AI scan 64% · 35x · NPU” at the top left and a pink part on the progress bar" fetchPriority="high"/><figcaption>A scan in progress, recreated from VibeVideo AI&apos;s interface code. <ReelCredit/></figcaption></figure>
        <div className="pawsip-dl-get">
          <VibeVideoAiDownload/>
          <p className="pawsip-dl-release"><span>VERSION {vibevideoArticle.version} · PREVIEW</span><span>RELEASED <time dateTime={vibevideoArticle.released}>18 OCTOBER 2026</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Both installers and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>LOOKS AT</span><strong>2<small>frames / s</small></strong><p>Two pictures for every second of film, scored on your PC</p></div><div><span>FULL-HD SCAN</span><strong>{fullHdSpeed}×<small>real time</small></strong><p>On my laptop&apos;s NPU (Intel AI Boost)</p></div><div><span>UPLOADED</span><strong>0<small>bytes</small></strong><p>The video never leaves your PC</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {vibevideoArticle.version} PREVIEW · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Two installers.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {vibevideoArticle.version} preview</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download VibeVideo AI for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary>SHA-256 checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong>. If the system type says x64-based processor, take the first installer; ARM-based, the second. On 32-bit Windows, Windows 7 or 8.1, use <a href={vibeplayerDownloadPage.path}>VibePlayer</a> instead.</p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>02 / SYSTEM REQUIREMENTS</span><span>64-BIT WINDOWS 10 & 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl>
        <p className="jev-small-note">I tested it on my Windows 11 laptop (Intel Core Ultra 5 135U), where the NPU, the Intel graphics and the CPU all ran the scan. The ARM64 edition is built natively for ARM, but I haven&apos;t run it on ARM hardware yet. AMD and Qualcomm NPUs, discrete NVIDIA or AMD graphics cards, and Windows 10 itself are untested too.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>03 / WHAT YOU GET</span><span>A FAMILIAR PLAYER. A NEW PAIR OF EYES.</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">It finds the scenes.<br/><em>You decide.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></li>)}</ul>
      </div></div>
    </section>

    <section id="preview" className="pawsip-dl-section" aria-labelledby="preview-heading">
      <div className="section-eyebrow"><span>04 / AN EARLY PREVIEW</span><span>WHAT TO EXPECT</span></div>
      <div className="pawsip-dl-cols"><h2 id="preview-heading">Good, not perfect.<br/><em>Yet.</em></h2><div className="pawsip-dl-body jev-prose">
        <p>This is version 0.1. It can miss a scene, especially a dark or quick one, and it can mark a harmless one: at High sensitivity it once marked five seconds of a 1951 civil defence film for schools. The pink marks are there so you can see what it found before it skips, and <strong>Don&apos;t skip</strong> keeps any scene you choose.</p>
        <p>It isn&apos;t parental control: anyone at the PC can switch it off. It scans files on your PC, not network streams. The optional extra nudity detector, NudeNet, is off by default because of its AGPL-3.0 licence; switching it on downloads it ({formatSize(models.nudenet.bytes)}).</p>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>05 / INSTALLING</span><span>FOR EVERYONE, OR JUST FOR YOU</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the SHA-256 checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Choose who it&apos;s for, and the extras.</strong> A desktop icon, VibeVideo AI in <strong>Open with</strong> for video and audio files, and <strong>Play with VibeVideo AI</strong> on the folder right-click menu.</div></li>
          <li><div><strong>Open a video.</strong> The first scan downloads the scene model once, and on an NPU it can take up to a minute to prepare. The pill at the top left shows what it&apos;s doing.</div></li>
        </ol>
        <p>VibeVideo AI keeps itself up to date. Shortly after it starts, and at most once a day, it reads a small file from this site, <code>{updateFeed}</code>, with an ordinary web request; nothing about you or your videos is sent. If there&apos;s a newer version, <strong>Update now</strong> downloads it, checks its SHA-256 checksum and installs it. Turn the check off in <strong>Settings › Updates</strong>.</p>
        <p>To remove it, uninstall it from <strong>Settings › Apps</strong>. That deletes the downloaded models and saved scans in <code>%LOCALAPPDATA%\VibeVideoAI</code>; your settings stay in <code>%APPDATA%\VibeVideoAI</code>.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>06 / MORE ABOUT VIBEVIDEO AI</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it decides?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about how it looks at a film, the real scores behind one found scene, the speed on each chip, and what it still gets wrong. There&apos;s a 77-second launch video, too.</p>
        <div className="jev-downloads"><a href={vibevideoArticle.path}>Read the story behind VibeVideo AI <Arrow/></a><a href={vibevideoArticle.repoUrl} target="_blank" rel="noopener noreferrer">View the source on GitHub <Arrow diagonal/></a><a href={vibevideoArticle.checksumsUrl} target="_blank" rel="noopener noreferrer">SHA-256 checksums file <Arrow diagonal/></a></div>
        <p className="jev-small-note">VibeVideo AI uses LibVLC, the open-source engine of the VLC project, under the LGPL, and CLIP ViT-B/32 by OpenAI under the MIT licence. It is not affiliated with or endorsed by VideoLAN or OpenAI. The image above is a recreation of the app&apos;s interface, not a screenshot.</p>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
