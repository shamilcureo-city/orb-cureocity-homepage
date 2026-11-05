import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateContentConfiguration,publicReadiness,configuredAssets} from './site-validation.mjs';
const html=await readFile(new URL('dist/index.html',import.meta.url),'utf8');
const config=JSON.parse(await readFile(new URL('site-content.json',import.meta.url),'utf8'));
const bundledConfig=await readFile(new URL('dist/config.js',import.meta.url),'utf8');
assert.ok(bundledConfig.includes(`window.ORB_CONFIG=${JSON.stringify(config,null,2)};`),'Published configuration must match the current source');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
for(const [,id] of html.matchAll(/(?:href="#|aria-controls=")([^"#]+)"/g))assert.ok(ids.includes(id),`Missing internal target ${id}`);
for(const [,action] of html.matchAll(/data-action="([^"]+)"/g))assert.ok(config.actions[action],`Unknown action ${action}`);
validateContentConfiguration(config);
for(const src of configuredAssets(config))assert.ok((await stat(new URL(`dist/${src}`,import.meta.url))).size>0,`Missing displayed configuration asset ${src}`);
for(const [,src] of html.matchAll(/(?:src|poster|href)="((?:assets\/|(?:app|config|voice)\.js|(?:styles|carousel|features|lower|motion|voice)\.css|favicon\.svg)[^"]*)"/g))assert.ok((await stat(new URL(`dist/${decodeURIComponent(src)}`,import.meta.url))).size>0,`Empty or missing ${src}`);
assert.ok(!html.includes('{{'),'No unexpanded content tokens');
for(const bad of ['₹7,000','₹7,500','write faster','think clearer','Continues Glucose','1200 Kcal of 264','6:15 PM','liver risk'])assert.ok(!html.includes(bad),`Obsolete copy: ${bad}`);
const annual=new Intl.NumberFormat('en-IN',{style:'currency',currency:config.commerce.currency,maximumFractionDigits:0}).format(config.commerce.annualPrice);
assert.ok(html.split(annual).length-1>=4,'Shared annual price appears across the page');
const monthly = new Intl.NumberFormat('en-IN',{style:'currency',currency:config.commerce.currency,maximumFractionDigits:2}).format(config.commerce.annualPrice/12);
assert.ok(html.includes(config.commerce.billingCopy.replace('{monthlyEquivalent}',monthly)),'Correct shared annual equivalent');
const overviewIds = [...html.matchAll(/data-capability="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(overviewIds,config.commerce.capabilities.map(feature=>feature.id),'Overview is generated from the shared catalogue');
const planIds = [...html.matchAll(/data-plan-capability="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(planIds,config.commerce.plans.pro.featureIds,'Pricing list uses the configured catalogue references');
const tabs=[...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(m=>m[0]);
assert.ok(tabs.length>=20,'All new tab modules are present');
for(const tab of tabs){const id=/\bid="([^"]+)"/.exec(tab)?.[1];const panel=/aria-controls="([^"]+)"/.exec(tab)?.[1];assert.ok(id&&panel, 'Tabs identify their associated panel');assert.ok(html.includes(`aria-labelledby="${id}"`),`Panel labels its tab ${id}`);}
assert.equal(tabs.length,(html.match(/role="tabpanel"/g)||[]).length,'Every tab has one panel');
const result=spawnSync(process.execPath,[new URL('tests/site-validation.test.mjs',import.meta.url).pathname],{encoding:'utf8'});
assert.equal(result.status,0,result.stderr || result.stdout);
const routingResult=spawnSync(process.execPath,[new URL('tests/core-pages.test.mjs',import.meta.url).pathname],{encoding:'utf8'});
assert.equal(routingResult.status,0,routingResult.stderr || routingResult.stdout);

const coreSlugs=['plans','care','blueprint','hubs','integrations','help','privacy','terms','data-requests'];
const documents=new Map([['/',html]]);
for(const slug of coreSlugs)documents.set(`/${slug}/`,await readFile(new URL(`dist/${slug}/index.html`,import.meta.url),'utf8'));
documents.set('/404.html',await readFile(new URL('dist/404.html',import.meta.url),'utf8'));
const pageIds=new Map([...documents].map(([route,source])=>[route,[...source.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1])]));
const origin=new URL(config.siteOrigin).origin;
const titles=new Set(),descriptions=new Set();
const dist=fileURLToPath(new URL('./dist/',import.meta.url));
const canonicalRoute=pathname=>{
  if(pathname==='/index.html')return '/';
  if(pathname.endsWith('/index.html'))return pathname.slice(0,-10);
  return documents.has(pathname)?pathname:documents.has(pathname+'/')?pathname+'/':null;
};
for(const [route,source] of documents){
  const localIds=pageIds.get(route);
  assert.equal(new Set(localIds).size,localIds.length,`Unique IDs on ${route}`);
  assert.ok(!source.includes('{{'),`No unexpanded tokens on ${route}`);
  assert.equal((source.match(/<h1\b/g)||[]).length,1,`One main heading on ${route}`);
  const title=/<title>([^<]+)<\/title>/.exec(source)?.[1];
  const description=/<meta\b[^>]*name="description"[^>]*content="([^"]+)"/.exec(source)?.[1];
  assert.ok(title&&description,`Title and description required on ${route}`);
  assert.ok(!titles.has(title),`Distinct title on ${route}`);titles.add(title);
  assert.ok(!descriptions.has(description),`Distinct description on ${route}`);descriptions.add(description);
  if(config.mode!=='public')assert.match(source,/<meta\b[^>]*name="robots"[^>]*content="noindex,nofollow"/,`Preview indexing is disabled on ${route}`);
  for(const [,action] of source.matchAll(/data-action="([^"]+)"/g))assert.ok(config.actions[action],`Unknown action ${action} on ${route}`);
  for(const [,refs] of source.matchAll(/(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)){
    for(const id of refs.split(/\s+/))assert.ok(localIds.includes(id),`Missing accessibility target ${id} on ${route}`);
  }
  for(const [,attribute,value] of source.matchAll(/\b(src|poster|href)="([^"]+)"/g)){
    const url=new URL(value.replaceAll('&amp;','&'),origin+route);
    if(url.origin!==origin)continue;
    const targetRoute=canonicalRoute(url.pathname);
    if(targetRoute){
      if(url.hash)assert.ok(pageIds.get(targetRoute).includes(decodeURIComponent(url.hash.slice(1))),`Missing link target ${value} on ${route}`);
      continue;
    }
    const file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
    assert.ok(file.startsWith(dist),`Local ${attribute} stays inside output: ${value}`);
    assert.ok((await stat(file)).isFile(),`Missing local ${attribute} ${value} on ${route}`);
    assert.ok((await stat(file)).size>0,`Empty local ${attribute} ${value} on ${route}`);
  }
}
for(const slug of coreSlugs)assert.equal(config.informationPages[slug]?.path,`/${slug}/`,`Public route config matches generated ${slug} page`);
for(const key of ['dailyUrl','nutritionUrl','fitnessUrl','vaultUrl','familyUrl','cycleUrl','biologicalAgeUrl','orbUrl','proUrl']){
  const value=config.destinations[key];if(!value)continue;
  const url=new URL(value);
  assert.ok(url.origin!==origin||!canonicalRoute(url.pathname),`${key} must open the product flow, not this marketing site's public page`);
}
if(config.mode!=='public')assert.match(await readFile(new URL('dist/robots.txt',import.meta.url),'utf8'),/Disallow: \/\s*$/,'Preview robots file disallows indexing');
const readiness = publicReadiness(config);
console.log('Passed: homepage, nine core pages, 404, cross-page anchors, accessibility references, action wiring, display assets, distinct metadata, shared price/catalogue, tabs, routing/range tests and release gates.');
console.log(`Destination status: ${readiness.missingDestinations.length} required destinations missing; ${readiness.ready ? 'configuration passes release gates' : 'preview only; commercial release gates remain blocked'}. URL syntax and wiring checked; remote destinations were not verified.`);
