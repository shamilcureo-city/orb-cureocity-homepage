(() => {
  const root = document.querySelector('[data-cc-routes]');
  if (!root) return;
  const controls = root.querySelector('.cc-route-controls');
  const buttons = [...root.querySelectorAll('[data-cc-route]')];
  const panels = [...root.querySelectorAll('[data-cc-panel]')];
  const panelContainer = root.querySelector('.cc-route-panels');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  controls.setAttribute('role', 'tablist');
  buttons.forEach((button, index) => {
    button.id = `cc-care-tab-${button.dataset.ccRoute}`;
    button.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', button.id);
    panels[index].tabIndex = 0;
  });
  function show(index, animate = false) {
    buttons.forEach((button, current) => {
      const active = current === index;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      panels[current].hidden = !active;
    });
    panelContainer.classList.remove('cc-panel-change');
    if (animate && !reduced.matches && !document.hidden) {
      requestAnimationFrame(() => panelContainer.classList.add('cc-panel-change'));
    }
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => show(index, true));
    button.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].focus();
      show(next, true);
    });
  });
  panelContainer.addEventListener('animationend', () => panelContainer.classList.remove('cc-panel-change'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) panelContainer.classList.remove('cc-panel-change');
  });
  show(0);
})();
