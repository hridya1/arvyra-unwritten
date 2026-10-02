import {products,colours,money,imageFor,featuredGarment} from './catalogue.js';
import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DecalGeometry} from './vendor/DecalGeometry.js';
const host=document.querySelector('#garment-viewer'),stage=document.querySelector('.hero-stage'),status=document.querySelector('#viewer-status'),fallback=document.querySelector('#viewer-fallback');
let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{status.textContent='3D is unavailable on this device. Product image shown instead.';stage.classList.add('model-unavailable');throw new Error('WebGL unavailable');}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x20211e,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=featuredGarment.lighting.exposure;host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Ghost mannequin T-shirt: shaped as worn, with no visible body. Drag to rotate, pinch to zoom, or use the controls below.');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,.15,4.1);const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=3.1;controls.maxDistance=6.4;controls.minPolarAngle=.45;controls.maxPolarAngle=2.65;controls.target.set(0,-.06,0);controls.autoRotateSpeed=featuredGarment.rotationSpeed;
scene.add(new THREE.HemisphereLight(0xf9f1df,0x4b535c,1.4));for(const [color,intensity,x,y,z]of [[0xffffff,2.5,3,4,5],[0xe1d3b4,.8,-4,1,3],[0xffffff,2.8,-2,3,-4]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);scene.add(light);}
const shirt=new THREE.Group();scene.add(shirt);shirt.rotation.y=Math.PI+.3;
let cloth=null,ready=false,needsRender=true;
controls.addEventListener('change',()=>{needsRender=true;});
const logoMat=new THREE.MeshStandardMaterial({transparent:true,alphaTest:.1,roughness:1,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4});
function unavailable(message){fallback.hidden=false;status.hidden=false;status.textContent=message;stage.classList.add('model-unavailable');renderer.domElement.hidden=true;document.querySelectorAll('[data-view],#motion-toggle').forEach(b=>b.disabled=true);}
// Authored garment with rounded shoulders and sewn, draped sleeves.
// Copyright and source are retained in assets/MODEL-CREDITS.md.
new GLTFLoader().load(featuredGarment.model,gltf=>{
 const original=gltf.scene.getObjectByName('T_Shirt_male');
 if(!original?.isMesh){unavailable('3D could not load. Product image shown instead.');return;}
 const geometry=original.geometry.clone();geometry.computeBoundingBox();
 const box=geometry.boundingBox,center=box.getCenter(new THREE.Vector3()),scale=1.9/(box.max.y-box.min.y);
 geometry.translate(-center.x,-center.y,-center.z);
 geometry.scale(scale*featuredGarment.shape.width,scale*featuredGarment.shape.height,scale*featuredGarment.shape.depth);
 geometry.translate(0,-.1,0);geometry.computeBoundingBox();
 cloth=original.material.clone();cloth.color.set(colours[host.dataset.colour].hex);
 cloth.roughness=.94;cloth.metalness=0;cloth.side=THREE.DoubleSide;cloth.normalScale.set(.45,.45);cloth.aoMapIntensity=.85;
 shirt.add(new THREE.Mesh(geometry,cloth));
 // Project artwork directly onto the folds rather than floating a flat image above them.
 const projection=new THREE.Mesh(geometry,cloth);projection.updateMatrixWorld(true);
 function decal(material,position,orientation,size){const g=new DecalGeometry(projection,position,orientation,size);shirt.add(new THREE.Mesh(g,material));}
 const logoCanvas=document.createElement('canvas');logoCanvas.width=1024;logoCanvas.height=256;
 const lc=logoCanvas.getContext('2d');lc.fillStyle='#e6dfcc';lc.font='100px Georgia';lc.textAlign='center';lc.fillText(featuredGarment.chestMark,512,145);
 logoMat.map=new THREE.CanvasTexture(logoCanvas);logoMat.map.colorSpace=THREE.SRGBColorSpace;logoMat.needsUpdate=true;
 const front=geometry.boundingBox.max.z,back=geometry.boundingBox.min.z;
 decal(logoMat,new THREE.Vector3(-.25,.36,front),new THREE.Euler(),new THREE.Vector3(.33,.083,.38));
 new THREE.TextureLoader().load(featuredGarment.artwork,texture=>{
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const material=new THREE.MeshStandardMaterial({map:texture,transparent:true,alphaTest:.82,roughness:1,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4});
  decal(material,new THREE.Vector3(0,-.15,back),new THREE.Euler(0,Math.PI,0),new THREE.Vector3(.90,1.29,.38));
  host.dataset.printReady='true';needsRender=true;
 },undefined,()=>{host.dataset.printReady='failed';});
 controls.update();renderer.render(scene,camera);fallback.hidden=true;status.hidden=true;ready=true;host.dataset.ready='true';host.dataset.model='ghost-mannequin';
},undefined,()=>unavailable('3D could not load. Product image shown instead.'));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=true,last=performance.now();const motion=document.querySelector('#motion-toggle');function setPause(value){paused=value;controls.autoRotate=!paused;motion.textContent=paused?'Play rotation':'Pause rotation';motion.setAttribute('aria-pressed',String(paused));}setPause(paused);reduced.addEventListener('change',e=>setPause(e.matches));motion.addEventListener('click',()=>setPause(!paused));controls.addEventListener('start',()=>setPause(true));
function view(action){setPause(true);const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(action==='front'||action==='back'){shirt.rotation.y=action==='front'?0:Math.PI;spherical.theta=0;spherical.phi=Math.PI/2-.03;}if(action==='left')spherical.theta-=Math.PI/4;if(action==='right')spherical.theta+=Math.PI/4;if(action==='zoom-in')spherical.radius=Math.max(controls.minDistance,spherical.radius-.5);if(action==='zoom-out')spherical.radius=Math.min(controls.maxDistance,spherical.radius+.5);camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target));controls.update();host.dataset.view=action;}document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));renderer.domElement.addEventListener('keydown',e=>{const action={ArrowLeft:'left',ArrowRight:'right','+':'zoom-in','-':'zoom-out'}[e.key];if(action){e.preventDefault();view(action);}});
const featured=products.find(p=>p.id===featuredGarment.productId)||products[0];
const colourGroup=document.querySelector('.viewer-colours');
colourGroup.replaceChildren(...featured.colours.map(c=>{const b=document.createElement('button');b.type='button';b.className='swatch';b.dataset.viewerColour=c;b.style.setProperty('--swatch',colours[c].hex);b.setAttribute('aria-label',colours[c].name+' 3D T-shirt');return b;}));
function selectColour(c){cloth?.color.set(colours[c].hex);logoMat.color.set(c==='ivory'?'#302c25':'#ffffff');document.querySelector('#viewer-colour-label').textContent=colours[c].name;colourGroup.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.viewerColour===c)));host.dataset.colour=c;fallback.src=imageFor(featured,c);fallback.alt=featured.name+' in '+colours[c].name;const shop=document.querySelector('.viewer-shop');shop.href='#product='+featured.id+'&colour='+c;shop.textContent=featured.name+' · '+money(featured.price);needsRender=true;if(ready){renderer.render(scene,camera);needsRender=false;host.dataset.renderedColour=c;}}
colourGroup.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>selectColour(b.dataset.viewerColour)));selectColour(featured.colours[0]);

function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();needsRender=true;}new ResizeObserver(resize).observe(host);resize();new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(host);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback.hidden=false;status.hidden=false;status.textContent='3D paused. Refresh to reload the interactive garment.';renderer.domElement.hidden=true;stage.classList.add('model-unavailable');});
function animate(now){requestAnimationFrame(animate);const delta=Math.min((now-last)/1000,.1);last=now;if(!ready||!visible||document.hidden)return;controls.update(delta);if(!paused||needsRender){renderer.render(scene,camera);needsRender=false;host.dataset.renderedColour=host.dataset.colour;}}requestAnimationFrame(animate);






