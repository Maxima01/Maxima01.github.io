import * as THREE from '../vendor/three/three.module.min.js';

// A small personal mark, rather than a model of atomic physics.
const host = document.querySelector('#particle-mark');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;

if (host) {
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    initialize();
  } catch {
    // The inline vector keeps the identity intact if WebGL is unavailable.
    renderer?.dispose();
    renderer?.domElement.remove();
    host.removeAttribute('data-rendered');
    host.disabled = true;
    host.setAttribute('aria-label', 'Red and blue figure-eight mark');
    host.title = 'Red and blue figure-eight mark';
  }
}

function initialize() {
  const styles = getComputedStyle(document.documentElement);
  const color = token => new THREE.Color(styles.getPropertyValue(token).trim());
  const red = color('--particle-red');
  const blue = color('--particle-blue');
  const purple = color('--particle-purple');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1.45, -1.45, .1, 10);
  camera.position.z = 5;
  const orbit = new THREE.Group();
  orbit.rotation.z = -.24;
  orbit.rotation.y = .18;
  scene.add(orbit);
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-2, 3, 5);
  scene.add(light);

  class Eight extends THREE.Curve {
    getPoint(t, target = new THREE.Vector3()) {
      const angle = t * Math.PI * 2;
      return target.set(.62 * Math.sin(2 * angle), 1.08 * Math.sin(angle), .12 * Math.cos(angle));
    }
  }
  const curve = new Eight();
  const tube = new THREE.TubeGeometry(curve, 144, .018, 5, true);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: color('--header-muted'), transparent: true, opacity: .45 });
  orbit.add(new THREE.Mesh(tube, orbitMaterial));
  const geometry = new THREE.SphereGeometry(.12, 16, 12);
  const materials = [red, blue].map(value => new THREE.MeshStandardMaterial({ color: value, roughness: .32, metalness: .12, emissive: value, emissiveIntensity: .35 }));
  const particles = materials.map(material => {
    const mesh = new THREE.Mesh(geometry, material);
    orbit.add(mesh);
    return mesh;
  });
  const trails = materials.map((material, index) => Array.from({ length: 12 }, (_, step) => {
    const trail = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: index ? blue : red, transparent: true, opacity: .6 * (1 - step / 12), depthWrite: false }));
    trail.scale.setScalar(.5 * (1 - step / 14));
    orbit.add(trail);
    return trail;
  }));
  const crossing = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshBasicMaterial({ color: purple, transparent: true, opacity: 0, depthWrite: false }));
  orbit.add(crossing);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  let phase = .095;
  let previous = null;
  let frame = 0;
  let paused = false;
  let visible = true;
  let disposed = false;
  let contextLost = false;

  function render() {
    const blend = 1 - THREE.MathUtils.smoothstep(Math.abs(Math.sin(phase * Math.PI * 2)), .02, .24);
    particles.forEach((particle, index) => {
      const position = (phase + index * .5) % 1;
      curve.getPoint(position, particle.position);
      const base = index ? blue : red;
      particle.material.color.copy(base).lerp(purple, blend);
      particle.material.emissive.copy(particle.material.color);
      trails[index].forEach((trail, step) => {
        curve.getPoint(((position - (step + 1) * .009) % 1 + 1) % 1, trail.position);
        trail.material.color.copy(base).lerp(purple, blend * (1 - step / 12));
      });
    });
    crossing.material.opacity = blend * .75;
    renderer.render(scene, camera);
  }
  function tick(now) {
    frame = 0;
    if (previous !== null) phase = (phase + Math.min(now - previous, 60) / 7600) % 1;
    previous = now;
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = null;
    host.disabled = reducedMotion.matches || contextLost;
    host.setAttribute('aria-pressed', String(paused || reducedMotion.matches));
    const label = reducedMotion.matches ? 'Particle animation paused for reduced motion' : paused ? 'Play particle animation' : 'Pause particle animation';
    host.setAttribute('aria-label', label);
    host.title = label;
    if (disposed || contextLost) return;
    render();
    if (!paused && !reducedMotion.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || contextLost || disposed) return;
    camera.left = -1.45 * width / height;
    camera.right = 1.45 * width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
  observer.observe(host);
  const sizing = new ResizeObserver(resize);
  sizing.observe(host);
  host.addEventListener('click', () => { paused = !paused; sync(); });
  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    contextLost = true;
    host.removeAttribute('data-rendered');
    sync();
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    host.setAttribute('data-rendered', '');
    resize();
    sync();
  });
  addEventListener('pagehide', event => {
    cancelAnimationFrame(frame);
    previous = null;
    if (event.persisted) return;
    disposed = true;
    observer.disconnect();
    sizing.disconnect();
    reducedMotion.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    scene.traverse(object => {
      object.geometry?.dispose();
      object.material?.dispose();
    });
    renderer.dispose();
  });
  addEventListener('pageshow', event => { if (event.persisted) sync(); });
  resize();
  host.setAttribute('data-rendered', '');
  sync();
}
