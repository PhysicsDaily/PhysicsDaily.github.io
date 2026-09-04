import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const svgPath = path.join(rootDir, 'public', 'favicon.svg');
const publicDir = path.join(rootDir, 'public');

/**
 * Packs multiple PNG buffers into a single standard .ico file buffer.
 * @param {{ size: number, buffer: Buffer }[]} images
 * @returns {Buffer}
 */
function packIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + count * dirEntrySize;

  let currentOffset = dirSize;
  const entries = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);

    entries.push(entry);
    currentOffset += img.buffer.length;
  }

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

async function main() {
  if (!fs.existsSync(svgPath)) {
    throw new Error(`favicon.svg not found at ${svgPath}`);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  const rasterSizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 }, // Google Search recommended size
    { name: 'apple-touch-icon.png', size: 180 }, // iOS Safari
    { name: 'icon-192.png', size: 192 }, // Android Chrome / PWA
    { name: 'icon-512.png', size: 512 }, // Android Chrome splash / PWA
  ];

  const icoSizes = [16, 32, 48];
  const icoBuffers = [];

  for (const item of rasterSizes) {
    const outPath = path.join(publicDir, item.name);
    const pngBuffer = await sharp(svgBuffer, { density: 300 })
      .resize(item.size, item.size)
      .png()
      .toBuffer();

    fs.writeFileSync(outPath, pngBuffer);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);

    if (icoSizes.includes(item.size)) {
      icoBuffers.push({ size: item.size, buffer: pngBuffer });
    }
  }

  const icoBuffer = packIco(icoBuffers);
  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Generated favicon.ico (multi-size: 16x16, 32x32, 48x48)`);
}

main().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
