// Star buttons and starred-first ordering on static pages (subnet list, subnet pages, leaderboard).
import {loadWatch, toggleWatch, starredFirst} from './watchlist.js';

const store = (() => { try { return window.localStorage; } catch { return null; } })();

function paint() {
  const ids = loadWatch(store);
  document.querySelectorAll('[data-star]').forEach(btn => {
    const on = ids.includes(+btn.dataset.star);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? '★' : '☆';
    const name = btn.dataset.name || `SN${btn.dataset.star}`;
    btn.setAttribute('aria-label', on ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`);
    btn.title = btn.getAttribute('aria-label');
  });
  document.querySelectorAll('[data-watch-sort]').forEach(box => {
    const kids = [...box.querySelectorAll(':scope > [data-sn]')];
    starredFirst(kids, ids, el => el.dataset.sn).forEach(el => box.appendChild(el));
  });
}

document.addEventListener('click', e => {
  const btn = e.target.closest?.('[data-star]');
  if (!btn) return;
  e.preventDefault();
  toggleWatch(store, btn.dataset.star);
  paint();
  document.dispatchEvent(new CustomEvent('watchlist-change'));
});
paint();
