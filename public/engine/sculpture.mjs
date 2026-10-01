/**
 * KINETIC / original, dependency-free WebGL sculpture.
 * Procedural tubular meshes, three morph targets, studio reflection shader.
 * No external models, textures, CDN runtime, tracking, or hidden network requests.
 */
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
const normalize = (v) => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); };
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
function curve(t, mode) {
  if (mode === 1) return [1.20*Math.cos(t), .97*Math.sin(t), .31*Math.sin(2*t)];
  if (mode === 2) return [1.08*Math.cos(t), 1.1*Math.sin(t), .59*Math.sin(3*t)];
  const r = 1.02 + .35*Math.cos(3*t);
  return [r*Math.cos(2*t), r*Math.sin(2*t), .46*Math.sin(3*t)];
}
export function buildMesh(segments=220, radial=24) {
  if(!Number.isInteger(segments)||!Number.isInteger(radial)||segments<3||radial<3||(segments+1)*(radial+1)>65535) throw new RangeError('Mesh dimensions must fit a valid uint16 indexed surface');
  const arrays = [];
  for (let mode=0; mode<3; mode++) {
    const positions=[], normals=[];
    for (let i=0;i<=segments;i++) {
      const t=i/segments*TAU, p=curve(t,mode), next=curve(t+.0001,mode);
      const tangent=normalize(next.map((v,j)=>v-p[j]));
      const axis=normalize(cross(tangent,[0,0,1]));
      const binormal=normalize(cross(tangent,axis));
      for(let j=0;j<=radial;j++) {
        const angle=j/radial*TAU;
        const n=axis.map((v,k)=>v*Math.cos(angle)+binormal[k]*Math.sin(angle));
        const radius = mode===0 ? .305 : mode===1 ? .405 : .285;
        positions.push(...p.map((v,k)=>v+n[k]*radius)); normals.push(...n);
      }
    }
    arrays.push({ positions:new Float32Array(positions), normals:new Float32Array(normals) });
  }
  const indices=[];
  for(let i=0;i<segments;i++) for(let j=0;j<radial;j++) {
    const a=i*(radial+1)+j, b=a+radial+1;
    indices.push(a,b,a+1,b,b+1,a+1);
  }
  return { targets:arrays, indices:new Uint16Array(indices) };
}
function sphere(radius, segments=32, rings=20) {
  const p=[], n=[], idx=[];
  for(let i=0;i<=rings;i++) for(let j=0;j<=segments;j++) {
    const a=i/rings*Math.PI, b=j/segments*TAU;
    const normal=[Math.sin(a)*Math.cos(b), Math.cos(a), Math.sin(a)*Math.sin(b)];
    p.push(...normal.map(x=>x*radius)); n.push(...normal);
  }
  for(let i=0;i<rings;i++) for(let j=0;j<segments;j++) {
    const a=i*(segments+1)+j,b=a+segments+1;idx.push(a,b,a+1,b,b+1,a+1);
  }
  const target={positions:new Float32Array(p),normals:new Float32Array(n)};
  return {targets:[target,target,target],indices:new Uint16Array(idx)};
}
const VERTEX=`
precision highp float;
attribute vec3 aP0; attribute vec3 aN0;
attribute vec3 aP1; attribute vec3 aN1;
attribute vec3 aP2; attribute vec3 aN2;
uniform mat4 uModel; uniform mat4 uView; uniform mat4 uProjection;
uniform vec3 uWeights;
varying vec3 vWorld; varying vec3 vNormal;
void main(){
 vec3 p=aP0*uWeights.x+aP1*uWeights.y+aP2*uWeights.z;
 vec3 n=aN0*uWeights.x+aN1*uWeights.y+aN2*uWeights.z;
 vec4 world=uModel*vec4(p,1.0);
 vWorld=world.xyz; vNormal=normalize(mat3(uModel)*n);
 gl_Position=uProjection*uView*world;
}`;
const FRAGMENT=`
precision highp float;
varying vec3 vWorld; varying vec3 vNormal;
uniform vec3 uEye; uniform int uMaterial; uniform float uWire;
vec3 environment(vec3 r) {
 vec3 c=mix(vec3(.16,.22,.31),vec3(.71,.79,.86),smoothstep(-.55,.7,r.y));
 float darkBand=smoothstep(-.2,.02,r.y)*(1.-smoothstep(.17,.39,r.y));
 c=mix(c,vec3(.017,.022,.03),darkBand*.90);
 float softBox=pow(max(dot(r,normalize(vec3(-.65,.75,1.))),0.),9.);
 float strip=pow(max(dot(r,normalize(vec3(.8,.1,.4))),0.),58.);
 float rim=pow(max(dot(r,normalize(vec3(-.9,.0,-.3))),0.),16.);
 float warm=pow(max(dot(r,normalize(vec3(.65,-.4,-.1))),0.),13.);
 c+=vec3(1.5,1.56,1.63)*softBox+vec3(2.4)*strip+vec3(.45,.6,.92)*rim;
 c+=vec3(.63,.27,.15)*warm;
 return c;
}
vec3 tonemap(vec3 c){return clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.);}
void main(){
 vec3 n=normalize(vNormal),v=normalize(uEye-vWorld);
 if(!gl_FrontFacing) n=-n;
 vec3 r=reflect(-v,n);
 float fresnel=pow(1.-max(dot(n,v),0.),4.);
 float light=max(dot(n,normalize(vec3(-.5,1.,1.))),0.);
 vec3 env=environment(r);
 vec3 color=env*(.82+fresnel*.18);
 if(uMaterial==1) color=vec3(.012,.046,.57)*(.2+light*.55)+env*vec3(.07,.1,.38)*(.55+fresnel*.45);
 if(uMaterial==2) color=vec3(.91,.11,.022)*(.25+light*.7)+env*(.045+fresnel*.32);
 if(uMaterial==3) color=vec3(.54,.68,.02)*(.30+light*.5)+env*(.13+fresnel*.3);
 color *= .87+.13*smoothstep(-1.7,1.,vWorld.y);
 if(uWire>.5){float lines=step(.945,fract(vWorld.y*15.));color=mix(vec3(.02,.06,.11),vec3(.1,.4,1.2),lines);}
 gl_FragColor=vec4(pow(tonemap(color),vec3(1./2.2)),1.);
}`;
function shader(gl,type,source){
 const s=gl.createShader(type); if(!s) throw new Error('WebGL shader allocation failed');
 gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(message||'Shader compilation failed');}
 return s;
}
function perspective(aspect){
 const f=1/Math.tan(32*Math.PI/360), near=.1,far=60,nf=1/(near-far);
 return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function viewMatrix(eye){
 const z=normalize(eye),x=normalize(cross([0,1,0],z)),y=cross(z,x);
 return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1]);
}
function modelMatrix(rx,ry,rz,x=0,y=0,z=0,scale=1){
 const a=Math.cos(rx),b=Math.sin(rx),c=Math.cos(ry),d=Math.sin(ry),e=Math.cos(rz),f=Math.sin(rz);
 return new Float32Array([
 (e*c)*scale,(f*c)*scale,-d*scale,0,
 (e*d*b-f*a)*scale,(f*d*b+e*a)*scale,c*b*scale,0,
 (e*d*a+f*b)*scale,(f*d*a-e*b)*scale,c*a*scale,0,
 x,y,z,1]);
}
/** Returns a disposable renderer; caller owns RAF/lifecycle. */
export function createSculpture(canvas,{onError=()=>{},onReady=()=>{},quality=1}={}) {
 let gl;
 try {gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power',preserveDrawingBuffer:false});}
 catch(error){onError(error);return null;}
 if(!gl){onError(new Error('WebGL unavailable'));return null;}
 let disposed=false,program,vs,fs;
 const allocated=[];
 try {
   vs=shader(gl,gl.VERTEX_SHADER,VERTEX);fs=shader(gl,gl.FRAGMENT_SHADER,FRAGMENT);
   program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)||'Shader link failed');
 } catch(e){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);if(program)gl.deleteProgram(program);onError(e);return null;}
 gl.useProgram(program);
 const loc={};for(const name of ['uModel','uView','uProjection','uWeights','uEye','uMaterial','uWire'])loc[name]=gl.getUniformLocation(program,name);
 const attrs=['aP0','aN0','aP1','aN1','aP2','aN2'].map(name=>gl.getAttribLocation(program,name));
 function upload(mesh){
   const buffers=[];
   for(const target of mesh.targets) for(const array of [target.positions,target.normals]){
     const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);buffers.push(buffer);allocated.push(buffer);
   }
   const index=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);allocated.push(index);
   return {buffers,index,count:mesh.indices.length};
 }
 const mesh=upload(buildMesh(quality<1?150:220,quality<1?18:24));const orb=upload(sphere(.18));
 const eye=[0,.15,7.1];
 gl.uniformMatrix4fv(loc.uView,false,viewMatrix(eye));gl.uniform3fv(loc.uEye,eye);
 gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
 function drawMesh(object,model,weights,material,wire){
   for(let i=0;i<6;i++){gl.bindBuffer(gl.ARRAY_BUFFER,object.buffers[i]);gl.enableVertexAttribArray(attrs[i]);gl.vertexAttribPointer(attrs[i],3,gl.FLOAT,false,0,0);}
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,object.index);gl.uniformMatrix4fv(loc.uModel,false,model);gl.uniform3fv(loc.uWeights,weights);gl.uniform1i(loc.uMaterial,material);gl.uniform1f(loc.uWire,wire?1:0);
   gl.drawElements(gl.TRIANGLES,object.count,gl.UNSIGNED_SHORT,0);
 }
 let width=0,height=0;
 function render({time=0,rx=-.23,ry=.25,mode=0,weights,material=0,wire=false,orbs=true,scale=1}={}) {
   if(disposed||gl.isContextLost())return;
   const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,quality<1?1.25:1.7);
   const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
   if(w!==width||h!==height){width=w;height=h;canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);gl.uniformMatrix4fv(loc.uProjection,false,perspective(w/h));}
   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   const blend=weights||[Number(mode===0),Number(mode===1),Number(mode===2)];
   drawMesh(mesh,modelMatrix(rx,ry,Math.PI*.13,0,Math.sin(time*.6)*.055,0,scale),blend,material,wire);
   if(orbs){
     drawMesh(orb,modelMatrix(0,time*.12,0,-1.54+Math.sin(time*.3)*.08,-.91,1.,.95),[1,0,0],1,false);
     drawMesh(orb,modelMatrix(0,time*.15,0,1.25,.99,.2,.4),[1,0,0],2,false);
   }
   if(canvas.dataset.rendered!=='true')canvas.dataset.rendered='true';
 }
 onReady();
 return {render,dispose(){disposed=true;for(const b of allocated)gl.deleteBuffer(b);gl.deleteShader(vs);gl.deleteShader(fs);gl.deleteProgram(program);}, getInfo(){return {triangles:mesh.count/3,renderer:gl.getParameter(gl.RENDERER),width,height};}};
}
