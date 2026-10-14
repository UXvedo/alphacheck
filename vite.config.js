import {defineConfig} from 'vite';import fs from 'node:fs';import path from 'node:path';
const pages=fs.existsSync('.pages.json')?JSON.parse(fs.readFileSync('.pages.json','utf8')):['index.html'];
export default defineConfig({build:{rollupOptions:{input:Object.fromEntries(pages.map(p=>[p.replace(/\/?index\.html$/,'')||'main',path.resolve(p)]))}}});
