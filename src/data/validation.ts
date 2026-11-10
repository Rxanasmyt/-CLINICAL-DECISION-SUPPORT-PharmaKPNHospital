// ทะเบียนการตรวจสอบสูตรคำนวณทางคลินิกโดยเภสัชกรผู้เชี่ยวชาญ
// เทสต์อัตโนมัติพิสูจน์ได้แค่ว่าผลตรงกับต้นแบบ — ความถูกต้องทางคลินิกต้องให้คนตรวจกับแนวทางล่าสุด
// เมื่อตรวจและลงนามในเอกสาร docs/CLINICAL-VALIDATION.md แล้ว ให้แก้ status/reviewer/reviewedAt ที่นี่ (ผ่าน PR เพื่อให้ตรวจสอบย้อนหลังได้)
export const FORMULA_VERSION = 'F1';

export interface ValidationItem {
  id: string; name: string; reference: string;
  status: 'pending' | 'approved';
  reviewer: string; reviewedAt: string;
}

export const VALIDATION: ValidationItem[] = [
  { id: 'tb', name: 'ขนาดยาวัณโรค (Active TB 2HRZE/4HR)', reference: 'แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 · WHO TB Module 4 (2022)', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'ltbi', name: 'วัณโรคระยะแฝง 3HP', reference: 'แนวทางวัณโรคไทย · WHO LTBI', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'warf', name: 'ปรับขนาด Warfarin + ตารางยารายสัปดาห์', reference: 'สมาคมแพทย์โรคหัวใจแห่งประเทศไทย · ขนาดเม็ดที่ รพ. มีจริง', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'ped', name: 'ยาน้ำเด็ก 15 รายการ', reference: 'BNFC · AAP · WHO · รายการยาและความแรงของ รพ.', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'ins', name: 'จำนวน insulin ที่ต้องจ่าย', reference: 'ขนาดบรรจุ vial/penfill ที่ รพ. จัดซื้อ', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'adrauto', name: 'กฎเติมอัตโนมัติ: ชนิด ADR (A/B), Serious, สถานะ HPVC, คำแนะนำ Preventability', reference: 'Rawlins–Thompson · เกณฑ์ serious ADR · มาตรฐานข้อ 9-3.1 · Schumock & Thornton', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'gl-tb', name: 'การ์ดแนวทางการรักษาวัณโรค (คลังแนวทาง) — เนื้อหาคือข้อมูลอ้างอิง TB เดิมในแอป', reference: 'แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 · WHO Module 4 (2022) · แก้สถานะ/ผู้ทบทวนที่ src/guidelines/tb.ts ด้วย', status: 'pending', reviewer: '', reviewedAt: '' },
  { id: 'adr', name: 'Naranjo / WHO-UMC / Schumock & Thornton', reference: 'เอกสารต้นฉบับของแต่ละเกณฑ์', status: 'pending', reviewer: '', reviewedAt: '' },
];
