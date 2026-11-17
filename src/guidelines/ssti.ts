// การติดเชื้อผิวหนังและเนื้อเยื่ออ่อน (SSTI): ผิวหนังทั่วไป ฝี MRSA และเนื้อเยื่อตาย (necrotizing)
// คัดจาก "2018 WSES/SIS-E consensus conference: recommendations for the management of skin and soft-tissue infections" (Sartelli M, et al. World J Emerg Surg 2018;13:58; doi:10.1186/s13017-018-0219-9; PMC6295010; open access)
// แนวทางต่างประเทศ ไม่ได้ปรับตามบริบทไทย · สรุปเป็นไทย คงชื่อยา ขนาดยา และระดับคำแนะนำตามต้นฉบับ · รอเภสัชกรทบทวน
import type { Block, Guideline } from './types';

const o = 'แนวทางต่างประเทศ (WSES/SIS-E 2018, open access) ไม่ได้ปรับตามบริบทไทย — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'ผิวหนังชั้นตื้นและฝี: เมื่อไรต้องให้ยาปฏิชีวนะ', origin: o, sub: 'ข้อแนะนำระดับ 1C ทั้งหมด', items: [
    { k: 'Impetigo, erysipelas, cellulitis', v: 'ให้ยาปฏิชีวนะที่ครอบคลุม Gram-positive (1C) · ถ้าไม่รุนแรงและไม่มีโรคร่วมสำคัญ ยากิน beta-lactam อาจเพียงพอในพื้นที่ที่ CA-MRSA ไม่พบบ่อย · ทางเลือกอื่น macrolides และ lincosamides แต่เชื้อดื้อ erythromycin/clindamycin เพิ่มขึ้น · fluoroquinolones รักษา cellulitis ไม่ซับซ้อนได้แต่ใช้กับ MRSA ไม่ได้ · ติดเชื้อรุนแรงให้ยาฉีดก่อน' },
    { k: 'ฝี/หัวฝีแบบง่าย', v: 'รักษาหลักคือผ่าระบาย (incision and drainage) ไม่แนะนำให้ใช้ยาปฏิชีวนะ (1C)' },
    { k: 'ฝีซับซ้อน (รอบทวารหนัก, จุดฉีดยาเสพติด)', v: 'ให้ยาปฏิชีวนะเมื่อมีอาการทั้งระบบ ภูมิคุ้มกันต่ำ ระบายไม่หมด หรือมี cellulitis ร่วมมาก (1C) · ให้ยา empiric ครอบคลุม Gram-positive, Gram-negative และไม่ใช้ออกซิเจน (1C)' },
    { k: 'แผลผ่าตัดติดเชื้อชั้นตื้น', v: 'เปิดแผลกว้างทันที และให้ยาปฏิชีวนะเมื่อมี SIRS หรืออวัยวะล้มเหลว (ความดันต่ำ ปัสสาวะน้อย สติลด) หรือภูมิคุ้มกันต่ำ (1C) · ให้ยาป้องกันเฉพาะก่อน/ระหว่างผ่าตัด ไม่ให้ต่อหลังผ่าตัด' },
    { k: 'แผลไฟไหม้ คนหรือสัตว์กัด แผลกดทับ', v: 'ล้างแผลและตัดเนื้อตายเป็นปัจจัยสำคัญที่สุด ไม่แนะนำยาป้องกันทั่วไป (1C) · ถ้ามีอาการทั้งระบบ ภูมิคุ้มกันต่ำ โรคร่วมรุนแรง cellulitis รุนแรง หรือแผลลึก ให้ยากว้างครอบคลุมใช้ออกซิเจนและไม่ใช้ออกซิเจน (1C)' },
  ] },
  { kind: 'kv', h: 'ยาครอบคลุม MRSA', origin: o, sub: 'ข้อแนะนำที่ว่าด้วย MRSA ใน cSSTI', items: [
    { k: 'เมื่อไรต้องครอบคลุม MRSA (1C)', v: 'ให้ยาต้าน MRSA เสริมการผ่าระบาย ตามระบาดวิทยา (พื้นที่ MRSA > 20% ของเชื้อที่แยกได้จากผู้ป่วยในโรงพยาบาล หรือชุมชนพบมาก) ปัจจัยเสี่ยงรายบุคคล และสภาพผู้ป่วย · ให้ยา empiric ต้าน CA-MRSA เมื่อมีความเสี่ยงหรือไม่ตอบสนองต่อยาแนวแรก' },
    { k: 'ยากิน (ระดับคำแนะนำ)', v: 'Linezolid 600 mg ทุก 12 ชม. (1A) · Trimethoprim-sulfamethoxazole 160/800 mg ทุก 12 ชม. (1B) · Doxycycline 100 mg ทุก 12 ชม. หรือ Minocycline 100 mg ทุก 12 ชม. (1B) · Tedizolid 200 mg ทุก 24 ชม. (1A) · Clindamycin 300–600 mg ทุก 8 ชม. (เชื้อดื้อมาก)' },
    { k: 'ยาฉีด (1A ทุกตัว)', v: 'Vancomycin 15 mg/kg IV ทุก 12 ชม. · Teicoplanin 12 mg/kg IV ทุก 12 ชม. 3 ครั้ง แล้ว 6 mg/kg ทุก 12 ชม. · Linezolid 600 mg ทุก 12 ชม. · Daptomycin (ดูหมายเหตุขนาด) · Ceftaroline 600 mg ทุก 12 ชม. · Tigecycline 100 mg ครั้งแรก แล้ว 50 mg IV ทุก 12 ชม. · Dalbavancin 1,000 mg ครั้งเดียว ตามด้วย 500 mg หลัง 1 สัปดาห์ หรือ 1,500 mg ครั้งเดียว · Tedizolid 200 mg ทุก 24 ชม.' },
    { k: 'ช่องทางและระยะเวลา', v: 'ยากินสำหรับติดเชื้อไม่รุนแรง ยาฉีดสำหรับรุนแรง ติดเชื้อปานกลางให้ยาฉีด 1–2 ครั้งแล้วเปลี่ยนเป็นยากินได้ · ให้ยา 7–14 วัน ตามการตอบสนองรายบุคคล (1A)' },
  ] },
  { kind: 'kv', h: 'เนื้อเยื่ออ่อนติดเชื้อชนิดเนื้อตาย (NSTI) รวม Fournier', origin: o, sub: 'ข้อแนะนำระดับ 1B–1C ยกเว้นระบุ', items: [
    { k: 'หลักการ', v: 'ให้ยาปฏิชีวนะทันทีและเต็มที่ (1B) ร่วมกับการผ่าตัดควบคุมแหล่งติดเชื้อโดยเร็ว อย่างช้าภายใน 12 ชม.หลังเข้ารับการรักษาเมื่อสงสัยสูง (1B) · ยาเป็นการรักษาเสริมผ่าตัด ไม่ใช้แทน' },
    { k: 'ยา empiric เริ่มต้น (1C)', v: 'ต้องกว้างและครอบคลุม MRSA และ Gram-negative รวมเชื้อไม่ใช้ออกซิเจน · ครอบคลุม MRSA ตามรายการในหัวข้อก่อนหน้า · Gram-negative: Piperacillin/tazobactam (ถ้า ESBL ไม่พบบ่อยในพื้นที่ ปรับ PK/PD ให้เหมาะ) · พื้นที่ที่ ESBL พบมากใช้ Carbapenem ขนาดเพียงพอ (Meropenem, Imipenem/cilastatin, Doripenem)' },
    { k: 'ยาลดการสร้างพิษ (1C)', v: 'ใส่ Clindamycin หรือ Linezolid ในสูตร empiric ทุกราย เพราะยับยั้งการสร้างพิษของเชื้อ โดยเฉพาะเมื่อมี toxic shock syndrome' },
    { k: 'ปรับยาและระยะเวลา', v: 'ลดระดับยา (de-escalation) ตามอาการ ผลเพาะเชื้อ และการทดสอบเร็ว (1C) · ให้ยาจนไม่ต้องตัดเนื้อตายเพิ่ม อาการดีขึ้น และไข้หายนาน 48–72 ชม. (1C) · Procalcitonin อาจช่วยตัดสินใจหยุดยา (2B)' },
    { k: 'Fournier gangrene', v: 'ให้ยาปฏิชีวนะเหมาะสมทันที ประคองระบบไหลเวียนเลือด และตัดเนื้อตายเร็วและกว้าง (1C) · เพาะเชื้อจากการผ่าตัดครั้งแรกเพื่อปรับยา · พิจารณาเบี่ยงทางอุจจาระเมื่อมีการปนเปื้อน (2C)' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังด้านยาและข้อมูลที่ต้นฉบับไม่ตรงกัน', origin: o, danger: true, items: [
    { t: 'ขนาด daptomycin ในต้นฉบับไม่ตรงกัน: ข้อแนะนำระบุ 10 mg/kg/ครั้ง วันละครั้ง (1A) แต่รายการยาในเนื้อความระบุ 4–6 mg/kg ทุก 24 ชม. — ต้องยืนยันขนาดกับเอกสารกำกับยาและข้อมูลอ้างอิงยาก่อนสั่งใช้' },
    { t: 'Clindamycin เชื้อดื้อสูงและเพิ่มขึ้น ใช้เป็นยาแนวแรกรักษา cellulitis หรือ MRSA ไม่ได้ในหลายพื้นที่ ส่วน fluoroquinolones ไม่ครอบคลุม MRSA' },
    { t: 'ต้นฉบับไม่ได้ระบุเกณฑ์ปรับขนาดตามการทำงานของไตหรือระดับยา (vancomycin, teicoplanin, daptomycin และอื่น ๆ) ให้ดูฉลากยาและข้อมูลอ้างอิงยาในหมวด "ข้อมูลยาในบัญชี" ก่อนสั่งใช้' },
    { t: 'อันตรกิริยาและอาการไม่พึงประสงค์ของยาแต่ละตัว (เช่น linezolid) ไม่ได้อยู่ในแนวทางนี้ ดูหมวด "ข้อมูลยาในบัญชี" และ "ตรวจอันตรกิริยา (DI)"' },
    { t: 'ไม่ใช้ยาปฏิชีวนะเป็นประจำสำหรับฝีแบบง่าย และไม่ให้ยาป้องกันต่อหลังผ่าตัด' },
  ] },
];

export const SSTI_GUIDELINE: Guideline = {
  id: 'ssti', title: 'ผิวหนังและเนื้อเยื่ออ่อนติดเชื้อ (SSTI): ยาและ MRSA', category: 'โรคติดเชื้อ', accent: '#9A3412', icon: '🩹',
  keywords: ['SSTI', 'cellulitis', 'erysipelas', 'impetigo', 'abscess', 'ฝี', 'ผิวหนังอักเสบ', 'necrotizing', 'necrotizing fasciitis', 'Fournier', 'MRSA', 'vancomycin', 'linezolid', 'clindamycin', 'doxycycline', 'daptomycin', 'teicoplanin', 'cotrimoxazole', 'sulfamethoxazole', 'piperacillin', 'meropenem', 'surgical site infection'],
  drugs: [
    { name: 'Vancomycin', group: 'ยาต้าน MRSA (ฉีด)', aliases: ['Vancomycin'] }, { name: 'Teicoplanin', group: 'ยาต้าน MRSA (ฉีด)', aliases: ['Teicoplanin'] }, { name: 'Daptomycin', group: 'ยาต้าน MRSA (ฉีด)', aliases: ['Daptomycin'] },
    { name: 'Ceftaroline', group: 'ยาต้าน MRSA (ฉีด)', aliases: ['Ceftaroline'] }, { name: 'Tigecycline', group: 'ยาต้าน MRSA (ฉีด)', aliases: ['Tigecycline'] }, { name: 'Dalbavancin', group: 'ยาต้าน MRSA (ฉีด)', aliases: ['Dalbavancin'] },
    { name: 'Linezolid', group: 'ยาต้าน MRSA (กินและฉีด)', aliases: ['Linezolid'] }, { name: 'Tedizolid', group: 'ยาต้าน MRSA (กินและฉีด)', aliases: ['Tedizolid'] },
    { name: 'Trimethoprim-sulfamethoxazole', group: 'ยาต้าน MRSA (กินและฉีด)', aliases: ['Trimethoprim-sulfamethoxazole', 'TMP-SMX'] }, { name: 'Doxycycline', group: 'ยาต้าน MRSA (กินและฉีด)', aliases: ['Doxycycline'] }, { name: 'Minocycline', group: 'ยาต้าน MRSA (กินและฉีด)', aliases: ['Minocycline'] },
    { name: 'Clindamycin', group: 'ยาอื่นใน SSTI', aliases: ['Clindamycin'] }, { name: 'Piperacillin/tazobactam', group: 'ยาอื่นใน SSTI', aliases: ['Piperacillin-tazobactam', 'Piperacillin/tazobactam'] },
    { name: 'Meropenem', group: 'ยาอื่นใน SSTI', aliases: ['Meropenem'] }, { name: 'Imipenem/cilastatin', group: 'ยาอื่นใน SSTI', aliases: ['Imipenem'] }, { name: 'Doripenem', group: 'ยาอื่นใน SSTI', aliases: ['Doripenem'] },
  ],
  source: 'WSES/SIS-E 2018: Skin and soft-tissue infections · แนวทางต่างประเทศ',
  cites: [
    'Sartelli M, Guirao X, Hardcastle TC, et al. 2018 WSES/SIS-E consensus conference: recommendations for the management of skin and soft-tissue infections. World J Emerg Surg. 2018;13:58. doi:10.1186/s13017-018-0219-9 · PMC6295010 · open access · https://pmc.ncbi.nlm.nih.gov/articles/PMC6295010/',
    'สรุปเป็นภาษาไทยจากข้อแนะนำเรื่องยาปฏิชีวนะใน SSI, cellulitis/ฝี, แผลเฉพาะ, MRSA และ NSTI รวมรายการยา MRSA ในเนื้อความ ระดับคำแนะนำ (1A–2C) ตามต้นฉบับ (ไม่มีเลขหน้าพิมพ์ อ้างตามหัวข้อคำถาม)',
    'หมายเหตุความไม่ตรงกันในต้นฉบับ: ขนาด daptomycin 10 mg/kg (ข้อแนะนำ) ต่างจาก 4–6 mg/kg (รายการยา)',
    'ยังไม่ครอบคลุม: การผ่าตัดและการวินิจฉัย NSTI (LRINEC) การป้องกันแผลผ่าตัดติดเชื้อ การรักษาแผลเรื้อรัง และการจัดการ gas gangrene · ไม่ได้ปรับตามเชื้อดื้อยาและยาที่มีใช้ในไทย ต้องเทียบ antibiogram ของโรงพยาบาลก่อนใช้',
  ],
  summary: [
    'Impetigo/erysipelas/cellulitis: ยาปฏิชีวนะครอบคลุม Gram-positive (1C) · ไม่รุนแรง ยากิน beta-lactam ได้ถ้า CA-MRSA ไม่พบบ่อย · รุนแรงให้ยาฉีดก่อน',
    'ฝีแบบง่าย: ผ่าระบายอย่างเดียว ไม่ให้ยาปฏิชีวนะ (1C) · ฝีซับซ้อนให้ยากว้างเมื่อมีอาการทั้งระบบ ภูมิคุ้มกันต่ำ หรือระบายไม่หมด',
    'ครอบคลุม MRSA เมื่อพื้นที่ MRSA > 20% ของเชื้อที่แยกได้ในโรงพยาบาล หรือมีปัจจัยเสี่ยง (1C)',
    'ยากินต้าน MRSA: Linezolid 600 mg ทุก 12 ชม. · Trimethoprim-sulfamethoxazole 160/800 mg ทุก 12 ชม. · Doxycycline 100 mg ทุก 12 ชม. · ยาฉีด: Vancomycin 15 mg/kg ทุก 12 ชม.',
    'NSTI: ยากว้างทันที ครอบคลุม MRSA + Gram-negative (Piperacillin/tazobactam หรือ Carbapenem) + Clindamycin หรือ Linezolid (1C) ร่วมผ่าตัดภายใน 12 ชม. (1B)',
    'ระยะเวลา: SSTI ทั่วไป 7–14 วัน (1A) · NSTI ให้ยาจนไม่ต้องตัดเนื้อตายเพิ่มและไข้หาย 48–72 ชม.',
    'ขนาด daptomycin ในต้นฉบับไม่ตรงกัน (10 กับ 4–6 mg/kg) ต้องยืนยันก่อนใช้',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [{ title: 'ผิวหนังชั้นตื้น/ฝี', blocks: [0] }, { title: 'MRSA', blocks: [1] }, { title: 'NSTI', blocks: [2] }, { title: 'ข้อควรระวัง', blocks: [3] }],
};
