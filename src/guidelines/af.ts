// ภาวะหัวใจห้องบนเต้นระริก (AF): ยาต้านการแข็งตัวของเลือดชนิดรับประทาน (DOACs/warfarin) และยาควบคุมอัตรา/จังหวะ
// คัดจาก "2025 Thai guideline for the diagnosis and management of atrial fibrillation" (Ngarmukos T, et al. Asian Biomed 2025;doi:10.2478/abm-2025-0028; PMC12649414; open access)
// ต้นฉบับภาษาอังกฤษ สรุปเป็นไทย คงชื่อยา ขนาดยา และระดับคำแนะนำ (Class/Level) ตามตารางต้นฉบับ · อ้างตารางที่ 7–15 · ยังไม่ได้ทบทวนโดยเภสัชกร
import type { Block, Guideline } from './types';

const o = 'จากแนวทางไทย AF 2568 (open access) — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'ใครควรได้ยาต้านการแข็งตัวของเลือด (OAC)', origin: o, sub: 'ความเสี่ยงด้วย CHA2DS2-VA และตารางที่ 7', items: [
    { k: 'CHA2DS2-VA', v: 'คะแนน ≥ 2 = ความเสี่ยงสูง ควรได้ OAC · คะแนน 1 = ความเสี่ยงปานกลาง พิจารณาเทียบกับความเสี่ยงเลือดออก · ประเมินซ้ำเป็นระยะ' },
    { k: 'ให้ OAC โดยไม่ต้องคิดคะแนน (I, B)', v: 'AF ร่วมกับ hypertrophic cardiomyopathy, cardiac amyloidosis, rheumatic mitral stenosis ระดับปานกลาง–รุนแรง หรือลิ้นหัวใจเทียมชนิดโลหะ' },
    { k: 'Atrial flutter (I, B)', v: 'ประเมินความเสี่ยงและพิจารณา OAC เช่นเดียวกับ AF' },
    { k: 'น้ำหนักตัวน้อย (ในคนไทย)', v: 'เป็นปัจจัยเสี่ยงเพิ่มของ ischemic stroke แม้ CHA2DS2-VA = 0 แต่ก็เพิ่มความเสี่ยงเลือดออก/ICH จึงต้องตัดสินใจเริ่ม OAC อย่างรอบคอบ' },
    { k: 'Subclinical AF จากอุปกรณ์ (IIb, B)', v: 'อาจให้ OAC เมื่อไม่มีอาการ นานอย่างน้อย 6 นาที และ CHA2DS2-VA ≥ 4 โดยพิจารณาความเสี่ยงเลือดออกรายบุคคล (ARTESIA: apixaban ลดความเสี่ยงในกลุ่มนี้)' },
  ] },
  { kind: 'kv', h: 'การเลือก OAC: DOACs หรือ warfarin', origin: o, sub: 'ตารางที่ 8', items: [
    { k: 'DOACs เป็นยาแนวแรก (I, A)', v: 'AF ที่ไม่มี rheumatic MS ระดับปานกลาง–รุนแรง และไม่มีลิ้นหัวใจเทียมชนิดโลหะ · DOACs ที่ใช้ในประเทศไทย: dabigatran (thrombin inhibitor), apixaban, edoxaban, rivaroxaban (factor Xa inhibitors) · ไม่ด้อยกว่า VKA ในการป้องกัน stroke และเลือดออกในสมองน้อยกว่า' },
    { k: 'Warfarin เป็นทางเลือก (I, A)', v: 'AF ที่ไม่มี MS/ลิ้นเทียมแต่ใช้ DOACs ไม่ได้' },
    { k: 'Warfarin ที่จำเป็น (I, A)', v: 'AF ที่มี rheumatic MS ระดับปานกลาง–รุนแรง หรือลิ้นหัวใจเทียมชนิดโลหะ' },
    { k: 'เป้าหมาย INR และ TTR', v: 'INR 2.0–3.0 (I, B) · TTR อย่างน้อย 65% (IIa, A) · อายุ ≥ 70 ปี อาจลดเป้า INR เป็น 1.5–3.0 เพื่อลดเลือดออกรุนแรง (IIb, B)' },
    { k: 'ขนาดเริ่มต้น warfarin ในคนไทย', v: 'เริ่ม 2.5–3 มก./วัน ถึงเป้า INR เร็วกว่า ขนาด 5 มก. มักทำให้ INR สูงเกิน · ขนาดเฉลี่ยในคนไทย 2.6 มก./วัน (ตารางที่ 9)' },
  ] },
  { kind: 'kv', h: 'ขนาดยา OAC อันตรกิริยา และเภสัชจลนศาสตร์', origin: o, sub: 'ตารางที่ 9 · BID = วันละ 2 ครั้ง, QD = วันละครั้ง', items: [
    { k: 'Warfarin', v: 'ตาม INR (เฉลี่ยในคนไทย 2.6 มก./วัน) · half-life 20–60 ชม. · ขับทางไต 0% · อันตรกิริยามาก: ยายับยั้ง/เหนี่ยวนำ CYP2C9, 1A2, 3A4, ยาปฏิชีวนะ, ยาต้านเชื้อรา, สมุนไพร' },
    { k: 'Dabigatran', v: '150 มก. BID (ลดเป็น 110 มก. BID ถ้าอายุ ≥ 80 ปี หรือใช้ร่วมกับ verapamil) · half-life 12–17 ชม. · ขับทางไต 80% ทางน้ำดี 20% · หลีกเลี่ยง/ระวัง: strong P-gp inhibitors (เช่น dronedarone, ketoconazole, itraconazole) และ strong P-gp inducers (เช่น rifampin, carbamazepine, phenytoin)' },
    { k: 'Rivaroxaban', v: '20 มก. QD พร้อมอาหาร (ลดเป็น 15 มก. QD ถ้า CrCl 15–49 มล./นาที) · half-life 5–9 ชม. (อายุน้อย), 11–13 ชม. (สูงอายุ) · ขับทางไต 67% ตับ/น้ำดี 33% · อันตรกิริยา: strong P-gp inhibitors และ CYP3A4 inhibitors (ketoconazole, itraconazole, ritonavir), strong P-gp/CYP3A4 inducers (rifampin, carbamazepine, phenytoin, phenobarbital)' },
    { k: 'Apixaban', v: '5 มก. BID (ลดเป็น 2.5 มก. BID เมื่อเข้า 2 ใน 3 ข้อ: อายุ ≥ 80 ปี, น้ำหนัก < 60 กก., serum creatinine ≥ 1.5 มก./ดล.) · half-life 12 ชม. · ขับทางไต 27–30% ตับ/น้ำดี 70% · อันตรกิริยาเหมือน rivaroxaban' },
    { k: 'Edoxaban', v: '60 มก. QD (ลดเป็น 30 มก. QD ถ้า CrCl 15–50 มล./นาที, น้ำหนัก < 60 กก. หรือใช้ร่วมกับ ciclosporin, dronedarone, erythromycin, ketoconazole) · half-life 10–14 ชม. · ขับทางไต 50% ตับ/น้ำดี 50% · อันตรกิริยา: strong P-gp inhibitors (เช่น ritonavir), strong P-gp inducers (rifampin, carbamazepine, phenytoin, phenobarbital) · edoxaban 15 มก. QD ศึกษาในผู้สูงอายุกลุ่มเฉพาะ (ดูหัวข้อ AF ในผู้สูงอายุของแนวทาง)' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังของ DOACs', origin: o, danger: true, items: [
    { t: 'DOACs ไม่ต้องตรวจระดับยาเป็นประจำ แต่ควรตรวจ CBC การทำงานของตับ และไตเป็นระยะ' },
    { t: 'ในคนเอเชียมักสั่งขนาดลด (เช่น rivaroxaban 15 มก. เมื่อ CrCl > 50) เพราะกังวลเลือดออก การศึกษาเภสัชจลนศาสตร์ในคนไทยชี้ว่าอาจเหมาะ แต่ meta-analysis ชี้ว่าขนาดลดลดเลือดออกรุนแรงแต่ป้องกัน ischemic stroke ได้น้อยกว่าขนาดมาตรฐาน — ควรตัดสินใจร่วมกับผู้ป่วยอย่างรอบคอบ' },
    { t: 'Dabigatran ต้องลดเป็น 110 มก. BID เมื่อใช้ร่วมกับ verapamil (ใช้ verapamil ควบคุมอัตราการเต้นของหัวใจ)' },
    { t: 'หลีกเลี่ยงการใช้ DOAC ร่วมกับยาที่เป็น strong P-gp/CYP3A4 inhibitors หรือ inducers ตามตารางที่ 9 เช่น ketoconazole, itraconazole, ritonavir, rifampin, carbamazepine, phenytoin, phenobarbital' },
    { t: 'ก่อนเริ่ม OAC ประเมินและแก้ไขปัจจัยเสี่ยงเลือดออกที่แก้ได้ เช่น ความดันสูงที่คุมไม่ได้ และการดื่มแอลกอฮอล์มาก รวมถึงโรคตับและไต · ความเสี่ยงเลือดออกสูงไม่ใช่ข้อห้ามของ OAC แต่ต้องติดตามใกล้ชิด' },
  ] },
  { kind: 'kv', h: 'เลือดออกจาก OAC และยาแก้ฤทธิ์', origin: o, sub: 'ตารางที่ 10', items: [
    { k: 'เลือดออกเล็กน้อย', v: 'ลดขนาดหรือหยุดยาชั่วคราว และติดตามอาการใกล้ชิด' },
    { k: 'เลือดออกรุนแรง', v: 'หยุด OAC ถ้าคุมเลือดออกไม่ได้ จนกว่าจะพบและควบคุมสาเหตุ (I, C) · ประเมินความเสี่ยงเลือดออกก่อนเริ่ม OAC และประเมินซ้ำเป็นระยะ (I, B)' },
    { k: 'ยาแก้ฤทธิ์ (IIa, B)', v: 'Vitamin K แก้ฤทธิ์ warfarin · Idarucizumab แก้ฤทธิ์ dabigatran (direct thrombin inhibitor) · Andexanet alfa แก้ฤทธิ์ factor Xa inhibitors (apixaban, edoxaban, rivaroxaban) · เลือกตามบริบทของสถานพยาบาล' },
    { k: 'ผลิตภัณฑ์เลือด (IIa, C)', v: 'FFP ทดแทน coagulation factors โดยเฉพาะผู้ที่ใช้ warfarin · PCC (factor II, VII, IX, X) ใช้บ่อยในเลือดออกรุนแรงจาก warfarin หรือ DOAC' },
    { k: 'กลับมาใช้ OAC หลังเลือดออก', v: 'ขึ้นกับความรุนแรง สาเหตุ และความเสี่ยง stroke · GI bleeding: การกลับมาใช้ OAC สัมพันธ์กับ stroke/thromboembolism และการเสียชีวิตที่ลดลง แม้เลือดออกซ้ำสูงขึ้น · LAAO พิจารณาเมื่อมีข้อห้ามสัมบูรณ์ต่อ OAC (IIb, C)' },
  ] },
  { kind: 'kv', h: 'ยาควบคุมอัตราการเต้นของหัวใจ (rate control)', origin: o, sub: 'ตารางที่ 11–12 · เป้าหมาย HR < 110 ครั้ง/นาที หรือต่ำกว่าถ้ายังมีอาการ หลีกเลี่ยง bradycardia (IIa, B)', items: [
    { k: 'การเลือกยา', v: 'LVEF > 40%: beta-blocker, verapamil/diltiazem (NDCCB) หรือ digoxin (I, A) · LVEF ≤ 40%: beta-blocker หรือ digoxin (I, A) · NDCCB ไม่แนะนำเมื่อ LVEF ≤ 40% · ใช้ยาร่วมสองตัวเมื่อคุม HR < 110 ไม่ได้ ระวัง bradycardia (IIa, C) · Amiodarone ใน HFrEF ที่ใช้ beta-blocker/digoxin ไม่ได้ (IIb, C)' },
    { k: 'Beta-blocker (ปากทาน)', v: 'Metoprolol XL 50–200 มก. วันละครั้ง · Bisoprolol 1.25–20 มก. วันละครั้ง · Nebivolol 2.5–10 มก. วันละครั้ง · Carvedilol 3.125–50 มก. วันละ 2 ครั้ง · Metoprolol tartrate 25–100 มก. วันละ 2 ครั้ง และ Atenolol 25–100 มก. วันละครั้ง (ไม่แนะนำเมื่อ LVEF ≤ 40%) · เลี่ยง non-selective ในโรคหืด · เลี่ยงใน acute HF' },
    { k: 'Esmolol (ฉีด)', v: '500 ไมโครกรัม/กก. IV bolus ใน 1 นาที แล้ว 50–300 ไมโครกรัม/กก./นาที สำหรับคุมอัตราเร่งด่วน' },
    { k: 'Verapamil', v: 'IV 2.5–10 มก. bolus ใน 5 นาที · ปากทาน 40 มก. วันละ 2 ครั้ง ถึง 480 มก. (ออกฤทธิ์ช้า) วันละครั้ง · ไม่แนะนำเมื่อ LVEF ≤ 40% · ลด dabigatran เป็น 110 มก. BID' },
    { k: 'Diltiazem', v: 'IV 0.25 มก./กก. bolus อย่างน้อย 5 นาที แล้ว 5–15 มก./ชม. · ปากทาน 60 มก. วันละ 3 ครั้ง ถึง 360 มก. (ออกฤทธิ์ช้า) วันละครั้ง · ไม่แนะนำเมื่อ LVEF ≤ 40%' },
    { k: 'Digoxin', v: 'IV 0.5 มก. bolus (0.75–1.5 มก. ใน > 24 ชม. แบ่ง 2–3 ครั้ง) · ปากทาน 0.0625–0.125 มก. วันละครั้ง · ใช้ร่วมกับยาอื่นหรือเดี่ยว (IIa, B) · ระดับในเลือด ≤ 1.2 ng/mL (IIa, B) · ระวังใน CKD ต้องปรับขนาด' },
    { k: 'Amiodarone', v: 'IV 300 มก. ใน 5% dextrose 250 มล. นาน > 30–60 นาที แล้ว 900–1,200 มก. ใน 24 ชม. · ปากทาน 200 มก. วันละครั้งหลัง IV loading หรือ 200 มก. วันละ 3 ครั้งนาน 4 สัปดาห์ แล้ว 200 มก. (หรือน้อยกว่า) วันละครั้ง · ผู้ไม่คงที่ทางเลือด: amiodarone, esmolol หรือ digoxin IV (IIb, C)' },
    { k: 'Magnesium', v: '3–5 กรัม IV ใน 10–20 นาที (ไม่แนะนำใน post-operative AF) · ผลข้างเคียงที่พบบ่อย: หน้าแดง · พบน้อย: ความดันต่ำ ต้องเฝ้าระวังหลังให้' },
  ] },
  { kind: 'kv', h: 'ยาควบคุมจังหวะ (rhythm control)', origin: o, sub: 'ตารางที่ 14–15', items: [
    { k: 'การเลือกยา', v: 'ไม่มีโรคหัวใจโครงสร้าง: flecainide, propafenone หรือ dronedarone (I, A) · มีโรคหัวใจอื่น (CAD, LVH จากความดันสูง) แต่ไม่มี severe HF: dronedarone (I, A) · severe HF (HFrEF NYHA III–IV หรือเพิ่งมี decompensation ภายใน 1 เดือน) หรือใช้ยาอื่นไม่ได้: amiodarone (I, A) · ควรให้ยากลุ่ม AV nodal blocking (beta-blocker, verapamil, diltiazem) ร่วมกับ flecainide/propafenone เพื่อป้องกัน flutter 1:1 (IIa, C)' },
    { k: 'Flecainide', v: 'เริ่ม 50 มก./ครั้ง วันละ 2 ครั้ง · ระยะยาว 100–150 มก./ครั้ง วันละ 2 ครั้ง · ตรวจ QRS ที่ 2–4 สัปดาห์และเมื่อปรับขนาด · ผลข้างเคียง: AFL with 1:1 AV conduction จึงต้องให้ AV nodal blocking drug ร่วมเสมอ' },
    { k: 'Propafenone', v: 'เริ่ม 150 มก./ครั้ง วันละ 3 ครั้ง · ระยะยาว 300 มก./ครั้ง วันละ 3 ครั้ง · ตรวจ QRS เช่นเดียวกัน · ผลข้างเคียงเหมือน flecainide' },
    { k: 'Dronedarone', v: '400 มก./ครั้ง วันละ 2 ครั้ง ทั้งเริ่มและระยะยาว · ตรวจ QTc และ LFT เป็นระยะ (เช่นทุก 6 เดือน) · ผลข้างเคียง: Torsade de Pointes (พบน้อย), bradycardia, พิษต่อตับ (พบน้อย)' },
    { k: 'Amiodarone', v: 'Loading รวม 6–10 กรัม: ผู้ป่วยใน 300 มก. IV นาน > 30–60 นาที แล้ว 900–1,200 มก. IV ใน 24 ชม. จากนั้นปากทาน 200 มก. วันละ 3 ครั้งจนถึงรวม 6–10 กรัม · ผู้ป่วยนอก 200 มก. วันละ 3 ครั้งจนถึงรวม 6–10 กรัม · ขนาดต่อเนื่อง 100–200 มก. วันละครั้ง · half-life เฉลี่ย 58 วัน · ติดตาม QTc, LFT, TFT เป็นระยะ (เช่นทุก 6 เดือน), chest X-ray เมื่อมีอาการทางเดินหายใจ · ผลข้างเคียง: Torsade de Pointes (พบน้อย), bradycardia, ผิวสีเทาน้ำเงิน, corneal microdeposit, พิษต่อตับ, ไทรอยด์ผิดปกติ, pulmonary fibrosis' },
    { k: 'เกณฑ์ลดหรือหยุดยา', v: 'Flecainide/propafenone: QRS กว้างขึ้น > 25% จากค่าเริ่มต้น พิจารณาลดขนาดหรือหยุด · Dronedarone/amiodarone: QTc > 500 ms พิจารณาลดขนาดหรือหยุด' },
  ] },
];

export const AF_GUIDELINE: Guideline = {
  id: 'af', title: 'AF: ยาต้านการแข็งตัวของเลือด (DOACs) และยาควบคุมจังหวะ', category: 'โรคหัวใจ ไต และเมตาบอลิก', accent: '#7A4FD6', icon: '💓',
  keywords: ['AF', 'atrial fibrillation', 'หัวใจห้องบนเต้นระริก', 'DOAC', 'NOAC', 'apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban', 'warfarin', 'idarucizumab', 'andexanet', 'amiodarone', 'dronedarone', 'flecainide', 'propafenone', 'digoxin', 'verapamil', 'diltiazem', 'CHA2DS2-VA', 'bleeding'],
  drugs: [
    { name: 'Apixaban', group: 'DOACs', aliases: ['Apixaban', 'apixaban'] }, { name: 'Rivaroxaban', group: 'DOACs', aliases: ['Rivaroxaban', 'rivaroxaban'] },
    { name: 'Dabigatran', group: 'DOACs', aliases: ['Dabigatran', 'dabigatran'] }, { name: 'Edoxaban', group: 'DOACs', aliases: ['Edoxaban', 'edoxaban'] },
    { name: 'Warfarin', group: 'Warfarin และยาแก้ฤทธิ์', aliases: ['Warfarin', 'warfarin'] },
    { name: 'ยาแก้ฤทธิ์ warfarin และ DOACs', group: 'Warfarin และยาแก้ฤทธิ์', aliases: ['Idarucizumab', 'Andexanet', 'Vitamin K', 'PCC', 'FFP'], members: [{ name: 'Vitamin K', aliases: ['Vitamin K'] }, { name: 'Idarucizumab', aliases: ['Idarucizumab'] }, { name: 'Andexanet alfa', aliases: ['Andexanet'] }, { name: 'PCC', aliases: ['PCC'] }, { name: 'FFP', aliases: ['FFP'] }] },
    { name: 'Beta-blocker', group: 'ยาควบคุมอัตราการเต้น', aliases: ['Beta-blocker', 'beta-blocker'], members: [{ name: 'Metoprolol', aliases: ['Metoprolol'] }, { name: 'Bisoprolol', aliases: ['Bisoprolol'] }, { name: 'Nebivolol', aliases: ['Nebivolol'] }, { name: 'Carvedilol', aliases: ['Carvedilol'] }, { name: 'Atenolol', aliases: ['Atenolol'] }, { name: 'Esmolol', aliases: ['Esmolol'] }] },
    { name: 'Verapamil', group: 'ยาควบคุมอัตราการเต้น', aliases: ['Verapamil'] }, { name: 'Diltiazem', group: 'ยาควบคุมอัตราการเต้น', aliases: ['Diltiazem'] },
    { name: 'Digoxin', group: 'ยาควบคุมอัตราการเต้น', aliases: ['Digoxin', 'digoxin'] }, { name: 'Magnesium', group: 'ยาควบคุมอัตราการเต้น', aliases: ['Magnesium'] },
    { name: 'Amiodarone', group: 'ยาควบคุมจังหวะ', aliases: ['Amiodarone', 'amiodarone'] }, { name: 'Dronedarone', group: 'ยาควบคุมจังหวะ', aliases: ['Dronedarone', 'dronedarone'] },
    { name: 'Flecainide', group: 'ยาควบคุมจังหวะ', aliases: ['Flecainide'] }, { name: 'Propafenone', group: 'ยาควบคุมจังหวะ', aliases: ['Propafenone'] },
  ],
  source: '2025 Thai guideline for the diagnosis and management of atrial fibrillation · Thai Heart Association และผู้ร่วมจัดทำ',
  cites: [
    'Ngarmukos T, Methavigul K, Rungpradubvong V, et al. 2025 Thai guideline for the diagnosis and management of atrial fibrillation. Asian Biomed (Res Rev News). 2025. doi:10.2478/abm-2025-0028 · PMC12649414 · CC BY 4.0 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12649414/',
    'สรุปเป็นภาษาไทยจากตารางที่ 7–15 ของบทความ (ฉบับภาษาอังกฤษ ไม่มีเลขหน้า) ระดับคำแนะนำ (Class/Level) ตามต้นฉบับ',
    'ยังไม่ครอบคลุม: การวินิจฉัย การคัดกรอง AF ในผู้สูงอายุ/หลังผ่าตัด/ACS/PCI การทำ cardioversion และการใช้ OAC ก่อน-หลังหัตถการ catheter ablation การปิดรูหู LAAO และตารางอื่นของแนวทางฉบับเต็ม · เนื้อหาวอร์ฟารินโดยละเอียด (ปรับตาม INR, bridging, ตั้งครรภ์) อยู่ในการ์ดวอร์ฟาริน',
  ],
  summary: [
    'CHA2DS2-VA ≥ 2 ควรได้ OAC · 1 คะแนนพิจารณาเทียบความเสี่ยงเลือดออก',
    'DOACs เป็นยาแนวแรก (I, A) · Warfarin เมื่อมี rheumatic MS ระดับปานกลาง–รุนแรง หรือลิ้นหัวใจเทียมชนิดโลหะ (I, A)',
    'Dabigatran 150 mg BID (110 mg BID ถ้าอายุ ≥ 80 ปี หรือใช้ร่วม verapamil) · Rivaroxaban 20 mg QD พร้อมอาหาร (15 mg QD ถ้า CrCl 15–49)',
    'Apixaban 5 mg BID (2.5 mg BID เมื่อเข้า 2 ใน 3 ข้อ: อายุ ≥ 80 ปี น้ำหนัก < 60 กก. serum creatinine ≥ 1.5) · Edoxaban 60 mg QD (30 mg QD ถ้า CrCl 15–50 หรือน้ำหนัก < 60 กก.)',
    'Warfarin INR 2.0–3.0 (I, B) · TTR อย่างน้อย 65% · เริ่ม 2.5–3 มก./วันในคนไทย',
    'ยาแก้ฤทธิ์: vitamin K (warfarin) · idarucizumab (dabigatran) · andexanet alfa (factor Xa inhibitors)',
    'ควบคุมอัตรา HR < 110 ครั้ง/นาที: beta-blocker, verapamil/diltiazem หรือ digoxin เมื่อ LVEF > 40% · ไม่ใช้ verapamil/diltiazem เมื่อ LVEF ≤ 40%',
    'ควบคุมจังหวะ: flecainide, propafenone หรือ dronedarone เมื่อไม่มีโรคหัวใจโครงสร้าง · amiodarone เมื่อมี severe HF',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [
    { title: 'ข้อบ่งชี้ OAC', blocks: [0] }, { title: 'เลือก OAC', blocks: [1] }, { title: 'ขนาดยา', blocks: [2] }, { title: 'ข้อควรระวัง', blocks: [3] },
    { title: 'เลือดออก', blocks: [4] }, { title: 'ควบคุมอัตรา', blocks: [5] }, { title: 'ควบคุมจังหวะ', blocks: [6] },
  ],
};
