import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
import {validateContentConfiguration,assertPublicReady,configuredAssets,assetPath} from './site-validation.mjs';
import {renderCorePages} from './core-pages/index.mjs';
const root = import.meta.url;
const content = JSON.parse(await readFile(new URL('site-content.json', root),'utf8'));
const copy = JSON.parse(await readFile(new URL('website-copy.json', root),'utf8'));
const publicBuild = process.env.ORB_PUBLIC_BUILD === '1' || content.mode === 'public';
validateContentConfiguration(content);
if (publicBuild) assertPublicReady(content);
const money = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:content.commerce.currency,maximumFractionDigits:0}).format(value);
const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const annualPrice=money(content.commerce.annualPrice), monthlyEquivalent=new Intl.NumberFormat('en-IN',{style:'currency',currency:content.commerce.currency,maximumFractionDigits:2}).format(content.commerce.annualPrice/12);
const glucose=content.examples.glucose;
const glucoseValues=glucose.readings.map(r=>r.value);
const glucoseDate=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(glucose.date+'T00:00:00Z'));
const glucosePeriod=`${glucoseDate} · ${glucose.readings[0].time}–${glucose.readings.at(-1).time}`;
const glucoseAlt=`Illustrative glucose readings in ${glucose.unit} on ${glucoseDate}: ${glucose.readings.map(r=>`${r.time}: ${r.value}`).join('; ')}.`;
const capabilities = new Map(content.commerce.capabilities.map(feature => [feature.id, feature]));
const proFeatures = content.commerce.plans.pro.featureIds.map(id => capabilities.get(id));
const proCapabilities = content.commerce.capabilities.map(feature => `<article class="mid-pro-feature" data-capability="${escape(feature.id)}"><img class="mid-pro-icon mid-original-icon" src="${escape(feature.icon)}" alt="" width="138" height="138" loading="lazy"><div><h3>${escape(feature.title)}</h3><p>${escape(feature.description)}</p></div></article>`).join('\n');
const replacements={proCapabilities,...copy,annualPrice,monthlyEquivalent,glucosePeriod,glucoseAlt,glucoseAverage:(glucoseValues.reduce((a,b)=>a+b,0)/glucoseValues.length).toFixed(1),glucoseMin:Math.min(...glucoseValues),glucoseMax:Math.max(...glucoseValues),glucoseUnit:glucose.unit,billingCopy:content.commerce.billingCopy.replace('{monthlyEquivalent}',monthlyEquivalent),freeFeatures:content.commerce.plans.free.features.map(f=>`<li>${escape(f)}</li>`).join(''),proFeatures:proFeatures.map(f=>`<li data-plan-capability="${escape(f.id)}">${escape(f.summary || f.title)}</li>`).join('')};
const partNames=['head','hero','features','voice','lower','footer','end'];
const parts=await Promise.all(partNames.map(p=>readFile(new URL(`parts/${p}.html`,root),'utf8')));
let html=parts.join('\n').replace(/\{\{(\w+)\}\}/g,(_,key)=>{if(!(key in replacements))throw new Error(`Unknown content key ${key}`);return replacements[key];});
const partSource=Object.fromEntries(partNames.map((name,index)=>[name,parts[index]]));
const pages=renderCorePages({head:partSource.head,footer:partSource.footer,end:partSource.end,config:content,replacements});
const expectedSlugs=['plans','care','blueprint','hubs','integrations','help','privacy','terms','data-requests','404'];
if(pages.length!==expectedSlugs.length||new Set(pages.map(page=>page.slug)).size!==pages.length||expectedSlugs.some(slug=>!pages.some(page=>page.slug===slug)))throw new Error('Core pages must contain the nine public pages and one 404 page.');
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/index.html',root),html);
for(const page of pages){
  if(!page.title||!page.html||page.html.includes('{{'))throw new Error(`Incomplete page ${page.slug}`);
  const target=new URL(page.slug==='404'?'dist/404.html':`dist/${page.slug}/index.html`,root);
  await mkdir(new URL('./',target),{recursive:true});await writeFile(target,page.html);
}
await writeFile(new URL('dist/robots.txt',root),publicBuild?'User-agent: *\nAllow: /\n':'User-agent: *\nDisallow: /\n');
await writeFile(new URL('dist/config.js',root),`/* Generated from site-content.json. No secrets. */\nwindow.ORB_CONFIG=${JSON.stringify(content,null,2)};\n`);
for(const file of ['styles.css','carousel.css','features.css','lower.css','motion.css','voice.css','core-pages.css','app.js','voice.js','core-pages.js','favicon.svg']) await cp(new URL(file,root),new URL(`dist/${file}`,root));
// Package only displayed assets; source bundle and unused private report samples stay outside dist.
const css=await Promise.all(['styles.css','carousel.css','features.css','lower.css','motion.css','voice.css','core-pages.css'].map(file=>readFile(new URL(file,root),'utf8')));
const pageHtml=[html,...pages.map(page=>page.html)].join('\n');
const assetPaths=new Set([...pageHtml.matchAll(/(?:src|poster|href)="\/?(assets\/[^"#]+)"/g)].map(m=>assetPath(m[1])));
for(const source of css) for(const match of source.matchAll(/url\(['"]?\/?(assets\/[^)'"\n]+)['"]?\)/g)) assetPaths.add(assetPath(match[1]));
for(const asset of configuredAssets(content)) assetPaths.add(asset);
await rm(new URL('dist/assets/',root),{recursive:true,force:true});
for(const asset of assetPaths){const target=new URL(`dist/${asset}`,root);await mkdir(new URL('./',target),{recursive:true});await cp(new URL(asset,root),target);}
console.log(`Packaged ${assetPaths.size} displayed assets.`);
console.log(`Built Orb ${publicBuild?'public site':'design preview'}: ${annualPrice}/year. Source → dist.`);
console.log('Built nine core pages, shared navigation, and a standalone 404 page.');
