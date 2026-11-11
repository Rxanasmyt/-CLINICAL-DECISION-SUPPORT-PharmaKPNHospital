// แนวทางการรักษาโรคหืด (GINA 2026) — คัดจากสรุปที่ผู้ใช้ส่งมาเป็นข้อความ คงถ้อยคำเดิม (แปลงสัญลักษณ์ ≥ ≤ เท่านั้น)
// ไม่มีเลขหน้า · ผู้ใช้แจ้งว่าเภสัชกรทบทวนแล้ว → ป้าย origin ระบุสถานะนี้
import type { Block, Guideline } from './types';

const o = 'จากสรุปที่ผู้ใช้ส่งมา (GINA 2026) · ทบทวนโดยเภสัชกรแล้ว (ตามที่ผู้ใช้แจ้ง ยังไม่ระบุชื่อผู้ทบทวน) · ไม่มีเลขหน้า';

const blocks: Block[] = [
  { kind: 'kv', h: 'ผู้ใหญ่และวัยรุ่น — Track 1 (แนะนำเป็นอันดับแรก)', origin: o, sub: 'ICS-formoterol ขนาดต่ำเป็นยาสูดพ่นเมื่อมีอาการ (Reliever) ลดความเสี่ยงกำเริบรุนแรงได้ดีกว่า SABA ใช้ยาชนิดเดียว อุปกรณ์เดียว ขนาดเดียวตลอด (Step 1-4) · ไม่แนะนำ SABA เพียงอย่างเดียว', items: [
    { k: 'Step 1-2 (AIR-only)', v: 'ICS-formoterol ขนาดต่ำ เมื่อมีอาการเท่านั้น.' },
    { k: 'Step 3 (MART)', v: 'ICS-formoterol ขนาดต่ำ เป็นยา Maintenance ทุกวัน และใช้เมื่อมีอาการ (Reliever).' },
    { k: 'Step 4 (MART)', v: 'ICS-formoterol ขนาดปานกลางเป็น Maintenance (โดยเพิ่มจำนวนครั้งที่พ่น) และใช้ ICS-formoterol ขนาดต่ำเมื่อมีอาการ.' },
    { k: 'Step 5', v: 'อ้างอิงผู้เชี่ยวชาญเพื่อประเมิน Phenotype และพิจารณายาเพิ่มเติม เช่น LAMA หรือ Biologic therapy.' },
  ] },
  { kind: 'kv', h: 'ผู้ใหญ่และวัยรุ่น — Track 2 (ทางเลือก)', origin: o, sub: 'ใช้ ICS-SABA หรือ SABA เป็น Reliever เมื่อ Track 1 ทำไม่ได้ หรือผู้ป่วยอาการคงที่ ใช้ยาเดิมสม่ำเสมอโดยไม่กำเริบ · หากใช้ SABA เป็นยาแก้หอบ ต้องพิจารณาความร่วมมือในการใช้ยา Maintenance ด้วย', items: [
    { k: 'Step 1', v: 'ICS-SABA ขนาดต่ำ เมื่อมีอาการ หรือใช้ ICS ขนาดต่ำทันทีที่ใช้ SABA.' },
    { k: 'Step 2', v: 'ICS ขนาดต่ำทุกวัน (Maintenance) ร่วมกับ ICS-SABA หรือ SABA เมื่อมีอาการ.' },
    { k: 'Step 3', v: 'ICS-LABA ขนาดต่ำทุกวัน ร่วมกับ ICS-SABA หรือ SABA เมื่อมีอาการ.' },
    { k: 'Step 4', v: 'ICS-LABA ขนาดปานกลางทุกวัน ร่วมกับ ICS-SABA หรือ SABA เมื่อมีอาการ.' },
    { k: 'Step 5', v: 'อ้างอิงผู้เชี่ยวชาญเพื่อประเมิน Phenotype และพิจารณายาเพิ่มเติม.' },
  ] },
  { kind: 'kv', h: 'เด็กอายุ 6-11 ปี', origin: o, items: [
    { k: 'Step 1', v: 'ICS-formoterol ขนาดต่ำ หรือ ICS+SABA ขนาดต่ำ (หลอดเดียวกันหรือแยกหลอด) เมื่อมีอาการ.' },
    { k: 'Step 2', v: 'ICS ขนาดต่ำทุกวัน (Maintenance).' },
    { k: 'Step 3', v: 'ICS-LABA ขนาดต่ำ หรือ ICS ขนาดปานกลางทุกวัน หรือ ICS-formoterol ขนาดต่ำเป็น MART.' },
    { k: 'Step 4', v: 'ICS-LABA ขนาดปานกลางทุกวัน หรือ ICS-formoterol ขนาดต่ำเป็น MART (โดยเพิ่มขนาดยา Maintenance).' },
    { k: 'Step 5', v: 'อ้างอิงผู้เชี่ยวชาญเพื่อประเมิน Phenotype และพิจารณายาเพิ่มเติม เช่น LAMA หรือ Biologic therapy.' },
  ] },
  { kind: 'kv', h: 'กลุ่มยาที่ใช้รักษา', origin: o, items: [
    { k: 'Controller', v: 'ลดอาการและความเสี่ยงในอนาคต มักหมายถึงยาที่มี ICS ซึ่งลดการอักเสบของหลอดลม.' },
    { k: 'Reliever', v: 'บรรเทาอาการอย่างรวดเร็ว ได้แก่ Anti-inflammatory relievers (ICS-formoterol และ ICS-SABA) และ SABA. ไม่ควรใช้ ICS-formoterol เป็น Reliever หากผู้ป่วยใช้ Maintenance เป็น ICS-LABA ที่ไม่ใช่ formoterol.' },
    { k: 'Add-on therapies', v: 'สำหรับโรคหืดรุนแรง: Biologic therapy (Anti-IgE, Anti-IL5/5Ra, Anti-IL4Ra, Anti-TSLP), LAMA (เช่น Tiotropium), Azithromycin.' },
    { k: 'ขนาด ICS', v: 'GINA แบ่งเป็น ต่ำ/ปานกลาง/สูง (Low, Medium, High) แต่ละชนิดและอุปกรณ์ต่างกัน ควรตรวจสอบจากเอกสารกำกับยา.' },
  ] },
  { kind: 'kv', h: 'ข้อควรระวังเกี่ยวกับยา', origin: o, items: [
    { k: 'SABA', v: 'ไม่แนะนำ SABA เพียงอย่างเดียว หรือใช้ประจำทุกวัน (Regular SABA) เสี่ยงกำเริบรุนแรงและผลข้างเคียง. ใช้ SABA มากกว่า 3 หลอดต่อปี สัมพันธ์กับความเสี่ยงกำเริบที่เพิ่มขึ้น.' },
    { k: 'Oral corticosteroids (OCS)', v: 'ใช้ระยะยาวมีผลข้างเคียงรุนแรง ควรปรับยาสูดพ่นเพื่อลดการใช้ OCS ให้น้อยที่สุด (OCS stewardship).' },
    { k: 'LTRA', v: 'ประสิทธิภาพน้อยกว่า ICS และมีข้อกังวลเรื่องผลข้างเคียงทางระบบประสาทและจิตใจ (Neuropsychiatric adverse effects).' },
    { k: 'ยาขยายหลอดลมชนิดรับประทานและ Fenoterol', v: 'ไม่แนะนำ เนื่องจากเสี่ยงผลข้างเคียงสูงกว่ายาสูดพ่น.' },
  ] },
  { kind: 'list', h: 'นิยามและการวินิจฉัย', origin: o, items: [
    { t: 'โรคหืดเป็นโรคที่หลากหลาย (Heterogeneous) มักมีการอักเสบเรื้อรังของหลอดลม อาการ: เสียงวี้ด หอบเหนื่อย แน่นหน้าอก ไอ แปรผันตามเวลาและความรุนแรง ร่วมกับการจำกัดการไหลเวียนอากาศขณะหายใจออกที่เปลี่ยนแปลงได้ (Variable expiratory airflow).' },
    { t: 'ยืนยันด้วย Spirometry หรือ PEF เพื่อดู Variable expiratory airflow เช่น Bronchodilator responsiveness ก่อนเริ่มการรักษาด้วย ICS.' },
  ] },
  { kind: 'list', h: 'การประเมินผู้ป่วย', origin: o, items: [
    { t: 'Asthma control ประเมินจาก 1) การควบคุมอาการ (Symptom control) และ 2) ความเสี่ยงในอนาคต เช่น การกำเริบ ผลข้างเคียงของยา และการเสื่อมของสมรรถภาพปอด.' },
    { t: 'Asthma severity ประเมินย้อนหลังหลังได้รับยาอย่างน้อย 2-3 เดือน (Severe asthma คือควบคุมไม่ได้แม้ใช้ ICS-LABA ขนาดสูง). แนะนำหลีกเลี่ยงคำว่า "Mild asthma" เพราะอาจทำให้เข้าใจผิดว่าความเสี่ยงต่ำ.' },
  ] },
  { kind: 'list', h: 'การจัดการและการป้องกัน', origin: o, items: [
    { t: 'วงจร Assess, Adjust, Review อย่างต่อเนื่อง.' },
    { t: 'Shared decision-making: พิจารณา Health literacy, เทคนิคการพ่นยา, Adherence และเป้าหมายของผู้ป่วย.' },
    { t: 'แนวทางที่ไม่ใช้ยา: เลิกบุหรี่ ออกกำลังกาย ลดน้ำหนัก (ผู้ป่วยอ้วน) หลีกเลี่ยงปัจจัยกระตุ้นที่ทราบแน่ชัด.' },
    { t: 'วัคซีน: ไข้หวัดใหญ่, COVID-19, RSV, Pneumococcal, Pertussis.' },
  ] },
  { kind: 'list', h: 'ภาวะกำเริบเฉียบพลัน', origin: o, danger: true, items: [
    { t: 'ผู้ป่วยควรมี Written asthma action plan เพื่อจัดการตนเองเบื้องต้นเมื่อกำเริบ.' },
    { t: 'ใน Primary care/ER ประเมินความรุนแรง (Mild, Moderate, Severe, Life-threatening) ให้ SABA, ออกซิเจน (เป้าหมาย Saturation ≤ 95% สำหรับผู้ใหญ่ และ ≥ 92% สำหรับเด็ก ≤ 5 ปี), สเตียรอยด์ชนิดรับประทาน/ฉีด และ ICS-formoterol (สำหรับ Mild exacerbation).' },
    { t: 'หากมีอาการ Anaphylaxis ร่วมด้วย ต้องให้ Epinephrine เป็นอันดับแรก.' },
  ] },
];

export const ASTHMA_GUIDELINE: Guideline = {
  id: 'asthma', title: 'โรคหืด (Asthma)', category: 'โรคระบบทางเดินหายใจ', accent: '#7A4FD6', icon: '🌬️',
  keywords: ['asthma', 'หืด', 'GINA', 'ICS', 'formoterol', 'MART', 'SABA', 'LABA', 'LAMA', 'LTRA', 'AIR', 'reliever', 'controller', 'tiotropium', 'biologic'],
  source: 'GINA 2026',
  cites: ['Global Initiative for Asthma (GINA). Global Strategy for Asthma Management and Prevention — 2026 update'],
  review: { status: 'approved', reviewer: 'เภสัชกรโรงพยาบาล', reviewedAt: '2026-11-10', nextDue: '' },
  blocks,
  sections: [
    { title: 'ผู้ใหญ่/วัยรุ่น Track 1', blocks: [0] }, { title: 'Track 2', blocks: [1] }, { title: 'เด็ก 6-11 ปี', blocks: [2] },
    { title: 'กลุ่มยา', blocks: [3] }, { title: 'ข้อควรระวัง', blocks: [4] }, { title: 'วินิจฉัย/ประเมิน', blocks: [5, 6] },
    { title: 'จัดการ/ป้องกัน', blocks: [7] }, { title: 'ภาวะกำเริบ', blocks: [8] },
  ],
};
