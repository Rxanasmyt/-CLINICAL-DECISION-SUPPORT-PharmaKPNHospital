// ปอดอักเสบชุมชนในผู้ใหญ่ — คัดจาก ATS/IDSA 2019 (Metlay JP, et al. Am J Respir Crit Care Med 2019;200(7):e45-e67) ผ่านบทสรุปของ AAFP (Am Fam Physician 2020;102(2):121-122)
// ขนาดยา/ทางให้ยาตามตารางในบทสรุป คงชื่อยาและตัวเลขตามต้นฉบับ · ยังไม่ได้ตรวจกับต้นฉบับ ATS/IDSA โดยตรง และยังไม่ได้ปรับตามข้อมูลเชื้อดื้อยา/แนวทางของไทย
import type { Block, Guideline } from './types';

const o = 'จากบทสรุป AAFP ของแนวทาง ATS/IDSA 2019 — ยังไม่ได้ปรับตามบริบทไทย รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'list', h: 'ความรุนแรง และการตัดสินใจรับไว้รักษา', origin: o, items: [
    { t: 'ใช้ Pneumonia Severity Index (PSI) ตัดสินว่าควรนอนโรงพยาบาลหรือไม่ (ดีกว่า CURB-65 ตามหลักฐานคุณภาพต่ำ) ร่วมกับดุลยพินิจ' },
    { t: 'CAP รุนแรง = มีเกณฑ์หลัก 1 ข้อ หรือเกณฑ์รอง ≥ 3 ข้อ' },
    { t: 'เกณฑ์หลัก: ระบบหายใจล้มเหลวต้องใช้เครื่องช่วยหายใจ · ช็อกรุนแรงต้องใช้ vasopressor' },
    { t: 'เกณฑ์รอง: BUN ≥ 20 mg/dL · สับสน/disorientation · อุณหภูมิ < 36°C · ความดันต่ำต้องให้สารน้ำมาก · multilobar infiltrates · PaO2/FiO2 ≤ 250 · เกล็ดเลือด < 100 × 10³/µL · RR ≥ 30/นาที · WBC < 4,000/µL (จากการติดเชื้อ)' },
  ] },
  { kind: 'kv', h: 'ผู้ป่วยนอก — ยาปฏิชีวนะเริ่มต้น (empiric)', origin: o, sub: 'ระยะเวลา ≥ 5 วันทุกสูตร แล้วประเมินสัญญาณชีพ การกิน และความรู้สึกตัวก่อนหยุด · ไม่แนะนำ macrolide เดี่ยวเป็นประจำ', items: [
    { k: 'ไม่มีโรคร่วม และไม่มีปัจจัยเสี่ยง MRSA/Pseudomonas', v: 'Amoxicillin 1,000 mg ทุก 8 ชม. หรือ Doxycycline 100 mg ทุก 12 ชม. หรือ Macrolide (เมื่อเชื้อ pneumococcus ดื้อในพื้นที่ < 25%): Azithromycin 500 mg วันแรก แล้ว 250 mg/วัน · Clarithromycin 500 mg ทุก 12 ชม. · Clarithromycin XR 1,000 mg/วัน' },
    { k: 'มีโรคร่วม (ติดสุรา, ไม่มีม้าม, เบาหวาน, มะเร็ง, โรคเรื้อรังของหัวใจ/ปอด/ตับ/ไต) — ทางเลือก 1: ยาผสม', v: 'Amoxicillin/clavulanate (500/125 mg ทุก 8 ชม., 875/125 mg ทุก 12 ชม. หรือ 2,000/125 mg ทุก 12 ชม.) หรือ Cefpodoxime 200 mg ทุก 12 ชม. หรือ Cefuroxime axetil 500 mg ทุก 12 ชม. ร่วมกับ Azithromycin (500 mg วันแรก แล้ว 250 mg/วัน) หรือ Clarithromycin 500 mg ทุก 12 ชม. หรือ Doxycycline 100 mg ทุก 12 ชม. หรือ Clarithromycin XR 1,000 mg/วัน' },
    { k: 'มีโรคร่วม — ทางเลือก 2: Respiratory fluoroquinolone เดี่ยว', v: 'Gemifloxacin 320 mg/วัน หรือ Levofloxacin 750 mg/วัน หรือ Moxifloxacin 400 mg/วัน' },
    { k: 'ปัจจัยเสี่ยง MRSA/P. aeruginosa', v: 'เคยตรวจพบเชื้อ MRSA หรือ P. aeruginosa จากทางเดินหายใจ หรือเคยนอนโรงพยาบาลและได้ยาปฏิชีวนะชนิดฉีดภายใน 90 วัน' },
  ] },
  { kind: 'kv', h: 'ผู้ป่วยใน — ยาปฏิชีวนะเริ่มต้น', origin: o, sub: 'ระยะเวลา ≥ 5 วันทุกสูตร และต้องคงที่ทางคลินิกก่อนหยุด · เพิ่มยาคลุม MRSA/P. aeruginosa เฉพาะเมื่อมีปัจจัยเสี่ยงที่ยืนยันในพื้นที่', items: [
    { k: 'ไม่รุนแรง ไม่มีปัจจัยเสี่ยง MRSA/Pseudomonas', v: 'Beta-lactam: Ampicillin/sulbactam 1.5–3 g IV ทุก 6 ชม. หรือ Cefotaxime 1–2 g IV ทุก 8 ชม. หรือ Ceftaroline 600 mg IV ทุก 12 ชม. หรือ Ceftriaxone 1–2 g IV วันละครั้ง ร่วมกับ Azithromycin 500 mg กิน/IV วันละครั้ง หรือ Clarithromycin 500 mg กินทุก 12 ชม. · หรือ Respiratory fluoroquinolone เดี่ยว: Levofloxacin 750 mg กิน/IV วันละครั้ง หรือ Moxifloxacin 400 mg กิน/IV วันละครั้ง' },
    { k: 'ไม่รุนแรง และห้ามใช้ macrolide และ fluoroquinolone', v: 'Beta-lactam (Ampicillin/sulbactam, Cefotaxime, Ceftaroline หรือ Ceftriaxone ขนาดเดียวกับข้างบน) ร่วมกับ Doxycycline 100 mg กิน/IV ทุก 12 ชม.' },
    { k: 'รุนแรง ไม่มีปัจจัยเสี่ยง MRSA/Pseudomonas', v: 'Beta-lactam (Ampicillin/sulbactam, Cefotaxime, Ceftaroline หรือ Ceftriaxone ขนาดเดียวกับข้างบน) ร่วมกับ Azithromycin 500 mg กิน/IV วันละครั้ง หรือ Clarithromycin 500 mg กินทุก 12 ชม. หรือ Levofloxacin 750 mg กิน/IV วันละครั้ง หรือ Moxifloxacin 400 mg กิน/IV วันละครั้ง' },
    { k: 'รุนแรง และมีปัจจัยเสี่ยง MRSA', v: 'เพิ่ม Linezolid 600 mg กิน/IV ทุก 12 ชม. หรือ Vancomycin 15 mg/kg IV ทุก 12 ชม. (ปรับตามระดับยา)' },
    { k: 'รุนแรง และมีปัจจัยเสี่ยง P. aeruginosa', v: 'เพิ่มหนึ่งในยา: Aztreonam 2 g IV ทุก 8 ชม. · Cefepime 2 g IV ทุก 8 ชม. · Ceftazidime 2 g IV ทุก 8 ชม. · Imipenem/cilastatin 500 mg IV ทุก 6 ชม. · Meropenem 1 g IV ทุก 8 ชม. · Piperacillin/tazobactam 4.5 g IV ทุก 6 ชม.' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังและการใช้ยา', origin: o, danger: true, items: [
    { t: 'ไม่แนะนำ macrolide เดี่ยวเป็นประจำ ยกเว้นพื้นที่ที่ pneumococcus ดื้อ macrolide ต่ำ (< 25%) · อัตราดื้อในสหรัฐเกิน 30% ทำให้เกิดการรักษาล้มเหลว' },
    { t: 'การเลือกยาให้ชั่งน้ำหนักข้อมูลความไวต่อยาในพื้นที่ กับลักษณะผู้ป่วย: แพ้ยา, ความเสี่ยงหัวใจเต้นผิดจังหวะ (macrolide), โรคหลอดเลือด (fluoroquinolone), ประวัติ Clostridioides difficile' },
    { t: 'ไม่แนะนำให้ใช้ corticosteroid เป็นประจำใน CAP หรือปอดอักเสบจากไข้หวัดใหญ่รุนแรง' },
    { t: 'ไม่แนะนำให้เติมยาคลุมเชื้อไม่ใช้ออกซิเจน (anaerobe) เว้นแต่สงสัยฝีในปอดหรือ empyema' },
    { t: 'Procalcitonin ไม่แม่นพอที่จะใช้ตัดสินงดยาปฏิชีวนะในผู้ที่สงสัย CAP' },
    { t: 'Omadacycline เทียบเท่า moxifloxacin ใน CAP ไม่รุนแรง แต่คณะกรรมการไม่ได้ใส่ในรายการแนะนำเพราะข้อมูลความปลอดภัยยังไม่มากพอ' },
  ] },
  { kind: 'list', h: 'การตรวจและยาต้านไวรัส', origin: o, items: [
    { t: 'ไม่ต้องเพาะเชื้อเลือด/เสมหะ และไม่ต้องตรวจ urinary antigen เป็นประจำใน CAP ไม่รุนแรง' },
    { t: 'เพาะเชื้อเสมหะก่อนเริ่มยาเฉพาะ CAP รุนแรง (โดยเฉพาะใส่ท่อช่วยหายใจ), มีประวัติ MRSA/P. aeruginosa หรือกำลังให้ยาคลุมเชื้อเหล่านี้, หรือเคยนอนโรงพยาบาลและได้ยาฉีดภายใน 90 วัน' },
    { t: 'ช่วงที่ไข้หวัดใหญ่ระบาด ควรตรวจไข้หวัดใหญ่ในผู้ป่วย CAP ทุกราย (ชอบ rapid NAAT มากกว่า rapid antigen)' },
    { t: 'ให้ยาต้านไวรัสไข้หวัดใหญ่ในผู้ใหญ่ CAP ที่ตรวจพบไข้หวัดใหญ่ ไม่ว่าอาการมานานเท่าใดและอยู่ที่ใด (ประโยชน์มากที่สุดถ้าเริ่มภายใน 48 ชั่วโมง)' },
  ] },
];

export const CAP_GUIDELINE: Guideline = {
  id: 'cap', title: 'ปอดอักเสบชุมชนในผู้ใหญ่ (CAP)', category: 'โรคติดเชื้อ', accent: '#1F9D8A', icon: '💊',
  keywords: ['ปอดอักเสบ', 'pneumonia', 'CAP', 'amoxicillin', 'doxycycline', 'azithromycin', 'ceftriaxone', 'levofloxacin', 'moxifloxacin', 'MRSA', 'pseudomonas', 'vancomycin', 'ยาปฏิชีวนะ', 'antibiotic'],
  drugs: [
    { name: 'Amoxicillin / Amoxicillin-clavulanate', aliases: ['Amoxicillin', 'Amoxicillin/clavulanate'] }, { name: 'Doxycycline', aliases: ['Doxycycline'] },
    { name: 'Macrolides (Azithromycin / Clarithromycin)', aliases: ['Macrolide', 'macrolides', 'Azithromycin', 'Clarithromycin'] },
    { name: 'Cephalosporins (Ceftriaxone, Cefotaxime, Ceftaroline, Cefpodoxime, Cefuroxime, Cefepime, Ceftazidime)', aliases: ['Ceftriaxone', 'Cefotaxime', 'Ceftaroline', 'Cefpodoxime', 'Cefuroxime', 'Cefepime', 'Ceftazidime'] },
    { name: 'Ampicillin/sulbactam', aliases: ['Ampicillin/sulbactam'] },
    { name: 'Respiratory fluoroquinolones', aliases: ['fluoroquinolone', 'Levofloxacin', 'Moxifloxacin', 'Gemifloxacin'] },
    { name: 'Vancomycin / Linezolid (MRSA)', aliases: ['Vancomycin', 'Linezolid', 'MRSA'] },
    { name: 'ยาคลุม P. aeruginosa', aliases: ['Aztreonam', 'Imipenem', 'Meropenem', 'Piperacillin', 'aeruginosa'] },
    { name: 'Corticosteroid', aliases: ['corticosteroid'] }, { name: 'ยาต้านไวรัสไข้หวัดใหญ่', aliases: ['ยาต้านไวรัส'] },
  ],
  source: 'ATS/IDSA 2019 CAP guideline · สรุปโดย AAFP',
  cites: [
    'Metlay JP, Waterer GW, Long AC, et al. Diagnosis and treatment of adults with community-acquired pneumonia. An official clinical practice guideline of the ATS and IDSA. Am J Respir Crit Care Med. 2019;200(7):e45-e67. doi:10.1164/rccm.201908-1581ST',
    'Am Fam Physician (AFP Editors). Community-acquired pneumonia: updated recommendations from the ATS and IDSA. 2020;102(2):121-122 · https://www.aafp.org/pubs/afp/issues/2020/0715/p121.html — บทสรุปที่ใช้อ่านเนื้อหาในการ์ดนี้ (ตารางที่ 1–3)',
    'ข้อจำกัด: แนวทางนี้สำหรับผู้ใหญ่ภูมิคุ้มกันปกติในสหรัฐ จัดทำก่อนโควิด-19 และไม่ได้ปรับตามข้อมูลเชื้อดื้อยาของไทย · ยังไม่ได้เทียบกับแนวทางไทยของสมาคมโรคติดเชื้อ (ค้นไม่พบฉบับเต็มที่เข้าถึงได้)',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [{ title: 'ความรุนแรง', blocks: [0] }, { title: 'ผู้ป่วยนอก', blocks: [1] }, { title: 'ผู้ป่วยใน', blocks: [2] }, { title: 'ข้อควรระวัง', blocks: [3] }, { title: 'การตรวจ/ต้านไวรัส', blocks: [4] }],
};
