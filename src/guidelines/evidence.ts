// ทะเบียนหลักฐานของแนวทางแต่ละการ์ด: ระดับของแหล่งที่ใช้ + จัดรายการอ้างอิงให้ตรวจสอบได้
// (ไม่มีเนื้อหาคลินิก — เป็นข้อมูลกำกับที่มาของเนื้อหาในการ์ดเท่านั้น)
import type { Guideline } from './types';

export type EvidenceLevel = 'primary' | 'summary';

export const LEVEL_LABEL: Record<EvidenceLevel, string> = {
  primary: 'ตรวจเทียบต้นฉบับฉบับเต็ม',
  summary: 'สรุปที่นำเข้า · ยังไม่เทียบฉบับเต็ม',
};

/** ระดับหลักฐานรายการ์ด และฐานที่ใช้อ่านเนื้อหา (ตามที่ตรวจจริง) */
export const EVIDENCE: Record<string, { level: EvidenceLevel; basis: string }> = {
  tb: { level: 'primary', basis: 'ตรวจเทียบไฟล์ฉบับเต็มของแนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 พร้อมเลขหน้า' },
  copd: { level: 'summary', basis: 'สรุปแนวทาง GOLD 2026 ที่นำเข้าสู่ระบบ ผ่านการทบทวนโดยเภสัชกรของโรงพยาบาล ยังไม่ได้เทียบกับรายงานฉบับเต็มในระบบนี้' },
  asthma: { level: 'summary', basis: 'สรุปแนวทาง GINA 2026 ที่นำเข้าสู่ระบบ ผ่านการทบทวนโดยเภสัชกรของโรงพยาบาล ยังไม่ได้เทียบกับรายงานฉบับเต็มในระบบนี้' },
  htn: { level: 'primary', basis: 'อ่านจากไฟล์ฉบับเต็มภาษาไทย 153 หน้า และบทความ open access ฉบับภาษาอังกฤษ' },
  cap: { level: 'primary', basis: 'ตรวจเทียบบทความฉบับเต็ม ATS/IDSA 2019 (open access) — ขนาดยา เกณฑ์ และระดับคำแนะนำ' },
  dm: { level: 'primary', basis: 'อ่านจากภาพหน้าของไฟล์ฉบับเต็ม (ข้อความในไฟล์ดึงไม่ได้) ตัวเลขขนาดยาควรตรวจซ้ำกับตารางต้นฉบับ' },
  ckd: { level: 'primary', basis: 'อ่านจากไฟล์ฉบับเต็ม (ข้อความและภาพ) พร้อมเลขหน้า' },
  lipid: { level: 'primary', basis: 'อ่านจากไฟล์ฉบับเต็ม พร้อมเลขหน้า' },
  warfarin: { level: 'primary', basis: 'อ่านจากไฟล์ฉบับเต็ม พร้อมเลขหน้า' },
  hf: { level: 'primary', basis: 'อ่านจากไฟล์ฉบับเต็ม พร้อมเลขหน้า' },
  af: { level: 'primary', basis: 'อ่านจากบทความฉบับเต็ม open access (PMC) อ้างตามเลขตาราง' },
  sepsis: { level: 'primary', basis: 'อ่านจากบทความฉบับเต็ม open access (PMC) อ้างตามเลขข้อแนะนำและตาราง' },
};

/** รหัสย่อบนป้ายการ์ด (แทนไอคอนรูปภาพ ให้แสดงผลเหมือนกันทุกเครื่อง) */
export const CODE: Record<string, string> = { tb: 'TB', copd: 'COPD', asthma: 'AST', htn: 'HTN', cap: 'CAP', dm: 'DM', ckd: 'CKD', lipid: 'LDL', warfarin: 'INR', hf: 'HF', af: 'AF', sepsis: 'SEP' };

/** DOI ที่ตรวจกับ Europe PMC แล้วว่าตรงชื่อบทความ ปี และวารสาร (ตรวจเมื่อ 2026-11-17) */
export const VERIFIED_DOI: Record<string, string> = {
  '10.2478/abm-2025-0034': 'Asian Biomed 2025 · PMC12919385',
  '10.2478/abm-2025-0028': 'Asian Biomed 2025 · PMC12649414',
  '10.1007/s00134-021-06506-y': 'Intensive Care Med 2021 · PMC8486643',
  '10.1164/rccm.201908-1581st': 'Am J Respir Crit Care Med 2019 · PMC6812437',
};
export const DOI_CHECKED_AT = '2026-11-17';

export interface CiteGroups { references: string[]; verification: string[]; limits: string[] }

/** แยกรายการใน cites เป็น แหล่งอ้างอิง / การตรวจสอบเนื้อหา / ข้อจำกัด (ตามคำขึ้นต้น) */
export function groupCites(g: Guideline): CiteGroups {
  const out: CiteGroups = { references: [], verification: [], limits: [] };
  for (const c of g.cites) {
    if (/^(ยังไม่ครอบคลุม|ไม่ได้ใส่|ข้อจำกัด)/.test(c)) out.limits.push(c.replace(/^(ยังไม่ครอบคลุม|ไม่ได้ใส่|ข้อจำกัด):\s*/, ''));
    else if (/^(ตรวจเทียบ|หมายเหตุ|ความไม่ตรง|วิธีอ่าน|ไฟล์ดึง|สรุปเป็น)/.test(c)) out.verification.push(c);
    else out.references.push(c);
  }
  return out;
}

export type Seg = { t: string; href?: string; verified?: boolean };
/** แปลง DOI / PMC / URL ในข้อความเป็นลิงก์ (เฉพาะ https) */
export function linkify(text: string): Seg[] {
  const re = /(https:\/\/[^\s·)]+)|doi:\s*(10\.\d{4,9}\/[^\s·;,)]+)|\b(PMC\d{5,9})\b/gi;
  const segs: Seg[] = []; let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push({ t: text.slice(last, m.index) });
    if (m[1]) segs.push({ t: m[1], href: m[1] });
    else if (m[2]) segs.push({ t: 'doi:' + m[2], href: 'https://doi.org/' + m[2], verified: m[2].toLowerCase() in VERIFIED_DOI });
    else segs.push({ t: m[3], href: 'https://pmc.ncbi.nlm.nih.gov/articles/' + m[3].toUpperCase() + '/' });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ t: text.slice(last) });
  return segs;
}
