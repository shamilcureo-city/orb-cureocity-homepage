const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function posterSource(value) {
  if (typeof value !== 'string') return '';
  if (/^\/?assets\//.test(value) && !value.includes('..')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

export function renderTestimonials(items) {
  if (!Array.isArray(items) || !items.length) return '';
  const ids = new Set();
  const slides = items.map((item, index) => {
    const id = String(item.id);
    if (!/^\d+$/.test(id) || ids.has(id)) throw new Error(`Invalid or duplicate testimonial video ID: ${id}`);
    ids.add(id);
    const number = String(index + 1).padStart(2, '0');
    const poster = posterSource(item.poster);
    return `<article class="testimonial-card" data-carousel-slide role="group" aria-roledescription="slide" aria-label="Story ${number}" aria-hidden="${index > 2}">
      <div class="testimonial-art">
        ${poster ? `<img src="${escape(poster)}" alt="" width="540" height="780" loading="lazy" decoding="async">` : '<div class="testimonial-poster-empty"><span class="testimonial-orb" aria-hidden="true">orb</span><span>A Cureocity story</span></div>'}
        <span class="testimonial-number" aria-hidden="true">${number}</span>
      </div>
      <div class="testimonial-card-footer"><h3>Story ${number}</h3><button type="button" data-testimonial-id="${id}" aria-label="Watch story ${number}"><span>Watch story</span><svg class="icon" aria-hidden="true"><use href="#i-play"></use></svg></button></div>
    </article>`;
  }).join('\n');

  return `<section class="orb-testimonials" id="testimonials" aria-labelledby="testimonials-title">
    <div class="container nl-narrow">
      <header class="section-head reveal"><span class="tag">In their own words</span><h2 id="testimonials-title">Experiences with Cureocity.</h2><p>Hear the stories people have shared about their experience.</p></header>
      <div class="testimonial-carousel reveal" data-carousel="testimonials" role="region" aria-roledescription="carousel" aria-label="Cureocity video stories">
        <div class="testimonial-viewport" data-carousel-viewport aria-label="Cureocity stories. Use left and right arrows to browse."><div class="testimonial-track" data-carousel-track>${slides}</div></div>
        <div class="carousel-controls"><span data-carousel-status aria-live="polite" aria-atomic="true">1 / ${items.length} · Story 01</span><button type="button" data-carousel-prev aria-label="Previous stories"><svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></button><button type="button" data-carousel-next aria-label="Next stories"><svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></button></div>
      </div>
      <p class="testimonial-note">Personal experiences; services and individual results vary.</p>
    </div>
  </section>
  <dialog id="testimonial-dialog" class="testimonial-dialog" aria-labelledby="testimonial-title" aria-describedby="testimonial-status">
    <div class="testimonial-dialog-head"><h2 id="testimonial-title">Watch a Cureocity story</h2><button type="button" class="icon-button" data-testimonial-close aria-label="Close video"><svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg></button></div>
    <div id="testimonial-player" class="testimonial-player"></div>
    <p id="testimonial-status" class="testimonial-status" role="status" aria-live="polite"></p>
    <a id="testimonial-fallback" class="testimonial-fallback" target="_blank" rel="noopener noreferrer" hidden>Watch this story on Vimeo <span aria-hidden="true">↗</span></a>
  </dialog>`;
}
