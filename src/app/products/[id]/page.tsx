import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, imageFor, type ColourId } from '@/lib/catalogue';
import { ProductOptions } from '@/components/product-options';
export function generateStaticParams() { return products.map(product => ({ id: product.id })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params, product = products.find(p => p.id === id);
  if (!product) return { title: 'Product not found' };
  return { title: product.name, description: product.description, openGraph: { images: [imageFor(product, product.colours[0])] }, alternates: { canonical: `/products/${id}` } };
}
export default async function ProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ colour?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]); const product = products.find(p => p.id === id); if (!product) notFound();
  const colour = product.colours.includes(query.colour as ColourId) ? query.colour as ColourId : product.colours[0];
  return <main id="main" className="section page-shell"><Link className="back-link" href="/#collection">← All pieces</Link><ProductOptions key={product.id} product={product} initialColour={colour} /></main>;
}
