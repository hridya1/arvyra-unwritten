'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './cart-provider';
import { money, colours } from '@/lib/catalogue';
import { lineKey, type quoteCart } from '@/lib/cart';
type Quote = ReturnType<typeof quoteCart>;
export function DemoCheckout() {
  const { lines, ready, clear } = useCart();
  const [quote, setQuote] = useState<Quote | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!ready || !lines.length) return;
    const controller = new AbortController(); setQuote(null); setError('');
    fetch('/api/demo-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'quote', lines }), signal: controller.signal }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setQuote(data); }).catch(e => { if (e.name !== 'AbortError') setError(e.message || 'Could not verify your bag.'); });
    return () => controller.abort();
  }, [ready, lines]);
  async function confirm() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/demo-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'confirm', lines }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      sessionStorage.setItem('arvyra-demo-receipt', JSON.stringify(data));
      clear(); router.push('/confirmation');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not finish the demo.'); setBusy(false); }
  }
  if (!ready) return <p role="status">Loading your bag…</p>;
  if (!lines.length) return <><p>Your bag is empty.</p><Link className="button" href="/#collection">Find your next layer</Link></>;
  return <div className="checkout-layout"><div><h2>A trial run.</h2><p className="demo-note">This is a shopping simulation. No card, address or personal details are needed. No real order will be created.</p><p>The server checks your product choices and calculates the sample prices independently of the browser.</p><Link className="back-link" href="/bag">← Edit your bag</Link><p className="error-text" role="alert">{error}</p>{!quote && !error && <p role="status">Checking your bag…</p>}</div><aside className="checkout-summary"><h2>Order review.</h2>{quote && <>{quote.lines.map(line => <div className="order-line" key={lineKey(line)}><strong>{line.name}</strong><p>{colours[line.colour].name} / {line.size} × {line.quantity}</p><p>{money(line.total)}</p></div>)}<div className="total-line"><span>Sample subtotal</span><strong>{money(quote.subtotal)}</strong></div><p>Amount charged: <strong>₹0</strong></p><p className="sample-price">Delivery and tax calculations are not part of this simulation.</p><button className="button" id="confirm-demo" type="button" disabled={busy} onClick={confirm}>{busy ? 'Completing simulation…' : 'Complete demo order'}</button></>}</aside></div>;
}
export function DemoConfirmation() {
  const [receipt, setReceipt] = useState<(Quote & { reference: string }) | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { const saved = JSON.parse(sessionStorage.getItem('arvyra-demo-receipt') ?? 'null'); if (saved?.demo === true && typeof saved.reference === 'string' && Number.isFinite(saved.subtotal)) setReceipt(saved); } catch { /* No valid demo receipt. */ }
    setLoaded(true);
  }, []);
  if (!loaded) return <p role="status">Loading demo confirmation…</p>;
  if (!receipt) return <><p>No demo confirmation is saved in this tab.</p><Link className="button" href="/#collection">Explore the collection</Link></>;
  return <><p className="demo-note">Simulation complete. No payment was collected, no stock was reserved, and no real order was created.</p><p>Demo reference: <strong>{receipt.reference}</strong></p><p>Sample subtotal: {money(receipt.subtotal)} · Amount charged: ₹0</p><p>This receipt is stored only in this browser tab. It is not an order record.</p><Link className="button" href="/#collection">Keep exploring</Link></>;
}
