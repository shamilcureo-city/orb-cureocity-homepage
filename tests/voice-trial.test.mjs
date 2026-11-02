import assert from 'node:assert/strict';
import { initVoiceTrial } from '../voice.js';
let time=0,nextTimer=1;
const pending=new Map();
globalThis.performance={now:()=>time};
globalThis.setTimeout=(fn,ms)=>{const id=nextTimer++;pending.set(id,{fn,at:time+ms,repeat:false});return id;};
globalThis.setInterval=(fn,ms)=>{const id=nextTimer++;pending.set(id,{fn,at:time+ms,repeat:ms});return id;};
globalThis.clearTimeout=globalThis.clearInterval=id=>pending.delete(id);
globalThis.MutationObserver=class{observe(){}};
function advance(ms){time+=ms;for(const [id,t] of [...pending])if(t.at<=time){if(t.repeat)t.at=time+t.repeat;else pending.delete(id);t.fn();}}
class Element{
  constructor(){this.listeners={};this.dataset={};this.value='';this.hidden=false;this.disabled=false;this.textContent='';this.classList={toggle(){}};}
  addEventListener(type,fn){this.listeners[type]=fn;}
  emit(type,event={}){this.listeners[type]?.(event);}
  setAttribute(name,value){this[name]=value;}
  setCustomValidity(value){this.validationMessage=value;}
  reportValidity(){return true;}
  focus(){globalThis.document.activeElement=this;}
}
function fixture(supported=true){
  pending.clear();time=0;
  const instances=[];
  class Recognition{constructor(){instances.push(this);}start(){this.started=true;}stop(){this.stopped=true;}abort(){this.aborted=true;}}
  const win=new Element(),doc=new Element(),root=new Element(),els=new Map();
  win.isSecureContext=true;if(supported)win.SpeechRecognition=Recognition;
  doc.hidden=false;doc.querySelector=()=>null;doc.querySelectorAll=()=>[];
  root.querySelector=selector=>{if(!els.has(selector))els.set(selector,new Element());return els.get(selector);};
  globalThis.window=win;globalThis.document=doc;
  root.querySelector('#voice-reviewed').hidden=true;
  initVoiceTrial(root);
  return {root,win,doc,instances,el:id=>els.get('#'+id),result(engine,text){engine.onresult({results:[Object.assign([{transcript:text}],{isFinal:true})]});}};
}
let t=fixture();
assert.equal(t.instances.length,0,'initialization must never request microphone');
assert.equal(t.el('voice-start').hidden,false);
t.el('voice-start').emit('click');let r=t.instances[0];
assert.equal(t.root['data-voice-phase'],'requesting');advance(10000);r.onstart();
assert.equal(t.root['data-voice-phase'],'listening');assert.equal(t.el('voice-words').readOnly,true);
t.result(r,'Log bench press 40 kilograms 10 reps 1 set');advance(10000);t.el('voice-end').emit('click');r.onend();
assert.equal(t.el('voice-exercise').value,'Bench press');assert.equal(t.el('voice-weight').value,'40');assert.equal(t.el('voice-countdown').textContent,'0:50');
t.el('voice-exercise').value='Edited bench press';r.onend();assert.equal(t.el('voice-exercise').value,'Edited bench press','late end must not overwrite edits');
t.el('voice-start').emit('click');r=t.instances[1];r.onstart();advance(50000);assert.equal(r.aborted,true,'budget end must abort microphone');r.onend();
assert.equal(t.el('voice-countdown').textContent,'0:00');assert.equal(t.el('voice-start').disabled,true);assert.match(t.el('voice-status').textContent,/trial is complete/);
assert.equal(t.instances.length,2,'no automatic recognition restart');
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];r.onerror({error:'not-allowed'});r.onend();
assert.match(t.el('voice-status').textContent,/not allowed/);assert.equal(t.el('voice-countdown').textContent,'1:00');assert.equal(t.el('voice-exercise').value,'');
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];r.onstart();advance(1000);t.doc.hidden=true;t.doc.emit('visibilitychange');assert.equal(r.aborted,true);r.onend();assert.match(t.el('voice-status').textContent,/left this page/);
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];advance(20000);assert.equal(r.aborted,true);r.onend();assert.match(t.el('voice-status').textContent,/did not start/);assert.equal(t.el('voice-countdown').textContent,'1:00');
t=fixture(false);assert.equal(t.el('voice-start').hidden,true);assert.equal(t.el('voice-budget').hidden,true);assert.match(t.el('voice-status').textContent,/not available/);
t.el('voice-words').value='Log squat 60 kg 8 reps 2 sets';t.el('voice-words').emit('input');assert.equal(t.el('voice-parse').disabled,false);t.el('voice-parse').emit('click');assert.equal(t.el('voice-exercise').value,'Squat');t.el('voice-entry-form').emit('submit',{preventDefault(){}});assert.equal(t.el('voice-reviewed-summary').textContent,'Squat · 60 kg · 8 reps · 2 sets');assert.equal(t.el('voice-reviewed').hidden,false);
console.log('Passed simulated recognition lifecycle: no automatic mic, permission wait, transcript review, cumulative cap, no restart, late callback protection, denial, page hiding, permission timeout and manual fallback. No live microphone/provider call performed.');

// Regression checks from the independent usability/accessibility review.
t=fixture();t.el('voice-words').value='Existing typed draft';t.el('voice-exercise').value='Saved draft exercise';t.el('voice-start').emit('click');r=t.instances[0];assert.equal(t.doc.activeElement,t.el('voice-end'));r.onerror({error:'not-allowed'});r.onend();assert.equal(t.el('voice-words').value,'Existing typed draft');assert.equal(t.el('voice-exercise').value,'Saved draft exercise');assert.equal(t.doc.activeElement,t.el('voice-start'));
t.el('voice-exercise').setCustomValidity('Old validation error');t.el('voice-words').value='Log squat 60 kg 8 reps 2 sets';t.el('voice-parse').emit('click');assert.equal(t.el('voice-exercise').validationMessage,'');
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];r.onstart();r.onresult({results:[Object.assign([{transcript:'Log row 20 kilograms 8 reps 1 set'}],{isFinal:false})]});advance(60000);r.onend();assert.match(t.el('voice-status').textContent,/unfinished/);assert.equal(t.el('voice-exercise').value,'Row');assert.equal(t.doc.activeElement,t.el('voice-words'));
console.log('Regression checks passed: denied permission preserves existing draft, focus returns predictably, reparsing clears stale validity and unfinished recognised words survive the time limit as an explicitly uncertain draft.');

// Editor-feedback sequence: no review form until usable input is deliberately submitted.
t=fixture();
assert.equal(t.el('voice-entry-form').hidden,true,'initial review must be hidden');
assert.equal(t.el('voice-entry-fields').disabled,true,'hidden draft cannot be edited');
assert.equal(t.el('voice-parse')['aria-expanded'],'false');
t.el('voice-entry-form').emit('submit',{preventDefault(){}});
assert.notEqual(t.el('voice-reviewed').hidden,false,'hidden form cannot produce a reviewed entry');
t.el('voice-start').emit('click');r=t.instances[0];
assert.equal(t.el('voice-entry-form').hidden,true,'permission request must not reveal review');
r.onstart();assert.equal(t.el('voice-entry-form').hidden,true,'listening must not reveal empty review');
t.result(r,'Log bench press 40 kilograms 10 reps 1 set');
assert.equal(t.el('voice-entry-form').hidden,true,'review waits until recording finishes');
t.el('voice-end').emit('click');r.onend();
assert.equal(t.el('voice-entry-form').hidden,false,'captured transcript reveals review');
assert.equal(t.el('voice-entry-fields').disabled,false);
assert.equal(t.el('voice-parse')['aria-expanded'],'true');
t.el('voice-start').emit('click');r=t.instances[1];
assert.equal(t.el('voice-entry-form').hidden,true,'new attempt hides previous review immediately');
r.onstart();r.onerror({error:'no-speech'});r.onend();
assert.equal(t.el('voice-entry-form').hidden,true,'no speech must not reveal a draft');
assert.match(t.el('voice-status').textContent,/No speech was detected/);
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];r.onerror({error:'not-allowed'});r.onend();
assert.equal(t.el('voice-entry-form').hidden,true,'permission denial leaves review hidden');
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];r.onstart();advance(60000);r.onend();
assert.equal(t.el('voice-entry-form').hidden,true,'empty expired recording leaves review hidden');
assert.match(t.el('voice-status').textContent,/No speech was captured/);
t=fixture();t.el('voice-start').emit('click');r=t.instances[0];r.onstart();
r.onresult({results:[Object.assign([{transcript:'Log row 20 kg 8 reps 1 set'}],{isFinal:false})]});
t.el('voice-end').emit('click');r.onend();
assert.equal(t.el('voice-entry-form').hidden,false,'captured unfinished words remain reviewable');
assert.match(t.el('voice-status').textContent,/unfinished/);
t=fixture(false);t.el('voice-words').value='Log squat 60 kg 8 reps 2 sets';t.el('voice-words').emit('input');
assert.equal(t.el('voice-entry-form').hidden,true,'typing alone does not reveal unparsed review');
t.el('voice-parse').emit('click');assert.equal(t.el('voice-entry-form').hidden,false,'intentional typed fallback reveals review');
assert.equal(t.doc.activeElement,t.el('voice-exercise'),'typed parse focuses the revealed fields');
t.el('voice-words').value='';t.el('voice-words').emit('input');
assert.equal(t.el('voice-entry-form').hidden,true,'clearing transcript hides stale review');
t.el('voice-parse').emit('click');assert.equal(t.el('voice-entry-form').hidden,true,'empty parse cannot reveal review');
console.log('Passed review sequencing: initial hidden state, permission/no-speech/empty timeout, captured speech, unfinished transcript, retry, explicit typed fallback and cleared text.');
