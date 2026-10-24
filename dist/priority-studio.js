/* Animate only scene layers after the existing priority tabs select their panel. */
(() => {
  const root = document.querySelector('.ps-section');
  if (!root || !Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const seen = new WeakSet();
  const panels = [...root.querySelectorAll('[data-need-panel]')];
  let frame = 0;
  const allowed = () => !reduced.matches && !document.hidden;
  const cancel = () => {
    for (const animation of running) animation.cancel();
    running.clear();
  };
  function animate(element, frames, timing) {
    if (!element || !allowed()) return;
    const animation = element.animate(frames, {duration: 850, easing: 'cubic-bezier(.16,.75,.25,1)', fill: 'none', ...timing});
    running.add(animation);
    animation.addEventListener('finish', () => running.delete(animation), {once:true});
    animation.addEventListener('cancel', () => running.delete(animation), {once:true});
  }
  function show(panel) {
    if (!allowed() || !panel || panel.hidden) return;
    const scene = panel.querySelector('.ps-scene');
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight) return;
    seen.add(panel);
    // Individual translate preserves each artwork's authored rotation and position.
    scene.querySelectorAll('.ps-motion').forEach((layer, index) => {
      animate(layer, [{translate:`${index % 2 ? 9 : -7}px ${8 + index * 3}px`}, {translate:'0 0'}], {duration:850 + index * 90, delay:index * 50});
    });
    const scan = scene.querySelector('.ps-fitness-scan');
    if (scan) animate(scan, [{translate:'0 -65px',opacity:0},{translate:'0 -40px',opacity:.7,offset:.2},{translate:'0 70px',opacity:.7,offset:.8},{translate:'0 95px',opacity:0}], {duration:1250,delay:100,easing:'ease-in-out'});
    scene.querySelectorAll('.ps-path').forEach(path => {
      let length;
      try { length = path.getTotalLength(); } catch { return; }
      if (!Number.isFinite(length) || length <= 0) return;
      animate(path, [{strokeDasharray:`${length} ${length}`,strokeDashoffset:length},{strokeDasharray:`${length} ${length}`,strokeDashoffset:0}], {duration:1150,delay:150,easing:'ease-in-out'});
    });
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || seen.has(entry.target) || entry.target.hidden) continue;
      show(entry.target);
    }
  }, {threshold:.2});
  panels.forEach(panel => observer.observe(panel));
  // complete.js remains the sole owner of keyboard navigation, ARIA and selection.
  const selection = new MutationObserver(() => {
    cancel();
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      show(panels.find(panel => !panel.hidden));
    });
  });
  panels.forEach(panel => selection.observe(panel, {attributes:true,attributeFilter:['hidden']}));
  const suspend = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    cancel();
  };
  document.addEventListener('visibilitychange', () => {if (document.hidden) suspend();});
  reduced.addEventListener?.('change', () => {if (reduced.matches) suspend();});
  window.addEventListener('pagehide', () => {suspend();observer.disconnect();selection.disconnect();}, {once:true});
})();
