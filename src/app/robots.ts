import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/', disallow: ['/bag', '/checkout', '/confirmation', '/api/'] }, sitemap: 'https://arvyra-unwritten.vercel.app/sitemap.xml' }; }
