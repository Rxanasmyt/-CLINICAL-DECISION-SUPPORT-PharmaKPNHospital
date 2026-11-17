import { describe, it, expect } from 'vitest';
import { emphasize, toLines } from './format';

describe('toLines', () => {
  it('แบ่งประโยคและหัวข้อย่อย โดยไม่ทำให้ถ้อยคำหาย (ต่อกลับได้เท่าเดิม ยกเว้นหัวข้อหลักที่ซ้ำและช่องว่าง)', () => {
    const raw = '2 DOSAGE AND ADMINISTRATION Individualize dosing for each patient. Adjust based on INR. 2.1 Individualized Dosing The dosage must be individualized for each patient according to the INR response to the drug. 2.2 Recommended Starting Dose Start with 2 to 5 mg once daily for 1 or 2 days.';
    const lines = toLines(raw);
    expect(lines.map((l) => l.kind)).toEqual(['p', 'p', 'p']);
    expect(lines.map((l) => l.num)).toEqual([undefined, '2.1', '2.2']);
    expect(lines[0].text).toBe('Individualize dosing for each patient. Adjust based on INR.');
    const joined = lines.map((l) => l.text).join(' ').replace(/\s+/g, ' ');
    for (const w of ['Individualize', 'Adjust based on INR.', '2 to 5 mg once daily', 'INR response']) expect(joined).toContain(w);
  });
  it('ไม่แยกประโยคที่คำย่อ (e.g.) และจัดรายการ • เป็นบรรทัดของตัวเอง', () => {
    const l = toLines('Avoid drugs (e.g. aspirin) in these patients with active bleeding or severe hypertension noted. • Item one here • Item two here');
    expect(l.filter((x) => x.kind === 'b').map((x) => x.text)).toEqual(['Item one here', 'Item two here']);
    expect(l.find((x) => x.kind === 'p')!.text).toContain('e.g. aspirin');
  });
  it('ข้อความว่างคืนอาร์เรย์ว่าง', () => { expect(toLines('   ')).toEqual([]); });
});

describe('ทำความสะอาดส่วนสรุป (Highlights) ของฉลาก', () => {
  it('ตัดเลขอ้างอิงภายในและประโยคซ้ำ แต่คงประโยคสำคัญและข้อความ [see ...]', () => {
    const raw = 'WARNING: BLEEDING RISK Warfarin can cause major or fatal bleeding [see Warnings and Precautions (5.1) ]. Perform regular monitoring of INR in all treated patients. WARNING: BLEEDING RISK See full prescribing information for complete boxed warning. Warfarin can cause major or fatal bleeding. ( 5.1 ) Perform regular monitoring of INR in all treated patients. ( 2.1 )';
    const t = toLines(raw).map((l) => l.text).join(' | ');
    expect(t).not.toMatch(/\( 5\.1 \)|\( 2\.1 \)/);
    expect(t.match(/Perform regular monitoring of INR/g)?.length).toBe(1);
    expect(t).toContain('[see Warnings and Precautions (5.1) ]');
    expect(t).toContain('See full prescribing information');
  });
});

describe('emphasize', () => {
  it('เน้นขนาดยา ช่วงตัวเลข ระยะเวลา และหน่วย', () => {
    const p = emphasize('Give 0.5 mg every 5 to 10 minutes; max 3 mg/kg or 150 mg for 7 days at 25-30 %.');
    expect(p.filter((x) => x.strong).map((x) => x.t)).toEqual(['0.5 mg', '10 minutes', '3 mg/kg', '150 mg', '7 days', '25-30 %']);
    expect(p.map((x) => x.t).join('')).toBe('Give 0.5 mg every 5 to 10 minutes; max 3 mg/kg or 150 mg for 7 days at 25-30 %.');
  });
});
