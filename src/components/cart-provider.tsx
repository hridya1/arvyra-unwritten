'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { lineKey, validateCart, type CartLine } from '@/lib/cart';
const storageKey = 'arvyra-draft-bag-v3';
type CartContextValue = { lines: CartLine[]; ready: boolean; add: (line: CartLine) => void; update: (key: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) ?? sessionStorage.getItem('arvyra-draft-bag-v2') ?? '[]');
      if (Array.isArray(stored) && stored.length) setLines(validateCart(stored));
    } catch { /* Invalid or outdated drafts are discarded. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { sessionStorage.setItem(storageKey, JSON.stringify(lines)); } catch { /* Storage can be disabled. */ } } }, [lines, ready]);
  function add(line: CartLine) { setLines(validateCart([...lines, line])); }
  function update(key: string, quantity: number) {
    setLines(current => current.flatMap(line => lineKey(line) !== key ? [line] : quantity <= 0 ? [] : [{ ...line, quantity: Math.min(10, quantity) }]));
  }
  return <CartContext.Provider value={{ lines, ready, add, update, clear: () => setLines([]) }}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('Cart provider is missing'); return context; }
