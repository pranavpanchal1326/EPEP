import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.join(__dirname, '../public/favicon.svg');
const outDir = path.join(__dirname, '../public/splash');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const devices = [
  { name: 'iPhone-SE', w: 750, h: 1334 },
  { name: 'iPhone-X', w: 1125, h: 2436 },
  { name: 'iPhone-14-Pro', w: 1179, h: 2556 }
];

async function generate() {
  for (const dev of devices) {
    const canvas = await sharp({ create: { width: dev.w, height: dev.h, channels: 4, background: '#2D5A3D' } });
    const logo = await sharp(input).resize(192, 192).toBuffer();
    await canvas.composite([{ input: logo, gravity: 'center' }]).toFile(path.join(outDir, `splash-${dev.w}x${dev.h}.png`));
  }
  console.log('Splash screens generated.');
}
generate().catch(console.error);