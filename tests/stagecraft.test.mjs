import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/stagecraft.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/stagecraft/page.tsx');
const downloadPage = read('src/app/stagecraft/page.tsx');
const blog = read('src/app/blog/page.tsx');
const exportCheck = read('scripts/check-export.mjs');
/** The rendered JSX of the article, without comments or the helpers' own templates. */
const articleBody = article.slice(article.indexOf('export default function')).replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
/** The data file's `testing.untested` list. */
const untested = /untested: \[([\s\S]*?)\]/.exec(data)?.[1] ?? '';
const nextUp = /export const nextUp = \[([\s\S]*?)\] as const/.exec(data)?.[1] ?? '';

/** PNG and JPEG pixel sizes, read from the file headers. */
const imageSize = path => {
  const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
  if (bytes.readUInt32BE(0) === 0x89504e47) return {width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20)};
  for (let i = 2; i < bytes.length;) {
    const marker = bytes[i + 1], length = bytes.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return {width: bytes.readUInt16BE(i + 7), height: bytes.readUInt16BE(i + 5)};
    i += 2 + length;
  }
  throw new Error(`No size in ${path}`);
};

test('Stagecraft downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.1.0');
  assert.equal(released, '2026-10-14');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `Stagecraft-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.deepEqual(editions.map(e => e.bytes), [48593808, 43134464, 44630557, 6563166], 'sizes match the installers in the Stagecraft repository');
  assert.deepEqual(editions.map(e => e.sha256), [
    'd2de9ca98c92bb56574c990d06d19eea25e47dbaba57c2b06db39ca2f6840f68',
    '4031591a4543569c94b1f1ca4bfc8f6b76f3de0a6c43b6483d820782470a66d7',
    '96dbe45e4da0fd153b439e27d097bb924e43cf4d068c5148f0d11a4707f9d986',
    '340d65a3f8a0af6d20ff90503648ab4168c65cc9974c42ef9d7e040f8805aff3',
  ], 'checksums match release/SHA256SUMS.txt');
  assert.doesNotMatch(data, /Stagecraft-Setup-1\.0\.0|1\.0\.0-x64/, 'no 1.0.0 installers are left');
});

test('downloads point at the Stagecraft repository over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/stagecraft\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/stagecraft'/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/stagecraft\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.match(data, /noticesUrl: 'https:\/\/github\.com\/MuhammadNoman76\/stagecraft\/blob\/main\/THIRD-PARTY-NOTICES\.txt'/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('Stagecraft uses the shared Windows download picker', () => {
  const picker = read('src/components/WindowsDownload.tsx');
  assert.doesNotMatch(picker.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /PawSip|VibePlayer|Trove|Stagecraft/, 'no app names baked into the shared picker');
  const wrapper = read('src/components/StagecraftDownload.tsx');
  assert.match(wrapper, /^'use client';/, 'the wrapper is the client boundary');
  assert.match(wrapper, /<WindowsDownload appName="Stagecraft" version=\{stagecraftArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\}\/>/);
});

test('the Stagecraft field note is published, linked and has its sections', () => {
  assert.match(article, /<StagecraftDownload\/>/);
  assert.match(article, /editions\.map/);
  const ids = ['idea', 'design', 'editing', 'motion', 'animations', 'links', 'media', 'presenter', 'files', 'engine', 'video', 'download', 'next'];
  ids.forEach((id, index) => {
    const number = String(index + 1).padStart(2, '0');
    assert.match(articleBody, new RegExp(`href="#${id}">${number} / `), `${id} is number ${number} in the contents`);
    if (index > 0) assert.match(articleBody, new RegExp(`<section id="${id}"[^>]*><span className="jev-section-number">${number} / `), `${id} section is numbered ${number}`);
    else assert.match(articleBody, /<section id="idea"/);
  });
  assert.equal((articleBody.match(/<section id="/g) ?? []).length, ids.length, 'no section without a contents entry');
  assert.doesNotMatch(article, /LAUNCH VIDEO \(to be added\)/, 'the placeholder is gone now that the video is in');
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /'@type': 'BlogPosting'/);
  assert.match(article, /'@type': 'SoftwareApplication', '@id': appId/);
  assert.match(article, /softwareVersion: stagecraftArticle\.version/, 'the structured data follows the release');
  assert.match(article, /dateModified: stagecraftArticle\.released/);
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), new RegExp(`\\$\\{siteUrl\\}/blog/stagecraft/\`,lastModified:'${released}'`));
  assert.match(read('src/app/sitemap.ts'), new RegExp(`\\$\\{siteUrl\\}/stagecraft/\`,lastModified:'${released}'`));
  const llms = read('public/llms.txt');
  assert.match(llms, /^- Stagecraft, a free Windows presentation app .*https:\/\/www\.nomanshafiq\.com\/blog\/stagecraft\/\r?$/m);
  assert.match(llms, /^- Stagecraft download page: https:\/\/www\.nomanshafiq\.com\/stagecraft\/\r?$/m);
  assert.match(llms, /^- Stagecraft source: https:\/\/github\.com\/MuhammadNoman76\/stagecraft\r?$/m);
  assert.match(llms, /Version 1\.1\.0 has four installers/, 'llms.txt names the current version');
  assert.doesNotMatch(llms, /Stagecraft[^\n]*Version 1\.0\.0/, 'llms.txt has no stale Stagecraft version');
  assert.match(read('src/app/layout.tsx'), /import '\.\/stagecraft\.css';/);
  assert.match(exportCheck, /'blog\/stagecraft','stagecraft'/);
  assert.ok(exists('docs/STAGECRAFT-CONTENT.md'), 'evidence doc');
  assert.match(read('docs/STAGECRAFT-CONTENT.md'), /^## Stagecraft 1\.1/m, 'the evidence doc covers 1.1');
  assert.match(read('AGENTS.md'), /`\/blog\/stagecraft\/`/);
});

test('Stagecraft is the first card on the blog index', () => {
  assert.match(blog, /stagecraftArticle\.path/);
  assert.match(blog, /href=\{stagecraftDownloadPage\.path\}/);
  const order = ['stagecraft-cover.jpg', 'trove-cover.jpg', 'vibeplayer-cover.jpg', 'pawsip-cover.png', 'jev-urdu-cover.webp'].map(art => blog.indexOf(art));
  assert.ok(order.every(index => index > 0), 'every card has its cover');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'Stagecraft, then Trove, VibePlayer, PawSip and Jev-Urdu');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: stagecraftArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.ok(blog.indexOf('fetchPriority="high"') > blog.indexOf('stagecraft-cover.jpg') && blog.indexOf('fetchPriority="high"') < blog.indexOf('trove-cover.jpg'), 'the high-priority image is Stagecraft’s');
  assert.match(blog, /images: \[\{ url: '\/art\/stagecraft-social\.jpg', width: 1200, height: 630 \}\]/, 'the blog index shares the Stagecraft card');
  assert.match(blog, /images: \['\/art\/stagecraft-social\.jpg'\]/);
  const readTime = /(\d+) MIN READ/.exec(article)?.[1];
  assert.ok(readTime, 'the article states its reading time');
  assert.match(blog, new RegExp(`<span className="blog-read-time">${readTime} MIN</span>`), 'the blog card shows the same reading time');
});

test('the images are real screenshots with their true sizes', () => {
  for (const [file, size] of [['stagecraft-cover.jpg', [1672, 940]], ['stagecraft-social.jpg', [1200, 630]]]) {
    assert.deepEqual(Object.values(imageSize(`public/art/${file}`)), size, file);
    assert.match(exportCheck, new RegExp(`'art/${file.replace('.', '\\.')}'`), `${file} is checked in the export`);
  }
  const shots = [...data.matchAll(/(\w+): \{ src: '\/art\/(stagecraft-[\w-]+\.png)', width: (\d+), height: (\d+), version: '([\d.]+)' \}/g)];
  assert.equal(shots.length, 24, 'twenty-four screenshots');
  for (const [, key, file, width, height, shotVersion] of shots) {
    assert.deepEqual(imageSize(`public/art/${file}`), {width: Number(width), height: Number(height)}, `${file} dimensions`);
    assert.ok(statSync(new URL(`../public/art/${file}`, import.meta.url)).size < 400_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/${file}'`), `${file} is checked in the export`);
    assert.match(article + downloadPage, new RegExp(`screenshots\\.${key}\\b|\\bs\\.${key}\\b`), `${key} is used`);
    assert.ok(['1.0.0', '1.1.0'].includes(shotVersion), `${key} shows a released version`);
  }
  const v11 = shots.filter(shot => shot[5] === '1.1.0').map(shot => shot[1]);
  for (const key of ['editor', 'editorDark', 'start', 'animationGallery', 'animationPane', 'motionPath', 'linkDialog', 'showLink', 'video', 'trim', 'headerFooter', 'find', 'crop', 'viewAids'])
    assert.ok(v11.includes(key), `${key} is a 1.1 capture`);
  assert.doesNotMatch(article + downloadPage + data, /shotsVersion/, 'every caption names the version its screenshot shows');
  const themes = [...data.matchAll(/\{ id: '([a-z]+)', name: '([A-Z][a-z]+)', description: '[^']+' \}/g)].map(([, id]) => id);
  assert.deepEqual(themes, ['aurora', 'editorial', 'midnight', 'pastel', 'corporate', 'mono', 'gradient', 'swiss', 'botanical', 'slate'], 'the ten themes, in the app’s order');
  for (const id of themes) {
    const file = `public/art/stagecraft-theme-${id}.jpg`;
    assert.deepEqual(imageSize(file), {width: 640, height: 360}, file);
    assert.ok(statSync(new URL(`../${file}`, import.meta.url)).size < 60_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/stagecraft-theme-${id}\\.jpg'`), `${id} tile is checked in the export`);
  }
  assert.match(article, /src=\{`\/art\/stagecraft-theme-\$\{theme\.id\}\.jpg`\} width=\{640\} height=\{360\}/, 'the gallery uses the theme tiles');
  const figures = articleBody.match(/<Shot shot=[\s\S]*?<\/Shot>|<figure[\s\S]*?<\/figure>/g) ?? [];
  const stills = figures.filter(figure => !figure.includes('<video'));
  assert.equal(figures.length - stills.length, 1, 'one video figure');
  assert.ok(stills.length >= 24, 'cover, gallery and screenshots');
  for (const figure of stills) assert.match(figure, /[Rr]eal screenshot/, 'every still figure says it is (made from) a real screenshot');
  for (const figure of stills.filter(f => f.startsWith('<Shot'))) assert.match(figure, /Stagecraft \{s\.\w+\.version\}/, 'every screenshot caption names its version');
  assert.match(downloadPage, /A real screenshot of Stagecraft \{screenshots\.editor\.version\}/);
  assert.doesNotMatch(downloadPage, /recreat/i, 'the download page shows only real screenshots');
  // Only the launch video recreates the interface, and every mention of that says it is the video.
  const videoSection = /<section id="video"[\s\S]*?<\/section>/.exec(articleBody)?.[0] ?? '';
  for (const sentence of articleBody.replace(videoSection, '').split(/(?<=[.!?])\s+|<[^>]+>/)) {
    if (/recreat/i.test(sentence)) assert.match(sentence, /launch video/i, `only the launch video is a recreation: ${sentence}`);
  }
  assert.match(articleBody, /test window|windowed test mode/, 'the presenter view and show shots say they are the windowed test mode');
});

test('the launch video is in the field note with captions, like Trove’s', () => {
  assert.match(data, /export const launchVideo = \{\s*src: '\/media\/stagecraft-launch\.mp4',\s*captions: '\/media\/stagecraft-launch\.en\.vtt',\s*poster: '\/media\/stagecraft-launch-poster\.jpg',\s*width: 1280,\s*height: 720,\s*duration: 'PT1M41S',\s*uploadDate: '2026-10-14',\s*\};/);
  for (const media of ['stagecraft-launch.mp4', 'stagecraft-launch.en.vtt', 'stagecraft-launch-poster.jpg']) {
    assert.ok(exists('public/media/' + media), 'public/media/' + media);
    assert.ok(statSync(new URL('../public/media/' + media, import.meta.url)).size < 25 * 1024 * 1024, media + ' fits the 25 MiB limit of Cloudflare Pages');
    assert.match(exportCheck, new RegExp("'media/" + media.replace(/\./g, '\\.') + "'"), media + ' is checked in the export');
  }
  assert.equal(statSync(new URL('../public/media/stagecraft-launch.mp4', import.meta.url)).size, 14_750_254, 'the MP4 is the supplied file');
  const vtt = read('public/media/stagecraft-launch.en.vtt');
  assert.match(vtt, /^WEBVTT/);
  assert.ok((vtt.match(/-->/g) ?? []).length >= 30, 'captions cover the whole video');
  const ends = [...vtt.matchAll(/--> (\d\d):(\d\d):(\d\d\.\d{3})/g)].map(([, h, m, s]) => Number(h) * 3600 + Number(m) * 60 + Number(s));
  assert.ok(Math.max(...ends) > 90 && Math.max(...ends) <= 101, 'the cues run to the end of the 101-second video and no further');
  assert.deepEqual(imageSize('public/media/stagecraft-launch-poster.jpg'), {width: 1280, height: 720}, 'the poster matches the video size');
  const mp4 = readFileSync(new URL('../public/media/stagecraft-launch.mp4', import.meta.url));
  assert.equal(mp4.toString('latin1', 4, 8), 'ftyp', 'an MP4 file');
  assert.ok(mp4.indexOf('moov') > 0 && mp4.indexOf('moov') < mp4.indexOf('mdat'), 'the MP4 is fast-start');
  const section = /<section id="video"[\s\S]*?<\/section>/.exec(articleBody)?.[0] ?? '';
  assert.match(section, /11 \/ THE LAUNCH VIDEO/);
  assert.match(section, /In 101 seconds\./, 'the title matches the real length');
  assert.match(section, /<video controls preload="metadata" playsInline poster=\{launchVideo\.poster\} width=\{launchVideo\.width\} height=\{launchVideo\.height\}><source src=\{launchVideo\.src\} type="video\/mp4"\/>/);
  assert.match(section, /<track kind="captions" srcLang="en" label="English" src=\{launchVideo\.captions\} default\/>/);
  assert.match(section, /The Stagecraft launch video \(1:41\)\. Its app shots recreate Stagecraft&apos;s interface from its source; the slides are rendered by Stagecraft&apos;s own engine\./, 'the caption says the app shots are recreations');
  assert.match(section, /demo edits \(some extra effects, two slides and a link\) were added for the video and aren&apos;t in the shipped sample decks/, 'the caption owns up to the demo edits');
  assert.ok(articleBody.indexOf('<section id="engine"') < articleBody.indexOf('<section id="video"') && articleBody.indexOf('<section id="video"') < articleBody.indexOf('<section id="download"'), 'between Under the hood and Download');
  assert.match(article, /const videoId = `\$\{siteUrl\}\$\{stagecraftArticle\.path\}#launch-video`/);
  assert.match(article, /video: \{ '@id': videoId \}/, 'the article points at its video');
  assert.match(article, /'@type': 'VideoObject', '@id': videoId[\s\S]*?recreate Stagecraft’s interface[\s\S]*?thumbnailUrl: `\$\{siteUrl\}\$\{launchVideo\.poster\}`[\s\S]*?contentUrl: `\$\{siteUrl\}\$\{launchVideo\.src\}`[\s\S]*?uploadDate: launchVideo\.uploadDate, duration: launchVideo\.duration[\s\S]*?encodingFormat: 'text\/vtt'/);
  assert.match(read('src/app/stagecraft.css'), /\.stagecraft-video video\{[^}]*aspect-ratio:16\/9/);
  assert.match(read('public/llms.txt'), /launch video on the article \(English captions\) recreates Stagecraft/);
  assert.match(read('docs/STAGECRAFT-CONTENT.md'), /^## Launch video\r?\n\r?\n`\/blog\/stagecraft\/#video`/m, 'the evidence doc describes the video');
});

test('the copy stays honest about export limits, licences and testing', () => {
  const both = article + downloadPage + data;
  assert.match(both, /Charts, icons, action buttons, online video cards and the theme’s background artwork become pictures/);
  assert.match(both, /Morph becomes a fade/);
  assert.match(both, /SmartArt, other chart types, ink and embedded objects are left out/);
  assert.match(both, /SmartArt isn&apos;t imported/);
  assert.match(both, /only followed for positions, text styles and backgrounds/);
  assert.match(both, /“Last slide viewed” links have no PDF equivalent/);
  assert.match(article, /approximate/, 'the PDF text layer is described as approximate');
  assert.match(article, /pptxAnimations\.map/, 'the article shows how animations map to PowerPoint');
  assert.match(data, /\['Float in, Rise up, Swivel', 'Fade',/, 'approximated effects are named');
  assert.match(data, /\['Bounce', 'Fly in from the top',/);
  assert.match(data, /\['Grow & turn', 'Zoom',/);
  assert.match(data, /\['Teeter, Wave, Colour pulse, Bold flash', 'Pulse',/);
  assert.doesNotMatch(both, /open[- ]source (?:presentation|app)|Stagecraft is open[- ]source|MIT licen[sc]e for Stagecraft/i, 'no licence is chosen for Stagecraft');
  assert.doesNotMatch(both, /[Bb]uilds aren’t exported|doesn&apos;t save your file behind your back|has no crop tool/, 'no 1.0 wording that 1.1 made untrue');
  assert.match(article, /href=\{stagecraftArticle\.noticesUrl\}/, 'links the third-party notices');
  assert.match(data, /engineTests: 135,/);
  assert.match(data, /smokeCommands: 133,/);
  assert.match(data, /smokeUndoSteps: 110,/);
  assert.match(data, /iconCount = 1112;/);
  assert.match(data, /bigDeck: \{ slides: 200, loadMs: 73, thumbnailsMs: 452, version: '1\.0\.0' \}/, 'the timing is labelled as a 1.0 measurement');
  assert.match(article, /with version \{testing\.bigDeck\.version\}/);
  for (const page of [article, downloadPage]) {
    assert.match(page, /SmartScreen/);
    assert.match(page, /\{untested\}|untested\.map|testing\.untested/, 'says what was not tested');
  }
  assert.match(untested, /a slide show in real full screen or on a real second display/);
  assert.match(untested, /ARM64 hardware/);
  assert.match(untested, /real Windows 7 or 8\.1 PCs/);
  assert.match(untested, /MOV, WMV and WMA files, and video and sound on Windows N editions/);
  assert.match(untested, /the 1\.1 installers themselves/);
  assert.match(untested, /screen readers/);
  assert.match(both, /Media Feature Pack/);
  assert.match(nextUp, /exporting a presentation as a video/);
  assert.match(nextUp, /real second display/);
  assert.match(nextUp, /code-signing/);
  assert.doesNotMatch(nextUp, /video and audio|spell checker|crop/i, 'nothing that 1.1 already does is "next"');
  assert.match(article, /only goes online when you add an online video/, 'the network note covers online video cards');
  assert.doesNotMatch(both, /never crash|bug[- ]free|fastest|better than PowerPoint/i, 'no unmeasured superlatives');
});

test('the Stagecraft download page offers every edition and says what is new', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/stagecraft\/'/);
  assert.match(data, /description: 'Download Stagecraft 1\.1\.0,/);
  assert.match(downloadPage, /<StagecraftDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download Stagecraft for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /<summary><span className="stagecraft-nw">SHA-256<\/span> checksums<\/summary>/);
  assert.match(downloadPage, /<code>\{edition\.sha256\}<\/code>/, 'lists every checksum');
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /'@id': `\$\{pageUrl\}#app`/);
  assert.match(downloadPage, /softwareVersion: stagecraftArticle\.version/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{stagecraftArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /<section id="whats-new"/, 'a What’s new in 1.1 block');
  assert.match(downloadPage, /whatsNew\.map/);
  for (const title of ['Animations', 'Links', 'Video and sound', 'More editing', 'Save automatically', 'PowerPoint, both ways', 'Fixed'])
    assert.match(data, new RegExp(`\\['${title}', `), `what's new: ${title}`);
  const numbers = [...downloadPage.matchAll(/<span>(\d\d) \/ /g)].map(([, n]) => n);
  assert.deepEqual(numbers, ['01', '02', '03', '04', '05', '06'], 'the download page sections are numbered in order');
});

test('the Stagecraft update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/stagecraft.json'));
  assert.equal(feed.app, 'Stagecraft', 'Updater.ParseManifest only accepts app "Stagecraft"');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/stagecraft/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.match(feed.notes.join(' '), /Animations/, 'the notes summarise 1.1');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like Updater.Edition (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/stagecraft/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/stagecraft\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\n {2}Cache-Control: no-cache\n {2}Content-Type: application\/json$/m, 'the feed is never served stale');
  assert.match(exportCheck, /'updates\/stagecraft\.json'/);
  assert.match(exportCheck, /\['stagecraft\.json','Stagecraft'\]/, 'the export check validates the feed');
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
});
