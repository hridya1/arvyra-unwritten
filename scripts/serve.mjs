import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.glb':'model/gltf-binary','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const port=Number(process.env.PORT||4174);
http.createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(path==='/'?'/index.html':path));if(relative(root,file).startsWith('..')){res.writeHead(403);res.end();return;}if(!(await stat(file)).isFile())throw Error('Not a file');res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+port));
