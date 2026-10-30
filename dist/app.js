/* Orb page interactions. The optional microphone trial is isolated in voice.js. */
(() => {
  'use strict';
  const config = window.ORB_CONFIG;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionReduced = () => reducedMotion.matches || document.documentElement.classList.contains('reduce-motion');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  document.documentElement.classList.add('motion-ready');
  const ownTabs = group => $$('[role="tab"]', group).filter(tab => tab.closest('[data-tabs]') === group);
  const carousels = new Map();
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 25);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menu = $('#mobile-menu');
  const actionDialog = $('#action-dialog');
  const updateLock = () => {
    document.body.classList.toggle('modal-open', menu.open || actionDialog.open);
    document.dispatchEvent(new Event('orb:panelchange'));
  };
  $('#menu-toggle').addEventListener('click', () => {
    menu.showModal(); $('#menu-toggle').setAttribute('aria-expanded', 'true'); updateLock();
  });
  $('#menu-close').addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => { $('#menu-toggle').setAttribute('aria-expanded', 'false'); updateLock(); });
  [menu, actionDialog].forEach(dialog => {
    dialog.addEventListener('keydown', event => {
      if(event.key !== 'Tab') return;
      const focusable = $$('a[href], button:not([disabled]), [tabindex="0"]', dialog).filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
  $$('a[href^="#"]', menu).forEach(link => link.addEventListener('click', () => menu.close()));
  matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches && menu.open) {
      menu.close();
      $('.desktop-nav a')?.focus({ preventScroll: true });
    }
  });
  $('.dialog-close').addEventListener('click', () => actionDialog.close());
  actionDialog.addEventListener('close', updateLock);

  function safeUrl(value) {
    if (!value) return null;
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
  }
  function element(tag, text, className) {
    const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el;
  }
  function openAction(key) {
    const action = config.actions[key];
    if (!action) return;
    if (menu.open) menu.close();
    const url = safeUrl(config.destinations[action.urlKey]);
    if (url && key !== 'download') { location.assign(url); return; }
    $('#action-title').textContent = action.title;
    $('#action-body').textContent = action.body;
    $('#action-kicker').textContent = 'Website preview';
    const content = $('#action-content'); content.replaceChildren();
    if (key === 'download') {
      const available = [config.destinations.appStoreUrl, config.destinations.googlePlayUrl].some(safeUrl);
      $('#action-body').textContent = available ? 'Choose an available Orb store listing for your device. Unavailable store links are shown below.' : 'Verified Orb store links are awaiting confirmation. You can explore the app experience and free starting points on this page. No download or account is started here.';
      const choices = element('div', '', 'download-choices');
      for (const [platform, urlKey, icon] of [['App Store', 'appStoreUrl', '↗'], ['Google Play', 'googlePlayUrl', '▷']]) {
        const storeUrl = safeUrl(config.destinations[urlKey]);
        const row = element(storeUrl ? 'a' : 'div', '', 'store-choice');
        if (storeUrl) { row.href = storeUrl; row.target = '_blank'; row.rel = 'noopener noreferrer'; }
        const symbol = element('span', icon); symbol.setAttribute('aria-hidden', 'true');
        const description = element('div'); description.append(element('h3', platform), element('p', storeUrl ? 'Open the verified Orb listing' : 'Verified Orb listing awaiting confirmation'));
        row.append(symbol, description); choices.append(row);
      }
      content.append(choices);
      const link = element('a', 'Explore the free starting points', 'text-link'); link.href = '#free-tools'; link.addEventListener('click', () => actionDialog.close()); content.append(link);
    } else if (action.note) content.append(element('p', action.note, 'dialog-note'));
    actionDialog.showModal(); updateLock();
  }
  document.addEventListener('click', event => { const control = event.target.closest('[data-action]'); if (control) openAction(control.dataset.action); });

  const motionControls = $$('[data-motion-toggle], #motion-toggle');
  function updateMotionControls() {
    const paused = motionReduced();
    motionControls.forEach(control => {
      const label = reducedMotion.matches ? 'Animations paused by your device setting' : paused ? 'Resume animations' : 'Pause animations';
      control.setAttribute('aria-pressed', String(paused));
      control.setAttribute('aria-label', label); control.title = label;
      control.disabled = reducedMotion.matches;
      if (!control.classList.contains('motion-control')) control.textContent = label;
    });
    document.dispatchEvent(new Event('orb:motionchange'));
  }
  motionControls.forEach(control => control.addEventListener('click', () => {
    document.documentElement.classList.toggle('reduce-motion'); updateMotionControls();
  }));
  reducedMotion.addEventListener('change', updateMotionControls);
  updateMotionControls();

  function updateIndicator(group, tab) {
    const list = tab?.closest('[role="tablist"]');
    if (!list || !tab || !tab.getClientRects().length) return;
    const r = tab.getBoundingClientRect(), parent = list.getBoundingClientRect();
    list.style.setProperty('--tab-x', `${r.left - parent.left}px`);
    list.style.setProperty('--tab-y', `${r.top - parent.top}px`);
    list.style.setProperty('--tab-w', `${r.width}px`);
    list.style.setProperty('--tab-h', `${r.height}px`);
    list.classList.add('with-indicator');
  }
  function activateTab(tab, focus = false) {
    const group = tab.closest('[data-tabs]');
    if (carousels.has(group)) { carousels.get(group).select(ownTabs(group).indexOf(tab), focus); return; }
    ownTabs(group).forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      panel.hidden = !selected; panel.classList.remove('panel-enter');
      if (!selected) $$('video', panel).forEach(video => video.pause());
      if (selected && !motionReduced()) { void panel.offsetWidth; panel.classList.add('panel-enter'); }
    });

    if (tab.id === 'tab-cgm') requestAnimationFrame(revealChart);
    updateIndicator(group, tab);
    if (focus) tab.focus();
    $$('[data-tabs]', group).forEach(nested => updateIndicator(nested, ownTabs(nested).find(t => t.getAttribute('aria-selected') === 'true')));
    requestAnimationFrame(() => $$('[data-carousel]', group).forEach(nested => carousels.get(nested)?.layout()));
    document.dispatchEvent(new Event('orb:panelchange'));
  }
  // Real, independently controlled tracks: tabs, arrows, touch and mouse share one state.
  $$('[data-carousel]').forEach(group => {
    const own = selector => $$(selector, group).filter(el => el.closest('[data-carousel]') === group);
    const track = own('[data-carousel-track]')[0];
    const viewport = own('[data-carousel-viewport]')[0] || track.parentElement;
    const slides = own('[data-carousel-slide]');
    if (!track || !slides.length) return;
    viewport.tabIndex = 0;
    viewport.setAttribute('role','group');
    viewport.setAttribute('aria-roledescription','carousel');
    if (!viewport.hasAttribute('aria-label')) viewport.setAttribute('aria-label', `${group.dataset.carousel.replaceAll('-',' ')}. Use left and right arrows to browse.`);
    const tabs = group.hasAttribute('data-tabs') ? ownTabs(group) : [];
    let index = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
    let offset = 0, pointer = null, suppressClick = false;
    let autoTimer = null, inView = false, hovered = false, autoPaused = false, allowFocusedResume = false;
    const duration = ({connected:9000,features:7500,'blueprint-online-steps':10000,'blueprint-centre-steps':10000,doctors:7000,'pro-gallery':6500,members:6500})[group.dataset.carousel] || 7500;
    group.style.setProperty('--slide-duration', `${duration}ms`);
    const controls = own('.carousel-controls')[0];
    const autoButton = element('button', '', 'carousel-auto-toggle');
    autoButton.type = 'button'; autoButton.dataset.carouselToggle = '';
    autoButton.innerHTML = '<span class="motion-pause-icon" aria-hidden="true"></span>';
    controls?.append(autoButton);
    const progress = element('div', '', 'carousel-progress');
    progress.setAttribute('aria-hidden', 'true'); progress.append(element('span'));
    group.append(progress);
    const visibleCount = () => Math.max(1, Math.min(slides.length, parseInt(getComputedStyle(group).getPropertyValue('--carousel-visible')) || 1));
    const maxIndex = () => slides.length - visibleCount();
    const label = slide => slide.getAttribute('aria-label') || document.getElementById(slide.getAttribute('aria-labelledby'))?.textContent.trim() || $('h2,h3',slide)?.textContent.trim() || '';
    function layout() {
      if (!track.getClientRects().length || !track.offsetWidth) return;
      index = Math.min(index, maxIndex());
      offset = slides[index].offsetLeft - slides[0].offsetLeft;
      track.style.setProperty('--carousel-offset', `${-offset}px`);
      if (group.classList.contains('nl-blueprint-stages')) {
        const media = slides[index]?.querySelector('.nl-blueprint-media');
        if (media) group.style.setProperty('--blueprint-arrow-y', `${media.offsetHeight / 2}px`);
      }
    }
    function select(next, focus = false, announce = true) {
      const previousIndex = index;
      index = Math.max(0, Math.min(maxIndex(), next));
      group.dataset.carouselIndex = String(index);
      slides.forEach((slide, i) => {
        const visible = i >= index && i < index + visibleCount();
        slide.hidden = false; slide.inert = !visible;
        slide.setAttribute('aria-hidden', String(!visible));
        slide.classList.toggle('is-active', i === index);
        if (!visible) $$('video', slide).forEach(video => video.pause());
      });
      tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      own('[data-carousel-go]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.carouselGo) === index)));
      own('[data-carousel-prev]').forEach(button => button.disabled = index === 0);
      own('[data-carousel-next]').forEach(button => button.disabled = index === maxIndex());
      own('.carousel-controls').forEach(controls => controls.hidden = maxIndex() === 0);
      progress.hidden = maxIndex() === 0;
      own('[data-carousel-status]').forEach(status => {
        status.setAttribute('aria-live',announce ? 'polite' : 'off');
        status.textContent = `${index + 1} / ${slides.length}${label(slides[index]) ? ` · ${label(slides[index])}` : ''}`;
      });
      layout();
      if (tabs[index]) {
        updateIndicator(group,tabs[index]);
        const list = tabs[index].closest('[role="tablist"]');
        if (list.scrollWidth > list.clientWidth) list.scrollTo({left:tabs[index].offsetLeft - list.offsetLeft - (list.clientWidth - tabs[index].offsetWidth)/2,behavior:motionReduced()?'instant':'smooth'});
        if (focus) tabs[index].focus({preventScroll:true});
      }
      group.dispatchEvent(new CustomEvent('orb:slidechange',{bubbles:true}));
      if (previousIndex !== index) {
        slides.forEach(slide => slide.classList.remove('slide-arrive'));
        if (!motionReduced()) { void slides[index].offsetWidth; slides[index].classList.add('slide-arrive'); }
      }
      stopAuto(); scheduleAuto();
    }
    function stopAuto() {
      clearTimeout(autoTimer); autoTimer = null; group.classList.remove('is-auto-playing');
    }
    function canAutoPlay() {
      const focusBlocks = group.contains(document.activeElement) && !(allowFocusedResume && document.activeElement === autoButton);
      return inView && maxIndex() > 0 && !autoPaused && !hovered && !pointer && !motionReduced() && !document.hidden && !document.body.classList.contains('modal-open') && !group.closest('[hidden]') && !focusBlocks && !group.querySelector('details[open]');
    }
    function scheduleAuto() {
      autoButton.setAttribute('aria-pressed', String(autoPaused));
      autoButton.setAttribute('aria-label', autoPaused ? 'Resume automatic slides' : 'Pause automatic slides');
      autoButton.title = autoPaused ? 'Resume automatic slides' : 'Pause automatic slides';
      autoButton.disabled = motionReduced();
      if (!canAutoPlay()) { stopAuto(); return; }
      if (autoTimer !== null) return;
      progress.replaceChildren(element('span'));
      group.classList.add('is-auto-playing');
      autoTimer = setTimeout(() => {
        autoTimer = null;
        if (!canAutoPlay()) { stopAuto(); return; }
        const wrapping = index === maxIndex();
        if (wrapping) group.classList.add('is-resetting');
        select(wrapping ? 0 : index + 1, false, false);
        if (wrapping) {
          void track.offsetWidth;
          requestAnimationFrame(() => group.classList.remove('is-resetting'));
          if (!motionReduced()) viewport.animate([{opacity:.35},{opacity:1}],{duration:350,easing:'ease-out'});
        }
      }, duration);
    }
    autoButton.addEventListener('click', () => { autoPaused = !autoPaused; allowFocusedResume = !autoPaused; stopAuto(); scheduleAuto(); });
    group.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; stopAuto(); } });
    group.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; scheduleAuto(); } });
    group.addEventListener('focusin', () => { allowFocusedResume = false; stopAuto(); });
    group.addEventListener('focusout', () => requestAnimationFrame(scheduleAuto));
    group.addEventListener('toggle', scheduleAuto, true);
    document.addEventListener('visibilitychange', scheduleAuto);
    document.addEventListener('orb:motionchange', scheduleAuto);
    document.addEventListener('orb:panelchange', scheduleAuto);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .18;
        scheduleAuto();
      }, {threshold:[0,.18]}).observe(viewport);
    }
    carousels.set(group,{select,layout});
    group.classList.add('carousel-ready');
    own('[data-carousel-prev]').forEach(button => button.addEventListener('click',()=>select(index-1)));
    own('[data-carousel-next]').forEach(button => button.addEventListener('click',()=>select(index+1)));
    own('[data-carousel-go]').forEach(button => button.addEventListener('click',()=>select(Number(button.dataset.carouselGo))));
    viewport.addEventListener('keydown',event => {
      if (event.target !== viewport) return;
      const next = {ArrowRight:index+1,ArrowLeft:index-1,Home:0,End:maxIndex()}[event.key];
      if (next !== undefined) { event.preventDefault(); select(next); }
    });
    viewport.addEventListener('dragstart',event => event.preventDefault());
    viewport.addEventListener('pointerdown',event => {
      if (!event.isPrimary || event.button !== 0 || event.target.closest('button,a,summary,input,select,textarea')) return;
      const video = event.target.closest('video');
      // Leave the native video control strip available for scrubbing and playback.
      if (video?.controls && event.clientY > video.getBoundingClientRect().bottom - 64) return;
      pointer = {id:event.pointerId,x:event.clientX,y:event.clientY,dragging:false,delta:0}; suppressClick = false;
      stopAuto();
    });
    viewport.addEventListener('pointermove',event => {
      if (!pointer || event.pointerId !== pointer.id) return;
      const dx = event.clientX-pointer.x, dy = event.clientY-pointer.y;
      if (!pointer.dragging && Math.abs(dy)>12 && Math.abs(dy)>Math.abs(dx)) { pointer=null; scheduleAuto(); return; }
      if (!pointer.dragging && Math.abs(dx)>8 && Math.abs(dx)>Math.abs(dy)*1.15) {
        pointer.dragging=true; viewport.setPointerCapture(event.pointerId); group.classList.add('is-dragging');
      }
      if (pointer.dragging) {
        if (event.cancelable) event.preventDefault();
        pointer.delta = dx; suppressClick = true;
        const resistance = (index===0 && dx>0) || (index===maxIndex() && dx<0) ? .2 : 1;
        track.style.setProperty('--carousel-offset',`${-offset + dx*resistance}px`);
      }
    });
    function release(event, cancelled = false) {
      if (!pointer || event.pointerId !== pointer.id) return;
      const delta = pointer.delta, wasDragging=pointer.dragging;
      pointer=null; group.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      const threshold = Math.min(85,Math.max(40,viewport.clientWidth*.12));
      if (wasDragging) select(index + (!cancelled && Math.abs(delta)>=threshold ? (delta<0?1:-1) : 0));
      else scheduleAuto();
    }
    viewport.addEventListener('pointerup',event=>release(event));
    viewport.addEventListener('pointercancel',event=>release(event,true));
    viewport.addEventListener('click',event => {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick=false; return; }
      if (event.target.closest('button,a,video,summary')) return;
      const peek = slides.findIndex(slide => { const r=slide.getBoundingClientRect(); return event.clientX>=r.left && event.clientX<=r.right && event.clientY>=r.top && event.clientY<=r.bottom; });
      if (peek>=0 && peek!==index) select(peek);
    },true);
    new ResizeObserver(()=>select(index,false,false)).observe(viewport);
    select(index,false,false);
  });
  $$('[data-tabs]').forEach(group => {
    const tabs = ownTabs(group);
    updateIndicator(group, tabs.find(tab => tab.getAttribute('aria-selected') === 'true'));
    new ResizeObserver(() => updateIndicator(group, tabs.find(tab => tab.getAttribute('aria-selected') === 'true'))).observe(group);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        const vertical = tab.closest('[role=tablist]').getAttribute('aria-orientation') === 'vertical';
        if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
        if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
      });
    });
  });
  $$('[data-demo-target]').forEach(button => button.addEventListener('click', () => {
    const target = {fitness:'tab-fitness',nutrition:'tab-food',day:'tab-day'}[button.dataset.demoTarget];
    const tab = document.getElementById(target); if (!tab) return; activateTab(tab); $('#features').scrollIntoView({behavior: motionReduced() ? 'instant' : 'smooth'}); tab.focus({preventScroll:true});
  }));


  const ambientVideos = $$('video[data-ambient]');
  function syncAmbient(video) {
    const slide = video.closest('[data-carousel-slide]');
    const allowed = video.dataset.inView === 'true' && !document.hidden && !document.body.classList.contains('modal-open') && !motionReduced() && !video.closest('[hidden]') && (!slide || slide.getAttribute('aria-hidden') !== 'true');
    if (allowed) { video.muted = true; video.play().catch(() => {}); }
    else video.pause();
  }
  if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver(entries => entries.forEach(entry => { entry.target.dataset.inView = String(entry.isIntersecting && entry.intersectionRatio >= .2); syncAmbient(entry.target); }), {threshold:[0,.2]});
    ambientVideos.forEach(video => mediaObserver.observe(video));
  }
  document.addEventListener('orb:slidechange', () => ambientVideos.forEach(syncAmbient));
  document.addEventListener('orb:panelchange', () => ambientVideos.forEach(syncAmbient));
  document.addEventListener('orb:motionchange', () => ambientVideos.forEach(syncAmbient));
  document.addEventListener('visibilitychange', () => ambientVideos.forEach(syncAmbient));

  const glucose = config.examples.glucose;
  const values = glucose.readings.map(reading => reading.value);
  const stats = { average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1), min: Math.min(...values), max: Math.max(...values) };
  $$('[data-glucose-stat]').forEach(node => node.textContent = stats[node.dataset.glucoseStat]);
  const svg = $('#glucose-chart');
  const ns = 'http://www.w3.org/2000/svg';
  function svgNode(name, attributes, text) {
    const node = document.createElementNS(ns, name); Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,value)); if(text)node.textContent=text;svg.append(node);return node;
  }
  const x = i => 48 + i * 90;
  const lower = Math.floor(Math.min(...values) / 10) * 10 - 10;
  const upper = Math.ceil(Math.max(...values) / 10) * 10 + 10;
  const y = value => 174 - (value - lower) / (upper - lower) * 140;
  [lower, (upper + lower) / 2, upper].forEach(value => {
    svgNode('line',{x1:48,y1:y(value),x2:588,y2:y(value),stroke:'#dce5ed','stroke-width':1});
    svgNode('text',{x:35,y:y(value)+4,'text-anchor':'end',fill:'#52677e','font-size':12},String(value));
  });
  glucose.readings.forEach((reading,i)=>{
    svgNode('text',{x:x(i),y:205,'text-anchor':'middle',fill:'#52677e','font-size':12},reading.time);
  });
  const path = svgNode('polyline',{points:values.map((v,i)=>`${x(i)},${y(v)}`).join(' '),fill:'none',stroke:'#526f8d','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'});
  values.forEach((value,i)=>{ const circle=svgNode('circle',{cx:x(i),cy:y(value),r:4,fill:'#f7f9fb',stroke:'#526f8d','stroke-width':2}); const title=document.createElementNS(ns,'title'); title.textContent=`${glucose.readings[i].time}: ${value} ${glucose.unit}`;circle.append(title); });
  let chartRevealed = false;
  function revealChart() {
    if (chartRevealed || motionReduced() || !svg.getClientRects().length) return; chartRevealed = true;
    const length = path.getTotalLength(); path.animate([{strokeDasharray:String(length),strokeDashoffset:String(length)},{strokeDasharray:String(length),strokeDashoffset:'0'}],{duration:650,easing:'ease-out'});
  }
  if ('IntersectionObserver' in window) {
    $$('.trust-item,.mid-pro-feature,.mid-vault-benefits article,.nl-support-card,.nl-family-grid figure,.nl-start-card,.nl-footer-main>nav,.mid-voice-heading,.mid-vault-intro,.nl-pro-copy,.nl-pro-gallery').forEach((node, i) => {
      node.classList.add('reveal'); node.style.setProperty('--reveal-delay', `${(i % 3) * 75}ms`);
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.08,rootMargin:'0px 0px -20px 0px'});
    $$('.reveal').forEach(node => observer.observe(node));
    const chartObserver = new IntersectionObserver(entries => {if(entries.some(e=>e.isIntersecting)){revealChart();chartObserver.disconnect();}},{threshold:.35}); chartObserver.observe(svg);
  } else $$('.reveal').forEach(node=>node.classList.add('is-visible'));
})();
