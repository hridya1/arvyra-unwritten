import type { Metadata } from 'next';
import { Bag } from '@/components/bag';
export const metadata: Metadata = { title: 'Your bag', robots: { index: false } };
export default function BagPage() { return <main id="main" className="section page-shell bag-page"><p className="eyebrow">YOUR OWN COMBINATION</p><h1>Your bag.</h1><p className="demo-note">Personal demo. Your bag stays in this browser tab. Nothing has been ordered.</p><Bag /></main>; }
