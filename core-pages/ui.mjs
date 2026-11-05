// Shared presentation primitives for the public information pages.
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const button = (label, action, variant='') => `<button type="button" class="button ${escape(variant)}" data-action="${escape(action)}">${escape(label)}</button>`;
export const link = (label, href, variant='') => `<a class="button ${escape(variant)}" href="${escape(href)}">${escape(label)}</a>`;
export function hero({eyebrow,title,copy,actions='',image='',alt='',note='',theme=''}) {
  return `<section class="core-hero ${escape(theme)}"><div class="container"><nav class="core-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${escape(eyebrow)}</span></nav><div class="core-hero-grid ${image?'':'core-hero-text'}"><div class="core-hero-copy"><span class="tag">${escape(eyebrow)}</span><h1>${title}</h1><p>${copy}</p>${actions?`<div class="core-actions">${actions}</div>`:''}${note?`<p class="core-hero-note">${note}</p>`:''}</div>${image?`<figure class="core-hero-visual"><img src="${escape(image)}" alt="${escape(alt)}" fetchpriority="high"><figcaption>${escape(alt.startsWith('Illustrative')?'Illustrative example':'')}</figcaption></figure>`:''}</div></div></section>`;
}
export function section({id='',title='',copy='',body,tone=''}) {
  return `<section ${id?`id="${escape(id)}"`:''} class="core-section ${escape(tone==='soft'?'core-soft':tone)}"><div class="container">${title?`<header class="core-section-head reveal"><h2>${title}</h2>${copy?`<p>${copy}</p>`:''}</header>`:''}${body}</div></section>`;
}
export function cards(items,cols=3){
  return `<div class="core-grid core-grid-${cols}">${items.map(item=>`<article class="core-card reveal">${item.icon?(item.icon.startsWith('assets/')?`<img class="core-card-icon" src="${escape(item.icon)}" alt="" width="48" height="48" loading="lazy">`:`<svg class="icon core-card-icon" aria-hidden="true"><use href="#${escape(item.icon)}"/></svg>`):''}<h3>${item.title}</h3><p>${item.copy}</p>${item.action?`<div class="core-card-action">${item.action}</div>`:''}</article>`).join('')}</div>`;
}
export const faq = items => `<div class="core-faq">${items.map(item=>`<details><summary>${item.q}</summary><div class="core-faq-answer">${item.a}</div></details>`).join('')}</div>`;
export const notice = (title,copy) => `<aside class="core-notice"><strong>${title}</strong><p>${copy}</p></aside>`;
export function cta({title,copy,actions}){return `<section class="core-section core-cta-section"><div class="container"><div class="core-cta reveal"><div><h2>${title}</h2><p>${copy}</p></div><div class="core-actions">${actions}</div></div></div></section>`;}
