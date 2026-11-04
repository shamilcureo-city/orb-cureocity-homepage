/** One-minute, browser-managed speech trial. No audio upload or persistence by Orb. */
const NUMBER_WORDS = Object.freeze({zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90});
const WORD_NUMBER = /\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[ -](?:hundred|and|point|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety))*\b/gi;
function spokenNumber(phrase) {
  const words=phrase.toLowerCase().split(/[ -]+/), decimal=words.indexOf('point');
  let whole=0;
  for(const word of words.slice(0,decimal<0?words.length:decimal)) {
    if(word==='hundred') whole=(whole||1)*100;
    else if(word!=='and') whole+=NUMBER_WORDS[word]||0;
  }
  if(decimal<0) return String(whole);
  const digits=words.slice(decimal+1).map(word=>NUMBER_WORDS[word]).filter(value=>value!==undefined&&value<10).join('');
  return digits?`${whole}.${digits}`:String(whole);
}

const AMBIGUOUS_WORKOUT_COPY='This entry needs clarification. Edit your words to include one exercise and one value each for weight, repetitions and sets. Remove any alternatives or corrections, then try again. Your original words are still here.';
const emptyWorkout=()=>({exercise:'',weight:'',unit:'kg',reps:'',sets:''});
const DIGIT_WORDS=Object.keys(NUMBER_WORDS).filter(word=>NUMBER_WORDS[word]<10).join('|');
const UNDER_HUNDRED=`(?:${Object.keys(NUMBER_WORDS).filter(word=>NUMBER_WORDS[word]<20).join('|')}|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?: (?:${DIGIT_WORDS}))?)`;
const SPOKEN_QUANTITY=new RegExp(`^(?:(?:${DIGIT_WORDS}) hundred(?: (?:and )?${UNDER_HUNDRED})?|${UNDER_HUNDRED})(?: point (?:${DIGIT_WORDS})(?: (?:${DIGIT_WORDS}))*)?$`);

/** Extracts one stated exercise. Ambiguous input returns empty fields plus an ambiguity message. */
export function parseWorkoutWords(input) {
  let unclearNumber=false;
  const normalized=String(input||'').slice(0,1000).toLowerCase().replace(WORD_NUMBER,phrase=>{
    if(!SPOKEN_QUANTITY.test(phrase.replace(/-/g,' '))){unclearNumber=true;return phrase;}
    return spokenNumber(phrase);
  }).replace(/[–—]/g,'-').replace(/\bminus\s+(?=\d)/g,'-');
  const weights=[...normalized.matchAll(/(?<![\w.-])(-?\d+(?:\.\d+)?)\s*(kg|kgs|kilograms?|kilos?|pounds?|lbs?)\b/g)];
  const repetitions=[...normalized.matchAll(/(?<![\w.-])(-?\d+(?:\.\d+)?)\s*(reps?|repetitions?)\b/g)];
  const setCounts=[...normalized.matchAll(/(?<![\w.-])(-?\d+(?:\.\d+)?)\s*sets?\b/g)];
  const [weight]=weights,[reps]=repetitions,[sets]=setCounts;
  const instruction=normalized
    .replace(/^\s*(?:(?:please\s+)?(?:log|record|add)\s+(?:my\s+)?|i\s+(?:did|completed|finished)\s+)/,'')
    .replace(/^\s*\d+\s*sets?\s+(?:of\s+)?/,'');
  const valuePattern=/(?<![\w.-])(?:at\s+)?-?\d+(?:\.\d+)?\s*(?:kg|kgs|kilograms?|kilos?|pounds?|lbs?|reps?|repetitions?|sets?)\b/g;
  const firstValue=instruction.search(valuePattern);
  let exercise=(firstValue<0?instruction:instruction.slice(0,firstValue))
    .replace(/[,;:.!?\s]+$/g,'')
    .replace(/\b(?:with|using|for|at|and|body\s*weight)\s*$/g,'').trim();
  const bodyweight=/\bbody\s*weight\b/.test(normalized);
  // Never choose the first of competing values or silently attach a later exercise's sets.
  const correction=/\b(?:actually|instead|rather|sorry|correction|correct that|make that|i mean|not|no|or)\b/.test(normalized);
  const sequence=/\b(?:then|followed by|next exercise|another exercise|superset)\b/.test(normalized);
  const multipleNames=/[,;+/&]|\band\b/.test(exercise)&&!/^\s*(?:(?:barbell|dumbbell|kettlebell|single arm)\s+)?clean and (?:jerk|press)\s*$/.test(exercise);
  const tail=firstValue<0?'':instruction.slice(firstValue).replace(valuePattern,' ').replace(/\b(?:body\s*weight|and|with|using|for|at|of|each|in total|total|today|please)\b/g,' ').replace(/[\s,;:.!?+&]+/g,'');
  if(unclearNumber||correction||sequence||multipleNames||weights.length>1||repetitions.length>1||setCounts.length>1||(bodyweight&&weight)||tail) {
    return {...emptyWorkout(),ambiguity:AMBIGUOUS_WORKOUT_COPY};
  }
  if(exercise.length>80) exercise='';
  return {
    exercise:exercise?exercise.charAt(0).toUpperCase()+exercise.slice(1):'',
    weight:weight?weight[1]:'',
    unit:weight?(/^(?:lb|pound)/.test(weight[2])?'lb':'kg'):(bodyweight?'bodyweight':'kg'),
    reps:reps?reps[1]:'',
    sets:sets?sets[1]:''
  };
}

/** Monotonic budget, shared by every recording attempt during this page visit. */
export function createListeningBudget(limitMs=60000,now=()=>performance.now()) {
  let used=0, started=null;
  const remaining=()=>Math.max(0,limitMs-used-(started===null?0:Math.max(0,now()-started)));
  return {
    remaining,
    start(){if(started===null&&remaining()>0) started=now();},
    pause(){if(started!==null){used=Math.min(limitMs,used+Math.max(0,now()-started));started=null;}return remaining();}
  };
}

export function initVoiceTrial(root) {
  if(!root||root.dataset.voiceReady==='true') return;
  root.dataset.voiceReady='true';
  const $=selector=>root.querySelector(selector);
  const start=$('#voice-start'), stop=$('#voice-end'), timer=$('#voice-countdown');
  const status=$('#voice-status'), words=$('#voice-words'), interim=$('#voice-interim');
  const parse=$('#voice-parse'), form=$('#voice-entry-form'), review=$('#voice-review');
  const reviewed=$('#voice-reviewed'), summary=$('#voice-reviewed-summary'), fieldset=$('#voice-entry-fields');
  const fields={exercise:$('#voice-exercise'),weight:$('#voice-weight'),unit:$('#voice-unit'),reps:$('#voice-reps'),sets:$('#voice-sets')};
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const supported=!!Recognition&&window.isSecureContext!==false;
  const budget=createListeningBudget();
  let engine=null, phase='idle', epoch=0, finalWords='', interimWords='', endReason='', errorMessage='', restoreFocus=false;
  let tickTimer=null, deadlineTimer=null, pendingTimer=null, finishingTimer=null;
  const errorCopy={
    'not-allowed':'Microphone access was not allowed. You can enable it in your browser settings or type an entry below.',
    'service-not-allowed':'Speech recognition is unavailable in this browser. Type your entry below.',
    'audio-capture':'The microphone could not be opened. Check your microphone connection, or type an entry below.',
    'network':'Speech recognition could not connect. Check your connection and try again, or type an entry below.',
    'no-speech':'No speech was detected. Start again when you are ready, or type an entry below.',
    'language-not-supported':'This browser cannot recognise the selected English language. Type your entry below.',
    'aborted':'The microphone stopped. Review any captured words below, or start again.'
  };
  function say(message){status.textContent=message;}
  function renderTimer(){const seconds=Math.ceil(budget.remaining()/1000);timer.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
  function clearTimers(){clearInterval(tickTimer);clearTimeout(deadlineTimer);clearTimeout(pendingTimer);clearTimeout(finishingTimer);tickTimer=deadlineTimer=pendingTimer=finishingTimer=null;}
  function syncControls(){
    const busy=phase!=='idle';
    start.hidden=!supported;start.disabled=busy||budget.remaining()<=0;
    stop.hidden=!busy;stop.disabled=phase==='stopping';stop.textContent=phase==='requesting'?'Cancel':'Stop microphone';
    words.readOnly=busy;parse.disabled=busy||!words.value.trim();fieldset.disabled=busy||form.hidden;review.disabled=busy||form.hidden;
    parse.setAttribute('aria-expanded',String(!form.hidden));
    root.classList.toggle('is-listening',phase==='listening');
    root.setAttribute('data-voice-phase',phase);
    renderTimer();
  }
  function applyWords(){
    const entry=parseWorkoutWords(words.value);
    for(const [key,field] of Object.entries(fields)){field.value=entry[key];field.setCustomValidity('');}
    updateWeight();reviewed.hidden=true;summary.textContent='';form.hidden=!!entry.ambiguity||!words.value.trim();
    return entry.ambiguity;
  }
  function updateWeight(){const bodyweight=fields.unit.value==='bodyweight';fields.weight.disabled=bodyweight;fields.weight.required=!bodyweight;if(bodyweight)fields.weight.value='';}
  function finish(token){
    if(token!==epoch) return;
    const returnFocus=restoreFocus||document.activeElement===stop;restoreFocus=false;
    epoch++; // Ignore late results/end callbacks after this session has finished.
    budget.pause();clearTimers();engine=null;phase='idle';interim.textContent='';
    const captured=[finalWords,interimWords].filter(Boolean).join(' ').trim();
    let ambiguity;
    if(captured){words.value=captured;ambiguity=applyWords();}
    if(ambiguity) say(`${errorMessage||'Microphone stopped.'} ${ambiguity}`);
    else if(errorMessage) say(errorMessage);
    else if(endReason==='expired'||budget.remaining()<=0) say(captured?'Your one-minute voice trial is complete. You can still edit and review your entry below.':'Your one-minute voice trial is complete. No speech was captured. You can type an entry below.');
    else if(endReason==='hidden') say(captured?'Microphone stopped because you left this page. Your draft remains here.':'Microphone stopped because you left this page. No speech was captured.');
    else if(captured) say('Microphone stopped. Check the words and details below before reviewing your entry.');
    else say('Microphone stopped. No speech was captured. You can start again or type an entry below.');
    if(interimWords) status.textContent+=' Some words were unfinished; check the draft carefully.';
    syncControls();
    if(returnFocus&&!document.hidden&&!document.querySelector('dialog[open]')) (start.disabled||start.hidden?words:start).focus();
  }
  function end(reason='user'){
    if(phase==='idle'||phase==='stopping')return;
    endReason=reason;restoreFocus=document.activeElement===stop;
    const wasRequesting=phase==='requesting';phase='stopping';budget.pause();clearTimers();syncControls();
    const token=epoch,current=engine;
    finishingTimer=setTimeout(()=>{if(token!==epoch)return;try{current?.abort();}catch{}finish(token);},1500);
    try{if(reason==='user'&&!wasRequesting)current?.stop();else current?.abort();}catch{try{current?.abort();}catch{}}
  }
  function begin(){
    if(!supported||phase!=='idle'||budget.remaining()<=0)return;
    const token=++epoch;finalWords='';interimWords='';endReason='';errorMessage='';interim.textContent='';reviewed.hidden=true;form.hidden=true;restoreFocus=false;
    phase='requesting';syncControls();stop.focus();say('Allow microphone access when your browser asks. Listening time starts once the microphone is ready.');
    try{engine=new Recognition();}catch{errorMessage='Speech recognition could not start in this browser. Type your entry below.';finish(token);return;}
    const current=engine;
    current.lang='en-IN';current.continuous=true;current.interimResults=true;current.maxAlternatives=1;
    current.onstart=()=>{
      if(token!==epoch||phase!=='requesting'||document.hidden){try{current.abort();}catch{}return;}
      clearTimeout(pendingTimer);words.value='';applyWords();budget.start();phase='listening';syncControls();say('Listening. Say your exercise, weight, repetitions and sets.');
      tickTimer=setInterval(renderTimer,200);deadlineTimer=setTimeout(()=>end('expired'),budget.remaining());
    };
    current.onresult=event=>{
      if(token!==epoch||!['listening','stopping'].includes(phase))return;
      if(phase==='listening'&&budget.remaining()<=0){end('expired');return;}
      const finals=[],partials=[];
      for(let i=0;i<event.results.length;i++){
        const text=event.results[i][0]?.transcript||'';
        (event.results[i].isFinal?finals:partials).push(text);
      }
      finalWords=finals.join(' ').trim().slice(0,1000);words.value=finalWords;
      interimWords=partials.join(' ').trim().slice(0,500);
      interim.textContent=interimWords?`Hearing: ${interimWords}`:'';
    };
    current.onerror=event=>{
      if(token!==epoch||phase==='idle')return;
      if(event.error==='aborted'&&endReason)return;
      errorMessage=errorCopy[event.error]||'Speech recognition stopped unexpectedly. Review any captured words or type your entry below.';
      end('error');
    };
    current.onend=()=>finish(token);
    pendingTimer=setTimeout(()=>{errorMessage='The microphone did not start. Check browser permissions, or type your entry below.';end('permission-timeout');},20000);
    try{current.start();}catch{errorMessage='The microphone could not start. You can try again or type an entry below.';finish(token);}
  }
  start.addEventListener('click',begin);
  stop.addEventListener('click',()=>end('user'));
  words.addEventListener('input',()=>{form.hidden=true;reviewed.hidden=true;syncControls();});
  parse.addEventListener('click',()=>{if(phase!=='idle'||!words.value.trim())return;const ambiguity=applyWords();syncControls();say(ambiguity||'Draft updated from your words. Check the fields and add any missing details.');(ambiguity?words:fields.exercise).focus();});
  fields.unit.addEventListener('change',updateWeight);
  form.addEventListener('input',()=>{reviewed.hidden=true;});
  form.addEventListener('submit',event=>{
    event.preventDefault();if(phase!=='idle'||form.hidden||!form.reportValidity())return;
    const exercise=fields.exercise.value.trim();
    if(!exercise){fields.exercise.setCustomValidity('Enter an exercise name.');fields.exercise.reportValidity();return;}
    fields.exercise.setCustomValidity('');
    const weight=fields.unit.value==='bodyweight'?'Body weight':`${fields.weight.value} ${fields.unit.value}`;
    summary.textContent=`${exercise} · ${weight} · ${fields.reps.value} reps · ${fields.sets.value} ${fields.sets.value==='1'?'set':'sets'}`;
    reviewed.hidden=false;say('Entry reviewed on this page. Nothing has been saved to an Orb account.');
  });
  fields.exercise.addEventListener('input',()=>fields.exercise.setCustomValidity(''));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)end('hidden');});
  window.addEventListener('pagehide',()=>{end('hidden');try{engine?.abort();}catch{}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&phase!=='idle')end('user');});
  const dialogs=new MutationObserver(()=>{if(document.querySelector('dialog[open]'))end('dialog');});
  document.querySelectorAll('dialog').forEach(dialog=>dialogs.observe(dialog,{attributes:true,attributeFilter:['open']}));
  if(!supported){say('Voice input is not available in this browser. Type an entry below, or open this page in a browser that supports speech recognition.');$('#voice-budget').hidden=true;}
  else say('Try up to one minute of microphone input during this page visit. Each new recording replaces the words in this draft.');
  form.hidden=true;updateWeight();syncControls();
}

if(typeof document!=='undefined') initVoiceTrial(document.querySelector('[data-voice-trial]'));
