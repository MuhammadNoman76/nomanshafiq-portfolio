import {Header,Footer} from '@/components/Chrome';
import {Arrow,Asterisk} from '@/components/Icons';
import {ProjectArt} from '@/components/ProjectArt';
import {profile,projects,experience} from '@/data/portfolio';
import {jevArticle} from '@/data/jev-urdu';
export default function Home() {
 return <div id="top">
 <Header home/>
 <main id="main">
  <section className="hero shell" aria-labelledby="hero-title">
   <div className="hero-copy">
    <p className="eyebrow"><span className="live-dot" aria-hidden="true"/> MUHAMMAD NOMAN / AI ENGINEER &amp; BUILDER</p>
    <h1 id="hero-title">Curiosity,<br/>made <em>real.</em><span className="hero-period" aria-hidden="true">*</span></h1>
    <p className="hero-description">I turn the possibilities of AI into products<br className="desktop-break"/> people can actually use. Thoughtfully engineered.<br className="desktop-break"/> A little out of the ordinary.</p>
    <div className="hero-actions"><a className="round-link" href="#work"><span className="round-arrow"><Arrow/></span>Explore my work</a><a className="plain-link" href="#about">The mind behind it <span aria-hidden="true">&#8599;</span></a></div>
   </div>
   <div className="hero-art-wrap">
    <div className="sculpture-meta"><span>EXPERIMENT 001</span><span>INTELLIGENCE, IN MOTION.</span></div>
    <div className="sculpture-stage" data-sculpture-stage="" tabIndex={0} role="group" aria-label="Interactive three-dimensional metal sculpture. Use arrow keys to rotate, or drag with a mouse." aria-describedby="sculpture-help">
     <div className="sculpture-shadow" aria-hidden="true"/>
     <img className="sculpture-poster" src="/art/hero.webp" width="1000" height="1000" alt="A polished, interwoven silver sculpture with blue and orange satellites" fetchPriority="high"/>
     <canvas className="hero-canvas" aria-hidden="true"/>
     <span className="stage-marker marker-a" aria-hidden="true">+</span><span className="stage-marker marker-b" aria-hidden="true">+</span>
    </div>
    <div className="sculpture-caption"><span data-shape-label="">Connected by curiosity.</span><span id="sculpture-help">DRAG TO EXPLORE <span aria-hidden="true">&#8596;</span></span></div>
    <div className="sculpture-controls" role="group" aria-label="Sculpture shape"><button data-shape="0" aria-pressed="true"><span>01</span> Connect</button><button data-shape="1" aria-pressed="false"><span>02</span> Flow</button><button data-shape="2" aria-pressed="false"><span>03</span> Reimagine</button></div>
   </div>
   <div className="hero-baseline"><span>BASED IN KARACHI, PAKISTAN <span className="coords">24.86&deg; N / 67.00&deg; E</span></span><button data-motion-toggle="" aria-pressed="true"><span aria-hidden="true">&#10074;&#10074;</span> Motion on</button><a href="#work" className="scroll-note">SCROLL TO DISCOVER <span aria-hidden="true">&#8595;</span></a></div>
  </section>
  <div className="expertise-strip" aria-label="Specializations"><div className="shell"><span>AGENTIC SYSTEMS</span><Asterisk/><span>VOICE INTELLIGENCE</span><Asterisk/><span>FULL-STACK PRODUCTS</span><Asterisk/></div></div>
  <section className="work-section shell" id="work" aria-labelledby="work-heading">
   <div className="section-eyebrow"><span>01 / SELECTED WORK</span><span>IDEAS ARE NICE. SHIPPED IS BETTER.</span></div>
   <div className="section-intro" data-reveal=""><h2 id="work-heading">Less hypothetical.<br/><em>More out there.</em></h2><p>From a voice for your application to an agent that gets things done. A few things I&apos;ve brought into the world.</p></div>
   <div className="featured-projects">
    {projects.slice(0,2).map(project=><article className={`featured-project project-${project.color}`} key={project.slug} data-reveal=""><a className="project-link" href={`/work/${project.slug}/`} aria-label={`Explore ${project.name}: ${project.headline}`}><ProjectArt project={project}/><div className="project-description"><div><span className="project-category">{project.category}</span><h3>{project.headline}</h3></div><span className="project-arrow"><Arrow diagonal/></span></div></a><p className="project-summary">{project.description}</p></article>)}
   </div>
   <div className="project-index"><div className="index-label">ALSO IN THE MIX <Arrow/></div>{projects.slice(2).map(project=><a href={`/work/${project.slug}/`} className="index-row" key={project.slug} data-reveal=""><span className="index-number">{project.number}</span><h3>{project.name}</h3><span className="index-category">{project.category}</span><span className={`index-swatch swatch-${project.color}`} aria-hidden="true"/><Arrow diagonal/></a>)}</div>
  </section>
  <section className="home-field-note shell" aria-labelledby="field-note-heading"><div className="section-eyebrow"><span>FROM THE BUILDER&apos;S DESK</span><a href="/blog/">ALL FIELD NOTES <Arrow diagonal/></a></div><article className="blog-feature"><a href={jevArticle.path} className="blog-feature-art" aria-label="Read the Jev-Urdu launch and benchmarks"><img src="/art/jev-urdu-cover.webp" width="1672" height="941" loading="lazy" alt="Silver ribbons connecting cobalt and orange spheres"/><span>Jev-Urdu<span lang="ur" dir="rtl">اردو</span></span></a><div className="blog-feature-copy"><p className="eyebrow">NEW FIELD NOTE / URDU NLP</p><h2 id="field-note-heading">Urdu-first AI.<br/><em>Measured in decisions.</em></h2><p>I built Jev-Urdu on a multilingual foundation. Explore the independent benchmarks, the useful gains, and the tradeoffs behind the release.</p><a className="round-link" href={jevArticle.path}><span className="round-arrow"><Arrow/></span>Explore Jev-Urdu <span className="blog-read-time">10 MIN</span></a></div></article></section>
  <section className="approach" id="approach" aria-labelledby="approach-heading"><div className="shell"><div className="section-eyebrow"><span>02 / A WAY OF THINKING</span><Asterisk/></div><h2 id="approach-heading" data-reveal="">Not just smarter<br/>machines.<br/><span>Better human<br/>experiences.</span></h2><div className="approach-bottom"><span className="approach-annotation">THAT&apos;S THE WHOLE POINT.<span aria-hidden="true">&#8627;</span></span><p>I care about the space between a powerful model and a useful product. The orchestration. The interface. The details that turn &ldquo;look what AI can do&rdquo; into &ldquo;how did I work without this?&rdquo;</p></div></div></section>
  <section className="about shell" id="about" aria-labelledby="about-heading"><div className="section-eyebrow"><span>03 / THE HUMAN IN THE LOOP</span><span>STILL CURIOUS. ALWAYS BUILDING.</span></div><div className="about-grid"><div className="about-heading"><span className="human-mark" aria-hidden="true">m<span>n</span><Asterisk/></span><h2 id="about-heading">Engineer by trade.<br/><em>Builder by nature.</em></h2><a className="round-link" href={profile.resume} download><span className="round-arrow light-arrow"><Arrow diagonal/></span>My resume, in full</a></div><div className="about-copy"><p className="about-lead">Hi, I&apos;m Noman. I like difficult problems, thoughtful products, and the moment an idea starts working in the real world.</p><p>I&apos;m an AI engineer and full-stack developer based in Karachi. My work spans agentic AI, large language models, voice technology, and the infrastructure that brings them to life.</p><p>At Bayseian, I lead a team of 8&ndash;12 engineers building AI applications and custom agents for enterprise clients. Outside the product work, I create open-source tools and share what I learn through courses and workshops.</p><div className="about-metrics"><div><strong>4<span>+</span></strong><span>years in AI &amp; full-stack</span></div><div><strong>20<span>+</span></strong><span>agentic AI projects</span></div><div><strong>8&ndash;12</strong><span>engineers led</span></div></div><p className="source-note">Experience and project figures from my resume.</p></div></div><div className="experience"><h3>A little of the journey.</h3>{experience.map(job=><div className="experience-row" key={job.company}><span className="experience-date">{job.dates}</span><div><h4>{job.company}</h4><p>{job.detail}</p></div><span className="experience-role">{job.role}</span></div>)}</div></section>
 </main><Footer/>
 </div>;
}
