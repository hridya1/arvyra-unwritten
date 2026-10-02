import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { colours, featuredGarment, type ColourId, type Product } from './catalogue';

type Row = { x: number; y: number; z: number; width: number; depth: number };
function loft(rows: Row[], segments = 64) {
  const positions: number[] = [], uv: number[] = [], indices: number[] = [];
  rows.forEach((row, j) => {
    const before = rows[Math.max(0, j - 1)], after = rows[Math.min(rows.length - 1, j + 1)];
    const tangent = new THREE.Vector3(after.x - before.x, after.y - before.y, after.z - before.z).normalize();
    const across = new THREE.Vector3(tangent.y, -tangent.x, 0).normalize();
    for (let i = 0; i <= segments; i++) {
      const angle = i / segments * Math.PI * 2;
      const fold = 1 + .011 * Math.sin(angle * 9 + j * .42) + .008 * Math.sin(angle * 15 - j * .61);
      const side = Math.cos(angle) * row.width * fold;
      positions.push(row.x + across.x * side, row.y + across.y * side, row.z + Math.sin(angle) * row.depth * fold);
      uv.push(i / segments, j / (rows.length - 1));
      if (j < rows.length - 1 && i < segments) {
        const a = j * (segments + 1) + i, b = a + segments + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals(); geometry.computeBoundingBox();
  return geometry;
}
function rowsBetween(a: Row, b: Row, steps = 28) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return { x: THREE.MathUtils.lerp(a.x, b.x, t), y: THREE.MathUtils.lerp(a.y, b.y, t), z: THREE.MathUtils.lerp(a.z, b.z, t), width: THREE.MathUtils.lerp(a.width, b.width, t) * (1 + .017 * Math.sin(t * Math.PI * 6)), depth: THREE.MathUtils.lerp(a.depth, b.depth, t) };
  });
}
function hoodie(group: THREE.Group, cloth: THREE.MeshStandardMaterial) {
  // One sewn silhouette connects both shoulders and sleeves; no detached sleeve tubes.
  const outline = new THREE.Shape();
  outline.moveTo(-.18, .58); outline.quadraticCurveTo(-.33, .57, -.46, .42);
  outline.quadraticCurveTo(-.63, .02, -.82, -.61); outline.lineTo(-.64, -.68);
  outline.quadraticCurveTo(-.51, -.23, -.41, .04); outline.quadraticCurveTo(-.43, -.30, -.43, -.79);
  outline.quadraticCurveTo(0, -.85, .43, -.79); outline.quadraticCurveTo(.43, -.30, .41, .04);
  outline.quadraticCurveTo(.51, -.23, .64, -.68); outline.lineTo(.82, -.61);
  outline.quadraticCurveTo(.63, .02, .46, .42); outline.quadraticCurveTo(.33, .57, .18, .58);
  outline.lineTo(.18, .43); outline.quadraticCurveTo(0, .36, -.18, .43); outline.closePath();
  const base = new THREE.ExtrudeGeometry(outline, { depth: .25, bevelEnabled: true, bevelSize: .035, bevelThickness: .035, bevelSegments: 5, curveSegments: 24, steps: 1 });
  const source = base.getAttribute('position'), vertices: number[] = [];
  function triangle(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, depth: number) {
    if (!depth) { for (const point of [a, b, c]) vertices.push(point.x, point.y, point.z); return; }
    const ab = a.clone().add(b).multiplyScalar(.5), bc = b.clone().add(c).multiplyScalar(.5), ca = c.clone().add(a).multiplyScalar(.5);
    triangle(a, ab, ca, depth - 1); triangle(ab, b, bc, depth - 1); triangle(ca, bc, c, depth - 1); triangle(ab, bc, ca, depth - 1);
  }
  for (let i = 0; i < source.count; i += 3) triangle(new THREE.Vector3().fromBufferAttribute(source, i), new THREE.Vector3().fromBufferAttribute(source, i + 1), new THREE.Vector3().fromBufferAttribute(source, i + 2), 2);
  base.dispose();
  const raw = new THREE.BufferGeometry(); raw.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const geometry = mergeVertices(raw); raw.dispose();
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i) - .125;
    const folds = .010 * Math.sin(x * 22 + y * 5) * Math.sin(y * 8) + .006 * Math.sin(x * 12 - y * 14);
    position.setZ(i, z + Math.sign(z) * folds);
  }
  geometry.computeVertexNormals(); geometry.computeBoundingBox();
  const torso = new THREE.Mesh(geometry, cloth); group.add(torso);
  // A curved, open-face hood. Its front stays hollow rather than forming a solid head.
  const positions: number[] = [], indices: number[] = [];
  for (let j = 0; j <= 32; j++) for (let i = 0; i <= 48; i++) {
    const t = j / 32, angle = i / 48 * Math.PI;
    const radius = .29 * Math.sqrt(Math.max(.001, 1 - t * t));
    positions.push(Math.cos(angle) * radius, .57 + .57 * t, .07 - Math.sin(angle) * .30 * Math.sqrt(Math.max(.001, 1 - t * t)));
    if (j < 32 && i < 48) { const a = j * 49 + i, b = a + 49; indices.push(a, b, a + 1, a + 1, b, b + 1); }
  }
  const hood = new THREE.BufferGeometry(); hood.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); hood.setIndex(indices); hood.computeVertexNormals();
  group.add(new THREE.Mesh(hood, cloth));
  const pocket = new THREE.Shape(); pocket.moveTo(-.31, -.57); pocket.lineTo(.31, -.57); pocket.lineTo(.24, -.26); pocket.quadraticCurveTo(0, -.20, -.24, -.26); pocket.closePath();
  const pouch = new THREE.Mesh(new THREE.ShapeGeometry(pocket, 30), cloth); pouch.position.z = .196; group.add(pouch);
  const seamMaterial = new THREE.LineBasicMaterial({ color: '#7b766a', transparent: true, opacity: .3 });
  const seam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.31, -.57, .2), new THREE.Vector3(.31, -.57, .2)]), seamMaterial); group.add(seam);
  const cordMaterial = new THREE.MeshStandardMaterial({ color: '#b2aa99', roughness: 1 });
  for (const sign of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(sign * .13, .54, .18), new THREE.Vector3(sign * .15, .30, .205), new THREE.Vector3(sign * .13, .08, .205)]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, .008, 6, false), cordMaterial));
  }
  return torso;
}
function cargos(group: THREE.Group, cloth: THREE.MeshStandardMaterial, wide: boolean) {
  const hip = new THREE.Mesh(loft(rowsBetween({ x: 0, y: .94, z: 0, width: .39, depth: .16 }, { x: 0, y: .47, z: 0, width: .43, depth: .19 }, 20)), cloth); group.add(hip);
  const waist = new THREE.Mesh(loft(rowsBetween({ x: 0, y: .96, z: 0, width: .396, depth: .166 }, { x: 0, y: .86, z: 0, width: .40, depth: .167 }, 6)), cloth); group.add(waist);
  for (const sign of [-1, 1]) {
    const leg = new THREE.Mesh(loft(rowsBetween({ x: sign * .235, y: .49, z: 0, width: .205, depth: .175 }, { x: sign * .26, y: -1.04, z: .015, width: wide ? .21 : .145, depth: wide ? .14 : .11 }, 54)), cloth); group.add(leg);
    // Pocket panels sit on the outer thigh and share the garment material.
    const shape = new THREE.Shape(); shape.moveTo(-.12, -.06); shape.lineTo(.12, -.06); shape.lineTo(.13, .25); shape.lineTo(-.13, .25); shape.closePath();
    const pocket = new THREE.Mesh(new THREE.ShapeGeometry(shape), cloth); pocket.position.set(sign * .25, .01, .178); group.add(pocket);
    const flap = new THREE.Mesh(new THREE.PlaneGeometry(.275, .065, 8, 2), cloth); flap.position.set(sign * .25, .24, .189); group.add(flap);
    for (const y of [.02, .21]) { const button = new THREE.Mesh(new THREE.SphereGeometry(.012, 10, 8), new THREE.MeshStandardMaterial({ color: '#66645c', roughness: .8 })); button.position.set(sign * .25, y, .203); group.add(button); }
  }
}
function disposeScene(scene: THREE.Object3D) {
  const textures = new Set<THREE.Texture>(); const materials = new Set<THREE.Material>();
  scene.traverse(object => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    if (mesh.material) for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  textures.forEach(texture => texture.dispose()); materials.forEach(material => material.dispose());
}
function graphicFor(product: Product) {
  if (['break-the-frame-tee', 'frame-hoodie'].includes(product.id)) return '/assets/unwritten-print.png';
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 1024;
  const context = canvas.getContext('2d')!;
  context.strokeStyle = '#ccc4b2'; context.fillStyle = '#e6dfce'; context.lineWidth = 7;
  if (product.id === 'many-selves-tee') {
    for (let i = 0; i < 3; i++) { context.beginPath(); context.ellipse(290 + i * 92, 390 + i * 92, 140, 230, -.18 + i * .18, 0, Math.PI * 2); context.stroke(); context.fillRect(240 + i * 92, 380 + i * 92, 12, 12); context.fillRect(325 + i * 92, 380 + i * 92, 12, 12); }
    context.fillStyle = '#bd422c'; context.font = 'bold 70px Georgia'; context.fillText('MANY SELVES', 100, 880);
  } else {
    context.translate(70, 40); context.rotate(-.08); context.font = 'italic bold 165px Georgia';
    ['OWN', 'YOUR', 'VOICE'].forEach((word, i) => { context.fillStyle = i === 1 ? '#e6dfce' : '#bf422c'; context.fillText(word, 15, 260 + i * 230); });
  }
  return canvas;
}
export function createGarmentViewer(host: HTMLDivElement, product: Product, initialColour: ColourId, onReady: () => void, onFailure: () => void) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement); renderer.domElement.setAttribute('role', 'img'); renderer.domElement.setAttribute('aria-label', `${product.name} interactive 3D concept. Use the view buttons or drag to rotate.`); renderer.domElement.tabIndex = 0;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  camera.position.set(0, .12, 4.5);
  const controls = new OrbitControls(camera, renderer.domElement); controls.enablePan = false; controls.enableDamping = true; controls.minDistance = 3.1; controls.maxDistance = 6.4; controls.target.set(0, 0, 0); controls.autoRotateSpeed = .55;
  scene.add(new THREE.HemisphereLight(0xf9f1df, 0x4b535c, 1.4));
  for (const [intensity, x, y, z] of [[2.5, 3, 4, 5], [.8, -4, 1, 3], [2.8, -2, 3, -4]]) { const light = new THREE.DirectionalLight(0xffffff, intensity); light.position.set(x, y, z); scene.add(light); }
  const group = new THREE.Group(); scene.add(group); group.rotation.y = product.type === 'Cargos' ? .25 : Math.PI + .25;
  const cloth = new THREE.MeshStandardMaterial({ color: colours[initialColour].hex, roughness: .94, side: THREE.DoubleSide });
  let disposed = false, ready = false, dirty = true, visible = true, frame = 0, last = performance.now();
  const decalMaterials: THREE.MeshStandardMaterial[] = [];
  const frontMarks: THREE.MeshStandardMaterial[] = [];
  function decal(mesh: THREE.Mesh) {
    if (product.type === 'Cargos') return;
    mesh.geometry.computeBoundingBox(); const back = mesh.geometry.boundingBox!.min.z;
    const projection = new THREE.Mesh(mesh.geometry, cloth); projection.updateMatrixWorld(true);
    const logo = document.createElement('canvas'); logo.width = 1024; logo.height = 256;
    const context = logo.getContext('2d')!; context.fillStyle = '#ffffff'; context.textAlign = 'center'; context.font = '100px Georgia'; context.fillText('ARVYRA', 512, 145);
    const logoTexture = new THREE.CanvasTexture(logo); logoTexture.colorSpace = THREE.SRGBColorSpace;
    const logoMaterial = new THREE.MeshStandardMaterial({ map: logoTexture, color: initialColour === 'ivory' ? '#302c25' : '#e6dfce', transparent: true, alphaTest: .1, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    frontMarks.push(logoMaterial);
    group.add(new THREE.Mesh(new DecalGeometry(projection, new THREE.Vector3(-.22, .32, mesh.geometry.boundingBox!.max.z), new THREE.Euler(), new THREE.Vector3(.32, .08, .4)), logoMaterial));
    const finish = (texture: THREE.Texture) => {
      if (disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, alphaTest: .55, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
      decalMaterials.push(material);
      const geometry = new DecalGeometry(projection, new THREE.Vector3(0, -.10, back), new THREE.Euler(0, Math.PI, 0), new THREE.Vector3(.82, 1.17, .4));
      group.add(new THREE.Mesh(geometry, material)); dirty = true; host.dataset.printReady = 'true';
    };
    const graphic = graphicFor(product);
    if (typeof graphic === 'string') new THREE.TextureLoader().load(graphic, finish, undefined, () => { host.dataset.printReady = 'failed'; });
    else finish(new THREE.CanvasTexture(graphic));
  }
  function loaded() { if (disposed) return; ready = true; dirty = true; host.dataset.ready = 'true'; onReady(); }
  if (product.type === 'Tees') {
    new GLTFLoader().load(featuredGarment.model, gltf => {
      if (disposed) { disposeScene(gltf.scene); return; }
      const original = gltf.scene.getObjectByName('T_Shirt_male') as THREE.Mesh;
      if (!original?.isMesh) { disposeScene(gltf.scene); onFailure(); return; }
      const geometry = original.geometry.clone(); geometry.computeBoundingBox(); const box = geometry.boundingBox!, center = box.getCenter(new THREE.Vector3()), scale = 1.9 / (box.max.y - box.min.y);
      geometry.translate(-center.x, -center.y, -center.z); geometry.scale(scale, scale, scale); geometry.translate(0, -.1, 0);
      const material = original.material as THREE.MeshStandardMaterial;
      // Clone the baked fold maps before disposing the source scene.
      cloth.normalMap = material.normalMap?.clone() ?? null; cloth.aoMap = material.aoMap?.clone() ?? null;
      cloth.normalScale.set(.45, .45); cloth.aoMapIntensity = .85; cloth.needsUpdate = true;
      const mesh = new THREE.Mesh(geometry, cloth); group.add(mesh);
      // Project in local garment coordinates, independent of the display rotation.
      group.rotation.y = 0; group.updateMatrixWorld(true); decal(mesh); group.rotation.y = Math.PI + .25;
      disposeScene(gltf.scene); loaded();
    }, undefined, () => { if (!disposed) onFailure(); });
  } else if (product.type === 'Hoodies') { const mesh = hoodie(group, cloth); group.rotation.y = 0; group.updateMatrixWorld(true); decal(mesh); group.rotation.y = Math.PI + .25; loaded(); }
  else { cargos(group, cloth, product.id === 'wide-leg-cargo'); loaded(); }
  const resize = new ResizeObserver(() => { const width = host.clientWidth, height = host.clientHeight; if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); dirty = true; if (ready) renderer.render(scene, camera); }); resize.observe(host);
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); intersection.observe(host);
  controls.addEventListener('change', () => { dirty = true; });
  const lost = (event: Event) => { event.preventDefault(); onFailure(); }; renderer.domElement.addEventListener('webglcontextlost', lost);
  function action(value: string) {
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    if (value === 'front' || value === 'back') { group.rotation.y = value === 'front' ? 0 : Math.PI; spherical.theta = 0; spherical.phi = Math.PI / 2; }
    if (value === 'left') spherical.theta -= Math.PI / 4;
    if (value === 'right') spherical.theta += Math.PI / 4;
    if (value === 'zoom-in') spherical.radius = Math.max(controls.minDistance, spherical.radius - .5);
    if (value === 'zoom-out') spherical.radius = Math.min(controls.maxDistance, spherical.radius + .5);
    camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target)); controls.update(); dirty = true; if (ready) renderer.render(scene, camera);
  }
  const keyboard = (event: KeyboardEvent) => { const command: Record<string, string> = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'zoom-in', '-': 'zoom-out' }; if (command[event.key]) { event.preventDefault(); controls.autoRotate = false; action(command[event.key]); } }; renderer.domElement.addEventListener('keydown', keyboard);
  function animate(now: number) { if (disposed) return; frame = requestAnimationFrame(animate); const delta = Math.min((now - last) / 1000, .1); last = now; if (!ready || !visible || document.hidden) return; controls.update(delta); if (controls.autoRotate || dirty) { renderer.render(scene, camera); dirty = false; } }
  frame = requestAnimationFrame(animate);
  return {
    action,
    pause: (paused: boolean) => { controls.autoRotate = !paused; dirty = true; },
    colour: (colour: ColourId) => { cloth.color.set(colours[colour].hex); frontMarks.forEach(material => material.color.set(colour === 'ivory' ? '#302c25' : '#e6dfce')); host.dataset.colour = colour; dirty = true; if (ready) { renderer.render(scene, camera); host.dataset.renderedColour = colour; } },
    dispose: () => { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect(); controls.dispose(); renderer.domElement.removeEventListener('webglcontextlost', lost); renderer.domElement.removeEventListener('keydown', keyboard); disposeScene(scene); cloth.dispose(); decalMaterials.forEach(material => material.dispose()); renderer.dispose(); renderer.domElement.remove(); },
  };
}
