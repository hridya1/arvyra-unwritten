import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteCart, validateCart } from '../src/lib/cart';
const line = { id: 'frame-hoodie', colour: 'burgundy', size: 'M', quantity: 2 };
test('server calculates authoritative sample prices', () => { const quote = quoteCart([line]); assert.equal(quote.subtotal, 6980); assert.equal(quote.demo, true); });
test('rejects client-supplied prices', () => { assert.throws(() => quoteCart([{ ...line, price: 1 }])); });
test('rejects unknown products, unavailable variants and invalid quantities', () => {
  for (const update of [{ id: 'invented' }, { colour: 'olive' }, { size: '99' }, { quantity: 0 }, { quantity: 11 }, { quantity: 1.5 }]) assert.throws(() => validateCart([{ ...line, ...update }]));
});
test('merges duplicate variants and enforces combined limit', () => { assert.equal(validateCart([line, line])[0].quantity, 4); assert.throws(() => validateCart([{ ...line, quantity: 6 }, { ...line, quantity: 5 }])); });
test('rejects empty carts and oversized line arrays', () => { assert.throws(() => quoteCart([])); assert.throws(() => quoteCart(Array.from({ length: 81 }, () => line))); });
