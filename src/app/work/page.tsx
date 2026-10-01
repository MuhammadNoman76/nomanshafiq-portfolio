import type {Metadata} from 'next';
import {Header,Footer} from '@/components/Chrome';
import {projects} from '@/data/portfolio';
import {Arrow} from '@/components/Icons';
export const metadata:Metadata={title:'Selected AI & Software Projects',description:'Explore AI voice products, recruitment technology, agentic systems, video platforms, and Urdu NLP tools built by Muhammad Noman.',alternates:{canonical:'/work/'}};
export default function Work(){return <div id="top"><Header/><main id="main" className="shell work-archive"><p className="eyebrow">THE WORK / 2023 - PRESENT</p><h1>Ideas, out<br/>in the world.</h1>{projects.map(project=><a className="index-row" key={project.slug} href={`/work/${project.slug}/`}><span className="index-number">{project.number}</span><h2>{project.name}</h2><span className="index-category">{project.category}</span><Arrow diagonal/></a>)}</main><Footer/></div>;}
