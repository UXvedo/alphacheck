import {defineConfig} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import {featuresEnabled} from './src/features.js';
import {formatAsOf} from './src/time.js';
import ogHandler from './api/og.js';

const pages = fs.existsSync('.pages.json') ? JSON.parse(fs.readFileSync('.pages.json', 'utf8')) : ['index.html'];
const features = featuresEnabled(process.env);
const snap = JSON.parse(fs.readFileSync('public/snapshot.json', 'utf8'));

export default defineConfig({
  define: {__FEATURES_ON__: JSON.stringify(features)},
  plugins: [{
    name: 'alphacheck-html',
    configureServer(server) { server.middlewares.use('/api/og', ogHandler); },
    configurePreviewServer(server) { server.middlewares.use('/api/og', ogHandler); },
    transformIndexHtml(html) {
      let out = html
        .replaceAll('%%ASOF%%', formatAsOf(snap.asOf))
        .replaceAll('%%ASOF_ISO%%', snap.asOf)
        .replaceAll('%%BLOCK%%', String(snap.block));
      if (!features) out = out.replace(/<!--FEATURES-->[\s\S]*?<!--\/FEATURES-->/g, '');
      return out;
    },
  }],
  build: {rollupOptions: {input: Object.fromEntries(pages.map(p => [p.replace(/\/?index\.html$/, '') || 'main', path.resolve(p)]))}},
});
