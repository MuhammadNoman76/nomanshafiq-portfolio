import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Arrow } from '@/components/Icons';
import { jevArticle } from '@/data/jev-urdu';
import { pawsipArticle } from '@/data/pawsip';
import { siteUrl } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'Field Notes — AI Engineering, Urdu NLP & Software',
  description: 'Models, experiments, software, and the engineering behind them. Original field notes on applied AI, Urdu NLP and desktop apps by Muhammad Noman.',
  alternates: { canonical: '/blog/' },
  openGraph: { title: 'Field notes — Muhammad Noman', description: 'Original work. Measured results. Notes from building AI and software.', url: '/blog/', type: 'website', images: [{ url: '/art/pawsip-social.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'Field notes — Muhammad Noman', description: 'Original work. Measured results. Notes from building AI and software.', images: ['/art/pawsip-social.jpg'] },
};

export default function Blog() {
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Field notes', url: `${siteUrl}/blog/`, author: { '@id': `${siteUrl}/#person` }, hasPart: [{ '@type': 'BlogPosting', headline: pawsipArticle.title, url: `${siteUrl}${pawsipArticle.path}`, datePublished: pawsipArticle.date }, { '@type': 'BlogPosting', headline: jevArticle.title, url: `${siteUrl}${jevArticle.path}`, datePublished: jevArticle.date }] };
  return <div id="top"><Header/><main id="main" className="blog-archive shell"><div className="section-eyebrow"><span>FIELD NOTES / AI &amp; SOFTWARE</span><span>FROM THE BUILDER&apos;S DESK.</span></div><div className="blog-archive-intro"><h1>Built with curiosity.<br/><em>Shared with context.</em></h1><p>Models, experiments, software, and the decisions behind them. A closer look at what I&apos;m building — and what the results actually say.</p></div>
    <article className="blog-feature"><a href={pawsipArticle.path} className="blog-feature-art pawsip-art" aria-label="Read about PawSip, the desktop cat water reminder"><img src="/art/pawsip-cover.png" width="1671" height="940" alt="The PawSip cat waving on a soft pastel background" fetchPriority="high"/><span>PawSip<span>water, on time.</span></span></a><div className="blog-feature-copy"><p className="eyebrow">DESKTOP SOFTWARE / 12 OCTOBER 2026</p><h2><a href={pawsipArticle.path}>A desktop cat<br/><em>that keeps me hydrated.</em></a></h2><p>A free Windows water reminder with an animated cat companion. It follows when I&apos;m at the computer, waits during fullscreen work, and keeps asking until I drink.</p><div className="blog-feature-metric"><strong>4<span>builds</span></strong><p>Windows 7 SP1, 8.1, 10 &amp; 11<br/>x64 · ARM64 · 32-bit · free download</p></div><a className="round-link" href={pawsipArticle.path}><span className="round-arrow"><Arrow/></span>Meet the cat <span className="blog-read-time">7 MIN</span></a></div></article>
    <article className="blog-feature"><a href={jevArticle.path} className="blog-feature-art" aria-label="Read the Jev-Urdu launch and benchmark article"><img src="/art/jev-urdu-cover.webp" width="1672" height="941" alt="Connected silver ribbons carrying blue and orange spheres" loading="lazy"/><span>Jev-Urdu<span lang="ur" dir="rtl">اردو</span></span></a><div className="blog-feature-copy"><p className="eyebrow">MODEL ENGINEERING / 1 OCTOBER 2026</p><h2><a href={jevArticle.path}>Urdu-first AI,<br/><em>measured in decisions.</em></a></h2><p>My Urdu-first decision model with a multilingual mmBERT-base encoder. Real benchmarks, interactive comparisons, and the tradeoffs worth understanding.</p><div className="blog-feature-metric"><strong>+12.9<span>pp</span></strong><p>Urdu-prompt XNLI accuracy<br/>vs Laya multilingual</p></div><a className="round-link" href={jevArticle.path}><span className="round-arrow"><Arrow/></span>Read the field note <span className="blog-read-time">10 MIN</span></a></div></article>
    <p className="blog-archive-note">One experiment at a time. More notes as the work moves forward.</p><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/></main><Footer/></div>;
}
