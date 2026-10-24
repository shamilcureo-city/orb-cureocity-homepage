/* One finite assembly, composing with the resting artwork rotations. */
(() => {
  const canvas = document.querySelector('.fa-canvas');
  if (!canvas || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  let played = false;
  let visible = false;
  const cancel = () => { for (const animation of running) animation.cancel(); running.clear(); };
  const play = () => {
    if (played || !visible || reduced.matches || document.hidden) return;
    played = true;
    const layers = [
      ['.fa-day', '0 20px', 0],
      ['.fa-meal', '16px 12px', 80],
      ['.fa-vault', '-12px 12px', 140],
      ['.fa-training', '-10px 8px', 210]
    ];
    layers.forEach(([selector, start, delay]) => {
      const element = canvas.querySelector(selector);
      if (!element) return;
      const animation = element.animate([{ translate: start }, { translate: '0 0' }], {
        duration: 1050, delay, easing: 'cubic-bezier(.16,.7,.22,1)', fill: 'none'
      });
      running.add(animation);
      animation.addEventListener('finish', () => running.delete(animation), { once: true });
      animation.addEventListener('cancel', () => running.delete(animation), { once: true });
    });
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) cancel(); else play();
  }, { threshold: .15 });
  observer.observe(canvas);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); else play(); });
  const onMotionChange = () => { if (reduced.matches) cancel(); else play(); };
  if (reduced.addEventListener) reduced.addEventListener('change', onMotionChange);
  else reduced.addListener(onMotionChange);
  window.addEventListener('pagehide', () => { cancel(); observer.disconnect(); }, { once: true });
})();
