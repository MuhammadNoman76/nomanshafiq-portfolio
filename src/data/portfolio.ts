export const profile = {
  name: "Muhammad Noman",
  shortName: "Noman",
  email: "muhammadnomanshafiq76@gmail.com",
  location: "Karachi, Pakistan",
  github: "https://github.com/MuhammadNoman76",
  linkedin: "https://www.linkedin.com/in/muhammad-noman76/",
  website: "https://www.thenoman.online",
  resume: "/files/Muhammad-Noman-Resume.docx",
  role: "AI Engineer and Full-Stack Developer",
  company: "Bayseian",
  currentRole: "Lead AI Engineer",
  headline: "AI Engineer in Karachi building agentic AI systems, LLM products, and full-stack applications."
};

export type Project = {
  id: string;
  name: string;
  strapline: string;
  description: string;
  seoDescription: string;
  overview: string;
  year: string;
  tags: string[];
  accent: string;
  url?: string;
  facts: string[];
};

export const projects: Project[] = [
  {
    id: "langvoice",
    name: "LangVoice",
    strapline: "Giving ideas a voice with AI.",
    description: "A production text-to-speech platform with natural voices, SDKs, and agent integrations.",
    seoDescription: "LangVoice is an AI text-to-speech platform built by Muhammad Noman with 28+ natural voices, 9 languages, SDKs, and integrations for AI agent frameworks.",
    overview: "I built and launched LangVoice as a production AI text-to-speech product focused on natural voice generation, fast integration, and practical use inside modern AI applications.",
    year: "2025 — Present",
    tags: ["AI", "Voice", "LLMs", "Product"],
    accent: "violet",
    url: "https://langvoice.pro",
    facts: ["28+ natural voices across 9 languages", "Python and JavaScript SDKs", "1,000+ active users", "1M+ minutes of generated audio"]
  },
  {
    id: "resumeworld",
    name: "ResumeWorld",
    strapline: "A better next chapter.",
    description: "An AI-powered resume screening and recruitment experience built around intelligent candidate matching.",
    seoDescription: "ResumeWorld is an AI resume screening and recruitment platform by Muhammad Noman for analyzing large resume sets and matching candidates more intelligently.",
    overview: "ResumeWorld turns a high-volume recruiting workflow into a focused AI-assisted experience, helping recruiters screen and compare candidates with a product designed for speed and clarity.",
    year: "2025 — Present",
    tags: ["AI", "Career Tech", "Web App"],
    accent: "emerald",
    url: "https://resumeworld.app",
    facts: ["AI resume analysis and matching", "Built for 50,000+ resumes", "95% screening accuracy", "Designed to save 40+ hours per hire"]
  },
  {
    id: "metamod",
    name: "Metamod",
    strapline: "Less busywork. More possibility.",
    description: "An agentic workflow platform where natural language becomes executable automation.",
    seoDescription: "Metamod is an agentic AI workflow platform designed by Muhammad Noman for natural-language automation, multi-agent collaboration, and real-time task execution.",
    overview: "Metamod explores a simple idea: describe the outcome you want, then let an orchestrated set of AI agents and tools turn that intent into an executable workflow.",
    year: "2025 — Present",
    tags: ["Automation", "AI Agents", "Productivity"],
    accent: "coral",
    facts: ["Natural-language workflow creation", "Multi-agent collaboration", "Intelligent orchestration", "Real-time task execution"]
  },
  {
    id: "reelsbuilder",
    name: "ReelsBuilder",
    strapline: "Turn ideas into engaging short videos.",
    description: "A full-stack AI video creation platform for TikTok, Reels, and YouTube Shorts.",
    seoDescription: "ReelsBuilder is an AI video creation platform architected by Muhammad Noman with automated short-form generation, voiceover, viral moment detection, and publishing workflows.",
    overview: "I architected the AI and full-stack systems behind a short-form video platform built to move from source content to edited, voiced, formatted, and publishable clips quickly.",
    year: "2025 — 2026",
    tags: ["AI Video", "Content Tools", "Creativity"],
    accent: "peach",
    facts: ["100,000+ clips", "20,000+ active creators", "Viral moment detection", "AI voiceover and publishing workflows"]
  },
  {
    id: "lughaat",
    name: "LughaatNLP",
    strapline: "Making room for Urdu in AI.",
    description: "An open-source Urdu NLP library covering core language-processing tasks.",
    seoDescription: "LughaatNLP is an open-source Urdu NLP library by Muhammad Noman covering tokenization, lemmatization, POS tagging, NER, and spell checking.",
    overview: "LughaatNLP is an open-source Python library created to make common Urdu natural-language processing tasks easier to use in research, prototypes, and language-focused AI systems.",
    year: "2023 — 2024",
    tags: ["NLP", "Urdu", "LLMs", "Open Source"],
    accent: "green",
    url: "https://github.com/MuhammadNoman76/LughaatNLP",
    facts: ["Tokenization and lemmatization", "POS tagging and NER", "Spell checking", "Open-source Python library"]
  }
];

export const expertise = [
  {
    eyebrow: "01 / AGENTIC AI",
    title: "AI agents & multi-agent systems",
    copy: "Production agent workflows using LangChain, LangGraph, Google ADK, tool calling, orchestration, and human-in-the-loop patterns.",
    tone: "coral"
  },
  {
    eyebrow: "02 / LLM ENGINEERING",
    title: "LLM apps, RAG & fine-tuning",
    copy: "LLM product engineering across retrieval, evaluation, model adaptation, multimodal systems, and production LLMOps.",
    tone: "violet"
  },
  {
    eyebrow: "03 / FULL-STACK",
    title: "AI products people can use",
    copy: "Fast, responsive products with Next.js, React, TypeScript, Python, FastAPI, Node.js, APIs, and modern product UX.",
    tone: "blue"
  },
  {
    eyebrow: "04 / CLOUD",
    title: "Cloud, DevOps & deployment",
    copy: "Scalable delivery on Microsoft Azure and Google Cloud with Docker, CI/CD, production APIs, and distributed-system thinking.",
    tone: "green"
  }
];

export const journey = [
  {year: "2026", company: "Bayseian", role: "Lead AI Engineer", copy: "Leading enterprise AI products, custom agents, and production full-stack systems."},
  {year: "2025", company: "ReelsBuilder", role: "Senior AI Developer & Architect", copy: "Architected a large-scale AI video creation and publishing platform."},
  {year: "2024", company: "Convsync.co", role: "Senior AI Developer & DevOps Engineer", copy: "Built web products, backend systems, LLM applications, and deployment pipelines."},
  {year: "2023", company: "MedicalNao", role: "Mid-Level AI Developer", copy: "Shipped healthcare AI prototypes using NLP, computer vision, FastAPI, and Django."}
];
