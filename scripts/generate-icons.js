import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.join(__dirname, '../public/favicon.svg');
const outDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  for (const size of sizes) {
    await sharp(input).resize(size, size).flatten({ background: '#2D5A3D' }).toFile(path.join(outDir, `icon-${size}x${size}.png`));
  }
  await sharp(input).resize(512, 512).flatten({ background: '#2D5A3D' }).toFile(path.join(outDir, 'icon-512x512-maskable.png'));
  await sharp(input).resize(180, 180).flatten({ background: '#2D5A3D' }).toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('Icons generated successfully.');
}
generate().catch(console.error);