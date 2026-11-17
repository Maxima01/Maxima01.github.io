import * as THREE from '../vendor/three/three.module.min.js';

const intro = document.querySelector('#portfolio-intro');
const canvas = document.querySelector('#entry-atmosphere');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;

function initializeWhenAllowed() {
  if (!intro || !canvas || renderer) return;
  if (intro.hidden) {
    reduceMotion.removeEventListener('change', initializeWhenAllowed);
    return;
  }
  if (reduceMotion.matches) return;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    initialize();
    reduceMotion.removeEventListener('change', initializeWhenAllowed);
  } catch {
    renderer?.dispose();
    renderer = null;
    canvas.hidden = true;
    reduceMotion.removeEventListener('change', initializeWhenAllowed);
  }
}

function initialize() {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 5;
  const roomBeam = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--room-beam').trim());
  const uniforms = {
    uTime: { value: 0 },
    uLight: { value: 0 },
    uAspect: { value: 1 },
    uPixelRatio: { value: 1 },
    uRoomBeam: { value: roomBeam },
  };

  const beamMaterial = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uLight;
      uniform float uAspect;
      uniform vec3 uRoomBeam;
      varying vec2 vUv;
      void main() {
        vec2 point = vec2((vUv.x - 0.5) * 2.0 * uAspect, (vUv.y - 0.5) * 2.0);
        vec2 origin = vec2(-0.12 * uAspect, 1.12);
        vec2 axis = normalize(vec2(0.08 * uAspect, -1.0));
        vec2 offset = point - origin;
        float along = dot(offset, axis);
        float across = abs(offset.x * axis.y - offset.y * axis.x);
        float width = mix(0.035, 0.58, clamp(along / 2.0, 0.0, 1.0));
        float edge = 1.0 - smoothstep(width * 0.4, width, across);
        float falloff = smoothstep(0.02, 0.2, along) * (1.0 - smoothstep(1.75, 2.3, along));
        float opacity = edge * falloff * uLight * 0.075;
        gl_FragColor = vec4(uRoomBeam, opacity);
      }
    `,
  });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), beamMaterial);
  beam.position.z = -0.1;
  beam.renderOrder = 1;
  scene.add(beam);

  let seed = 3817;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const count = matchMedia('(max-width: 640px)').matches ? 150 : 300;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const brightness = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = random() * 2 - 1;
    positions[index * 3 + 1] = random() * 2 - 1;
    positions[index * 3 + 2] = random() * 0.1;
    sizes[index] = 0.7 + random() * 2.1;
    phases[index] = random() * Math.PI * 2;
    brightness[index] = 0.35 + random() * 0.65;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  particleGeometry.setAttribute('aBrightness', new THREE.BufferAttribute(brightness, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      uniform float uTime;
      uniform float uLight;
      uniform float uAspect;
      uniform float uPixelRatio;
      attribute float aSize;
      attribute float aPhase;
      attribute float aBrightness;
      varying float vIllumination;
      varying float vBrightness;
      void main() {
        vec3 point = position;
        point.x *= uAspect;
        point.xy += vec2(sin(uTime * 0.18 + aPhase) * 0.008, cos(uTime * 0.14 + aPhase) * 0.012);
        vec2 origin = vec2(-0.12 * uAspect, 1.12);
        vec2 axis = normalize(vec2(0.08 * uAspect, -1.0));
        vec2 offset = point.xy - origin;
        float along = dot(offset, axis);
        float across = abs(offset.x * axis.y - offset.y * axis.x);
        float width = mix(0.035, 0.58, clamp(along / 2.0, 0.0, 1.0));
        float edge = 1.0 - smoothstep(width * 0.4, width, across);
        float falloff = smoothstep(0.02, 0.2, along) * (1.0 - smoothstep(1.75, 2.3, along));
        vIllumination = edge * falloff;
        vBrightness = aBrightness;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
        gl_PointSize = aSize * uPixelRatio * (1.0 + uLight * vIllumination * 0.25);
      }
    `,
    fragmentShader: `
      uniform float uLight;
      uniform vec3 uRoomBeam;
      varying float vIllumination;
      varying float vBrightness;
      void main() {
        float distanceToCenter = length(gl_PointCoord - 0.5);
        float mote = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);
        float ambient = 0.2 + vIllumination * uLight * 0.8;
        float alpha = mote * ambient * vBrightness * 0.64;
        gl_FragColor = vec4(uRoomBeam, alpha);
      }
    `,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.renderOrder = 2;
  scene.add(particles);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  let visible = !intro.hidden;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let light = 0;
  let disposed = false;
  let contextLost = false;
  const frameInterval = 1000 / 30;
  const frameTolerance = 0.5;

  function draw(now) {
    frame = 0;
    if (!reduceMotion.matches && previous && now - previous < frameInterval - frameTolerance) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const delta = previous ? Math.min(now - previous, 60) : 16;
    previous = now;
    if (!reduceMotion.matches) elapsed += delta / 1000;
    const targetLight = intro.classList.contains('is-lit') && !intro.classList.contains('is-darkening') ? 1 : 0;
    light += (targetLight - light) * (1 - Math.exp(-delta / (reduceMotion.matches ? 110 : 460)));
    if (Math.abs(targetLight - light) < 0.002) light = targetLight;
    uniforms.uTime.value = elapsed;
    uniforms.uLight.value = light;
    renderer.render(scene, camera);
    if (!intro.hidden && visible && !document.hidden && (!reduceMotion.matches || light !== targetLight)) {
      frame = requestAnimationFrame(draw);
    } else {
      previous = 0;
    }
  }

  function requestDraw() {
    if (disposed || contextLost) return;
    if (intro.hidden || !visible || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      return;
    }
    if (frame) return;
    frame = requestAnimationFrame(draw);
  }

  function resize() {
    const { width, height } = intro.getBoundingClientRect();
    if (!width || !height || disposed || contextLost) return;
    const aspect = width / height;
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();
    beam.scale.x = aspect;
    uniforms.uAspect.value = aspect;
    uniforms.uPixelRatio.value = renderer.getPixelRatio();
    renderer.setSize(width, height, false);
    requestDraw();
  }

  const stateObserver = new MutationObserver(() => {
    if (intro.hidden) disposeAtmosphere();
    else requestDraw();
  });
  stateObserver.observe(intro, { attributes: true, attributeFilter: ['class', 'hidden'] });
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) requestDraw();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    }
  });
  visibilityObserver.observe(intro);
  const sizingObserver = new ResizeObserver(resize);
  sizingObserver.observe(intro);
  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    canvas.hidden = true;
  }
  function onContextRestored() {
    if (disposed) return;
    contextLost = false;
    canvas.hidden = false;
    resize();
  }
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  function onVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    } else requestDraw();
  }
  function onPageHide(event) {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (event.persisted) return;
    disposeAtmosphere();
  }
  function onPageShow(event) {
    if (event.persisted && !intro.hidden) requestDraw();
  }
  function disposeAtmosphere() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    stateObserver.disconnect();
    visibilityObserver.disconnect();
    sizingObserver.disconnect();
    reduceMotion.removeEventListener('change', requestDraw);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);
    particleGeometry.dispose();
    beam.geometry.dispose();
    beamMaterial.dispose();
    particleMaterial.dispose();
    canvas.hidden = true;
    renderer.dispose();
    renderer = null;
  }
  reduceMotion.addEventListener('change', requestDraw);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  resize();
}

reduceMotion.addEventListener('change', initializeWhenAllowed);
initializeWhenAllowed();
