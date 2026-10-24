/* Finite motion for five existing product graphics. No content, data or focus changes. */
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const pmReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pmRunning = new Map();
  const pmSeen = new WeakSet();
  const pmPending = new Set();
  const pmEasing = 'cubic-bezier(.16,.72,.25,1)';
  let pmFrame = 0;

  const pmAllowed = () => !pmReduced.matches && !document.hidden;
  const pmVisible = element => {
    if (!element || element.closest('[hidden]')) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
  };

  function pmStop(element) {
    const current = pmRunning.get(element);
    if (!current) return;
    pmRunning.delete(element);
    current.cancel();
  }

  function pmAnimate(element, frames, options = {}) {
    if (!element || !pmAllowed() || !pmVisible(element)) return;
    pmStop(element);
    const animation = element.animate(frames, {
      duration: 800,
      easing: pmEasing,
      fill: 'none',
      ...options
    });
    pmRunning.set(element, animation);
    const release = () => {
      if (pmRunning.get(element) === animation) pmRunning.delete(element);
    };
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  }

  function pmDraw(path, duration = 1100, delay = 0) {
    if (!path || typeof path.getTotalLength !== 'function') return;
    let length;
    try { length = path.getTotalLength(); } catch { return; }
    if (!Number.isFinite(length) || length <= 0) return;
    pmAnimate(path, [
      { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
      { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 }
    ], { duration, delay, easing: 'cubic-bezier(.3,.5,.2,1)' });
  }

  function pmNutrition(element) {
    // Individual translate composes with the existing handset rotation.
    pmAnimate(element.querySelector('.cr-plan-phone'), [
      { translate: '0 14px' }, { translate: '0 0' }
    ], { duration: 900 });
    pmAnimate(element.querySelector('.cr-log-phone'), [
      { translate: '0 25px' }, { translate: '0 0' }
    ], { duration: 1100, delay: 70 });
  }

  function pmVault(element) {
    pmAnimate(element.querySelector('.ch-file-back'), [
      { translate: '-7px 8px', rotate: '-1.5deg' },
      { translate: '0 0', rotate: '0deg' }
    ], { duration: 900 });
    pmAnimate(element.querySelector('.ch-file-front'), [
      { translate: '5px 18px' }, { translate: '0 0' }
    ], { duration: 1000, delay: 40 });
  }

  function pmInsights(element) {
    // Only graphical marks move. Labels, missing-data gaps and source notes stay fixed.
    element.querySelectorAll('.ch-sleep-bars i').forEach((bar, index) => {
      pmAnimate(bar, [
        { clipPath: 'inset(17% 0 0 0 round 5px 5px 0 0)' },
        { clipPath: 'inset(0% 0 0 0 round 5px 5px 0 0)' }
      ], { duration: 700, delay: index * 45 });
    });
    element.querySelectorAll('.ch-trend-svg > path[stroke-width="3"]').forEach(path => pmDraw(path));
    element.querySelectorAll('.ch-week-activity > div:not(.ch-unlogged) > i').forEach((mark, index) => {
      pmAnimate(mark, [
        { clipPath: 'inset(12% 0 0 0 round 5px)' },
        { clipPath: 'inset(0% 0 0 0 round 5px)' }
      ], { duration: 650, delay: index * 45 });
    });
  }

  function pmCare(element) {
    pmDraw(element.querySelector('.cc-flow-arrow path'), 800, 160);
    pmAnimate(element.querySelector('.cc-reviewed-mark'), [
      { translate: '-5px -3px' }, { translate: '0 0' }
    ], { duration: 750, delay: 450 });
    element.querySelectorAll('.cc-meal-row i').forEach((mark, index) => {
      pmAnimate(mark, [
        { opacity: .55 }, { opacity: 1 }
      ], { duration: 450, delay: index * 100 });
    });
  }

  function pmBlueprint(element) {
    pmAnimate(element.querySelector('.cc-blueprint-page'), [
      { translate: '8px 2px', rotate: '.7deg' },
      { translate: '0 0', rotate: '0deg' }
    ], { duration: 1050 });
  }

  const pmGraphics = [
    ['.cr-food-art', pmNutrition],
    ['.ch-file-shelf', pmVault],
    ['.ch-insight-panel', pmInsights],
    ['.cc-continuity', pmCare],
    ['.cc-blueprint-preview', pmBlueprint]
  ];
  const pmEffects = new WeakMap();
  const pmObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || pmSeen.has(entry.target)) continue;
      if (!pmAllowed()) {
        pmPending.add(entry.target);
        continue;
      }
      pmSeen.add(entry.target);
      pmObserver.unobserve(entry.target);
      pmEffects.get(entry.target)?.(entry.target);
    }
  }, { threshold: .22 });

  pmGraphics.forEach(([selector, effect]) => {
    document.querySelectorAll(selector).forEach(element => {
      pmEffects.set(element, effect);
      pmObserver.observe(element);
    });
  });

  function pmResumePending() {
    if (!pmAllowed()) return;
    for (const element of pmPending) {
      pmPending.delete(element);
      if (pmSeen.has(element) || !pmVisible(element)) continue;
      pmSeen.add(element);
      pmObserver.unobserve(element);
      pmEffects.get(element)?.(element);
    }
  }

  function pmCancelAll() {
    if (pmFrame) cancelAnimationFrame(pmFrame);
    pmFrame = 0;
    for (const element of pmRunning.keys()) pmStop(element);
  }

  // Existing tabs retain their own behavior. Run after their click/key handlers settle.
  function pmOnTab(event) {
    const button = event.target.closest?.('[data-ch-tab]');
    if (!button || !pmAllowed()) return;
    if (event.type === 'keydown' && !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const group = button.closest('[data-ch-tabs]');
    if (!group) return;
    if (pmFrame) cancelAnimationFrame(pmFrame);
    pmFrame = requestAnimationFrame(() => {
      pmFrame = 0;
      if (!pmAllowed()) return;
      for (const [element] of pmRunning) {
        if (group.contains(element) && element.closest('[hidden]')) pmStop(element);
      }
      const panel = group.querySelector('[data-ch-panel]:not([hidden])');
      if (!pmVisible(panel)) return;
      const graphic = panel.matches('.ch-insight-panel') ? panel : panel.querySelector('.ch-file-shelf');
      if (!graphic) return;
      pmSeen.add(graphic);
      pmObserver.unobserve(graphic);
      pmEffects.get(graphic)?.(graphic);
    });
  }
  document.addEventListener('click', pmOnTab);
  document.addEventListener('keydown', pmOnTab);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pmCancelAll();
    else pmResumePending();
  });
  const pmMotionChange = () => {
    if (pmReduced.matches) pmCancelAll();
    else pmResumePending();
  };
  if (pmReduced.addEventListener) pmReduced.addEventListener('change', pmMotionChange);
  else pmReduced.addListener(pmMotionChange);
  window.addEventListener('pagehide', () => {
    pmCancelAll();
    pmObserver.disconnect();
  }, { once: true });
})();
