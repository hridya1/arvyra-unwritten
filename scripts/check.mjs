import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {products,colours,featuredGarment,imageFor} from '../dist/catalogue.js';
const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const problems=[];const ids=new Set();
const issue=message=>problems.push(message);
function asset(path,label){const file=resolve(root,path);if(relative(root,file).startsWith('..')){issue(label+': asset must stay inside dist');return;}if(!existsSync(file))issue(label+': missing '+path);}
for(const p of products){
 const label=p.name||p.id||'Unnamed product';
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id))issue(label+': use a lowercase product id with hyphens');
 if(ids.has(p.id))issue(label+': duplicate product id '+p.id);ids.add(p.id);
 if(!p.name||!p.collection||!p.description)issue(label+': name, collection and description are required');
 if(!['Tees','Hoodies','Cargos'].includes(p.type))issue(label+': type must be Tees, Hoodies or Cargos');
 if(!Number.isFinite(p.price)||p.price<=0)issue(label+': price must be a positive number in rupees');
 if(!Array.isArray(p.sizes)||!p.sizes.length||p.sizes.some(s=>typeof s!=='string'||!s.trim())||new Set(p.sizes).size!==p.sizes.length)issue(label+': add distinct sizes as strings');
 if(!Array.isArray(p.colours)||!p.colours.length||new Set(p.colours).size!==p.colours.length){issue(label+': add distinct available colours');continue;}
 for(const c of p.colours){if(!colours[c])issue(label+': unknown colour '+c);else asset(imageFor(p,c),label+' / '+c);}
}
for(const [id,c]of Object.entries(colours)){if(!c.name||!/^#[a-fA-F0-9]{6}$/.test(c.hex))issue(id+': give the colour a name and six-digit hex value');}
if(!ids.has(featuredGarment.productId))issue('Homepage: featured product id does not exist');
asset(featuredGarment.model,'Homepage model');asset(featuredGarment.artwork,'Homepage artwork');
for(const [key,value] of Object.entries(featuredGarment.shape)){if(!Number.isFinite(value)||value<=0)issue('Homepage shape '+key+': value must be positive');}
function checkJS(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory()){if(entry.name!=='vendor')checkJS(file);}else if(entry.name.endsWith('.js')){try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}catch(e){issue(relative(root,file)+': JavaScript syntax error\n'+(e.stderr?.toString()||e.message));}}}}
checkJS(root);
if(problems.length){console.error('Please fix these before deployment:\n'+problems.map(p=>' - '+p).join('\n'));process.exit(1);}
console.log('Ready: '+products.length+' products, '+new Set(products.map(p=>p.collection)).size+' collections. Product images, 3D assets and JavaScript checks passed.');
