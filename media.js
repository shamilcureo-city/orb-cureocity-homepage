/* Vimeo media is loaded only when needed. No personal health information is sent. */
export function ambientPlaybackAllowed({inView, documentHidden, modalOpen, reducedMotion, unavailable}) {
  return Boolean(inView && !documentHidden && !modalOpen && !reducedMotion && !unavailable);
}

// Autoplay permission and provider failure need different recovery messages.
export function testimonialPlayFailure(error, {active, alreadyFailed}) {
  if (!active || alreadyFailed) return 'ignore';
  const name = String(error?.name || '');
  const message = String(error?.message || '');
  const providerError = ['PasswordError', 'PrivacyError', 'TypeError', 'RangeError'].includes(name);
  const denied = name === 'NotAllowedError' || /autoplay.{0,40}(?:blocked|denied|not allowed)|user (?:activation|gesture)|user (?:did not|didn.t) interact/i.test(message);
  return !providerError && denied ? 'manual-play' : 'failed';
}

function bounded(promise, milliseconds = 15000) {
  let timeout;
  return Promise.race([promise, new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Video response timed out.')), milliseconds); })]).finally(() => clearTimeout(timeout));
}

export function createAmbientController({eligible, createPlayer, onState = () => {}, onPlayer = () => {}, timeoutMs = 15000}) {
  let player = null, preparing = null, playPromise = null, playing = false, failed = false, generation = 0, playRevision = 0, disposed = false;
  let state = 'idle';
  const setState = next => { if (state !== next) { state = next; onState(next); } };
  const quietly = operation => { try { Promise.resolve(operation()).catch(() => {}); } catch {} };
  const pause = () => {
    playRevision++; playing = false;
    if (player) quietly(() => player.pause());
    if (!failed) setState(player ? 'paused' : preparing ? 'loading' : 'idle');
  };
  const fail = () => {
    failed = true; playing = false; setState('failed');
    if (player) { const current = player; player = null; quietly(() => current.destroy()); }
  };
  async function ensurePlayer() {
    if (preparing) return preparing;
    if (player) return player;
    const epoch = generation;
    setState('loading');
    const pending = (async () => {
      const candidate = await createPlayer();
      if (!candidate) { if (!disposed && epoch === generation) setState('idle'); return null; }
      if (disposed || epoch !== generation) { quietly(() => candidate.destroy()); return null; }
      player = candidate;
      candidate.on?.('play', () => {
        if (candidate !== player) return;
        if (!eligible() || disposed) pause();
        else { playing = true; setState('playing'); }
      });
      candidate.on?.('pause', () => { if (candidate === player) { playing = false; if (!failed) setState('paused'); } });
      candidate.on?.('error', error => {
        // Method errors are handled by their own promise. An intentional pause can reject an older play request.
        if (candidate === player && !error?.method) fail();
      });
      await bounded(candidate.ready(), timeoutMs);
      if (disposed || epoch !== generation || candidate !== player) { quietly(() => candidate.destroy()); return null; }
      await bounded(candidate.setMuted(true), timeoutMs);
      if (disposed || epoch !== generation || candidate !== player) return null;
      await onPlayer(candidate);
      return candidate;
    })();
    preparing = pending;
    try { return await pending; }
    catch { if (!disposed && epoch === generation) fail(); return null; }
    finally { if (preparing === pending) preparing = null; }
  }
  async function sync() {
    if (disposed) return;
    if (!eligible()) { pause(); return; }
    if (failed) return;
    const current = await ensurePlayer();
    if (!current || disposed || current !== player) return;
    if (!eligible()) { pause(); return; }
    if (playing || playPromise) return;
    const attempt = playRevision;
    const pending = Promise.resolve().then(() => {
      if (disposed || current !== player || !eligible()) return false;
      return bounded(current.play(), timeoutMs).then(() => true);
    });
    playPromise = pending;
    try {
      const requested = await pending;
      if (!requested || disposed || current !== player || attempt !== playRevision) return;
      if (!eligible()) pause();
      else { playing = true; setState('playing'); }
    } catch {
      if (!disposed && current === player) {
        if (attempt !== playRevision || !eligible()) { playing = false; setState('paused'); }
        else fail();
      }
    } finally {
      if (playPromise === pending) playPromise = null;
      // A quick carousel return should retry the current request, not preserve the old interruption as a failure.
      if (!disposed && !failed && current === player && eligible() && attempt !== playRevision) void sync();
    }
  }
  function release() {
    generation++; playRevision++; failed = false; playing = false; playPromise = null; preparing = null;
    if (player) { const current = player; player = null; quietly(() => current.destroy()); }
    setState('idle');
  }
  return {sync, release, destroy() { disposed = true; release(); }, getState: () => state};
}

export function createVimeoLoader(win, doc, timeoutMs = 12000) {
  let pending;
  return function loadVimeo() {
    if (win.Vimeo?.Player) return Promise.resolve(win.Vimeo);
    if (pending) return pending;
    const script = doc.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js'; script.async = true;
    pending = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => finish(new Error('Vimeo did not load.')), timeoutMs);
      function finish(error) {
        clearTimeout(timeout); script.onload = null; script.onerror = null;
        if (error) { script.remove(); pending = null; reject(error); }
        else resolve(win.Vimeo);
      }
      script.onload = () => finish(win.Vimeo?.Player ? null : new Error('Vimeo is unavailable.'));
      script.onerror = () => finish(new Error('Vimeo could not be reached.'));
      doc.head.append(script);
    });
    return pending;
  };
}

export function initOrbMedia(win = window, doc = document) {
  const config = win.ORB_MEDIA;
  if (!config) return;
  const loadVimeo = createVimeoLoader(win, doc);
  const preference = win.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => preference.matches || doc.documentElement.classList.contains('reduce-motion');
  const modalOpen = () => Boolean(doc.querySelector('dialog[open]')) || doc.body.classList.contains('modal-open');
  const controllers = [];
  const ambientNodes = [...doc.querySelectorAll('[data-orb-vimeo][data-vimeo-mode="ambient"]')];
  const intersection = 'IntersectionObserver' in win ? new win.IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.dataset.videoVisible = String(entry.isIntersecting && entry.intersectionRatio >= .2);
      entry.target._orbVideoSync?.();
    }
  }, {threshold: [0, .2]}) : null;
  for (const node of ambientNodes) {
    const media = config.ambient?.[node.dataset.orbVimeo];
    if (!media || !/^\d+$/.test(String(media.id))) continue;
    const mount = node.querySelector('.orb-vimeo-frame');
    if (!mount) continue;
    let retireTimer;
    const unavailable = () => !node.getClientRects().length || Boolean(node.closest('[hidden], [inert], [aria-hidden="true"]'));
    const eligible = () => ambientPlaybackAllowed({inView: node.dataset.videoVisible === 'true', documentHidden: doc.hidden, modalOpen: modalOpen(), reducedMotion: reduced(), unavailable: unavailable()});
    const resize = () => {
      const {width, height} = node.getBoundingClientRect();
      const ratio = Number(media.width) / Number(media.height) || 16 / 9;
      const cover = node.dataset.videoFit !== 'contain';
      const frameWidth = cover ? Math.max(width, height * ratio) : Math.min(width, height * ratio);
      mount.style.width = `${frameWidth}px`; mount.style.height = `${frameWidth / ratio}px`;
      const rawPosition = win.getComputedStyle(node).getPropertyValue('--video-position-x').trim();
      const specified = Number.parseFloat(rawPosition);
      const positionX = Number.isFinite(specified) ? Math.min(1, Math.max(0, rawPosition.endsWith('%') ? specified / 100 : specified)) : .5;
      mount.style.left = `${(width - frameWidth) * positionX}px`;
      mount.style.top = `${(height - frameWidth / ratio) / 2}px`;
      mount.style.transform = 'none';
    };
    const controller = createAmbientController({
      eligible,
      createPlayer: async () => {
        const Vimeo = await loadVimeo();
        if (!eligible()) return null;
        return new Vimeo.Player(mount, {id: Number(media.id), width: media.width || 1920, height: media.height || 1080, background: true, autoplay: false, muted: true, loop: true, controls: false, keyboard: false, autopause: false, playsinline: true, dnt: true, title: false, byline: false, portrait: false});
      },
      onPlayer: async player => {
        const iframe = mount.querySelector('iframe');
        if (!iframe) throw new Error('Vimeo player frame is missing.');
        iframe.tabIndex = -1; iframe.setAttribute('aria-hidden', 'true');
        iframe.title = media.title || 'Illustrative Orb section video';
        resize();
      },
      onState: state => {
        node.dataset.videoState = state;
        node.classList.toggle('is-playing', state === 'playing');
        node.classList.toggle('is-failed', state === 'failed');
      }
    });
    const sync = () => {
      clearTimeout(retireTimer);
      void controller.sync();
      if (!eligible()) retireTimer = setTimeout(() => { if (!eligible()) controller.release(); }, 30000);
    };
    node._orbVideoSync = sync;
    controllers.push({sync, controller});
    if ('ResizeObserver' in win) new win.ResizeObserver(resize).observe(node);
    resize();
    // Older browsers keep the useful static poster instead of uncontrolled autoplay.
    intersection?.observe(node);
  }
  const syncAll = () => controllers.forEach(item => item.sync());
  for (const event of ['orb:slidechange', 'orb:panelchange', 'orb:motionchange', 'visibilitychange']) doc.addEventListener(event, syncAll);
  preference.addEventListener('change', syncAll);

  win.addEventListener('pagehide', event => {
    controllers.forEach(item => event.persisted ? item.controller.release() : item.controller.destroy());
  });
  win.addEventListener('pageshow', event => { if (event.persisted) syncAll(); });

  const dialog = doc.getElementById('testimonial-dialog');
  const mount = doc.getElementById('testimonial-player');
  if (!dialog || !mount) return;
  const title = doc.getElementById('testimonial-title');
  const status = doc.getElementById('testimonial-status');
  const fallback = doc.getElementById('testimonial-fallback');
  let testimonial = null, opener = null, selected = null, generation = 0, retryButton;
  const lock = () => {
    doc.body.classList.toggle('modal-open', Boolean(doc.querySelector('dialog[open]')));
    doc.dispatchEvent(new Event('orb:panelchange'));
  };
  const teardown = () => {
    generation++;
    if (testimonial) { const player = testimonial; testimonial = null; player.destroy().catch(() => {}); }
    mount.replaceChildren();
  };
  const showError = () => {
    dialog.dataset.videoState = 'failed';
    status.textContent = 'This video could not load. Try again, or open it on Vimeo.';
    if (!retryButton) {
      retryButton = doc.createElement('button'); retryButton.type = 'button';
      retryButton.className = 'button testimonial-retry'; retryButton.dataset.testimonialRetry = '';
      retryButton.textContent = 'Try again'; status.after(retryButton);
      retryButton.addEventListener('click', () => { if (selected && dialog.open) void playTestimonial(selected); });
    }
    retryButton.hidden = false;
  };
  async function playTestimonial(media) {
    teardown(); const epoch = generation;
    retryButton && (retryButton.hidden = true);
    status.textContent = 'Loading video…'; dialog.dataset.videoState = 'loading';
    try {
      const Vimeo = await loadVimeo();
      if (!dialog.open || epoch !== generation) return;
      const frameMount = doc.createElement('div'); frameMount.className = 'testimonial-frame'; mount.append(frameMount);
      const player = new Vimeo.Player(frameMount, {id: Number(media.id), width: media.width || 540, height: media.height || 960, controls: true, autoplay: false, muted: false, loop: false, playsinline: true, dnt: true, title: false, byline: false, portrait: false});
      testimonial = player;
      player.on('error', () => { if (player === testimonial && dialog.open) showError(); });
      player.on('play', () => {
        if (player !== testimonial || !dialog.open || doc.hidden || dialog.dataset.videoState === 'failed') { player.pause().catch(() => {}); return; }
        dialog.dataset.videoState = 'playing'; status.textContent = 'Use Close video to return.';
      });
      await bounded(player.ready());
      if (!dialog.open || epoch !== generation || player !== testimonial) { await player.destroy(); return; }
      if (dialog.dataset.videoState === 'failed') return;
      const iframe = frameMount.querySelector('iframe');
      if (!iframe) throw new Error('Vimeo player frame is missing.');
      iframe.title = media.title || 'Cureocity testimonial';
      dialog.dataset.videoState = 'ready'; status.textContent = 'Use the controls for sound and captions when available. Use Close video to return.';
      if (!doc.hidden) {
        // The user explicitly chose this story. Browsers may still require the player play control.
        try { await bounded(player.play()); }
        catch (error) {
          const recovery = testimonialPlayFailure(error, {active: dialog.open && epoch === generation && player === testimonial, alreadyFailed: dialog.dataset.videoState === 'failed'});
          if (recovery === 'manual-play') status.textContent = 'Press play in the video to watch with sound. Use Close video to return.';
          else if (recovery === 'failed') showError();
        }
        if (!dialog.open || epoch !== generation || doc.hidden) await player.pause().catch(() => {});
      }
    } catch { if (dialog.open && epoch === generation) showError(); }
  }
  doc.addEventListener('click', event => {
    const trigger = event.target.closest('[data-testimonial-id]');
    if (!trigger) return;
    const media = config.testimonials?.find(item => String(item.id) === trigger.dataset.testimonialId);
    if (!media || !/^\d+$/.test(String(media.id))) return;
    opener = trigger; selected = media;
    title.textContent = media.title || 'A Cureocity story';
    fallback.href = `https://vimeo.com/${media.id}`; fallback.hidden = false;
    dialog.style.setProperty('--testimonial-ratio', String((Number(media.width) || 9) / (Number(media.height) || 16)));
    if (!dialog.open) dialog.showModal();
    lock(); dialog.querySelector('[data-testimonial-close]')?.focus();
    void playTestimonial(media);
  });
  dialog.querySelector('[data-testimonial-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],iframe,[tabindex="0"]')].filter(el => !el.hidden && el.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('close', () => {
    teardown(); selected = null; lock();
    if (opener?.isConnected) opener.focus({preventScroll: true});
  });
  doc.addEventListener('visibilitychange', () => {
    // Never resume audible playback merely because the tab becomes visible again.
    if (doc.hidden && testimonial) testimonial.pause().catch(() => {});
  });
  win.addEventListener('pagehide', () => {
    // Restore a closed dialog from the back-forward cache, never an empty player or audible session.
    if (dialog.open) dialog.close();
    teardown(); lock();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') initOrbMedia();
