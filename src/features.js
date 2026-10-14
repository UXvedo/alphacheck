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

// Engagement features (what-if slider, compare view, watchlist). Each has its own flag.
// Hidden in production by default; shown on Vercel preview, development, and local builds.
// Force one per deploy with FLAG_SLIDER / FLAG_COMPARE / FLAG_WATCHLIST = 1 or 0.
// To ship one to production, flip its default here to true (or set FLAG_x=1 in Vercel).
// FEATURES_ON=0 hides these too.
export const ENGAGEMENT_DEFAULTS = {slider: false, compare: false, watchlist: false};
const FLAG_ENV = {slider: 'FLAG_SLIDER', compare: 'FLAG_COMPARE', watchlist: 'FLAG_WATCHLIST'};

export function engagementFlags(env = {}) {
  const out = {};
  for (const [name, key] of Object.entries(FLAG_ENV)) {
    if (env.FEATURES_ON === '0' || env[key] === '0') out[name] = false;
    else if (env[key] === '1') out[name] = true;
    else out[name] = env.VERCEL_ENV === 'production' ? ENGAGEMENT_DEFAULTS[name] : true;
  }
  return out;
}

// Remove <!--F:name-->…<!--/F:name--> blocks for flags that are off.
export function stripFlagged(html, flags) {
  return html.replace(/<!--F:(\w+)-->([\s\S]*?)<!--\/F:\1-->/g, (_, name, inner) => (flags[name] ? inner : ''));
}
