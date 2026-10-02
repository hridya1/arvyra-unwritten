'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { colours, imageFor, money, type ColourId, type Product } from '@/lib/catalogue';
import type { createGarmentViewer } from '@/lib/garment-engine';
type Engine = ReturnType<typeof createGarmentViewer>;
export function GarmentViewer({ product, colour, onColour, hero = false }: { product: Product; colour: ColourId; onColour?: (colour: ColourId) => void; hero?: boolean }) {
  const host = useRef<HTMLDivElement>(null), engine = useRef<Engine | null>(null);
  const latestColour = useRef(colour);
  const [selected, setSelected] = useState(colour), [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [paused, setPaused] = useState(true);
  useEffect(() => {
    let cancelled = false, instance: Engine | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isPaused = reduced.matches;
    setReady(false); setFailed(false); setPaused(isPaused);
    const pauseChanged = () => { isPaused = reduced.matches; instance?.pause(isPaused); setPaused(isPaused); };
    reduced.addEventListener('change', pauseChanged);
    import('@/lib/garment-engine').then(({ createGarmentViewer }) => {
      if (cancelled || !host.current) return;
      instance = createGarmentViewer(host.current, product, latestColour.current, () => { if (!cancelled) setReady(true); }, () => { if (!cancelled) { setFailed(true); setReady(false); } });
      engine.current = instance; instance.pause(isPaused);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; reduced.removeEventListener('change', pauseChanged); instance?.dispose(); engine.current = null; };
    // Rebuild only when the model changes; colour changes update its material below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  useEffect(() => { latestColour.current = colour; setSelected(colour); engine.current?.colour(colour); }, [colour]);
  function changeColour(value: ColourId) { latestColour.current = value; setSelected(value); engine.current?.colour(value); onColour?.(value); }
  function action(value: string) { engine.current?.pause(true); setPaused(true); engine.current?.action(value); }
  return <div className="garment-preview"><div ref={host} id={hero ? 'garment-viewer' : undefined} className="garment-viewer" data-product={product.id} data-colour={selected} data-ready={ready && !failed ? 'true' : 'false'} aria-label={`${product.name} 3D preview`}>
    {(!ready || failed) && <Image id={hero ? 'viewer-fallback' : undefined} src={imageFor(product, selected)} alt={`${product.name} in ${colours[selected].name}`} fill sizes="(max-width: 700px) 90vw, 50vw" style={{ objectFit: 'contain' }} priority={hero} />}
    {(!ready || failed) && <p id={hero ? 'viewer-status' : undefined} role="status" className="model-note">{failed ? '3D unavailable. Product image shown instead.' : 'Loading the 3D garment…'}</p>}
  </div><div className="viewer-toolbar"><div className="viewer-colours" role="group" aria-label="3D garment colour">{product.colours.map(c => <button key={c} type="button" className="swatch" data-viewer-colour={c} style={{ '--swatch': colours[c].hex } as React.CSSProperties} aria-label={`${colours[c].name} 3D garment`} aria-pressed={selected === c} onClick={() => changeColour(c)} />)}</div><span id={hero ? 'viewer-colour-label' : undefined}>{colours[selected].name}</span><button id={hero ? 'motion-toggle' : undefined} type="button" disabled={failed} aria-pressed={paused} onClick={() => { engine.current?.pause(!paused); setPaused(!paused); }}>{paused ? 'Play rotation' : 'Pause rotation'}</button></div>
    <div className="viewer-actions" role="group" aria-label="3D view controls">{[['front', 'Front'], ['back', 'Back'], ['left', 'Turn left'], ['right', 'Turn right'], ['zoom-in', 'Zoom +'], ['zoom-out', 'Zoom −']].map(([value, label]) => <button key={value} data-view={value} type="button" disabled={!ready || failed} onClick={() => action(value)}>{label}</button>)}</div>
    <p className="viewer-hint">Drag to rotate · Pinch to zoom · Illustrative 3D concept</p>
    {hero && <Link className="viewer-shop" href={`/products/${product.id}?colour=${selected}`}>{product.name} · {money(product.price)}</Link>}
    {product.type !== 'Cargos' && !['break-the-frame-tee', 'frame-hoodie'].includes(product.id) && <p className="viewer-hint">Print placement study. Refer to product photos for the original artwork.</p>}
  </div>;
}
