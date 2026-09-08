import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardArt } from "@/components/ProjectCard";
import { Arrow } from "@/components/StudioIcons";
import { profile, projects } from "@/data/portfolio";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) return {};
  const canonical = `/work/${project.id}`;
  return {
    title: `${project.name} — AI Engineering Case Study`,
    description: project.seoDescription,
    keywords: [project.name, ...project.tags, "Muhammad Noman", "AI engineering case study"],
    alternates: { canonical },
    openGraph: {
      title: `${project.name} | Muhammad Noman`,
      description: project.seoDescription,
      url: `${profile.website}${canonical}`,
      type: "article",
      siteName: "Muhammad Noman",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: `${project.name} — Muhammad Noman` }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Muhammad Noman`,
      description: project.seoDescription,
      images: ["/opengraph-image.png"]
    }
  };
}

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) {
    notFound();
    throw new Error("Project not found");
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.name,
        url: `${profile.website}/work/${project.id}`,
        description: project.seoDescription,
        creator: { "@type": "Person", name: profile.name, url: profile.website },
        keywords: project.tags.join(", ")
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: profile.website },
          { "@type": "ListItem", position: 2, name: "Work", item: `${profile.website}/#work` },
          { "@type": "ListItem", position: 3, name: project.name, item: `${profile.website}/work/${project.id}` }
        ]
      }
    ]
  };

  return (
    <main className="case-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <header className="case-nav">
        <Link className="brand" href="/"><span className="case-spark">✳</span><span>Noman.</span></Link>
        <Link className="case-back" href="/#work">← Back to selected work</Link>
      </header>

      <section className="case-hero">
        <div className="case-intro">
          <p className="micro-kicker">{project.year} • CASE STUDY</p>
          <h1>{project.name}</h1>
          <p className="case-deck">{project.description}</p>
          <div className="project-tags case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {project.url && <a className="primary-btn" href={project.url} target="_blank" rel="noreferrer">Visit project <Arrow /></a>}
        </div>
        <div className={`case-art project-art art-${project.id}`}><CardArt id={project.id} /></div>
      </section>

      <section className="case-story torn-paper">
        <div>
          <p className="micro-kicker">THE IDEA</p>
          <h2>Built to turn difficult AI capability into a usable product.</h2>
        </div>
        <div className="case-copy">
          <p>{project.overview}</p>
          <p>My focus was not only on the model or backend behavior. The product also needed clear interaction design, reliable system architecture, and a path to production deployment.</p>
        </div>
      </section>

      <section className="case-results">
        <div className="case-results-heading">
          <p className="micro-kicker">SELECTED OUTCOMES</p>
          <h2>What the work delivered.</h2>
        </div>
        <div className="case-fact-grid">
          {project.facts.map((fact, index) => <article key={fact}><span>0{index + 1}</span><p>{fact}</p></article>)}
        </div>
      </section>

      <section className="case-next">
        <p>Want to see the rest?</p>
        <Link href="/#work">Explore all selected work <Arrow /></Link>
      </section>
    </main>
  );
}
