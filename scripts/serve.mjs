import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'out');
const port=Number(process.env.PORT||3000);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.csv':'text/csv; charset=utf-8','.xml':'application/xml','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon','.webmanifest':'application/manifest+json','.mp4':'video/mp4','.vtt':'text/vtt; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
   const url=new URL(req.url,'http://localhost');
   let file=path.resolve(root,`.${decodeURIComponent(url.pathname)}`);
   if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
   let stats;try{stats=await stat(file);}catch{}
   if(stats?.isDirectory())file=path.join(file,'index.html');
   let content;try{content=await readFile(file);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});try{res.end(await readFile(path.join(root,'404.html')));}catch{res.end('Not found');}return;}
   const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
   // Byte ranges, as Cloudflare Pages serves them, so videos can seek in the local preview.
   const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
   if(range&&(range[1]||range[2])){
    const size=content.length,suffix=range[1]==='';
    const start=suffix?Math.max(0,size-Number(range[2])):Number(range[1]);
    const end=suffix||range[2]===''?size-1:Math.min(Number(range[2]),size-1);
    if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    if(req.method==='HEAD')res.end();else res.end(content.subarray(start,end+1));
    return;
   }
   res.writeHead(200,headers);
   if(req.method==='HEAD')res.end();else res.end(content);
 }catch{res.writeHead(400);res.end('Invalid request');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Serving ${root} at http://127.0.0.1:${port}`));
