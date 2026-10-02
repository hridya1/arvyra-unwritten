import type { MetadataRoute } from 'next';
import { products } from '@/lib/catalogue';
export default function sitemap(): MetadataRoute.Sitemap { const base = 'https://arvyra-unwritten.vercel.app'; return [{ url: base }, ...products.map(p => ({ url: `${base}/products/${p.id}` }))]; }
