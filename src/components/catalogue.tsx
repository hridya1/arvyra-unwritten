'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, colours, imageFor, money, type Product, type ColourId } from '@/lib/catalogue';
function Card({ product }: { product: Product }) {
  const [colour, setColour] = useState<ColourId>(product.colours[0]);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) return; product.colours.forEach(c => { const image = new window.Image(); image.src = imageFor(product, c); images.push(image); }); observer.disconnect(); }, { rootMargin: '500px' });
    if (ref.current) observer.observe(ref.current); return () => { observer.disconnect(); images.length = 0; };
  }, [product]);
  const href = `/products/${product.id}?colour=${colour}`;
  return <article ref={ref} className="store-card" data-id={product.id}><Link href={href} className="product-picture"><Image src={imageFor(product, colour)} width={600} height={750} sizes="(max-width:620px) 44vw, (max-width:1000px) 45vw, 30vw" unoptimized alt={`${product.name} in ${colours[colour].name}`} /><span className="product-badge">{product.collection}</span></Link><Link className="card-title" href={href}>{product.name}</Link><div className="card-subline"><span>{product.type} / {product.colours.length} colours</span><span className="card-price">{money(product.price)}</span></div><div className="card-bottom"><div className="card-swatches" role="group" aria-label={`${product.name} colours`}>{product.colours.map(c => <button key={c} className="swatch" type="button" data-colour={c} style={{ '--swatch': colours[c].hex } as React.CSSProperties} aria-label={`${product.name} in ${colours[c].name}`} aria-pressed={colour === c} onClick={() => setColour(c)} />)}</div><Link className="card-shop" href={href}>View / 3D</Link></div></article>;
}
export function Catalogue() {
  const [filter, setFilter] = useState('All'), [collection, setCollection] = useState('All'), [sort, setSort] = useState('featured'), [search, setSearch] = useState('');
  const names = [...new Set(products.map(p => p.collection))];
  const list = products.filter(p => (filter === 'All' || p.type === filter) && (collection === 'All' || p.collection === collection) && `${p.name} ${p.collection} ${p.type}`.toLowerCase().includes(search.toLowerCase()));
  if (sort !== 'featured') list.sort((a, b) => sort === 'low' ? a.price - b.price : b.price - a.price);
  return <section id="collection" className="section collection" aria-labelledby="collection-title"><div className="section-heading"><div><p className="eyebrow">YOUR EVERYDAY, REWRITTEN</p><h2 id="collection-title">THE COLLECTIONS.</h2></div><p>{names.join(' · ')}.<br />Make them your own.</p></div><div className="catalogue-toolbar"><div className="filters" role="group" aria-label="Filter by garment">{['All', 'Tees', 'Hoodies', 'Cargos'].map(type => <button key={type} data-filter={type} type="button" aria-pressed={filter === type} onClick={() => setFilter(type)}>{type === 'All' ? 'All pieces' : type}</button>)}</div><label className="sort-label">Collection <select id="collection-filter" value={collection} onChange={e => setCollection(e.target.value)}><option value="All">All collections</option>{names.map(name => <option key={name}>{name}</option>)}</select></label><label className="sort-label">Sort <select id="sort" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label><input className="search-field" type="search" aria-label="Search products" placeholder="Find your next layer" value={search} onChange={e => setSearch(e.target.value)} /></div><p id="result-count" className="result-count" aria-live="polite">{list.length} styles · {new Set(list.flatMap(p => p.colours)).size} colour options</p><div id="catalogue" className="product-grid">{list.map(product => <Card key={product.id} product={product} />)}</div>{!list.length && <p>No pieces match. Try a different search or filter.</p>}</section>;
}
