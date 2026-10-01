import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import {siteUrl,profile} from '@/data/portfolio';
import './globals.css';
import './blog.css';
export const metadata:Metadata={
 metadataBase:new URL(siteUrl),
 title:{default:'Muhammad Noman - AI Engineer & Product Builder',template:'%s | Muhammad Noman'},
 description:'Muhammad Noman is an AI engineer and full-stack developer in Karachi building agentic AI systems, voice technology, and production-ready digital products.',
 alternates:{canonical:'/'},
 openGraph:{type:'website',locale:'en_US',siteName:'Muhammad Noman',url:'/',title:'Muhammad Noman - Curiosity, made real.',description:'AI engineering, agentic systems, and products built for people.',images:[{url:'/og.png',width:1200,height:630,alt:'Muhammad Noman - AI engineer and product builder'}]},
 twitter:{card:'summary_large_image',title:'Muhammad Noman - Curiosity, made real.',description:'AI engineering, agentic systems, and products built for people.',images:['/og.png']},
 robots:{index:true,follow:true},authors:[{name:profile.name,url:siteUrl}],
 icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml'},{url:'/favicon-32.png',sizes:'32x32',type:'image/png'}],apple:'/apple-touch-icon.png'},
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#e9edf0'};
export default function RootLayout({children}:{children:ReactNode}) {
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'Person','@id':`${siteUrl}/#person`,name:profile.name,url:siteUrl,jobTitle:profile.role,sameAs:[profile.github,profile.linkedin],knowsAbout:['Artificial intelligence','AI agents','Large language models','Full-stack development','Voice technology'],address:{'@type':'PostalAddress',addressLocality:'Karachi',addressCountry:'PK'}},
  {'@type':'WebSite','@id':`${siteUrl}/#website`,url:siteUrl,name:profile.name,publisher:{'@id':`${siteUrl}/#person`},inLanguage:'en'}
 ]};
 return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Script src="/engine/experience.mjs" type="module" strategy="afterInteractive"/></body></html>;
}
