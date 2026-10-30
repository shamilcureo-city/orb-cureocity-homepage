import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const root = import.meta.url;
const content = JSON.parse(await readFile(new URL('site-content.json', root),'utf8'));
const copy = JSON.parse(await readFile(new URL('website-copy.json', root),'utf8'));
const publicBuild = process.env.ORB_PUBLIC_BUILD === '1' || content.mode === 'public';
for (const [key, value] of Object.entries(content.destinations)) {
  if(value === null) continue;
  let valid = false; try { valid = new URL(value).protocol === 'https:'; } catch {}
  if(!valid) throw new Error(`${key} must be null or a verified HTTPS destination.`);
}
if (publicBuild) {
  const pending = content.features.filter(f => f.availability !== 'live' || f.claimApproval !== 'approved');
  const missing = Object.entries(content.destinations).filter(([,value])=>!value).map(([key])=>key);
  if(pending.length || missing.length || content.commerce.entitlementStatus !== 'approved' || content.commerce.taxTreatment === 'unconfirmed' || content.integrations.status !== 'approved') throw new Error(`Public build blocked: ${pending.length} feature claims await approval; missing destinations: ${missing.join(', ')}; commercial and integration approval also required. See HANDOFF.md.`);
}
const money = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:content.commerce.currency,maximumFractionDigits:0}).format(value);
const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const annualPrice=money(content.commerce.annualPrice), monthlyEquivalent=new Intl.NumberFormat('en-IN',{style:'currency',currency:content.commerce.currency,maximumFractionDigits:2}).format(content.commerce.annualPrice/12);
const glucose=content.examples.glucose;
const glucoseValues=glucose.readings.map(r=>r.value);
const glucoseDate=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(glucose.date+'T00:00:00Z'));
const glucosePeriod=`${glucoseDate} · ${glucose.readings[0].time}–${glucose.readings.at(-1).time}`;
const glucoseAlt=`Illustrative glucose readings in ${glucose.unit} on ${glucoseDate}: ${glucose.readings.map(r=>`${r.time}: ${r.value}`).join('; ')}.`;
const replacements={...copy,annualPrice,monthlyEquivalent,glucosePeriod,glucoseAlt,glucoseAverage:(glucoseValues.reduce((a,b)=>a+b,0)/glucoseValues.length).toFixed(1),glucoseMin:Math.min(...glucoseValues),glucoseMax:Math.max(...glucoseValues),glucoseUnit:glucose.unit,billingCopy:content.commerce.billingCopy.replace('{monthlyEquivalent}',monthlyEquivalent),freeFeatures:content.commerce.plans.free.features.map(f=>`<li>${escape(f)}</li>`).join(''),proFeatures:content.commerce.plans.pro.features.map(f=>`<li>${escape(f)}</li>`).join('')};
const parts=await Promise.all(['head','hero','features','voice','lower','end'].map(p=>readFile(new URL(`parts/${p}.html`,root),'utf8')));
let html=parts.join('\n').replace(/\{\{(\w+)\}\}/g,(_,key)=>{if(!(key in replacements))throw new Error(`Unknown content key ${key}`);return replacements[key];});
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/index.html',root),html);
await writeFile(new URL('dist/config.js',root),`/* Generated from site-content.json. No secrets. */\nwindow.ORB_CONFIG=${JSON.stringify(content,null,2)};\n`);
for(const file of ['styles.css','carousel.css','features.css','lower.css','motion.css','voice.css','app.js','voice.js','favicon.svg']) await cp(new URL(file,root),new URL(`dist/${file}`,root));
// Package only displayed assets; source bundle and unused private report samples stay outside dist.
const css=await Promise.all(['styles.css','carousel.css','features.css','lower.css','motion.css','voice.css'].map(file=>readFile(new URL(file,root),'utf8')));
const assetPaths=new Set([...html.matchAll(/(?:src|poster|href)="(assets\/[^"#]+)"/g)].map(m=>decodeURIComponent(m[1])));
for(const source of css) for(const match of source.matchAll(/url\(['"]?(assets\/[^)'"\n]+)['"]?\)/g)) assetPaths.add(decodeURIComponent(match[1]));
await rm(new URL('dist/assets/',root),{recursive:true,force:true});
for(const asset of assetPaths){const target=new URL(`dist/${asset}`,root);await mkdir(new URL('./',target),{recursive:true});await cp(new URL(asset,root),target);}
console.log(`Packaged ${assetPaths.size} displayed assets.`);
console.log(`Built Orb ${publicBuild?'public site':'design preview'}: ${annualPrice}/year. Source → dist.`);
