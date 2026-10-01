export const profile = {
  name: 'Muhammad Noman',
  role: 'AI Engineer & Full-Stack Developer',
  email: 'muhammadnomanshafiq76@gmail.com',
  github: 'https://github.com/MuhammadNoman76',
  linkedin: 'https://www.linkedin.com/in/muhammad-noman76/',
  location: 'Karachi, Pakistan',
  resume: '/files/muhammad-noman-resume.pdf',
};
export function resolveOrigin(value?: string): string {
  try {
    if (!value?.trim()) return 'https://www.nomanshafiq.com';
    const trimmed = value.trim();
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid origin');
    return url.origin;
  } catch { return 'https://www.nomanshafiq.com'; }
}
export const siteUrl = resolveOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export type Project = {
  slug: string; number: string; name: string; category: string; headline: string;
  description: string; color: string; shape: number; link?: string; year: string;
  role: string; stack: string[]; evidence: string; metrics: [string,string][];
  sections: {title:string; text:string}[];
};
export const projects: Project[] = [
  {
    slug: 'langvoice', number:'01', name:'LangVoice', category:'VOICE INTELLIGENCE',
    headline:'A voice for every idea.', description:'Natural speech. Nine languages. One human connection. An AI text-to-speech product built to give applications a voice.',
    color:'blue', shape:1, link:'https://langvoice.pro', year:'2025 - Present', role:'Product builder & AI engineer',
    stack:['Python', 'Text-to-speech', 'JavaScript SDK', 'AI agent integrations'],
    evidence:'Usage and language figures are reported in my resume, not live analytics.',
    metrics:[['28+','natural voices'],['9','languages'],['1,000+','users']],
    sections:[
      {title:'The idea', text:'Voice should feel like a natural part of an application, not an integration project. I built and launched LangVoice to bring natural text-to-speech into products and AI agent workflows.'},
      {title:'The engineering', text:'The platform combines a text-to-speech service with Python and JavaScript SDKs. Integrations support LangChain, CrewAI, AutoGen, and OpenAI agents, with sub-second latency reported in my resume.'},
      {title:'The result', text:'My resume records 28+ voices across nine languages, more than 1,000 active users, and over one million minutes of generated audio. These are reported project figures rather than a live usage feed.'}
    ]
  },
  {
    slug:'resumeworld', number:'02', name:'ResumeWorld', category:'APPLIED AI / RECRUITMENT',
    headline:'See the person. Not the pile.', description:'An AI recruitment platform that brings resume analysis and candidate matching into one focused workflow.',
    color:'peach', shape:2, link:'https://resumeworld.app', year:'2025 - Present', role:'Product builder & full-stack engineer',
    stack:['AI', 'NLP', 'React', 'SaaS'], evidence:'Capacity and time-saving figures are self-reported in my resume; they are not independently benchmarked.',
    metrics:[['50k+','resume capacity'],['AI','candidate matching'],['NLP','resume analysis']],
    sections:[
      {title:'The idea', text:'Recruitment creates a large volume of documents, but the real task is understanding people. ResumeWorld is an AI-powered screening and recruitment platform I created to make candidate analysis more focused.'},
      {title:'The engineering', text:'The application uses AI and natural-language processing to analyze resumes and support candidate matching, delivered through a React-based SaaS product.'},
      {title:'The result', text:'My resume describes support for analyzing 50,000+ resumes and reports 95% screening accuracy and 40+ hours saved per hire. Those figures are self-reported project claims; a public evaluation methodology is not included in the supplied source.'}
    ]
  },
  {
    slug:'metamod', number:'03', name:'Metamod', category:'AGENTIC SYSTEMS',
    headline:'From a thought to a workflow.', description:'Natural-language automation, coordinated agents, and real-time execution. Built to move beyond the chat box.',
    color:'lime', shape:0, year:'2025 - Present', role:'AI workflow platform engineer',
    stack:['Python','React','Azure','Multi-agent orchestration'], evidence:'Architecture and role are described in my resume.',
    metrics:[['Multi','agent workflows'],['Real-time','execution'],['Azure','infrastructure']],
    sections:[
      {title:'The idea', text:'Describe the outcome in natural language, then turn that intent into an executable workflow. I designed an agentic automation platform around that interaction.'},
      {title:'The engineering', text:'The system combines multi-agent collaboration, intelligent orchestration, LLM integration, and real-time task execution. My work spans Python, React, DevOps, and Azure.'},
      {title:'The focus', text:'The engineering challenge is the connection between intent, tools, and execution. This project brings those capabilities together in a single product rather than treating a chat response as the final outcome.'}
    ]
  },
  {
    slug:'reelsbuilder', number:'04', name:'ReelsBuilder', category:'GENERATIVE VIDEO',
    headline:'A shorter path to the story.', description:'AI video creation, voiceovers, and publishing workflows for short-form content.',
    color:'rose', shape:1, year:'Jun 2025 - Jan 2026', role:'Senior AI Developer & Architect',
    stack:['AI video','NLP','Voice synthesis','Full-stack architecture'], evidence:'Clip and creator figures are reported in my resume, not live analytics.',
    metrics:[['100k+','clips'],['20k+','active creators'],['2 min','reported average']],
    sections:[
      {title:'The idea', text:'Help creators move from source content to short-form video. I architected an AI-powered video platform for TikTok, Instagram Reels, and YouTube Shorts.'},
      {title:'The engineering', text:'The platform combines video generation, viral moment detection, professional AI voiceover, NLP-based transcription, and automated formatting for multi-platform publishing.'},
      {title:'The result', text:'My resume reports more than 100,000 clips, 20,000 active creators, and an average creation time of two minutes. These describe the project at the time of the resume.'}
    ]
  },
  {
    slug:'lughaat', number:'05', name:'LughaatNLP', category:'OPEN SOURCE / URDU NLP',
    headline:'More language. More possibility.', description:'An open-source toolkit making Urdu language processing more accessible to developers.',
    color:'ice', shape:2, link:'https://github.com/MuhammadNoman76/LughaatNLP', year:'Dec 2023 - Jan 2024', role:'Library creator',
    stack:['Python','Urdu','NLP','Open source'], evidence:'Library scope is documented in my resume.',
    metrics:[['Urdu','language first'],['Python','developer toolkit'],['Open','source']],
    sections:[
      {title:'The idea', text:'Language technology should make room for Urdu. I built LughaatNLP as a specialized open-source library for common Urdu NLP tasks.'},
      {title:'The toolkit', text:'The library covers tokenization, lemmatization, part-of-speech tagging, named-entity recognition, and spell checking.'},
      {title:'Explore the work', text:'The public repository is the place to inspect the implementation and contribution history. The portfolio links directly to the source rather than presenting an invented product demo.'}
    ]
  }
];
export const experience = [
  {company:'Bayseian', role:'Lead AI Engineer', dates:'Dec 2025 - Present', detail:'Leading 8-12 engineers. Custom AI agents, enterprise applications, and production architectures.'},
  {company:'ReelsBuilder', role:'Senior AI Developer & Architect', dates:'Jun 2025 - Jan 2026', detail:'Full-stack architecture for AI video creation, voiceover, and publishing.'},
  {company:'Convsync.co', role:'Senior AI Developer & DevOps Engineer', dates:'May 2024 - Present', detail:'Web products, fine-tuned models, APIs, and LLMOps.'},
  {company:'MedicalNao', role:'Mid-Level AI Developer', dates:'May 2023 - Mar 2024', detail:'Healthcare AI prototypes with NLP, computer vision, FastAPI, and Django.'}
];
