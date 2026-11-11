// หัวใจล้มเหลว — คัดจาก "แนวทางเวชปฏิบัติเพื่อการวินิจฉัยและการดูแลรักษาผู้ป่วยภาวะหัวใจล้มเหลว พ.ศ. 2562" (HFCT 2019 สมาคมแพทย์โรคหัวใจแห่งประเทศไทย; ไฟล์ PDF ฉบับเต็ม 68 หน้า ที่ผู้ใช้ส่งลิงก์ Google Drive)
// เลือกเฉพาะส่วนยา: HFrEF, HFpEF, หัวใจล้มเหลวเฉียบพลัน · ระดับคำแนะนำ (ระดับ, คุณภาพหลักฐาน) ตามต้นฉบับ เช่น (I, A)
// เลขหน้าในวงเล็บคือเลขหน้าที่พิมพ์ในเล่ม (PDF หน้า = เลขที่พิมพ์ + 3) · ข้อความไทยจากไฟล์ตกหล่นสระ/วรรณยุกต์ ผมแก้ให้อ่านง่ายโดยไม่เปลี่ยนความหมาย · ยังไม่ได้ทบทวนโดยเภสัชกร
import type { Block, Guideline } from './types';

const o = 'จากแนวทางหัวใจล้มเหลว 2562 (HFCT) — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'ภาพรวมยาใน HFrEF (LVEF < 40%)', origin: o, sub: 'หน้า 19', items: [
    { k: 'ลดอัตราการเสียชีวิตในผู้ป่วยส่วนใหญ่', v: 'ACEI/ARB, beta-blocker, MRA' },
    { k: 'ลดอัตราการเสียชีวิตในผู้ป่วยเฉพาะกลุ่ม', v: 'ARNI (sacubitril/valsartan), ICD, CRT' },
    { k: 'ลดการเข้ารักษาในโรงพยาบาล ประโยชน์ลดอัตราการเสียชีวิตไม่ชัดเจน', v: 'If inhibitor (ivabradine), digoxin, isosorbide dinitrate/hydralazine' },
    { k: 'SGLT2 inhibitors', v: 'มีประโยชน์ลดความเสี่ยงการนอนโรงพยาบาลจากหัวใจล้มเหลวในผู้ป่วยที่มีความเสี่ยง เช่น เบาหวาน รวมถึงผู้ป่วย HFrEF ที่ไม่เป็นเบาหวาน (ตามที่ระบุในหน้า 19 · แนวทางฉบับนี้พิมพ์ปี 2562 ไม่มีตารางขนาดยา/คำแนะนำเฉพาะ)' },
  ] },
  { kind: 'kv', h: 'ACEI และ ARB', origin: o, sub: 'ตารางที่ 10–11 (หน้า 20-21)', items: [
    { k: 'ACEI', v: 'ผู้ป่วย LVEF < 40% ทุกรายแม้ไม่มีอาการ ถ้าไม่มีข้อห้าม (I, A) · ผู้ที่มีอาการเคยแสดง เพื่อลดอัตราการเสียชีวิตและการนอนโรงพยาบาล (I, A) · เริ่มขนาดต่ำในผู้ที่อาการคงที่ แล้วเพิ่มช้า ๆ ให้ถึงขนาดสูงสุดตามเป้าหมาย (I, A) · ประโยชน์เพิ่มตามขนาดยา · ระวังความดันต่ำและไตวายเฉียบพลันระหว่างเพิ่มขนาด โดยเฉพาะขาดน้ำหรือได้ยาขับปัสสาวะมากเกินไป ให้ปรับยาขับปัสสาวะตามภาวะน้ำเกิน' },
    { k: 'ARB', v: 'ใช้เมื่อมีผลข้างเคียงจาก ACEI (ยกเว้นมีข้อห้าม ARB) (I, A) · candesartan ลดอัตราการเสียชีวิตในผู้ที่ใช้ ACEI ไม่ได้ · valsartan ลดการนอนโรงพยาบาลในผู้ที่ได้ ACEI อยู่แล้ว · เริ่มขนาดต่ำและเพิ่มช้า ๆ (I, A) · น่าพิจารณาใช้ ARB เป็นยาแรกแทน ACEI ในผู้ที่ใช้ ARB อยู่แล้วจากข้อบ่งชี้อื่น (IIa, A)' },
    { k: 'ห้ามใช้ร่วมกัน', v: 'ไม่แนะนำ ACEI, ARB และ MRA พร้อมกันทั้งหมดในผู้ป่วย HFrEF เพราะอาจเป็นอันตราย (III, C)' },
  ] },
  { kind: 'kv', h: 'Beta-blocker', origin: o, sub: 'ตารางที่ 12 (หน้า 21-22)', items: [
    { k: 'ข้อบ่งชี้', v: 'LVEF < 40% และเคยมีกล้ามเนื้อหัวใจตาย แม้ไม่มีอาการ (I, B) · LVEF < 40% แม้ไม่มีอาการและไม่เคยกล้ามเนื้อหัวใจตาย (I, C) · พิจารณาในผู้ป่วยที่อัตราเต้นหัวใจเร็วจาก atrial fibrillation เพื่อควบคุมอัตราการเต้น' },
    { k: 'ชนิดที่มีหลักฐาน', v: 'เลือกหนึ่งในสี่ชนิด: bisoprolol, carvedilol, sustained-release metoprolol succinate หรือ nebivolol (I, A)' },
    { k: 'การปรับขนาด', v: 'เริ่มขนาดต่ำในผู้ที่อาการคงที่ แล้วเพิ่มช้า ๆ ให้ถึงขนาดสูงสุดที่ใช้ได้ (I, A) · beta-blocker และ ACEI เสริมประโยชน์กัน ควรได้ทั้งสองชนิด เริ่มกลุ่มใดก่อนหรือเริ่มพร้อมกันก็ได้' },
  ] },
  { kind: 'grid5', h: 'ขนาดยาที่แนะนำใน HFrEF ที่มีอาการ', origin: o, sub: 'ตารางที่ 13 (หน้า 22) · o.d. = วันละครั้ง, b.i.d. = วันละ 2 ครั้ง, t.i.d. = วันละ 3 ครั้ง', head: ['กลุ่ม', 'ยา', 'ขนาดเริ่มต้น', 'ขนาดที่ควรได้', 'ขนาดเฉลี่ยในการศึกษา'], items: [
    { c1: 'ACEI', c2: 'Captopril', c3: '6.25 mg t.i.d.', c4: '50 mg t.i.d.', c5: '122.7 mg/d' },
    { c1: 'ACEI', c2: 'Enalapril', c3: '2.5 mg b.i.d.', c4: '10–20 mg b.i.d.', c5: '16.6 mg/d' },
    { c1: 'ACEI', c2: 'Lisinopril', c3: '2.5–5 mg o.d.', c4: '20–40 mg o.d.', c5: '32.5–35 mg/d' },
    { c1: 'ACEI', c2: 'Ramipril', c3: '1.25–2.5 mg o.d.', c4: '10 mg o.d.', c5: 'n/a' },
    { c1: 'ARB', c2: 'Candesartan', c3: '4–8 mg o.d.', c4: '32 mg o.d.', c5: '24 mg/d' },
    { c1: 'ARB', c2: 'Losartan', c3: '25–50 mg o.d.', c4: '50–150 mg o.d.', c5: '129 mg/d' },
    { c1: 'ARB', c2: 'Valsartan', c3: '20–40 mg b.i.d.', c4: '160 mg b.i.d.', c5: '254 mg/d' },
    { c1: 'Beta-blocker', c2: 'Bisoprolol', c3: '1.25 mg o.d.', c4: '10 mg o.d.', c5: '8.6 mg/d' },
    { c1: 'Beta-blocker', c2: 'Carvedilol', c3: '3.125 mg b.i.d.', c4: '25 mg b.i.d.', c5: '37 mg/d' },
    { c1: 'Beta-blocker', c2: 'Sustained-release metoprolol succinate', c3: '12.5–25 mg o.d.', c4: '200 mg o.d.', c5: '159 mg/d' },
    { c1: 'Beta-blocker', c2: 'Nebivolol', c3: '1.25 mg o.d.', c4: '10 mg o.d.', c5: '7.7 mg/d' },
  ] },
  { kind: 'kv', h: 'MRA (spironolactone)', origin: o, sub: 'ตารางที่ 14 (หน้า 23)', items: [
    { k: 'ข้อบ่งชี้', v: 'แนะนำ MRA (spironolactone) ขนาดต่ำในผู้ป่วย HFrEF เรื้อรังที่ยังมีอาการ (LVEF < 35%, NYHA II–IV แม้ได้ ACEI และ beta-blocker) ถ้าไม่มีข้อห้าม เพื่อลดอัตราการเสียชีวิตและการนอนโรงพยาบาล (I, A)' },
    { k: 'การเฝ้าระวังโพแทสเซียม', v: 'ตรวจโพแทสเซียมอย่างช้า 7 วันหลังเพิ่มขนาดยา · ตรวจทุก 3 เดือนเป็นอย่างต่ำในผู้ที่อาการคงที่ · ระวังการจ่ายโพแทสเซียมเสริม ถ้าจำเป็นให้ติดตามบ่อยขึ้น' },
    { k: 'ข้อห้ามและข้อควรระวัง', v: 'หลีกเลี่ยงขนาดสูง: spironolactone ตั้งแต่ 50 มก./วัน · ห้ามใช้ MRA, ACEI และ ARB พร้อมกัน · ไม่ควรเริ่มเมื่อ creatinine สูง (> 2.5 มก./ดล. ชาย, > 2.0 มก./ดล. หญิง หรือ eGFR < 30 มล./นาที/1.73 ตร.ม.) · ไม่ควรเริ่มเมื่อโพแทสเซียมตั้งต้น > 5.0 มิลลิโมล/ลิตร' },
  ] },
  { kind: 'kv', h: 'ARNI (sacubitril/valsartan)', origin: o, sub: 'ตารางที่ 15–16 (หน้า 24-25)', items: [
    { k: 'ข้อบ่งชี้', v: 'แนะนำใช้แทน ACEI/ARB ใน HFrEF LVEF < 40% ที่ได้ ACEI/ARB, beta-blocker และ MRA เหมาะสมแล้วแต่ยังมีอาการ เพื่อลดอัตราการเสียชีวิตและนอนโรงพยาบาล (I, B) · อาจเริ่ม ARNI แม้ไม่เคยได้ ACEI/ARB ถ้าไม่เสี่ยงผลข้างเคียง SBP ควร > 100 มม.ปรอท และอายุ < 75 ปี เริ่มขนาดต่ำแล้วเพิ่มช้า ๆ (IIb, C)' },
    { k: 'หลีกเลี่ยงเมื่อ', v: 'SBP < 90 มม.ปรอท · eGFR < 30 มล./นาที/1.73 ตร.ม. · โพแทสเซียม > 5.2 มิลลิโมล/ลิตร · เคยเกิด angioedema · ห้ามใช้ในสตรีมีครรภ์โดยเด็ดขาด' },
    { k: 'ห้ามใช้ร่วม ACEI', v: 'ห้ามใช้ ARNI ร่วมกับ ACEI (ความดันต่ำมากและ angioedema) · เปลี่ยนจาก ACEI เป็น ARNI ต้องงด ACEI อย่างน้อย 36 ชั่วโมงก่อนเริ่ม · เปลี่ยนจาก ARB เป็น ARNI ต่อกันได้ ไม่ต้องงด' },
    { k: 'ขนาดเริ่มต้น (ตารางที่ 16)', v: 'ขนาด RAAS blocker ล่าสุดไม่ต่ำกว่า enalapril ≥ 10 มก./วัน, lisinopril ≥ 10, perindopril ≥ 4, ramipril ≥ 5, losartan ≥ 50, valsartan ≥ 160, candesartan ≥ 16, irbesartan ≥ 150, olmesartan ≥ 10, telmisartan ≥ 40 มก./วัน: เริ่ม 49/51 มก. วันละ 2 ครั้ง ปรับให้ถึง 97/103 มก. วันละ 2 ครั้งใน 3–4 สัปดาห์ · ขนาดต่ำกว่าที่ระบุ หรือไม่เคยได้ RAAS blocker หรือเสี่ยงความดันต่ำ: เริ่ม 24/26 มก. วันละ 2 ครั้ง ปรับให้ถึง 97/103 มก. วันละ 2 ครั้งใน 6 สัปดาห์' },
  ] },
  { kind: 'kv', h: 'Ivabradine, Hydralazine/Isosorbide dinitrate, Digoxin', origin: o, sub: 'ตารางที่ 17 (หน้า 25-26)', items: [
    { k: 'Ivabradine', v: 'น่าพิจารณาใน HFrEF ≤ 35% ที่ได้ ACEI/ARB, beta-blocker และ MRA เต็มที่แล้วแต่ยังมีอาการ และ sinus rhythm > 70 ครั้ง/นาที เพื่อลดการนอนโรงพยาบาลหรือการเสียชีวิตจากโรคหัวใจ (IIa, B) · อย. ประเทศไทยอนุมัติเมื่อยังมีอาการและ sinus rhythm อัตราเต้น > 70 ครั้ง/นาที แม้ได้ beta-blocker ขนาดสูงสุดที่ใช้ได้แล้ว' },
    { k: 'Hydralazine + isosorbide dinitrate', v: 'อาจพิจารณาใน HFrEF ที่มีอาการโดยใช้ ACEI/ARB ไม่ได้หรือเกิดผลข้างเคียง เพื่อลดอาการ (IIb, B) · ประโยชน์เด่นในกลุ่มแอฟริกัน-อเมริกัน ยังไม่มีการศึกษาเฉพาะกลุ่มในเชื้อชาติอื่นที่ได้ ACEI/beta-blocker แล้ว' },
    { k: 'Digoxin', v: 'อาจพิจารณาใน HFrEF sinus rhythm ที่ได้ ACEI/ARB, beta-blocker, MRA เหมาะสมแล้วแต่ยังมีอาการ เพื่อลดการนอนโรงพยาบาล (IIb, B) · ลดการนอนโรงพยาบาลแต่ไม่ลดอัตราการเสียชีวิต · ดัชนีการรักษาแคบ ควรติดตามระดับยาโดยเฉพาะเมื่อไตไม่คงที่ · อัตราเสียชีวิตสูงขึ้นเมื่อระดับยา > 1.0 ng/mL และอาการเป็นพิษมักเมื่อ > 2.0 ng/mL' },
  ] },
  { kind: 'list', h: 'ข้อห้ามและข้อควรระวังสำคัญ', origin: o, danger: true, items: [
    { t: 'ห้ามใช้ ARNI ร่วมกับ ACEI (งด ACEI อย่างน้อย 36 ชม.) · ห้ามใช้ในสตรีมีครรภ์ · หลีกเลี่ยงเมื่อ SBP < 90, eGFR < 30, K > 5.2 หรือเคยเกิด angioedema' },
    { t: 'ห้ามใช้ MRA, ACEI และ ARB พร้อมกัน (III, C) · MRA: ไม่ควรเริ่มเมื่อ K > 5.0 หรือ creatinine/eGFR ตามเกณฑ์ และหลีกเลี่ยง spironolactone ≥ 50 มก./วัน' },
    { t: 'ไม่แนะนำโคเอนไซม์คิวเทน (Q10) ใน HFrEF เป็น routine (III, B)' },
    { t: 'HFpEF: ไม่แนะนำ nitrate เพื่อเพิ่มสมรรถภาพทางกาย (III, B) และไม่แนะนำ PDE5 inhibitor (sildenafil) เพื่อบรรเทาอาการ (III, B)' },
    { t: 'หัวใจล้มเหลวเฉียบพลัน: ไม่ต้องให้ออกซิเจนเป็น routine (III, C) · ไม่แนะนำ inotrope เป็น routine เพราะอาจเป็นอันตราย (III, A) · น่าหลีกเลี่ยง nitroprusside เมื่อมีกล้ามเนื้อหัวใจขาดเลือดหรือไตผิดปกติ (IIa, C)' },
    { t: 'ใช้ ARB ระวังในผู้ที่ใช้ ACEI/MRA อยู่ ตามข้อห้ามด้านบน · ปรับยาขับปัสสาวะตามภาวะน้ำเกินเพื่อลดความดันต่ำและไตวายเฉียบพลันเมื่อเพิ่ม ACEI' },
  ] },
  { kind: 'kv', h: 'HFpEF และวัคซีน', origin: o, sub: 'ตารางที่ 18–19 (หน้า 27-28)', items: [
    { k: 'หลักการ', v: 'ยังไม่พบการรักษาที่ลดอัตราการเสียชีวิตหรือภาวะแทรกซ้อนได้ชัดเจน · ใช้ยาขับปัสสาวะในขนาดเหมาะสมตามอาการและภาวะคั่งน้ำ ระวังไม่ให้ cardiac output ลดลง (I, C)' },
    { k: 'ความดัน/โรคร่วม', v: 'HFpEF ที่ความดันสูง ลด SBP < 130 มม.ปรอท (I, B) · คัดกรองและรักษาโรคร่วม (I, C)' },
    { k: 'ARB / MRA', v: 'อาจให้ ARB เพื่อลดการนอนโรงพยาบาล (IIb, B) · อาจให้ MRA ขนาดต่ำในผู้ที่ NP สูงหรือเพิ่งนอนโรงพยาบาล (IIb, B) · spironolactone ใน TOPCAT ไม่ลดผลรวมเป้าหมายหลัก ผู้ที่ BNP สูงอาจได้ประโยชน์' },
    { k: 'ไม่แนะนำ', v: 'nitrate เพื่อเพิ่มสมรรถภาพ (III, B) · PDE5 inhibitor (III, B)' },
    { k: 'วัคซีน', v: 'ฉีดวัคซีนไข้หวัดใหญ่ทุกปีในผู้ป่วยหัวใจล้มเหลวทุกราย (I, B) · น่าพิจารณาร่วมกับวัคซีน pneumococcus (IIa, B) · ดูแลโดยทีมสหสาขาวิชาชีพในรายความเสี่ยงสูง (I, A)' },
  ] },
  { kind: 'kv', h: 'หัวใจล้มเหลวเฉียบพลัน: ยาขับปัสสาวะ', origin: o, sub: 'ตารางที่ 23 (หน้า 31-32)', items: [
    { k: 'การเริ่มยา', v: 'แนะนำยาขับปัสสาวะเมื่อมีอาการ/อาการแสดงของน้ำเกิน (I, C) · ไม่เคยได้ยาขับปัสสาวะ: furosemide 20–40 มก. ฉีดเข้าหลอดเลือดดำ · เคยได้อยู่เดิม: ฉีดครั้งแรกในขนาดเทียบเท่าขนาดยากินเดิม (I, B)' },
    { k: 'วิธีให้', v: 'ฉีดเป็นครั้งหรือหยดต่อเนื่องก็ได้ ปรับตามอาการ (I, C) · DOSE: furosemide หยดต่อเนื่องเทียบกับฉีดเป็นครั้งให้ผลต่ออาการและไตใกล้เคียงกัน ขนาดสูงขับปัสสาวะมากกว่าแต่ไตแย่ลงชั่วคราวมากกว่า' },
    { k: 'ติดตาม', v: 'ติดตามปริมาณปัสสาวะ น้ำหนัก การทำงานของไต เกลือแร่ทุกวันระหว่างให้ยาขับปัสสาวะทางหลอดเลือดดำ (I, C) · น่าพิจารณาปรับขนาดตามการทำงานของไต (IIa, C)' },
    { k: 'ดื้อยาขับปัสสาวะ', v: 'ประเมิน tissue perfusion และ volume status ใหม่ · เพิ่มขนาด (I, B) · เปลี่ยนเป็นหยดต่อเนื่อง (IIa, C) · เพิ่ม thiazide หรือ spironolactone (IIa, C) · tolvaptan ใน wet-warm หรือ hyponatremia (IIa, B) · อาจทำ ultrafiltration (IIb, B)' },
    { k: 'เกลือ/น้ำ', v: 'จำกัดโซเดียม < 2 กรัม/วัน ถ้าน้ำเกินควบคุมยากหรือเป็นซ้ำบ่อยแม้ได้ยาขับปัสสาวะเหมาะสมแล้ว (I, C)' },
  ] },
  { kind: 'kv', h: 'หัวใจล้มเหลวเฉียบพลัน: vasodilator, inotrope, vasopressor', origin: o, sub: 'ตารางที่ 24–26 (หน้า 33-34)', items: [
    { k: 'Vasodilator IV (nitroprusside, nitroglycerine)', v: 'ติดตามความดันใกล้ชิด (I, C) · น่าพิจารณาใน wet-warm แบบ vascular type ที่ MAP > 65 มม.ปรอท (IIa, B) · ระวังใน wet-cold ที่ MAP > 65 (IIa, C) · น่าหลีกเลี่ยง nitroprusside เมื่อมีกล้ามเนื้อหัวใจขาดเลือดหรือไตผิดปกติ (IIa, C)' },
    { k: 'Inotrope', v: 'ใช้ใน cardiogenic shock (I, C) · hypoperfusion ร่วมกับความดันต่ำ (MAP < 65) เมื่อ volume status เหมาะสม (I, C) · ติดตาม ECG และความดันใกล้ชิด (I, C) · อาจใช้ IV milrinone หรือ levosimendan ถ้าสงสัย beta-blocker เป็นสาเหตุ hypoperfusion (IIb, C) · ไม่แนะนำเป็น routine (III, A)' },
    { k: 'Vasopressor', v: 'norepinephrine พิจารณาใน cardiogenic shock ที่ไม่ตอบสนอง inotrope (IIb, B)' },
    { k: 'ขนาดยา (ตารางที่ 26)', v: 'Dobutamine 2–20 ไมโครกรัม/กก./นาที · Dopamine 3–5 (inotrope) และ > 5 (vasopressor) ไมโครกรัม/กก./นาที · Levosimendan bolus 12 ไมโครกรัม/กก. ใน 10 นาที แล้ว 0.1 ไมโครกรัม/กก./นาที · Milrinone bolus 25–75 ไมโครกรัม/กก. ใน 20 นาที แล้ว 0.375–0.75 ไมโครกรัม/กก./นาที (ความดันต่ำ หัวใจเต้นเร็ว) · Norepinephrine 0.2–1.0 ไมโครกรัม/กก./นาที · Epinephrine 1 มก. ซ้ำทุก 3–5 นาทีระหว่างกู้ชีพ และ 0.05–0.5 ไมโครกรัม/กก./นาที' },
    { k: 'ออกซิเจน/NIPPV', v: 'ให้ออกซิเจนเมื่อ SpO2 < 90% หรือ PaO2 < 60 มม.ปรอท (I, C) · ไม่ให้เป็น routine (III, C) · น่าพิจารณา NIPPV (CPAP/BiPAP) เมื่อหายใจ > 25 ครั้ง/นาที, SpO2 < 90% และ SBP > 85 (IIa, B)' },
  ] },
];

export const HF_GUIDELINE: Guideline = {
  id: 'hf', title: 'หัวใจล้มเหลว (Heart failure)', category: 'โรคหัวใจ ไต และเมตาบอลิก', accent: '#D6336C', icon: '🫀',
  keywords: ['หัวใจล้มเหลว', 'heart failure', 'HF', 'HFrEF', 'HFpEF', 'ACEI', 'ARB', 'ARNI', 'sacubitril', 'valsartan', 'beta-blocker', 'bisoprolol', 'carvedilol', 'metoprolol', 'spironolactone', 'MRA', 'ivabradine', 'digoxin', 'furosemide', 'tolvaptan', 'dobutamine', 'milrinone'],
  drugs: [
    { name: 'ACEI', group: 'ยาที่ลดอัตราการเสียชีวิต', aliases: ['ACEI', 'Captopril', 'Enalapril', 'Lisinopril', 'Ramipril'] }, { name: 'ARB', group: 'ยาที่ลดอัตราการเสียชีวิต', aliases: ['ARB', 'Candesartan', 'Losartan', 'Valsartan'] },
    { name: 'Beta-blocker', group: 'ยาที่ลดอัตราการเสียชีวิต', aliases: ['Beta-blocker', 'beta-blocker', 'Bisoprolol', 'Carvedilol', 'metoprolol', 'Nebivolol'] },
    { name: 'MRA / Spironolactone', group: 'ยาที่ลดอัตราการเสียชีวิต', aliases: ['MRA', 'spironolactone'] }, { name: 'ARNI (sacubitril/valsartan)', group: 'ยาที่ลดอัตราการเสียชีวิต', aliases: ['ARNI', 'sacubitril'] },
    { name: 'Ivabradine', group: 'ยาเสริมใน HFrEF', aliases: ['Ivabradine', 'ivabradine'] }, { name: 'Hydralazine + ISDN', group: 'ยาเสริมใน HFrEF', aliases: ['Hydralazine', 'hydralazine', 'isosorbide dinitrate'] },
    { name: 'Digoxin', group: 'ยาเสริมใน HFrEF', aliases: ['Digoxin', 'digoxin'] }, { name: 'SGLT2 inhibitors', group: 'ยาเสริมใน HFrEF', aliases: ['SGLT2'] },
    { name: 'ยาขับปัสสาวะ (Furosemide ฯลฯ)', group: 'ยาในภาวะเฉียบพลัน', aliases: ['furosemide', 'ยาขับปัสสาวะ', 'thiazide', 'Tolvaptan', 'tolvaptan'] },
    { name: 'Vasodilator IV', group: 'ยาในภาวะเฉียบพลัน', aliases: ['nitroprusside', 'nitroglycerine', 'Vasodilator'] },
    { name: 'Inotrope / Vasopressor', group: 'ยาในภาวะเฉียบพลัน', aliases: ['Dobutamine', 'Dopamine', 'Levosimendan', 'Milrinone', 'milrinone', 'Norepinephrine', 'norepinephrine', 'Epinephrine', 'inotrope'] },
    { name: 'วัคซีน / Coenzyme Q10', group: 'วัคซีนและอื่นๆ', aliases: ['วัคซีน', 'Q10', 'โคเอนไซม์'] },
  ],
  source: 'แนวทางเวชปฏิบัติเพื่อการวินิจฉัยและการดูแลรักษาผู้ป่วยภาวะหัวใจล้มเหลว พ.ศ. 2562 (HFCT) · สมาคมแพทย์โรคหัวใจแห่งประเทศไทย',
  cites: [
    'แนวทางเวชปฏิบัติเพื่อการวินิจฉัยและการดูแลรักษาผู้ป่วยภาวะหัวใจล้มเหลว พ.ศ. 2562 สมาคมแพทย์โรคหัวใจแห่งประเทศไทย ในพระบรมราชูปถัมภ์ (2019 HFCT Heart Failure Guideline Thai Version; ไฟล์ PDF ฉบับเต็ม 68 หน้า ตามลิงก์ Google Drive ที่ผู้ใช้ส่ง) — หน้า 19–34 · เลขหน้าคือเลขหน้าที่พิมพ์ในเล่ม (PDF หน้า = เลขที่พิมพ์ + 3) · ระดับคำแนะนำ (ระดับ, คุณภาพหลักฐาน) ตามต้นฉบับ',
    'ข้อจำกัด: แนวทางพิมพ์ปี 2562 ก่อนมีหลักฐานของ SGLT2 inhibitors (dapagliflozin/empagliflozin) ใน HFrEF และ HFpEF ที่ปรากฏในแนวทางหลังปี 2562 — ดูหัวข้อ "หัวใจล้มเหลว" ในการ์ดความดันโลหิตสูง (แนวทางไทย 2567) ที่ระบุยา 4 กลุ่มใน HFrEF: ACEI/ARB/ARNI, beta-blocker, MRA, SGLT2i · เภสัชกรควรตรวจแนวทางหัวใจล้มเหลวฉบับล่าสุดก่อนใช้จริง',
    'ไฟล์ดึงข้อความไทยได้แต่ตกหล่นสระและวรรณยุกต์ (เช่น "ผูปวย") ผมแก้ให้อ่านง่ายโดยไม่เปลี่ยนความหมาย ตัวเลขขนาดยาตรวจกับตารางที่ 13, 16, 26 ในไฟล์',
    'ยังไม่ครอบคลุม: การวินิจฉัย โรคร่วมและ AF ในหัวใจล้มเหลว (หน้า 36–44) อุปกรณ์ (ICD/CRT) ภาวะหัวใจล้มเหลวระยะสุดท้าย และ discharge checklist',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [
    { title: 'ภาพรวม HFrEF', blocks: [0] }, { title: 'ACEI/ARB', blocks: [1] }, { title: 'Beta-blocker', blocks: [2] }, { title: 'ขนาดยา', blocks: [3] },
    { title: 'MRA', blocks: [4] }, { title: 'ARNI', blocks: [5] }, { title: 'ยาอื่น HFrEF', blocks: [6] }, { title: 'ข้อห้าม/ระวัง', blocks: [7] },
    { title: 'HFpEF', blocks: [8] }, { title: 'เฉียบพลัน', blocks: [9, 10] },
  ],
};
