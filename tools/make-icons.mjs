// สร้างไอคอน PWA จากโลโก้ รพ. (public/assets/kpn-logo.png)
import sharp from 'sharp';
const src = 'public/assets/kpn-logo.png';
for (const [size, name, pad] of [[192, 'pwa-192.png', 0.12], [512, 'pwa-512.png', 0.12], [512, 'pwa-maskable-512.png', 0.28]]) {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(src).resize(inner, inner, { fit: 'contain', background: '#ffffff' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 3, background: '#ffffff' } }).composite([{ input: logo, gravity: 'center' }]).png().toFile('public/' + name);
}
