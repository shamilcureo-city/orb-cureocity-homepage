(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  const settleMotion = () => { activeAnimations.forEach(animation => animation.finish()); activeAnimations.clear(); };
  const acknowledge = element => {
    if (!element || reduceMotion.matches || document.hidden || !element.animate) return;
    const animation = element.animate([{ opacity: .55, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'ease-out' });
    activeAnimations.add(animation);
    animation.onfinish = () => activeAnimations.delete(animation);
    animation.oncancel = () => activeAnimations.delete(animation);
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) settleMotion(); });
  reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) settleMotion(); });

  const vault = document.querySelector('[data-jf-vault]');
  if (vault) {
    const verify = vault.querySelector('[data-jf-verify]');
    const correct = vault.querySelector('[data-jf-correct]');
    const extractedDate = vault.querySelector('[data-jf-extracted-date]');
    const reset = vault.querySelector('[data-jf-reset]');
    const reviewState = vault.querySelector('[data-jf-review-state]');
    const reviewMessage = vault.querySelector('[data-jf-review-message]');
    const share = vault.querySelector('[data-jf-share]');
    const revoke = vault.querySelector('[data-jf-revoke]');
    const shareState = vault.querySelector('[data-jf-share-state]');
    let reviewed = false;
    let corrected = false;
    correct.addEventListener('click', () => {
      corrected = true;
      extractedDate.textContent = '08 October 2026';
      extractedDate.classList.remove('jf-date-mismatch');
      reviewState.textContent = 'Corrected · Please confirm';
      reviewMessage.textContent = 'You corrected the extracted date to match the original. Check the heading and date, then confirm the example details.';
      correct.hidden = true;
      verify.disabled = false;
      verify.focus({ preventScroll: true });
      acknowledge(extractedDate);
    });
    verify.addEventListener('click', () => {
      if (!corrected) return;
      reviewed = true;
      reviewState.textContent = 'Verified in this demo';
      reviewState.classList.add('is-reviewed');
      reviewMessage.textContent = 'You confirmed the heading and date against the example original. The original remains available above.';
      verify.hidden = true;
      reset.hidden = false;
      share.disabled = false;
      shareState.textContent = 'Not shared. Access stays off until you choose to allow it.';
      reset.focus({ preventScroll: true });
      acknowledge(reviewState);
    });
    reset.addEventListener('click', () => {
      reviewed = false;
      corrected = false;
      extractedDate.textContent = '06 October 2026';
      extractedDate.classList.add('jf-date-mismatch');
      correct.hidden = false;
      reviewState.textContent = 'Awaiting your review';
      reviewState.classList.remove('is-reviewed');
      reviewMessage.textContent = 'The extracted date differs from the original. Correct it before confirming these details.';
      verify.hidden = false;
      verify.disabled = true;
      reset.hidden = true;
      share.disabled = true;
      share.hidden = false;
      revoke.hidden = true;
      shareState.textContent = 'Not shared. Confirm the example details before allowing access.';
      correct.focus({ preventScroll: true });
    });
    share.addEventListener('click', () => {
      if (!reviewed) return;
      shareState.textContent = 'Example access active: this report only, read-only, for 7 days. No actual sharing has taken place.';
      share.hidden = true;
      revoke.hidden = false;
      revoke.focus({ preventScroll: true });
      acknowledge(shareState);
    });
    revoke.addEventListener('click', () => {
      shareState.textContent = 'Example access revoked. The chosen consultant would no longer have access through this share.';
      share.hidden = false;
      revoke.hidden = true;
      share.focus({ preventScroll: true });
      acknowledge(shareState);
    });
  }

  const insights = document.querySelector('[data-jf-insights]');
  if (!insights) return;
  const stateButtons = [...insights.querySelectorAll('[data-jf-state]')];
  const chart = insights.querySelector('[data-jf-chart]');
  const empty = insights.querySelector('[data-jf-empty]');
  const slots = [...insights.querySelectorAll('[data-jf-slot]')];
  const durationLabels = ['7h 10', '6h 55', '7h 20', '6h 40', '6h 15', '6h 05', '6h 25'];
  const fullLabel = 'Fictional sleep data for 5 to 11 October: 7 hours 10 minutes, 6 hours 55 minutes, 7 hours 20 minutes, 6 hours 40 minutes, 6 hours 15 minutes, 6 hours 5 minutes and 6 hours 25 minutes. All values are device estimates.';
  const states = {
    recent: { status: '7 nights recorded', period: '05–11 October 2026', sync: '12 Oct 2026, 07:40', source: 'Example connected wearable', heading: 'A change worth understanding.', explanation: 'Several recorded nights are shorter later in this example week. That observation can start a conversation about routine, recovery and how the person feels.', next: 'Review recent habits and add how you feel. Keep professional advice in view before adjusting your plan.', limit: 'Based on seven fictional device-estimated sleep durations. No personal baseline, symptoms or other health information are provided in this example.', announcement: 'Recent-data example selected. All seven fictional nights are displayed; no personal information has been accessed.' },
    partial: { status: '4 of 7 nights available', period: '05–11 October 2026', sync: '12 Oct 2026, 07:40', source: 'Example connected wearable', heading: 'Part of the picture is missing.', explanation: 'Three nights have no record in this example. The remaining observations are useful context, but they do not establish a complete weekly pattern.', next: 'Check the source connection and add relevant context. Missing nights stay missing; they are not counted as zero sleep.', limit: 'Only 5, 7, 9 and 11 October have fictional device estimates. No weekly average, readiness rating or complete trend is calculated from this partial example.', announcement: 'Partial-data example selected. Four nights are available; three are visibly marked as missing.' },
    empty: { status: 'No records available', period: 'No dated observations', sync: 'Not available', source: 'No sleep source connected', heading: 'Start with what you have.', explanation: 'There is no sleep information to explain yet. An empty history should remain empty, with a clear way to add context.', next: 'Begin with your goals, daily habits and existing reports. A supported wearable can add information when you choose to connect one.', limit: 'There are no observations, source timestamps or personal baselines in this state. No score, trend or health conclusion can be inferred.', announcement: 'No-data example selected. No values, trends or health conclusions are shown.' },
    stale: { status: 'Older records · Check connection', period: '05–11 September 2026', sync: '12 Sep 2026, 07:40', source: 'Example connected wearable', heading: 'Useful history. Not today’s picture.', explanation: 'These records belong to an earlier period in this example. They can remain in the history without being presented as a current view of recovery.', next: 'Check the source connection and the last sync date before using this information to inform today’s plan.', limit: 'These fictional records are from September, viewed in an October example. Their age is explicit; no current readiness or recovery status is generated.', announcement: 'Older-data example selected. September records and their last sync are shown as historical, not current.' }
  };
  stateButtons.forEach(button => button.addEventListener('click', () => {
    const state = button.dataset.jfState;
    const data = states[state];
    if (!data) return;
    insights.dataset.state = state;
    stateButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const text = (selector, value) => { insights.querySelector(selector).textContent = value; };
    text('[data-jf-data-status]', data.status);
    text('[data-jf-period]', data.period);
    text('[data-jf-sync]', data.sync);
    text('[data-jf-source]', data.source);
    text('[data-jf-explanation-heading]', data.heading);
    text('[data-jf-explanation]', data.explanation);
    text('[data-jf-next]', data.next);
    text('[data-jf-limit]', data.limit);
    text('[data-jf-insight-announcement]', data.announcement);
    chart.hidden = state === 'empty';
    empty.hidden = state !== 'empty';
    slots.forEach((slot, index) => {
      const missing = state === 'partial' && [1, 3, 5].includes(index);
      slot.classList.toggle('is-missing', missing);
      slot.querySelector('.jf-bar-value').textContent = missing ? 'No data' : durationLabels[index];
    });
    chart.setAttribute('aria-label', state === 'partial' ? 'Fictional partial sleep history for 5 to 11 October. 5 October: 7 hours 10 minutes. 6 October: no data. 7 October: 7 hours 20 minutes. 8 October: no data. 9 October: 6 hours 15 minutes. 10 October: no data. 11 October: 6 hours 25 minutes.' : state === 'stale' ? fullLabel.replace('October', 'September') + ' Historical records; not a current sleep view.' : fullLabel);
    acknowledge(insights.querySelector('[data-jf-insight-content]'));
  }));
})();
