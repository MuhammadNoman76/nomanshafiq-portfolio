import type {MetadataRoute} from 'next';
export const dynamic='force-static';
export default function manifest():MetadataRoute.Manifest{return {name:'Muhammad Noman - AI Engineer',short_name:'Noman',description:'Curiosity, made real. AI engineering and product development.',start_url:'/',display:'browser',background_color:'#e9edf0',theme_color:'#e9edf0',icons:[{src:'/favicon.svg',sizes:'any',type:'image/svg+xml'},{src:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]};}
