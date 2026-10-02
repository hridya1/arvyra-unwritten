import type { Metadata } from 'next';
import Link from 'next/link';
import { CartProvider } from '@/components/cart-provider';
import { Header } from '@/components/header';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://arvyra-unwritten.vercel.app'),
  title: { default: 'ARVYRA — Wear your own point of view', template: '%s | ARVYRA' },
  description: 'A personal streetwear design demo with graphic tees, hoodies, cargos and an interactive 3D garment.',
  openGraph: { title: 'ARVYRA — UNWRITTEN', description: 'Art. Culture. Self-expression.', images: ['/assets/break-the-frame-tee-black.webp'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><CartProvider><Header />{children}<footer><div className="footer-top"><Link className="wordmark" href="/">ARVYRA</Link><p>Art. Culture. Self-expression.</p><Link href="/#main">Back to top</Link></div><div className="footer-bottom"><span>© 2026 ARVYRA — by Hridya</span><span>Personal design demo · Concept garments · Nothing for sale.</span></div></footer></CartProvider></body></html>;
}
