// แนวทางการรักษาวัณโรค — สร้างจาก REF_TB_BLOCKS / REF_TB_CITES (คัดจากต้นแบบพร้อมที่มา: แนวทางควบคุมวัณโรคประเทศไทย พ.ศ. 2564, WHO, ATS/CDC/IDSA)
// ไม่มีข้อความทางคลินิกใหม่ในไฟล์นี้ — ที่นี่กำหนดเฉพาะโครงหมวดและป้ายนำทาง
import { REF_TB_BLOCKS, REF_TB_CITES } from '../data/references';
import type { Block, Guideline } from './types';

export const TB_GUIDELINE: Guideline = {
  id: 'tb', title: 'วัณโรค (Tuberculosis)', category: 'โรคติดเชื้อ',
  keywords: ['วัณโรค', 'tuberculosis', 'TB', '2HRZE', '4HR', '3HP', 'LTBI', 'isoniazid', 'rifampicin', 'pyrazinamide', 'ethambutol', 'rifapentine'],
  source: 'แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 · WHO consolidated guidelines on tuberculosis Module 4 (2022)',
  cites: REF_TB_CITES as string[],
  // ตัวอย่างแรก: ยังไม่ได้ทบทวนโดยเภสัชกร — แก้ที่นี่ (ผ่าน PR) เมื่อทบทวนแล้ว
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks: REF_TB_BLOCKS as unknown as Block[],
  sections: [
    { title: 'สูตรยา', blocks: [0] }, { title: 'ขนาดตามน้ำหนัก', blocks: [1] }, { title: 'รายตัวยา', blocks: [2] },
    { title: 'อาการไม่พึงประสงค์', blocks: [3, 4, 5, 6] }, { title: 'กรณีพิเศษ', blocks: [7] }, { title: 'การติดตาม', blocks: [8] },
  ],
  calc: { label: 'คำนวณขนาดยา TB ตามน้ำหนัก', mode: 'tb' },
};
