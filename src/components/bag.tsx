'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-provider';
import { lineKey } from '@/lib/cart';
import { products, colours, imageFor, money } from '@/lib/catalogue';
export function Bag() {
  const { lines, ready, update } = useCart();
  if (!ready) return <p role="status">Loading your bag…</p>;
  if (!lines.length) return <><p className="empty-bag">Your bag is waiting for your point of view.</p><Link className="button" href="/#collection">Explore the collection</Link></>;
  const subtotal = lines.reduce((sum, line) => sum + products.find(p => p.id === line.id)!.price * line.quantity, 0);
  return <div className="checkout-layout"><div id="bag-lines">{lines.map(line => {
    const product = products.find(p => p.id === line.id)!, key = lineKey(line);
    return <article className="bag-line" key={key}><Link href={`/products/${line.id}?colour=${line.colour}`}><Image src={imageFor(product, line.colour)} alt={`${product.name}, ${colours[line.colour].name}`} width={86} height={110} /></Link><div><h3><Link href={`/products/${line.id}`}>{product.name}</Link></h3><p>{colours[line.colour].name} / Size {line.size}</p><p>{money(product.price * line.quantity)}</p><div className="line-controls"><button type="button" data-action="minus" aria-label={`Decrease quantity of ${product.name}`} disabled={line.quantity === 1} onClick={() => update(key, line.quantity - 1)}>−</button><span aria-label="Quantity">{line.quantity}</span><button type="button" data-action="plus" aria-label={`Increase quantity of ${product.name}`} disabled={line.quantity === 10} onClick={() => update(key, line.quantity + 1)}>+</button><button type="button" className="remove-line" data-action="remove" aria-label={`Remove ${product.name}, ${line.size}`} onClick={() => update(key, 0)}>Remove</button></div></div></article>;
  })}</div><aside className="checkout-summary"><h2>Your combination.</h2><div className="total-line"><span>Sample subtotal</span><strong id="bag-subtotal">{money(subtotal)}</strong></div><p className="sample-price">Demo prices. Delivery and taxes are not calculated.</p><Link id="checkout" className="button" href="/checkout">Try demo checkout</Link><p className="sample-price">No payment is collected. No real order will be placed.</p></aside></div>;
}
