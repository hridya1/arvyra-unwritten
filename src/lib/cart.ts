import { z } from 'zod';
import { products, type ColourId } from './catalogue';

export const cartSchema = z.array(z.object({
  id: z.string().min(1).max(80), colour: z.string().max(30), size: z.string().max(12),
  quantity: z.number().int().min(1).max(10),
}).strict()).min(1).max(80);
export type CartLine = { id: string; colour: ColourId; size: string; quantity: number };
export const lineKey = (line: Pick<CartLine, 'id' | 'colour' | 'size'>) => `${line.id}|${line.colour}|${line.size}`;

export function validateCart(input: unknown): CartLine[] {
  const parsed = cartSchema.parse(input);
  const merged = new Map<string, CartLine>();
  for (const line of parsed) {
    const product = products.find(p => p.id === line.id);
    if (!product || !product.colours.includes(line.colour as ColourId) || !product.sizes.includes(line.size)) {
      throw new Error('A product, colour or size is no longer available. Please update your bag.');
    }
    const valid = { ...line, colour: line.colour as ColourId };
    const key = lineKey(valid);
    const quantity = (merged.get(key)?.quantity ?? 0) + valid.quantity;
    if (quantity > 10) throw new Error('The maximum quantity per variant is 10.');
    merged.set(key, { ...valid, quantity });
  }
  return [...merged.values()];
}

export function quoteCart(input: unknown) {
  const lines = validateCart(input).map(line => {
    const product = products.find(p => p.id === line.id)!;
    return { ...line, name: product.name, unitPrice: product.price, total: product.price * line.quantity };
  });
  return { lines, subtotal: lines.reduce((sum, line) => sum + line.total, 0), currency: 'INR' as const, demo: true as const };
}
