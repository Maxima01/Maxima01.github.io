(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js-enabled');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const portfolioThemeColor = themeColorMeta?.content;
  const introThemeColor = getComputedStyle(root).getPropertyValue('--room-ground').trim();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.querySelector('#portfolio-intro');
  const entryAnnouncement = document.querySelector('#entry-announcement');
  const entryTransitionStatus = document.querySelector('#entry-transition-status');
  const particleMarkHost = document.querySelector('#particle-mark');
  const lightSwitch = document.querySelector('#light-switch');
  const lightSwitchLabel = document.querySelector('#light-switch-label');
  const entryRoleText = document.querySelector('#entry-role-text');
  const entryFocusText = document.querySelector('#entry-focus-text');
  const entrySkip = document.querySelector('#entry-skip');
  const main = document.querySelector('#main');
  const entryRole = 'Software developer · IT graduate';
  const entryRoleAccessible = 'Software developer and IT graduate.';
  const entryFocus = 'I start with the problem, learn the system, and shape the experience.';
  const introBackground = intro ? [...document.body.children].filter(element => element !== intro) : [];
  const introBackgroundInert = new Map(introBackground.map(element => [element, element.inert]));
  const entryTimeouts = new Set();
  let entryFinishing = false;
  let particleMarkImport = null;
  let particleMarkObserver = null;
  let particleMarkLoadHandle = null;
  let particleMarkLoadGeneration = 0;
  let entryAtmosphereImport = null;
  let entryAtmosphereLoadHandle = null;
  let entryAtmosphereLoadGeneration = 0;
  let audioContext = null;
  let switchSoundRequest = 0;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const desktop = window.matchMedia('(min-width: 1100px) and (min-height: 760px)');
  const projects = [...document.querySelectorAll('.project[data-status]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const filterStatus = document.querySelector('#filter-status');
  const previewLinks = [...document.querySelectorAll('[data-preview]')];
  const stage = document.querySelector('#context-panel');
  const stageScroll = document.querySelector('#stage-scroll');
  const stageImage = document.querySelector('#stage-image');
  const stageLink = document.querySelector('#stage-link');
  const stageFigure = stageLink?.closest('.stage-figure');
  const stageImageFallback = document.querySelector('#stage-image-fallback');
  const stageImageFallbackLink = document.querySelector('#stage-image-fallback-link');
  const stageTitle = document.querySelector('#stage-title');
  const stageKind = document.querySelector('#stage-kind');
  const stageCaption = document.querySelector('#stage-caption');
  const closePanel = document.querySelector('#panel-close');
  const reopenPanel = document.querySelector('#panel-reopen');
  const views = [...document.querySelectorAll('[data-panel]')];
  const profile = document.querySelector('#profile-content');
  const profileHome = document.querySelector('#profile-details .disclosure-body-inner');
  const map = document.querySelector('#development-map');
  const mapHome = document.querySelector('#approach-map-details .disclosure-body-inner');
  const liveAnimations = new Set();
  const panelCopy = {
    about: ['Profile & toolkit', 'About'],
    everyday: ['What I build for', 'Software for the everyday'],
    work: ['Inside the work', 'Selected work'],
    approach: ['The development map', 'From the system up'],
    contact: ['Start a conversation', 'Let’s build what’s next'],
  };
  const readingTargets = [...document.querySelectorAll('#about, #everyday, #work, .project[data-status], #approach, #contact')];
  const navLinks = [...document.querySelectorAll('.site-header nav a')];
  let currentProject = null;
  let requestedProject = null;
  let previewRequest = 0;
  let currentPanel = 'about';
  let readingTarget = readingTargets[0];
  let panelHidden = false;
  let scrollFrame = 0;
  let layoutChanging = false;
  let approachPathDrawn = false;
  let approachStepsRevealed = false;
  try { panelHidden = sessionStorage.getItem('portfolio-panel-hidden') === 'true'; } catch { /* Storage is optional. */ }

  function move(element, keyframes, duration = 360, delay = 0, fill = 'none') {
    if (!element || reduceMotion.matches || !element.animate) return null;
    for (const animation of element.getAnimations()) animation.cancel();
    const animation = element.animate(keyframes, {
      duration, delay, fill, easing: 'cubic-bezier(.16, 1, .3, 1)',
    });
    liveAnimations.add(animation);
    const release = () => liveAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
    return animation;
  }

  function delayEntry(callback, delay) {
    const timeout = window.setTimeout(() => {
      entryTimeouts.delete(timeout);
      callback();
    }, delay);
    entryTimeouts.add(timeout);
  }

  function loadParticleMark() {
    if (reduceMotion.matches || !particleMarkHost || particleMarkImport || particleMarkObserver || particleMarkLoadHandle) return;
    if ('IntersectionObserver' in window) {
      const bounds = particleMarkHost.getBoundingClientRect();
      const nearViewport = bounds.bottom >= -48 && bounds.top <= window.innerHeight + 48;
      if (!nearViewport) {
        particleMarkObserver = new IntersectionObserver(entries => {
          if (!entries.some(entry => entry.isIntersecting)) return;
          particleMarkObserver?.disconnect();
          particleMarkObserver = null;
          scheduleParticleMarkImport();
        }, { rootMargin: '48px' });
        particleMarkObserver.observe(particleMarkHost);
        return;
      }
    }
    scheduleParticleMarkImport();
  }

  function scheduleParticleMarkImport() {
    if (reduceMotion.matches || particleMarkImport || particleMarkLoadHandle) return;
    const generation = ++particleMarkLoadGeneration;
    const startImport = () => {
      if (generation !== particleMarkLoadGeneration) return;
      particleMarkLoadHandle = null;
      if (reduceMotion.matches) return;
      particleMarkImport = import(new URL('./assets/js/particle-mark.js?v=20261116-7', document.baseURI)).catch(() => null);
    };
    if (typeof window.requestIdleCallback === 'function') {
      particleMarkLoadHandle = {
        kind: 'idle',
        id: window.requestIdleCallback(startImport, { timeout: 1200 }),
      };
    } else {
      particleMarkLoadHandle = { kind: 'timeout', id: window.setTimeout(startImport, 160) };
    }
  }

  function cancelParticleMarkLoad() {
    particleMarkObserver?.disconnect();
    particleMarkObserver = null;
    if (!particleMarkLoadHandle) return;
    particleMarkLoadGeneration += 1;
    if (particleMarkLoadHandle.kind === 'idle') window.cancelIdleCallback?.(particleMarkLoadHandle.id);
    else window.clearTimeout(particleMarkLoadHandle.id);
    particleMarkLoadHandle = null;
  }

  function startEntryAtmosphereImport() {
    if (!intro || intro.hidden || reduceMotion.matches || entryFinishing || entryAtmosphereImport) return;
    entryAtmosphereImport = import(new URL('./assets/js/entry-atmosphere.js?v=20261116-6', document.baseURI).href).catch(() => {
      const atmosphere = document.querySelector('#entry-atmosphere');
      if (atmosphere) atmosphere.hidden = true;
      return null;
    });
  }

  function cancelEntryAtmosphereLoad() {
    if (!entryAtmosphereLoadHandle) return;
    entryAtmosphereLoadGeneration += 1;
    if (entryAtmosphereLoadHandle.kind === 'idle') window.cancelIdleCallback?.(entryAtmosphereLoadHandle.id);
    else window.clearTimeout(entryAtmosphereLoadHandle.id);
    entryAtmosphereLoadHandle = null;
  }

  function loadEntryAtmosphere() {
    if (!intro || intro.hidden || reduceMotion.matches || entryFinishing || entryAtmosphereImport || entryAtmosphereLoadHandle) return;
    const generation = ++entryAtmosphereLoadGeneration;
    const start = () => {
      if (generation !== entryAtmosphereLoadGeneration) return;
      entryAtmosphereLoadHandle = null;
      startEntryAtmosphereImport();
    };
    if (typeof window.requestIdleCallback === 'function') {
      entryAtmosphereLoadHandle = {
        kind: 'idle',
        id: window.requestIdleCallback(start, { timeout: 600 }),
      };
    } else {
      entryAtmosphereLoadHandle = { kind: 'timeout', id: window.setTimeout(start, 120) };
    }
  }

  function scheduleSwitchSound(context, kind) {
    const now = context.currentTime;
    const output = context.createGain();
    output.gain.setValueAtTime(0.38, now);
    output.connect(context.destination);

    const length = Math.ceil(context.sampleRate * 0.075);
    const noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      noise[index] = Math.random() * 2 - 1;
    }

    const transient = ({ delay, duration, frequency, q, level, type }) => {
      const start = now + delay;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const envelope = context.createGain();
      source.buffer = noiseBuffer;
      filter.type = type;
      filter.frequency.setValueAtTime(frequency, start);
      filter.Q.setValueAtTime(q, start);
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(level, start + 0.0015);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(output);
      source.start(start);
      source.stop(start + duration);
    };

    const isOn = kind === 'on';
    transient({ delay: 0, duration: 0.048, frequency: isOn ? 1220 : 980, q: 0.8, level: 0.16, type: 'bandpass' });
    transient({ delay: 0.003, duration: 0.019, frequency: isOn ? 2550 : 2100, q: 0.65, level: 0.045, type: 'highpass' });
    transient({ delay: 0.014, duration: 0.028, frequency: isOn ? 760 : 620, q: 1.1, level: 0.035, type: 'bandpass' });
  }

  function playSwitchSound(kind) {
    const request = ++switchSoundRequest;
    if (!AudioContextClass) return;

    try {
      audioContext ??= new AudioContextClass();
      const context = audioContext;
      const play = () => {
        if (audioContext !== context || request !== switchSoundRequest || context.state !== 'running') return;
        scheduleSwitchSound(context, kind);
      };
      if (context.state === 'running') play();
      else context.resume().then(play).catch(() => {});
    } catch {
      // Sound is an enhancement; the light switch remains usable without Web Audio.
    }
  }

  function closeAudioContext() {
    switchSoundRequest += 1;
    if (!audioContext) return;
    const context = audioContext;
    audioContext = null;
    if (context.state !== 'closed') context.close().catch(() => {});
  }

  function clearEntryTimers() {
    for (const timeout of entryTimeouts) window.clearTimeout(timeout);
    entryTimeouts.clear();
  }

  function setIntroBackgroundInert(inert) {
    for (const element of introBackground) {
      element.inert = inert ? true : introBackgroundInert.get(element);
    }
  }

  function finishEntry({ skip = false } = {}) {
    if (entryFinishing) return;
    entryFinishing = true;
    if (skip) switchSoundRequest += 1;
    cancelEntryAtmosphereLoad();
    clearEntryTimers();
    try { sessionStorage.setItem('portfolio-intro-complete', 'true'); } catch { /* Storage is optional. */ }
    lightSwitch.disabled = true;
    entrySkip.disabled = true;
    if (entryTransitionStatus) {
      entryTransitionStatus.textContent = 'Entering the portfolio.';
      entryTransitionStatus.focus({ preventScroll: true });
    }

    const darkenFirst = intro.classList.contains('is-lit') && !skip;
    if (darkenFirst) {
      intro.classList.add('is-darkening');
      lightSwitch.setAttribute('aria-pressed', 'false');
      lightSwitchLabel.textContent = 'Entering portfolio';
    }
    setIntroBackgroundInert(true);
    document.body.classList.remove('intro-open');

    const revealPortfolio = () => {
      intro.classList.add('is-leaving');
      delayEntry(() => {
        intro.hidden = true;
        intro.classList.remove('is-lit', 'is-darkening', 'is-leaving');
        root.classList.remove('intro-visible');
        if (themeColorMeta && portfolioThemeColor) themeColorMeta.content = portfolioThemeColor;
        setIntroBackgroundInert(false);
        closeAudioContext();
        loadParticleMark();
        main.focus({ preventScroll: true });
        window.dispatchEvent(new Event('portfolio:intro-complete'));
      }, reduceMotion.matches ? 180 : 600);
    };

    delayEntry(revealPortfolio, darkenFirst && !reduceMotion.matches ? 460 : 0);
  }

  function setupPortfolioIntro() {
    if (!intro || !lightSwitch || !entrySkip || !entryRoleText || !entryFocusText || !main || window.location.hash) {
      loadParticleMark();
      return;
    }
    let entered = false;
    try { entered = sessionStorage.getItem('portfolio-intro-complete') === 'true'; } catch { /* Storage is optional. */ }
    if (entered) {
      loadParticleMark();
      return;
    }

    intro.hidden = false;
    if (themeColorMeta && introThemeColor) themeColorMeta.content = introThemeColor;
    root.classList.add('intro-visible');
    setIntroBackgroundInert(true);
    document.body.classList.add('intro-open');
    loadEntryAtmosphere();
    lightSwitch.focus({ preventScroll: true });
    lightSwitch.addEventListener('click', () => {
      if (entryFinishing) return;
      if (intro.classList.contains('is-lit')) {
        playSwitchSound('off');
        finishEntry();
        return;
      }
      entryRoleText.textContent = entryRole;
      entryFocusText.textContent = entryFocus;
      intro.classList.add('is-lit');
      lightSwitch.setAttribute('aria-pressed', 'true');
      lightSwitchLabel.textContent = 'Enter portfolio';
      if (entryAnnouncement) entryAnnouncement.textContent = `${entryRoleAccessible} ${entryFocus} The light is on. Press the switch again to enter the portfolio, or use Escape to skip.`;
      playSwitchSound('on');
    });
    entrySkip.addEventListener('click', () => finishEntry({ skip: true }));
    document.addEventListener('keydown', event => {
      if (intro.hidden) return;
      if (event.key === 'Tab') {
        if (entryFinishing) {
          event.preventDefault();
          return;
        }
        const tabStops = [lightSwitch, entrySkip].filter(control => !control.disabled);
        const first = tabStops[0];
        const last = tabStops.at(-1);
        if (event.shiftKey && (document.activeElement === first || !intro.contains(document.activeElement))) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && (document.activeElement === last || !intro.contains(document.activeElement))) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
        return;
      }
      if (event.key !== 'Escape' || event.defaultPrevented || entryFinishing) return;
      event.preventDefault();
      finishEntry({ skip: true });
    });
  }

  function replaceStageText(element, value) {
    const oldText = element.textContent;
    if (oldText === value) return;
    const bounds = element.getBoundingClientRect();
    const parent = element.parentElement;
    const parentBounds = parent.getBoundingClientRect();
    const outgoing = element.cloneNode(false);
    outgoing.removeAttribute('id');
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.classList.add('stage-outgoing');
    outgoing.textContent = oldText;
    Object.assign(outgoing.style, {
      position: 'absolute',
      top: (bounds.top - parentBounds.top) + 'px',
      left: (bounds.left - parentBounds.left) + 'px',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
    });
    parent.append(outgoing);
    element.textContent = value;
    move(element, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], 260, 0, 'both');
    const outgoingAnimation = move(outgoing, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-4px)' }], 220, 0, 'forwards');
    if (outgoingAnimation) outgoingAnimation.finished.then(() => outgoing.remove(), () => outgoing.remove());
    else outgoing.remove();
  }

  // Each project remains the source of truth for its image, status, and caption.
  async function showProject(project) {
    if (!project || project.hidden || project.inert || project === requestedProject) return;
    const source = project.querySelector('.project-visual img');
    const sourceLink = project.querySelector('.image-link');
    if (!source || !sourceLink) return;
    requestedProject = project;
    const request = ++previewRequest;
    stageFigure?.setAttribute('aria-busy', 'true');
    const nextImage = new Image();
    nextImage.src = source.src;
    let imageAvailable = false;
    try {
      if (typeof nextImage.decode === 'function') {
        await nextImage.decode();
      } else {
        await new Promise(resolve => {
          const settle = () => resolve();
          nextImage.addEventListener('load', settle, { once: true });
          nextImage.addEventListener('error', settle, { once: true });
          if (nextImage.complete) settle();
        });
      }
      imageAvailable = nextImage.naturalWidth > 0;
    } catch {
      imageAvailable = nextImage.naturalWidth > 0;
    }
    if (request !== previewRequest) return;
    if (project.hidden || project.inert) {
      if (requestedProject === project) requestedProject = currentProject;
      stageFigure?.setAttribute('aria-busy', 'false');
      return;
    }
    const animateHandoff = Boolean(imageAvailable && currentProject && currentProject !== project && root.classList.contains('panel-open') && currentPanel === 'work' && !reduceMotion.matches);
    let outgoingImage = null;
    if (animateHandoff) {
      outgoingImage = stageImage.cloneNode(false);
      outgoingImage.removeAttribute('id');
      outgoingImage.alt = '';
      outgoingImage.setAttribute('aria-hidden', 'true');
      outgoingImage.classList.add('stage-image-outgoing');
      stageLink.insertBefore(outgoingImage, stageImage);
    }
    currentProject = project;
    stageLink.dataset.project = project.id;
    stageImage.alt = source.alt;
    stageLink.href = sourceLink.href;
    stageLink.setAttribute('aria-label', sourceLink.getAttribute('aria-label'));
    const nextTitle = project.querySelector('h3').textContent;
    const nextCaption = project.querySelector('.project-visual figcaption').textContent;
    const status = project.querySelector('.project-status');
    const nextKind = status.firstChild.textContent.trim() + ' · ' + status.querySelector('span').textContent;
    const focusWasOnStageLink = stageLink.contains(document.activeElement);
    stageLink.hidden = !imageAvailable;
    stageImageFallback.hidden = imageAvailable;
    if (imageAvailable) {
      stageImage.src = source.src;
    } else {
      stageImage.removeAttribute('src');
      stageImageFallback.style.aspectRatio = `${source.getAttribute('width') || 8} / ${source.getAttribute('height') || 5}`;
      stageImageFallbackLink.href = `#${project.id}`;
      stageImageFallbackLink.textContent = `Read the ${nextTitle} case study`;
    }
    if (animateHandoff) {
      replaceStageText(stageTitle, nextTitle);
      replaceStageText(stageKind, nextKind);
      replaceStageText(stageCaption, nextCaption);
    } else {
      stageTitle.textContent = nextTitle;
      stageKind.textContent = nextKind;
      stageCaption.textContent = nextCaption;
    }
    for (const link of previewLinks) {
      if (link.dataset.preview === project.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    if (root.classList.contains('panel-open') && currentPanel === 'work') {
      if (imageAvailable) move(stageImage, [{ opacity: animateHandoff ? .35 : .25, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], 280, 0, 'both');
      else move(stageImageFallback, [{ opacity: .4, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], 220);
      if (!animateHandoff) {
        move(stageTitle, [{ opacity: .45, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], 240);
        move(stageCaption, [{ opacity: .5 }, { opacity: 1 }], 240);
      }
    }
    if (outgoingImage) {
      const outgoingAnimation = move(outgoingImage, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], 260, 0, 'forwards');
      if (outgoingAnimation) outgoingAnimation.finished.then(() => outgoingImage.remove(), () => outgoingImage.remove());
      else outgoingImage.remove();
    }
    stageFigure?.setAttribute('aria-busy', 'false');
    if (!imageAvailable && focusWasOnStageLink) stageImageFallbackLink.focus({ preventScroll: true });
  }

  function showPanel(name) {
    if (currentPanel === name) return;
    currentPanel = name;
    const view = views.find(item => item.dataset.panel === name);
    for (const item of views) {
      // Keep keyboard focus in the panel when scrolling replaces its content.
      if (item !== view && item.contains(document.activeElement)) closePanel.focus({ preventScroll: true });
      for (const animation of item.getAnimations({ subtree: true })) animation.cancel();
      item.hidden = item !== view;
    }
    stageScroll.scrollTop = 0;
    document.querySelector('#panel-label').textContent = panelCopy[name][0];
    document.querySelector('#panel-section').textContent = panelCopy[name][1];
    stage.setAttribute('aria-label', panelCopy[name][1] + ': ' + panelCopy[name][0]);
    stageScroll.setAttribute('aria-label', panelCopy[name][0]);
    stage.dataset.section = name;
    if (name === 'approach') {
      const path = map.querySelector('.thought-path');
      if (path && !approachPathDrawn) {
        approachPathDrawn = true;
        if (reduceMotion.matches) path.classList.add('path-drawn');
        else requestAnimationFrame(() => path.classList.add('path-drawn'));
      }
      if (!approachStepsRevealed) {
        approachStepsRevealed = true;
        map.querySelectorAll('.thought-path > li').forEach((step, index) => {
          move(step, [{ opacity: .25, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], 420, index * 45);
        });
      }
    }
    if (!root.classList.contains('panel-open')) return;
    move(view, [{ opacity: .2, transform: 'translateX(-18px)' }, { opacity: 1, transform: 'none' }], 420);
  }

  // One reading line handles short sections, long articles, and upward scrolling.
  function syncReading() {
    scrollFrame = 0;
    if (layoutChanging) return;
    if (document.querySelector('#image-viewer')?.open) return;
    const line = window.innerHeight * .28;
    let active = readingTargets[0];
    for (const target of readingTargets) {
      if (!target.hidden && !target.inert && target.getBoundingClientRect().top <= line) active = target;
    }
    // A short footer may never reach the reading line, even at the page bottom.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = readingTargets[readingTargets.length - 1];
    }
    readingTarget = active;
    const panel = active.matches('.project') ? 'work' : active.id;
    showPanel(panel);
    if (panel === 'work') showProject(active.matches('.project') ? active : projects.find(project => !project.hidden && !project.inert));
    const navSection = panel === 'everyday' ? 'about' : panel;
    for (const link of navLinks) {
      if (link.hash === '#' + navSection) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleReading() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncReading);
  }

  function syncLayout() {
    const activeElement = document.activeElement;
    const stageHadFocus = stage.contains(activeElement);
    const profileHadFocus = profile.contains(activeElement);
    const mapHadFocus = map.contains(activeElement);
    const reopenHadFocus = activeElement === reopenPanel;
    const open = desktop.matches && !panelHidden;
    const reopenWillBeVisible = desktop.matches && !open;
    root.classList.toggle('panel-open', open);
    stage.inert = !open;
    reopenPanel.hidden = !desktop.matches || open;
    closePanel.setAttribute('aria-expanded', String(open));
    reopenPanel.setAttribute('aria-expanded', String(open));
    if (open && reopenHadFocus) closePanel.focus({ preventScroll: true });
    else if (!open && (stageHadFocus || (reopenHadFocus && !reopenWillBeVisible))) main.focus({ preventScroll: true });
    // Move the same accessible content; no duplicate IDs or separate mobile copies.
    (open ? views.find(view => view.dataset.panel === 'about') : profileHome).append(profile);
    (open ? views.find(view => view.dataset.panel === 'approach') : mapHome).append(map);
    syncReading();
    if (open && ((profileHadFocus && currentPanel !== 'about') || (mapHadFocus && currentPanel !== 'approach'))) {
      main.focus({ preventScroll: true });
    }
  }

  function setPanelHidden(hidden) {
    const anchor = readingTarget;
    const before = anchor.getBoundingClientRect().top;
    const previousLeft = document.querySelector('.reading-stage').getBoundingClientRect().left;
    layoutChanging = true;
    panelHidden = hidden;
    try { sessionStorage.setItem('portfolio-panel-hidden', String(hidden)); } catch { /* Storage is optional. */ }
    syncLayout();
    // Reflow should leave the reader at the same section, even far down the page.
    window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
    const reading = document.querySelector('.reading-stage');
    const offset = previousLeft - reading.getBoundingClientRect().left;
    move(reading, [{ transform: 'translateX(' + offset + 'px)', opacity: .7 }, { transform: 'none', opacity: 1 }], 380);
    if (!hidden) move(stage, [{ opacity: .2, transform: 'translateX(-24px)' }, { opacity: 1, transform: 'none' }], 400);
    else move(reopenPanel, [{ transform: 'translateY(6px)' }, { transform: 'none' }], 240);
    (hidden ? reopenPanel : closePanel).focus({ preventScroll: true });
    requestAnimationFrame(() => {
      // Inline images and moved disclosure content finish their layout this frame.
      window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
      layoutChanging = false;
      syncReading();
    });
  }

  closePanel.addEventListener('click', () => setPanelHidden(true));
  reopenPanel.addEventListener('click', () => setPanelHidden(false));
  desktop.addEventListener('change', syncLayout);
  window.addEventListener('scroll', scheduleReading, { passive: true });
  window.addEventListener('resize', scheduleReading, { passive: true });
  window.addEventListener('pageshow', scheduleReading);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleReading).observe(document.querySelector('.reading-stage'));
  setupPortfolioIntro();
  syncLayout();
  if (window.location.hash) {
    requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target && !target.hidden && !target.inert) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  }

  const filterGroup = document.querySelector('.filters');
  if (filterGroup && filterButtons.length) {
    filterGroup.hidden = false;
    for (const button of filterButtons) {
      const filter = button.dataset.filter;
      const matches = project => filter === 'all' || project.dataset.status.split(' ').includes(filter);
      button.querySelector('span').textContent = String(projects.filter(matches).length);
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        for (const project of projects) {
          if (matches(project)) {
            const wasUnavailable = project.hidden || project.inert;
            project.hidden = false;
            project.inert = false;
            project.removeAttribute('aria-hidden');
            if (wasUnavailable) move(project, [{ opacity: .45, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], 220);
          } else {
            if (project.hidden || project.inert) continue;
            project.inert = true;
            project.setAttribute('aria-hidden', 'true');
            const animation = move(project, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], 160);
            if (animation) {
              const hideProject = () => { if (project.inert) project.hidden = true; };
              animation.addEventListener('finish', hideProject, { once: true });
              animation.addEventListener('cancel', hideProject, { once: true });
            } else {
              project.hidden = true;
            }
          }
        }
        for (const option of filterButtons) option.setAttribute('aria-pressed', String(option === button));
        for (const link of previewLinks) {
          const project = document.getElementById(link.dataset.preview);
          link.hidden = project.hidden || project.inert;
        }
        const visible = projects.filter(project => !project.hidden && !project.inert);
        const projectNoun = visible.length === 1 ? 'project' : 'projects';
        const filterLabel = filter === 'all' ? '' : button.querySelector('span').previousSibling.textContent.trim();
        filterStatus.textContent = filter === 'all'
          ? `Showing all ${visible.length} ${projectNoun}.`
          : `${filterLabel}: ${visible.length} ${projectNoun} shown.`;
        syncReading();
      });
    }
  }

  function revealFilteredProject(target) {
    if (!target?.matches('.project') || (!target.hidden && !target.inert)) return false;
    const allProjectsFilter = filterButtons.find(button => button.dataset.filter === 'all');
    if (!allProjectsFilter) return false;
    if (allProjectsFilter.getAttribute('aria-pressed') !== 'true') allProjectsFilter.click();
    return !target.hidden && !target.inert;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#project-"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    revealFilteredProject(document.getElementById(link.hash.slice(1)));
  });
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (revealFilteredProject(target)) {
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
    scheduleReading();
  });

  // Keep the image on this page, with native focus containment and Escape support.
  const viewer = document.querySelector('#image-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerCaption = document.querySelector('#viewer-caption');
  const viewerTitle = document.querySelector('#viewer-title');
  const viewerFigure = document.querySelector('.viewer-figure');
  const viewerNavigation = document.querySelector('#viewer-navigation');
  const viewerPrevious = document.querySelector('#viewer-previous');
  const viewerNext = document.querySelector('#viewer-next');
  const viewerPosition = document.querySelector('#viewer-position');
  const viewerAnnouncement = document.querySelector('#viewer-announcement');
  const viewerHelp = document.querySelector('.viewer-help');
  const viewerClose = document.querySelector('#viewer-close');
  let imageOpener = null;
  let imageOpenerFallback = null;
  let backgroundOverflow = '';
  let viewerClosing = false;
  let imageSequence = [];
  let imageIndex = -1;
  let requestedImageIndex = -1;
  let imageLoadRequest = 0;
  let swipeStart = null;
  let viewerHelpBase = 'Press Esc or click outside the image to close.';
  const warmedViewerImages = new Set();
  if (viewer && typeof viewer.showModal === 'function') {
    function warmViewerNeighbors(index) {
      if (imageSequence.length < 2) return;
      const neighbors = new Set([
        (index - 1 + imageSequence.length) % imageSequence.length,
        (index + 1) % imageSequence.length,
      ]);
      for (const neighborIndex of neighbors) {
        const url = imageSequence[neighborIndex]?.href;
        if (!url || warmedViewerImages.has(url)) continue;
        warmedViewerImages.add(url);
        const image = new Image();
        image.decoding = 'async';
        image.fetchPriority = 'low';
        if (typeof image.decode === 'function') {
          image.src = url;
          image.decode().catch(() => warmedViewerImages.delete(url));
        } else {
          image.addEventListener('error', () => warmedViewerImages.delete(url), { once: true });
          image.src = url;
        }
      }
    }

    function showViewerImage(index, { animate = false, announce = false } = {}) {
      const link = imageSequence[index];
      const source = link?.querySelector('img');
      if (!source) return;
      if (index === imageIndex) {
        imageLoadRequest += 1;
        requestedImageIndex = imageIndex;
        viewerFigure.setAttribute('aria-busy', 'false');
        return;
      }
      const request = ++imageLoadRequest;
      requestedImageIndex = index;
      viewerFigure.setAttribute('aria-busy', 'true');
      if (announce) viewerAnnouncement.textContent = `Loading image ${index + 1} of ${imageSequence.length}.`;
      const setViewerDetails = (announceReady = true, dimensionSource = source) => {
        viewerImage.alt = source.alt;
        const imageWidth = dimensionSource.naturalWidth || dimensionSource.width;
        const imageHeight = dimensionSource.naturalHeight || dimensionSource.height;
        if (imageWidth > 0 && imageHeight > 0) {
          viewerImage.width = imageWidth;
          viewerImage.height = imageHeight;
        }
        const isTallImage = imageWidth > 0 && imageHeight > imageWidth * 1.5;
        viewerFigure.classList.toggle('viewer-figure-tall', isTallImage);
        if (isTallImage) viewerFigure.setAttribute('tabindex', '0');
        else if (document.activeElement !== viewerFigure) viewerFigure.removeAttribute('tabindex');
        viewerHelp.textContent = isTallImage ? `Tab to the image, then use Page Down or scroll within it to inspect the full page. ${viewerHelpBase}` : viewerHelpBase;
        viewerCaption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
        viewerPosition.textContent = imageSequence.length > 1 ? `${index + 1} of ${imageSequence.length}` : '';
        if (announce && announceReady) viewerAnnouncement.textContent = `Image ${index + 1} of ${imageSequence.length}: ${source.alt}`;
      };
      if (imageIndex < 0) {
        setViewerDetails(false);
        const previewUrl = source.currentSrc || source.src;
        if (previewUrl) viewerImage.src = previewUrl;
      } else if (imageSequence.length > 1) {
        viewerPosition.textContent = `Loading ${index + 1} of ${imageSequence.length}`;
      }
      const preparedImage = new Image();
      preparedImage.decoding = 'async';
      let committed = false;
      const commitViewerImage = (loaded = preparedImage.naturalWidth > 0) => {
        if (committed || request !== imageLoadRequest || viewerClosing) return;
        committed = true;
        viewerFigure.scrollTop = 0;
        imageIndex = index;
        requestedImageIndex = index;
        if (!loaded || !preparedImage.naturalWidth) {
          viewerImage.removeAttribute('src');
          viewerImage.removeAttribute('width');
          viewerImage.removeAttribute('height');
          viewerImage.alt = '';
          viewerFigure.classList.remove('viewer-figure-tall');
          if (document.activeElement !== viewerFigure) viewerFigure.removeAttribute('tabindex');
          viewerHelp.textContent = viewerHelpBase;
          viewerCaption.textContent = imageSequence.length > 1
            ? 'This image could not be loaded. Use Previous or Next to view another image.'
            : 'This image could not be loaded. Close the viewer and try again.';
          viewerPosition.textContent = imageSequence.length > 1 ? `${index + 1} of ${imageSequence.length}` : '';
          if (announce) viewerAnnouncement.textContent = `Image ${index + 1} of ${imageSequence.length} could not be loaded.`;
          viewerFigure.setAttribute('aria-busy', 'false');
          return;
        }
        viewerImage.src = link.href;
        setViewerDetails(true, preparedImage);
        viewerFigure.setAttribute('aria-busy', 'false');
        if (animate) move(viewerFigure, [{ opacity: .45, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], 200);
      };
      try {
        if (typeof preparedImage.decode === 'function') {
          preparedImage.src = link.href;
          preparedImage.decode().then(() => commitViewerImage(true), () => commitViewerImage(preparedImage.naturalWidth > 0));
        } else {
          preparedImage.addEventListener('load', () => commitViewerImage(true), { once: true });
          preparedImage.addEventListener('error', () => commitViewerImage(false), { once: true });
          preparedImage.src = link.href;
          if (preparedImage.complete) commitViewerImage(preparedImage.naturalWidth > 0);
        }
      } catch {
        commitViewerImage(preparedImage.naturalWidth > 0);
      }
      warmViewerNeighbors(index);
    }

    function stepViewerImage(direction) {
      if (!viewer.open || viewerClosing || imageSequence.length < 2) return;
      const baseIndex = requestedImageIndex >= 0 ? requestedImageIndex : imageIndex;
      const nextIndex = (baseIndex + direction + imageSequence.length) % imageSequence.length;
      showViewerImage(nextIndex, { animate: true, announce: true });
    }

    function closeImageViewer() {
      if (!viewer.open || viewerClosing) return;
      viewerClosing = true;
      imageLoadRequest += 1;
      requestedImageIndex = imageIndex;
      viewerFigure.setAttribute('aria-busy', 'false');
      const surface = viewer.querySelector('.viewer-surface');
      if (!surface) {
        viewer.close();
        return;
      }
      const currentStyle = window.getComputedStyle(surface);
      const animation = move(surface, [
        { opacity: currentStyle.opacity, transform: currentStyle.transform },
        { opacity: 0, transform: 'translateY(8px) scale(.99)' },
      ], 210);
      if (!animation) {
        viewer.close();
        return;
      }
      const finishClosing = () => {
        if (viewer.open && viewerClosing) viewer.close();
      };
      animation.addEventListener('finish', finishClosing, { once: true });
      animation.addEventListener('cancel', finishClosing, { once: true });
    }

    document.addEventListener('click', event => {
      const link = event.target.closest('.image-link, .stage-image-link, .screenshot-gallery a');
      if (viewerClosing || !link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = link.querySelector('img');
      if (!source) return;
      event.preventDefault();
      const project = link.closest('.project') || currentProject;
      imageOpener = link;
      imageOpenerFallback = link === stageLink
        ? project?.querySelector('.image-link') || null
        : project && stageLink.dataset.project === project.id ? stageLink : null;
      imageSequence = project
        ? [...project.querySelectorAll('.image-link, .screenshot-gallery a')].filter(candidate => !candidate.closest('[hidden], [inert], details:not([open])'))
        : [];
      let startIndex = imageSequence.findIndex(candidate => candidate.href === link.href);
      if (startIndex < 0) {
        imageSequence.unshift(link);
        startIndex = 0;
      }
      imageIndex = -1;
      requestedImageIndex = -1;
      viewerNavigation.hidden = imageSequence.length < 2;
      const touchInput = window.matchMedia('(any-pointer: coarse)').matches;
      const closeHint = `Press Esc or ${touchInput ? 'tap' : 'click'} outside the image to close.`;
      viewerHelpBase = imageSequence.length > 1
        ? `${touchInput ? 'Swipe or use Previous and Next to browse. Arrow keys also work.' : 'Use the Left and Right Arrow keys or Previous and Next to browse.'} ${closeHint}`
        : closeHint;
      viewerHelp.textContent = viewerHelpBase;
      showViewerImage(startIndex);
      viewerTitle.textContent = project?.querySelector('h3')?.textContent || 'Project image';
      backgroundOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
      move(viewer.querySelector('.viewer-surface'), [{ opacity: .2, transform: 'translateY(12px) scale(.985)' }, { opacity: 1, transform: 'none' }], 300);
    });
    viewerPrevious.addEventListener('click', () => stepViewerImage(-1));
    viewerNext.addEventListener('click', () => stepViewerImage(1));
    viewerFigure.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || !event.isPrimary || !viewer.open || viewerClosing || imageSequence.length < 2) {
        swipeStart = null;
        return;
      }
      swipeStart = { x: event.clientX, y: event.clientY };
    });
    viewerFigure.addEventListener('pointerup', event => {
      if (!swipeStart || event.pointerType !== 'touch' || !event.isPrimary) {
        swipeStart = null;
        return;
      }
      const deltaX = event.clientX - swipeStart.x;
      const deltaY = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(deltaX) < 64 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
      stepViewerImage(deltaX < 0 ? 1 : -1);
    });
    viewerFigure.addEventListener('pointercancel', () => { swipeStart = null; });
    viewer.addEventListener('keydown', event => {
      if (!viewer.open || viewerClosing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (imageSequence.length < 2) return;
      event.preventDefault();
      stepViewerImage(event.key === 'ArrowLeft' ? -1 : 1);
    });
    viewerClose.addEventListener('click', closeImageViewer);
    viewer.addEventListener('cancel', event => {
      event.preventDefault();
      closeImageViewer();
    });
    let pressedBackdrop = false;
    viewer.addEventListener('pointerdown', event => { pressedBackdrop = event.target === viewer; });
    viewer.addEventListener('pointerup', event => {
      if (event.target !== viewer) pressedBackdrop = false;
    });
    viewer.addEventListener('pointercancel', () => { pressedBackdrop = false; });
    viewer.addEventListener('click', event => {
      if (event.target === viewer && pressedBackdrop) closeImageViewer();
      pressedBackdrop = false;
    });
    viewer.addEventListener('close', () => {
      viewerClosing = false;
      imageLoadRequest += 1;
      viewerFigure.setAttribute('aria-busy', 'false');
      swipeStart = null;
      document.body.style.overflow = backgroundOverflow;
      viewerImage.removeAttribute('src');
      imageSequence = [];
      imageIndex = -1;
      requestedImageIndex = -1;
      warmedViewerImages.clear();
      viewerNavigation.hidden = true;
      viewerPosition.textContent = '';
      viewerAnnouncement.textContent = '';
      viewerFigure.classList.remove('viewer-figure-tall');
      viewerFigure.removeAttribute('tabindex');
      viewerHelpBase = 'Press Esc or click outside the image to close.';
      viewerHelp.textContent = viewerHelpBase;
      const canRestoreFocus = element => element?.isConnected
        && element.getClientRects().length > 0
        && !element.closest('[hidden], [inert]');
      const focusTarget = canRestoreFocus(imageOpener)
        ? imageOpener
        : canRestoreFocus(imageOpenerFallback) ? imageOpenerFallback : main;
      focusTarget?.focus({ preventScroll: true });
      imageOpener = null;
      imageOpenerFallback = null;
      scheduleReading();
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const revealTargets = [...document.querySelectorAll('.about-intro, .hero')];
  let revealObserver = null;
  let revealsReady = false;
  const observeReveals = () => {
    if (!revealsReady || !('IntersectionObserver' in window) || reduceMotion.matches) return;
    revealObserver?.disconnect();
    const observer = new IntersectionObserver(entries => {
      if (observer !== revealObserver || reduceMotion.matches) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    revealObserver = observer;
    revealTargets.filter(element => !element.classList.contains('revealed')).forEach(element => observer.observe(element));
  };
  const enableReveals = () => {
    revealsReady = true;
    observeReveals();
  };
  if ('IntersectionObserver' in window) {
    if (intro && !intro.hidden) window.addEventListener('portfolio:intro-complete', enableReveals, { once: true });
    else enableReveals();
  }
  for (const details of document.querySelectorAll('details')) {
    details.addEventListener('toggle', () => {
      scheduleReading();
    });
  }
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) {
      cancelEntryAtmosphereLoad();
      cancelParticleMarkLoad();
      revealObserver?.disconnect();
      revealObserver = null;
      for (const animation of liveAnimations) animation.cancel();
    } else {
      observeReveals();
      loadEntryAtmosphere();
      if (!intro || intro.hidden) loadParticleMark();
    }
  });
})();
