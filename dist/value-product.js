/* Native details remain usable without JavaScript. A section link opens its context. */
(() => {
  const context = document.getElementById('health-vault');
  if (!context) return;
  const revealContext = () => {
    if (window.location.hash === '#health-vault') context.open = true;
  };
  revealContext();
  window.addEventListener('hashchange', revealContext);
})();
