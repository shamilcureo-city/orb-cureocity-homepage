(() => {
  'use strict';

  function init() {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const config = window.ORB_CONFIG || {};
    const scrollTo = (element) => element?.scrollIntoView({
      behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'
    });
    const make = (tag, text, className) => {
      const element = document.createElement(tag);
      if (text !== undefined) element.textContent = text;
      if (className) element.className = className;
      return element;
    };
    const destination = (value) => {
      if (typeof value !== 'string' || !value.trim()) return null;
      try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.href : null;
      } catch { return null; }
    };

    // Navigation stays usable as native links when JavaScript is unavailable.
    const menuToggle = $('#menu-toggle');
    const mobileMenu = $('#mobile-menu');
    function setMenu(open, returnFocus = false) {
      if (!menuToggle || !mobileMenu) return;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mobileMenu.hidden = !open;
      document.body.classList.toggle('nav-open', open);
      if (returnFocus) menuToggle.focus();
    }
    if (menuToggle && mobileMenu) {
      menuToggle.setAttribute('aria-controls', mobileMenu.id);
      setMenu(false);
      menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
      mobileMenu.addEventListener('click', (event) => {
        if (event.target.closest('a, button')) setMenu(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
      });
      document.addEventListener('click', (event) => {
        if (menuToggle.getAttribute('aria-expanded') === 'true' && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
      });
      window.matchMedia('(min-width: 981px)').addEventListener('change', event => {
        if (event.matches) setMenu(false);
      });
    }

    // One visible product panel, with keyboard-operable tabs.
    const tabs = $$('button[data-feature]');
    const panels = $$('[data-feature-panel]');
    const compactTabs = window.matchMedia('(max-width: 980px)');
    const tabList = tabs[0]?.closest('[role="tablist"]');
    const updateTabOrientation = () => tabList?.setAttribute('aria-orientation', compactTabs.matches ? 'horizontal' : 'vertical');
    updateTabOrientation();
    compactTabs.addEventListener('change', updateTabOrientation);
    function activateFeature(value, focus = false) {
      const selected = tabs.find(tab => tab.dataset.feature === value);
      if (!selected) return;
      tabs.forEach(tab => {
        const active = tab === selected;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        tab.classList.toggle('is-active', active);
      });
      panels.forEach(panel => {
        const active = panel.dataset.featurePanel === value;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
      if (focus) selected.focus();
    }
    tabs.forEach((tab, index) => {
      const panel = panels.find(item => item.dataset.featurePanel === tab.dataset.feature);
      tab.id ||= `feature-tab-${tab.dataset.feature}`;
      if (panel) {
        panel.id ||= `feature-panel-${tab.dataset.feature}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        tab.setAttribute('aria-controls', panel.id);
      }
      tab.addEventListener('click', () => activateFeature(tab.dataset.feature));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          activateFeature(tabs[next].dataset.feature, true);
        }
      });
    });
    if (tabs.length) activateFeature(tabs.find(tab => tab.getAttribute('aria-selected') === 'true')?.dataset.feature || tabs[0].dataset.feature);
    $$('[data-select-feature]').forEach(link => link.addEventListener('click', () => activateFeature(link.dataset.selectFeature)));

    // Replay only the labelled illustrative conversation already on the page.
    const conversation = $('#orb-conversation');
    const demoButtons = $$('[data-demo-play]');
    const demoMessages = conversation ? $$('[data-message]', conversation) : [];
    let demoTimers = [];
    if (conversation && !$('#demo-status')) {
      const status = make('p', '', 'sr-only');
      status.id = 'demo-status';
      status.setAttribute('role', 'status');
      conversation.append(status);
    }
    function finishDemo() {
      demoTimers.forEach(clearTimeout);
      demoTimers = [];
      demoButtons.forEach(button => { button.disabled = false; button.removeAttribute('aria-busy'); });
      conversation?.classList.remove('is-playing');
      demoMessages.forEach(message => message.classList.remove('demo-highlight'));
      const status = $('#demo-status');
      if (status) status.textContent = 'Illustrative conversation complete.';
    }
    reducedMotion.addEventListener('change', event => {
      if (event.matches && demoTimers.length) finishDemo();
    });
    demoButtons.forEach(button => button.addEventListener('click', () => {
      if (!conversation || !demoMessages.length) return;
      demoTimers.forEach(clearTimeout);
      demoTimers = [];
      conversation.tabIndex = -1;
      scrollTo(conversation);
      conversation.focus({ preventScroll: true });
      demoMessages.forEach(message => message.classList.remove('demo-highlight', 'demo-read'));
      if (reducedMotion.matches) {
        demoMessages.forEach(message => message.classList.add('demo-read'));
        finishDemo();
        return;
      }
      demoButtons.forEach(item => { item.disabled = true; item.setAttribute('aria-busy', 'true'); });
      conversation.classList.add('is-playing');
      const status = $('#demo-status');
      if (status) status.textContent = 'Playing the illustrative conversation.';
      demoMessages.forEach((message, index) => {
        demoTimers.push(setTimeout(() => {
          demoMessages.forEach(item => item.classList.remove('demo-highlight'));
          message.classList.add('demo-highlight', 'demo-read');
        }, index * 850));
      });
      demoTimers.push(setTimeout(finishDemo, demoMessages.length * 850 + 600));
    }));

    // A local demonstration: no microphone access and no saved workout record.
    const voiceButton = $('[data-voice-demo]');
    const transcript = $('#voice-transcript');
    const voiceResult = $('#voice-result');
    const voiceStatus = $('#voice-status');
    if (voiceButton && transcript && voiceResult) {
      voiceButton.addEventListener('click', () => {
        voiceResult.classList.remove('is-reviewed');
        transcript.hidden = false;
        transcript.textContent = '“Log bench press: 40 kilograms, 10 reps.”';
        voiceResult.replaceChildren();
        const heading = make('h3', 'Review your entry');
        const values = make('dl', undefined, 'voice-entry-values');
        [['Exercise', 'Bench press'], ['Weight', '40 kg'], ['Repetitions', '10']].forEach(([label, value]) => {
          const item = make('div');
          item.append(make('dt', label), make('dd', value));
          values.append(item);
        });
        const confirm = make('button', 'Confirm entry', 'btn btn-primary');
        confirm.type = 'button';
        confirm.dataset.voiceConfirm = '';
        const note = make('p', 'Illustrative example. This demo does not save a workout.', 'demo-note');
        voiceResult.append(heading, values, confirm, note);
        voiceResult.hidden = false;
        voiceButton.textContent = 'Play the example again';
        if (voiceStatus) voiceStatus.textContent = 'Example recognised. Review the exercise, weight and repetitions.';
      });
      voiceResult.addEventListener('click', (event) => {
        const confirm = event.target.closest('[data-voice-confirm]');
        if (!confirm) return;
        confirm.textContent = 'Entry reviewed';
        confirm.disabled = true;
        voiceResult.classList.add('is-reviewed');
        if (voiceStatus) voiceStatus.textContent = 'Entry reviewed in this demo. No workout has been saved.';
      });
    }

    const connections = $('#connections');
    const sourceLabels = {
      sleep: 'Sleep', activity: 'Activity & workouts', heartrate: 'Heart-rate trends',
      meals: 'Meals & hydration', reports: 'Blood reports', glucose: 'Glucose readings',
      cycle: 'Cycle & symptoms', history: 'Health history'
    };
    const deviceLabels = { apple: 'Apple Watch', garmin: 'Garmin', oura: 'Oura', whoop: 'WHOOP', samsung: 'Samsung', none: 'I don’t use a wearable' };
    const selfAdded = new Set(['meals', 'reports', 'cycle', 'history']);
    const results = $('#connection-results');
    const count = $('#source-count');
    const showConnections = $('#show-connections');
    const selectedSources = () => connections ? $$('input[name="source"]:checked', connections).map(input => input.value).filter(value => sourceLabels[value]) : [];
    function resultCategory(title, items, emptyMessage) {
      const category = make('section', undefined, 'connection-category');
      category.append(make('h4', title));
      if (items.length) {
        const list = make('ul');
        items.forEach(value => list.append(make('li', value)));
        category.append(list);
      } else category.append(make('p', emptyMessage, 'connection-empty'));
      return category;
    }
    function renderConnections() {
      if (!results || !connections) return;
      const selected = selectedSources();
      const selectedDevice = $('input[name="device"]:checked', connections);
      const device = selectedDevice?.value || 'none';
      const deviceName = selectedDevice?.closest('label')?.textContent.replace(/\s+/g, ' ').trim() || deviceLabels[device] || 'your selected device';
      results.replaceChildren();
      results.append(make('h3', 'Here’s what you can bring into Orb'));
      results.append(make('p', 'Explore the supported information from your selections and see how it can contribute to your daily view.'));
      const grid = make('div', undefined, 'connection-result-grid');
      const checkText = device !== 'none'
        ? `Compatibility to be confirmed for ${deviceName}.`
        : 'Choose an integration to check availability. You can use Orb without connecting a wearable.';
      const connectCategory = resultCategory('Available to connect', [], checkText);
      const deviceSources = selected.filter(value => !selfAdded.has(value));
      if (deviceSources.length) connectCategory.append(make('p', `Selected for a compatibility check: ${deviceSources.map(value => sourceLabels[value]).join(', ')}.`, 'connection-pending'));
      grid.append(connectCategory);
      grid.append(resultCategory('Add or log yourself', selected.filter(value => selfAdded.has(value)).map(value => sourceLabels[value]), 'Select meals, existing reports, cycle information or health history to explore adding them yourself.'));
      grid.append(resultCategory('Not currently supported', [], 'Unsupported sources have not been confirmed in this preview.'));
      results.append(grid);
      results.append(make('p', 'Device compatibility will be confirmed when integrations are configured.', 'demo-note'));
      const action = make('button', 'Get Started with Orb', 'btn btn-primary');
      action.type = 'button';
      action.dataset.download = '';
      results.append(action);
      results.hidden = false;
      showConnections?.setAttribute('aria-expanded', 'true');
    }
    function updateSources() {
      const selected = selectedSources();
      if (count) count.textContent = selected.length
        ? `${selected.length} ${selected.length === 1 ? 'source' : 'sources'} selected. Add any others you use.`
        : 'No sources selected. Select the information you already track or have available.';
      if (showConnections) showConnections.disabled = !selected.length;
      if (connections) $$('input[name="source"], input[name="device"]', connections).forEach(input => input.closest('label')?.classList.toggle('is-selected', input.checked));
      if (results && !selected.length) {
        results.replaceChildren();
        results.hidden = true;
        showConnections?.setAttribute('aria-expanded', 'false');
      } else if (results && !results.hidden) renderConnections();
    }
    if (connections) {
      const fields = $$('input[name="source"]', connections);
      if (!fields.some(input => input.checked)) fields.forEach(input => { input.checked = input.value !== 'glucose'; });
      if (!$('input[name="device"]:checked', connections)) {
        const none = $('input[name="device"][value="none"]', connections);
        if (none) none.checked = true;
      }
      connections.addEventListener('change', updateSources);
      const form = connections.matches('form') ? connections : $('form', connections);
      const revealResults = () => {
        if (!selectedSources().length) return;
        renderConnections();
        scrollTo(results);
        results?.focus({ preventScroll: true });
      };
      form?.addEventListener('submit', event => { event.preventDefault(); revealResults(); });
      if (count) count.setAttribute('aria-live', 'polite');
      if (showConnections) {
        showConnections.setAttribute('aria-controls', 'connection-results');
        showConnections.setAttribute('aria-expanded', 'false');
        showConnections.addEventListener('click', event => {
          event.preventDefault();
          revealResults();
        });
      }
      updateSources();
    }

    const dialog = $('#detail-dialog');
    const dialogTitle = $('#dialog-title');
    const dialogDescription = $('#dialog-description');
    const dialogContent = $('#dialog-content');
    let dialogOpener = null;
    function openDialog(title, description, trigger) {
      if (!dialog || !dialogTitle || !dialogDescription || !dialogContent) return false;
      dialogOpener = trigger || document.activeElement;
      dialogTitle.textContent = title;
      dialogDescription.textContent = description;
      dialogContent.replaceChildren();
      if (!dialog.open) dialog.showModal();
      return true;
    }
    function showDownloads(trigger) {
      if (!openDialog('Choose your app store', 'Get Orb on the device you use every day.', trigger)) return;
      const actions = make('div', undefined, 'dialog-actions');
      [['App Store', config.appStoreUrl], ['Google Play', config.googlePlayUrl]].forEach(([label, value]) => {
        const href = destination(value);
        const action = make(href ? 'a' : 'button', label, 'btn btn-primary');
        if (href) { action.href = href; action.target = '_blank'; action.rel = 'noopener noreferrer'; }
        else { action.type = 'button'; action.disabled = true; }
        actions.append(action);
      });
      dialogContent.append(actions);
      if (!destination(config.appStoreUrl) || !destination(config.googlePlayUrl)) dialogContent.append(make('p', 'Download links are not available in this preview.', 'demo-note'));
    }
    function showEnquiry(trigger) {
      const href = destination(config.enquiryUrl);
      if (href) { window.location.assign(href); return; }
      if (openDialog(trigger.dataset.title || 'Talk with the Cureocity team', trigger.dataset.description || 'Explore the care, assessment and hub options that fit your goals.', trigger)) {
        dialogContent.append(make('p', 'The enquiry link is not available in this preview. No personal information is collected here.', 'demo-note'));
      }
    }
    $('#dialog-close')?.addEventListener('click', () => dialog?.close());
    dialog?.addEventListener('close', () => { if (dialogOpener instanceof HTMLElement && document.contains(dialogOpener)) dialogOpener.focus({ preventScroll: true }); });
    dialog?.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-download], [data-store], [data-enquiry], [data-detail]');
      if (!trigger || trigger.disabled) return;
      event.preventDefault();
      if (trigger.hasAttribute('data-store')) {
        const href = destination(trigger.dataset.store === 'apple' ? config.appStoreUrl : config.googlePlayUrl);
        if (href) window.location.assign(href);
        else showDownloads(trigger);
      } else if (trigger.hasAttribute('data-download')) showDownloads(trigger);
      else if (trigger.hasAttribute('data-enquiry') || ['hub-visit', 'contact'].includes(trigger.dataset.detail)) showEnquiry(trigger);
      else if (openDialog(trigger.dataset.title || trigger.textContent.trim(), trigger.dataset.description || 'Explore the information on this homepage to learn more.', trigger)) {
        const target = trigger.dataset.target;
        if (target && /^#[A-Za-z][\w-]*$/.test(target) && $(target)) {
          const link = make('a', trigger.dataset.actionLabel || 'Explore this section', 'btn btn-primary');
          link.href = target;
          link.addEventListener('click', () => dialog.close());
          dialogContent.append(link);
        } else dialogContent.append(make('p', 'This preview shows the homepage design. The full detail page is not connected yet.', 'demo-note'));
      }
    });

    document.documentElement.classList.add('js-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
