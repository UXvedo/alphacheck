// Rasterize the share-image SVG to PNG. X, Discord and Telegram do not render SVG og:image.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Resvg} from '@resvg/resvg-js';

const FONTS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts');

export function svgToPng(svg) {
  const r = new Resvg(svg, {
    fitTo: {mode: 'width', value: 1200},
    font: {
      loadSystemFonts: false,
      fontFiles: [path.join(FONTS, 'DejaVuSans.ttf'), path.join(FONTS, 'DejaVuSans-Bold.ttf')],
      defaultFontFamily: 'DejaVu Sans',
      sansSerifFamily: 'DejaVu Sans',
    },
  });
  return r.render().asPng();
}
