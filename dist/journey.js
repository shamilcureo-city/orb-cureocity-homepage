(() => {
  const sticky = document.querySelector('.sales-mobile-download');
  const hero = document.querySelector('.hero');
  const finish = document.querySelector('#get-orb');
  const compact = matchMedia('(max-width:720px)');
  let heroVisible = true, finishVisible = false;
  const update = () => { if (sticky) sticky.hidden = !compact.matches || heroVisible || finishVisible; };
  if (sticky && hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === finish) finishVisible = entry.isIntersecting;
      }
      update();
    });
    observer.observe(hero);
    if (finish) observer.observe(finish);
    compact.addEventListener('change', update);
  }
  document.querySelectorAll('[data-policy]').forEach(button => {
    const configKey = button.dataset.policy;
    const destination = window.ORB_CONFIG?.[configKey];
    if (typeof destination !== 'string') return;
    try {
      const url = new URL(destination);
      if (url.protocol !== 'https:') return;
      button.removeAttribute('data-detail');
      button.addEventListener('click', () => { location.href = url.href; });
    } catch { /* Unconfigured destinations retain their preview disclosure. */ }
  });
})();
