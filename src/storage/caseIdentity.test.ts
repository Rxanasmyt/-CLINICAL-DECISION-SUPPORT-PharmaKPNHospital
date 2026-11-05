import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { hnKey, findSameCase, upsertCase, duplicateKeys } from './caseIdentity';
import { hashHn } from './pdpa';
import { AppDb } from './db';
import { Store } from './store';
import { SyncEngine } from './syncEngine';
import { SheetsAdapter } from './sheetsAdapter';
import { load } from './fakeSheets';

const SALT = 'KPN-salt';
const entry = (id: number, name: string, hn: string, extra: any = {}) => ({ id, label: name && hn ? `${name} · HN ${hn}` : (name || hn || 'เคสไม่ระบุชื่อ'), saved: '2026-05-01T10:00', data: { pt: { name, hn } }, sum: { month: '2026-05', drugs: ['A'] }, ...extra });

describe('ระบุเคสเดียวกันด้วย HN', () => {
  it('กุญแจ HN: ว่าง → ว่าง · hash แล้วคงเดิม · ดิบ → hash เมื่อมี salt, raw: เมื่อไม่มี', async () => {
    expect(await hnKey('  ', SALT)).toBe('');
    expect(await hnKey('sha256:abc', SALT)).toBe('sha256:abc');
    expect(await hnKey('123', SALT)).toBe(await hashHn('123', SALT));
    expect(await hnKey('123', '')).toBe('raw:123');
  });
  it('ป้ายชื่อตรง (กติกาเดิม) หรือ HN ตรง → เป็นเคสเดียวกัน · คนละ HN → ไม่ใช่', async () => {
    const list = [entry(1, 'สมชาย', '111'), entry(2, 'สมหญิง', '222')];
    expect((await findSameCase(list, 'สมชาย · HN 111', '111', SALT))?.id).toBe(1);
    expect((await findSameCase(list, 'ชื่อสะกดต่าง · HN 222', '222', SALT))?.id).toBe(2);   // ชื่อพิมพ์ต่าง HN ตรง
    expect(await findSameCase(list, 'ใหม่ · HN 333', '333', SALT)).toBeUndefined();
  });
  it('เคสที่มาจากเครื่องอื่น (ไม่มีชื่อ HN เป็น hash) จับคู่กับ HN ดิบได้เมื่อมี salt', async () => {
    const remote = entry(5, '', await hashHn('444', SALT), { label: 'เคส 5', cid: '5' });
    expect((await findSameCase([remote], 'ผู้ป่วย · HN 444', '444', SALT))?.id).toBe(5);
    expect(await findSameCase([remote], 'ผู้ป่วย · HN 444', '444', '')).toBeUndefined();     // ไม่มี salt เทียบข้ามรูปแบบไม่ได้
    expect(await findSameCase([remote], 'ผู้ป่วย · HN 445', '445', SALT)).toBeUndefined();
  });
  it('HN ว่างไม่จับคู่ด้วย HN (กันเคสไม่ระบุ HN ถูกรวมกัน)', async () => {
    const list = [entry(1, 'ก', ''), entry(2, 'ข', '')];
    expect(await findSameCase(list, 'ค', '', SALT)).toBeUndefined();
  });
  it('upsert: เคสเดิมคงรหัส cid และไม่เพิ่มแถว · เคสใหม่เพิ่มหัวรายการ', () => {
    const old = entry(1, 'สมชาย', '111', { cid: 'X' });
    const upd = upsertCase([old, entry(2, 'อื่น', '9')], entry(10, 'สมชาย', '111'), old);
    expect(upd.map((c) => c.id)).toEqual([10, 2]); expect(upd[0].cid).toBe('X');
    const add = upsertCase([old], entry(11, 'ใหม่', '7'), undefined);
    expect(add.map((c) => c.id)).toEqual([11, 1]); expect(add[0].cid).toBe('11');
  });
  it('ตรวจ HN ซ้ำในรายการเดิม (ทั้งดิบและ hash)', async () => {
    const h = await hashHn('555', SALT);
    const d = await duplicateKeys([entry(1, 'ก', '555'), entry(2, '', h), entry(3, 'ข', '666'), entry(4, 'ค', '')], SALT);
    expect([...d]).toEqual([h]);
  });
});

describe('สองเครื่องบันทึกผู้ป่วยรายเดียวกัน → ไม่เกิดเคสซ้ำ', () => {
  it('เครื่อง A บันทึก → B รับมา (ไม่มีชื่อ) → B บันทึกผู้ป่วยเดิมด้วย HN → เคสเดียวทั้งสองเครื่องและในชีต', async () => {
    const env = load();
    const fetchImpl = (async (_u: any, init: any) => ({ ok: true, status: 200, json: async () => JSON.parse(env.ctx.doPost({ postData: { contents: init.body } }).s) })) as unknown as typeof fetch;
    let n = 0;
    const dev = async () => { const store = new Store(new AppDb('ci-' + ++n + Math.random()), null); await store.init(); const engine = new SyncEngine(store, () => true); engine.setRemote(new SheetsAdapter({ url: 'x', token: 'secret-token-1234567890abcd', salt: SALT }, fetchImpl)); return { store, engine }; };
    const A = await dev(), B = await dev();
    const save = async (d: typeof A, e: any) => { const list = d.store.getJson<any[]>('adrCases.v1', []); const hit = await findSameCase(list, e.label, e.data.pt.hn, SALT); d.store.setJson('adrCases.v1', upsertCase(list, e, hit)); };

    await save(A, entry(100, 'สมชาย ใจดี', '66012345', { sum: { month: '2026-05', drugs: ['Allopurinol'] } }));
    await A.engine.syncNow(); await B.engine.syncNow();
    expect(B.store.getJson<any[]>('adrCases.v1', [])).toHaveLength(1);
    expect(B.store.getJson<any[]>('adrCases.v1', [])[0].data.pt.name).toBe('');

    await new Promise((r) => setTimeout(r, 5));
    await save(B, entry(200, 'สมชาย ใจดี', '66012345', { sum: { month: '2026-05', drugs: ['Allopurinol', 'Carbamazepine'] } }));
    await B.engine.syncNow(); await A.engine.syncNow();

    const a = A.store.getJson<any[]>('adrCases.v1', []), b = B.store.getJson<any[]>('adrCases.v1', []);
    expect(a).toHaveLength(1); expect(b).toHaveLength(1);
    expect(a[0].cid).toBe('100'); expect(b[0].cid).toBe('100');
    expect(a[0].sum.drugs).toEqual(['Allopurinol', 'Carbamazepine']);
    expect(a[0].data.pt.name).toBe('สมชาย ใจดี');                         // A คงชื่อของตัวเอง
    const sh = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    expect(sh.grid.slice(1)).toHaveLength(1);                              // ในชีตมีแถวเดียว
  });
});
