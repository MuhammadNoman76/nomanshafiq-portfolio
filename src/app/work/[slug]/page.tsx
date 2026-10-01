import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {projects,profile,siteUrl} from '@/data/portfolio';
import {Header,Footer} from '@/components/Chrome';
import {Arrow} from '@/components/Icons';
import {ProjectArt} from '@/components/ProjectArt';
export const dynamicParams=false;
export const dynamic='force-static';
export function generateStaticParams(){return projects.map(({slug})=>({slug}));}
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params,project=projects.find(p=>p.slug===slug);if(!project)return {};
 return {title:`${project.name} - ${project.category}`,description:project.description,alternates:{canonical:`/work/${slug}/`},openGraph:{url:`/work/${slug}/`,title:`${project.name} by Muhammad Noman`,description:project.description,images:[{url:'/og.png',width:1200,height:630}]}};
}
export default async function CaseStudy({params}:Props){
 const {slug}=await params,project=projects.find(p=>p.slug===slug);if(!project)notFound();
 const next=projects[(projects.indexOf(project)+1)%projects.length];
 const structured={'@context':'https://schema.org','@type':'CreativeWork',name:project.name,description:project.description,url:`${siteUrl}/work/${project.slug}/`,creator:{'@type':'Person',name:profile.name,url:siteUrl},keywords:project.stack.join(', ')};
 return <div id="top"><Header/><main id="main" className="case-main"><div className="shell"><a className="case-back" href="/#work"><span aria-hidden="true">&#8592;</span> Back to selected work</a><div className="section-eyebrow"><span>{project.number} / {project.category}</span><span>{project.year}</span></div><div className="case-title"><h1>{project.name}<span>.</span></h1><p>{project.headline}</p></div><ProjectArt project={project} large/><p className="art-disclosure">Original conceptual artwork, not a product interface screenshot.</p><div className="case-body"><aside className="case-aside"><div><span>MY ROLE</span><p>{project.role}</p></div><div><span>TOOLKIT</span><ul>{project.stack.map(item=><li key={item}>{item}</li>)}</ul></div>{project.link&&<a href={project.link} target="_blank" rel="noopener noreferrer" className="round-link"><span className="round-arrow"><Arrow diagonal/></span>Visit the project</a>}</aside><article className="case-story"><p className="case-lead">{project.description}</p><div className="case-metrics">{project.metrics.map(([metric,label])=><div key={label}><strong>{metric}</strong><span>{label}</span></div>)}</div>{project.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}<p className="source-note">Source: Muhammad Noman&apos;s supplied resume. {project.evidence}</p></article></div><a className="next-project" href={`/work/${next.slug}/`}><span>KEEP EXPLORING</span><strong>{next.name}</strong><Arrow diagonal/></a></div></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/></div>;
}
