// One-off: render public/og.png (1200x630). Run: node scripts/og.mjs
import {chromium} from 'playwright';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1200,height:630}});
await p.setContent(`<body style="margin:0;width:1200px;height:630px;background:radial-gradient(circle at 80% 20%,#0c2a3d,#0b0d12 60%);font-family:system-ui,sans-serif;color:#e7e9ee;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box">
<div style="font-size:44px;font-weight:700;color:#7dd3fc">τ AlphaCheck</div>
<div style="font-size:104px;font-weight:800;line-height:1.05;margin:24px 0;background:linear-gradient(90deg,#fff,#7dd3fc);-webkit-background-clip:text;color:transparent">High APY ≠ profit</div>
<div style="font-size:36px;color:#b8bdc9">Bittensor subnet staking: what you really get back in TAO</div>
<div style="font-size:28px;color:#8a91a3;margin-top:40px">alphacheck.io</div></body>`);
await p.screenshot({path:'public/og.png'});await b.close();
