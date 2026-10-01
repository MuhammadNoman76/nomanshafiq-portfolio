import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const routes=['','work','work/langvoice','work/resumeworld','work/metamod','work/reelsbuilder','work/lughaat'];
const assets=['404.html','robots.txt','sitemap.xml','manifest.webmanifest','favicon.svg','og.png','engine/experience.mjs','engine/sculpture.mjs','files/muhammad-noman-resume.pdf','art/hero.webp','art/hero-flow.webp','art/hero-reimagine.webp'];
const errors=[];
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
 for(const route of routes.filter(Boolean))if(!sitemap.includes(`/${route}/`))errors.push(`Missing sitemap route: ${route}`);
}catch(error){errors.push(error.message);}
if(errors.length){console.error('Export verification failed:\n'+errors.map(e=>' - '+e).join('\n'));process.exitCode=1;}
else console.log(`Export verified: ${routes.length} indexable pages, 404, static discovery routes, local engine, and assets.`);
