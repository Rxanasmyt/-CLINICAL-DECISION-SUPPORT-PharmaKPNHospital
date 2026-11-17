// การติดเชื้อในช่องท้อง (IAI): การเลือกยาต้านจุลชีพเริ่มต้น ระยะเวลา และยาต้านเชื้อรา
// คัดจาก "The management of intra-abdominal infections from a global perspective: 2017 WSES guidelines" (Sartelli M, et al. World J Emerg Surg 2017;12:29; doi:10.1186/s13017-017-0141-6; PMC5504840; open access)
// แนวทางต่างประเทศ ไม่ได้ปรับตามบริบทไทย · สรุปเป็นไทย คงชื่อยา ขนาดยา และระดับคำแนะนำตามต้นฉบับ · ขนาดยาสำหรับไตปกติ · รอเภสัชกรทบทวน
import type { Block, Guideline } from './types';

const o = 'แนวทางต่างประเทศ (WSES 2017, open access) ไม่ได้ปรับตามบริบทไทย — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'ยาเริ่มต้นในการติดเชื้อช่องท้องจากชุมชน (CA-IAI)', origin: o, sub: 'ภาคผนวก 1–2 · ขนาดสำหรับไตปกติ', items: [
    { k: 'ไม่วิกฤต — ทางเลือกหลัก', v: 'Amoxicillin/clavulanate 1.2–2.2 g ทุก 6 ชม. · หรือ Ceftriaxone 2 g ทุก 24 ชม. + Metronidazole 500 mg ทุก 6 ชม. · หรือ Cefotaxime 2 g ทุก 8 ชม. + Metronidazole 500 mg ทุก 6 ชม.' },
    { k: 'ไม่วิกฤต — แพ้ beta-lactam', v: 'Ciprofloxacin 400 mg ทุก 8 ชม. + Metronidazole 500 mg ทุก 6 ชม. · หรือ Moxifloxacin 400 mg ทุก 24 ชม.' },
    { k: 'ไม่วิกฤต — เสี่ยงเชื้อสร้าง ESBL', v: 'Ertapenem 1 g ทุก 24 ชม. · หรือ Tigecycline 100 mg ครั้งแรก แล้ว 50 mg ทุก 12 ชม.' },
    { k: 'วิกฤต — ทางเลือกหลัก', v: 'Piperacillin/tazobactam 4.5 g ทุก 6 ชม. · หรือ Cefepime 2 g ทุก 8 ชม. + Metronidazole 500 mg ทุก 6 ชม.' },
    { k: 'วิกฤต — เสี่ยงเชื้อสร้าง ESBL', v: 'Meropenem 1 g ทุก 8 ชม. · หรือ Doripenem 500 mg ทุก 8 ชม. · หรือ Imipenem/cilastatin 1 g ทุก 8 ชม.' },
    { k: 'เสี่ยงติดเชื้อ Enterococcus สูง', v: 'ผู้ที่ภูมิคุ้มกันต่ำหรือเคยได้ยาปฏิชีวนะเมื่อไม่นานมานี้ พิจารณา Ampicillin 2 g ทุก 6 ชม. ถ้าไม่ได้ใช้ piperacillin/tazobactam หรือ imipenem/cilastatin (ซึ่งครอบคลุม Enterococcus ที่ไวต่อ ampicillin)' },
  ] },
  { kind: 'kv', h: 'ยาเริ่มต้นในการติดเชื้อช่องท้องที่เกี่ยวกับสถานพยาบาล (HA-IAI)', origin: o, sub: 'ภาคผนวก 3–4 · ขนาดสำหรับไตปกติ (CrCl > 90 มล./นาที)', items: [
    { k: 'ไม่วิกฤต', v: 'Piperacillin/tazobactam 4.5 g ทุก 6 ชม.' },
    { k: 'ไม่วิกฤต — เสี่ยงเชื้อดื้อ (MDRO) สูง', v: 'เคยได้ยาปฏิชีวนะเมื่อไม่นานมานี้ อยู่สถานดูแลระยะยาวที่ใส่สายสวน หรือ IAI หลังผ่าตัด: Meropenem 1 g ทุก 8 ชม. + Ampicillin 2 g ทุก 6 ชม. · หรือ Doripenem 500 mg ทุก 8 ชม. + Ampicillin 2 g ทุก 6 ชม. · หรือ Imipenem/cilastatin 1 g ทุก 8 ชม.' },
    { k: 'ไม่วิกฤต — ทางเลือกลดการใช้ carbapenem', v: 'Piperacillin/tazobactam 4.5 g ทุก 6 ชม. + Tigecycline 100 mg ครั้งแรก แล้ว 50 mg ทุก 12 ชม.' },
    { k: 'วิกฤต', v: 'Meropenem 1 g ทุก 8 ชม. · หรือ Doripenem 500 mg ทุก 8 ชม. · หรือ Imipenem/cilastatin 1 g ทุก 8 ชม. · ทางเลือกลดการใช้ carbapenem: Ceftolozane/tazobactam 1.5 g ทุก 8 ชม. + Metronidazole 500 mg ทุก 6 ชม. หรือ Ceftazidime/avibactam 2.5 g ทุก 8 ชม. + Metronidazole 500 mg ทุก 6 ชม.' },
    { k: 'วิกฤต — เพิ่มยาครอบคลุม Gram-positive', v: 'Vancomycin 25–30 mg/kg ครั้งแรก แล้ว 15–20 mg/kg/ครั้ง ทุก 8 ชม. · หรือ Teicoplanin 12 mg/kg ทุก 12 ชม. 3 ครั้ง แล้ว 12 mg/kg ทุก 24 ชม.' },
    { k: 'เสี่ยง VRE (เคยติดเชื้อ/พาหะ, ภูมิคุ้มกันต่ำ, อยู่ ICU นาน, เคยได้ vancomycin)', v: 'Linezolid 600 mg ทุก 12 ชม. · หรือ Daptomycin 6 mg/kg ทุก 24 ชม.' },
    { k: 'เชื้อดื้อพิเศษ', v: 'สงสัยหรือพบ Pseudomonas aeruginosa ดื้อหลายยา (ไม่สร้าง metallo-beta-lactamase): พิจารณาร่วมกับ Ceftolozane/tazobactam · พบ Klebsiella pneumoniae สร้าง carbapenemase: พิจารณาร่วมกับ Ceftazidime/avibactam' },
    { k: 'แพ้ beta-lactam (ที่บันทึกไว้)', v: 'พิจารณาสูตรผสมที่มี Amikacin 15–20 mg/kg ทุก 24 ชม.' },
  ] },
  { kind: 'kv', h: 'ระยะเวลา การเลิกยา และหลักการเลือกยา', origin: o, sub: 'ข้อแนะนำที่ 38–45', items: [
    { k: 'IAI ไม่ซับซ้อน (เช่น ไส้ติ่งอักเสบ/ถุงน้ำดีอักเสบไม่ซับซ้อน ที่ควบคุมแหล่งติดเชื้อได้ครบ)', v: 'ไม่จำเป็นต้องให้ยาปฏิชีวนะหลังผ่าตัด (1A)' },
    { k: 'IAI ซับซ้อนที่ควบคุมแหล่งติดเชื้อได้เพียงพอ', v: 'แนะนำให้ยาระยะสั้น 3–5 วัน (1A) · ถ้ายังมีสัญญาณเยื่อบุช่องท้องอักเสบหรือติดเชื้อทั้งระบบเกิน 5–7 วัน ต้องตรวจหาสาเหตุ (1C) · ผู้วิกฤตที่ยังมี sepsis ให้ตัดสินใจเป็นรายบุคคล' },
    { k: 'ไม่ให้ยาในบางกรณี', v: 'ถุงโป่งลำไส้ใหญ่ด้านซ้ายอักเสบชนิดไม่ซับซ้อน (acute left colonic diverticulitis, ALCD) ที่ CT ไม่พบภาวะแทรกซ้อน ไม่มีโรคร่วมสำคัญ และไม่มีสัญญาณ sepsis: ไม่ต้องให้ยาปฏิชีวนะ แต่ต้องติดตามอาการ (1A)' },
    { k: 'หลักการเลือกยา', v: 'ใช้ข้อมูลเชื้อดื้อยาในพื้นที่ (1C) · CA-IAI ใช้ยาสเปกตรัมแคบกว่า ยกเว้นเสี่ยง ESBL · HA-IAI ใช้ยาสเปกตรัมกว้างกว่า (1B) · วิกฤตให้เริ่มยาเร็วที่สุด และคำนึงถึงเภสัชจลนศาสตร์ (1B) · เลือกตามสภาพผู้ป่วย ความเสี่ยงเชื้อดื้อ และระบาดวิทยาในพื้นที่ (1C)' },
    { k: 'เพาะเชื้อ', v: 'เพาะเชื้อระหว่างผ่าตัดทุกราย ใน HA-IAI, CA-IAI ที่เสี่ยงเชื้อดื้อ และผู้ป่วยวิกฤต เพื่อขยายหรือลดระดับยา และทดสอบความไวยาเสมอเมื่อพบเชื้อ (1C)' },
    { k: 'ยาปฏิชีวนะในไส้ติ่งอักเสบ/โรคอื่น', v: 'ยาปฏิชีวนะเป็นการรักษาหลักที่ปลอดภัยสำหรับไส้ติ่งอักเสบไม่ซับซ้อนได้ แต่กลับเป็นซ้ำสูง และควรยืนยันด้วย CT (1A) · ฝีขนาดเล็กจากถุงโป่งลำไส้ใหญ่อักเสบรักษาด้วยยาอย่างเดียวได้ตามสภาพผู้ป่วย (1C) · ฝีขนาดใหญ่ควรระบายผ่านผิวหนังร่วมกับยาฉีด (1C)' },
  ] },
  { kind: 'kv', h: 'ยาต้านเชื้อรา (Candida)', origin: o, sub: 'ข้อแนะนำที่ 47', items: [
    { k: 'ข้อบ่งชี้ (1C)', v: 'ให้ยาต้านเชื้อรา Candida แบบ empiric ใน HA-IAI โดยเฉพาะหลังผ่าตัดช่องท้องหรือรอยต่อรั่ว · โดยทั่วไปไม่แนะนำใน CA-IAI ยกเว้นผู้วิกฤตหรือภูมิคุ้มกันต่ำ (นิวโทรพีเนียหรือได้ยากดภูมิ)' },
    { k: 'แนวแรกในผู้วิกฤตหรือเคยได้ azole', v: 'Echinocandin: Caspofungin 70 mg ครั้งแรก แล้ว 50 mg วันละครั้ง · Micafungin 100 mg วันละครั้ง · Anidulafungin 200 mg ครั้งแรก แล้ว 100 mg วันละครั้ง' },
    { k: 'ผู้ป่วยความดันคงที่', v: 'Fluconazole 600 mg (12 mg/kg) ครั้งแรก แล้ว 400 mg (6 mg/kg) วันละครั้ง ยังเป็นยาแนวแรกได้ · (ตารางภาคผนวก 3 ระบุ Fluconazole 800 mg ครั้งแรก แล้ว 400 mg ทุก 24 ชม. — ตัวเลขทั้งสองมีในต้นฉบับ ให้ยืนยันกับข้อมูลอ้างอิงยาก่อนใช้) · Amphotericin B liposomal 3 mg/kg/ครั้ง ทุก 24 ชม. เป็นทางเลือกในผู้วิกฤตเสี่ยงสูง' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังด้านยา', origin: o, danger: true, items: [
    { t: 'Ciprofloxacin/levofloxacin ไม่เหมาะเป็นยาแนวแรกในหลายพื้นที่เพราะเชื้อดื้อ fluoroquinolone สูง ถ้าใช้ต้องให้ร่วมกับ metronidazole และมักเหลือไว้สำหรับผู้แพ้ beta-lactam ที่ติดเชื้อไม่รุนแรง' },
    { t: 'Cefepime และ aminoglycoside ไม่ครอบคลุมเชื้อไม่ใช้ออกซิเจน จึงต้องให้ร่วมกับ metronidazole' },
    { t: 'Aminoglycoside มีพิษต่อไตและหู บางแนวทางไม่แนะนำให้ใช้เป็นยา empiric ใน CA-IAI สำรองไว้สำหรับผู้แพ้ beta-lactam หรือใช้ร่วมกับ beta-lactam เมื่อสงสัยเชื้อ Gram-negative ดื้อหลายยา' },
    { t: 'Ertapenem ครอบคลุมเชื้อสร้าง ESBL แต่ไม่ครอบคลุม P. aeruginosa และ Enterococcus · ควรจำกัดการใช้ carbapenem เพื่อไม่ให้เกิดเชื้อดื้อ carbapenem' },
    { t: 'Tigecycline ไม่ครอบคลุม P. aeruginosa และ P. mirabilis และควรระวังหากสงสัยเชื้อในกระแสเลือดหรือปอดอักเสบจากโรงพยาบาล' },
    { t: 'Piperacillin/tazobactam ในผู้ติดเชื้อสร้าง ESBL ยังเป็นที่ถกเถียง แม้ผู้ป่วยคงที่อาจใช้ได้' },
    { t: 'ขนาดยาในตารางสำหรับไตปกติ ต้องปรับตามการทำงานของไต (ไม่ได้ระบุไว้ในแนวทางนี้)' },
  ] },
];

export const IAI_GUIDELINE: Guideline = {
  id: 'iai', title: 'การติดเชื้อในช่องท้อง (IAI): ยาปฏิชีวนะเริ่มต้นและระยะเวลา', category: 'โรคติดเชื้อ', accent: '#B45309', icon: '🩺',
  keywords: ['intra-abdominal', 'ติดเชื้อช่องท้อง', 'ไส้ติ่งอักเสบ', 'appendicitis', 'peritonitis', 'cholecystitis', 'cholangitis', 'diverticulitis', 'ceftriaxone', 'cefotaxime', 'metronidazole', 'piperacillin', 'meropenem', 'ertapenem', 'imipenem', 'amikacin', 'vancomycin', 'tigecycline', 'fluconazole', 'ciprofloxacin', 'levofloxacin', 'ESBL'],
  drugs: [
    { name: 'Amoxicillin/clavulanate', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Amoxicillin/clavulanate'] }, { name: 'Ceftriaxone', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Ceftriaxone'] },
    { name: 'Cefotaxime', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Cefotaxime'] }, { name: 'Cefepime', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Cefepime'] },
    { name: 'Piperacillin/tazobactam', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Piperacillin/tazobactam'] }, { name: 'Ampicillin', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Ampicillin'] },
    { name: 'Metronidazole', group: 'Beta-lactam และยาที่ใช้ร่วม', aliases: ['Metronidazole'] },
    { name: 'Ertapenem', group: 'Carbapenem', aliases: ['Ertapenem'] }, { name: 'Meropenem', group: 'Carbapenem', aliases: ['Meropenem'] }, { name: 'Imipenem/cilastatin', group: 'Carbapenem', aliases: ['Imipenem'] }, { name: 'Doripenem', group: 'Carbapenem', aliases: ['Doripenem'] },
    { name: 'Ciprofloxacin', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Ciprofloxacin'] }, { name: 'Moxifloxacin', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Moxifloxacin'] }, { name: 'Tigecycline', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Tigecycline'] },
    { name: 'Amikacin', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Amikacin'] }, { name: 'Vancomycin', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Vancomycin'] }, { name: 'Teicoplanin', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Teicoplanin'] },
    { name: 'Linezolid', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Linezolid'] }, { name: 'Daptomycin', group: 'ยากลุ่มอื่นและยาสำรอง', aliases: ['Daptomycin'] },
    { name: 'Fluconazole', group: 'ยาต้านเชื้อรา', aliases: ['Fluconazole'] }, { name: 'Echinocandins (caspofungin, micafungin, anidulafungin)', group: 'ยาต้านเชื้อรา', aliases: ['Caspofungin', 'Micafungin', 'Anidulafungin', 'Echinocandin'] }, { name: 'Amphotericin B liposomal', group: 'ยาต้านเชื้อรา', aliases: ['Amphotericin B'] },
  ],
  source: 'WSES 2017: The management of intra-abdominal infections from a global perspective · แนวทางต่างประเทศ',
  cites: [
    'Sartelli M, Chichom-Mefire A, Labricciosa FM, et al. The management of intra-abdominal infections from a global perspective: 2017 WSES guidelines for management of intra-abdominal infections. World J Emerg Surg. 2017;12:29. doi:10.1186/s13017-017-0141-6 · PMC5504840 · open access · https://pmc.ncbi.nlm.nih.gov/articles/PMC5504840/',
    'สรุปเป็นภาษาไทยจากภาคผนวก 1–4 (สูตรยา), ข้อแนะนำที่ 38–47 (ยาต้านจุลชีพ) และเนื้อหาส่วนยา ระดับคำแนะนำ (1A–2C) ตามต้นฉบับ (ไม่มีเลขหน้าพิมพ์ อ้างตามภาคผนวก/ข้อแนะนำ)',
    'หมายเหตุความไม่ตรงกันในต้นฉบับ: ขนาด fluconazole ในเนื้อความ (600 mg ครั้งแรก แล้ว 400 mg) ต่างจากภาคผนวก 3 (800 mg ครั้งแรก แล้ว 400 mg) · ตารางที่ 5 (ยาที่ซึมเข้าน้ำดี) ไม่ได้ใส่ในการ์ดนี้ เพราะการจัดคอลัมน์ในข้อความที่ดึงมาไม่ชัดเจน',
    'ยังไม่ครอบคลุม: การผ่าตัดและการควบคุมแหล่งติดเชื้อ (ข้อแนะนำที่ 1–37) การวินิจฉัย และตาราง AGORA ฉบับเต็ม · ไม่ได้ปรับตามเชื้อดื้อยาและยาที่มีใช้ในไทย ต้องเทียบ antibiogram ของโรงพยาบาลก่อนใช้',
  ],
  summary: [
    'CA-IAI ไม่วิกฤต: Amoxicillin/clavulanate 1.2–2.2 g ทุก 6 ชม. หรือ Ceftriaxone 2 g ทุก 24 ชม. + Metronidazole 500 mg ทุก 6 ชม. · แพ้ beta-lactam: Ciprofloxacin 400 mg ทุก 8 ชม. + Metronidazole หรือ Moxifloxacin 400 mg ทุก 24 ชม.',
    'CA-IAI วิกฤต: Piperacillin/tazobactam 4.5 g ทุก 6 ชม. หรือ Cefepime 2 g ทุก 8 ชม. + Metronidazole · เสี่ยง ESBL: Meropenem 1 g ทุก 8 ชม. (ไม่วิกฤต: Ertapenem 1 g ทุก 24 ชม.)',
    'HA-IAI ไม่วิกฤต: Piperacillin/tazobactam 4.5 g ทุก 6 ชม. · เสี่ยง MDRO สูง: Meropenem 1 g ทุก 8 ชม. + Ampicillin 2 g ทุก 6 ชม. · วิกฤตเสี่ยง VRE: เพิ่ม Linezolid 600 mg ทุก 12 ชม. หรือ Daptomycin 6 mg/kg ทุก 24 ชม.',
    'ระยะเวลา: IAI ซับซ้อนที่ควบคุมแหล่งติดเชื้อได้ ให้ยา 3–5 วัน (1A) · ไม่ซับซ้อนและผ่าตัดแล้ว ไม่ต้องให้ยาต่อ (1A)',
    'ยาต้านเชื้อรา: เสี่ยง HA-IAI/รอยต่อรั่ว พิจารณา Fluconazole หรือ Echinocandin (Micafungin 100 mg วันละครั้ง ในผู้วิกฤต) · ไม่แนะนำเป็นประจำใน CA-IAI',
    'ต้องเทียบข้อมูลเชื้อดื้อยาของ รพ. เสมอ · Ciprofloxacin/levofloxacin ไม่ใช่แนวแรกในหลายพื้นที่ เพราะเชื้อดื้อ',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [{ title: 'CA-IAI', blocks: [0] }, { title: 'HA-IAI', blocks: [1] }, { title: 'ระยะเวลา', blocks: [2] }, { title: 'ยาต้านเชื้อรา', blocks: [3] }, { title: 'ข้อควรระวัง', blocks: [4] }],
};
