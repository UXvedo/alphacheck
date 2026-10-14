// Display caps (approved Oct 14): null/non-finite → "Never", over 365 days → "> 1 year".
export function formatBreakEvenDays(days) {
  if (days == null || !Number.isFinite(days)) return 'Never';
  if (days > 365) return '> 1 year';
  if (days === 0) return '0 days';
  const text = days < 10
    ? days.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 2})
    : days.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1});
  return `${text} days`;
}

export function formatApyRange(r, n = 1) {
  const f = x => (x * 100).toLocaleString('en-US', {minimumFractionDigits: n, maximumFractionDigits: n});
  if (!r || !Number.isFinite(r.min)) return '—';
  return f(r.min) === f(r.max) ? `${f(r.min)}%` : `${f(r.min)}–${f(r.max)}%`;
}
