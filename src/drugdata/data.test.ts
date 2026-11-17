// ตรวจความสมบูรณ์ของไฟล์ข้อมูลยาที่สร้างไว้ (public/drugdata) และสิ่งที่ห้ามหลุดออกไป
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const DIR = new URL('../../public/drugdata/', import.meta.url).pathname;
const J = (p: string) => JSON.parse(readFileSync(DIR + p, 'utf8'));
const idx = J('index.json');

describe('ไฟล์ข้อมูลยา', () => {
  it('ทุกรายการในบัญชีอยู่ครบ มีสถานะ และไม่มีข้อมูลภายใน (ราคา ชื่อผู้พิมพ์ วันที่พิมพ์)', () => {
    expect(idx.items.length).toBe(585);
    expect(new Set(idx.items.map((i: any) => i.no)).size).toBe(585);
    const raw = readFileSync(DIR + 'index.json', 'utf8');
    for (const bad of ['price', 'Price', 'อนัส', 'ผู้พิมพ์', 'พิมพ์จาก', 'RX-PRINT']) expect(raw, bad).not.toContain(bad);
    for (const it of idx.items) expect(['mapped', 'manual', 'nonlabel', 'herbal', 'unmapped']).toContain(it.status);
  });
  it('สารออกฤทธิ์ทุกตัวมีไฟล์ monograph และ DI และเนื้อหาในแต่ละหัวข้อไม่ว่าง', () => {
    const slugs = new Set<string>(idx.items.flatMap((i: any) => i.ingredients.map((g: any) => g.slug)));
    expect(slugs.size).toBeGreaterThan(250);
    for (const s of slugs) {
      expect(existsSync(DIR + 'monographs/' + s + '.json'), s).toBe(true); expect(existsSync(DIR + 'di/' + s + '.json'), s).toBe(true);
      const m = J('monographs/' + s + '.json');
      for (const l of m.labels) { expect(l.setid, s).toBeTruthy(); for (const sec of Object.values<any>(l.sections)) expect(sec.t.length, s).toBeGreaterThan(0); }
    }
    expect(readdirSync(DIR + 'monographs').length).toBe(slugs.size);
  });
  it('ผู้ที่มีฉลากอย่างน้อยหนึ่งฉบับต้องมีข้อบ่งใช้ (indications) ในฉลากอย่างน้อยหนึ่งรูปแบบ', () => {
    const missing: string[] = [];
    for (const it of idx.items) for (const g of it.ingredients) if (g.hasLabel) { const m = J('monographs/' + g.slug + '.json'); if (!m.labels.some((l: any) => l.sections.indications_and_usage)) missing.push(g.slug); }
    // รายงานเป็นข้อมูล: ฉลากบางฉบับ (เช่น สารน้ำ/ฉลากเก่า) ไม่มีหัวข้อนี้ — ต้องไม่เกิน 10% ของสารที่มีฉลาก
    const total = new Set(idx.items.flatMap((i: any) => i.ingredients.filter((g: any) => g.hasLabel).map((g: any) => g.slug))).size;
    expect(new Set(missing).size / total).toBeLessThan(0.1);
  });
  it('ข้อความ DI ทุกรายการมีระดับที่รู้จัก มีที่มา (setid) และไม่ยาวเกินหน้าต่างที่กำหนด', () => {
    for (const f of readdirSync(DIR + 'di')) {
      const d = J('di/' + f);
      for (const hs of [...Object.values<any>(d.partners), ...Object.values<any>(d.classes)]) for (const h of hs) { expect(['contraindicated', 'avoid', 'monitor', 'info']).toContain(h.s); expect(h.setid).toBeTruthy(); expect(h.t.length).toBeGreaterThan(10); expect(h.t.length).toBeLessThan(720); }
    }
  });
  it('คู่ยาที่รู้จักดีต้องถูกพบตามถ้อยคำในฉลาก (กันข้อมูลถดถอยเมื่อสร้างใหม่)', () => {
    const has = (a: string, b: string, sev: string[]) => J('di/' + a + '.json').partners[b]?.some((h: any) => sev.includes(h.s));
    expect(has('clopidogrel', 'omeprazole', ['avoid', 'contraindicated'])).toBe(true);
    expect(has('clarithromycin', 'simvastatin', ['contraindicated'])).toBe(true);
    expect(has('amiodarone', 'digoxin', ['monitor', 'avoid', 'contraindicated'])).toBe(true);
    expect(has('warfarin', 'aspirin', ['monitor', 'avoid', 'contraindicated'])).toBe(true);
  });
});
