import {formatAsOf, isStale} from './time.js';

const banner = document.getElementById('stale-banner');
if (banner && isStale(banner.dataset.asof)) {
  banner.hidden = false;
  banner.textContent = `Snapshot data is more than 36 hours old (data as of ${formatAsOf(banner.dataset.asof)}). Figures may be out of date.`;
}
