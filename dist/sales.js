(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const choices = [...document.querySelectorAll('[data-context]')];
  const scenes = [...document.querySelectorAll('[data-context-scene]')];
  let contextAnimation;
  choices.forEach(choice => choice.addEventListener('toggle', () => {
    if (!choice.open) return;
    choices.forEach(other => { if (other !== choice) other.open = false; });
    scenes.forEach(scene => {
      const selected = scene.dataset.contextScene === choice.dataset.context;
      scene.hidden = !selected;
      if (selected && !reduced.matches && scene.animate) {
        contextAnimation?.cancel();
        contextAnimation = scene.animate([{opacity:.35,translate:'0 8px'},{opacity:1,translate:'0 0'}],{duration:320,easing:'ease-out'});
      }
    });
  }));
  const sticky = document.querySelector('.sales-mobile-download');
  const hero = document.querySelector('.hero');
  const finish = document.querySelector('#get-orb');
  const compact = matchMedia('(max-width:720px)');
  let heroVisible = true, finishVisible = false;
  const update = () => { if (sticky) sticky.hidden = !compact.matches || heroVisible || finishVisible; };
  if (sticky && hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === finish) finishVisible = entry.isIntersecting;
      });
      update();
    });
    observer.observe(hero);
    if (finish) observer.observe(finish);
    compact.addEventListener('change', update);
  }
  reduced.addEventListener('change', () => { if (reduced.matches) contextAnimation?.cancel(); });
})();
