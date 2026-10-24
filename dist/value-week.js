(() => {
  'use strict';
  const section = document.querySelector('.vw-section');
  if (!section) return;
  const tablist = section.querySelector('[data-vw-tabs]');
  const tabs = [...section.querySelectorAll('[data-vw-tab]')];
  const panels = [...section.querySelectorAll('[data-vw-panel]')];
  if (!tablist || tabs.length !== panels.length || !tabs.length) return;
  let animation;
  const motionAllowed = () => !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function activate(key, focus = false, animate = true) {
    const selected = tabs.find(tab => tab.dataset.vwTab === key);
    const panel = panels.find(item => item.dataset.vwPanel === key);
    if (!selected || !panel) return;
    animation?.cancel();
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(item => { item.hidden = item !== panel; });
    if (focus) selected.focus();
    if (animate && motionAllowed() && typeof panel.animate === 'function') {
      animation = panel.animate([{ opacity: .35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
    }
  }
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    tab.addEventListener('click', event => { event.preventDefault(); activate(tab.dataset.vwTab); });
    tab.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); activate(tab.dataset.vwTab); return;
      }
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); activate(tabs[next].dataset.vwTab, true);
    });
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  section.querySelectorAll('[data-vw-go]').forEach(button => {
    button.addEventListener('click', () => activate(button.dataset.vwGo, true));
  });
  const initialKey = panels.find(panel => `#${panel.id}` === location.hash)?.dataset.vwPanel || 'plan';
  section.classList.add('vw-enhanced');
  activate(initialKey, false, false);
  const swap = section.querySelector('[data-vw-swap]');
  const title = section.querySelector('[data-vw-meal-title]');
  const description = section.querySelector('[data-vw-meal-description]');
  const status = section.querySelector('[data-vw-swap-status]');
  if (swap && title && description && status) {
    swap.addEventListener('click', () => {
      const selected = swap.getAttribute('aria-pressed') !== 'true';
      swap.setAttribute('aria-pressed', String(selected));
      title.textContent = selected ? 'Order roti, paneer & vegetables' : 'Roti, paneer & vegetables';
      description.textContent = selected ? 'A familiar lunch, without the preparation. Keep your meal preferences in view when ordering.' : 'Planned to pack. Today, you need an option you can order.';
      swap.firstChild.textContent = selected ? 'Return to the packed lunch option ' : 'Choose the office lunch option ';
      status.textContent = selected ? 'Lunch choice updated in this example. Nothing has been logged as eaten.' : '';
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) animation?.cancel(); });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => { if (event.matches) animation?.cancel(); });
})();
