// Jake's Imagination Control — no dependencies.
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);

  // Must match the scene breakpoints in style.css
  const scenes = {
    bmo: matchMedia('(1024px < width <= 1200px)'),
    stretch: matchMedia('(750px < width <= 1024px)'),
  };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = matchMedia('(hover: hover)');

  /* ---------- Scene 1: boop the nose ---------- */
  const instruction = $('[data-instruction]');
  function boop() {
    instruction.textContent = 'SQUEEZE THE BROWSER WINDOW';
  }

  /* ---------- Scene 2: knife rain ---------- */
  const rain = $('[data-rain]');
  const status = $('[data-status]');

  function rainOn() {
    const sources = rain.querySelectorAll('source[data-src]');
    if (sources.length) {               // load the video only the first time it's needed
      rain.poster = rain.dataset.poster;
      sources.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); });
      rain.load();
    }
    document.body.classList.add('is-raining');
    rain.play().catch(() => {});
    status.textContent = 'KEEP SQUEEZING';
  }

  function rainOff() {
    document.body.classList.remove('is-raining');
    rain.pause();
    status.textContent = '';
  }

  // Leaving the BMO scene turns the rain off (same as the original).
  scenes.bmo.addEventListener('change', (e) => { if (!e.matches) rainOff(); });

  /* ---------- Scene 2: YouTube facade (loads the player only on click) ---------- */
  const screen = $('[data-video]');
  function loadVideo() {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${screen.dataset.video}?autoplay=1`;
    iframe.title = 'Adventure Time video';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    screen.replaceChildren(iframe);
    iframe.focus();
  }

  /* ---------- Scene 2: the big red button (non-blocking warning) ---------- */
  const toast = $('[data-toast]');
  let toastTimer;
  function warn() {
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
  }

  /* ---------- Scene 3: stretch chaos loop ---------- */
  const torso = $('[data-stretch]');
  let chaos = null;

  function stretchOn() {
    if (chaos) return;
    const calm = reducedMotion.matches;
    // Same sequence as the original jQuery chain, but on the Web Animations API
    // so it can be paused/cancelled cleanly.
    chaos = torso.animate(
      [
        { width: '70vw',  height: '30vw',  opacity: 1 },
        { width: '70vw',  height: '500vw', opacity: calm ? 1 : 0.4 },
        { width: '40vw',  height: '500vw', opacity: calm ? 1 : 0.9 },
        { width: '700vw', height: '500vw', opacity: calm ? 1 : 0.3 },
        { width: '700vw', height: '20vw',  opacity: calm ? 1 : 0.9 },
        { width: '70vw',  height: '30vw',  opacity: 1 },
      ],
      { duration: calm ? 6000 : 1000, iterations: Infinity, easing: 'ease-in-out' }
    );
    if (!scenes.stretch.matches) chaos.pause();
  }

  function stretchOff() {
    if (chaos) { chaos.cancel(); chaos = null; }
    torso.classList.remove('is-open');
  }

  // Don't burn CPU animating a scene nobody can see.
  scenes.stretch.addEventListener('change', (e) => {
    if (!chaos) return;
    e.matches ? chaos.play() : chaos.pause();
  });

  // Touch screens can't hover, so tap to stretch instead.
  torso.addEventListener('click', (e) => {
    if (canHover.matches || e.target.closest('audio')) return;
    torso.classList.toggle('is-open');
  });

  /* ---------- Wire up actions ---------- */
  const actions = {
    'boop': boop,
    'rain-on': rainOn,
    'rain-off': rainOff,
    'stretch-on': stretchOn,
    'stretch-off': stretchOff,
    'warn': warn,
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.bmo__play')) return loadVideo();
    const el = e.target.closest('[data-action]');
    if (el) actions[el.dataset.action]?.();
  });

  // The red button also fires on hover / keyboard, like the original.
  const red = $('.bmo__red');
  red.addEventListener('pointerenter', warn);
  red.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); warn(); }
  });
})();
