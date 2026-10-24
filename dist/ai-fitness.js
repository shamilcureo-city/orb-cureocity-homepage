(() => {
  const showcase = document.querySelector('[data-af-showcase]');
  if (!showcase) return;
  const tablist = showcase.querySelector('[data-af-tabs]');
  const tabs = [...showcase.querySelectorAll('[data-af-tab]')];
  const panels = [...showcase.querySelectorAll('[data-af-panel]')];
  const stage = showcase.querySelector('[data-af-stage]');
  const replay = showcase.querySelector('[data-af-replay]');
  if (!tablist || !stage || !replay || tabs.length !== panels.length) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationTimer;
  let animationFrame;
  let stageVisible = false;
  let firstRevealPlayed = false;

  const stopMotion = () => {
    window.clearTimeout(animationTimer);
    window.cancelAnimationFrame(animationFrame);
    stage.classList.remove('af-running');
  };

  const playMotion = () => {
    stopMotion();
    if (motionPreference.matches || document.hidden || !stageVisible) return;
    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = window.requestAnimationFrame(() => {
        if (motionPreference.matches || document.hidden || !stageVisible) return;
        stage.classList.add('af-running');
        animationTimer = window.setTimeout(stopMotion, 2900);
      });
    });
  };

  const selectMode = (selected, shouldAnimate = false) => {
    const mode = selected.dataset.afTab;
    stopMotion();
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.afPanel !== mode; });
    stage.dataset.afMode = mode;
    if (shouldAnimate) playMotion();
  };

  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    const panel = panels.find((candidate) => candidate.dataset.afPanel === tab.dataset.afTab);
    if (!panel) return;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => selectMode(tab, true));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      tabs[nextIndex].focus();
      selectMode(tabs[nextIndex], true);
    });
  });

  selectMode(tabs[0]);
  showcase.classList.add('af-enhanced');
  tablist.hidden = false;
  const syncMotionControl = () => {
    replay.hidden = motionPreference.matches;
    if (motionPreference.matches) stopMotion();
  };
  syncMotionControl();
  motionPreference.addEventListener('change', syncMotionControl);
  replay.addEventListener('click', playMotion);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMotion(); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      stageVisible = Boolean(entry?.isIntersecting);
      if (!stageVisible) { stopMotion(); return; }
      if (!firstRevealPlayed) {
        firstRevealPlayed = true;
        playMotion();
      }
    }, { threshold: 0.15 });
    observer.observe(stage);
  } else {
    stageVisible = true;
  }
})();
