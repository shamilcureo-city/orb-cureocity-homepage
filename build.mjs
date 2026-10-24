import {readFile,writeFile} from 'node:fs/promises';
const root = import.meta.url;
const content = JSON.parse(await readFile(new URL('site-content.json', root), 'utf8'));
const publicBuild = process.env.ORB_PUBLIC_BUILD === '1' || content.mode === 'public';
if (publicBuild) {
  const unapproved = content.features.filter(feature => feature.showInDesignPreview && (feature.availability !== 'live' || feature.claimApproval !== 'approved'));
  const missing = ['appStoreUrl','googlePlayUrl','privacyUrl','termsUrl','supportUrl'].filter(key => !content.destinations[key]);
  if (unapproved.length || missing.length) throw new Error(`Public build needs confirmed release and claim approval for: ${unapproved.map(f=>f.id).join(', ') || 'none'}; configured destinations: ${missing.join(', ') || 'none'}.`);
}
for (const [key, value] of Object.entries(content.destinations)) {
  if (value !== null && (typeof value !== 'string' || !value.startsWith('https://'))) throw new Error(`${key} must be null or an approved HTTPS destination.`);
}
const parts = await Promise.all(['head','main','journey-story','journey-features','journey-care','foot'].map(p=>readFile(new URL(`parts/${p}.html`,root),'utf8')));
let html = parts.join('\n');
await writeFile(new URL('dist/index.html',root),html);
await writeFile(new URL('dist/config.js',root),`/* Generated from site-content.json. Never place secrets in this public configuration. */\nwindow.ORB_CONFIG = ${JSON.stringify({...content.destinations,mode:publicBuild?'public':'design-preview'}, null, 2)};\n`);
console.log(`Built connected-care homepage (${publicBuild?'public':'private design preview'}).`);
