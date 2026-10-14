// Yield tools (break-even days, max safe stake, leaderboard, share images).
// On by default, including a Vercel production build. No env var is required to ship them.
// To hide them again, set FEATURES_DEFAULT to false and redeploy, or set FEATURES_ON=0
// (build time for the site, and on each request for /api/og). FEATURES_ON=1 forces them on.
export const FEATURES_DEFAULT = true;

export function featuresEnabled(env = {}) {
  if (env.FEATURES_ON === '0') return false;
  if (env.FEATURES_ON === '1') return true;
  return FEATURES_DEFAULT;
}
