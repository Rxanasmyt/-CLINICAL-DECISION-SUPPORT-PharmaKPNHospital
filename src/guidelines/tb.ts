// แนวทางการรักษาวัณโรค — สร้างจาก REF_TB_BLOCKS / REF_TB_CITES (คัดจากต้นแบบพร้อมที่มา: แนวทางควบคุมวัณโรคประเทศไทย พ.ศ. 2564, WHO, ATS/CDC/IDSA)
// บล็อก 0-8 คัดจากไฟล์อ้างอิงมีที่มา; บล็อก 9-13 จากสรุปที่ผู้ใช้ส่งมา (tb-extra.ts, มีป้าย origin)
import { REF_TB_BLOCKS, REF_TB_CITES } from '../data/references';
import type { Block, Guideline } from './types';
import { TB_EXTRA_BLOCKS } from './tb-extra';

export const TB_GUIDELINE: Guideline = {
  id: 'tb', title: 'วัณโรค (Tuberculosis)', category: 'โรคติดเชื้อ', accent: '#0F9D8A', icon: '🦠',
  keywords: ['วัณโรค', 'tuberculosis', 'TB', '2HRZE', '4HR', '3HP', 'LTBI', 'isoniazid', 'rifampicin', 'pyrazinamide', 'ethambutol', 'rifapentine'],
  source: 'แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 · WHO consolidated guidelines on tuberculosis Module 4 (2022)',
  cites: REF_TB_CITES as string[],
  // ตัวอย่างแรก: ยังไม่ได้ทบทวนโดยเภสัชกร — แก้ที่นี่ (ผ่าน PR) เมื่อทบทวนแล้ว
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks: [...(REF_TB_BLOCKS as unknown as Block[]), ...TB_EXTRA_BLOCKS],
  drugs: [
    { name: 'Isoniazid (H)', aliases: ['Isoniazid', 'INH'] }, { name: 'Rifampicin (R)', aliases: ['Rifampicin', 'rifampin'] },
    { name: 'Pyrazinamide (Z)', aliases: ['Pyrazinamide'] }, { name: 'Ethambutol (E)', aliases: ['Ethambutol'] },
    { name: 'Rifapentine', aliases: ['Rifapentine', '3HP'] }, { name: 'Pyridoxine (B6)', aliases: ['Pyridoxine', 'B6'] },
    { name: 'Fluoroquinolones', aliases: ['Fluoroquinolone', 'Fluoroquinolones', 'FQ', 'Lfx', 'Mfx', 'levofloxacin', 'moxifloxacin'] },
    { name: 'Bedaquiline', aliases: ['Bedaquiline', 'Bdq'] }, { name: 'Linezolid', aliases: ['Linezolid', 'Lzd'] },
    { name: 'Clofazimine', aliases: ['Clofazimine', 'Cfz'] }, { name: 'Aminoglycosides', aliases: ['Aminoglycoside', 'Aminoglycosides'] },
    { name: 'Prednisolone / steroid', aliases: ['Prednisolone', 'steroid'] }, { name: 'Warfarin', aliases: ['Warfarin'] },
    { name: 'ยาต้านไวรัส (ART/ARV)', aliases: ['ART', 'ARV', 'ยาต้านไวรัส'] },
  ],
  sections: [
    { title: 'สูตรยา', blocks: [0] }, { title: 'ขนาดตามน้ำหนัก', blocks: [1] }, { title: 'รายตัวยา', blocks: [2] },
    { title: 'อาการไม่พึงประสงค์', blocks: [3, 4, 5, 6] }, { title: 'กรณีพิเศษ', blocks: [7] }, { title: 'การติดตาม', blocks: [8, 13] },
    { title: 'อันตรกิริยา', blocks: [11] }, { title: 'วัณโรคดื้อยา', blocks: [12] }, { title: 'วินิจฉัย/โรค', blocks: [9, 10] },
  ],
  calc: { label: 'คำนวณขนาดยา TB ตามน้ำหนัก', mode: 'tb' },
};
