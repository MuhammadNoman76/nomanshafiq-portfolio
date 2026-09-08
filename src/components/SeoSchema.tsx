import { profile, projects } from "@/data/portfolio";

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function SeoSchema() {
  const personId = `${profile.website}/#person`;
  const websiteId = `${profile.website}/#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        url: profile.website,
        email: `mailto:${profile.email}`,
        jobTitle: profile.currentRole,
        description: profile.headline,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Karachi",
          addressRegion: "Sindh",
          addressCountry: "PK"
        },
        worksFor: { "@type": "Organization", name: profile.company },
        sameAs: [profile.github, profile.linkedin],
        knowsAbout: [
          "Artificial Intelligence",
          "Agentic AI",
          "AI Agents",
          "Large Language Models",
          "Retrieval-Augmented Generation",
          "Natural Language Processing",
          "LangChain",
          "LangGraph",
          "Google ADK",
          "Python",
          "Next.js",
          "React",
          "Microsoft Azure",
          "Google Cloud Platform",
          "DevOps"
        ]
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: profile.website,
        name: "Muhammad Noman Portfolio",
        description: "Portfolio and selected AI engineering work by Muhammad Noman.",
        inLanguage: "en-PK",
        publisher: { "@id": personId }
      },
      {
        "@type": "ProfilePage",
        "@id": `${profile.website}/#profile-page`,
        url: profile.website,
        name: "Muhammad Noman — AI Engineer & Full-Stack Developer",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        inLanguage: "en-PK"
      },
      {
        "@type": "ItemList",
        "@id": `${profile.website}/#selected-work`,
        name: "Selected AI engineering projects",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${profile.website}/work/${project.id}`,
          name: project.name
        }))
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }} />;
}
