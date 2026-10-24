(() => {
  const section = document.querySelector('.journey-demo-section');
  const tablist = section?.querySelector('[data-journey-tabs]');
  if (!section || !tablist) return;
  const tabs = [...tablist.querySelectorAll('[data-journey-tab]')];
  const panels = [...section.querySelectorAll('[data-journey-panel]')];
  if (!tabs.length || tabs.length !== panels.length) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeAnimation;
  const stopAnimation = () => { activeAnimation?.cancel(); activeAnimation = null; };
  function selectTab(key, focus = false, animate = true) {
    const selected = tabs.find(tab => tab.dataset.journeyTab === key);
    const panel = panels.find(item => item.dataset.journeyPanel === key);
    if (!selected || !panel) return;
    stopAnimation();
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(item => { item.hidden = item !== panel; });
    if (focus) selected.focus({ preventScroll: true });
    if (animate && !reducedMotion.matches && !document.hidden && typeof panel.animate === 'function') {
      activeAnimation = panel.animate([{ opacity: 0.35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, easing: 'ease-out' });
    }
  }
  tablist.setAttribute('role', 'tablist');
  tabs.forEach(tab => {
    const key = tab.dataset.journeyTab;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `journey-panel-${key}`);
    tab.addEventListener('click', event => { event.preventDefault(); selectTab(key); });
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab);
      let next = null;
      if (event.key === ' ') { event.preventDefault(); selectTab(key); return; }
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) { event.preventDefault(); selectTab(tabs[next].dataset.journeyTab, true); }
    });
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `journey-tab-${panel.dataset.journeyPanel}`);
    panel.tabIndex = 0;
  });
  section.querySelectorAll('[data-journey-go]').forEach(button => {
    button.addEventListener('click', () => selectTab(button.dataset.journeyGo, true));
  });
  section.classList.add('journey-enhanced');
  const hashKey = location.hash.replace('#journey-panel-', '');
  selectTab(tabs.some(tab => tab.dataset.journeyTab === hashKey) ? hashKey : tabs[0].dataset.journeyTab, false, false);
  window.addEventListener('hashchange', () => {
    const key = location.hash.replace('#journey-panel-', '');
    if (tabs.some(tab => tab.dataset.journeyTab === key)) selectTab(key, false);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAnimation(); });
  reducedMotion.addEventListener('change', event => { if (event.matches) stopAnimation(); });
})();
