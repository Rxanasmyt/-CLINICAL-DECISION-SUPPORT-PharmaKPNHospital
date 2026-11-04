// PIN ล็อกหน้าจอ: เก็บเป็น PBKDF2-SHA256 + salt (ไม่เก็บ PIN จริง)
// หมายเหตุ: เป็นการล็อกหน้าจอเพื่อกันคนเปิดดูโดยไม่ตั้งใจ ไม่ใช่การเข้ารหัสข้อมูลในเครื่อง
import type { PinRecord } from './settings';

const ITER = 150_000;
const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
const rnd = () => hex(crypto.getRandomValues(new Uint8Array(16)).buffer);

async function derive(pin: string, salt: string, iter: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: iter }, key, 256));
}
export const validPin = (pin: string) => /^\d{4,8}$/.test(pin);
export async function makePin(pin: string, iter = ITER): Promise<PinRecord> {
  if (!validPin(pin)) throw new Error('PIN ต้องเป็นตัวเลข 4–8 หลัก');
  const salt = rnd();
  return { salt, iter, hash: await derive(pin, salt, iter) };
}
export async function checkPin(pin: string, rec: PinRecord): Promise<boolean> {
  const h = await derive(pin, rec.salt, rec.iter);
  let d = 0; for (let i = 0; i < h.length; i++) d |= h.charCodeAt(i) ^ (rec.hash.charCodeAt(i) || 0);
  return d === 0 && h.length === rec.hash.length;
}

/** หน่วงเวลาเมื่อใส่ผิดหลายครั้ง: 3 ครั้งแรกไม่หน่วง จากนั้น 2^n วินาที สูงสุด 5 นาที */
export function lockoutSeconds(fails: number): number {
  if (fails < 3) return 0;
  return Math.min(300, 2 ** (fails - 2));
}

/** ควรล็อกหรือไม่ เมื่อกลับมาใช้หลังไม่ได้ใช้งาน idleMs (autoLockMin = 0 คือไม่ล็อกอัตโนมัติ) */
export function shouldAutoLock(idleMs: number, autoLockMin: number): boolean {
  return autoLockMin > 0 && idleMs >= autoLockMin * 60_000;
}
