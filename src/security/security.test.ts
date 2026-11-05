import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { AppDb } from '../storage/db';
import { Store } from '../storage/store';
import { makePin, checkPin, validPin, lockoutSeconds, shouldAutoLock } from './pin';
import { needsBackup, daysSince } from './backupReminder';
import { findExpired, purgeExpired } from './retention';
import { isConfigured } from '../storage/settings';

const mk = async () => { const s = new Store(new AppDb('sec-' + Math.random()), null); await s.init(); return s; };

describe('PIN', () => {
  it('ถูก PIN ผ่าน ผิดไม่ผ่าน และไม่เก็บ PIN จริง', async () => {
    const rec = await makePin('4821', 1000);
    expect(JSON.stringify(rec)).not.toContain('4821');
    expect(await checkPin('4821', rec)).toBe(true);
    expect(await checkPin('4822', rec)).toBe(false);
    const other = await makePin('4821', 1000);
    expect(other.hash).not.toBe(rec.hash);            // salt ต่างกัน
  });
  it('รับเฉพาะตัวเลข 4–8 หลัก', () => {
    expect(['123', '123456789', 'abcd', '12 34', ''].some(validPin)).toBe(false);
    expect(['1234', '12345678'].every(validPin)).toBe(true);
  });
  it('หน่วงเวลาเมื่อใส่ผิดซ้ำ และล็อกอัตโนมัติตามเวลา', () => {
    expect([0, 1, 2, 3, 4, 5, 20].map(lockoutSeconds)).toEqual([0, 0, 0, 2, 4, 8, 300]);
    expect(shouldAutoLock(4 * 60_000, 5)).toBe(false);
    expect(shouldAutoLock(5 * 60_000, 5)).toBe(true);
    expect(shouldAutoLock(999_999_999, 0)).toBe(false);
  });
});

describe('เตือนสำรองข้อมูล', () => {
  const now = Date.parse('2026-11-10T00:00:00Z'), day = 86_400_000;
  it('ไม่มีข้อมูล = ไม่เตือน · ไม่เคยสำรอง = เตือน · เกิน 7 วัน = เตือน', () => {
    expect(needsBackup(false, null, now)).toBe(false);
    expect(needsBackup(true, null, now)).toBe(true);
    expect(needsBackup(true, now - 6 * day, now)).toBe(false);
    expect(needsBackup(true, now - 7 * day, now)).toBe(true);
    expect(daysSince(now - 3 * day, now)).toBe(3);
  });
});

describe('ประวัติการแก้ไข (audit)', () => {
  it('บันทึกผู้ใช้/การกระทำ/รหัสรายการ โดยไม่มีชื่อหรือ HN ผู้ป่วย', async () => {
    const s = await mk(); s.setActor(() => 'ภก.ทดสอบ');
    s.setJson('adrCases.v1', [{ id: 11, cid: '11', label: 'สมชาย ใจดี · HN 99', saved: '2026-01-01T00:00', data: { pt: { name: 'สมชาย ใจดี', hn: '99' } } }]);
    s.setJson('adrCases.v1', [{ id: 11, cid: '11', label: 'สมชาย ใจดี · HN 99', saved: '2026-01-01T00:00', data: { pt: { name: 'สมชาย ใจดี', hn: '99' }, x: 1 } }]);
    s.setJson('adrCases.v1', []);
    const rows = (await s.auditAll()).map((r) => [r.user, r.action, r.collection, r.recordId]);
    expect(rows).toEqual([['ภก.ทดสอบ', 'เพิ่ม', 'adr_cases', '11'], ['ภก.ทดสอบ', 'แก้ไข', 'adr_cases', '11'], ['ภก.ทดสอบ', 'ลบ', 'adr_cases', '11']]);
    expect(JSON.stringify(await s.auditAll())).not.toMatch(/สมชาย|HN 99|"99"/);
  });
  it('ค่าที่ไม่เปลี่ยนไม่ลงประวัติ · รับจากซิงก์ลงประวัติเป็น "ซิงก์"', async () => {
    const s = await mk();
    s.setJson('adrCqi.v1', [{ id: 1, title: 'a' }]); s.setJson('adrCqi.v1', [{ id: 1, title: 'a' }]);
    s.applyRemote('cqi_projects', [{ collection: 'cqi_projects', id: '2', updatedAt: Date.now() + 5, data: { id: 2, title: 'b' } }]);
    const rows = (await s.auditAll()).map((r) => [r.user, r.action, r.recordId]);
    expect(rows).toEqual([['', 'เพิ่ม', '1'], ['ซิงก์', 'รับจากซิงก์', '2']]);
  });
  it('ล้างข้อมูลในเครื่องแล้วประวัติยังอยู่ และมีบันทึกการล้าง', async () => {
    const s = await mk(); s.setJson('adrCqi.v1', [{ id: 1, title: 'a' }]);
    await s.clearLocal();
    const rows = (await s.auditAll()).map((r) => r.action);
    expect(rows).toEqual(['เพิ่ม', 'ลบข้อมูลทั้งหมดในเครื่อง']);
  });
});

describe('อายุข้อมูล (PDPA)', () => {
  it('หารายการเกินกำหนด และลบเมื่อยืนยัน (ลงประวัติ + เขียน tombstone)', async () => {
    const s = await mk();
    const now = Date.parse('2026-11-04T00:00:00Z');
    s.setJson('adrCases.v1', [{ id: 1, saved: '2020-01-01T00:00' }, { id: 2, saved: '2025-06-01T00:00' }, { id: 3, saved: 'ไม่ใช่วันที่' }]);
    s.setJson('intensive.v1', [{ id: 9, start: '2019-05-05' }]);
    s.markPushed(s.pendingRows());
    const exp = findExpired(s, 5, now);
    expect(exp.map((e) => [e.key, e.ids])).toEqual([['adrCases.v1', [1]], ['intensive.v1', [9]]]);
    expect(purgeExpired(s, exp)).toBe(2);
    expect(s.getJson<any[]>('adrCases.v1', []).map((c) => c.id)).toEqual([2, 3]);
    expect(s.pendingRows().filter((r) => r.deleted).map((r) => r.pk).sort()).toEqual(['adr_cases|1', 'intensive_monitoring|9']);
    expect((await s.auditAll()).filter((r) => r.action === 'ลบตามอายุข้อมูล')).toHaveLength(2);
  });
});

describe('ซิงก์ต้องได้รับการอนุมัติ PDPA ก่อน', () => {
  it('ไม่ติ๊กอนุมัติ = ไม่ตั้งค่าซิงก์', () => {
    const base = { enabled: true, url: 'https://x', token: 't', salt: 's' };
    expect(isConfigured({ ...base, approved: false })).toBe(false);
    expect(isConfigured({ ...base, approved: true })).toBe(true);
  });
});
