// ภาวะติดเชื้อในกระแสเลือดและ septic shock (ผู้ใหญ่): ยาปฏิชีวนะ สารน้ำ vasopressor และยาประกอบ
// คัดจาก Surviving Sepsis Campaign 2021 (Evans L, et al. Intensive Care Med 2021;47:1181–1247; doi:10.1007/s00134-021-06506-y; PMC8486643; open access)
// ต้นฉบับภาษาอังกฤษ สรุปเป็นไทย คงชื่อยา ตัวเลข และระดับคำแนะนำตามต้นฉบับ · เป็นแนวทางสากล ไม่ใช่แนวทางไทย · ยังไม่ได้ทบทวนโดยเภสัชกร
import type { Block, Guideline } from './types';

const o = 'จาก Surviving Sepsis Campaign 2021 (open access) — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'เวลาเริ่มยาต้านจุลชีพ', origin: o, sub: 'ข้อแนะนำที่ 11–16', items: [
    { k: 'Septic shock หรือมีโอกาสเป็น sepsis สูง', v: 'ให้ยาต้านจุลชีพทันที ภายใน 1 ชม. หลังรู้ว่าเป็น (แนะนำ: strong, หลักฐานคุณภาพต่ำ)' },
    { k: 'สงสัย sepsis แต่ไม่ช็อก', v: 'ประเมินเร็วว่าติดเชื้อหรือไม่ (แนะนำ) · ถ้ายังสงสัยติดเชื้อหลังตรวจภายในช่วงเวลาจำกัด ให้ยาภายใน 3 ชม. นับจากเริ่มสงสัย sepsis (suggest: weak, very low)' },
    { k: 'โอกาสติดเชื้อต่ำและไม่ช็อก', v: 'เลื่อนการให้ยาไว้ก่อนและเฝ้าติดตามใกล้ชิด (suggest: weak)' },
    { k: 'Procalcitonin', v: 'ไม่แนะนำใช้ procalcitonin ร่วมกับการประเมินทางคลินิกเพื่อตัดสินใจ "เริ่ม" ยาต้านจุลชีพ (suggest against: weak, หลักฐานคุณภาพต่ำ)' },
    { k: 'ถ้าพบว่าไม่ใช่การติดเชื้อ', v: 'ประเมินหาสาเหตุอื่นต่อเนื่อง และหยุดยาต้านจุลชีพเมื่อพบหรือเชื่อว่าเป็นสาเหตุอื่น (แนะนำ)' },
  ] },
  { kind: 'kv', h: 'การเลือกยาต้านจุลชีพ (empiric)', origin: o, sub: 'ข้อแนะนำที่ 17–24', items: [
    { k: 'MRSA เสี่ยงสูง', v: 'ใช้สูตรที่ครอบคลุม MRSA (best practice statement) · ปัจจัยเสี่ยง MRSA: เคยติดเชื้อหรือเป็นพาหะ MRSA, ได้ยาปฏิชีวนะ IV เมื่อไม่นานมานี้, ผิวหนังติดเชื้อซ้ำหรือแผลเรื้อรัง, อุปกรณ์ invasive, ล้างไต, นอนโรงพยาบาลเมื่อไม่นานมานี้, ความรุนแรงของโรค' },
    { k: 'MRSA เสี่ยงต่ำ', v: 'ไม่แนะนำให้ครอบคลุม MRSA เป็นการเริ่มต้น (suggest against: weak, low) · MRSA พบประมาณ 5% ของการติดเชื้อที่เพาะเชื้อขึ้นในผู้ป่วยวิกฤต ต่างกันตามพื้นที่ (ประมาณ 2% ในยุโรปตะวันตก ถึง 10% ในอเมริกาเหนือ)' },
    { k: 'เชื้อดื้อยาหลายขนาน (MDR) เสี่ยงสูง', v: 'แนะนำยาที่ครอบคลุม gram-negative 2 ชนิด (suggest: weak, very low) · เสี่ยงต่ำ: ใช้ gram-negative ตัวเดียว (suggest against 2 ตัว)' },
    { k: 'เมื่อรู้เชื้อและความไวยาแล้ว', v: 'ไม่แนะนำให้ใช้ gram-negative ครอบคลุมซ้ำ 2 ชนิดต่อ (suggest against: weak, very low)' },
    { k: 'ยาต้านเชื้อรา', v: 'เสี่ยงติดเชื้อราสูง: ให้ยาต้านเชื้อรา empiric (suggest: weak, low) · เสี่ยงต่ำ: ไม่แนะนำ · การเลือกชนิดยาขึ้นกับชนิดเชื้อราที่น่าจะพบ ระบาดวิทยา และยาที่ใช้มาก่อน' },
  ] },
  { kind: 'kv', h: 'การให้ยาปฏิชีวนะ: PK/PD, ระยะเวลา และเลิกยา', origin: o, sub: 'ข้อแนะนำที่ 25–31 · ตารางที่ 3', items: [
    { k: 'Beta-lactams', v: 'ให้ loading dose ก่อน แล้วให้ต่อแบบ prolonged infusion แทน bolus (suggest: weak, moderate) · meta-analysis: ลดการเสียชีวิตระยะสั้น RR 0.70 (95% CI 0.57–0.87) · เป้า PK/PD: fT>MIC, Cmin > MIC' },
    { k: 'หลัก PK/PD (best practice)', v: 'ปรับขนาดยาตามหลัก PK/PD และคุณสมบัติของยา เพราะ sepsis เปลี่ยนระดับยา: augmented renal clearance, AKI, hypoalbuminemia, RRT และ ECMO อาจทำให้ระดับต่ำเกินหรือสูงเกิน · ขนาดตามเอกสารกำกับยามักไม่เหมาะ ใช้สูตรที่พัฒนาในผู้ป่วย sepsis, TDM หรือโปรแกรมช่วยคำนวณ' },
    { k: 'Aminoglycosides', v: 'AUC0–24/MIC 70–100; Cmax/MIC 8–10 · ใช้ extended-interval dosing ตามน้ำหนักและการทำงานของไต' },
    { k: 'Vancomycin', v: 'AUC0–24/MIC ประมาณ 400 · ใช้น้ำหนักและการทำงานของไต' },
    { k: 'Fluoroquinolones / Daptomycin / Colistin', v: 'Fluoroquinolones: AUC0–24/MIC 80–125 (ใช้การทำงานของไต) · Daptomycin: AUC0–24/MIC > 200 · Colistin: ยังไม่กำหนดเป้า ใช้น้ำหนักและการทำงานของไต' },
    { k: 'ยาต้านเชื้อรา (เป้าระดับยา)', v: 'Fluconazole AUC0–24/MIC 100 · Posaconazole Cmin 1–4 มก./ลิตร (ใช้ขนาดตามรูปแบบยา) · Voriconazole Cmin 2–6 มก./ลิตร (ใช้น้ำหนัก)' },
    { k: 'ระยะเวลาและ de-escalation', v: 'ประเมินการลดระดับยา (de-escalation) ทุกวัน (suggest: weak, very low) · ถ้า source control เพียงพอ ให้ใช้ระยะสั้นแทนระยะยาว (suggest: weak, very low) · เมื่อระยะเวลาที่เหมาะไม่ชัดเจน ใช้ procalcitonin ร่วมกับการประเมินทางคลินิกตัดสินใจหยุดยา (suggest: weak, low)' },
    { k: 'Source control', v: 'หาจุดติดเชื้อที่ต้องควบคุมเร่งด่วนและทำโดยเร็วที่สุดเท่าที่ทำได้ (แนะนำ) · ถอดสายสวนหลอดเลือดที่อาจเป็นแหล่งติดเชื้อหลังมีทางเข้าหลอดเลือดอื่นแล้ว (แนะนำ)' },
  ] },
  { kind: 'kv', h: 'สารน้ำ', origin: o, sub: 'ข้อแนะนำที่ 5–8, 32–36', items: [
    { k: 'ปริมาณเริ่มต้น', v: 'ผู้ที่ sepsis ร่วมกับ hypoperfusion หรือ septic shock: crystalloid IV อย่างน้อย 30 มล./กก. ภายใน 3 ชม. แรก (suggest: weak, low)' },
    { k: 'ตัวชี้นำการให้สารน้ำ', v: 'ใช้ตัววัดแบบ dynamic แทนการตรวจร่างกายหรือค่าคงที่เพียงอย่างเดียว · ใช้ลด lactate เมื่อสูง · ใช้ capillary refill time ช่วยประเมินการไหลเวียน (suggest ทั้งหมด)' },
    { k: 'ชนิดสารน้ำ', v: 'Crystalloid เป็นแนวแรก (strong, moderate) · แนะนำ balanced crystalloid แทน normal saline (weak, low) · ผู้ที่ได้ crystalloid ปริมาณมาก แนะนำเพิ่ม albumin (weak, moderate) · ไม่ใช้ starch (strong against, high) · ไม่แนะนำ gelatin (weak against)' },
  ] },
  { kind: 'kv', h: 'Vasopressor และ inotrope', origin: o, sub: 'ข้อแนะนำที่ 9, 37–44', items: [
    { k: 'เป้าหมาย MAP', v: 'เริ่มต้น MAP 65 mm Hg (strong, moderate)' },
    { k: 'แนวแรก: Norepinephrine', v: 'แนะนำเป็น vasopressor แนวแรก (strong) เหนือ dopamine (หลักฐานคุณภาพสูง), vasopressin (moderate), epinephrine (low), selepressin (low), angiotensin II (very low) · ถ้าไม่มี norepinephrine ใช้ epinephrine หรือ dopamine ได้ ระวังโดยเฉพาะผู้เสี่ยงหัวใจเต้นผิดจังหวะ' },
    { k: 'เพิ่มยา', v: 'MAP ไม่พอด้วย norepinephrine: เพิ่ม vasopressin แทนการเพิ่มขนาด norepinephrine (weak, moderate) — ทางปฏิบัติของผู้เขียน มักเริ่ม vasopressin เมื่อ norepinephrine อยู่ในช่วง 0.25–0.5 ไมโครกรัม/กก./นาที · ยังไม่พอ: เพิ่ม epinephrine (weak, low) · ไม่แนะนำ terlipressin (weak against)' },
    { k: 'หัวใจทำงานบกพร่อง', v: 'ยังมี hypoperfusion แม้ปริมาตรและความดันเพียงพอ: เพิ่ม dobutamine ใน norepinephrine หรือใช้ epinephrine ตัวเดียว (weak, low) · ไม่แนะนำ levosimendan (weak against)' },
    { k: 'ข้อปฏิบัติ', v: 'ใช้ arterial line วัดความดันเมื่อทำได้ · เริ่ม vasopressor ผ่านหลอดเลือดดำส่วนปลายได้เลย ไม่ต้องรอ central line (suggest ทั้งสองข้อ)' },
  ] },
  { kind: 'kv', h: 'Corticosteroid และยาประกอบ', origin: o, sub: 'ข้อแนะนำที่ 58–72', items: [
    { k: 'Hydrocortisone (septic shock)', v: 'ใช้ IV corticosteroid เมื่อยังต้องใช้ vasopressor ต่อเนื่อง (suggest: weak, moderate) · ยาที่ใช้ทั่วไป: hydrocortisone 200 มก./วัน แบ่ง 50 มก. IV ทุก 6 ชม. หรือหยดต่อเนื่อง · เริ่มเมื่อ norepinephrine หรือ epinephrine ≥ 0.25 ไมโครกรัม/กก./นาที อย่างน้อย 4 ชม. หลังเริ่มยา' },
    { k: 'ผลของ corticosteroid ที่พบ', v: 'เร่งการหายจากภาวะช็อกและเพิ่มวัน vasopressor-free · เพิ่มความเสี่ยงกล้ามเนื้ออ่อนแรง (RR 1.21; 95% CI 1.01–1.45) · ยังไม่ชัดเจนเรื่องขนาด เวลาเริ่ม และระยะเวลาที่เหมาะสม' },
    { k: 'ป้องกันเลือดออกทางเดินอาหาร', v: 'ผู้มีปัจจัยเสี่ยง GI bleeding แนะนำ stress ulcer prophylaxis (suggest: weak, moderate) · ลด GI bleeding RR 0.52 ไม่ลดการเสียชีวิต · ปัจจัยเสี่ยง: coagulopathy, shock, โรคตับเรื้อรัง · มีรายงานเสี่ยง C. difficile ซ้ำสูงขึ้นกับ PPI' },
    { k: 'ป้องกัน VTE', v: 'ให้ยาป้องกันตามเภสัชวิทยาเสมอเว้นแต่มีข้อห้าม (strong, moderate) · เลือก LMWH มากกว่า UFH (strong, moderate) · ไม่แนะนำเพิ่มวิธีกลไกร่วมกับยา (suggest against)' },
    { k: 'ควบคุมน้ำตาล', v: 'เริ่ม insulin เมื่อระดับน้ำตาล ≥ 180 มก./ดล. (strong, moderate) · เป้าหมายทั่วไป 144–180 มก./ดล.' },
    { k: 'ยาอื่นที่ไม่แนะนำ / กรณีเฉพาะ', v: 'ไม่แนะนำ IV vitamin C · ไม่แนะนำ IVIG · ไม่แนะนำ sodium bicarbonate เพื่อเพิ่ม hemodynamics เมื่อ lactic acidemia · พิจารณา sodium bicarbonate เมื่อ pH ≤ 7.2 ร่วมกับ AKI (AKIN 2–3) · ให้ restrictive transfusion strategy' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังด้านยา', origin: o, danger: true, items: [
    { t: 'เป็นแนวทางสากลสำหรับผู้ใหญ่ที่เขียนสำหรับ ICU ทั่วโลก ไม่ใช่แนวทางไทย — เลือกยาต้านจุลชีพต้องอิงระบาดวิทยาเชื้อดื้อยาและ antibiogram ของโรงพยาบาล' },
    { t: 'การ์ดนี้ไม่มีขนาดยาต้านจุลชีพรายตัว เพราะต้นฉบับไม่ได้ระบุ ให้ใช้สูตรขนาดยาของโรงพยาบาลหรือ PK/PD dosing ตามข้างต้น' },
    { t: 'Corticosteroid เพิ่มความเสี่ยงกล้ามเนื้ออ่อนแรง และ stress ulcer prophylaxis ด้วย PPI สัมพันธ์กับ C. difficile ซ้ำ ให้ติดตาม' },
    { t: 'หลีกเลี่ยง starch และ gelatin เป็นสารน้ำ, ติดตามปริมาตรสะสมเพราะสารน้ำเกินเป็นอันตราย' },
    { t: 'ใช้ dopamine และ epinephrine ด้วยความระวังผู้เสี่ยงหัวใจเต้นผิดจังหวะ' },
  ] },
];

export const SEPSIS_GUIDELINE: Guideline = {
  id: 'sepsis', title: 'Sepsis / Septic shock: ยาต้านจุลชีพ สารน้ำ vasopressor', category: 'โรคติดเชื้อ', accent: '#D94F2B', icon: '🚨',
  keywords: ['sepsis', 'septic shock', 'ติดเชื้อในกระแสเลือด', 'ช็อก', 'norepinephrine', 'vasopressin', 'epinephrine', 'dobutamine', 'hydrocortisone', 'vancomycin', 'beta-lactam', 'MRSA', 'MDR', 'crystalloid', 'albumin', 'insulin', 'LMWH', 'procalcitonin', 'PK/PD'],
  drugs: [
    { name: 'Beta-lactams', group: 'ยาต้านจุลชีพ', aliases: ['Beta-lactams', 'beta-lactam', 'Beta-lactam'] },
    { name: 'Vancomycin', group: 'ยาต้านจุลชีพ', aliases: ['Vancomycin', 'vancomycin'] },
    { name: 'Aminoglycosides', group: 'ยาต้านจุลชีพ', aliases: ['Aminoglycosides', 'aminoglycoside'] },
    { name: 'Fluoroquinolones', group: 'ยาต้านจุลชีพ', aliases: ['Fluoroquinolones'] }, { name: 'Daptomycin', group: 'ยาต้านจุลชีพ', aliases: ['Daptomycin'] }, { name: 'Colistin', group: 'ยาต้านจุลชีพ', aliases: ['Colistin'] },
    { name: 'Fluconazole', group: 'ยาต้านจุลชีพ', aliases: ['Fluconazole'] }, { name: 'Posaconazole', group: 'ยาต้านจุลชีพ', aliases: ['Posaconazole'] }, { name: 'Voriconazole', group: 'ยาต้านจุลชีพ', aliases: ['Voriconazole'] },
    { name: 'Crystalloid', group: 'สารน้ำและ vasopressor', aliases: ['crystalloid'] }, { name: 'Albumin', group: 'สารน้ำและ vasopressor', aliases: ['albumin'] },
    { name: 'Norepinephrine', group: 'สารน้ำและ vasopressor', aliases: ['Norepinephrine', 'norepinephrine'] },
    { name: 'Vasopressin', group: 'สารน้ำและ vasopressor', aliases: ['Vasopressin', 'vasopressin'] },
    { name: 'Epinephrine', group: 'สารน้ำและ vasopressor', aliases: ['Epinephrine'] }, { name: 'Dobutamine', group: 'สารน้ำและ vasopressor', aliases: ['Dobutamine'] },
    { name: 'Hydrocortisone', group: 'ยาประกอบในผู้ป่วยวิกฤต', aliases: ['Hydrocortisone', 'hydrocortisone'] },
    { name: 'LMWH', group: 'ยาประกอบในผู้ป่วยวิกฤต', aliases: ['LMWH'] }, { name: 'Insulin', group: 'ยาประกอบในผู้ป่วยวิกฤต', aliases: ['insulin'] }, { name: 'PPI', group: 'ยาประกอบในผู้ป่วยวิกฤต', aliases: ['PPI'] },
  ],
  source: 'Surviving Sepsis Campaign: international guidelines for management of sepsis and septic shock 2021 · SCCM / ESICM',
  cites: [
    'Evans L, Rhodes A, Alhazzani W, et al. Surviving sepsis campaign: international guidelines for management of sepsis and septic shock 2021. Intensive Care Med. 2021;47:1181–1247. doi:10.1007/s00134-021-06506-y · PMC8486643 · open access · https://pmc.ncbi.nlm.nih.gov/articles/PMC8486643/',
    'สรุปเป็นภาษาไทยจากข้อแนะนำที่ 5–9, 11–23, 25–31, 32–44, 58, 63–66, 69–72 และตารางที่ 3 ของบทความ (ไม่มีเลขหน้าพิมพ์ อ้างตามเลขข้อแนะนำ) · ระดับคำแนะนำ (strong/weak/best practice) และคุณภาพหลักฐานตามต้นฉบับ',
    'ยังไม่ครอบคลุม: การช่วยหายใจ/ARDS, RRT, โภชนาการ, การดูแลหลังออกจาก ICU, sepsis ในเด็ก/ตั้งครรภ์ (ต้นฉบับมีแยก) และขนาดยาต้านจุลชีพรายตัว ซึ่งต้นฉบับไม่ได้กำหนด',
  ],
  summary: [
    'Septic shock หรือโอกาส sepsis สูง: ให้ยาต้านจุลชีพทันที ภายใน 1 ชม. · ไม่ช็อก: ภายใน 3 ชม.',
    'Crystalloid อย่างน้อย 30 มล./กก. ภายใน 3 ชม. แรก · balanced crystalloid แทน normal saline · ไม่ใช้ starch',
    'เป้า MAP 65 mm Hg · Norepinephrine เป็นแนวแรก · เพิ่ม vasopressin (มักเริ่มเมื่อ norepinephrine 0.25–0.5 ไมโครกรัม/กก./นาที) แล้ว epinephrine',
    'Hydrocortisone 200 มก./วัน (50 มก. IV ทุก 6 ชม.) เมื่อยังต้องใช้ vasopressor ต่อเนื่อง',
    'Beta-lactam: ให้ loading dose แล้วให้ต่อแบบ prolonged infusion',
    'ประเมิน de-escalation ทุกวัน · ใช้ระยะสั้นเมื่อ source control เพียงพอ',
    'Insulin เมื่อน้ำตาล ≥ 180 มก./ดล. (เป้า 144–180) · LMWH ป้องกัน VTE',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [
    { title: 'เวลาเริ่มยา', blocks: [0] }, { title: 'เลือกยา', blocks: [1] }, { title: 'PK/PD', blocks: [2] }, { title: 'สารน้ำ', blocks: [3] },
    { title: 'Vasopressor', blocks: [4] }, { title: 'ยาประกอบ', blocks: [5] }, { title: 'ข้อควรระวัง', blocks: [6] },
  ],
};
