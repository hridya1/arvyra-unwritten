import type { Metadata } from 'next';
import { DemoConfirmation } from '@/components/demo-checkout';
export const metadata: Metadata = { title: 'Demo complete', robots: { index: false } };
export default function ConfirmationPage() { return <main id="main" className="section page-shell"><p className="eyebrow">YOUR POINT OF VIEW</p><h1>Demo complete.</h1><DemoConfirmation /></main>; }
