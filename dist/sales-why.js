(() => {
  const demo = document.querySelector('[data-why-demo]');
  if (!demo) return;
  const tabs = [...demo.querySelectorAll('[data-why-tab]')];
  const panels = [...demo.querySelectorAll('[data-why-panel]')];
  const list = demo.querySelector('.why-tabs');
  if (!list || tabs.length !== panels.length || !tabs.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  let selected = 0;
  const stop = () => {
    animations.forEach(animation => animation.cancel());
    animations = [];
  };
  const select = (index, focus = false, motion = false) => {
    if (!panels[index]) return;
    const changed = selected !== index;
    selected = index;
    stop();
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
    if (changed && motion && !reducedMotion.matches && !document.hidden) {
      panels[index].querySelectorAll('.why-scenario-copy,.why-plan-sheet').forEach((element, i) => {
        if (typeof element.animate !== 'function') return;
        animations.push(element.animate(
          [{ opacity: .35, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 300, delay: i * 35, easing: 'cubic-bezier(.2,.7,.2,1)' }
        ));
      });
    }
  };
  list.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index, false, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, true, true);
    });
  });
  select(0);
  demo.classList.add('why-enhanced');
  reducedMotion.addEventListener('change', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
