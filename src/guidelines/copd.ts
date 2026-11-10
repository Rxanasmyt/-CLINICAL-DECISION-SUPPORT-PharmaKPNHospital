// แนวทางการรักษา COPD (GOLD 2026) — คัดจากสรุปที่ผู้ใช้ส่งมาเป็นข้อความ คงถ้อยคำเดิม (แปลงสัญลักษณ์ ≥ และ µL เท่านั้น)
// ไม่มีเลขหน้า · ผู้ใช้แจ้งว่าเภสัชกรทบทวนแล้ว → ป้าย origin ระบุสถานะนี้
import type { Block, Guideline } from './types';

const o = 'จากสรุปที่ผู้ใช้ส่งมา (GOLD 2026) · ทบทวนโดยเภสัชกรแล้ว (ตามที่ผู้ใช้แจ้ง ยังไม่ระบุชื่อผู้ทบทวน) · ไม่มีเลขหน้า';

const blocks: Block[] = [
  { kind: 'kv', h: 'การเริ่มยาตามกลุ่ม GOLD ABE', origin: o, sub: 'พิจารณาจากอาการ (mMRC, CAT) และประวัติการกำเริบในปีก่อนหน้า', items: [
    { k: 'Group A', v: 'อาการน้อย ไม่ค่อยกำเริบ: ให้ยาขยายหลอดลมชนิดใดก็ได้ (A bronchodilator).' },
    { k: 'Group B', v: 'อาการมาก ไม่ค่อยกำเริบ: LABA + LAMA. การใช้ยาแบบหลอดเดียว (Single inhaler therapy) อาจสะดวกและมีประสิทธิภาพดีกว่าการใช้หลายหลอด.' },
    { k: 'Group E', v: 'กำเริบระดับปานกลาง/รุนแรง ≥ 1 ครั้งในปีก่อนหน้า: LABA + LAMA. พิจารณา LABA + LAMA + ICS ตั้งแต่เริ่มต้นได้ หาก Eosinophil ในเลือด ≥ 300 cells/µL.' },
  ] },
  { kind: 'kv', h: 'ปรับยาเมื่อติดตามผล — ปัญหาหอบเหนื่อยเป็นหลัก', origin: o, items: [
    { k: 'เดิมใช้ LABA หรือ LAMA ตัวเดียว', v: 'ปรับเป็น LABA + LAMA.' },
    { k: 'เดิมใช้ LABA + LAMA อยู่แล้ว', v: 'พิจารณาเปลี่ยนชนิดอุปกรณ์/ตัวยา (Inhaler device/molecules) หรือเพิ่มการรักษาที่ไม่ใช้ยา. พิจารณาเพิ่ม Ensifentrine ได้.' },
  ] },
  { kind: 'kv', h: 'ปรับยาเมื่อติดตามผล — ปัญหาการกำเริบเป็นหลัก', origin: o, items: [
    { k: 'เดิมใช้ LABA หรือ LAMA ตัวเดียว', v: 'ดู Eosinophil: < 300 เปลี่ยนเป็น LABA + LAMA · ≥ 300 เปลี่ยนเป็น LABA + LAMA + ICS ได้.' },
    { k: 'ใช้ LABA + LAMA แล้วยังกำเริบ', v: 'Eosinophil ≥ 100 ปรับเป็น LABA + LAMA + ICS.' },
    { k: 'ใช้ LABA + LAMA และ Eosinophil < 100', v: 'พิจารณา Roflumilast (เฉพาะ FEV1 < 50% และมีภาวะหลอดลมอักเสบเรื้อรัง) หรือ Azithromycin (แนะนำเป็นพิเศษในผู้ที่เลิกบุหรี่แล้ว).' },
    { k: 'ใช้ LABA + LAMA + ICS แล้วยังกำเริบรุนแรง', v: 'พิจารณายาชีววัตถุ (Biologic Therapy).' },
  ] },
  { kind: 'drug', h: 'ยาชีววัตถุ (Biologic Therapy)', origin: o, items: [
    { d: 'Dupilumab', dose: '300 mg ทุก 2 สัปดาห์', max: '-', ae: '-', mon: 'ข้อบ่งชี้: กำเริบรุนแรง (Severe 1 ครั้ง หรือปานกลาง 2 ครั้ง) ที่ Eosinophil ≥ 300 ร่วมกับ Chronic bronchitis' },
    { d: 'Mepolizumab', dose: '100 mg ทุก 4 สัปดาห์', max: '-', ae: '-', mon: 'ทางเลือกสำหรับผู้ที่มีการกำเริบและ Eosinophil ≥ 300' },
  ] },
  { kind: 'kv', h: 'ข้อบ่งชี้และข้อห้ามในการเพิ่ม ICS', origin: o, items: [
    { k: 'สนับสนุนให้ใช้ (Strongly favors)', v: 'เคยกำเริบจนต้องเข้าโรงพยาบาล · กำเริบระดับปานกลาง ≥ 2 ครั้งต่อปี · Eosinophil ≥ 300 cells/µL · มีประวัติโรคหืดร่วมด้วย.' },
    { k: 'ห้ามใช้ (Against use)', v: 'ปอดอักเสบ (Pneumonia) บ่อยครั้ง · Eosinophil < 100 cells/µL · มีประวัติติดเชื้อ Mycobacterial.' },
  ] },
  { kind: 'kv', h: 'การจัดการยาในภาวะกำเริบ', origin: o, items: [
    { k: 'ยาขยายหลอดลม', v: 'SABAs เดี่ยวๆ หรือร่วมกับ Short-acting anticholinergics เป็นยาเริ่มต้นสำหรับการกำเริบระดับปานกลางถึงรุนแรง.' },
    { k: 'Systemic corticosteroids', v: 'ใช้สูงสุดไม่เกิน 5 วัน สำหรับการกำเริบระดับปานกลางถึงรุนแรง.' },
    { k: 'ยาปฏิชีวนะ', v: 'ใช้ 5 วัน ในผู้ป่วยที่มีเสมหะเป็นหนอง (Purulent sputum) หรือมีประวัติการติดเชื้อในปอด.' },
    { k: 'ข้อห้าม', v: 'ไม่แนะนำ Methylxanthines เนื่องจากมีผลข้างเคียงสูง.' },
    { k: 'ยาเดิม/ยาบำรุงรักษา', v: 'เริ่ม Maintenance therapy ด้วย LABDs ให้เร็วที่สุด และหากกำเริบปานกลาง/รุนแรง ≥ 1 ครั้งร่วมกับ Eosinophil สูง ควรพิจารณาเพิ่ม ICS ก่อนจำหน่ายออกจากโรงพยาบาล.' },
  ] },
  { kind: 'kv', h: 'วัคซีน', origin: o, items: [
    { k: 'Influenza', v: 'ฉีดทุกปี.' },
    { k: 'Pneumococcal', v: 'PCV20 หรือ PCV21 จำนวน 1 เข็ม.' },
    { k: 'RSV', v: 'ฉีดในผู้ป่วยอายุ ≥ 50 ปี.' },
    { k: 'อื่นๆ', v: 'Tdap · Zoster (อายุ ≥ 50 ปี) · COVID-19 ตามแนวทางของพื้นที่.' },
  ] },
  { kind: 'list', h: 'การวินิจฉัยและเครื่องมือ GOLD ABE', origin: o, items: [
    { t: 'COPD คือภาวะที่ทางเดินหายใจ/ถุงลมผิดปกติ ทำให้เกิดการอุดกั้นของหลอดลมอย่างถาวร.' },
    { t: 'เกณฑ์วินิจฉัย: Spirometry โดย Post-bronchodilator FEV1/FVC < 0.7.' },
    { t: 'ประเมินเริ่มต้น 4 ส่วน: 1) ความรุนแรงของการอุดกั้น (FEV1) 2) อาการ (CAT หรือ mMRC) 3) ประวัติการกำเริบ 4) ระดับ Eosinophil.' },
  ] },
  { kind: 'kv', h: 'ความรุนแรงของภาวะกำเริบ (Rome classification)', origin: o, items: [
    { k: 'เบา (Mild)', v: 'เหนื่อย VAS < 5 · RR < 24 ครั้ง/นาที · HR < 95 ครั้ง/นาที · SaO2 ≥ 92% · CRP < 10 mg/L.' },
    { k: 'ปานกลาง (Moderate)', v: 'เข้าเกณฑ์อย่างน้อย 3 ใน 5 ข้อ: VAS ≥ 5 · RR ≥ 24 · HR ≥ 95 · SaO2 < 92% · CRP ≥ 10 mg/L.' },
    { k: 'รุนแรง (Severe)', v: 'อาการเหมือนระดับปานกลาง แต่มี Hypoxemia (PaO2 ≤ 60 mmHg) และ/หรือ Hypercapnia และ Acidosis (PaCO2 > 45 mmHg และ pH < 7.35).' },
  ] },
  { kind: 'list', h: 'การรักษาที่ไม่ใช้ยา', origin: o, items: [
    { t: 'เลิกบุหรี่สำคัญที่สุด แนะนำให้ใช้ยาช่วยเลิกบุหรี่ร่วมกับการให้คำปรึกษา.' },
    { t: 'ผู้ป่วย Group B และ E ควรได้รับกายภาพบำบัดฟื้นฟูปอด (Pulmonary rehabilitation).' },
    { t: 'ไม่แนะนำ LTOT เป็นประจำในผู้ป่วยที่ขาดออกซิเจนเพียงระดับปานกลาง แต่ช่วยเพิ่มอัตรารอดชีวิตในผู้ป่วย Hypoxemia รุนแรงขณะพัก.' },
    { t: 'NIV มีประโยชน์ในผู้ป่วยที่มี Hypercapnia ในช่วงกลางวันอย่างชัดเจน.' },
  ] },
];

export const COPD_GUIDELINE: Guideline = {
  id: 'copd', title: 'โรคปอดอุดกั้นเรื้อรัง (COPD)', category: 'โรคระบบทางเดินหายใจ',
  keywords: ['copd', 'ปอดอุดกั้น', 'GOLD', 'LABA', 'LAMA', 'ICS', 'eosinophil', 'dupilumab', 'mepolizumab', 'roflumilast', 'azithromycin', 'ensifentrine', 'inhaler'],
  source: 'GOLD Report 2026 (สรุปที่ผู้ใช้ส่งมา · ทบทวนโดยเภสัชกรแล้วตามที่ผู้ใช้แจ้ง)',
  cites: ['Global Initiative for Chronic Obstructive Lung Disease (GOLD). Global Strategy for the Diagnosis, Management, and Prevention of COPD — 2026 Report — เนื้อหาคัดจากสรุปข้อความที่ผู้ใช้ส่งมา ไม่มีเลขหน้า · ทบทวนโดยเภสัชกรแล้ว (ตามที่ผู้ใช้แจ้ง ยังไม่ระบุชื่อผู้ทบทวน)'],
  review: { status: 'approved', reviewer: 'เภสัชกรของ รพ. (ผู้ใช้แจ้งว่าทบทวนแล้ว — รอระบุชื่อ)', reviewedAt: '2026-11-10', nextDue: '' },
  blocks,
  sections: [
    { title: 'เริ่มยา', blocks: [0] }, { title: 'ปรับยา', blocks: [1, 2] }, { title: 'ยาชีววัตถุ', blocks: [3] },
    { title: 'ICS', blocks: [4] }, { title: 'ภาวะกำเริบ', blocks: [5, 8] }, { title: 'วัคซีน', blocks: [6] },
    { title: 'วินิจฉัย', blocks: [7] }, { title: 'ไม่ใช้ยา', blocks: [9] },
  ],
};
