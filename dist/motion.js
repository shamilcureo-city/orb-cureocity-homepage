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
    const stackedSignals = window.matchMedia('(max-width: 900px)');
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
      // The phone stays at native CSS resolution. Only its position settles.
      animate(heroPhone, [
        { translate: `0 ${compact.matches ? 16 : 24}px` },
        { translate: '0 0' }
      ], { duration: 1250 });
      const aura = document.querySelector('.hero-aura');
      animate(aura, [
        { scale: '.96', opacity: .65 },
        { scale: '1.035', opacity: 1, offset: .45 },
        { scale: '1', opacity: 1 }
      ], { duration: 2400, easing: 'cubic-bezier(.45, 0, .55, 1)' });
    });

    const signalPaths = [...document.querySelectorAll('.hero-connections .signal-path')];
    const signalPulses = [...document.querySelectorAll('.hero-connections .signal-pulse')];
    document.querySelectorAll('.hero-source-composition').forEach((source, index) => {
      enterOnce(source, () => {
        const delay = index === 0 ? 0 : 110;
        // The illustrations retain their crisp static composition. A single
        // small vertical settle introduces them without floating or tilting.
        animate(source, [
          { translate: '0 10px' },
          { translate: '0 0' }
        ], { duration: 800, delay });

        source.querySelectorAll('.source-wave-line').forEach(wave => {
          animate(wave, [
            { strokeDasharray: '1', strokeDashoffset: '1' },
            { strokeDasharray: '1', strokeDashoffset: '0' }
          ], { duration: 1400, delay: delay + 120 });
        });

        source.querySelectorAll('.source-orbit').forEach(edge => {
          const resting = getComputedStyle(edge);
          // Illuminate the existing rim once; its geometry never spins.
          animate(edge, [
            { strokeOpacity: .35, filter: resting.filter },
            { strokeOpacity: 1, filter: 'drop-shadow(0 0 2px rgba(172, 213, 235, .7))', offset: .45 },
            { strokeOpacity: resting.strokeOpacity, filter: resting.filter }
          ], { duration: 1600, delay: delay + 120, easing: 'ease-in-out' });
        });

        if (!stackedSignals.matches) {
          animate(signalPaths[index], [
            { strokeOpacity: .3 },
            { strokeOpacity: 1 }
          ], { duration: 800, delay });
          // Each source sends one restrained packet toward Orb. Its static
          // connection is visible before, during, and after the animation.
          animate(signalPulses[index], [
            { strokeDashoffset: '1', opacity: 0 },
            { opacity: .75, offset: .12 },
            { opacity: .75, offset: .78 },
            { strokeDashoffset: '-.08', opacity: 0 }
          ], { duration: 1700, delay: delay + 250, easing: 'linear' });
        }
      });
    });

    // Only the original product artwork settles. Card edges, copy, and buttons
    // hold their positions; independent rotate/translate preserve source crops.
    document.querySelectorAll('.orb-phone-stage').forEach((stage, index) => {
      const phone = stage.querySelector('.orb-source-phone');
      if (!phone) return;
      enterOnce(phone, () => animate(phone, [
        {
          translate: `0 ${compact.matches ? 22 : 32}px`,
          rotate: `${(index % 2 ? 1 : -1) * (compact.matches ? .35 : .75)}deg`
        },
        { translate: '0 0', rotate: '0deg' }
      ], { duration: 1250, delay: compact.matches ? 0 : (index % 2) * 100 }));
    });

    // A short, one-time reveal helps the product and care story unfold.
    // Copy is visible before observation and remains visible without JavaScript.
    document.querySelectorAll('.vp-original-phone img, .vp-care-story, .vo-offer').forEach(element => {
      enterOnce(element, () => animate(element, [
        { opacity: .7, translate: '0 12px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: 650 }));
    });

    const voiceOrb = document.querySelector('.voice-visual img');
    const voiceWaveform = document.querySelector('.voice-waveform');
    let wavePlayed = false;
    function pulseWaveform(interactive = false) {
      if (!voiceWaveform || !enabled() || !onScreen(voiceWaveform)) return;
      if (!interactive && wavePlayed) return;
      wavePlayed = true;
      voiceWaveform.querySelectorAll('.voice-wave-bar').forEach((bar, index) => {
        animate(bar, [
          { scale: '1 .45' },
          { scale: '1 1', offset: .25 },
          { scale: `1 ${index % 3 === 0 ? '.35' : '.6'}`, offset: .55 },
          { scale: '1 1' }
        ], {
          duration: interactive ? 700 : 900,
          delay: index * 30,
          iterations: interactive ? 1 : 3,
          easing: 'ease-in-out'
        });
      });
    }
    enterOnce(voiceWaveform, () => pulseWaveform());
    function breatheOrb(interactive = false) {
      if (!voiceOrb || !onScreen(voiceOrb)) return;
      pulseWaveform(interactive);
      const restFilter = getComputedStyle(voiceOrb).filter;
      animate(voiceOrb, [
        { scale: '1', translate: '0 0', filter: restFilter },
        {
          scale: interactive ? '1.045' : '1.035',
          translate: `0 ${interactive ? -4 : -7}px`,
          filter: 'drop-shadow(0 0 28px rgba(255, 83, 112, .3))',
          offset: .48
        },
        { scale: '1', translate: '0 0', filter: restFilter }
      ], {
        duration: interactive ? 1100 : 1800,
        iterations: interactive ? 1 : 2,
        easing: 'cubic-bezier(.45, 0, .55, 1)'
      });
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
