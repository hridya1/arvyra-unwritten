import { NextResponse } from 'next/server';
import { quoteCart } from '@/lib/cart';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'This request must come from the store.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Send a JSON cart.' }, { status: 415 });
  try {
    const text = await request.text();
    if (text.length > 24000) return NextResponse.json({ error: 'The bag is too large.' }, { status: 413 });
    const input = JSON.parse(text);
    const quote = quoteCart(input.lines);
    const action = input.action;
    if (action !== 'quote' && action !== 'confirm') return NextResponse.json({ error: 'Unknown checkout action.' }, { status: 400 });
    return NextResponse.json(action === 'quote' ? quote : { ...quote, reference: `DEMO-${crypto.randomUUID()}`, message: 'Simulation complete. No payment was collected and no real order was created.' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Invalid bag. Check products, colours, sizes and quantities before trying again.' }, { status: 400 }); }
}
