import {imageFor} from './catalogue.js';
// Hold decoded variant images in memory so a colour click does not start a cold download.
const cache=new Map();
export function warmImage(src){
 if(cache.has(src))return cache.get(src);
 const image=new Image();image.decoding='async';image.fetchPriority='low';
 const entry={image,ready:false,promise:null};
 entry.promise=new Promise(resolve=>{image.onload=async()=>{try{await image.decode();}catch{}entry.ready=true;resolve(entry);};image.onerror=()=>{cache.delete(src);resolve(null);};});
 cache.set(src,entry);image.src=src;return entry;
}
export function preloadVariants(product){product.colours.forEach(c=>warmImage(imageFor(product,c)));}
const latest=new WeakMap();
export function showProductImage(image,product,colour,alt){
 const src=imageFor(product,colour),entry=warmImage(src),ticket=Symbol();latest.set(image,ticket);
 const show=()=>{if(latest.get(image)!==ticket)return;image.src=src;image.alt=alt;image.removeAttribute('aria-busy');};
 if(entry.ready){show();return;}
 image.setAttribute('aria-busy','true');
 entry.promise.then(result=>{if(result)show();else if(latest.get(image)===ticket){image.src=src;image.alt=alt;image.removeAttribute('aria-busy');}});
}
