// Share-image template. Callers pass the calculated est. APY, break-even, and 30-day net TAO.

const xml = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

export function renderOgSvg({title = 'AlphaCheck', stakeLabel = '100 TAO', apy = '—', breakEven = '—', netTao = '—'} = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0d12"/>
  <rect x="0" y="0" width="1200" height="8" fill="#7dd3fc"/>
  <text x="72" y="110" fill="#7dd3fc" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="32" font-weight="700">τ AlphaCheck</text>
  <text x="72" y="200" fill="#e7e9ee" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="52" font-weight="700">${xml(title)}</text>
  <text x="72" y="258" fill="#b8bdc9" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="28">Stake ${xml(stakeLabel)}</text>
  <text x="72" y="360" fill="#8a91a3" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="22">Est. APY</text>
  <text x="72" y="408" fill="#e7e9ee" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="36">${xml(apy)}</text>
  <text x="420" y="360" fill="#8a91a3" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="22">Break-even days</text>
  <text x="420" y="408" fill="#e7e9ee" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="36">${xml(breakEven)}</text>
  <text x="820" y="360" fill="#8a91a3" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="22">30-day net TAO</text>
  <text x="820" y="408" fill="#e7e9ee" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="36">${xml(netTao)}</text>
  <text x="72" y="560" fill="#8a91a3" font-family="DejaVu Sans,system-ui,Segoe UI,sans-serif" font-size="22">alphacheck.io · estimates, not financial advice</text>
</svg>
`;
}
