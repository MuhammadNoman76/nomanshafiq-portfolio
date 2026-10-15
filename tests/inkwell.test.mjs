import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/inkwell.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/inkwell/page.tsx');
const downloadPage = read('src/app/inkwell/page.tsx');
const blog = read('src/app/blog/page.tsx');
const exportCheck = read('scripts/check-export.mjs');
/** The rendered JSX of the article, without comments or the helpers' own templates. */
const articleBody = article.slice(article.indexOf('export default function')).replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
/** The data file's `testing.untested` list. */
const untested = /untested: \[([\s\S]*?)\]/.exec(data)?.[1] ?? '';
const knownGaps = /export const knownGaps = \[([\s\S]*?)\] as const/.exec(data)?.[1] ?? '';

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

test('Inkwell downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.0.1');
  assert.equal(released, '2026-10-15');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `Inkwell-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.deepEqual(editions.map(e => e.bytes), [49038301, 43571909, 45084054, 7020082], 'sizes match the installers in the Inkwell repository');
  assert.deepEqual(editions.map(e => e.sha256), [
    '19c10a70fe126e056504829e31eb1f1570410e872ee830514970cda96e62a46d',
    '930722d616be18d1a73d0f1bb68023503109a84164ff848dfb022297df9f601d',
    'df33bac61ac3a5f25985f5c886ed5ccee9bc08e9adc8222a626b3de6b118999e',
    'a866027a5b26f49841c7f88e2212dd00d28eba8528e7b162b17603c39cc31288',
  ], 'checksums match release/SHA256SUMS.txt');
  assert.doesNotMatch(data + read('public/updates/inkwell.json'), /Inkwell-Setup-1\.0\.0/, 'no 1.0.0 installers are left (they were removed from the repository)');
});

test('downloads point at the Inkwell repository (capital I) over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/Inkwell\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Inkwell'/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Inkwell\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.match(data, /noticesUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Inkwell\/blob\/main\/THIRD-PARTY-NOTICES\.txt'/);
  assert.doesNotMatch(data + article + downloadPage + read('public/updates/inkwell.json'), /github\.com\/MuhammadNoman76\/inkwell/, 'the repository name has a capital I');
  assert.doesNotMatch(data, /http:\/\//);
});

test('Inkwell uses the shared Windows download picker', () => {
  const picker = read('src/components/WindowsDownload.tsx');
  assert.doesNotMatch(picker.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /PawSip|VibePlayer|Trove|Stagecraft|Inkwell/, 'no app names baked into the shared picker');
  const wrapper = read('src/components/InkwellDownload.tsx');
  assert.match(wrapper, /^'use client';/, 'the wrapper is the client boundary');
  assert.match(wrapper, /<WindowsDownload appName="Inkwell" version=\{inkwellArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\}\/>/);
});

test('the Inkwell field note is published, linked and has its sections', () => {
  assert.match(article, /<InkwellDownload\/>/);
  assert.match(article, /editions\.map/);
  const ids = ['idea', 'design', 'writing', 'fixes', 'safe', 'serious', 'focus', 'rtl', 'formats', 'engine', 'video', 'download', 'next'];
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
  assert.match(article, /softwareVersion: inkwellArticle\.version/, 'the structured data follows the release');
  assert.match(article, /dateModified: inkwellArticle\.released/);
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), new RegExp(`\\$\\{siteUrl\\}/blog/inkwell/\`,lastModified:'${released}'`));
  assert.match(read('src/app/sitemap.ts'), new RegExp(`\\$\\{siteUrl\\}/inkwell/\`,lastModified:'${released}'`));
  const llms = read('public/llms.txt');
  assert.match(llms, /^- Inkwell, a free Windows word processor .*https:\/\/www\.nomanshafiq\.com\/blog\/inkwell\/\r?$/m);
  assert.match(llms, /^- Inkwell download page: https:\/\/www\.nomanshafiq\.com\/inkwell\/\r?$/m);
  assert.match(llms, /^- Inkwell source: https:\/\/github\.com\/MuhammadNoman76\/Inkwell\r?$/m);
  assert.match(llms, /Inkwell[^\n]*Version 1\.0\.1 has four installers/, 'llms.txt names the current version');
  assert.doesNotMatch(llms, /Inkwell[^\n]*Version 1\.0\.0 has four installers/, 'llms.txt has no stale Inkwell version');
  assert.match(read('src/app/layout.tsx'), /import '\.\/inkwell\.css';/);
  assert.match(exportCheck, /'blog\/inkwell','inkwell'/);
  assert.ok(exists('docs/INKWELL-CONTENT.md'), 'evidence doc');
  assert.match(read('AGENTS.md'), /`\/blog\/inkwell\/`/);
  assert.match(read('AGENTS.md'), /`src\/data\/inkwell\.ts`/);
});

test('Inkwell is the first card on the blog index', () => {
  assert.match(blog, /inkwellArticle\.path/);
  assert.match(blog, /href=\{inkwellDownloadPage\.path\}/);
  const order = ['inkwell-cover.jpg', 'stagecraft-cover.jpg', 'trove-cover.jpg', 'vibeplayer-cover.jpg', 'pawsip-cover.png', 'jev-urdu-cover.webp'].map(art => blog.indexOf(art));
  assert.ok(order.every(index => index > 0), 'every card has its cover');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'Inkwell, then Stagecraft, Trove, VibePlayer, PawSip and Jev-Urdu');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: inkwellArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.ok(blog.indexOf('fetchPriority="high"') > blog.indexOf('inkwell-cover.jpg') && blog.indexOf('fetchPriority="high"') < blog.indexOf('stagecraft-cover.jpg'), 'the high-priority image is Inkwell’s');
  assert.match(blog, /src="\/art\/stagecraft-cover\.jpg" width="1672" height="940" alt="[^"]+" loading="lazy"/, 'Stagecraft is no longer the first card, so its image loads lazily');
  assert.match(blog, /images: \[\{ url: '\/art\/inkwell-social\.jpg', width: 1200, height: 630 \}\]/, 'the blog index shares the Inkwell card');
  assert.match(blog, /images: \['\/art\/inkwell-social\.jpg'\]/);
  const readTime = /(\d+) MIN READ/.exec(article)?.[1];
  assert.ok(readTime, 'the article states its reading time');
  assert.match(blog, new RegExp(`<span className="blog-read-time">${readTime} MIN</span>`), 'the blog card shows the same reading time');
});

test('the images are real screenshots with their true sizes', () => {
  for (const [file, size] of [['inkwell-cover.jpg', [1672, 940]], ['inkwell-social.jpg', [1200, 630]]]) {
    assert.deepEqual(Object.values(imageSize(`public/art/${file}`)), size, file);
    assert.match(exportCheck, new RegExp(`'art/${file.replace('.', '\\.')}'`), `${file} is checked in the export`);
  }
  const shots = [...data.matchAll(/(\w+): \{ src: '\/art\/(inkwell-[\w-]+\.png)', width: (\d+), height: (\d+), version: '([\d.]+)' \}/g)];
  assert.equal(shots.length, 23, 'twenty-three screenshots');
  for (const [, key, file, width, height, shotVersion] of shots) {
    assert.deepEqual(imageSize(`public/art/${file}`), {width: Number(width), height: Number(height)}, `${file} dimensions`);
    assert.ok(statSync(new URL(`../public/art/${file}`, import.meta.url)).size < 400_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/${file}'`), `${file} is checked in the export`);
    assert.match(article + downloadPage, new RegExp(`screenshots\\.${key}\\b|\\bs\\.${key}\\b`), `${key} is used`);
    assert.equal(shotVersion, '1.0.1', `${key} shows the current version`);
  }
  const docs = [...data.matchAll(/\{ id: '([a-z-]+)', name: '[^']+', note: '[^']+' \}/g)].map(([, id]) => id);
  assert.deepEqual(docs, ['report', 'letter', 'resume', 'essay', 'urdu-english'], 'the five demo documents, in the app’s order');
  for (const id of docs) {
    const file = `public/art/inkwell-doc-${id}.jpg`;
    assert.deepEqual(imageSize(file), {width: 560, height: 600}, file);
    assert.ok(statSync(new URL(`../${file}`, import.meta.url)).size < 60_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/inkwell-doc-${id}\\.jpg'`), `${id} tile is checked in the export`);
  }
  assert.match(article, /src=\{`\/art\/inkwell-doc-\$\{doc\.id\}\.jpg`\} width=\{560\} height=\{600\}/, 'the gallery uses the demo document tiles');
  const all = articleBody.match(/<Shot shot=[\s\S]*?<\/Shot>|<figure[\s\S]*?<\/figure>/g) ?? [];
  const figures = all.filter(figure => !figure.includes('<video'));
  assert.equal(all.length - figures.length, 1, 'one video figure');
  assert.ok(figures.length >= 22, 'cover, gallery and screenshots');
  for (const figure of figures) assert.match(figure, /[Rr]eal screenshot/, 'every still figure says it is (made from) a real screenshot');
  for (const figure of figures.filter(f => f.startsWith('<Shot'))) assert.match(figure, /Inkwell \{s\.\w+\.version\}/, 'every screenshot caption names its version');
  assert.match(downloadPage, /A real screenshot of Inkwell \{screenshots\.editor\.version\}/);
  assert.doesNotMatch(downloadPage, /recreat/i, 'the download page shows only real screenshots');
  // Only the launch video recreates the interface, and every mention of that says it is the video.
  const videoSection = /<section id="video"[\s\S]*?<\/section>/.exec(articleBody)?.[0] ?? '';
  for (const sentence of articleBody.replace(videoSection, '').split(/(?<=[.!?])\s+|<[^>]+>/)) {
    if (/recreat/i.test(sentence)) assert.match(sentence, /launch video/i, `only the launch video is a recreation: ${sentence}`);
  }
  const guides = figures.find(figure => figure.includes('s.pictureGuides')) ?? '';
  assert.match(guides, /capture mode drew/, 'the guides figure says the capture mode drew the guides');
  const history = figures.find(figure => figure.includes('s.history')) ?? '';
  assert.match(history, /demo versions/, 'the version history figure says its versions are demo versions');
});

test('the launch video is in the field note with captions, like Stagecraft’s', () => {
  assert.match(data, /export const launchVideo = \{\s*src: '\/media\/inkwell-launch\.mp4',\s*captions: '\/media\/inkwell-launch\.en\.vtt',\s*poster: '\/media\/inkwell-launch-poster\.jpg',\s*width: 1280,\s*height: 720,\s*duration: 'PT1M45S',\s*uploadDate: '2026-10-15',\s*\};/);
  for (const media of ['inkwell-launch.mp4', 'inkwell-launch.en.vtt', 'inkwell-launch-poster.jpg']) {
    assert.ok(exists('public/media/' + media), 'public/media/' + media);
    assert.ok(statSync(new URL('../public/media/' + media, import.meta.url)).size < 25 * 1024 * 1024, media + ' fits the 25 MiB limit of Cloudflare Pages');
    assert.match(exportCheck, new RegExp("'media/" + media.replace(/\./g, '\\.') + "'"), media + ' is checked in the export');
  }
  assert.equal(statSync(new URL('../public/media/inkwell-launch.mp4', import.meta.url)).size, 14_660_961, 'the MP4 is the supplied file');
  const vtt = read('public/media/inkwell-launch.en.vtt');
  assert.match(vtt, /^WEBVTT/);
  assert.ok((vtt.match(/-->/g) ?? []).length >= 30, 'captions cover the whole video');
  const ends = [...vtt.matchAll(/--> (\d\d):(\d\d):(\d\d\.\d{3})/g)].map(([, h, m, s]) => Number(h) * 3600 + Number(m) * 60 + Number(s));
  assert.ok(Math.max(...ends) > 95 && Math.max(...ends) <= 105.1, 'the cues run to the end of the 105-second video and no further');
  assert.deepEqual(imageSize('public/media/inkwell-launch-poster.jpg'), {width: 1280, height: 720}, 'the poster matches the video size');
  const mp4 = readFileSync(new URL('../public/media/inkwell-launch.mp4', import.meta.url));
  assert.equal(mp4.toString('latin1', 4, 8), 'ftyp', 'an MP4 file');
  assert.ok(mp4.indexOf('moov') > 0 && mp4.indexOf('moov') < mp4.indexOf('mdat'), 'the MP4 is fast-start');
  const section = /<section id="video"[\s\S]*?<\/section>/.exec(articleBody)?.[0] ?? '';
  assert.match(section, /11 \/ THE LAUNCH VIDEO/);
  assert.match(section, /In 105 seconds\./, 'the title matches the real length');
  assert.match(section, /<video controls preload="metadata" playsInline poster=\{launchVideo\.poster\} width=\{launchVideo\.width\} height=\{launchVideo\.height\}><source src=\{launchVideo\.src\} type="video\/mp4"\/>/);
  assert.match(section, /<track kind="captions" srcLang="en" label="English" src=\{launchVideo\.captions\} default\/>/);
  assert.match(section, /The Inkwell launch video \(1:45\)\. Its app shots recreate Inkwell&apos;s interface from its source; every page is laid out and rendered by Inkwell&apos;s own engine\./, 'the caption says the app shots are recreations');
  assert.match(section, /demo edits \(re-inserted contents and citation, typed paragraphs, illustrative version-history entries, a hypothetical update offer\) aren&apos;t in the shipped samples/, 'the caption owns up to the demo edits');
  assert.ok(articleBody.indexOf('<section id="engine"') < articleBody.indexOf('<section id="video"') && articleBody.indexOf('<section id="video"') < articleBody.indexOf('<section id="download"'), 'between Under the hood and Download');
  assert.match(article, /const videoId = `\$\{siteUrl\}\$\{inkwellArticle\.path\}#launch-video`/);
  assert.match(article, /video: \{ '@id': videoId \}/, 'the article points at its video');
  assert.match(article, /'@type': 'VideoObject', '@id': videoId[\s\S]*?recreate Inkwell’s interface[\s\S]*?thumbnailUrl: `\$\{siteUrl\}\$\{launchVideo\.poster\}`[\s\S]*?contentUrl: `\$\{siteUrl\}\$\{launchVideo\.src\}`[\s\S]*?uploadDate: launchVideo\.uploadDate, duration: launchVideo\.duration[\s\S]*?encodingFormat: 'text\/vtt'/);
  assert.match(read('src/app/inkwell.css'), /\.inkwell-video video\{[^}]*aspect-ratio:16\/9/);
  assert.match(read('public/llms.txt'), /launch video on the article \(English captions\) recreates Inkwell/);
  assert.match(read('docs/INKWELL-CONTENT.md'), /^## Launch video\r?\n\r?\n`\/blog\/inkwell\/#video`/m, 'the evidence doc describes the video');
});

test('the copy stays honest about Word, licences and testing', () => {
  const both = article + downloadPage + data;
  assert.match(data, /\['Word 97–2003 \.doc files', 'Not supported: open them in Word and save as \.docx', 'unsupported'\]/);
  assert.match(data, /\['Charts, SmartArt, embedded objects, EMF \/ WMF pictures', 'Kept exactly; shown as labelled placeholders', 'placeholder'\]/);
  assert.match(data, /\['Equations', 'Kept exactly; shown as their plain text, not edited', 'shown'\]/, 'equations show as text, not as a placeholder (ParaSource.cs)');
  assert.match(data, /tight wrapping is laid out like square/);
  assert.match(article, /wordCompatibility\.map/, 'the article shows the compatibility table');
  assert.match(data, /documents: 9,\s*values: 117,\s*matched: 116,/);
  assert.match(article, /résumé is two pages in Inkwell and one in Word/, 'the one Word difference is stated');
  assert.match(article, /field result outside its hyperlink|field[^.]*outside its hyperlink/i, 'the bug Word found is told');
  assert.match(data, /tests: 344,/);
  assert.match(data, /installerVersion: '1\.0\.0',/, 'the installer test is labelled with the version it ran on');
  assert.match(data, /export const wordCheck = \{\n  version: '1\.0\.0',/, 'the Word check is labelled with its version');
  assert.match(data, /export const performance = \{\n  version: '1\.0\.0',/, 'the timings are labelled with their version');
  assert.match(data, /installerChecks: 23,/);
  assert.match(data, /pages: 301,\s*words: 112_562,/);
  assert.match(data, /\['Open \(load the \.docx\)', '82 ms', '167 ms'\]/);
  assert.match(data, /\['Lay out every page', '2\.6 s', '3\.8 s'\]/);
  assert.match(data, /\['Median keystroke \(edit and relayout\)', '2\.9 ms', '2\.3 ms'\]/);
  for (const item of ['real printer', 'screen readers', 'East Asian input methods', 'languages other than English', 'ARM64 hardware', 'real Windows 7 or 8\\.1 PCs', '32-bit Windows 10', 'PDF viewers', 'the 1\\.0\\.1 ARM64, 32-bit and Windows 7 / 8\\.1 installers'])
    assert.match(untested, new RegExp(item), `untested: ${item}`);
  for (const gap of ['résumé', 'Tight wrapping', 'Text boxes', 'Charts and SmartArt', 'equations appear as their plain text', '0\\.6 to 1\\.6 MB'])
    assert.match(knownGaps, new RegExp(gap), `known gap: ${gap}`);
  for (const page of [article, downloadPage]) {
    assert.match(page, /SmartScreen/);
    assert.match(page, /testing\.untested/, 'says what was not tested');
  }
  assert.match(article, /knownGaps\.map/, 'the article lists the known gaps');
  assert.doesNotMatch(both, /open[- ]source (?:word processor|app)|Inkwell is open[- ]source|MIT licen[sc]e for Inkwell/i, 'no licence is chosen for Inkwell');
  assert.match(both, /Markdig \(BSD-2-Clause\)/);
  assert.match(article, /href=\{inkwellArticle\.noticesUrl\}/, 'links the third-party notices');
  assert.match(article, /<strong>Track changes<\/strong> \(<Keys>Ctrl\+Shift\+E<\/Keys>\)/, '1.0.1 gives Ctrl+Shift+E to track changes');
  assert.match(article, /<strong>Export<\/strong> \(<Keys>Ctrl\+Shift\+X<\/Keys>\)/, 'and Ctrl+Shift+X to Export');
  assert.doesNotMatch(both, /[Ee]xport(?:<\/strong>)? \((?:<Keys>)?Ctrl\+Shift\+E\b|Ctrl\+Shift\+E(?:<\/Keys>)? (?:opens|for) [Ee]xport/, 'no page gives Ctrl+Shift+E to Export any more');
  assert.doesNotMatch(both, /folder of your own[^.]*download page|download page[^.]*folder of your own/i, 'custom-folder installs update in place in 1.0.1');
  assert.doesNotMatch(article, /Enter shows no chip/, '1.0.1 shows the chip after Enter too');
  assert.doesNotMatch(both, /Page 3 of 10/, 'page numbers with the total read “3 of 10”');
  assert.match(article, /only network use is the update check/, 'the network note matches the README');
  assert.match(article, /never makes itself the default/, 'the installer never takes over .docx');
  assert.doesNotMatch(both, /never crash|bug[- ]free|fastest|better than Word|100% compatible/i, 'no unmeasured superlatives');
});

test('the Inkwell download page offers every edition', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/inkwell\/'/);
  assert.match(data, /description: 'Download Inkwell 1\.0\.1,/);
  assert.match(downloadPage, /<InkwellDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download Inkwell for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /<summary><span className="inkwell-nw">SHA-256<\/span> checksums<\/summary>/);
  assert.match(downloadPage, /<code>\{edition\.sha256\}<\/code>/, 'lists every checksum');
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /'@id': `\$\{pageUrl\}#app`/);
  assert.match(downloadPage, /softwareVersion: inkwellArticle\.version/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{inkwellArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /<section id="whats-new"/, 'a What’s new in 1.0.1 block');
  assert.match(downloadPage, /whatsNew\.map/);
  for (const title of ['Updates in any folder', 'One key per command', 'Every autocorrect rule in Settings', 'A command bar that fits', 'Smaller fixes'])
    assert.match(data, new RegExp(`\\['${title}', `), `what's new: ${title}`);
  const numbers = [...downloadPage.matchAll(/<span>(\d\d) \/ /g)].map(([, n]) => n);
  assert.deepEqual(numbers, ['01', '02', '03', '04', '05', '06'], 'the download page sections are numbered in order');
});

test('the Inkwell update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/inkwell.json'));
  assert.equal(feed.app, 'Inkwell', 'Updater.ParseManifest only accepts app "Inkwell"');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/inkwell/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.length <= 6 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes (the app shows up to six)');
  assert.match(feed.notes.join(' '), /Ctrl\+Shift\+E[\s\S]*Ctrl\+Shift\+X/, 'the notes summarise 1.0.1');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like Updater.Edition (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/Inkwell/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/inkwell\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\r?\n {2}Cache-Control: no-cache\r?\n {2}Content-Type: application\/json\r?$/m, 'the feed is never served stale');
  assert.match(exportCheck, /'updates\/inkwell\.json'/);
  assert.match(exportCheck, /\['inkwell\.json','Inkwell'\]/, 'the export check validates the feed');
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
});
