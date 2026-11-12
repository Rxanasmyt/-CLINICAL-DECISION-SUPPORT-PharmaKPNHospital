// ตรวจครบทั้งสาย: ข้อมูลทุกชุดในแอป → ซิงก์ → Apps Script (Code.gs จำลอง) → เครื่องอื่นได้ข้อมูลครบเท่าเดิม
// และคอลัมน์ในชีตครอบคลุมสิ่งที่มาตรฐานความปลอดภัยด้านยา ข้อ 3 และข้อ 9 ต้องใช้เป็นหลักฐาน
import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { AppDb } from './db';
import { Store } from './store';
import { SyncEngine } from './syncEngine';
import { SheetsAdapter } from './sheetsAdapter';
import { hashHn } from './pdpa';
import { load } from './fakeSheets';
import { WL_FIELDS } from '../data/standards';

const TOKEN = 'secret-token-1234567890abcd', SALT = 'KPN-salt';
let n = 0;
function world() {
  const env = load();
  const fetchImpl = (async (_u: any, init: any) => {
    const out = JSON.parse(env.ctx.doPost({ postData: { contents: init.body } }).s);
    return { ok: true, status: 200, json: async () => out } as any;
  }) as unknown as typeof fetch;
  const device = async () => {
    const store = new Store(new AppDb('e2e-' + ++n + Math.random()), null); await store.init();
    const engine = new SyncEngine(store, () => true);
    engine.setRemote(new SheetsAdapter({ url: 'x', token: TOKEN, salt: SALT }, fetchImpl));
    return { store, engine };
  };
  return { env, device };
}

const TRICKY = ['=HYPERLINK("http://x","y")', '-5', '+1', '@SUM(1)', '1/2', '3-4', '007', 'มี "เครื่องหมายคำพูด" และ \'เดี่ยว\'', 'บรรทัด 1\nบรรทัด 2', 'emoji 💊 ไทย', '<b>html</b> & ampersand', ' เว้นวรรคหน้าหลัง '];

const adrCase = (cid: string, extra: any = {}) => ({
  id: Number(cid), cid, label: 'สมชาย ใจดี · HN 66012345', saved: '2026-05-01T10:00',
  data: {
    pt: { hn: '66012345', name: 'สมชาย ใจดี', age: '45', sex: 'หญิง', hx: TRICKY[7] },
    drugs: [{ id: 1, name: 'Allopurinol', dose: '100 mg', route: 'PO', start: '2026-04-20', stop: '2026-05-01', suspect: true }],
    events: [{ id: 1, desc: 'ผื่น SJS', onset: '2026-04-30', severity: 'severe', better: '2026-05-05' }],
    labs: [{ id: 1, name: 'Eosinophil', date: '2026-05-01', value: '12%' }], naranjo: { 1: 'y', 3: 'n' },
    reactionType: 'Type IV T-cell mediated (delayed)', outcome: 'recovering', pharmNote: TRICKY.join('\n'), seq: 4, adrScale: 'hour',
    altCauses: ['none'], altNote: '', crit: { sjs: { 0: true, 1: true, 2: true } }, prev: { 1: 'n' },
    triggers: ['antih', 'vitk'], pharmSign: 'ภก.ทดสอบ (ว.12345)', doctorSign: 'นพ.ทดสอบ',
    rep: { medErr: 'yes', medErrNo: 'ME-69-012', hpvc: 'sent', hpvcDate: '2026-05-03', rcaCat: ['การสั่งใช้ยา', 'การสื่อสาร'], rcaCause: 'ไม่มีระบบเตือน HLA-B*58:01 ก่อนสั่ง allopurinol', rcaPlan: 'เพิ่มการตรวจ HLA ก่อนเริ่มยา', rcaOwner: 'ภก.ผู้รับผิดชอบ' },
    sev2: { type: 'B', serious: ['อันตรายถึงชีวิต', 'ต้องนอนโรงพยาบาลหรือนอนนานขึ้น'] },
  },
  sum: { month: '2026-04', drugs: ['Allopurinol'], events: ['ผื่น SJS'], nj: 7, njCat: 'probable', who: 'probable', prev: 'prev', severe: true, repeat: false, triggers: ['antih', 'vitk'], type: 'Type IV T-cell mediated (delayed)', outcome: 'recovering', pharm: 'ภก.ทดสอบ (ว.12345)', medErr: 'yes', hpvc: 'sent', rca: 'done', rcaCat: ['การสั่งใช้ยา', 'การสื่อสาร'], adrType: 'B', serious: true },
  ...extra,
});

const DATA = () => ({
  'adrCases.v1': [adrCase('1001'), adrCase('1002', { saved: '2026-06-01T10:00', label: 'สมหญิง · HN 7' })],
  'adrCqi.v1': [{ id: 11, title: TRICKY[0], type: 'CQI', problem: TRICKY[8], measure: 'อัตรา', indicator: TRICKY[5], before: '12', after: '3', start: '2026-02-01', status: 'ดำเนินการ' }],
  'intensive.v1': [{ id: 21, hn: '66012345', drug: 'Warfarin', group: 'Warfarin', start: '2026-05-01', next: '2026-06-01', note: TRICKY[1], status: 'ติดตามอยู่' }],
  'infoEval.v1': [{ id: 31, date: '2026-05-02', who: 'แพทย์', topic: TRICKY[2], how: 'เอกสาร / แผ่นพับ', und: 5, sat: 4 }],
  'workload.v1': [Object.fromEntries([['month', '2026-04'], ...(WL_FIELDS as any[]).map((f, i) => [f.k, (i + 1) * 11])])],
  'ptcMeet.v1': ['2026-02-10', '2026-05-12'],
  'stdAssess.v1': { '3-2.1': { st: 'done', note: TRICKY[3] }, '9-3.4': { st: 'doing', note: '' } },
});

describe('ข้อมูลทุกชุดไปถึงชีตและกลับมาครบ', () => {
  it('เครื่อง B ได้ข้อมูลเท่ากับเครื่อง A ทุกชุด (ยกเว้นชื่อ/HN ผู้ป่วยที่ปกปิดตามออกแบบ)', async () => {
    const w = world(); const A = await w.device(), B = await w.device();
    const D: any = DATA(); for (const [k, v] of Object.entries(D)) A.store.setJson(k, v);
    await A.engine.syncNow(); await B.engine.syncNow();
    expect(A.engine.state.kind).toBe('synced'); expect(B.engine.state.kind).toBe('synced');
    const hn = await hashHn('66012345', SALT), hn7 = await hashHn('7', SALT);
    for (const k of Object.keys(D)) {
      let want = D[k];
      if (k === 'adrCases.v1') want = D[k].map((c: any) => ({ ...c, label: 'เคส ' + c.cid, data: { ...c.data, pt: { ...c.data.pt, name: '', hn: c.cid === '1001' ? hn : hn } } }));
      if (k === 'intensive.v1') want = D[k].map((x: any) => ({ ...x, hn }));
      const got = B.store.getJson<any>(k, null);
      const sort = (v: any) => (Array.isArray(v) ? v.slice().sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : v);
      expect(sort(got), k).toEqual(sort(want));
    }
    void hn7;
  });

  it('ไม่มีชื่อผู้ป่วย/HN ดิบ ในเซลล์ใดของชีตเลย (ทั้งที่อ่านได้และข้อมูลเต็ม)', async () => {
    const w = world(); const A = await w.device();
    for (const [k, v] of Object.entries(DATA())) A.store.setJson(k, v);
    await A.engine.syncNow();
    const all = w.env.sheets.map((s) => s.grid.flat().join('\n')).join('\n');
    expect(all).not.toContain('สมชาย'); expect(all).not.toContain('สมหญิง'); expect(all).not.toContain('66012345');
    expect(all).toContain('sha256:');
  });

  it('ข้อความที่ขึ้นต้นด้วย = + - @ หรือหน้าตาเหมือนวันที่/ตัวเลข ไม่ถูก Google Sheets ตีความเป็นสูตร/วันที่', async () => {
    const w = world(); const A = await w.device();
    for (const [k, v] of Object.entries(DATA())) A.store.setJson(k, v);
    await A.engine.syncNow();
    const risky = (x: unknown) => typeof x === 'string' && /^[=+\-@\t\r]/.test(x);
    const bad: string[] = [];
    for (const s of w.env.sheets) {
      if (['ภาพรวม', 'อ่านก่อน'].includes(s.name)) continue;
      s.grid.forEach((row, r) => { if (r === 0) return; row.forEach((c: any, ci: number) => { if (risky(c)) bad.push(`${s.name}!R${r + 1}C${ci + 1}: ${String(c).slice(0, 30)}`); }); });
    }
    expect(bad).toEqual([]);
  });

  it('รายการเดียวที่ข้อมูลเต็มเกิน 50,000 ตัวอักษร (ขีดจำกัดของเซลล์) ไม่ทำให้รายการอื่นส่งไม่ได้ และแจ้งชัดเจน', async () => {
    const w = world(); const A = await w.device();
    A.store.setJson('adrCases.v1', [adrCase('1', { data: { ...adrCase('1').data, pharmNote: 'ก'.repeat(60000) } }), adrCase('2')]);
    await A.engine.syncNow();
    expect(A.engine.state).toMatchObject({ kind: 'error' });
    expect((A.engine.state as any).message).toMatch(/50,000|ใหญ่เกิน/);
    const sh = w.env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    expect(sh.grid.slice(1).map((r) => r[0])).toEqual(['2']);          // รายการปกติถึงชีตแล้ว
  });
});

describe('รายการที่ใหญ่เกิน ไม่ขวางการรับข้อมูลจากเครื่องอื่น', () => {
  it('เครื่อง A มีรายการใหญ่เกิน แต่ยังรับเคสที่เครื่อง B เพิ่มเข้ามาได้ และรายการอื่นของ A ไม่ถูกส่งซ้ำ', async () => {
    const w = world(); const A = await w.device(); const B = await w.device();
    B.store.setJson('adrCases.v1', [adrCase('2001')]); await B.engine.syncNow();
    A.store.setJson('adrCases.v1', [adrCase('1', { data: { ...adrCase('1').data, pharmNote: 'ก'.repeat(60000) } }), adrCase('2')]);
    await A.engine.syncNow();
    expect(A.engine.state).toMatchObject({ kind: 'error' });
    const ids = (A.store.getJson<any[]>('adrCases.v1', [])).map((c) => c.cid).sort();
    expect(ids).toEqual(['1', '2', '2001']);                              // รับเคสของ B แม้ A มีรายการที่ส่งไม่ได้
    expect(A.store.pendingCount()).toBe(1);                               // ค้างเฉพาะรายการที่ใหญ่เกิน
  });
});

describe('การลบ (PDPA)', () => {
  it('ลบเคสในแอป → แถวในชีตถูกล้างข้อมูลทางคลินิกทั้งหมด เหลือเพียงรหัสและเครื่องหมาย "ลบแล้ว"', async () => {
    const w = world(); const A = await w.device();
    A.store.setJson('adrCases.v1', [adrCase('1001')]); await A.engine.syncNow();
    await new Promise((r) => setTimeout(r, 5));
    A.store.setJson('adrCases.v1', []); await A.engine.syncNow();
    const sh = w.env.sheets.find((x) => x.name === 'เคสแพ้ยา (ADR)')!;
    const row = Object.fromEntries(sh.grid[0].map((h: string, i: number) => [h, sh.grid[1][i]]));
    const kept = Object.entries(row).filter(([h, v]) => v !== '' && !['รหัสรายการ', 'แก้ไขล่าสุด', 'ลบแล้ว?', '_เวลา(ms) ห้ามแก้'].includes(h));
    expect(kept).toEqual([]);
    expect(row['ลบแล้ว?']).toBe('ใช่');
  });
});

describe('คอลัมน์ในชีตเพียงพอเป็นหลักฐานมาตรฐานข้อ 3 และข้อ 9', () => {
  async function headers() {
    const w = world(); const A = await w.device();
    for (const [k, v] of Object.entries(DATA())) A.store.setJson(k, v);
    await A.engine.syncNow();
    const by = (name: string) => { const s = w.env.sheets.find((x) => x.name === name)!; return { head: s.grid[0] as string[], row: Object.fromEntries(s.grid[0].map((h: string, i: number) => [h, s.grid[1][i]])) as Record<string, any> }; };
    return by;
  }
  it('ข้อ 9: เคส ADR — รายงาน SRS/HPVC, เครื่องมือประเมิน, preventability, RCA, trigger, med error', async () => {
    const { row } = (await headers())('เคสแพ้ยา (ADR)');
    const need = ['วันที่บันทึกเคส', 'ไตรมาส', 'ยาที่สงสัย', 'ขนาดยา/วิธีให้ (ยาที่สงสัย)', 'วันที่เริ่มยา', 'วันที่หยุดยา', 'วันที่เริ่มมีอาการ', 'ระยะเวลาจากเริ่มยาถึงเกิดอาการ', 'ผลแลปที่บันทึก', 'ประวัติแพ้ยาเดิม', 'อาการที่พบ', 'คะแนน Naranjo', 'ระดับ Naranjo', 'ผลประเมิน WHO-UMC', 'ป้องกันได้หรือไม่ (Schumock)',
      'เคสรุนแรง', 'แพ้ยาซ้ำ', 'ประเภท ADR', 'Serious ADR (ร้ายแรง)', 'เกณฑ์ Serious ที่เข้า', 'Med error (ความคลาดเคลื่อนทางยา)', 'เลขที่รายงาน Med error',
      'รายงาน HPVC', 'วันที่ส่ง HPVC', 'RCA (วิเคราะห์สาเหตุราก)', 'หมวดสาเหตุ RCA', 'สาเหตุที่ราก (RCA)', 'แผนป้องกัน', 'ผู้รับผิดชอบ RCA',
      'Trigger ที่พบ', 'สาเหตุอื่นที่เป็นไปได้', 'อายุ (ปี)', 'เพศ', 'เภสัชกรผู้ประเมิน'];
    expect(need.filter((h) => !(h in row))).toEqual([]);
    expect(row['วันที่ส่ง HPVC']).toBe('3 พ.ค. 2569');
    expect(row['ขนาดยา/วิธีให้ (ยาที่สงสัย)']).toBe('Allopurinol 100 mg PO'); expect(row['วันที่เริ่มยา']).toBe('20 เม.ย. 2569'); expect(row['วันที่เริ่มมีอาการ']).toBe('30 เม.ย. 2569');
    expect(row['ระยะเวลาจากเริ่มยาถึงเกิดอาการ']).toBe('10 วันหลังเริ่มยา'); expect(row['ผลแลปที่บันทึก']).toBe('Eosinophil 12%');
    expect(row['สาเหตุที่ราก (RCA)']).toMatch(/HLA-B\*58:01/);
    expect(row['Trigger ที่พบ']).toMatch(/antihistamine/);
    expect(row['เกณฑ์ Serious ที่เข้า']).toMatch(/อันตรายถึงชีวิต/);
  });
  it('ข้อ 3: ภาระงานครบทุกฟิลด์, CQI/R2R ก่อน-หลัง, การให้ข้อมูล, PTC, มาตรฐาน', async () => {
    const by = await headers();
    const wl = by('ภาระงานรายเดือน');
    expect((WL_FIELDS as any[]).map((f) => `${f.l} (${f.u})`).filter((h) => !(h in wl.row))).toEqual([]);
    expect(Object.values(wl.row)).toContain(11);
    expect(by('โครงการ CQI และ R2R').row).toMatchObject({ 'ผลก่อนดำเนินการ': '12', 'ผลหลังดำเนินการ': '3' });
    expect(Object.keys(by('การให้ข้อมูลด้านยา').row)).toEqual(expect.arrayContaining(['ความเข้าใจ (เต็ม 5)', 'ความพึงพอใจ (เต็ม 5)']));
    expect(by('วันประชุม PTC').row['ปีงบประมาณ (พ.ศ.)']).toBeTruthy();
    expect(by('ประเมินมาตรฐาน ข้อ 3 และ 9').row['เกณฑ์']).toBeTruthy();
    expect(Object.keys(by('ติดตามเข้มข้น (Intensive)').row)).toEqual(expect.arrayContaining(['HN (เข้ารหัส)', 'วันนัดติดตามครั้งถัดไป', 'สถานะ']));
  });
});
