import type { Project } from '@/data/portfolio';
export function ProjectArt({project,large=false}:{project:Project;large?:boolean}) {
 const {name,category,color,slug,number}=project;
 return <div className={`project-art art-${color} ${large?'art-large':''}`} data-project-mode={project.shape} data-project-material={color==='blue'||color==='ice'?1:color==='peach'?2:color==='lime'?3:0}>
  <div className="art-top"><span>{number} / {category}</span><span className="art-cross" aria-hidden="true">+</span></div>
  <div className="art-object"><img src={`/art/${slug}.webp`} alt={`Original sculptural artwork for ${name}`} width="1000" height="900" loading="lazy" decoding="async"/><canvas className="project-canvas" aria-hidden="true"/></div>
  <div className="art-bottom"><strong>{name}<span aria-hidden="true">*</span></strong><span className="art-type">HUMAN IDEAS.<br/>ENGINEERED POSSIBILITIES.</span></div>
  <span className="art-orbit" aria-hidden="true"/>
 </div>;
}
