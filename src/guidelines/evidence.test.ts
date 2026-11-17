import { describe, it, expect } from 'vitest';
import { GUIDELINES } from './registry';
import { CODE, EVIDENCE, FOREIGN, VERIFIED_DOI, groupCites, linkify } from './evidence';

describe('ทะเบียนหลักฐาน', () => {
  it('ทุกการ์ดมีระดับหลักฐาน รหัสป้าย และแหล่งอ้างอิงอย่างน้อยหนึ่งรายการ', () => {
    for (const g of GUIDELINES) {
      expect(EVIDENCE[g.id], g.id).toBeTruthy(); expect(['primary', 'summary']).toContain(EVIDENCE[g.id].level); expect(EVIDENCE[g.id].basis.length, g.id).toBeGreaterThan(20);
      expect(CODE[g.id], g.id).toBeTruthy();
      const c = groupCites(g); expect(c.references.length, g.id).toBeGreaterThan(0);
      expect(c.references.length + c.verification.length + c.limits.length).toBe(g.cites.length);
    }
  });
  it('การ์ดที่ระบุว่าตรวจเทียบฉบับเต็มต้องมีข้อความการตรวจสอบหรือฐานการอ่านที่ชัดเจน ส่วนการ์ดสรุปต้องบอกว่ายังไม่เทียบฉบับเต็ม', () => {
    for (const g of GUIDELINES) { const e = EVIDENCE[g.id]; if (e.level === 'summary') expect(e.basis, g.id).toMatch(/ยังไม่ได้เทียบ/); else expect(e.basis, g.id).toMatch(/ตรวจเทียบ|อ่านจาก/); }
  });
  it('ถ้อยคำในรายการอ้างอิง/ที่มาของเนื้อหาเป็นทางการ ไม่มีสรรพนามบุคคลที่หนึ่งหรือคำว่าลิงก์ที่ผู้ใช้ส่ง', () => {
    for (const g of GUIDELINES) {
      const texts = [...g.cites, ...g.blocks.map((b) => b.origin || '')];
      for (const t of texts) expect(t, g.id).not.toMatch(/ผมแก้|ผมได้|ผู้ใช้ส่ง|ผู้ใช้แจ้ง|Google Drive/);
    }
  });
  it('DOI ที่ปรากฏในการ์ดทุกตัวอยู่ในรายการที่ตรวจกับ Europe PMC แล้ว', () => {
    const re = /doi:\s*(10\.\d{4,9}\/[^\s·;,)]+)/gi;
    for (const g of GUIDELINES) for (const c of g.cites) for (const m of c.matchAll(re)) expect(VERIFIED_DOI[m[1].toLowerCase()], g.id + ' ' + m[1]).toBeTruthy();
  });
});

describe('แนวทางต่างประเทศ', () => {
  it('รหัสที่ติดป้ายต่างประเทศต้องเป็นการ์ดที่มีอยู่จริง และการ์ดต่างประเทศใหม่ระบุที่มาในป้ายของเนื้อหา', () => {
    const ids = GUIDELINES.map((g) => g.id);
    for (const id of FOREIGN) expect(ids, id).toContain(id);
    for (const id of ['iai', 'ssti', 'mening', 'cdi']) for (const b of GUIDELINES.find((g) => g.id === id)!.blocks) expect(b.origin, id).toMatch(/ต่างประเทศ.*ไม่ได้ปรับตามบริบทไทย/);
    for (const id of ['tb', 'htn', 'af', 'dm', 'ckd', 'lipid', 'warfarin', 'hf']) expect(FOREIGN.has(id), id).toBe(false);
  });
});

describe('linkify', () => {
  it('แปลง DOI / PMC / https เป็นลิงก์ และไม่ทำลิงก์จาก http หรือ javascript:', () => {
    const s = linkify('x doi:10.2478/abm-2025-0034 · PMC12919385 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/ y');
    expect(s.filter((x) => x.href).map((x) => x.href)).toEqual(['https://doi.org/10.2478/abm-2025-0034', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/']);
    expect(s.find((x) => x.t.startsWith('doi:'))?.verified).toBe(true);
    expect(linkify('http://evil.example javascript:alert(1)').some((x) => x.href)).toBe(false);
    expect(linkify('doi:10.9999/unknown')[0].verified).toBe(false);
  });
});
