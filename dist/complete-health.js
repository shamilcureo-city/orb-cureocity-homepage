/* Progressive enhancement: every concept panel is readable without JavaScript. */
(() => {
  document.querySelectorAll('[data-ch-tabs]').forEach((group, groupIndex) => {
    const list = group.querySelector('.ch-tab-row');
    const buttons = [...list.querySelectorAll('[data-ch-tab]')];
    const panels = buttons.map(button => group.querySelector(`#${button.dataset.chTab}`));
    if (!buttons.length || panels.some(panel => !panel)) return;
    list.setAttribute('role', 'tablist');
    const select = (index, focus = false) => {
      buttons.forEach((button, i) => {
        button.setAttribute('aria-selected', String(i === index));
        button.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) buttons[index].focus();
    };
    buttons.forEach((button, index) => {
      button.id = `ch-tab-${groupIndex}-${index}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panels[index].id);
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', button.id);
      panels[index].tabIndex = 0;
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const destinations = {
          ArrowRight: (index + 1) % buttons.length,
          ArrowLeft: (index - 1 + buttons.length) % buttons.length,
          Home: 0,
          End: buttons.length - 1
        };
        if (!(event.key in destinations)) return;
        event.preventDefault();
        select(destinations[event.key], true);
      });
    });
    select(0);
    group.classList.add('ch-tabs-ready');
  });
})();
