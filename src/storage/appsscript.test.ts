// ทดสอบ Code.gs (Apps Script) กับ Google Sheets จำลองในหน่วยความจำ — ตรวจชั้นข้อมูล: หัวคอลัมน์ไทย, แท็บ, อัปเดต/ลบ, ล่าสุดชนะ, ย้ายแท็บเก่า, สูตรภาพรวม
// (การจัดรูปแบบสี/ความกว้างทดสอบไม่ได้ในที่นี้ — ต้องดูในชีตจริง)
import { describe, it, expect, beforeEach } from 'vitest';
import { SUMMARIES } from './labels';
import { load } from './fakeSheets';
import { REQUIRED_SCRIPT_VERSION } from './scriptVersion';

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

  it('ping ตอบเลขเวอร์ชันโค้ด และตรงกับที่แอปต้องการ (กันลืมเพิ่มเลขทั้งสองที่)', () => {
    const r = env.post({ action: 'ping' });
    expect(r).toMatchObject({ ok: true, version: env.ctx.SCRIPT_VERSION });
    expect(env.ctx.SCRIPT_VERSION).toBe(REQUIRED_SCRIPT_VERSION);
  });

  it('คำสั่ง setup (ปุ่ม "จัดชีตใหม่"): ต้องมี token · สร้างทุกแท็บ อ่านก่อน และภาพรวม', () => {
    const bad = JSON.parse(env.ctx.doPost({ postData: { contents: JSON.stringify({ token: 'x', action: 'setup' }) } }).s);
    expect(bad).toEqual({ ok: false, error: 'token ไม่ถูกต้อง' });
    expect(env.sheets).toHaveLength(0);
    const r = env.post({ action: 'setup' });
    expect(r.ok).toBe(true); expect(r.tabs).toHaveLength(7); expect(r.tabs).toContain('เคสแพ้ยา (ADR)');
    expect(env.sheets.map((x) => x.name)).toEqual(expect.arrayContaining(['อ่านก่อน', 'ภาพรวม', ...r.tabs]));
    expect(env.post({ action: 'setup' }).ok).toBe(true);        // รันซ้ำได้ ไม่สร้างแท็บซ้ำ
    expect(env.sheets.filter((x) => x.name === 'อ่านก่อน')).toHaveLength(1);
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
    expect(all.map((r: any) => [r.id, r.updatedAt, r.deleted])).toEqual([['2', 5000, false], ['1', 1000, false]]);   // ชีตเรียงใหม่สุดไว้บน
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
    expect(by('ประเมินมาตรฐาน ข้อ 3 และ 9')).toMatchObject({ 'รหัสรายการ': '9-3.4', 'มาตรฐานข้อ': '9', 'ระดับ': '3', 'สถานะ': 'ดำเนินการแล้ว' });
    expect(by('ประเมินมาตรฐาน ข้อ 3 และ 9')['เกณฑ์']).toMatch(/preventability/);
    expect(by('วันประชุม PTC')).toMatchObject({ 'วันที่ประชุม PTC': '10 พ.ย. 2569', 'ปีงบประมาณ (พ.ศ.)': '2570' });
  });

  it('เรียงใหม่สุดไว้บน และเพิ่มแถวใหม่แบบชุดเดียว (ไม่ appendRow ทีละแถว)', () => {
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1', 1000), caseRec('2', 3000), caseRec('3', 2000)] });
    const sh = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    expect(sh.grid.slice(1).map((r) => r[0])).toEqual(['2', '3', '1']);
    expect(sh.appended).toBe(1);                                   // มีแค่แถวหัว
    const many = Array.from({ length: 150 }, (_, i) => caseRec(String(500 + i), 10_000 + i));
    env.post({ action: 'push', collection: 'adr_cases', records: many });
    expect(sh.grid.length).toBe(1 + 3 + 150); expect(sh.appended).toBe(1);
    expect(sh.grid[1][0]).toBe('649');                              // ใหม่สุดบนสุด
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('3', 99_999)] });
    expect(sh.grid[1][0]).toBe('3');                                // แก้แล้วขึ้นบนสุด
  });

  it('รายการที่ลบแล้วอยู่ล่างสุด ไม่รบกวนรายการใช้งาน', () => {
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1', 1000), caseRec('2', 2000), caseRec('3', 3000)] });
    env.post({ action: 'push', collection: 'adr_cases', records: [{ id: '3', updatedAt: 9000, deleted: true, summary: {} }] });
    const sh = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    expect(sh.grid.slice(1).map((r) => r[0])).toEqual(['2', '1', '3']);
  });

  it('หน้าตา: ความกว้างตามชนิดคอลัมน์ · สีสถานะ · คำอธิบายหัวคอลัมน์ · รายการลบแล้วมีลำดับความสำคัญสูงสุด', () => {
    env.post({ action: 'push', collection: 'adr_cases', records: [caseRec('1', 1000)] });
    const sh = env.sheets.find((s) => s.name === 'เคสแพ้ยา (ADR)')!;
    const head: string[] = sh.grid[0]; const col = (h: string) => head.indexOf(h) + 1;
    const width = (h: string) => sh.log.filter((l) => l[0] === 'setColumnWidth' && l[1] === col(h)).pop()?.[3];
    expect(width('สาเหตุที่ราก (RCA)')).toBe(300); expect(width('คะแนน Naranjo')).toBe(95); expect(width('ยาที่สงสัย')).toBe(300); expect(width('แก้ไขล่าสุด')).toBe(150);
    expect(sh.rules[0].formula).toMatch(/="ใช่"$/); expect(sh.rules[0].strike).toBe(true);
    const rule = (h: string, t: string) => sh.rules.find((r: any) => r.text === t && r.ranges[0].c === col(h));
    expect(rule('รายงาน HPVC', 'รอส่ง')?.bg).toBe('#FFF1D6'); expect(rule('รายงาน HPVC', 'ส่งแล้ว')?.bg).toBe('#DDF3E7');
    expect(rule('เคสรุนแรง', 'ใช่')?.bg).toBe('#FFE1DD'); expect(rule('RCA (วิเคราะห์สาเหตุราก)', 'ยังไม่ครบ')).toBeTruthy();
    const note = (h: string) => sh.log.find((l) => l[0] === 'setNote' && l[1] === col(h))?.[3];
    expect(note('ระดับ Naranjo')).toMatch(/Definite/); expect(note('ประเภท ADR')).toMatch(/HPVC/); expect(note('ลบแล้ว?')).toMatch(/ห้ามลบแถวเอง/);
    // หัวคอลัมน์ทุกตัวที่แอปส่งมีความกว้างที่กำหนด (ไม่มีคอลัมน์ลืมตั้ง) ยกเว้นคอลัมน์ซ่อน
    const hidden = new Set(['_เวลา(ms) ห้ามแก้', '_ข้อมูลเต็ม(JSON) ห้ามแก้']);
    expect(head.filter((h) => !hidden.has(h) && width(h) === undefined)).toEqual([]);
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
    // Dashboard: การ์ดตัวชี้วัด 10 ใบ (ป้ายชื่ออยู่แถว 4 และ 8) ตารางไตรมาสเริ่มแถว 14
    const cell = (r: number, c: number) => ov.grid[r - 1]?.[c - 1];
    expect([cell(4, 1), cell(4, 3), cell(8, 9)]).toEqual(['เคส ADR ทั้งหมด', 'เคสรุนแรง', expect.stringMatching(/^PTC ปีงบประมาณ/)]);
    expect(String(cell(5, 1))).toMatch(/^=COUNTIFS\(/); expect(cell(14, 1)).toBe('ไตรมาส');
    const guide = env.sheets.find((s) => s.name === 'อ่านก่อน')!;
    expect(guide.grid.flat().join(' ')).toMatch(/ไม่มีชื่อผู้ป่วย/);
  });
});
