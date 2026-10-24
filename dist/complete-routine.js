/* Small product demonstrations, progressively enhanced and entirely local. */
(()=>{
  const meals=document.querySelector('[data-cr-meals]');
  if(meals){
    const tabs=[...meals.querySelectorAll('[data-cr-tab]')];
    const panels=[...meals.querySelectorAll('[data-cr-panel]')];
    const tablist=meals.querySelector('[data-cr-tabs]');
    if(tablist&&tabs.length&&panels.length){
      const activate=(key,focus=false)=>{
        tabs.forEach(tab=>{const active=tab.dataset.crTab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
        panels.forEach(panel=>{panel.hidden=panel.dataset.crPanel!==key;});
      };
      tablist.setAttribute('role','tablist');tablist.hidden=false;
      tabs.forEach((tab,index)=>{
        tab.setAttribute('role','tab');tab.setAttribute('aria-controls',`cr-panel-${tab.dataset.crTab}`);
        tab.addEventListener('click',()=>activate(tab.dataset.crTab));
        tab.addEventListener('keydown',event=>{
          let next=index;
          if(event.key==='ArrowRight')next=(index+1)%tabs.length;
          else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
          else if(event.key==='Home')next=0;
          else if(event.key==='End')next=tabs.length-1;
          else return;
          event.preventDefault();activate(tabs[next].dataset.crTab,true);
        });
      });
      panels.forEach(panel=>{panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',`cr-tab-${panel.dataset.crPanel}`);panel.tabIndex=0;});
      meals.classList.add('cr-meals-enhanced');activate('plan');
    }
  }
  const voice=document.querySelector('[data-cr-voice]');
  if(!voice)return;
  const play=voice.querySelector('[data-cr-play]'),review=voice.querySelector('[data-cr-review]'),reset=voice.querySelector('[data-cr-reset]'),controls=voice.querySelector('[data-cr-controls]'),status=voice.querySelector('[data-cr-status]'),entry=voice.querySelector('[data-cr-entry]');
  if(!play||!review||!reset||!controls||!status||!entry)return;
  const label=entry.querySelector('.cr-entry-top>span');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer=null;
  controls.hidden=false;
  const complete=()=>{
    const shouldFocus=document.activeElement===play;
    clearTimeout(timer);timer=null;voice.classList.remove('cr-is-playing');play.hidden=true;play.disabled=false;review.hidden=false;reset.hidden=false;
    status.textContent='Example captured. Check the exercise, weight and repetitions.';
    if(document.visibilityState==='visible'&&shouldFocus)review.focus({preventScroll:true});
  };
  play.addEventListener('click',()=>{
    voice.classList.remove('cr-is-confirmed');play.disabled=true;reset.hidden=true;review.hidden=true;label.textContent='Example entry';
    if(reduced.matches){complete();return;}
    voice.classList.add('cr-is-playing');status.textContent='Playing the example: bench press, 40 kilograms, 10 reps.';
    timer=setTimeout(complete,1200);
  });
  review.addEventListener('click',()=>{
    voice.classList.add('cr-is-confirmed');label.textContent='Example confirmed';review.hidden=true;status.textContent='Example confirmed. In Orb, your reviewed entry belongs in your workout log.';reset.focus({preventScroll:true});
  });
  reset.addEventListener('click',()=>{
    clearTimeout(timer);timer=null;voice.classList.remove('cr-is-playing','cr-is-confirmed');play.hidden=false;play.disabled=false;review.hidden=true;reset.hidden=true;label.textContent='Example entry';status.textContent='Say it. Review it. Keep moving.';play.focus({preventScroll:true});
  });
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&timer)complete();});
  reduced.addEventListener('change',()=>{if(reduced.matches&&timer)complete();});
})();
