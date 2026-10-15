import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const routes=['','work','work/langvoice','work/resumeworld','work/metamod','work/reelsbuilder','work/lughaat','blog','blog/jev-urdu-benchmarks','blog/pawsip','pawsip','blog/vibeplayer','vibeplayer','blog/trove','trove','blog/stagecraft','stagecraft','blog/inkwell','inkwell'];
const assets=['404.html','robots.txt','sitemap.xml','manifest.webmanifest','favicon.svg','og.png','engine/experience.mjs','engine/sculpture.mjs','files/muhammad-noman-resume.pdf','art/hero.webp','art/hero-flow.webp','art/hero-reimagine.webp','art/jev-urdu-cover.webp','art/jev-urdu-social.jpg','art/pawsip-cover.png','art/pawsip-social.jpg','art/vibeplayer-cover.jpg','art/vibeplayer-social.jpg','art/vibeplayer-dialog.jpg','art/vibeplayer-jump.jpg','art/vibeplayer-hold.jpg','art/vibeplayer-menu.jpg','media/vibeplayer-launch.mp4','media/vibeplayer-launch.en.vtt','media/vibeplayer-launch-poster.jpg','media/vibeplayer-skip-demo.mp4','media/vibeplayer-skip-demo-poster.jpg','art/trove-cover.jpg','art/trove-social.jpg','art/trove-home.png','art/trove-archive.png','art/trove-archive-dark.png','art/trove-create.png','art/trove-password.png','art/trove-progress.png','art/trove-blocked.png','art/trove-blocked-details.png','art/trove-settings.png','media/trove-launch.mp4','media/trove-launch.en.vtt','media/trove-launch-poster.jpg','art/stagecraft-cover.jpg','art/stagecraft-social.jpg','art/stagecraft-editor.png','art/stagecraft-editor-dark.png','art/stagecraft-start.png','art/stagecraft-selection.png','art/stagecraft-design.png','art/stagecraft-palette.png','art/stagecraft-chart.png','art/stagecraft-icons.png','art/stagecraft-outline.png','art/stagecraft-sorter.png','art/stagecraft-presenter.png','art/stagecraft-export.png','art/stagecraft-settings.png','art/stagecraft-animation-gallery.png','art/stagecraft-animation-pane.png','art/stagecraft-motion-path.png','art/stagecraft-link-dialog.png','art/stagecraft-show-link.png','art/stagecraft-video.png','art/stagecraft-trim.png','art/stagecraft-header-footer.png','art/stagecraft-find.png','art/stagecraft-crop.png','art/stagecraft-view-aids.png','art/stagecraft-theme-aurora.jpg','art/stagecraft-theme-editorial.jpg','art/stagecraft-theme-midnight.jpg','art/stagecraft-theme-pastel.jpg','art/stagecraft-theme-corporate.jpg','art/stagecraft-theme-mono.jpg','art/stagecraft-theme-gradient.jpg','art/stagecraft-theme-swiss.jpg','art/stagecraft-theme-botanical.jpg','art/stagecraft-theme-slate.jpg','media/stagecraft-launch.mp4','media/stagecraft-launch.en.vtt','media/stagecraft-launch-poster.jpg','art/inkwell-cover.jpg','art/inkwell-social.jpg','art/inkwell-editor.png','art/inkwell-editor-dark.png','art/inkwell-start.png','art/inkwell-tour.png','art/inkwell-palette.png','art/inkwell-slash.png','art/inkwell-autocorrect.png','art/inkwell-paste.png','art/inkwell-picture-wrap.png','art/inkwell-picture-guides.png','art/inkwell-lists.png','art/inkwell-reveal.png','art/inkwell-breaks.png','art/inkwell-table.png','art/inkwell-history.png','art/inkwell-review.png','art/inkwell-toc.png','art/inkwell-citations.png','art/inkwell-focus.png','art/inkwell-urdu.png','art/inkwell-spelling.png','art/inkwell-export.png','art/inkwell-settings.png','art/inkwell-doc-report.jpg','art/inkwell-doc-letter.jpg','art/inkwell-doc-resume.jpg','art/inkwell-doc-essay.jpg','art/inkwell-doc-urdu-english.jpg','media/inkwell-launch.mp4','media/inkwell-launch.en.vtt','media/inkwell-launch-poster.jpg','updates/vibeplayer.json','updates/pawsip.json','updates/trove.json','updates/stagecraft.json','updates/inkwell.json','benchmarks/jev-urdu-results.json','benchmarks/jev-urdu-metrics.csv','benchmarks/jev-urdu-deltas.csv'];
const errors=[];
// Cloudflare Pages serves single files up to 25 MiB.
const maxFileBytes=25*1024*1024;
const walk=async dir=>{for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full);else if((await stat(full)).size>maxFileBytes)errors.push(`Over 25 MiB: ${path.relative(root,full)}`);}};
try{await walk(root);}catch(error){errors.push(`Cannot scan out/: ${error.message}`);}
for(const file of assets){try{const result=await stat(path.join(root,file));if(!result.isFile()||!result.size)errors.push(`Empty asset: ${file}`);}catch{errors.push(`Missing asset: ${file}`);}}
for(const route of routes){
 try{
  const html=await readFile(path.join(root,route,'index.html'),'utf8');
  const head=html.split('</head>')[0];
  if(!/<title>[^<]+<\/title>/.test(head))errors.push(`Missing title: /${route}`);
  if(!/<meta\s+name="description"/.test(head))errors.push(`Missing description: /${route}`);
  if(!/<link\s+rel="canonical"/.test(head))errors.push(`Missing canonical: /${route}`);
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(`Expected one h1: /${route}`);
  if(/<meta[^>]+name="robots"[^>]+content="[^\"]*noindex/.test(head))errors.push(`Unexpected noindex: /${route}`);
  if(!html.includes('application/ld+json'))errors.push(`Missing structured data: /${route}`);
  if(!html.includes('/engine/experience.mjs'))errors.push(`Missing interaction module: /${route}`);
 }catch(error){errors.push(`Cannot read /${route}/index.html: ${error.message}`);}
}
try{
 const robots=await readFile(path.join(root,'robots.txt'),'utf8'),sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
 if(!robots.includes('Sitemap:'))errors.push('robots.txt has no sitemap declaration');
 for(const route of routes.filter(Boolean))if(!new RegExp(`<loc>https?://[^/<]+/${route}/</loc>`).test(sitemap))errors.push(`Missing sitemap route: ${route}`);
}catch(error){errors.push(error.message);}
// VibePlayer, PawSip, Trove, Stagecraft and Inkwell read these feeds to update themselves: each must stay valid JSON with every edition, an HTTPS link, size and SHA-256.
for(const [file,app] of [['vibeplayer.json','VibePlayer'],['pawsip.json','PawSip'],['trove.json','Trove'],['stagecraft.json','Stagecraft'],['inkwell.json','Inkwell']]){
 try{
  const feed=JSON.parse(await readFile(path.join(root,'updates',file),'utf8'));
  if(feed.app!==app||!/^\d+\.\d+\.\d+$/.test(feed.version??''))errors.push(`updates/${file}: missing app or version`);
  for(const id of ['x64','arm64','x86','win7-8']){const e=feed.editions?.[id];if(!e||!/^https:\/\//.test(e.url)||!/^[0-9a-f]{64}$/.test(e.sha256)||!(e.size>0))errors.push(`updates/${file}: bad ${id} entry`);}
 }catch(error){errors.push(`Cannot parse updates/${file}: ${error.message}`);}
}
if(errors.length){console.error('Export verification failed:\n'+errors.map(e=>' - '+e).join('\n'));process.exitCode=1;}
else console.log(`Export verified: ${routes.length} indexable pages, 404, static discovery routes, local engine, assets, the VibePlayer, PawSip, Trove, Stagecraft and Inkwell update feeds, and no file over 25 MiB.`);
