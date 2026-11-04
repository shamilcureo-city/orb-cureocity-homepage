import assert from 'node:assert/strict';
import {assetPath, configuredAssets, validateContentConfiguration, publicReadiness, assertPublicReady} from '../site-validation.mjs';

// Fictional configuration exercises release gates without contacting a service.
const fixture = () => ({
  destinations: {appStoreUrl:'https://example.com/app',googlePlayUrl:'https://example.com/play',vaultUrl:'https://example.com/vault',unusedUrl:null},
  actions: {
    vault:{urlKey:'vaultUrl',preview:{image:'assets/original/vault.png',alt:'Illustrative records',steps:['Review available records.']}},
    doctor:{kind:'profile',profileId:'doctor'}
  },
  profiles:{doctor:{name:'Fictional professional',role:'Fixture only',image:'assets/profile.png'}},
  commerce:{entitlementStatus:'approved',taxTreatment:'included',capabilities:[{id:'vault',title:'Health Vault',description:'Records example',icon:'assets/icon.png'}],plans:{pro:{featureIds:['vault']}}},
  features:[{id:'vault',availability:'live',claimApproval:'approved'}],integrations:{status:'approved'}
});
const approved = fixture();
assert.equal(publicReadiness(approved).ready,true);
assert.doesNotThrow(() => assertPublicReady(approved),'A complete approved configuration is allowed');
assert.ok(!publicReadiness(approved).missingDestinations.includes('unusedUrl'),'Unused optional configuration is not a release dependency');

const incomplete = fixture();
incomplete.destinations.vaultUrl = null;
incomplete.features[0].availability = 'unverified';
incomplete.commerce.entitlementStatus = 'pending-commercial-confirmation';
incomplete.commerce.taxTreatment = 'unconfirmed';
incomplete.integrations.status = 'unverified';
const gates = publicReadiness(incomplete);
assert.deepEqual(gates.missingDestinations,['vaultUrl']);
assert.deepEqual(gates.pendingFeatures,['vault']);
assert.deepEqual(gates.pendingApprovals,['plan entitlements','tax treatment','integrations']);
assert.throws(() => assertPublicReady(incomplete),/Public build blocked/);

for (const url of ['javascript:alert(1)','http://example.com','/relative','https://user:secret@example.com',42]) {
  const content = fixture(); content.destinations.vaultUrl = url;
  assert.throws(() => validateContentConfiguration(content),/HTTPS destination/);
}
const missingKey = fixture();delete missingKey.destinations.vaultUrl;
assert.throws(() => validateContentConfiguration(missingKey),/Missing destination configuration/);
const missingProfile = fixture();missingProfile.actions.doctor.profileId = 'unknown';
assert.throws(() => validateContentConfiguration(missingProfile),/Missing profile/);
const badFeature = fixture();badFeature.commerce.plans.pro.featureIds.push('invented');
assert.throws(() => validateContentConfiguration(badFeature),/Pro feature IDs/);
const duplicateFeature = fixture();duplicateFeature.commerce.capabilities.push({...duplicateFeature.commerce.capabilities[0]});
assert.throws(() => validateContentConfiguration(duplicateFeature),/duplicate capability/);
const missingAlt = fixture();delete missingAlt.actions.vault.preview.alt;
assert.throws(() => validateContentConfiguration(missingAlt),/alternative text/);
for (const path of ['../private.png','assets/../private.png','assets/%2e%2e/private.png','assets/%252e%252e/private.png','https://example.com/a.png','assets/a.png?x=1','assets\\a.png','assets//a.png']) assert.throws(() => assetPath(path),/asset path/);
assert.equal(assetPath('assets/original/Health%20Vault.png'),'assets/original/Health Vault.png');
assert.deepEqual(configuredAssets(approved),['assets/icon.png','assets/profile.png','assets/original/vault.png']);
const unrelated = fixture();unrelated.unusedSourceImage = 'assets/private-report.png';
assert.ok(!configuredAssets(unrelated).includes('assets/private-report.png'),'Only declared display slots add config assets');
console.log('Passed: approved/incomplete release gates, action/profile references, catalogue references, HTTPS syntax, and safe display-asset selection. No remote destination verification performed.');
