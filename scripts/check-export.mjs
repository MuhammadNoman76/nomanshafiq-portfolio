import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const routes=['','work','work/langvoice','work/resumeworld','work/metamod','work/reelsbuilder','work/lughaat','blog','blog/jev-urdu-benchmarks','blog/pawsip','pawsip','blog/vibeplayer','vibeplayer'];
const assets=['404.html','robots.txt','sitemap.xml','manifest.webmanifest','favicon.svg','og.png','engine/experience.mjs','engine/sculpture.mjs','files/muhammad-noman-resume.pdf','art/hero.webp','art/hero-flow.webp','art/hero-reimagine.webp','art/jev-urdu-cover.webp','art/jev-urdu-social.jpg','art/pawsip-cover.png','art/pawsip-social.jpg','art/vibeplayer-cover.jpg','art/vibeplayer-social.jpg','art/vibeplayer-dialog.jpg','art/vibeplayer-jump.jpg','art/vibeplayer-hold.jpg','art/vibeplayer-menu.jpg','media/vibeplayer-launch.mp4','media/vibeplayer-launch.en.vtt','media/vibeplayer-launch-poster.jpg','media/vibeplayer-skip-demo.mp4','media/vibeplayer-skip-demo-poster.jpg','updates/vibeplayer.json','updates/pawsip.json','benchmarks/jev-urdu-results.json','benchmarks/jev-urdu-metrics.csv','benchmarks/jev-urdu-deltas.csv'];
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
// VibePlayer and PawSip read these feeds to update themselves: each must stay valid JSON with every edition, an HTTPS link, size and SHA-256.
for(const [file,app] of [['vibeplayer.json','VibePlayer'],['pawsip.json','PawSip']]){
 try{
  const feed=JSON.parse(await readFile(path.join(root,'updates',file),'utf8'));
  if(feed.app!==app||!/^\d+\.\d+\.\d+$/.test(feed.version??''))errors.push(`updates/${file}: missing app or version`);
  for(const id of ['x64','arm64','x86','win7-8']){const e=feed.editions?.[id];if(!e||!/^https:\/\//.test(e.url)||!/^[0-9a-f]{64}$/.test(e.sha256)||!(e.size>0))errors.push(`updates/${file}: bad ${id} entry`);}
 }catch(error){errors.push(`Cannot parse updates/${file}: ${error.message}`);}
}
if(errors.length){console.error('Export verification failed:\n'+errors.map(e=>' - '+e).join('\n'));process.exitCode=1;}
else console.log(`Export verified: ${routes.length} indexable pages, 404, static discovery routes, local engine, assets, the VibePlayer and PawSip update feeds, and no file over 25 MiB.`);
