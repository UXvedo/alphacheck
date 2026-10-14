export function formatBreakEvenDays(days) {
  if (days == null || !Number.isFinite(days)) return 'Never';
  if (days === 0) return '0 days';
  const text = days < 10
    ? days.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 2})
    : days.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1});
  return `${text} days`;
}
