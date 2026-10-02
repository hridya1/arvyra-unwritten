import type { Metadata } from 'next';
import { DemoCheckout } from '@/components/demo-checkout';
export const metadata: Metadata = { title: 'Demo checkout', robots: { index: false } };
export default function CheckoutPage() { return <main id="main" className="section page-shell"><h1>Demo checkout.</h1><DemoCheckout /></main>; }
