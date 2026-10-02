'use client';
export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main" className="section"><h1>Something went wrong.</h1><p>Your bag stays in this browser tab. Try loading the page again.</p><button className="button" onClick={reset}>Try again</button></main>; }
