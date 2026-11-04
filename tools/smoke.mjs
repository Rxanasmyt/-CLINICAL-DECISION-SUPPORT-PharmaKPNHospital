// ตรวจเบื้องต้น: เปิดแอป คลิกทุกเมนู เก็บ error ในคอนโซล และถ่ายภาพหน้าจอ
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');
const url = process.argv[2] || 'http://localhost:4173/';
const out = process.argv[3] || '.';
const w = Number(process.argv[4] || 1280), h = Number(process.argv[5] || 900);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text().slice(0, 300)); });
p.on('pageerror', e => errs.push('pageerror: ' + e.message));
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(800);
await p.screenshot({ path: `${out}/home.png`, fullPage: true });
for (const label of ['ขนาดยา TB', 'Warfarin', 'ยาน้ำเด็ก', 'ประเมินแพ้ยา', 'เครื่องมือ', 'มาตรฐาน']) {
  const btn = p.locator('nav button', { hasText: label }).first();
  await btn.click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${label.replace(/\s/g, '_')}.png`, fullPage: true });
}
console.log(errs.length ? errs.join('\n') : 'no console errors');
await b.close();
