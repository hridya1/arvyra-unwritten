'use client';
import Link from 'next/link';
import { useCart } from './cart-provider';
export function Header() {
  const { lines } = useCart();
  return <><a className="skip" href="#main">Skip to content</a><div className="preview-banner">PERSONAL DESIGN DEMO · Concept garments · No real orders or payments</div><header><Link className="wordmark" href="/">ARVYRA</Link><nav aria-label="Main navigation"><Link href="/#collection">Shop</Link><Link href="/#story">Our story</Link></nav><Link className="bag-button" id="open-bag" href="/bag">Bag <span id="bag-count">{lines.reduce((sum, line) => sum + line.quantity, 0)}</span></Link></header></>;
}
