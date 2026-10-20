import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { MakeItColorCredit } from '@/components/MakeItColorCredit';
import { MakeItColorDownload } from '@/components/MakeItColorDownload';
import { colorSpeeds, downloadPage, downloadUrl, editions, formatSize, jobs, makeitcolorArticle, models, photoFormats, updateFeed, videoFormats } from '@/data/makeitcolor';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: downloadPage.title,
  description: downloadPage.description,
  alternates: { canonical: downloadPage.path },
  openGraph: { type: 'website', title: downloadPage.title, description: downloadPage.description, url: downloadPage.path, images: [{ url: '/art/makeitcolor-social.jpg', width: 1200, height: 630, alt: 'MakeItColor — old photos and films, in colour and restored. On your own PC.' }] },
  twitter: { card: 'summary_large_image', title: downloadPage.title, description: downloadPage.description, images: ['/art/makeitcolor-social.jpg'] },
};

const requirements = [
  ['Windows 10 & 11', '64-bit Windows 10, version 1903 or later, or Windows 11, on an x64 or ARM64 PC. Self-contained: nothing else to install.'],
  ['Chips', 'Any PC works. The NPU is used first if there is one, then the best graphics card, then the CPU. Each chip is checked with a test picture before it’s used.'],
  ['Disk and internet', `About 1 GB free. The colour model downloads once, the first time it’s needed: ${formatSize(models.colorFp16.bytes)} for an NPU or graphics card, ${formatSize(models.colorFp32.bytes)} for the CPU, each checked against its SHA-256. The enhancer (${models.enhancer.sizes}) comes with the app.`],
  ['HEIC photos', 'Need Microsoft’s HEIF Image Extensions: Windows reads them, not the app.'],
  ['32-bit, Windows 7 & 8.1', 'Not supported: Windows ML, which runs the models, doesn’t exist there.'],
  ['Installation', 'For all users (needs administrator permission) or only for you (no administrator rights needed).'],
] as const;

const features = [
  ['Colours photos and videos', `Photos in ${photoFormats.join(', ')}; videos in ${videoFormats.join(', ')}. Drop files or a whole folder, or choose them.`],
  ['Full size, full detail', 'The colour model works on the picture’s lightness at 512 × 512; the colour is then enlarged and lined up with the edges, so the result keeps the original’s full resolution.'],
  ['Fixes brightness and contrast', 'Faded and dull pictures get deep blacks and clean whites again. In videos it also takes out the flicker of old film.'],
  ['Enhances photos', 'A small model (Real-ESRGAN) takes out blur, noise and JPEG damage, and makes photos under 2000 pixels 2× or 4× larger.'],
  ['Cleans up and steadies films', 'Full clean-up runs the enhancer on every frame; Light takes out grain on any CPU. Steady colours keeps colours from flickering where the picture doesn’t change.'],
  ['You stay in charge', 'A before/after divider, a colour strength slider from 50 % to 150 %, and every result saved as a new file: PNG, JPEG or H.264 MP4. The originals are never changed.'],
] as const;

export default function MakeItColorDownloadPage() {
  const pageUrl = `${siteUrl}${downloadPage.path}`;
  const npu = colorSpeeds[0];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#app`,
    name: 'MakeItColor',
    url: pageUrl,
    description: downloadPage.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows 10 (1903 or later), Windows 11 (x64, ARM64)',
    softwareVersion: makeitcolorArticle.version,
    datePublished: makeitcolorArticle.date,
    dateModified: makeitcolorArticle.released,
    softwareRequirements: '64-bit Windows 10 version 1903 or later, or Windows 11. The colour model downloads on first use.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: editions.map(downloadUrl),
    image: `${siteUrl}/art/makeitcolor-social.jpg`,
    author: { '@id': `${siteUrl}/#person` },
    subjectOf: { '@id': `${siteUrl}${makeitcolorArticle.path}#article` },
  };

  return <div id="top" className="pawsip-page mic-page"><Header/><main id="main" className="pawsip-dl mic-dl shell">
    <header className="pawsip-dl-hero">
      <a href={makeitcolorArticle.path} className="jev-back">← THE MAKEITCOLOR FIELD NOTE</a>
      <div className="section-eyebrow"><span>DESKTOP SOFTWARE / FREE FOR WINDOWS</span><span>IN COLOUR. ON YOUR OWN PC.</span></div>
      <div className="pawsip-dl-hero-grid">
        <div className="pawsip-dl-intro"><h1>Download MakeItColor<br/><em>for Windows.</em></h1><p className="pawsip-dl-pitch">{makeitcolorArticle.tagline} MakeItColor colours old photos and films, gives faded ones their blacks and whites back, and takes out blur, noise and JPEG damage. Nothing is uploaded, and the originals are never changed.</p></div>
        <figure className="mic-dl-stage"><img src="/art/makeitcolor-app-light.jpg" width="1600" height="973" alt="MakeItColor’s window in the light theme: the 1945 photo of a sailor kissing a nurse in Times Square, black and white on the left of a divider and in colour on the right; the file list reads “Kissing the War Goodbye, 1945.jpg · Done in 10.1 s on the NPU · enhanced · 600 × 618 → 2400 × 2472”" fetchPriority="high"/><figcaption>A real screenshot: MakeItColor drew its own window off-screen, in its capture mode. <MakeItColorCredit source="kiss"/></figcaption></figure>
        <div className="pawsip-dl-get">
          <MakeItColorDownload/>
          <p className="pawsip-dl-release"><span>VERSION {makeitcolorArticle.version}</span><span>RELEASED <time dateTime={makeitcolorArticle.released}>20 OCTOBER 2026</time></span><span>FREE</span></p>
          <a className="pawsip-dl-jump" href="#all-downloads">Both installers and checksums <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </header>

    <div className="jev-headline-stats pawsip-dl-stats" aria-label="At a glance"><div><span>COLOUR MODEL</span><strong>0.42<small>s</small></strong><p>One 512 × 512 pass on my laptop&apos;s NPU ({npu.device})</p></div><div><span>ENHANCED</span><strong>4×<small>larger</small></strong><p>Small photos, with blur, noise and JPEG damage taken out</p></div><div><span>UPLOADED</span><strong>0<small>bytes</small></strong><p>Your photos and films never leave your PC</p></div></div>

    <section id="all-downloads" className="pawsip-dl-section" aria-labelledby="all-downloads-heading">
      <div className="section-eyebrow"><span>01 / ALL DOWNLOADS</span><span>VERSION {makeitcolorArticle.version} · {editions.length} INSTALLERS</span></div>
      <div className="pawsip-dl-cols"><h2 id="all-downloads-heading">Two installers.<br/><em>Pick yours.</em></h2><div className="pawsip-dl-body jev-prose">
        <div className="benchmark-data-table pawsip-editions"><div className="benchmark-table-scroll"><table><caption>All downloads · version {makeitcolorArticle.version}</caption><thead><tr><th scope="col">Windows</th><th scope="col">Best for</th><th scope="col">Size</th><th scope="col">Installer</th></tr></thead><tbody>{editions.map(edition => <tr key={edition.id}><th scope="row">{edition.name}</th><td>{edition.forWho} {edition.runtime}</td><td>{formatSize(edition.bytes)}</td><td><a href={downloadUrl(edition)} aria-label={`Download MakeItColor for ${edition.name}`}>Download <Arrow diagonal/></a></td></tr>)}</tbody></table></div><details><summary>SHA-256 checksums</summary><ul className="pawsip-checksums">{editions.map(edition => <li key={edition.id}><span>{edition.file}</span><code>{edition.sha256}</code></li>)}</ul></details></div>
        <h3>Which one do I need?</h3><p>Open <strong>Settings › System › About</strong>. If the system type says x64-based processor, take the first installer; ARM-based, the second. The installers are hosted on the <a href={makeitcolorArticle.releaseUrl} target="_blank" rel="noopener noreferrer">GitHub release page</a>, with a checksums file.</p>
      </div></div>
    </section>

    <section id="requirements" className="pawsip-dl-section" aria-labelledby="requirements-heading">
      <div className="section-eyebrow"><span>02 / SYSTEM REQUIREMENTS</span><span>64-BIT WINDOWS 10 & 11</span></div>
      <div className="pawsip-dl-cols"><h2 id="requirements-heading">What it<br/><em>runs on.</em></h2><div className="pawsip-dl-body jev-prose">
        <dl className="pawsip-dl-reqs">{requirements.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl>
        <p className="jev-small-note">I tested it on my Windows 11 laptop (Intel Core Ultra 5 135U), where the NPU, the Intel graphics and the CPU all ran both models. The ARM64 edition is built natively for ARM, but I haven&apos;t run it on ARM hardware (Snapdragon X) yet. AMD and Qualcomm NPUs, NVIDIA and AMD graphics cards, and Windows 10 itself are untested too.</p>
      </div></div>
    </section>

    <section id="features" className="pawsip-dl-section" aria-labelledby="features-heading">
      <div className="section-eyebrow"><span>03 / WHAT YOU GET</span><span>COLOUR, AND A GOOD CLEAN-UP</span></div>
      <div className="pawsip-dl-cols"><h2 id="features-heading">Colour it.<br/><em>Restore it.</em></h2><div className="pawsip-dl-body jev-prose">
        <ul className="pawsip-dl-features">{features.map(([title, text], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></li>)}</ul>
      </div></div>
    </section>

    <section id="expect" className="pawsip-dl-section" aria-labelledby="expect-heading">
      <div className="section-eyebrow"><span>04 / WHAT TO EXPECT</span><span>A GOOD GUESS, NOT A RECORD</span></div>
      <div className="pawsip-dl-cols"><h2 id="expect-heading">Plausible colours.<br/><em>Not a record.</em></h2><div className="pawsip-dl-body jev-prose">
        <p>MakeItColor can&apos;t know what colour anything really was. Skies, skin and grass usually come out right; clothes, cars and painted walls are a guess, and a dark shot can get a colour cast. In videos, colours are kept steady only where the picture doesn&apos;t change, so something that moves can shift colour. At 4×, the enhancer can make fine textures such as rocks and leaves look slightly painted.</p>
        <p>It&apos;s fastest with an NPU or a graphics card. On my laptop, a {jobs.photo.from} photo enhanced to {jobs.photo.to} and coloured takes {jobs.photo.gpu} with the enhancer on the graphics card, and {jobs.photo.cpu} on the CPU alone. The first time, the Intel NPU takes {jobs.npuCompile.color} to prepare the colour model; meanwhile the app works on the graphics card.</p>
      </div></div>
    </section>

    <section id="installing" className="pawsip-dl-section" aria-labelledby="installing-heading">
      <div className="section-eyebrow"><span>05 / INSTALLING</span><span>FOR EVERYONE, OR JUST FOR YOU</span></div>
      <div className="pawsip-dl-cols"><h2 id="installing-heading">Easy to install.<br/><em>Easy to remove.</em></h2><div className="pawsip-dl-body jev-prose">
        <ol className="pawsip-dl-steps">
          <li><div><strong>Download the installer for your PC.</strong> Use the recommended download above, or pick one from the list.</div></li>
          <li><div><strong>Open it.</strong> The installers aren&apos;t code-signed yet, so Windows SmartScreen may show <em>“Windows protected your PC”</em>. Choose <strong>More info</strong>, then <strong>Run anyway</strong>. Compare the SHA-256 checksum first if you&apos;d like to be sure the file is the one I published.</div></li>
          <li><div><strong>Choose who it&apos;s for.</strong> All users (needs administrator permission) or only you (no administrator rights needed).</div></li>
          <li><div><strong>Drop in a photo or a video.</strong> The first time, the colour model downloads once ({formatSize(models.colorFp16.bytes)} for an NPU or graphics card, {formatSize(models.colorFp32.bytes)} for the CPU).</div></li>
        </ol>
        <p>MakeItColor keeps itself up to date. About 10 seconds after it starts, and at most once a day, it reads a small file from this site, <code>{updateFeed}</code>, with an ordinary web request; nothing about you or your pictures is sent. If there&apos;s a newer version, <strong>Update now</strong> downloads it, checks its size and SHA-256 checksum, installs it and restarts the app. Turn the check off in <strong>Settings › Updates</strong>.</p>
        <p>To remove it, uninstall it from <strong>Settings › Apps</strong>. That deletes the downloaded models and the NPU&apos;s compile cache in <code>%LOCALAPPDATA%\MakeItColor</code>; your settings stay in <code>%APPDATA%\MakeItColor</code>.</p>
      </div></div>
    </section>

    <section id="more" className="pawsip-dl-section" aria-labelledby="more-heading">
      <div className="section-eyebrow"><span>06 / MORE ABOUT MAKEITCOLOR</span><span>THE STORY AND THE SOURCE</span></div>
      <div className="pawsip-dl-cols"><h2 id="more-heading">Curious how<br/><em>it works?</em></h2><div className="pawsip-dl-body jev-prose">
        <p>I wrote about the 1967 song that started it, how the colour is put back on the full-size picture, the speed on each chip, the bugs the tests caught, and what it still gets wrong. There&apos;s a 71-second launch video, too.</p>
        <div className="jev-downloads"><a href={makeitcolorArticle.path}>Read the story behind MakeItColor <Arrow/></a><a href={makeitcolorArticle.repoUrl} target="_blank" rel="noopener noreferrer">View the source on GitHub <Arrow diagonal/></a><a href={makeitcolorArticle.checksumsUrl} target="_blank" rel="noopener noreferrer">SHA-256 checksums file <Arrow diagonal/></a></div>
        <p className="jev-small-note">MakeItColor colours with the MakeItColor model, based on DDColor (Apache 2.0), and enhances with Real-ESRGAN (BSD 3-Clause; network from BasicSR, Apache 2.0). It uses Windows ML and ONNX Runtime (MIT) and FFmpeg (LGPL 2.1, an unmodified BtbN build). It is not affiliated with the DDColor or Real-ESRGAN authors. The image above is a real screenshot of the app.</p>
      </div></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
  </main><Footer/></div>;
}
