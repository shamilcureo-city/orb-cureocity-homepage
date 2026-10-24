/* Original mesh Orb: slow, user-pausable breathing, only while on screen. */
(()=>{
  const scenes=[...document.querySelectorAll('[data-mo-scene]')];
  if(!scenes.length||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const states=scenes.map(scene=>({scene,image:scene.querySelector('[data-mo-breath]'),button:scene.querySelector('[data-mo-toggle]'),inView:false,paused:false,animation:null})).filter(state=>state.image&&state.button);
  const sync=state=>{
    const {image,button}=state;
    button.hidden=reduced.matches;
    button.setAttribute('aria-pressed',String(state.paused));
    button.setAttribute('aria-label',`${state.paused?'Resume':'Pause'} Orb motion in ${state.scene.dataset.moScene}`);
    const label=button.querySelector('[data-mo-label]');
    if(label)label.textContent=state.paused?'Resume motion':'Pause motion';
    if(reduced.matches){state.animation?.cancel();state.animation=null;return;}
    const playing=state.inView&&!state.paused&&document.visibilityState==='visible';
    if(playing){
      if(!state.animation){
        state.animation=image.animate([{transform:'scale(1)'},{transform:'scale(1.055)',offset:.5},{transform:'scale(1)'}],{duration:6000,iterations:Infinity,easing:'ease-in-out'});
      }
      state.animation.play();
    }else state.animation?.pause();
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const state=states.find(item=>item.scene===entry.target);if(state){state.inView=entry.isIntersecting&&entry.intersectionRatio>.12;sync(state);}});
  },{threshold:[0,.12,.3]});
  states.forEach(state=>{
    state.button.addEventListener('click',()=>{state.paused=!state.paused;sync(state);});
    observer.observe(state.scene);sync(state);
  });
  document.addEventListener('visibilitychange',()=>states.forEach(sync));
  reduced.addEventListener('change',()=>states.forEach(sync));
  window.addEventListener('pagehide',()=>{states.forEach(state=>{state.animation?.cancel();state.animation=null;});});
  window.addEventListener('pageshow',()=>states.forEach(sync));
})();
