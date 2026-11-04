// ตรวจ PWA: ติดตั้ง service worker → ตัดเน็ต → รีโหลด → ยังคำนวณได้
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH || 'playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'allow' });
const p = await ctx.newPage();
await p.goto(process.argv[2] || 'http://localhost:4173/'); await p.waitForTimeout(2500);
console.log('manifest short_name:', await p.evaluate(() => fetch('/manifest.webmanifest').then(r => r.json()).then(j => j.short_name)));
await p.evaluate(async () => { await navigator.serviceWorker.ready; });
await p.reload(); await p.waitForTimeout(800);
console.log('controlled by SW:', await p.evaluate(() => !!navigator.serviceWorker.controller));
// ปิดเซิร์ฟเวอร์จริง (setOffline ของ Playwright บล็อกแม้แต่หน้าที่ service worker ให้)
const { execSync } = await import('node:child_process');
execSync(process.env.STOP_SERVER || 'true');
await new Promise(r => setTimeout(r, 800));
await p.goto('http://localhost:4173/'); await p.waitForTimeout(1200);
console.log('offline badge:', await p.locator('.syncbadge').first().innerText());
await p.locator('nav button', { hasText: 'ขนาดยา TB' }).click(); await p.waitForTimeout(300);
console.log('TB offline shows 250 mg:', (await p.content()).includes('250 mg'));
await b.close();
