// สร้างไอคอน PWA จาก tools/icon.svg → public/
import sharp from 'sharp';
import fs from 'node:fs';
const svg = fs.readFileSync('tools/icon.svg');
const png = (size, file) => sharp(svg, { density: 384 }).resize(size, size).png().toFile('public/' + file);
await png(192, 'pwa-192.png');
await png(512, 'pwa-512.png');
await png(180, 'apple-touch-icon.png');
await png(32, 'favicon-32.png');
// maskable: ย่อภาพให้อยู่ในโซนปลอดภัย 80% บนพื้นสีเดียวกับขอบไอคอน
const inner = await sharp(svg, { density: 384 }).resize(Math.round(512 * 0.8)).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 3, background: '#0F5D57' } }).composite([{ input: inner, gravity: 'center' }]).png().toFile('public/pwa-maskable-512.png');
fs.copyFileSync('tools/icon.svg', 'public/favicon.svg');
