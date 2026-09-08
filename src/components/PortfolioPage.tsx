"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { expertise, journey, profile, projects } from "@/data/portfolio";
import { Arrow, Check, Close, Github, Linkedin, Mail, Play, Spark } from "./StudioIcons";
import {
  BlackNotebook,
  Camera,
  Coffee,
  FieldNotes,
  GraphScrap,
  Handheld,
  IdeaSheet,
  Laptop,
  Marker,
  Pen,
  Plant,
  Skyline,
  StickyIdea,
  Tape
} from "./DeskObjects";
import { ProjectCard } from "./ProjectCard";
import { AgentBadge, ArtifactLab, SignalCassette } from "./SignatureObjects";

export default function PortfolioPage() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const rootRef = useRef<HTMLDivElement>(null);
  const project = useMemo(() => projects.find((p) => p.id === activeProject) ?? null, [activeProject]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia("(pointer: fine)").matches) return;
    const pointer = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--px", String(x));
      root.style.setProperty("--py", String(y));
    };
    const tilts = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]"));
    const cleanups = tilts.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
      };
      const leave = () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", pointer);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveProject(null);
        setStoryOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const ids = ["home", "about", "work", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0, 0.08, 0.2, 0.4] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be unavailable in privacy-restricted browsers.
    }
  }

  return (
    <div className="portfolio-shell" ref={rootRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Muhammad Noman home"><Spark /><span>Noman.</span></a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a className={activeSection === "home" ? "active" : ""} href="#home">Home</a>
          <a className={activeSection === "work" ? "active" : ""} href="#work">Work</a>
          <a className={activeSection === "about" ? "active" : ""} href="#about">About</a>
          <a className={activeSection === "contact" ? "active" : ""} href="#contact">Contact</a>
        </nav>
        <div className="social-links">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="Muhammad Noman on GitHub"><Github /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Muhammad Noman on LinkedIn"><Linkedin /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email Muhammad Noman"><Mail /></a>
        </div>
      </header>

      <main id="main">
        <section id="home" className="hero section-canvas" aria-labelledby="hero-title">
          <div className="hero-aura hero-aura-coral" />
          <div className="hero-aura hero-aura-blue" />
          <Plant /><StickyIdea /><Marker /><Coffee /><BlackNotebook /><Handheld /><IdeaSheet /><FieldNotes /><Pen /><SignalCassette className="hero-signal" /><AgentBadge className="hero-agent-badge" />
          <div className="hero-center">
            <div className="availability-pill"><i /> Available for ambitious AI products</div>
            <p className="micro-kicker">AI ENGINEERING • PRODUCT • CLOUD</p>
            <h1 id="hero-title">I build <span className="brush brush-coral">AI agents,</span><br />full-stack products, and<br />intelligent systems that<br /><span className="brush brush-blue">people actually use.</span></h1>
            <p className="intro"><b>I’m Muhammad Noman</b>, a Lead AI Engineer and Full-Stack Developer from Karachi, Pakistan. I design and ship agentic AI, LLM products, and production systems with Python, Next.js, LangChain, Azure, and GCP.</p>
            <div className="skill-row" aria-label="Core technologies">
              <span className="skill ai"><i>◎</i>AI &amp; LLMs</span><span className="skill next"><i>N</i>Next.js</span><span className="skill python"><i>Py</i>Python</span><span className="skill azure"><i>▲</i>Azure</span><span className="skill gcp"><i>G</i>GCP</span>
            </div>
            <div className="hero-actions">
              <a className="primary-btn" href="#work">Explore My Work <Arrow /></a>
              <button className="story-btn" type="button" onClick={() => setStoryOpen(true)}><Play /><span>My Journey<small>2 min read</small></span></button>
            </div>
          </div>
          <p className="hand-note coffee-note">Good<br />Ideas<br />Better<br />Coffee <span>↖</span></p>
          <p className="hand-note humanity-note">Same human.<br />More possibilities.<span>↙</span></p>
        </section>

        <section id="about" className="about section-canvas" aria-labelledby="about-title">
          <GraphScrap />
          <article className="about-paper torn-paper">
            <Tape className="about-tape" />
            <div className="city-card"><Skyline /><span>Karachi,<br />Pakistan</span><b>↗</b></div>
            <div className="about-copy">
              <p className="section-label">WHY I BUILD</p>
              <h2 id="about-title">The interesting part is not<br />what AI can do.<br /><em>It is what we do with it.</em></h2>
              <p>I build at the intersection of artificial intelligence, software engineering, and real-world problems. Sometimes that means giving an idea a voice. Sometimes it means helping an agent reason across tools. Sometimes it means turning a complex workflow into a product that feels simple.</p>
              <p>From system architecture and APIs to product UI and cloud deployment, I like being part of the whole story.</p>
              <a href={profile.resume} download>Read my resume <Arrow /></a>
            </div>
          </article>
          <div className="people-card"><span>PEOPLE<br />IDEAS<br />AI</span><i>A BRIGHTER<br />TOMORROW</i></div>
        </section>

        <ArtifactLab />

        <section className="expertise section-canvas" aria-labelledby="expertise-title">
          <div className="expertise-heading">
            <p className="micro-kicker">WHAT I DO BEST</p>
            <h2 id="expertise-title">Engineering depth.<br /><span>Product instinct.</span></h2>
            <p>I work across the full AI product lifecycle, from model behavior and agent orchestration to backend APIs, frontend experience, and cloud deployment.</p>
          </div>
          <div className="expertise-grid">
            {expertise.map((item) => (
              <article key={item.eyebrow} className={`expertise-card expertise-${item.tone}`}>
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="work section-canvas" aria-labelledby="work-title">
          <div className="work-heading"><p className="micro-kicker">SELECTED WORK</p><h2 id="work-title">A few things I have been<br /><span>bringing to life.</span></h2></div>
          <p className="hand-note impact-note">Real projects.<br />Real people.<br />Real impact.<span>↙</span></p>
          <div className="projects-grid">
            {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onOpen={setActiveProject} />)}
            <div className="mission-note tactile" data-tilt><Tape /><p>Different<br />Problems.<br />Same Mission.<br /><b>Move Humanity<br />with Technology!</b> ☺</p></div>
          </div>
          <p className="hand-note stories-note">Small<br />screens.<br />Big<br />stories. <span>→</span></p>
          <div className="impact-strip torn-paper" aria-label="Portfolio impact">
            <span><b>20+</b>agentic AI projects</span><span><b>1K+</b>LangVoice users</span><span><b>20K+</b>creators reached</span><span><b>4+</b>years building</span>
          </div>
          <Camera />
        </section>

        <section id="contact" className="contact section-canvas" aria-labelledby="contact-title">
          <Laptop />
          <p className="hand-note tools-note">Better<br />Tools.<br />Brighter<br />People. ☺</p>
          <article className="contact-paper torn-paper">
            <div className="contact-copy">
              <p className="micro-kicker">THE NEXT GOOD THING STARTS WITH A CONVERSATION</p>
              <h2 id="contact-title">Have a curious idea?<br />Let’s make something <em>remarkable.</em></h2>
              <p className="contact-subcopy">AI product, agent platform, collaboration, or just a genuinely interesting problem. I am always happy to talk with people building useful things.</p>
            </div>
            <a className="call-sticky tactile" data-tilt href={`mailto:${profile.email}?subject=Let%27s%20build%20something`}>Start a<br />Conversation <span>→</span></a>
            <div className="contact-checks"><span><Check />AI Product</span><span><Check />Collaboration</span><span><Check />Architecture</span><span><Check />Career Chat</span></div>
          </article>
          <div className="contact-bottom">
            <div><span className="globe">◎</span><p>Built with care.<br />And a little curiosity.</p></div>
            <div className="contact-actions"><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><button onClick={copyEmail}>{copied ? "Copied!" : "Email"}</button></div>
          </div>
          <footer>© {new Date().getFullYear()} Muhammad Noman · AI Engineer in Karachi, Pakistan</footer>
        </section>
      </main>

      {(project || storyOpen) && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.currentTarget === e.target) { setActiveProject(null); setStoryOpen(false); } }}>
          <section className="paper-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={() => { setActiveProject(null); setStoryOpen(false); }} aria-label="Close"><Close /></button>
            {project ? (
              <>
                <p className="micro-kicker">{project.year}</p><h2 id="modal-title">{project.name}</h2><p className="modal-lead">{project.description}</p>
                <div className="modal-facts">{project.facts.map((fact, i) => <div key={fact}><span>0{i + 1}</span><p>{fact}</p></div>)}</div>
                <div className="modal-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="modal-actions-row">
                  <a className="primary-btn modal-action" href={`/work/${project.id}`}>Read case study <Arrow /></a>
                  {project.url && <a className="text-action" href={project.url} target="_blank" rel="noreferrer">Visit project ↗</a>}
                </div>
              </>
            ) : (
              <>
                <p className="micro-kicker">THE STORY SO FAR</p><h2 id="modal-title">Always learning.<br />Always building.</h2><p className="modal-lead">I like the space where AI engineering, product thinking, and full-stack development overlap.</p>
                <div className="journey">{journey.map((item) => <article key={`${item.company}-${item.year}`}><span>{item.year}</span><div><h3>{item.company}</h3><b>{item.role}</b><p>{item.copy}</p></div></article>)}</div>
                <a className="primary-btn modal-action" href={profile.resume} download>Download resume <Arrow /></a>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
