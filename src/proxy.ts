import { NextResponse, type NextRequest } from 'next/server';
import { products } from '@/lib/catalogue';
const productIds = new Set(products.map(product => product.id));
export function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/')[2];
  if (!productIds.has(id)) {
    // Reject before React starts streaming so crawlers receive a real 404 status.
    return new NextResponse('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Product not found | ARVYRA</title></head><body style="background:#f3eee5;color:#242520;font:18px/1.6 Arial;padding:8vw"><a href="/" style="color:inherit;font:36px Georgia">ARVYRA</a><main><h1>Off the grid.</h1><p>This product could not be found.</p><a href="/#collection" style="color:inherit">Back to the collection</a></main></body></html>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  return NextResponse.next();
}
export const config = { matcher: '/products/:id' };
