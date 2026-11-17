// การติดเชื้อ Clostridioides difficile (CDI): การเลือกยา การป้องกันกลับเป็นซ้ำ และยาที่ไม่แนะนำ
// คัดจาก "Recommendations for the diagnosis and treatment of Clostridioides difficile infection" (Bouza E, et al. แนวทางสเปน — SEQ, SEMI และกลุ่มงาน SEDAR; Rev Esp Quimioter 2020; doi:10.37201/req/2065.2020; PMC7111242; open access)
// เป็นความเห็นของคณะผู้เชี่ยวชาญ (ไม่ได้จัดระดับหลักฐานรายข้อ) · แนวทางต่างประเทศ ไม่ได้ปรับตามบริบทไทย · สรุปเป็นไทย · รอเภสัชกรทบทวน
import type { Block, Guideline } from './types';

const o = 'แนวทางต่างประเทศ (สเปน 2020, ความเห็นผู้เชี่ยวชาญ, open access) ไม่ได้ปรับตามบริบทไทย — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'การเลือกยาครั้งแรก', origin: o, sub: 'สรุปข้อ 10–12, 20 และคำถามที่ 11, 20', items: [
    { k: 'ประคับประคอง', v: 'ให้สารน้ำและเกลือแร่ · หยุดยาลดการเคลื่อนไหวของลำไส้ ยาลดกรด (รวม PPI) และยาปฏิชีวนะที่ให้ร่วมเมื่อทำได้' },
    { k: 'ครั้งแรก ความเสี่ยงกลับเป็นซ้ำต่ำ', v: 'Vancomycin กิน 125 mg วันละ 4 ครั้ง นาน 10 วัน · การเลือกยาอิงความเสี่ยงกลับเป็นซ้ำ ไม่ได้อิงความรุนแรงของครั้งแรก' },
    { k: 'ครั้งแรก ความเสี่ยงกลับเป็นซ้ำสูง', v: 'Vancomycin กิน 125 mg วันละ 4 ครั้ง นาน 10 วัน + Bezlotoxumab 10 mg/kg IV ครั้งเดียว · หรือ Fidaxomicin 200 mg วันละ 2 ครั้ง นาน 10 วัน (ราคาสูง) · ผู้ที่ความเสี่ยงสูงควรได้ยาแบบลดขนาดค่อยเป็นค่อยไปหรือแบบยืดเวลา' },
    { k: 'ติดเชื้อรุนแรง', v: 'Vancomycin กินหรือ Fidaxomicin ได้ผลใกล้เคียงกัน · ไม่แนะนำให้ใช้ vancomycin ร่วมกับ metronidazole ในผู้ป่วยรุนแรง ยกเว้นกรณีรุนแรงที่มี ileus' },
    { k: 'Metronidazole', v: 'จำกัดใช้เมื่อ vancomycin/fidaxomicin มีข้อห้ามหรือกินไม่ได้ (ให้แบบฉีดเข้าหลอดเลือดดำ) — ไม่แนะนำเป็นยาแนวแรกแม้ในรายไม่รุนแรง' },
    { k: 'ยาที่ยังไม่ใช่ทางเลือก', v: 'Rifaximin, nitazoxanide, fusidic acid, tigecycline และ teicoplanin ยังไม่ถือเป็นทางเลือกรักษา CDI · Intravenous immunoglobulin ไม่แนะนำเป็นการรักษาเสริม · Probiotics ไม่แนะนำให้ใช้ป้องกันหรือรักษาเสริมทั่วไป' },
  ] },
  { kind: 'kv', h: 'กลับเป็นซ้ำ (recurrence) และการป้องกัน', origin: o, sub: 'สรุปข้อ 13–16, 21–22 · กลับเป็นซ้ำ = เกิดซ้ำภายใน 8 สัปดาห์หลังหายจากครั้งก่อน', items: [
    { k: 'หลักการ', v: 'ทุกครั้งที่กลับเป็นซ้ำถือว่าเสี่ยงกลับเป็นซ้ำอีกสูง · เสนอ FMT (อุจจาระปลูกถ่าย) ให้ผู้ที่กลับเป็นซ้ำหลายครั้ง โดยเฉพาะที่ล้มเหลวหลังได้ vancomycin หรือ fidaxomicin แบบลดขนาด · ควรหยุดปัจจัยเสี่ยงกลับเป็นซ้ำเมื่อทำได้ (เช่นยาปฏิชีวนะอื่นที่ใช้ต่อเนื่อง)' },
    { k: 'Vancomycin แบบลดขนาดค่อยเป็นค่อยไป (taper)', v: 'Vancomycin กิน 125 mg วันละ 4 ครั้ง นาน 10–14 วัน แล้วลดขนาดลงในเวลา 2 สัปดาห์ จากนั้นให้แบบ pulse 125 mg ทุก 2–3 วัน นาน 2–8 สัปดาห์' },
    { k: 'Fidaxomicin แบบยืดเวลา (extended-pulsed)', v: 'Fidaxomicin กิน 200 mg วันละ 2 ครั้ง วันที่ 1–5 แล้ววันละครั้ง วันเว้นวัน วันที่ 7–25' },
    { k: 'Bezlotoxumab', v: 'ยาแอนติบอดีป้องกันกลับเป็นซ้ำ ลดการกลับเป็นซ้ำเทียบยาหลอก (ร้อยละ 17 เทียบ 28 ใน MODIFY I และร้อยละ 16 เทียบ 26 ใน MODIFY II) · ให้ขนาด 10 mg/kg IV ครั้งเดียวร่วมกับยาปฏิชีวนะ ในผู้ที่เสี่ยงกลับเป็นซ้ำสูง' },
    { k: 'Vancomycin ป้องกัน (เลือกใช้เฉพาะราย)', v: 'ผู้ที่เคยกลับเป็นซ้ำและกำลังจะได้ยาปฏิชีวนะระบบอื่นอีก อาจพิจารณา Vancomycin กิน 125 mg วันละครั้ง ระหว่างที่ใช้ยาปฏิชีวนะและต่ออีกไม่เกิน 5 วันหลังครบ · ไม่แนะนำให้ใช้เป็นประจำทั่วไป' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังด้านยา', origin: o, danger: true, items: [
    { t: 'แนวทางนี้เป็นความเห็นของคณะผู้เชี่ยวชาญในสเปน ไม่ได้ให้ระดับหลักฐานรายข้อ และเขียนก่อนที่ยาบางตัวจะมีใช้ในไทย (fidaxomicin, bezlotoxumab) ให้ตรวจว่ามียาในโรงพยาบาลหรือไม่ก่อนนำไปใช้' },
    { t: 'หยุดยาปฏิชีวนะอื่นที่ไม่จำเป็น และทบทวนความจำเป็นของยา PPI ในผู้ป่วย CDI (ยาเหล่านี้เป็นปัจจัยเสี่ยง)' },
    { t: 'ไม่ใช้ยาลดการเคลื่อนไหวของลำไส้ (antiperistaltic agents) ในผู้ป่วย CDI' },
    { t: 'ผู้ที่ไม่ตอบสนองต่อการรักษาภายใน 24–48 ชม. ควรประเมินโดยศัลยแพทย์ (พิจารณา loop ileostomy และการล้างลำไส้ใหญ่ในรายรุนแรงหรือ fulminant ที่ไม่ตอบสนองต่อยา)' },
    { t: 'ต้นฉบับไม่ได้ระบุขนาดยา metronidazole ฉีด และเกณฑ์ปรับขนาดตามไต ให้ดูฉลากยาและข้อมูลอ้างอิงยา' },
  ] },
];

export const CDI_GUIDELINE: Guideline = {
  id: 'cdi', title: 'ท้องเสียจาก Clostridioides difficile (CDI): ยาและการป้องกันกลับเป็นซ้ำ', category: 'โรคติดเชื้อ', accent: '#0F766E', icon: '🦠',
  keywords: ['Clostridioides difficile', 'Clostridium difficile', 'C. difficile', 'CDI', 'ท้องเสีย', 'pseudomembranous', 'vancomycin', 'fidaxomicin', 'metronidazole', 'bezlotoxumab', 'FMT', 'PPI', 'recurrence'],
  drugs: [
    { name: 'Vancomycin (กิน)', group: 'ยารักษา CDI', aliases: ['Vancomycin'] }, { name: 'Fidaxomicin', group: 'ยารักษา CDI', aliases: ['Fidaxomicin'] }, { name: 'Metronidazole', group: 'ยารักษา CDI', aliases: ['Metronidazole'] },
    { name: 'Bezlotoxumab', group: 'ยาป้องกันกลับเป็นซ้ำ', aliases: ['Bezlotoxumab'] }, { name: 'Probiotics', group: 'ยาป้องกันกลับเป็นซ้ำ', aliases: ['Probiotics'] },
    { name: 'Tigecycline', group: 'ยาที่ไม่แนะนำ', aliases: ['Tigecycline'] }, { name: 'Teicoplanin', group: 'ยาที่ไม่แนะนำ', aliases: ['Teicoplanin'] }, { name: 'Rifaximin', group: 'ยาที่ไม่แนะนำ', aliases: ['Rifaximin'] },
  ],
  source: 'แนวทางสเปน 2020: Clostridioides difficile infection (ความเห็นผู้เชี่ยวชาญ) · แนวทางต่างประเทศ',
  cites: [
    'Bouza E, Aguado JM, Alcalá L, et al. Recommendations for the diagnosis and treatment of Clostridioides difficile infection: an official clinical practice guideline of the Spanish Society of Chemotherapy (SEQ), Spanish Society of Internal Medicine (SEMI) and the working group of Postoperative Infection of the Spanish Society of Anesthesia and Reanimation (SEDAR). Rev Esp Quimioter. 2020. doi:10.37201/req/2065.2020 · PMC7111242 · open access · https://pmc.ncbi.nlm.nih.gov/articles/PMC7111242/',
    'สรุปเป็นภาษาไทยจากข้อสรุป 22 ข้อและคำถามที่ 11, 14, 20–22 ของบทความ (ไม่มีเลขหน้าพิมพ์ อ้างตามข้อ) · เป็นความเห็นของคณะผู้เชี่ยวชาญ ไม่ได้จัดระดับหลักฐานรายข้อ',
    'ยังไม่ครอบคลุม: การวินิจฉัยทางห้องปฏิบัติการ (ข้อ 1–9) การควบคุมการติดเชื้อในโรงพยาบาล และรายละเอียดการผ่าตัด · ไม่ได้ปรับตามยาที่มีใช้ในไทย ต้องตรวจว่ามียาในโรงพยาบาลก่อนใช้',
  ],
  summary: [
    'ประคับประคอง: สารน้ำและเกลือแร่ · หยุดยาลดการเคลื่อนไหวลำไส้ ยาลดกรด (PPI) และยาปฏิชีวนะที่ให้ร่วมเมื่อทำได้',
    'ครั้งแรก ความเสี่ยงกลับเป็นซ้ำต่ำ: Vancomycin กิน 125 mg วันละ 4 ครั้ง นาน 10 วัน',
    'ครั้งแรก ความเสี่ยงกลับเป็นซ้ำสูง: Vancomycin 125 mg วันละ 4 ครั้ง 10 วัน + Bezlotoxumab 10 mg/kg IV ครั้งเดียว หรือ Fidaxomicin 200 mg วันละ 2 ครั้ง 10 วัน',
    'Metronidazole เฉพาะเมื่อ vancomycin/fidaxomicin ใช้ไม่ได้หรือกินไม่ได้ (ฉีด) · ไม่ใช้ vancomycin ร่วม metronidazole ในรายรุนแรง ยกเว้นมี ileus',
    'กลับเป็นซ้ำ: FMT เป็นทางเลือกหลักเมื่อกลับเป็นซ้ำหลายครั้ง · หรือ Vancomycin taper/pulse หรือ Fidaxomicin 200 mg วันละ 2 ครั้ง วันที่ 1–5 แล้ววันเว้นวัน วันที่ 7–25',
    'ไม่ใช้เป็นประจำ: probiotics, immunoglobulin ฉีด, rifaximin, nitazoxanide, tigecycline, teicoplanin',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [{ title: 'ยาครั้งแรก', blocks: [0] }, { title: 'กลับเป็นซ้ำ', blocks: [1] }, { title: 'ข้อควรระวัง', blocks: [2] }],
};
