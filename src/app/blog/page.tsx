import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { jevArticle } from '@/data/jev-urdu';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'Field Notes — AI Engineering & Urdu NLP',
  description: 'Models, experiments, and the engineering behind them. Original field notes on applied AI and Urdu NLP by Muhammad Noman.',
  alternates: { canonical: '/blog/' },
  openGraph: { title: 'Field notes — Muhammad Noman', description: 'Original work. Measured results. Notes from building AI.', url: '/blog/', type: 'website', images: [{ url: '/art/jev-urdu-social.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'Field notes — Muhammad Noman', description: 'Original work. Measured results. Notes from building AI.', images: ['/art/jev-urdu-social.jpg'] },
};

export default function Blog() {
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Field notes', url: `${siteUrl}/blog/`, author: { '@id': `${siteUrl}/#person` }, hasPart: [{ '@type': 'BlogPosting', headline: jevArticle.title, url: `${siteUrl}${jevArticle.path}`, datePublished: jevArticle.date }] };
  return <div id="top"><Header/><main id="main" className="blog-archive shell"><div className="section-eyebrow"><span>FIELD NOTES / APPLIED AI</span><span>FROM THE BUILDER&apos;S DESK.</span></div><div className="blog-archive-intro"><h1>Built with curiosity.<br/><em>Shared with context.</em></h1><p>Models, experiments, and the decisions behind them. A closer look at what I&apos;m building — and what the results actually say.</p></div><article className="blog-feature"><a href={jevArticle.path} className="blog-feature-art" aria-label="Read the Jev-Urdu launch and benchmark article"><img src="/art/jev-urdu-cover.webp" width="1672" height="941" alt="Connected silver ribbons carrying blue and orange spheres" fetchPriority="high"/><span>Jev-Urdu<span lang="ur" dir="rtl">اردو</span></span></a><div className="blog-feature-copy"><p className="eyebrow">MODEL ENGINEERING / 1 OCTOBER 2026</p><h2><a href={jevArticle.path}>Urdu-first AI,<br/><em>measured in decisions.</em></a></h2><p>My Urdu-first decision model on a multilingual foundation. Real benchmarks, interactive comparisons, and the tradeoffs worth understanding.</p><div className="blog-feature-metric"><strong>+12.9<span>pp</span></strong><p>Urdu-prompt XNLI accuracy<br/>vs Laya multilingual</p></div><a className="round-link" href={jevArticle.path}><span className="round-arrow"><Arrow/></span>Read the field note <span className="blog-read-time">10 MIN</span></a></div></article><p className="blog-archive-note">One experiment at a time. More notes as the work moves forward.</p><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\u003c') }}/></main><Footer/></div>;
}
