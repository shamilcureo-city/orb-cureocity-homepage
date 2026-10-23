(() => {
  const demo = document.querySelector('[data-day-demo]');
  if (!demo) return;
  const tabs = [...demo.querySelectorAll('[data-day-tab]')];
  const panels = [...demo.querySelectorAll('[data-day-panel]')];
  const tablist = demo.querySelector('.day-tabs');
  if (!tabs.length || tabs.length !== panels.length || !tablist) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeAnimations = [];
  let selectedIndex = 0;

  const stopAnimation = () => {
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations = [];
  };

  const selectMoment = (index, { focus = false, animate = false } = {}) => {
    if (!panels[index]) return;
    const changed = selectedIndex !== index;
    selectedIndex = index;
    stopAnimation();
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].hidden = !selected;
    });
    if (focus) tabs[index].focus();
    const panel = panels[index];
    if (changed && animate && !reducedMotion.matches && typeof panel.animate === 'function') {
      const image = panel.querySelector('.day-art');
      const example = panel.querySelector('.day-example');
      [image, example].filter(Boolean).forEach((element, elementIndex) => {
        activeAnimations.push(element.animate(
          [{ opacity: 0.5, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 320, delay: elementIndex * 35, easing: 'cubic-bezier(.2,.7,.2,1)' }
        ));
      });
    }
  };

  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => selectMoment(index, { animate: true }));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectMoment(nextIndex, { focus: true, animate: true });
    });
  });
  selectMoment(0);
  demo.classList.add('day-demo-enhanced');
  reducedMotion.addEventListener('change', stopAnimation);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAnimation();
  });
})();
