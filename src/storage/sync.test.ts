import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppDb } from './db';
import { Store } from './store';
import { SyncEngine } from './syncEngine';
import { SheetsAdapter } from './sheetsAdapter';
import { buildBackup, importBackup } from './backup';
import { hashHn } from './pdpa';

/** จำลอง Apps Script: ตรวจ token ทุกคำขอ เก็บแถวละหนึ่งรายการ (ล่าสุดชนะ) และบันทึกคำขอดิบไว้ตรวจ PDPA */
function fakeServer(token = 'secret-token') {
  const rows = new Map<string, any>();
  const raw: string[] = [];
  const fetchImpl = (async (_url: any, init: any) => {
    raw.push(init.body);
    expect(init.headers['Content-Type']).toMatch(/^text\/plain/);   // เลี่ยง CORS preflight
    const req = JSON.parse(init.body);
    const out = (o: any) => ({ ok: true, status: 200, json: async () => o }) as any;
    if (req.token !== token) return out({ ok: false, error: 'token ไม่ถูกต้อง' });
    if (req.action === 'ping') return out({ ok: true });
    if (req.action === 'push') {
      for (const r of req.records) {
        const k = req.collection + '|' + r.id, cur = rows.get(k);
        if (!cur || r.updatedAt >= cur.updatedAt) rows.set(k, { ...r, collection: req.collection });
      }
      return out({ ok: true, saved: req.records.length });
    }
    if (req.action === 'pull') {
      return out({ ok: true, records: [...rows.values()].filter((r) => r.collection === req.collection && r.updatedAt >= req.since).map((r) => ({ id: r.id, updatedAt: r.updatedAt, deleted: r.deleted, data: r.data })) });
    }
    return out({ ok: false, error: 'bad' });
  }) as unknown as typeof fetch;
  return { rows, raw, fetchImpl };
}

let n = 0;
async function device(server: ReturnType<typeof fakeServer>, opts: { online?: () => boolean; token?: string; salt?: string } = {}) {
  const store = new Store(new AppDb('t' + ++n + '-' + Math.random()), null);
  await store.init();
  const engine = new SyncEngine(store, opts.online);
  engine.setRemote(new SheetsAdapter({ url: 'https://script.example/exec', token: opts.token ?? 'secret-token', salt: opts.salt ?? 'KPN-salt' }, server.fetchImpl));
  return { store, engine };
}
const caseOf = (cid: string, name: string, hn: string, extra: any = {}) => ({
  id: Number(cid), cid, label: `${name} · HN ${hn}`, saved: '2026-05-01T10:00',
  data: { pt: { hn, name, age: '45', sex: 'หญิง', hx: '' }, drugs: [], events: [] },
  sum: { month: '2026-05', drugs: ['Allopurinol'], nj: 6, njCat: 'probable', who: 'probable', prev: 'prev' }, ...extra,
});

describe('คิวในเครื่อง (IndexedDB)', () => {
  it('บันทึกแล้วเกิดรายการค้างส่ง · เขียนซ้ำค่าเดิมไม่เกิดรายการใหม่ · ลบแล้วเป็น tombstone', async () => {
    const { store } = await device(fakeServer());
    store.setJson('infoEval.v1', [{ id: 1, topic: 'a' }, { id: 2, topic: 'b' }]);
    expect(store.pendingCount()).toBe(2);
    store.markPushed(store.pendingRows());
    expect(store.pendingCount()).toBe(0);
    store.setJson('infoEval.v1', [{ id: 1, topic: 'a' }, { id: 2, topic: 'b' }]);
    expect(store.pendingCount()).toBe(0);
    store.setJson('infoEval.v1', [{ id: 1, topic: 'a2' }]);
    const p = store.pendingRows().map((r) => [r.id, r.deleted]);
    expect(p.sort()).toEqual([['1', false], ['2', true]]);
  });
  it('ข้อมูลอยู่รอดหลังปิด-เปิดใหม่ (โหลดจาก IndexedDB)', async () => {
    const db = new AppDb('persist-test');
    const a = new Store(db, null); await a.init();
    a.setJson('adrCqi.v1', [{ id: 5, title: 'x' }]); await a.flush();
    const b = new Store(new AppDb('persist-test'), null); await b.init();
    expect(b.getJson('adrCqi.v1', [])).toEqual([{ id: 5, title: 'x' }]);
    expect(b.pendingCount()).toBe(1);
  });
  it('ย้ายข้อมูลเดิมจาก localStorage ของต้นแบบเข้า IndexedDB ครั้งแรก', async () => {
    const legacy: any = { getItem: (k: string) => (k === 'workload.v1' ? JSON.stringify([{ month: '2026-01', rxOpd: 10 }]) : null), removeItem() {} };
    const s = new Store(new AppDb('mig'), legacy); await s.init();
    expect(s.getJson('workload.v1', [])).toEqual([{ month: '2026-01', rxOpd: 10 }]);
  });
});

describe('PDPA: ไม่มีชื่อผู้ป่วยบน Google Sheets', () => {
  it('คำขอที่ส่งออกไม่มีชื่อ/HN ดิบ ส่งเฉพาะรหัสเคสและ HN ที่ hash', async () => {
    const server = fakeServer();
    const A = await device(server);
    A.store.setJson('adrCases.v1', [caseOf('1001', 'สมชาย ใจดี', '66012345')]);
    A.store.setJson('intensive.v1', [{ id: 7, hn: '66012345', drug: 'Warfarin', group: 'Warfarin', start: '2026-05-01', next: '', note: '', status: 'ติดตามอยู่' }]);
    await A.engine.syncNow();
    const all = server.raw.join('\n');
    expect(all).not.toContain('สมชาย');
    expect(all).not.toContain('ใจดี');
    expect(all).not.toContain('66012345');
    const row = server.rows.get('adr_cases|1001');
    expect(row.data.label).toBe('เคส 1001');
    expect(row.data.data.pt.name).toBe('');
    expect(row.data.data.pt.hn).toBe(await hashHn('66012345', 'KPN-salt'));
    expect(row.data.data.pt.hn).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(row.summary.drugs).toBe('Allopurinol');                 // คอลัมน์สรุปไว้ดูใน Sheets
    expect(server.rows.get('intensive_monitoring|7').data.hn).toBe(await hashHn('66012345', 'KPN-salt'));
  });
  it('ไม่ตั้ง salt = ไม่ส่งข้อมูลที่มี HN', async () => {
    const server = fakeServer();
    const A = await device(server, { salt: '' });
    A.store.setJson('adrCases.v1', [caseOf('1', 'ก', '123')]);
    await A.engine.syncNow();
    expect(A.engine.state.kind).toBe('error');
    expect(server.rows.size).toBe(0);
    expect(A.store.pendingCount()).toBe(1);   // ยังค้างในเครื่อง ไม่หาย
  });
});

describe('Sync หลายเครื่อง', () => {
  it('เครื่อง A บันทึก → เครื่อง B ได้รับ (ไม่มีชื่อ) · B แก้ → A ได้รับและคงชื่อ/HN ของตัวเอง', async () => {
    const server = fakeServer();
    const A = await device(server), B = await device(server);
    A.store.setJson('adrCases.v1', [caseOf('1001', 'สมชาย ใจดี', '66012345')]);
    await A.engine.syncNow(); await B.engine.syncNow();
    const onB = B.store.getJson<any[]>('adrCases.v1', []);
    expect(onB).toHaveLength(1);
    expect(onB[0].data.pt.name).toBe('');
    expect(onB[0].label).toBe('เคส 1001');

    await new Promise((r) => setTimeout(r, 5));
    B.store.setJson('adrCases.v1', [{ ...onB[0], data: { ...onB[0].data, pharmNote: 'แก้จากเครื่อง B' } }]);
    await B.engine.syncNow(); await A.engine.syncNow();
    const onA = A.store.getJson<any[]>('adrCases.v1', [])[0];
    expect(onA.data.pharmNote).toBe('แก้จากเครื่อง B');
    expect(onA.data.pt.name).toBe('สมชาย ใจดี');
    expect(onA.data.pt.hn).toBe('66012345');
    expect(onA.label).toBe('สมชาย ใจดี · HN 66012345');
  });
  it('แก้พร้อมกัน: updatedAt ล่าสุดชนะ', async () => {
    const server = fakeServer();
    const A = await device(server), B = await device(server);
    A.store.setJson('drug_info' as any, 1);   // คีย์ที่ไม่รู้จักไม่กระทบ
    A.store.setJson('adrCqi.v1', [{ id: 1, title: 'เดิม' }]);
    await A.engine.syncNow(); await B.engine.syncNow();
    A.store.setJson('adrCqi.v1', [{ id: 1, title: 'A แก้' }]);
    await new Promise((r) => setTimeout(r, 5));
    B.store.setJson('adrCqi.v1', [{ id: 1, title: 'B แก้ทีหลัง' }]);
    await A.engine.syncNow(); await B.engine.syncNow(); await A.engine.syncNow();
    expect(A.store.getJson<any[]>('adrCqi.v1', [])[0].title).toBe('B แก้ทีหลัง');
    expect(B.store.getJson<any[]>('adrCqi.v1', [])[0].title).toBe('B แก้ทีหลัง');
  });
  it('การลบซิงก์ไปเครื่องอื่นด้วย', async () => {
    const server = fakeServer();
    const A = await device(server), B = await device(server);
    A.store.setJson('ptcMeet.v1', ['2026-01-10', '2026-02-14']);
    await A.engine.syncNow(); await B.engine.syncNow();
    expect(B.store.getJson('ptcMeet.v1', [])).toHaveLength(2);
    await new Promise((r) => setTimeout(r, 5));
    A.store.setJson('ptcMeet.v1', ['2026-02-14']);
    await A.engine.syncNow(); await B.engine.syncNow();
    expect(B.store.getJson('ptcMeet.v1', [])).toEqual(['2026-02-14']);
  });
  it('มาตรฐาน (std_assessment) หลาย key รวมกันได้ถูกต้อง', async () => {
    const server = fakeServer();
    const A = await device(server), B = await device(server);
    A.store.setJson('stdAssess.v1', { '3-2.1': { st: 'done', note: 'ก' } });
    B.store.setJson('stdAssess.v1', { '9-1.2': { st: 'doing', note: 'ข' } });
    await A.engine.syncNow(); await B.engine.syncNow(); await A.engine.syncNow();
    const expected = { '3-2.1': { st: 'done', note: 'ก' }, '9-1.2': { st: 'doing', note: 'ข' } };
    expect(A.store.getJson('stdAssess.v1', {})).toEqual(expected);
    expect(B.store.getJson('stdAssess.v1', {})).toEqual(expected);
  });
});

describe('ออฟไลน์ / ข้อผิดพลาด', () => {
  it('ออฟไลน์: เขียนในเครื่องได้ สถานะ "ออฟไลน์" แล้วส่งเมื่อกลับมาออนไลน์', async () => {
    const server = fakeServer();
    let online = false;
    const A = await device(server, { online: () => online });
    A.store.setJson('adrCqi.v1', [{ id: 1, title: 't' }]);
    await A.engine.syncNow();
    expect(A.engine.state).toEqual({ kind: 'offline', pending: 1 });
    expect(server.rows.size).toBe(0);
    online = true;
    await A.engine.syncNow();
    expect(A.engine.state.kind).toBe('synced');
    expect(server.rows.size).toBe(1);
    expect(A.store.pendingCount()).toBe(0);
  });
  it('token ผิด: แจ้ง error และข้อมูลไม่หาย', async () => {
    const server = fakeServer();
    const A = await device(server, { token: 'wrong' });
    A.store.setJson('adrCqi.v1', [{ id: 1, title: 't' }]);
    await A.engine.syncNow();
    expect(A.engine.state).toMatchObject({ kind: 'error', message: 'token ไม่ถูกต้อง', pending: 1 });
    expect(A.store.getJson('adrCqi.v1', [])).toHaveLength(1);
  });
});

describe('ไฟล์สำรอง JSON จากต้นแบบ', () => {
  const proto = {
    app: 'PharmaKPNHospital', kind: 'adr-registry', v: 2,
    cases: [{ id: 1, label: 'ก · HN 1', saved: '2026-03-01T09:00', data: {}, sum: { month: '2026-03' } }, { id: 2, label: 'ข', saved: '2026-04-01T09:00', data: {}, sum: { month: '2026-04' } }],
    cqi: [{ id: 11, title: 'c' }], info: [{ id: 21, topic: 'i' }], intensive: [{ id: 31, hn: '1', drug: 'x', status: 'ติดตามอยู่' }],
    ptc: ['2026-01-05'], workload: [{ month: '2026-01', rxOpd: 100 }], std: { '3-2.1': { st: 'done', note: 'n' } },
  };
  it('นำเข้าครบทุกชุด (รวม std) และไม่ซ้ำเมื่อนำเข้าอีกรอบ', async () => {
    const { store } = await device(fakeServer());
    const r1 = importBackup(store, proto);
    expect(r1).toMatchObject({ cases: 2, cqi: 1, info: 1, intensive: 1, ptc: 1, workload: 1, std: 1 });
    const out = buildBackup(store);
    expect(out.cases.map((c: any) => c.id)).toEqual([2, 1]);       // เรียงใหม่สุดก่อน
    expect(out).toMatchObject({ cqi: proto.cqi, info: proto.info, intensive: proto.intensive, ptc: proto.ptc, workload: proto.workload, std: proto.std });
    const r2 = importBackup(store, proto);
    expect(r2).toMatchObject({ cases: 0, cqi: 0, info: 0, intensive: 0, ptc: 0, workload: 0, std: 0 });
  });
  it('ปฏิเสธไฟล์ที่ไม่ใช่ไฟล์สำรองของแอป', async () => {
    const { store } = await device(fakeServer());
    expect(() => importBackup(store, { hello: 1 })).toThrow();
  });
  it('ข้อมูลที่นำเข้าถูกส่งขึ้น Sheets แบบไม่มีชื่อ', async () => {
    const server = fakeServer();
    const A = await device(server);
    importBackup(A.store, { ...proto, cases: [{ id: 1, label: 'สมหญิง · HN 99', saved: '2026-03-01T09:00', data: { pt: { name: 'สมหญิง', hn: '99' } }, sum: {} }] });
    await A.engine.syncNow();
    expect(server.raw.join('\n')).not.toContain('สมหญิง');
    expect(server.rows.has('adr_cases|1')).toBe(true);
  });
});
