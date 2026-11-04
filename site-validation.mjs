// Configuration validity is distinct from approval for commercial release.
// URL validation checks syntax only; owners must verify the actual destinations.
export function assetPath(value) {
  if (typeof value !== 'string') throw new Error('A configured asset must be a local assets/ path.');
  let path;
  try { path = decodeURIComponent(value); } catch { throw new Error(`Invalid asset path: ${value}`); }
  if (!path.startsWith('assets/') || /[?#\\\u0000-\u001f]/.test(path) || /%[a-f\d]{2}/i.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`Unsafe local asset path: ${value}`);
  }
  return path;
}

export function requiredDestinationKeys(content) {
  return [...new Set(['appStoreUrl', 'googlePlayUrl', ...Object.values(content.actions).map(action => action.urlKey).filter(Boolean)])];
}

export function configuredAssets(content) {
  // Only these declared image slots can add files to the published bundle.
  return [...new Set([
    ...content.commerce.capabilities.map(feature => feature.icon),
    ...Object.values(content.profiles || {}).map(profile => profile.image),
    ...Object.values(content.actions).map(action => action.preview?.image).filter(Boolean)
  ].map(assetPath))];
}

export function validateContentConfiguration(content) {
  for (const [key, value] of Object.entries(content.destinations)) {
    if (value === null) continue;
    let valid = false;
    try {
      const url = new URL(value);
      valid = typeof value === 'string' && url.protocol === 'https:' && !url.username && !url.password;
    } catch {}
    if (!valid) throw new Error(`${key} must be null or an HTTPS destination without embedded credentials.`);
  }
  for (const key of requiredDestinationKeys(content)) {
    if (!(key in content.destinations)) throw new Error(`Missing destination configuration: ${key}`);
  }
  for (const [key, action] of Object.entries(content.actions)) {
    if (action.kind === 'profile') {
      const profile = content.profiles?.[action.profileId];
      if (!profile?.name || !profile?.role || !profile?.image) throw new Error(`Missing profile for action ${key}`);
      if (action.urlKey) throw new Error(`Profile action ${key} must remain a local profile.`);
    } else if (!action.urlKey) {
      throw new Error(`Missing URL key for action ${key}`);
    }
    if (action.preview?.image && !action.preview.alt) throw new Error(`Preview image needs alternative text: ${key}`);
    if (action.preview?.steps && (!Array.isArray(action.preview.steps) || !action.preview.steps.every(step => typeof step === 'string' && step.trim()))) throw new Error(`Invalid preview steps: ${key}`);
    if (action.conversation && (!Array.isArray(action.conversation) || !action.conversation.length || !action.conversation.every(turn => turn.speaker && turn.text))) throw new Error(`Invalid conversation: ${key}`);
  }
  const capabilities = content.commerce.capabilities;
  if (!Array.isArray(capabilities) || !capabilities.length) throw new Error('The shared capability catalogue must not be empty.');
  const ids = new Set();
  for (const feature of capabilities) {
    if (!feature.id || ids.has(feature.id) || !feature.title || !feature.description || !feature.icon) throw new Error(`Invalid or duplicate capability: ${feature.id}`);
    ids.add(feature.id);
  }
  const planIds = content.commerce.plans.pro.featureIds;
  if (!Array.isArray(planIds) || !planIds.length || new Set(planIds).size !== planIds.length || planIds.some(id => !ids.has(id))) throw new Error('Pro feature IDs must be unique references to the shared capability catalogue.');
  configuredAssets(content);
}

export function publicReadiness(content) {
  validateContentConfiguration(content);
  const missingDestinations = requiredDestinationKeys(content).filter(key => !content.destinations[key]);
  const pendingFeatures = content.features.filter(feature => feature.availability !== 'live' || feature.claimApproval !== 'approved').map(feature => feature.id);
  const pendingApprovals = [];
  if (content.commerce.entitlementStatus !== 'approved') pendingApprovals.push('plan entitlements');
  if (!content.commerce.taxTreatment || content.commerce.taxTreatment === 'unconfirmed') pendingApprovals.push('tax treatment');
  if (content.integrations.status !== 'approved') pendingApprovals.push('integrations');
  return {ready: !missingDestinations.length && !pendingFeatures.length && !pendingApprovals.length, missingDestinations, pendingFeatures, pendingApprovals};
}

export function assertPublicReady(content) {
  const result = publicReadiness(content);
  if (!result.ready) throw new Error(`Public build blocked: ${result.pendingFeatures.length} feature claims await approval; missing destinations: ${result.missingDestinations.join(', ') || 'none'}; pending approvals: ${result.pendingApprovals.join(', ') || 'none'}. See HANDOFF.md.`);
  return result;
}
