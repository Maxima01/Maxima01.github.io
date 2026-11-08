(() => {
  'use strict';

  const filterGroup = document.querySelector('.filters');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project[data-status]')];
  const filterStatus = document.querySelector('#filter-status');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1100px) and (min-height: 760px)');
  const stage = document.querySelector('.preview-stage');
  const stageImage = document.querySelector('#stage-image');
  const stageLink = document.querySelector('#stage-link');
  const stageTitle = document.querySelector('#stage-title');
  const stageKind = document.querySelector('#stage-kind');
  const stageCaption = document.querySelector('#stage-caption');
  const previewLinks = [...document.querySelectorAll('[data-preview]')];
  const liveAnimations = new Set();
  let currentProject = projects[0];
  let previewRequest = 0;

  function move(element, keyframes, duration = 500) {
    if (!element || reduceMotion.matches || !element.animate) return;
    const animation = element.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(.16, 1, .3, 1)',
    });
    liveAnimations.add(animation);
    const release = () => liveAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  }

  // Read the real project content, so the preview never has its own stale copy.
  async function showProject(project) {
    if (!stageImage || !project || project.hidden) return;
    const request = ++previewRequest;
    if (project === currentProject) return;
    const source = project.querySelector('.project-visual img');
    const sourceLink = project.querySelector('.image-link');
    if (!source || !sourceLink) return;
    const nextImage = new Image();
    nextImage.src = source.src;
    try { await nextImage.decode(); }
    catch { return; } // Keep the current, usable preview if the next file cannot load.
    if (request !== previewRequest || project.hidden) return;

    for (const animation of liveAnimations) animation.cancel();
    currentProject = project;
    stageImage.src = source.src;
    stageImage.alt = source.alt;
    stageLink.href = sourceLink.href;
    stageLink.setAttribute('aria-label', sourceLink.getAttribute('aria-label'));
    stageTitle.textContent = project.querySelector('h3').textContent;
    const status = project.querySelector('.project-status');
    stageKind.textContent = `${status.firstChild.textContent.trim()} · ${status.querySelector('span').textContent}`;
    stageCaption.textContent = project.querySelector('.project-visual figcaption').textContent;
    for (const link of previewLinks) {
      if (link.dataset.preview === project.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    if (desktop.matches) {
      move(stageImage, [{ opacity: .35, transform: 'translateY(14px) scale(1.025)' }, { opacity: 1, transform: 'none' }], 700);
      move(stageTitle, [{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }]);
      move(stageCaption, [{ opacity: .4 }, { opacity: 1 }], 400);
    }
  }

  function applyFilter(filter, selectedButton) {
    let count = 0;
    for (const project of projects) {
      const matches = filter === 'all' || project.dataset.status.split(' ').includes(filter);
      project.hidden = !matches;
      if (matches) count += 1;
    }
    for (const option of filterButtons) option.setAttribute('aria-pressed', String(option === selectedButton));
    for (const link of previewLinks) link.hidden = Boolean(document.getElementById(link.dataset.preview)?.hidden);
    if (filterStatus) filterStatus.textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}.`;
    const firstVisible = projects.find(project => !project.hidden);
    if (currentProject?.hidden) showProject(firstVisible);
    if (firstVisible) move(firstVisible.querySelector('.project-top'), [{ opacity: .4, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], 350);
  }

  if (filterGroup && filterButtons.length && projects.length) {
    filterGroup.hidden = false;
    for (const button of filterButtons) {
      const count = projects.filter(project => button.dataset.filter === 'all' || project.dataset.status.split(' ').includes(button.dataset.filter)).length;
      const countLabel = button.querySelector('span');
      if (countLabel) countLabel.textContent = String(count);
      button.addEventListener('click', () => applyFilter(button.dataset.filter, button));
    }
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // The pinned stage is an enhancement. Mobile and no-script reading use inline images.
  if (stage && stageImage && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('has-preview');
    const projectObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !entry.target.hidden) showProject(entry.target);
      }
    }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    for (const project of projects) projectObserver.observe(project);
    for (const link of previewLinks) {
      link.addEventListener('click', () => showProject(document.getElementById(link.dataset.preview)));
    }
    if (desktop.matches) move(stageImage, [{ opacity: .55, transform: 'translateY(20px) scale(.98)' }, { opacity: 1, transform: 'none' }], 850);
  }

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.site-header nav a')];
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navLinks) {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      }
    }, { rootMargin: '-5% 0px -70% 0px', threshold: 0 });
    for (const link of navLinks) {
      const section = document.querySelector(link.hash);
      if (section) sectionObserver.observe(section);
    }
  }

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    const revealTargets = document.querySelectorAll('.hero, .section-heading h2, .section-heading > p, .project-top, .project-visual, .project-copy > p, .highlights, .tech-stack, .project-links, .screenshot-gallery figure, .approach-heading h2, .approach-heading > p, .approach-statement, .process-list > div, .about-lead, .about-actions, .contact-top, .contact-links');
    revealTargets.forEach((element, index) => {
      element.style.setProperty('--delay', `${index % 3 * 70}ms`);
      observer.observe(element);
    });
  }

  for (const details of document.querySelectorAll('details')) {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      move(details.querySelector('.details-content, .skills-list'), [{ opacity: .4, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], 280);
    });
  }

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) for (const animation of liveAnimations) animation.cancel();
  });
})();
