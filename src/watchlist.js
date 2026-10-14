// Watchlist: starred subnet ids, kept only in this browser's localStorage. Never sent anywhere.
export const WATCH_KEY = 'alphacheck.watchlist';

export function loadWatch(storage) {
  try {
    const v = JSON.parse(storage?.getItem(WATCH_KEY) || '[]');
    return Array.isArray(v) ? [...new Set(v.map(Number).filter(n => Number.isInteger(n) && n >= 0))] : [];
  } catch { return []; }
}

export function saveWatch(storage, ids) {
  try { storage?.setItem(WATCH_KEY, JSON.stringify(ids)); } catch { /* storage blocked or full: ignore */ }
}

export function toggleWatch(storage, id) {
  const ids = loadWatch(storage), n = Number(id);
  const next = ids.includes(n) ? ids.filter(x => x !== n) : [...ids, n];
  saveWatch(storage, next);
  return next.includes(n);
}

// Stable sort: starred items first, original order kept inside each group.
export function starredFirst(items, ids, idOf = x => x) {
  const set = new Set(ids.map(Number));
  return items.map((x, i) => [x, i]).sort((a, b) => (set.has(Number(idOf(b[0]))) - set.has(Number(idOf(a[0])))) || (a[1] - b[1])).map(p => p[0]);
}
