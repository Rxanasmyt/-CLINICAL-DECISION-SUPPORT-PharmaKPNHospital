import { describe, it, expect } from 'vitest';
import { suggestAdrType, suggestSerious, effectiveSev2, effectiveHpvc, needsHpvc, prevHints } from './adrAuto';

describe('ชนิด ADR อัตโนมัติ', () => {
  it('Type A → A · Type B และ Gell & Coombs I–IV → B · ยังระบุไม่ได้/ว่าง → ไม่เดา', () => {
    const t = (s: string) => suggestAdrType(s).type;
    expect(t('Type A (คาดเดาได้จากฤทธิ์ยา)')).toBe('A');
    expect(['Type B (idiosyncratic / immune)', 'Type I IgE-mediated', 'Type II cytotoxic', 'Type III immune complex', 'Type IV T-cell mediated (delayed)'].map(t)).toEqual(['B', 'B', 'B', 'B', 'B']);
    expect([t('ยังระบุไม่ได้'), t(''), t(undefined as any)]).toEqual(['', '', '']);
  });
  it('serious: เสียชีวิต / SJS-DRESS-anaphylaxis', () => {
    expect(suggestSerious({ outcome: 'death' })).toEqual([{ item: 'เสียชีวิต', why: 'ผลลัพธ์ = เสียชีวิต' }]);
    expect(suggestSerious({ crit: { sjs: true, ana: true } })).toEqual([{ item: 'อันตรายถึงชีวิต', why: 'เข้าเกณฑ์ SJS/TEN, anaphylaxis' }]);
    expect(suggestSerious({ outcome: 'recovering', crit: {} })).toEqual([]);
  });
});

describe('ค่าที่ใช้จริง: เภสัชกรเลือกเองมีผลเหนืออัตโนมัติ', () => {
  const sug = suggestSerious({ crit: { sjs: true } });
  it('ไม่ได้เลือก = ใช้ค่าอัตโนมัติ', () => {
    const e = effectiveSev2(undefined, 'Type IV T-cell mediated (delayed)', sug);
    expect(e).toMatchObject({ type: 'B', typeAuto: true, serious: ['อันตรายถึงชีวิต'] });
    expect(e.seriousAuto['อันตรายถึงชีวิต']).toMatch(/SJS/);
  });
  it('เลือกประเภทเอง / ปิดประเภท / ยกเลิก serious อัตโนมัติ / เพิ่ม serious เอง', () => {
    expect(effectiveSev2({ type: 'A' }, 'Type IV T-cell mediated (delayed)', []).type).toBe('A');
    expect(effectiveSev2({ typeOff: true }, 'Type IV T-cell mediated (delayed)', []).type).toBe('');
    expect(effectiveSev2({ removed: ['อันตรายถึงชีวิต'] }, '', sug).serious).toEqual([]);
    expect(effectiveSev2({ serious: ['พิการหรือไร้ความสามารถถาวร'] }, '', sug).serious).toEqual(['อันตรายถึงชีวิต', 'พิการหรือไร้ความสามารถถาวร']);
  });
  it('เคสเก่า (sev2.type/serious เลือกเอง) ยังได้ค่าเดิม', () => {
    expect(effectiveSev2({ type: 'B', serious: ['เสียชีวิต'] }, '', [])).toMatchObject({ type: 'B', typeAuto: false, serious: ['เสียชีวิต'] });
  });
});

describe('HPVC อัตโนมัติ (ข้อ 9-3.1: type B และ serious)', () => {
  it('type B หรือ serious → รอส่ง · Type A ไม่ serious → ว่าง · ที่เลือกเองมีผลเหนือ', () => {
    expect(effectiveHpvc('', { type: 'B', serious: [] })).toEqual({ value: 'pending', auto: true });
    expect(effectiveHpvc('', { type: 'A', serious: ['เสียชีวิต'] })).toEqual({ value: 'pending', auto: true });
    expect(effectiveHpvc('', { type: 'A', serious: [] })).toEqual({ value: '', auto: false });
    expect(effectiveHpvc('notreq', { type: 'B', serious: [] })).toEqual({ value: 'notreq', auto: false });
    expect(effectiveHpvc('sent', { type: 'B', serious: [] }).auto).toBe(false);
    expect(needsHpvc({ type: '', serious: [] })).toBe(false);
  });
});

describe('คำแนะนำ Preventability', () => {
  const d = (name: string, suspect = true) => ({ name, suspect });
  it('ข้อ 3: warfarin ไม่มี INR → เตือน · มี INR แล้ว → ไม่เตือน', () => {
    expect(prevHints({ drugs: [d('Warfarin')], labs: [] })[3]).toMatch(/Warfarin ควรติดตาม INR/);
    expect(prevHints({ drugs: [d('Warfarin')], labs: [{ name: 'INR', value: '2.5' }] })[3]).toBeUndefined();
    expect(prevHints({ drugs: [d('Amoxicillin')], labs: [] })[3]).toBeUndefined();
  });
  it('ข้อ 5: มียาตั้งแต่ 2 รายการ', () => {
    expect(prevHints({ drugs: [d('A'), d('B', false)], labs: [] })[5]).toMatch(/2 รายการ/);
    expect(prevHints({ drugs: [d('A')], labs: [] })[5]).toBeUndefined();
  });
  it('ข้อ 6: มีระดับยาในเลือด / INR > 4 ของ warfarin', () => {
    expect(prevHints({ drugs: [d('Phenytoin')], labs: [{ name: 'Phenytoin level', value: '30' }] })[6]).toMatch(/Phenytoin level = 30/);
    expect(prevHints({ drugs: [d('Warfarin')], labs: [{ name: 'INR', value: '6.1' }] })[6]).toMatch(/สูงกว่า 4/);
    expect(prevHints({ drugs: [d('Warfarin')], labs: [{ name: 'INR', value: '2.5' }] })[6]).toBeUndefined();
  });
  it('ไม่ให้คำแนะนำข้อที่ต้องใช้ดุลยพินิจ (1, 2, 7)', () => {
    const h = prevHints({ drugs: [d('Warfarin'), d('Aspirin')], labs: [{ name: 'INR', value: '6' }] });
    expect([1, 2, 7].map((n) => h[n])).toEqual([undefined, undefined, undefined]);
  });
});
