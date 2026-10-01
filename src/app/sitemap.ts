import type { MetadataRoute } from 'next';
import {siteUrl,projects} from '@/data/portfolio';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return [{url:`${siteUrl}/`,changeFrequency:'monthly',priority:1},{url:`${siteUrl}/work/`,changeFrequency:'monthly',priority:.8},...projects.map(p=>({url:`${siteUrl}/work/${p.slug}/`,changeFrequency:'monthly' as const,priority:.7}))];}
