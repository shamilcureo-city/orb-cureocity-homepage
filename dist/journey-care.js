(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animateChange = element => {
    if (!element || reducedMotion.matches || document.hidden || !element.animate) return;
    element.getAnimations().forEach(animation => animation.cancel());
    element.animate([{ opacity: .25, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 230, easing: 'ease-out' });
  };
  const care = document.querySelector('[data-care-selector]');
  if (care) {
    const tabs = [...care.querySelectorAll('[data-care-choice]')];
    const panels = [...care.querySelectorAll('[data-care-route]')];
    care.querySelector('.jc-route-tabs').setAttribute('role', 'tablist');
    const selectRoute = (selected, focus = false, shouldAnimate = true) => {
      tabs.forEach(tab => { const active = tab === selected; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
      panels.forEach(panel => { panel.hidden = panel.dataset.careRoute !== selected.dataset.careChoice; });
      if (focus) selected.focus();
      if (shouldAnimate) animateChange(panels.find(panel => !panel.hidden));
    };
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `jc-route-${tab.dataset.careChoice}`);
      const panel = panels.find(item => item.dataset.careRoute === tab.dataset.careChoice);
      if (panel) { panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id); panel.tabIndex = 0; }
      tab.addEventListener('click', () => selectRoute(tab));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault(); selectRoute(tabs[next], true);
      });
    });
    selectRoute(tabs[0], false, false);
  }
  const family = document.querySelector('[data-family-demo]');
  if (family) {
    const panels = [...family.querySelectorAll('[data-family-panel]')];
    const steps = [...family.querySelectorAll('[data-family-step]')];
    const fields = [...family.querySelectorAll('.jc-summary-choices input')];
    const confirm = family.querySelector('[data-family-next="2"]');
    const output = family.querySelector('[data-family-summary]');
    const status = family.querySelector('[data-family-status]');
    const states = [
      'Example invitation pending. Nothing has been sent or shared.',
      'Example invitation accepted. Choose summaries to preview permission. Nothing is sent or saved.',
      'Selected summaries shown in a fictional family view. No real access has been granted.',
      'Example access revoked. No summaries remain in the fictional family view.'
    ];
    const summaryCopy = {
      movement: ['Movement progress', 'A high-level view of recorded activity.'],
      meals: ['Meal-plan follow-through', 'A high-level view of meal logging.'],
      appointments: ['Upcoming appointments', 'A summary of planned care visits.']
    };
    function setStage(stage, shouldFocus = true) {
      if (stage === 2 && !fields.some(field => field.checked)) return;
      if (stage === 0) { fields.forEach(field => { field.checked = false; }); confirm.disabled = true; }
      output.replaceChildren();
      if (stage === 2) fields.filter(field => field.checked).forEach(field => {
        const record = document.createElement('div');
        const title = document.createElement('strong');
        const description = document.createElement('small');
        title.textContent = summaryCopy[field.value][0]; description.textContent = summaryCopy[field.value][1];
        record.append(title, description); output.append(record);
      });
      panels.forEach(panel => { panel.hidden = Number(panel.dataset.familyPanel) !== stage; });
      steps.forEach(step => { if (Number(step.dataset.familyStep) === stage) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current'); });
      status.textContent = states[stage];
      const current = panels.find(panel => !panel.hidden);
      if (shouldFocus) { current.tabIndex = -1; current.focus({ preventScroll: true }); animateChange(current); }
    }
    fields.forEach(field => field.addEventListener('change', () => { confirm.disabled = !fields.some(item => item.checked); }));
    family.querySelectorAll('[data-family-next]').forEach(button => button.addEventListener('click', () => setStage(Number(button.dataset.familyNext))));
    setStage(0, false);
  }
  const stopAnimations = () => {
    if (document.hidden || reducedMotion.matches) document.querySelectorAll('.jc-route-panel, .jc-sharing-panel').forEach(element => element.getAnimations().forEach(animation => animation.cancel()));
  };
  document.addEventListener('visibilitychange', stopAnimations);
  reducedMotion.addEventListener('change', stopAnimations);
})();
