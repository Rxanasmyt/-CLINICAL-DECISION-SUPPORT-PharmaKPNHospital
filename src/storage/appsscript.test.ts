// ทดสอบ Code.gs (Apps Script) กับ Google Sheets จำลองในหน่วยความจำ — ตรวจชั้นข้อมูล: หัวคอลัมน์ไทย, แท็บ, อัปเดต/ลบ, ล่าสุดชนะ, ย้ายแท็บเก่า, สูตรภาพรวม
// (การจัดรูปแบบสี/ความกว้างทดสอบไม่ได้ในที่นี้ — ต้องดูในชีตจริง)
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import { SUMMARIES } from './labels';

const noop = (): any => new Proxy(function () {}, { get: (_t, p) => (p === 'then' ? undefined : noop()), apply: () => noop() });

class Range {
  constructor(private sh: Sheet, private r: number, private c: number, private nr: number, private nc: number) {}
  getValues() { return Array.from({ length: this.nr }, (_, i) => Array.from({ length: this.nc }, (_, j) => this.sh.cell(this.r + i, this.c + j))); }
  setValues(v: any[][]) { v.forEach((row, i) => row.forEach((x, j) => this.sh.put(this.r + i, this.c + j, x))); return this; }
  setValue(x: any) { this.sh.put(this.r, this.c, x); return this; }
  setFormula(f: string) { this.sh.put(this.r, this.c, f); return this; }
}
class Sheet {
  grid: any[][] = []; maxRows = 1000; name: string;
  constructor(name: string) { this.name = name; }
  cell(r: number, c: number) { return this.grid[r - 1]?.[c - 1] ?? ''; }
  put(r: number, c: number, x: any) { while (this.grid.length < r) this.grid.push([]); const row = this.grid[r - 1]; while (row.length < c) row.push(''); row[c - 1] = x; }
  getName() { return this.name; } setName(n: string) { this.name = n; }
  getLastRow() { return this.grid.length; }
  getLastColumn() { return this.grid.reduce((m, r) => Math.max(m, r.length), 0); }
  getMaxRows() { return this.maxRows; }
  getRange(r: any, c?: number, nr = 1, nc = 1) { return new Range(this, r, c!, nr, nc); }
  appendRow(row: any[]) { this.grid.push(row.slice()); return this; }
  insertColumnBefore(pos: number) { this.grid.forEach((r) => { while (r.length < pos - 1) r.push(''); r.splice(pos - 1, 0, ''); }); }
  clear() { this.grid = []; }
  getCharts() { return []; } getProtections() { return []; } getFilter() { return null; }
}
const sheetProxy = (s: Sheet) => new Proxy(s, { get: (t: any, p) => (p in t ? (typeof t[p] === 'function' ? t[p].bind(t) : t[p]) : noop()) });

function load() {
  const sheets: Sheet[] = [];
  const ss = {
    getSheetByName: (n: string) => { const s = sheets.find((x) => x.name === n); return s ? sheetProxy(s) : null; },
    insertSheet: (n: string) => { const s = new Sheet(n); sheets.push(s); return sheetProxy(s); },
  };
  const fmt = (d: Date, _tz: string, f: string) => {
    const t = new Date(d.getTime() + 7 * 3600e3); const p = (n: number) => String(n).padStart(2, '0');
    return f === 'd' ? String(t.getUTCDate()) : f === 'M' ? String(t.getUTCMonth() + 1) : f === 'yyyy' ? String(t.getUTCFullYear()) : f === 'HH:mm' ? p(t.getUTCHours()) + ':' + p(t.getUTCMinutes()) : f;
  };
  const ctx: any = {
    console, JSON, Date, Math, Number, String, Object, Array, isFinite,
    SpreadsheetApp: new Proxy({ getActiveSpreadsheet: () => ss }, { get: (t: any, p) => (p in t ? t[p] : noop()) }),
    ContentService: { createTextOutput: (s: string) => ({ s, setMimeType() { return this; } }), MimeType: { JSON: 'json' } },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'secret-token-1234567890abcd' }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { formatDate: fmt }, Charts: noop(),
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('docs/apps-script/Code.gs', 'utf8'), ctx);
  const post = (body: any) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ token: 'secret-token-1234567890abcd', ...body }) } }).s);
  return { sheets, post, ctx };
}
const caseRec = (id: string, at: number, extra: any = {}) => {
  const data = { id: Number(id), cid: id, label: 'เคส ' + id, saved: '2026-05-01T10:00', data: { pt: { name: '', hn: 'sha256:abc' } },
    sum: { month: '2026-05', drugs: ['Allopurinol'], events: ['ผื่น SJS'], nj: 8, njCat: 'probable', who: 'probable', prev: 'prev', severe: true, repeat: false, type: 'Type IV', outcome: 'recovering', adrType: 'B', serious: true, medErr: 'no', hpvc: 'pending', rca: 'missing', triggers: ['x'], pharm: 'ภก.ทดสอบ' }, ...extra };
  return { id, updatedAt: at, deleted: false, summary: SUMMARIES.adr_cases(data, id), data };
};

describe('Code.gs กับชีตจำลอง', () => {
  let env: ReturnType<typeof load>;
  beforeEach(() => { env = load(); });

  it('ปฏิเสธ token ผิด', () => {
    const r = JSON.parse(env.ctx.doPost({ postData: { contents: JSON.stringify({ token: 'x', action: 'ping' }) } }).s);
    expect(r).toEqual({ ok: false, error: 'token ไม่ถูกต้อง' });
  });

  it('push: แท็บชื่อไทย หัวคอลัมน์ไทย ค่าอ่านรู้เรื่อง คอลัมน์เทคนิคอยู่ท้าย', () => {
    expect(env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1001', 1730700000000)] })).toMatchObject({ ok: true, saved: 1 });
    const sh = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    const head = sh.grid[0];
    expect(head.slice(0, 2)).toEqual(['รหัสรายการ', 'แก้ไขล่าสุด']);
    expect(head.slice(-3)).toEqual(['ลบแล้ว?', '_เวลา(ms) ห้ามแก้', '_ข้อมูลเต็ม(JSON) ห้ามแก้']);
    const row: Record<string, any> = Object.fromEntries(head.map((h: string, i: number) => [h, sh.grid[1][i]]));
    expect(row['รหัสรายการ']).toBe('1001');
    expect(row['แก้ไขล่าสุด']).toMatch(/^\d{1,2} [^\d\s]+ 25\d\d \d\d:\d\d$/);
    expect(row['ยาที่สงสัย']).toBe('Allopurinol');
    expect(row['ระดับ Naranjo']).toBe('Probable (น่าจะใช่)');
    expect(row['ป้องกันได้หรือไม่ (Schumock)']).toBe('ป้องกันได้');
    expect(row['เคสรุนแรง']).toBe('ใช่');
    expect(row['รายงาน HPVC']).toBe('รอส่ง');
    expect(row['ไตรมาส']).toBe('Q2/69');
    expect(row['ลบแล้ว?']).toBe('');
    expect(JSON.parse(row['_ข้อมูลเต็ม(JSON) ห้ามแก้']).cid).toBe('1001');
    expect(head.join('|')).not.toMatch(/probable|adr_cases|payload|updatedAt/);
  });

  it('push ซ้ำ id เดิม = แก้แถวเดิม · ของในชีตใหม่กว่า = ไม่ทับ · ลบ = ใส่ "ใช่" และล้างข้อมูลเต็ม', () => {
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('7', 2000)] });
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('7', 3000, { pharmNote: 'แก้' })] });
    const sh = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    expect(sh.grid.length).toBe(2);
    expect(env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('7', 1000)] }).saved).toBe(0);
    env.post({ action: 'push', collection: 'adr_cases', records: [{ id: '7', updatedAt: 4000, deleted: true, summary: {} }] });
    const head = sh.grid[0], iDel = head.indexOf('ลบแล้ว?'), iPay = head.indexOf('_ข้อมูลเต็ม(JSON) ห้ามแก้');
    expect(sh.grid[1][iDel]).toBe('ใช่'); expect(sh.grid[1][iPay]).toBe('');
  });

  it('pull: คืน id/เวลา/ลบ/ข้อมูลเต็ม ตาม since', () => {
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1', 1000), caseRec('2', 5000)] });
    const all = env.post({ action: 'pull', collection: 'adr_cases', since: 0 }).records;
    expect(all.map((r: any) => [r.id, r.updatedAt, r.deleted])).toEqual([['1', 1000, false], ['2', 5000, false]]);
    expect(all[0].data.sum.drugs).toEqual(['Allopurinol']);
    expect(env.post({ action: 'pull', collection: 'adr_cases', since: 2000 }).records.map((r: any) => r.id)).toEqual(['2']);
    expect(env.post({ action: 'get', collection: 'adr_cases', id: '2' }).record.id).toBe('2');
  });

  it('แท็บรูปแบบเก่า (ชื่อรหัสอังกฤษ) ถูกเปลี่ยนชื่อเป็น "เก่า-…" และสร้างแท็บใหม่', () => {
    env.ctx.SpreadsheetApp.getActiveSpreadsheet().insertSheet('adr_cases');
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1', 1000)] });
    const names = env.sheets.map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(['เก่า-adr_cases', 'เคสแพ้ยา (ADR)']));
    expect(names).not.toContain('adr_cases');
  });

  it('ชุดข้อมูลอื่น: ภาระงาน/มาตรฐาน/PTC หัวคอลัมน์ไทยและค่าอ่านรู้เรื่อง', () => {
    env.post({ action: 'push', collection: 'workload_monthly', records: [{ id: '2026-03', updatedAt: 1, summary: SUMMARIES.workload_monthly({ month: '2026-03', rxOpd: 1200, meHarm: 1 }, '2026-03'), data: {} }] });
    env.post({ action: 'push', collection: 'std_assessment', records: [{ id: '9-3.4', updatedAt: 1, summary: SUMMARIES.std_assessment({ st: 'done', note: 'ใช้ Schumock' }, '9-3.4'), data: {} }] });
    env.post({ action: 'push', collection: 'ptc_meetings', records: [{ id: '2026-11-10', updatedAt: 1, summary: SUMMARIES.ptc_meetings('2026-11-10', '2026-11-10'), data: '2026-11-10' }] });
    const by = (n: string) => { const s = env.sheets.find((x) => x.name === n)!; return Object.fromEntries(s.grid[0].map((h: string, i: number) => [h, s.grid[1][i]])); };
    expect(by('ภาระงานรายเดือน')).toMatchObject({ 'เดือน': 'มี.ค. 2569', 'ใบสั่งยาผู้ป่วยนอก (ใบ)': 1200 });
    expect(by('ประเมินมาตรฐาน ข้อ 3 และ 9')).toMatchObject({ 'มาตรฐานข้อ': '9', 'ระดับ': '3', 'ข้อย่อย': '9-3.4', 'สถานะ': 'ดำเนินการแล้ว' });
    expect(by('ประเมินมาตรฐาน ข้อ 3 และ 9')['เกณฑ์']).toMatch(/preventability/);
    expect(by('วันประชุม PTC')).toMatchObject({ 'วันที่ประชุม PTC': '10 พ.ย. 2569', 'ปีงบประมาณ (พ.ศ.)': '2570' });
  });

  it('setup(): สร้างแท็บ อ่านก่อน/ภาพรวม และสูตรชี้คอลัมน์ถูกต้อง', () => {
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1', 1000)] });
    env.ctx.setup();
    const names = env.sheets.map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(['อ่านก่อน', 'ภาพรวม', 'เคสแพ้ยา (ADR)', 'โครงการ CQI และ R2R', 'ประเมินมาตรฐาน ข้อ 3 และ 9']));
    const ov = env.sheets.find((s) => s.name === 'ภาพรวม')!;
    const formulas = ov.grid.flat().filter((x: any) => typeof x === 'string' && x.startsWith('=COUNTIFS('));
    expect(formulas.length).toBeGreaterThan(10);
    const adr = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    const L = (h: string) => { let n = adr.grid[0].indexOf(h) + 1, s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
    expect(ov.grid.flat()).toContain(`=COUNTIFS('เคสแพ้ยา (ADR)'!$A$2:$A,"<>",'เคสแพ้ยา (ADR)'!$${L('ลบแล้ว?')}$2:$${L('ลบแล้ว?')},"<>ใช่",'เคสแพ้ยา (ADR)'!$${L('เคสรุนแรง')}$2:$${L('เคสรุนแรง')},"ใช่")`);
    const guide = env.sheets.find((s) => s.name === 'อ่านก่อน')!;
    expect(guide.grid.flat().join(' ')).toMatch(/ไม่มีชื่อผู้ป่วย/);
  });
});
