(() => {
  const root = document.querySelector('[data-co-console]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-co-tab]')];
  const panels = [...root.querySelectorAll('[data-co-panel]')];
  const sources = [...root.querySelectorAll('[data-co-source]')];
  if (!tabs.length || tabs.length !== panels.length) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const packet = root.querySelector('.co-packet');
  let animations = [];
  let frame = 0;
  let activeKey = 'cgm';
  const stopMotion = () => {
    animations.forEach(animation => animation.cancel());
    animations = [];
    cancelAnimationFrame(frame);
    frame = 0;
    if (packet) packet.setAttribute('opacity', '0');
  };
  const traceConnection = key => {
    stopMotion();
    if (reduceMotion.matches || document.hidden) return;
    const traces = [...root.querySelectorAll(`[data-co-trace="${key}"]`)];
    traces.forEach((path, index) => {
      const length = path.getTotalLength();
      if (path.animate) animations.push(path.animate([
        {strokeDasharray: `${length}`, strokeDashoffset: length, opacity: .95},
        {strokeDasharray: `${length}`, strokeDashoffset: 0, opacity: .95, offset: .7},
        {strokeDasharray: `${length}`, strokeDashoffset: 0, opacity: 0}
      ], {duration: 1050, delay: index * 65, easing: 'cubic-bezier(.25,.7,.2,1)'}));
    });
    if (key === 'cgm') {
      const curve = root.querySelector('.co-glucose-line');
      if (curve?.animate) {
        const length = curve.getTotalLength();
        animations.push(curve.animate([
          {strokeDasharray: `${length} ${length}`, strokeDashoffset: length},
          {strokeDasharray: `${length} ${length}`, strokeDashoffset: 0}
        ], {duration: 1200, easing: 'cubic-bezier(.3,.5,.2,1)'}));
      }
    }
    const path = traces[0];
    if (!path || !packet) return;
    const length = path.getTotalLength();
    const start = performance.now();
    const travel = now => {
      if (document.hidden || reduceMotion.matches) { stopMotion(); return; }
      const progress = Math.min((now - start) / 900, 1);
      const point = path.getPointAtLength(length * progress);
      packet.setAttribute('cx', String(point.x));
      packet.setAttribute('cy', String(point.y));
      packet.setAttribute('opacity', String(Math.min(progress * 6, (1 - progress) * 7, 1)));
      if (progress < 1) frame = requestAnimationFrame(travel);
      else { frame = 0; packet.setAttribute('opacity', '0'); }
    };
    frame = requestAnimationFrame(travel);
  };
  const activate = (key, focus = false, animate = true) => {
    if (!tabs.some(tab => tab.dataset.coTab === key)) return;
    activeKey = key;
    tabs.forEach(tab => {
      const selected = tab.dataset.coTab === key;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels.find(item => item.dataset.coPanel === tab.dataset.coTab);
      panel.hidden = !selected;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      if (selected && focus) tab.focus();
    });
    sources.forEach(source => {
      const selected = source.dataset.coSource === key;
      source.classList.toggle('co-selected', selected);
      source.setAttribute('aria-pressed', String(selected));
    });
    root.querySelectorAll('[data-co-line]').forEach(line => line.classList.toggle('co-selected', line.dataset.coLine === key));
    if (animate) traceConnection(key);
  };
  tabs[0].parentElement.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.coTab));
    tab.addEventListener('keydown', event => {
      const next = ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % tabs.length : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      activate(tabs[next].dataset.coTab, true);
    });
  });
  sources.forEach(source => source.addEventListener('click', () => activate(source.dataset.coSource)));
  root.classList.add('co-enhanced');
  activate('cgm', false, false);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || document.hidden) return;
      traceConnection(activeKey);
      observer.disconnect();
    }, {threshold: .35});
    observer.observe(root);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMotion(); });
  reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) stopMotion(); });
})();
