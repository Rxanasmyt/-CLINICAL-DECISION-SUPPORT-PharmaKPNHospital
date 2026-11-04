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
// โลโก้ รพ. ตัดขอบขาวออกและทำพื้นขาวให้โปร่งใส (วางบนกรอบสีอ่อนได้โดยไม่เห็นกล่องสี่เหลี่ยมซ้อน)
const trimmed = await sharp('public/assets/kpn-logo.png').trim({ background: '#ffffff', threshold: 18 }).extend({ top: 6, bottom: 6, left: 6, right: 6, background: '#ffffff' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = trimmed;
for (let i = 0; i < data.length; i += 4) {
  const m = Math.min(data[i], data[i + 1], data[i + 2]);
  data[i + 3] = Math.max(0, Math.min(255, Math.round((250 - m) * 255 / 40)));
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile('public/assets/kpn-logo-trim.png');
