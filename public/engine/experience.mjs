import {createSculpture,clamp,lerp} from './sculpture.mjs';

function init() {
 const root=document.documentElement;
 // Reinitialization is safe on Next.js client route transitions.
 window.__kineticCleanup?.();
 const cleanups=[];const projectWakes=[];let dead=false;
 const on=(node,name,handler,options)=>{node?.addEventListener(name,handler,options);cleanups.push(()=>node?.removeEventListener(name,handler,options));};
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 try{paused=paused||localStorage.getItem('noman-motion')==='off';}catch{}
 root.dataset.motion=paused?'off':'on';
 const motionButtons=[...document.querySelectorAll('[data-motion-toggle]')];
 function syncMotion(){
   root.dataset.motion=paused?'off':'on';
   for(const wake of projectWakes)wake();
   for(const button of motionButtons){button.setAttribute('aria-pressed',String(!paused));button.innerHTML=`<span class="motion-icon" aria-hidden="true">${paused?'&#9654;':'&#10074;&#10074;'}</span> Motion ${paused?'off':'on'}`;}
 }
 syncMotion();
 let resetFrame=()=>{};
 for(const button of motionButtons) on(button,'click',()=>{paused=!paused;syncMotion();try{localStorage.setItem('noman-motion',paused?'off':'on');}catch{}resetFrame();});
 on(reduced,'change',e=>{paused=e.matches;syncMotion();resetFrame();});
 const stage=document.querySelector('[data-sculpture-stage]');
 const canvas=stage?.querySelector('canvas');
 if(stage&&canvas){
   let frame=0,mode=0,t=0,last=0,visible=true,dragging=false,lastX=0,lastY=0;
   let angleX=-.23,angleY=.25,targetX=-.23,targetY=.25;
   const weights=[1,0,0],pointer={x:0,y:0};
   let scrollProgress=0;
   const small=window.matchMedia('(max-width: 767px)').matches;
   const renderer=createSculpture(canvas,{quality:small?.75:1,onReady(){stage.dataset.webgl='ready';},onError(){stage.dataset.webgl='fallback';}});
   if(renderer){
     stage.tabIndex=0;
     const render=(stamp=0)=>{
       if(dead)return;frame=0;
       const dt=clamp((stamp-(last||stamp))/1000,0,.05);last=stamp;
       if(!paused)t+=dt;
       const rate=paused?1:Math.min(1,dt*7);
       for(let i=0;i<3;i++)weights[i]=lerp(weights[i],Number(i===mode),rate);
       angleX=lerp(angleX,targetX+pointer.y*.08,rate);
       angleY=lerp(angleY,targetY+pointer.x*.12,rate);
       renderer.render({time:t,rx:angleX-scrollProgress*.24,ry:angleY+(paused?0:Math.sin(t*.15)*.22)+scrollProgress*.75,weights});
       const settling=weights.some((v,i)=>Math.abs(v-Number(i===mode))>.002)||Math.abs(angleX-targetX-pointer.y*.08)>.002||Math.abs(angleY-targetY-pointer.x*.12)>.002;
       if(visible&&!document.hidden&&(!paused||settling))frame=requestAnimationFrame(render);
     };
     resetFrame=()=>{if(!frame&&!dead&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(render);}};
     on(window,'scroll',()=>{if(!reduced.matches){scrollProgress=clamp(-stage.getBoundingClientRect().top/innerHeight,0,1);resetFrame();}},{passive:true});
     on(stage,'pointerdown',event=>{if(event.target!==canvas||event.pointerType==='touch')return;dragging=true;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture(event.pointerId);stage.dataset.dragging='true';});
     on(stage,'pointermove',event=>{
       if(reduced.matches)return;
       const rect=stage.getBoundingClientRect();pointer.x=(event.clientX-rect.left)/rect.width-.5;pointer.y=(event.clientY-rect.top)/rect.height-.5;
       if(dragging){targetY+=(event.clientX-lastX)*.007;targetX=clamp(targetX+(event.clientY-lastY)*.007,-1.2,1.2);lastX=event.clientX;lastY=event.clientY;}resetFrame();
     });
     const endDrag=()=>{dragging=false;delete stage.dataset.dragging;};on(stage,'pointerup',endDrag);on(stage,'pointercancel',endDrag);on(stage,'lostpointercapture',endDrag);
     on(stage,'pointerleave',()=>{pointer.x=0;pointer.y=0;resetFrame();});
     on(stage,'keydown',event=>{if(event.target!==stage)return;const actions={ArrowLeft:()=>targetY-=.16,ArrowRight:()=>targetY+=.16,ArrowUp:()=>targetX-=.16,ArrowDown:()=>targetX+=.16};if(actions[event.key]){event.preventDefault();actions[event.key]();resetFrame();}});
     for(const button of document.querySelectorAll('[data-shape]')) on(button,'click',()=>{
       mode=Number(button.dataset.shape);
       for(const sibling of document.querySelectorAll('[data-shape]'))sibling.setAttribute('aria-pressed',String(sibling===button));
       const names=['Connected by curiosity.','A continuous conversation.','A different perspective.'];
       const label=document.querySelector('[data-shape-label]');if(label)label.textContent=names[mode];
       stage.dataset.currentShape=String(mode);
       if(stage.dataset.webgl==='fallback'){const files=['hero.webp','hero-flow.webp','hero-reimagine.webp'],choice=mode;const poster=stage.querySelector('.sculpture-poster');if(poster)poster.src='/art/'+files[choice];}
       resetFrame();
     });
     const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resetFrame();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});observer.observe(stage);cleanups.push(()=>observer.disconnect());
     const resize=new ResizeObserver(()=>resetFrame());resize.observe(stage);cleanups.push(()=>resize.disconnect());
     on(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resetFrame();});
     on(canvas,'webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;stage.dataset.webgl='fallback';const files=['hero.webp','hero-flow.webp','hero-reimagine.webp'],choice=mode;const poster=stage.querySelector('.sculpture-poster');if(poster)poster.src='/art/'+files[choice];stage.setAttribute('aria-label','Sculpture image gallery. Select a shape below.');const help=document.querySelector('#sculpture-help');if(help)help.textContent='SHAPE EXPLORER';});
     on(canvas,'webglcontextrestored',()=>init());
     cleanups.push(()=>{cancelAnimationFrame(frame);renderer.dispose();});
     renderer.render();resetFrame();
     stage.dataset.triangles=String(renderer.getInfo().triangles);
   }else{
     stage.removeAttribute('tabindex');
     stage.setAttribute('aria-label','Sculpture image gallery. Select Connect, Flow, or Reimagine below.');
     const help=document.querySelector('#sculpture-help');if(help)help.textContent='SHAPE EXPLORER';
     for(const button of document.querySelectorAll('[data-shape]'))on(button,'click',()=>{
       const choice=Number(button.dataset.shape);
       const files=['hero.webp','hero-flow.webp','hero-reimagine.webp'];
       const poster=stage.querySelector('.sculpture-poster');if(poster)poster.src='/art/'+files[choice];
       for(const sibling of document.querySelectorAll('[data-shape]'))sibling.setAttribute('aria-pressed',String(sibling===button));
       const label=document.querySelector('[data-shape-label]');if(label)label.textContent=['Connected by curiosity.','A continuous conversation.','A different perspective.'][choice];
       stage.dataset.currentShape=String(choice);
     });
   }
 }

 // Project sculptures activate only when visible on desktop, using the same
 // local geometry and shader. Mobile and reduced-motion users keep the artwork.
 if(!window.matchMedia('(max-width: 767px)').matches&&!reduced.matches){
   for(const art of document.querySelectorAll('[data-project-mode]')){
     const miniCanvas=art.querySelector('canvas');if(!miniCanvas)continue;
     let mini=null,frame=0,seen=false,inView=false,t=0,last=0;
     const mode=Number(art.dataset.projectMode),material=Number(art.dataset.projectMaterial);
     const tick=(stamp=0)=>{
       frame=0;if(dead||!mini)return;
       const dt=clamp((stamp-(last||stamp))/1000,0,.05);last=stamp;if(!paused)t+=dt;
       mini.render({mode,material,orbs:false,rx:mode===1?-.72:-.28,ry:.45+Math.sin(t*.3)*.18,scale:1});
       art.dataset.live='ready';
       if(inView&&!paused&&!document.hidden)frame=requestAnimationFrame(tick);
     };
     const wake=()=>{if(inView&&mini&&!frame&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}};
     projectWakes.push(wake);
     const observer=new IntersectionObserver(entries=>{
       inView=entries[0].isIntersecting;
       if(inView&&!seen){seen=true;mini=createSculpture(miniCanvas,{quality:.75});}
       if(inView)wake();else{cancelAnimationFrame(frame);frame=0;}
     },{rootMargin:'60px'});
     observer.observe(art);
     on(miniCanvas,'webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;delete art.dataset.live;mini=null;});
     on(miniCanvas,'webglcontextrestored',()=>{seen=false;delete art.dataset.live;if(inView){seen=true;mini=createSculpture(miniCanvas,{quality:.75});wake();}});
     on(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
     const resize=new ResizeObserver(()=>wake());resize.observe(art);
     cleanups.push(()=>{observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);mini?.dispose();});
   }
 }
 for(const button of document.querySelectorAll('[data-copy-email]'))on(button,'click',async()=>{
   const email=button.dataset.copyEmail;const status=document.querySelector('[data-copy-status]');
   try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(email);if(status)status.textContent='Email copied. See you in the inbox.';}
   catch{if(status)status.textContent=`Email: ${email}`;}
 });
 const menu=document.querySelector('details.mobile-menu');
 if(menu){on(menu,'keydown',e=>{if(e.key==='Escape'){menu.open=false;menu.querySelector('summary')?.focus();}});for(const link of menu.querySelectorAll('a'))on(link,'click',()=>{menu.open=false;});}
 for(const anchor of document.querySelectorAll('a[href^="#"]'))on(anchor,'click',()=>{if(menu)menu.open=false;});
 // Content is visible before JS and with reduced motion. Animate only below-fold
 // sections that have not already been seen; never hide the hero/LCP content.
 const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-inview');reveal.unobserve(entry.target);}},{threshold:.12});
 if(!reduced.matches)for(const el of document.querySelectorAll('[data-reveal]')){if(el.getBoundingClientRect().top>innerHeight){el.classList.add('will-reveal');reveal.observe(el);}}
 cleanups.push(()=>reveal.disconnect());
 const progress=document.querySelector('[data-progress]');let scrollFrame=0;
 const updateProgress=()=>{scrollFrame=0;const total=root.scrollHeight-innerHeight;if(progress)progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;};
 on(window,'scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);},{passive:true});updateProgress();
 cleanups.push(()=>cancelAnimationFrame(scrollFrame));
 window.__kineticCleanup=()=>{dead=true;for(const cleanup of cleanups)cleanup();};
 root.dataset.experience='ready';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
// Full-page links intentionally preserve native scroll and history semantics.
window.__initKinetic=init;
window.addEventListener('pageshow',event=>{if(event.persisted)init();});
