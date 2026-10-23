(() => {
  'use strict';

  // These three sections share one original background export. Measuring the
  // composed height keeps its joins aligned as copy wraps on smaller screens.
  // This is layout sizing, so it also runs when motion is disabled or unavailable.
  function alignEndingTexture() {
    const sections = [...document.querySelectorAll('.lower-hubs, .lower-final-cta, .lower-footer')];
    if (sections.length !== 3) return;
    function measure() {
      const heights = sections.map(section => section.getBoundingClientRect().height);
      const total = `${(heights.reduce((sum, height) => sum + height, 0) * 1.35).toFixed(3)}px`;
      let offset = 0;
      sections.forEach((section, index) => {
        const position = `${offset.toFixed(3)}px`;
        if (section.style.getPropertyValue('--ending-height') !== total) section.style.setProperty('--ending-height', total);
        if (section.style.getPropertyValue('--ending-offset') !== position) section.style.setProperty('--ending-offset', position);
        offset += heights[index];
      });
    }
    measure();
    if ('ResizeObserver' in window) {
      const resize = new ResizeObserver(measure);
      sections.forEach(section => resize.observe(section));
    } else {
      let frame = 0;
      window.addEventListener('resize', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measure);
      }, { passive: true });
    }
    window.addEventListener('load', measure, { once: true });
    document.fonts?.ready.then(measure);
  }

  function initMotion() {
    alignEndingTexture();
    if (!Element.prototype.animate || !window.CSS?.supports('translate', '0 1px')) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 720px)');
    const active = new Map();
    const entrances = new Map();
    const easeOut = 'cubic-bezier(.22, 1, .36, 1)';
    const enabled = () => !reducedMotion.matches && !document.hidden;
    const onScreen = element => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
    };

    // No forwards fill or inline motion style is retained. Cancelling restores the
    // source artwork, positioning, and scale from the design's own stylesheet.
    function animate(element, keyframes, options = {}) {
      if (!element || !enabled()) return;
      active.get(element)?.cancel();
      const animation = element.animate(keyframes, {
        duration: 750,
        easing: easeOut,
        iterations: 1,
        fill: 'backwards',
        ...options
      });
      active.set(element, animation);
      const release = () => {
        if (active.get(element) === animation) active.delete(element);
      };
      animation.addEventListener('finish', release, { once: true });
      animation.addEventListener('cancel', release, { once: true });
      return animation;
    }

    function stopMotion() {
      active.forEach(animation => animation.cancel());
      active.clear();
    }

    // Lazy images enter only once their actual exported artwork has loaded.
    // They are never hidden while waiting for either loading or an observer.
    function withImage(element, run) {
      const image = element.matches('img') ? element : element.querySelector('img');
      const ready = () => {
        if (enabled() && onScreen(element)) run();
      };
      if (!image || (image.complete && image.naturalWidth)) ready();
      else image.addEventListener('load', ready, { once: true });
    }

    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      if (!enabled()) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const enter = entrances.get(entry.target);
        if (!enter) return;
        entrances.delete(entry.target);
        observer.unobserve(entry.target);
        enter();
      });
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' }) : null;

    function enterOnce(element, run) {
      if (!element) return;
      if (!observer) {
        if (onScreen(element)) withImage(element, run);
        return;
      }
      entrances.set(element, () => withImage(element, run));
      if (enabled()) observer.observe(element);
    }

    function syncMotion() {
      observer?.disconnect();
      if (!enabled()) {
        stopMotion();
        return;
      }
      entrances.forEach((_, element) => observer?.observe(element));
    }

    const heroPhone = document.querySelector('.hero-phone-shell');
    enterOnce(heroPhone, () => {
      animate(heroPhone, [
        { translate: `0 ${compact.matches ? 18 : 28}px` },
        { translate: '0 0' }
      ], { duration: 1300 });

      document.querySelectorAll('.hero-data-card').forEach((card, index) => {
        animate(card, [
          { opacity: .25 },
          { opacity: 1 }
        ], { duration: 850, delay: 120 + index * 65 });
      });
    });

    // Only the product artwork moves. Card edges, copy, and buttons hold their
    // reference positions, making paired cards feel coordinated without a
    // generic whole-page reveal treatment.
    document.querySelectorAll('.orb-phone-stage').forEach((stage, index) => {
      const phone = stage.querySelector('.orb-source-phone');
      if (!phone) return;
      enterOnce(phone, () => animate(phone, [
        { translate: `0 ${compact.matches ? 22 : 34}px` },
        { translate: '0 0' }
      ], { duration: 1050, delay: compact.matches ? 0 : (index % 2) * 95 }));
    });

    const voiceOrb = document.querySelector('.voice-visual img');
    function breatheOrb(interactive = false) {
      if (!voiceOrb || !onScreen(voiceOrb)) return;
      animate(voiceOrb, [
        { scale: '1', translate: '0 0', filter: 'drop-shadow(0 0 0 rgba(255, 83, 112, 0))' },
        {
          scale: interactive ? '1.04' : '1.025',
          translate: `0 ${interactive ? -4 : -8}px`,
          filter: 'drop-shadow(0 0 24px rgba(255, 83, 112, .15))',
          offset: .48
        },
        { scale: '1', translate: '0 0', filter: 'drop-shadow(0 0 0 rgba(255, 83, 112, 0))' }
      ], { duration: interactive ? 1100 : 3200, easing: 'cubic-bezier(.45, 0, .55, 1)' });
    }
    enterOnce(voiceOrb, () => breatheOrb());

    function revealPanel(element) {
      if (!element || element.hidden) return;
      animate(element, [
        { opacity: .8, translate: '0 8px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: 300 });
    }

    // Events run after the app's own handlers, so this layer never delays an
    // action, captures a pointer, changes focus, or changes a selection.
    document.addEventListener('change', event => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || !input.matches('#connections input')) return;
      animate(input.closest('label'), [
        { scale: '1' },
        { scale: input.checked ? '1.035' : '.985', offset: .4 },
        { scale: '1' }
      ], { duration: 320, easing: 'cubic-bezier(.2, .8, .2, 1)' });
    });

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-voice-demo]')) {
        breatheOrb(true);
        revealPanel(document.getElementById('voice-result'));
      }
    });

    document.addEventListener('submit', event => {
      if (event.target.id === 'connections') revealPanel(document.getElementById('connection-results'));
    });

    const dialogs = new MutationObserver(records => {
      new Set(records.map(record => record.target)).forEach(dialog => {
        if (dialog.open) revealPanel(dialog);
        else active.get(dialog)?.cancel();
      });
    });
    document.querySelectorAll('dialog').forEach(dialog => {
      dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    });

    reducedMotion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    window.addEventListener('pagehide', () => {
      observer?.disconnect();
      stopMotion();
    });
    window.addEventListener('pageshow', syncMotion);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion, { once: true });
  } else initMotion();
})();
