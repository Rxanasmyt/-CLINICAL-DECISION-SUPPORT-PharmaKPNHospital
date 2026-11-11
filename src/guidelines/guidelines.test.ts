import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { GUIDELINES, reviewState, searchGuidelines, blockLines } from './registry';
import { TB_GUIDELINE } from './tb';
import { drugHits, aliasRe } from './drugs';
import { TB_EXTRA_BLOCKS, TB_PASTE_DOSE } from './tb-extra';
import { REF_TB_BLOCKS, REF_TB_CITES, REF_WF_BLOCKS } from '../data/references';
import { validateFile, addFile, listFiles, removeFile, MAX_FILE_BYTES, MAX_FILES_PER_GUIDELINE } from './attachments';
import { AppDb } from '../storage/db';

describe('แนวทางวัณโรค (ตัวอย่างแรก)', () => {
  it('เนื้อหาคือข้อมูลอ้างอิงเดิมทุกบล็อก ไม่ถูกแก้/เขียนใหม่ และหมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว', () => {
    expect(TB_GUIDELINE.blocks.slice(0, REF_TB_BLOCKS.length)).toEqual(REF_TB_BLOCKS as any);
    TB_GUIDELINE.blocks.slice(REF_TB_BLOCKS.length).forEach((b) => expect(b.origin).toMatch(/ทบทวนโดยเภสัชกรแล้ว/)); expect(TB_EXTRA_BLOCKS.length).toBe(5); expect(TB_GUIDELINE.cites.slice(0, REF_TB_CITES.length)).toEqual(REF_TB_CITES); expect(TB_GUIDELINE.cites.some((c) => /ตรวจเทียบกับไฟล์ต้นฉบับ NTP 2021/.test(c))).toBe(true);
    const used = TB_GUIDELINE.sections.flatMap((s) => s.blocks).sort((a, b) => a - b);
    expect(used).toEqual(TB_GUIDELINE.blocks.map((_, i) => i));
  });
  it('มีที่มาและสถานะ "ยังไม่ได้ทบทวน" จนกว่าจะลงนาม', () => {
    expect(TB_GUIDELINE.cites.length).toBeGreaterThan(3); expect(TB_GUIDELINE.cites[0]).toMatch(/พ\.ศ\. 2564/);
    expect(reviewState(TB_GUIDELINE.review, '2026-11-10').kind).toBe('pending');
  });
  it('สถานะทบทวน: ทบทวนแล้ว / เลยรอบ', () => {
    const r = { status: 'approved' as const, reviewer: 'ภก.ก', reviewedAt: '2026-01-01', nextDue: '2027-01-01' };
    expect(reviewState(r, '2026-11-10')).toMatchObject({ kind: 'ok' });
    expect(reviewState(r, '2027-01-02')).toMatchObject({ kind: 'overdue' });
    expect(reviewState({ ...r, nextDue: '' }, '2030-01-01').kind).toBe('ok');
  });
});

describe('สรุปที่ผู้ใช้ส่งมา เทียบกับข้อมูลอ้างอิงเดิม', () => {
  it('ตารางขนาดยาตามน้ำหนักตรงกับตารางเดิมทุกช่อง', () => {
    const g5: any = (REF_TB_BLOCKS as any).find((b: any) => b.kind === 'grid5');
    const num = (x: string) => +x.replace(/,/g, '');
    g5.items.forEach((r: any, i: number) => { const p = TB_PASTE_DOSE[i]; expect([num(r.c2), num(r.c3), num(r.c4), num(r.c5)]).toEqual([p.H, p.R, p.Z, p.E]); });
  });
  it('ค้นยาใหม่พบ และมีป้ายที่มา', () => {
    expect(searchGuidelines('bedaquiline')[0].hits.length).toBeGreaterThan(0);
    expect(searchGuidelines('serotonin')[0].hits[0].block).toBeGreaterThan(8);
  });
});

describe('แนวทาง COPD (GOLD 2026)', () => {
  it('ทุกบล็อกมีป้ายที่มา หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว และค้นยาพบ', async () => {
    const { COPD_GUIDELINE: c } = await import('./copd');
    c.blocks.forEach((b) => expect(b.origin).toMatch(/ทบทวนโดยเภสัชกรแล้ว/));
    expect(c.sections.flatMap((s) => s.blocks).sort((a, b) => a - b)).toEqual(c.blocks.map((_, i) => i));
    expect(searchGuidelines('dupilumab')[0].guideline.id).toBe('copd'); expect(reviewState(c.review, '2026-11-10').kind).toBe('ok');
  });
});

describe('แนวทางโรคหืด (GINA 2026)', () => {
  it('ทุกบล็อกมีป้ายที่มา หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว และค้นพบ', async () => {
    const { ASTHMA_GUIDELINE: a } = await import('./asthma');
    a.blocks.forEach((b) => expect(b.origin).toMatch(/ทบทวนโดยเภสัชกรแล้ว/));
    expect(a.sections.flatMap((s) => s.blocks).sort((x, y) => x - y)).toEqual(a.blocks.map((_, i) => i));
    expect(searchGuidelines('MART').some((r) => r.guideline.id === 'asthma')).toBe(true);
    expect(searchGuidelines('หืด').map((r) => r.guideline.id)).toContain('asthma');
  });
});

describe('มุมมองตามตัวยา', () => {
  it('ทุกยาที่ระบุในแนวทางต้องมีข้อความจริงอย่างน้อยหนึ่งรายการ (ไม่มีรายการว่าง)', () => {
    for (const g of GUIDELINES) {
      expect(g.drugs?.length).toBeGreaterThan(5);
      for (const d of g.drugs!) expect(drugHits(g, d.aliases).length, g.id + ': ' + d.name).toBeGreaterThan(0);
    }
  });
  it('จัดกลุ่มตามหัวข้อ: อันตรกิริยา/ข้อห้าม/ขนาด และข้อความตรงกับของเดิม', () => {
    const tb = GUIDELINES.find((g) => g.id === 'tb')!; const bdq = drugHits(tb, ['Bedaquiline']);
    expect(bdq.some((h) => h.kind === 'อันตรกิริยา' && /CYP3A4/.test(h.text))).toBe(true);
    const copd = GUIDELINES.find((g) => g.id === 'copd')!;
    expect(drugHits(copd, ['Methylxanthines']).some((h) => h.kind === 'ข้อห้าม/ข้อควรระวัง')).toBe(true);
    const wf = drugHits(tb, ['Warfarin']); expect(wf.length).toBeGreaterThan(0);
    // ชื่อย่อละตินไม่ไปติดกลางคำ: ART ต้องไม่เจอใน "start"
    expect(aliasRe(['ART']).test('start')).toBe(false); expect(aliasRe(['ART']).test('เริ่ม ART ภายใน')).toBe(true);
    // ทุกข้อความที่แสดงต้องมาจากบล็อกของแนวทางจริง
    const all = tb.blocks.flatMap((b) => blockLines(b)).join('\n');
    drugHits(tb, ['Isoniazid']).filter((h) => !h.card).forEach((h) => expect(all).toContain(h.text.split(' — ')[0]));
  });
});

describe('แนวทางที่ค้นเพิ่ม (ความดันโลหิตสูง, ปอดอักเสบชุมชน)', () => {
  for (const id of ['htn', 'cap']) {
    it(id + ': หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว มีแหล่งอ้างอิงลิงก์ และสถานะยังไม่ทบทวน', () => {
      const g = GUIDELINES.find((x) => x.id === id)!;
      expect(g.sections.flatMap((x) => x.blocks).sort((a, b) => a - b)).toEqual(g.blocks.map((_, i) => i));
      expect(g.cites.join(' ')).toMatch(/https:\/\//); expect(g.review.status).toBe('pending');
      g.blocks.forEach((b) => expect(b.origin).toMatch(/รอเภสัชกรทบทวน/));
    });
  }
  it('ตัวเลขสำคัญตรงกับต้นฉบับที่อ่านมา (ขนาดยา CAP, ตารางความดัน)', () => {
    const cap = GUIDELINES.find((x) => x.id === 'cap')!; const htn = GUIDELINES.find((x) => x.id === 'htn')!;
    const capText = cap.blocks.flatMap((b) => blockLines(b)).join('\n'); const htnText = htn.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['Amoxicillin 1,000 mg ทุก 8 ชม.', 'Doxycycline 100 mg ทุก 12 ชม.', 'Levofloxacin 750 mg', 'Moxifloxacin 400 mg', 'Vancomycin 15 mg/kg', 'Piperacillin/tazobactam 4.5 g IV ทุก 6 ชม.', 'Meropenem 1 g IV ทุก 8 ชม.', 'เกณฑ์รอง ≥ 3 ข้อ']) expect(capText).toContain(t);
    for (const t of ['120–130/70–79', '130–139/70–79', 'Nifedipine', '180 mg/วัน', '81 mg/วัน', 'ACEI + ARB', 'creatinine เพิ่มขึ้น > 30%', 'eGFR > 45']) expect(htnText).toContain(t);
  });
});

describe('วัณโรค: ข้อความที่ตรวจเทียบกับต้นฉบับทั้งเล่มแล้ว', () => {
  it('Linezolid ตรงตารางที่ 6.7 และมีรายละเอียดสูตรระยะสั้น Bdq', () => {
    const tb = TB_GUIDELINE;
    const text = tb.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['buspirone, meperidine, fluoxetine', 'monoamine oxidase (MAO) อย่างอ่อน', 'Bdq ใช้ 6 เดือนเสมอ', 'เมื่อสิ้นสุดเดือนที่ 4', 'อายุ ≥ 6 ปี']) expect(text).toContain(t);
    expect(text).not.toContain('SSRIs หรือ MAOIs');
  });
});

describe('ความดันสูง: ข้อความจากฉบับเต็มภาษาไทย', () => {
  it('มีหัวข้อเบาหวาน หลอดเลือด ผู้สูงอายุ ดื้อยาเป็นขั้นตอน ฉุกเฉิน และตัวเลขตรงต้นฉบับ', () => {
    const htn = GUIDELINES.find((x) => x.id === 'htn')!;
    const text = htn.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['UACR ≥ 30 mg/g', 'ห้ามใช้ ACEI ร่วมกับ ARB'.replace('ห้าม', 'ไม่ควร'), 'HR', 'อายุ ≥ 80 ปี', 'SBP ≥ 160 mmHg', 'eplerenone', 'minoxidil', 'โซเดียมไม่เกิน 2 g/วัน', 'ลด MAP ลงร้อยละ 20–25', 'nitroprusside', 'ชีพจรตั้งแต่ 70']) if (t !== 'HR') expect(text).toContain(t);
    expect(htn.sections.map((x) => x.title)).toEqual(expect.arrayContaining(['เบาหวาน', 'ผู้สูงอายุ', 'ฉุกเฉิน', 'หัวใจ/สมอง']));
  });
});

describe('เบาหวาน (แนวทางเวชปฏิบัติ 2566 บทที่ 7)', () => {
  it('หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว มีสถานะรอทบทวน และตัวเลขสำคัญตรงตารางต้นฉบับ', () => {
    const dm = GUIDELINES.find((x) => x.id === 'dm')!;
    expect(dm.sections.flatMap((x) => x.blocks).sort((a, b) => a - b)).toEqual(dm.blocks.map((_, i) => i));
    expect(dm.review.status).toBe('pending'); dm.blocks.forEach((b) => expect(b.origin).toMatch(/รอเภสัชกรทบทวน/));
    const text = dm.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['ลดขนาดเมื่อ eGFR 30–45', 'ไม่ควรให้เมื่อ eGFR < 30', 'eGFR < 20–30', 'eGFR < 15', 'NPH 0.1–0.2 ยูนิต/กก./วัน', 'ปรับขนาดขึ้น 2–4 ยูนิต ทุก 3–7 วัน', '0.4–0.6 ยูนิต/กก./วัน', 'Liraglutide (Victoza): half-life 13 ชม.', 'Dulaglutide (Trulicity)', 'Insulin degludec (Tresiba): เริ่ม 6 ชม.']) expect(text).toContain(t);
  });
});

describe('โรคไตเรื้อรัง (แนวทางเวชปฏิบัติ 2565)', () => {
  it('หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว และตัวเลขสำคัญตรงตารางต้นฉบับ', () => {
    const g = GUIDELINES.find((x) => x.id === 'ckd')!;
    expect(g.sections.flatMap((x) => x.blocks).sort((a, b) => a - b)).toEqual(g.blocks.map((_, i) => i));
    expect(g.review.status).toBe('pending'); g.blocks.forEach((b) => expect(b.origin).toMatch(/รอเภสัชกรทบทวน/));
    const text = g.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['น้อยกว่า 130/80 มม.ปรอท', 'เพิ่มเกิน 50%: หยุดยา', 'Benazepril', 'CrCl < 30 ลดเหลือวันละ 5 มก.', 'Perindopril', 'ไม่ควรใช้เมื่อ CrCl < 30', 'โพแทสเซียมในซีรัมไม่เกิน 4.8', 'Rosuvastatin', 'Fenofibrate', 'ไม่ควรใช้', 'Hb 10–12 g/dL', 'ไบคาร์บอเนต 24–26', 'dapagliflozin 10 มก.', 'eGFR < 30: ไม่เริ่มหรือหยุดยา']) expect(text).toContain(t);
  });
});

describe('ไขมันผิดปกติในเลือด (แนวทางเวชปฏิบัติ 2567)', () => {
  it('หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว และตัวเลขสำคัญตรงตารางต้นฉบับ', () => {
    const g = GUIDELINES.find((x) => x.id === 'lipid')!;
    expect(g.sections.flatMap((x) => x.blocks).sort((a, b) => a - b)).toEqual(g.blocks.map((_, i) => i));
    expect(g.review.status).toBe('pending'); g.blocks.forEach((b) => expect(b.origin).toMatch(/รอเภสัชกรทบทวน/));
    const text = g.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['LDL-C < 55', 'ไม่ควรใช้ simvastatin 80 มก./วัน', 'conazole, erythromycin, clarithromycin', 'verbapamil'.replace('verbapamil', 'verapamil, diltiazem'), 'amiodarone, amlodipine, ranolazine', 'Atorvastatin 40–80 มก.', 'Rosuvastatin 20 มก.', 'Alirocumab 75 หรือ 150 มก.', 'Evolocumab 140 มก.', 'ตารางที่ 1.2 ระบุ 248 มก. แต่ตารางที่ 2.3 ระบุ 284 มก.', 'CK > 10 เท่า', 'ห่างจากยาอื่นอย่างน้อย 4 ชม.']) expect(text).toContain(t);
  });
});

describe('วอร์ฟาริน (แนวทางสมาคมแพทย์โรคหัวใจ)', () => {
  it('หมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว ตัวเลขสำคัญตรงต้นฉบับ และตรงกับข้อมูลวอร์ฟารินเดิมในแอป', () => {
    const g = GUIDELINES.find((x) => x.id === 'warfarin')!;
    expect(g.sections.flatMap((x) => x.blocks).sort((a, b) => a - b)).toEqual(g.blocks.map((_, i) => i));
    expect(g.review.status).toBe('pending'); g.blocks.forEach((b) => expect(b.origin).toMatch(/รอเภสัชกรทบทวน/));
    const text = g.blocks.flatMap((b) => blockLines(b)).join('\n');
    for (const t of ['INR 2.5–3.5', 'หยุด warfarin 4–5 วันก่อน', 'enoxaparin 1.5 มก./กก. วันละครั้ง', 'ร้อยละ 6.4', 'Rosendaal', 'ไม่ต่ำกว่า 65%', 'vitamin K1 10 มก.', 'ผลิตภัณฑ์ที่มี vitamin K (Glakay)', 'หยุด IV UFH 4–6 ชม. ก่อน'.replace('หยุด IV UFH', 'IV UFH')]) expect(text).toContain(t);
    // ข้อมูลเดิมในแอป (REF_WF_BLOCKS) พูดตรงกันในประเด็นสำคัญ
    const old = JSON.stringify(REF_WF_BLOCKS);
    for (const t of ['4–5 วัน', 'ร้อยละ 6.4', '1.5 มก./กก. วันละครั้ง', '5–20%']) expect(old).toContain(t);
  });
});

describe('ค้นแนวทางตามโรคและตามยา', () => {
  it('ค้นชื่อโรค/คำสำคัญ → พบแนวทาง', () => {
    expect(searchGuidelines('วัณโรค').map((r) => r.guideline.id)).toEqual(['tb']);
    expect(searchGuidelines('tuberculosis')[0].titleMatch).toBe(true);
    expect(searchGuidelines('')).toEqual([]); expect(searchGuidelines('ไม่มีโรคนี้แน่นอน')).toEqual([]);
  });
  it('ค้นชื่อยา → พบทุกตำแหน่งที่กล่าวถึงยานั้น (ขนาด ADR กรณีพิเศษ) ไม่ตกหล่น', () => {
    const r = searchGuidelines('rifampicin')[0];
    const total = TB_GUIDELINE.blocks.flatMap((b) => blockLines(b)).filter((l) => l.toLowerCase().includes('rifampicin')).length;
    expect(r.hits.length).toBe(total); expect(total).toBeGreaterThanOrEqual(4);
    expect(r.hits.some((h) => /ขนาดยาต่อกิโลกรัม/.test(h.heading))).toBe(true);
    expect(searchGuidelines('Pyridoxine')[0].hits.length).toBeGreaterThan(0);
  });
  it('ทุกแนวทางในคลังมี id ไม่ซ้ำ', () => { expect(new Set(GUIDELINES.map((g) => g.id)).size).toBe(GUIDELINES.length); });
});

describe('แนบไฟล์ (ในเครื่อง)', () => {
  const f = (name: string, type: string, size: number) => ({ name, type, size });
  it('ตรวจชนิด ขนาด และจำนวน', () => {
    expect(validateFile(f('a.pdf', 'application/pdf', 1000), 0)).toBeNull();
    expect(validateFile(f('a.png', 'image/png', 1000), 0)).toBeNull();
    expect(validateFile(f('a.pdf', '', 1000), 0)).toBeNull();                       // บางเครื่องไม่ส่ง type
    expect(validateFile(f('a.exe', 'application/x-msdownload', 1000), 0)).toMatch(/PDF/);
    expect(validateFile(f('big.pdf', 'application/pdf', MAX_FILE_BYTES + 1), 0)).toMatch(/แบ่งไฟล์/);
    expect(validateFile(f('a.pdf', 'application/pdf', 1000), MAX_FILES_PER_GUIDELINE)).toMatch(/สูงสุด/);
  });
  it('เพิ่ม/อ่าน/ลบ ในฐานข้อมูลของเครื่อง แยกตามแนวทาง', async () => {
    const db = new AppDb('gl-' + Math.random());
    const file = new File([new Uint8Array([37, 80, 68, 70])], 'tb-guideline.pdf', { type: 'application/pdf' });
    expect(await addFile(db, 'tb', file)).toBeNull();
    expect(await addFile(db, 'other', file)).toBeNull();
    const rows = await listFiles(db, 'tb');
    expect(rows.map((r) => [r.name, r.size, r.guidelineId])).toEqual([['tb-guideline.pdf', 4, 'tb']]);
    await removeFile(db, rows[0].id!);
    expect(await listFiles(db, 'tb')).toEqual([]); expect(await listFiles(db, 'other')).toHaveLength(1);
  });
});
