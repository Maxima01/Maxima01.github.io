(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1100px) and (min-height: 760px)');
  const projects = [...document.querySelectorAll('.project[data-status]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const previewLinks = [...document.querySelectorAll('[data-preview]')];
  const stage = document.querySelector('#context-panel');
  const stageScroll = document.querySelector('#stage-scroll');
  const stageImage = document.querySelector('#stage-image');
  const stageLink = document.querySelector('#stage-link');
  const stageTitle = document.querySelector('#stage-title');
  const stageKind = document.querySelector('#stage-kind');
  const stageCaption = document.querySelector('#stage-caption');
  const closePanel = document.querySelector('#panel-close');
  const reopenPanel = document.querySelector('#panel-reopen');
  const views = [...document.querySelectorAll('[data-panel]')];
  const profile = document.querySelector('#profile-content');
  const profileHome = document.querySelector('#profile-details');
  const map = document.querySelector('#development-map');
  const mapHome = document.querySelector('#approach-map-details');
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
  try { panelHidden = sessionStorage.getItem('portfolio-panel-hidden') === 'true'; } catch { /* Storage is optional. */ }

  function move(element, keyframes, duration = 360, delay = 0) {
    if (!element || reduceMotion.matches || !element.animate) return;
    for (const animation of element.getAnimations()) animation.cancel();
    const animation = element.animate(keyframes, {
      duration, delay, easing: 'cubic-bezier(.16, 1, .3, 1)',
    });
    liveAnimations.add(animation);
    const release = () => liveAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  }

  // Each project remains the source of truth for its image, status, and caption.
  async function showProject(project) {
    if (!project || project.hidden || project === requestedProject) return;
    requestedProject = project;
    const request = ++previewRequest;
    const source = project.querySelector('.project-visual img');
    const sourceLink = project.querySelector('.image-link');
    if (!source || !sourceLink) return;
    const nextImage = new Image();
    nextImage.src = source.src;
    try { await nextImage.decode(); }
    catch {
      if (request === previewRequest) requestedProject = currentProject;
      return;
    }
    if (request !== previewRequest || project.hidden) return;
    currentProject = project;
    stageImage.src = source.src;
    stageImage.alt = source.alt;
    stageLink.href = sourceLink.href;
    stageLink.setAttribute('aria-label', sourceLink.getAttribute('aria-label'));
    stageTitle.textContent = project.querySelector('h3').textContent;
    const status = project.querySelector('.project-status');
    stageKind.textContent = status.firstChild.textContent.trim() + ' · ' + status.querySelector('span').textContent;
    stageCaption.textContent = project.querySelector('.project-visual figcaption').textContent;
    for (const link of previewLinks) {
      if (link.dataset.preview === project.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    if (root.classList.contains('panel-open') && currentPanel === 'work') {
      move(stageImage, [{ opacity: .25, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], 450);
      move(stageTitle, [{ opacity: .3 }, { opacity: 1 }], 300);
      move(stageCaption, [{ opacity: .3 }, { opacity: 1 }], 300);
    }
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
    if (!root.classList.contains('panel-open')) return;
    move(view, [{ opacity: .2, transform: 'translateX(-18px)' }, { opacity: 1, transform: 'none' }], 420);
    if (name === 'approach') {
      map.querySelectorAll('.thought-path > li').forEach((step, index) => {
        move(step, [{ opacity: .25, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], 420, index * 45);
      });
    }
  }

  // One reading line handles short sections, long articles, and upward scrolling.
  function syncReading() {
    scrollFrame = 0;
    if (layoutChanging) return;
    if (document.querySelector('#image-viewer')?.open) return;
    const line = window.innerHeight * .28;
    let active = readingTargets[0];
    for (const target of readingTargets) {
      if (!target.hidden && target.getBoundingClientRect().top <= line) active = target;
    }
    // A short footer may never reach the reading line, even at the page bottom.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = readingTargets[readingTargets.length - 1];
    }
    readingTarget = active;
    const panel = active.matches('.project') ? 'work' : active.id;
    showPanel(panel);
    if (panel === 'work') showProject(active.matches('.project') ? active : projects.find(project => !project.hidden));
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
    const open = desktop.matches && !panelHidden;
    root.classList.toggle('panel-open', open);
    stage.inert = !open;
    reopenPanel.hidden = !desktop.matches || open;
    closePanel.setAttribute('aria-expanded', String(open));
    reopenPanel.setAttribute('aria-expanded', String(open));
    // Move the same accessible content; no duplicate IDs or separate mobile copies.
    (open ? views.find(view => view.dataset.panel === 'about') : profileHome).append(profile);
    (open ? views.find(view => view.dataset.panel === 'approach') : mapHome).append(map);
    syncReading();
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
  window.addEventListener('hashchange', scheduleReading);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleReading).observe(document.querySelector('.reading-stage'));
  syncLayout();

  const filterGroup = document.querySelector('.filters');
  if (filterGroup && filterButtons.length) {
    filterGroup.hidden = false;
    for (const button of filterButtons) {
      const filter = button.dataset.filter;
      const matches = project => filter === 'all' || project.dataset.status.split(' ').includes(filter);
      button.querySelector('span').textContent = String(projects.filter(matches).length);
      button.addEventListener('click', () => {
        for (const project of projects) project.hidden = !matches(project);
        for (const option of filterButtons) option.setAttribute('aria-pressed', String(option === button));
        for (const link of previewLinks) link.hidden = document.getElementById(link.dataset.preview).hidden;
        const visible = projects.filter(project => !project.hidden);
        document.querySelector('#filter-status').textContent = 'Showing ' + visible.length + (visible.length === 1 ? ' project.' : ' projects.');
        syncReading();
        if (visible[0]) move(visible[0].querySelector('.project-top'), [{ opacity: .4 }, { opacity: 1 }], 240);
      });
    }
  }

  // Keep the image on this page, with native focus containment and Escape support.
  const viewer = document.querySelector('#image-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerCaption = document.querySelector('#viewer-caption');
  const viewerTitle = document.querySelector('#viewer-title');
  const viewerClose = document.querySelector('#viewer-close');
  let imageOpener = null;
  let backgroundOverflow = '';
  if (viewer && typeof viewer.showModal === 'function') {
    document.addEventListener('click', event => {
      const link = event.target.closest('.image-link, .stage-image-link, .screenshot-gallery a');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = link.querySelector('img');
      if (!source) return;
      event.preventDefault();
      imageOpener = link;
      viewerImage.src = link.href;
      viewerImage.alt = source.alt;
      const project = link.closest('.project') || currentProject;
      viewerTitle.textContent = project?.querySelector('h3')?.textContent || 'Project image';
      viewerCaption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
      backgroundOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
      move(viewer.querySelector('.viewer-surface'), [{ opacity: .2, transform: 'translateY(12px) scale(.985)' }, { opacity: 1, transform: 'none' }], 300);
    });
    viewerClose.addEventListener('click', () => viewer.close());
    let pressedBackdrop = false;
    viewer.addEventListener('pointerdown', event => { pressedBackdrop = event.target === viewer; });
    viewer.addEventListener('click', event => {
      if (event.target === viewer && pressedBackdrop) viewer.close();
      pressedBackdrop = false;
    });
    viewer.addEventListener('close', () => {
      document.body.style.overflow = backgroundOverflow;
      viewerImage.removeAttribute('src');
      imageOpener?.focus({ preventScroll: true });
      scheduleReading();
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    document.querySelectorAll('.hero, .section-heading h2, .project-top, .project-visual, .approach-heading h2, .about-lead, .contact-top').forEach(element => observer.observe(element));
  }
  for (const details of document.querySelectorAll('details')) {
    details.addEventListener('toggle', () => {
      if (details.open) move(details.querySelector('.details-content, .profile-content, .development-map'), [{ opacity: .4 }, { opacity: 1 }], 240);
      scheduleReading();
    });
  }
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) for (const animation of liveAnimations) animation.cancel();
  });
})();
