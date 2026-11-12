// แนวทางการรักษาวัณโรค — สร้างจาก REF_TB_BLOCKS / REF_TB_CITES (คัดจากต้นแบบพร้อมที่มา: แนวทางควบคุมวัณโรคประเทศไทย พ.ศ. 2564, WHO, ATS/CDC/IDSA)
// บล็อก 0-8 คัดจากไฟล์อ้างอิงมีที่มา; บล็อก 9-13 จากสรุปที่ผู้ใช้ส่งมา (tb-extra.ts, มีป้าย origin)
import { REF_TB_BLOCKS, REF_TB_CITES } from '../data/references';
import type { Block, Guideline } from './types';
import { TB_EXTRA_BLOCKS } from './tb-extra';

export const TB_GUIDELINE: Guideline = {
  id: 'tb', title: 'วัณโรค (Tuberculosis)', category: 'โรคติดเชื้อ', accent: '#0F9D8A', icon: '🦠',
  keywords: ['วัณโรค', 'tuberculosis', 'TB', '2HRZE', '4HR', '3HP', 'LTBI', 'isoniazid', 'rifampicin', 'pyrazinamide', 'ethambutol', 'rifapentine'],
  source: 'แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 · WHO consolidated guidelines on tuberculosis Module 4 (2022)',
  cites: [
    ...(REF_TB_CITES as string[]),
    // ตรวจเทียบกับไฟล์ PDF ต้นฉบับทั้งเล่ม (217 หน้า) — เลขหน้าด้านล่างคือเลขหน้าที่พิมพ์ในเล่ม (PDF หน้า = เลขที่พิมพ์ + 15)
    'ตรวจเทียบกับไฟล์ต้นฉบับ NTP 2021 (กองวัณโรค, ISBN 978-616-11-4749-5) แล้ว: สูตร 2HRZE/4HR (หน้า 59), ตารางที่ 5.1 ขนาดยา (หน้า 60), ตารางที่ 5.2 อาการไม่พึงประสงค์ (หน้า 60-61), เกณฑ์ตับ/re-challenge/ethambutol (หน้า 62), การตรวจติดตาม (ตารางที่ 5.3 หน้า 63-64), เวลาเริ่มยาต้านเอชไอวี และอันตรกิริยา R กับ ARV (ตารางที่ 5.7-5.8 หน้า 68), ไต/ตับ/ตั้งครรภ์ (ตารางที่ 5.9 และข้อ 5.4.2-5.4.4 หน้า 69), การคัดกรองกลุ่มเสี่ยง (ข้อ 4.4 หน้า 50-51), Hr-TB (ตารางที่ 6.2 หน้า 78), สูตรระยะสั้นมี Bdq และข้อห้าม QTcF/AST-ALT (หน้า 79-80), อันตรกิริยา (ตารางที่ 6.7 หน้า 86-88) — ตรงกับข้อมูลในการ์ด',
    'หมายเหตุจากการเทียบ: เวลาเริ่ม ART ตามตารางที่ 5.7 = ภายใน 2 สัปดาห์ อย่างช้าไม่เกิน 4 สัปดาห์ (วัณโรคเยื่อหุ้มสมอง ≥ 4 และไม่เกิน 8 สัปดาห์) ตรงกับข้อมูลเดิมในการ์ด · ข้อความ Linezolid ปรับให้ตรงตารางที่ 6.7 และหมายเหตุหน้า 88',
  ],
  // ตัวอย่างแรก: ยังไม่ได้ทบทวนโดยเภสัชกร — แก้ที่นี่ (ผ่าน PR) เมื่อทบทวนแล้ว
  summary: [
    'ผู้ป่วยใหม่ที่เชื้อไวต่อยา: 2HRZE/4HR รวม 6 เดือน · วัณโรคเยื่อหุ้มสมองและกระดูกและข้อ: 2HRZE/10HR รวม 12 เดือน · โรคตับ: 2HRE/7HR (ตัด pyrazinamide) รวม 9 เดือน',
    'ขนาดผู้ใหญ่ต่อวัน: Isoniazid 4–6 มก./กก. (สูงสุด 300 มก.) · Rifampicin 8–12 มก./กก. (สูงสุด 600 มก.) · Pyrazinamide 20–30 มก./กก. (สูงสุด 2,000 มก.)',
    'ผื่น ดีซ่าน หรืออาการสับสน: หยุดยารักษาวัณโรคและส่งปรึกษาผู้เชี่ยวชาญ',
    'ชาปลายมือปลายเท้าจาก isoniazid: ให้ pyridoxine 50–75 มก./วัน · ปวดข้อจาก pyrazinamide: ให้ NSAIDs หรือ paracetamol',
    'ตั้งครรภ์: ใช้สูตรมาตรฐานได้ ให้ pyridoxine 50–100 มก./วัน ร่วมกับ isoniazid และหลีกเลี่ยง aminoglycoside',
    'ตรวจ AFB smear ก่อนเริ่มรักษา สิ้นเดือนที่ 2 สิ้นเดือนที่ 5 และเดือนสุดท้าย',
    'MDR/RR-TB สูตรระยะสั้น 9–11 เดือน มี bedaquiline และ fluoroquinolone เป็นแกน — ดูรายละเอียดและข้อห้ามในแท็บการรักษา',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks: [...(REF_TB_BLOCKS as unknown as Block[]), ...TB_EXTRA_BLOCKS],
  drugs: [
    { name: 'Isoniazid (H)', group: 'ยาหลัก (แนวที่ 1)', aliases: ['Isoniazid', 'INH'] }, { name: 'Rifampicin (R)', group: 'ยาหลัก (แนวที่ 1)', aliases: ['Rifampicin', 'rifampin'] },
    { name: 'Pyrazinamide (Z)', group: 'ยาหลัก (แนวที่ 1)', aliases: ['Pyrazinamide'] }, { name: 'Ethambutol (E)', group: 'ยาหลัก (แนวที่ 1)', aliases: ['Ethambutol'] },
    { name: 'Rifapentine', group: 'ยาหลัก (แนวที่ 1)', aliases: ['Rifapentine', '3HP'] }, { name: 'Pyridoxine (B6)', group: 'ยาที่ใช้ร่วม/อันตรกิริยา', aliases: ['Pyridoxine', 'B6'] },
    { name: 'Fluoroquinolones', group: 'ยาวัณโรคดื้อยา', aliases: ['Fluoroquinolone', 'Fluoroquinolones', 'FQ'], members: [{ name: 'Levofloxacin', aliases: ['Levofloxacin', 'Lfx'] }, { name: 'Moxifloxacin', aliases: ['Moxifloxacin', 'Mfx'] }] },
    { name: 'Bedaquiline', group: 'ยาวัณโรคดื้อยา', aliases: ['Bedaquiline', 'Bdq'] }, { name: 'Linezolid', group: 'ยาวัณโรคดื้อยา', aliases: ['Linezolid', 'Lzd'] },
    { name: 'Clofazimine', group: 'ยาวัณโรคดื้อยา', aliases: ['Clofazimine', 'Cfz'] }, { name: 'Aminoglycosides', group: 'ยาวัณโรคดื้อยา', aliases: ['Aminoglycoside', 'Aminoglycosides'] },
    { name: 'Prednisolone', group: 'ยาที่ใช้ร่วม/อันตรกิริยา', aliases: ['Prednisolone', 'steroid'] }, { name: 'Warfarin', group: 'ยาที่ใช้ร่วม/อันตรกิริยา', aliases: ['Warfarin'] },
    { name: 'ยาต้านไวรัส (ART/ARV)', group: 'ยาที่ใช้ร่วม/อันตรกิริยา', aliases: ['ART', 'ARV', 'ยาต้านไวรัส'] },
  ],
  sections: [
    { title: 'สูตรยา', blocks: [0] }, { title: 'ขนาดตามน้ำหนัก', blocks: [1] }, { title: 'รายตัวยา', blocks: [2] },
    { title: 'อาการไม่พึงประสงค์', blocks: [3, 4, 5, 6] }, { title: 'กรณีพิเศษ', blocks: [7] }, { title: 'การติดตาม', blocks: [8, 13] },
    { title: 'อันตรกิริยา', blocks: [11] }, { title: 'วัณโรคดื้อยา', blocks: [12] }, { title: 'วินิจฉัย/โรค', blocks: [9, 10] },
  ],
  calc: { label: 'คำนวณขนาดยา TB ตามน้ำหนัก', mode: 'tb' },
};
