(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  if (header) {
    document.documentElement.classList.add('cp-navigation-enhanced');
    let queued = false;
    const updateHeader = () => { header.classList.toggle('cp-scrolled', window.scrollY > 40); queued = false; };
    window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateHeader); } }, {passive:true});
    updateHeader();
  }
  const reveal = el => {
    if (!reduceMotion.matches && !document.hidden && el.animate) {
      el.animate([{opacity: .5, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 240, easing: 'ease-out'});
    }
  };
  const bindTabs = (root, tabSelector, panelSelector, tabKey, panelKey, enhanceClass) => {
    if (!root) return;
    const tabs = [...root.querySelectorAll(tabSelector)];
    const panels = [...root.querySelectorAll(panelSelector)];
    if (!tabs.length || panels.length !== tabs.length) return;
    tabs[0].parentElement.setAttribute('role', 'tablist');
    const activate = (index, focus = false) => {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        const panel = panels.find(p => p.dataset[panelKey] === tab.dataset[tabKey]);
        if (!panel) return;
        if (!tab.id) tab.id = 'cp-hero-tab-' + tab.dataset[tabKey];
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        panel.hidden = !selected;
        if (selected) reveal(panel);
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', event => { event.preventDefault(); activate(index); });
      tab.addEventListener('keydown', event => {
        const forward = ['ArrowRight', 'ArrowDown'].includes(event.key);
        const back = ['ArrowLeft', 'ArrowUp'].includes(event.key);
        let next = forward ? (index + 1) % tabs.length : back ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
        if (next === null) return;
        event.preventDefault(); activate(next, true);
      });
    });
    if (enhanceClass) root.classList.add(enhanceClass);
    activate(0);
  };
  bindTabs(document.querySelector('.cp-phone-center'), '[data-hero-tab]', '[data-hero-panel]', 'heroTab', 'heroPanel');
  bindTabs(document.querySelector('.cp-you'), '[data-need]', '[data-need-panel]', 'need', 'needPanel', 'cp-you-enhanced');
  const stage = document.querySelector('.cp-hero-stage');
  if (stage && !reduceMotion.matches && !document.hidden && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      const left = stage.querySelector('.cp-side-left');
      const right = stage.querySelector('.cp-side-right');
      [left, right].forEach((el, index) => el?.animate([
        {opacity: 0, transform: `translateY(26px) rotate(${index ? 3 : -3}deg)`},
        {opacity: 1, transform: `translateY(0) rotate(${index ? 8 : -8}deg)`}
      ], {duration: 700, delay: 80 + index * 80, easing: 'cubic-bezier(.2,.8,.2,1)'}));
      observer.disconnect();
    }, {threshold: .2});
    observer.observe(stage);
  }
})();
