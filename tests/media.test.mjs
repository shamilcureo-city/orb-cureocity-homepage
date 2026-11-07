import assert from 'node:assert/strict';
import {ambientPlaybackAllowed,createAmbientController,createVimeoLoader,testimonialPlayFailure,initOrbMedia} from '../media.js';
const flush=()=>new Promise(resolve=>setTimeout(resolve,0));
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}};
function fakePlayer({ready=Promise.resolve(),play=()=>Promise.resolve()}={}){
  const events={};const calls={play:0,pause:0,destroy:0,muted:[],order:[]};
  return {calls,on(name,fn){events[name]=fn},emit(name,data){events[name]?.(data)},ready:()=>ready,setMuted:async value=>{calls.muted.push(value);calls.order.push('muted')},play:()=>{calls.play++;calls.order.push('play');return play()},pause:async()=>{calls.pause++},destroy:async()=>{calls.destroy++}};
}
const allowed={inView:true,documentHidden:false,modalOpen:false,reducedMotion:false,unavailable:false};
assert.equal(ambientPlaybackAllowed(allowed),true);
for(const key of Object.keys(allowed))assert.equal(ambientPlaybackAllowed({...allowed,[key]:key==='inView'?false:true}),false,key);

// A real provider error cannot be turned into a misleading browser play hint.
{
 const current={active:true,alreadyFailed:false};
 assert.equal(testimonialPlayFailure({name:'NotAllowedError',message:'Permission denied'},current),'manual-play');
 assert.equal(testimonialPlayFailure(new Error("play() failed because the user didn't interact with the document first"),current),'manual-play');
 for(const error of [{name:'PrivacyError',message:'This video cannot autoplay'},{name:'PasswordError',message:'Password required'},new Error('Video response timed out.'),new Error('Provider unavailable')]) assert.equal(testimonialPlayFailure(error,current),'failed');
 assert.equal(testimonialPlayFailure({name:'NotAllowedError'},{active:true,alreadyFailed:true}),'ignore','late play rejection must preserve earlier provider error');
 assert.equal(testimonialPlayFailure(new Error('Provider failed'),{active:false,alreadyFailed:false}),'ignore','closed or replaced dialogs must not be changed');
}

// Slow ready, overlapping syncs, and scrolling out cannot start stale playback.
{
 const loading=deferred();let visible=true;const p=fakePlayer({ready:loading.promise});let creates=0;
 const c=createAmbientController({eligible:()=>visible,createPlayer:async()=>{creates++;return p}});
 const first=c.sync();await flush();const second=c.sync();await flush();
 assert.equal(p.calls.play,0,'never play before provider ready');assert.equal(creates,1);
 visible=false;await c.sync();loading.resolve();await Promise.all([first,second]);
 assert.equal(p.calls.play,0);assert.equal(c.getState(),'paused');
 visible=true;await c.sync();assert.equal(p.calls.play,1);assert.deepEqual(p.calls.order,['muted','play']);
 c.destroy();
}
// Leaving while play resolves (or a late play event arrives) immediately pauses again.
{
 const starting=deferred();let visible=true;const p=fakePlayer({play:()=>starting.promise});
 const c=createAmbientController({eligible:()=>visible,createPlayer:async()=>p});
 const pending=c.sync();await flush();assert.equal(p.calls.play,1);
 visible=false;await c.sync();const paused=p.calls.pause;p.emit('play');assert.ok(p.calls.pause>paused);
 starting.resolve();await pending;assert.equal(c.getState(),'paused');c.destroy();
}
// A carousel pause that interrupts pending playback is not a provider failure.
{
 const starting=deferred();let visible=true;let attempts=0;
 const p=fakePlayer({play:()=>++attempts===1?starting.promise:Promise.resolve()});
 const c=createAmbientController({eligible:()=>visible,createPlayer:async()=>p});
 const pending=c.sync();await flush();visible=false;await c.sync();
 p.emit('error',{method:'play',name:'AbortError',message:'Playback interrupted by pause'});
 starting.reject(new Error('Playback interrupted by pause'));await pending;
 assert.equal(c.getState(),'paused');assert.equal(p.calls.destroy,0);
 visible=true;await c.sync();assert.equal(c.getState(),'playing');assert.equal(p.calls.play,2);c.destroy();
}
// Returning before an interrupted request settles recovers automatically, without another scroll.
{
 const starting=deferred();let visible=true;let attempts=0;
 const p=fakePlayer({play:()=>++attempts===1?starting.promise:Promise.resolve()});
 const c=createAmbientController({eligible:()=>visible,createPlayer:async()=>p});
 const pending=c.sync();await flush();visible=false;await c.sync();visible=true;await c.sync();
 starting.reject(new Error('Playback interrupted by pause'));await pending;await flush();
 assert.equal(c.getState(),'playing');assert.equal(p.calls.play,2);assert.equal(p.calls.destroy,0);c.destroy();
}
// A timed-out obsolete play request also leaves a usable paused player.
{
 let visible=true;const p=fakePlayer({play:()=>new Promise(()=>{})});
 const c=createAmbientController({eligible:()=>visible,createPlayer:async()=>p,timeoutMs:10});
 const pending=c.sync();await flush();visible=false;await c.sync();await pending;
 assert.equal(c.getState(),'paused');assert.equal(p.calls.destroy,0);c.destroy();
}
// No SDK/player creation for hidden, reduced-motion, or otherwise ineligible content.
{
 let creates=0;const c=createAmbientController({eligible:()=>false,createPlayer:async()=>{creates++;return fakePlayer()}});
 await c.sync();await c.sync();assert.equal(creates,0);assert.equal(c.getState(),'idle');c.destroy();
}
// Failed providers retain a static state, without automatic repeated requests.
{
 let creates=0;const p=fakePlayer({play:()=>Promise.reject(new Error('autoplay blocked'))});
 const c=createAmbientController({eligible:()=>true,createPlayer:async()=>{creates++;return p}});
 await c.sync();assert.equal(c.getState(),'failed');assert.equal(p.calls.destroy,1);
 await c.sync();assert.equal(creates,1);c.destroy();
}
// A provider that never becomes ready reaches a failed poster state instead of loading forever.
{
 const p=fakePlayer({ready:new Promise(()=>{})});
 const c=createAmbientController({eligible:()=>true,createPlayer:async()=>p,timeoutMs:10});
 await c.sync();assert.equal(c.getState(),'failed');assert.equal(p.calls.play,0);assert.equal(p.calls.destroy,1);c.destroy();
}
// Releasing an offscreen frame invalidates an in-flight creation and destroys it.
{
 const loading=deferred();const p=fakePlayer();
 const c=createAmbientController({eligible:()=>true,createPlayer:()=>loading.promise});
 const pending=c.sync();c.release();loading.resolve(p);await pending;
 assert.equal(p.calls.play,0);assert.equal(p.calls.destroy,1);assert.equal(c.getState(),'idle');c.destroy();
}
// Runtime provider errors return to the static poster and remove the failed frame.
{
 const p=fakePlayer();const c=createAmbientController({eligible:()=>true,createPlayer:async()=>p});
 await c.sync();assert.equal(c.getState(),'playing');p.emit('error');
 assert.equal(c.getState(),'failed');assert.equal(p.calls.destroy,1);c.destroy();
}
// SDK is shared between visible sections and testimonial requests; failures can retry.
{
 const scripts=[];const win={};const doc={head:{append:el=>scripts.push(el)},createElement:()=>({remove(){this.removed=true}})};
 const load=createVimeoLoader(win,doc,1000);
 const one=load();const two=load();assert.equal(one,two);assert.equal(scripts.length,1);
 win.Vimeo={Player:class{}};scripts[0].onload();assert.equal(await one,win.Vimeo);assert.equal(await load(),win.Vimeo);
}
{
 const scripts=[];const win={};const doc={head:{append:el=>scripts.push(el)},createElement:()=>({remove(){this.removed=true}})};
 const load=createVimeoLoader(win,doc,1000);const first=load();scripts[0].onerror();
 await assert.rejects(first,/could not be reached/);assert.equal(scripts[0].removed,true);
 const next=load();assert.equal(scripts.length,2);win.Vimeo={Player:class{}};scripts[1].onload();await next;
}
// Back-forward cache restore reactivates released ambient controllers.
{
 const events={};let observer;const players=[];
 const iframe={setAttribute(){}};const mount={style:{},querySelector:()=>iframe};
 const node={dataset:{orbVimeo:'hero',videoFit:'cover',videoVisible:'true'},classList:{toggle(){}},getClientRects:()=>[{}],closest:()=>null,getBoundingClientRect:()=>({width:800,height:450}),querySelector:()=>mount};
 const win={ORB_MEDIA:{ambient:{hero:{id:'12345',width:1920,height:1080}}},Vimeo:{Player:class{constructor(){const p=fakePlayer();players.push(p);return p}}},matchMedia:()=>({matches:false,addEventListener(){}}),getComputedStyle:()=>({getPropertyValue:()=>''}),addEventListener:(name,handler)=>events[name]=handler,IntersectionObserver:class{constructor(callback){observer=callback}observe(){}},ResizeObserver:class{observe(){}}};
 const doc={hidden:false,body:{classList:{contains:()=>false}},documentElement:{classList:{contains:()=>false}},querySelectorAll:()=>[node],querySelector:()=>null,getElementById:()=>null,addEventListener(){}};
 initOrbMedia(win,doc);observer([{target:node,isIntersecting:true,intersectionRatio:1}]);await flush();await flush();
 assert.equal(players.length,1);assert.equal(players[0].calls.play,1);
 events.pagehide({persisted:true});assert.equal(players[0].calls.destroy,1);
 events.pageshow({persisted:true});await flush();await flush();
 assert.equal(players.length,2,'BFCache restore creates a fresh playable frame');assert.equal(players[1].calls.play,1);
 events.pagehide({persisted:false});events.pageshow({persisted:true});await flush();
 assert.equal(players.length,2,'a genuinely disposed page remains disposed');
}
console.log('Passed Vimeo lifecycle checks: visibility/motion/modal policy, shared lazy SDK, ready/play races, late events, muted startup, offscreen release and honest provider failure. Fake SDK only; live playback requires browser verification.');
