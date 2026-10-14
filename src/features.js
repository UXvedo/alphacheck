// Build-time feature flag for tools that are still behind the math audit.
// Production (VERCEL_ENV=production) is off unless FEATURES_ON=1.
// Preview, development, and a local build with no VERCEL_ENV are on.
// See README "Feature flag".
export function featuresEnabled(env = {}) {
  if (env.FEATURES_ON === '1') return true;
  return env.VERCEL_ENV !== 'production';
}
