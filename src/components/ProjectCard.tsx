import Link from "next/link";
import type { Project } from "@/data/portfolio";
import { Arrow } from "./StudioIcons";
import { Tape } from "./DeskObjects";

export function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (id: string) => void }) {
  return (
    <article className={`project-wrap project-${project.id}`}>
      <button className="project-card" type="button" onClick={() => onOpen(project.id)} aria-label={`Quick view ${project.name}`}>
        <div className={`project-art art-${project.id}`}>
          <Tape className={`tape-project tape-${index}`} />
          <CardArt id={project.id} />
        </div>
      </button>
      <div className="project-meta-row">
        <div className="project-meta">
          <span><strong>{project.name}</strong><small>{project.strapline}</small></span>
        </div>
        <Link className="case-link" href={`/work/${project.id}`} aria-label={`Read ${project.name} case study`}>Case study <Arrow /></Link>
      </div>
      <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>
  );
}

export function CardArt({ id }: { id: string }) {
  if (id === "langvoice") return <><div className="lv-title">LangVoice</div><div className="wave">{Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ height: `${12 + ((i * 17) % 36)}px` }} />)}</div><div className="lv-window"><span className="record" /><div className="lv-copy">Give your ideas<br />a voice.</div><span className="lv-listen">Listen ↗</span></div></>;
  if (id === "resumeworld") return <><div className="rw-orb rw-a" /><div className="rw-orb rw-b" /><div className="rw-title">resume<br />world.</div><div className="resume-sheet"><span className="avatar" /><i /><i /><i /><b /><b /><b /></div><div className="rw-note">More<br />people.<br /><em>Better</em><br />opportunities.</div></>;
  if (id === "metamod") return <><div className="mm-title">METAMOD</div><div className="flow"><span className="node n1">Ask</span><span className="node n2">Plan</span><span className="node n3">Ship</span><i className="line l1" /><i className="line l2" /><span className="bubble b1">Brain</span><span className="bubble b2">Tools</span><span className="bubble b3">Done</span></div><span className="mm-spark">✳</span></>;
  if (id === "reelsbuilder") return <><div className="rb-title">Reels<span>Builder</span></div><div className="video-ui"><div className="thumb t1" /><div className="thumb play-thumb"><span>▶</span></div><div className="thumb t2" /><div className="timeline"><i /><i /><i /><i /><i /></div></div><span className="rb-line">make it. cut it. share it.</span></>;
  return <><div className="lug-frame"><span className="urdu">لغات</span><strong>LughaatNLP</strong><div className="search-pill">Translate, analyze, understand... <b>→</b></div></div></>;
}
