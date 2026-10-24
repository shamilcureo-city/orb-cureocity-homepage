import {readFile,writeFile} from 'node:fs/promises';
const root = import.meta.url;
const content = JSON.parse(await readFile(new URL('site-content.json', root), 'utf8'));
const publicBuild = process.env.ORB_PUBLIC_BUILD === '1' || content.mode === 'public';
if (publicBuild) {
  const unapproved = content.features.filter(feature => feature.showInDesignPreview && (feature.availability !== 'live' || feature.claimApproval !== 'approved'));
  const missing = ['appStoreUrl','googlePlayUrl','privacyUrl','termsUrl','supportUrl','freeDietPlanUrl','freeFitnessAssessmentUrl'].filter(key => !content.destinations[key]);
  if (unapproved.length || missing.length) throw new Error(`Public build needs confirmed release and claim approval for: ${unapproved.map(f=>f.id).join(', ') || 'none'}; configured destinations: ${missing.join(', ') || 'none'}.`);
}
for (const [key, value] of Object.entries(content.destinations)) {
  if (value !== null && (typeof value !== 'string' || !value.startsWith('https://'))) throw new Error(`${key} must be null or an approved HTTPS destination.`);
}
const parts = await Promise.all(['head','main','free-tools','complete-overview','complete-routine','ai-fitness','voice-routine','complete-health','value-week','complete-care','connected-orb','value-offer','foot'].map(p=>readFile(new URL(`parts/${p}.html`,root),'utf8')));
const annualPrice = new Intl.NumberFormat('en-IN', {style:'currency',currency:content.commerce.currency,maximumFractionDigits:0}).format(content.commerce.annualPrice);
const monthlyPrice = new Intl.NumberFormat('en-IN', {style:'currency',currency:content.commerce.currency,maximumFractionDigits:0}).format(content.commerce.annualPrice / 12);
let html = parts.join('\n').replace(/(data-orb-price="annual">)[^<]+/g, (_, prefix) => prefix + annualPrice).replace(/(data-orb-price="monthly">)[^<]+/g, (_, prefix) => prefix + monthlyPrice);
await writeFile(new URL('dist/index.html',root),html);
await writeFile(new URL('dist/config.js',root),`/* Generated from site-content.json. Never place secrets in this public configuration. */\nwindow.ORB_CONFIG = ${JSON.stringify({...content.destinations,commerce:content.commerce,mode:publicBuild?'public':'design-preview'}, null, 2)};\n`);
console.log(`Built Orb sales homepage (${publicBuild?'public':'private design preview'}).`);
