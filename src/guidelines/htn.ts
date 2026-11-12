// ความดันโลหิตสูง — คัดจาก 2024 Thai guidelines on the treatment of hypertension (Thai Hypertension Society; Asian Biomed 2025, CC BY 4.0)
// ข้อความมาจากตารางคำแนะนำ/เนื้อหาของบทความต้นฉบับ (ภาษาอังกฤษ) สรุปเป็นไทย คงตัวเลข/ชื่อยาตามต้นฉบับ · ระดับคำแนะนำ (Class/Level) ตามต้นฉบับ
// ยังไม่ได้ทบทวนโดยเภสัชกร
import type { Block, Guideline } from './types';

const o = 'จากแนวทางไทย 2567 (ฉบับเต็ม) — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'เป้าหมายและเกณฑ์ความดัน', origin: o, items: [
    { k: 'เกณฑ์วินิจฉัย', v: 'ความดันที่คลินิก ≥ 140/90 mmHg (คงเกณฑ์เดิม) · หมวดใหม่ "BP at risk" = 130–139/80–89 mmHg · ควรยืนยันด้วย HBPM หรือ ABPM' },
    { k: 'เป้าหมาย อายุ 18–65 ปี', v: '120–130/70–79 mmHg' },
    { k: 'เป้าหมาย อายุ > 65 ปี', v: '130–139/70–79 mmHg' },
    { k: 'ความดันที่บ้านเฉลี่ย', v: '65–79 ปี และผู้ที่เคยเป็นโรคหลอดเลือดสมอง ควร < 135/85 mmHg (Class I, C) · อายุ ≥ 80 ปี < 140/80 mmHg ยอมรับได้ (IIb, C)' },
  ] },
  { kind: 'kv', h: 'ยาลดความดันกลุ่มหลัก 5 กลุ่มและการเริ่มยา', origin: o, items: [
    { k: 'ยากลุ่มหลัก 5 กลุ่ม', v: 'ACEI, ARB, Beta-blocker, CCB, Diuretic (thiazide/thiazide-like เช่น chlorthalidone, indapamide) · เลือกโดยพิจารณาโรคร่วมและข้อห้ามของแต่ละกลุ่ม (I, A)' },
    { k: 'เริ่มด้วยยา 2 ชนิด', v: 'ผู้ป่วยส่วนใหญ่ควรเริ่มยา 2 ชนิด · สูตรที่แนะนำ: RAS blocker (ACEI หรือ ARB) + CCB หรือ thiazide/thiazide-like (I, A)' },
    { k: 'ยาเม็ดรวม (SPC)', v: 'แนะนำยาเม็ดรวม 2 ชนิดในเม็ดเดียวทุกที่ที่มี (I, A) และใช้ยาเม็ดรวม 2–3 กลุ่มได้ทุกขั้น (I, A)' },
    { k: 'เริ่มด้วยยา 1 ชนิด', v: 'พิจารณาในผู้สูงอายุมาก อ่อนแรง/เปราะบาง ความดันเริ่มต้นต่ำ (140–149/90–95 mmHg) ร่วมกับความเสี่ยงหัวใจและหลอดเลือดต่ำ หรือ BP at risk ที่เสี่ยงหัวใจและหลอดเลือดสูงมาก (I, C)' },
    { k: 'ถ้ายังคุมไม่ได้', v: 'เพิ่มเป็นยา 3 ชนิด โดยทั่วไป RAS blocker + CCB + thiazide/thiazide-like โดยหนึ่งในสามต้องเป็นขับปัสสาวะ ควรเป็น thiazide-like (I, A)' },
    { k: 'เวลากินยา', v: 'ผู้ป่วยเลือกกินเช้าหรือก่อนนอนได้ (I, C) · โดยทั่วไป THS แนะนำกินตอนเช้าเพราะความร่วมมือดีกว่า (I, C) · พิจารณาก่อนนอนในผู้ที่มีความดันกลางคืนสูง (IIb, C)' },
  ] },
  { kind: 'list', h: 'ข้อห้ามและข้อควรระวังในการเลือกยา', origin: o, danger: true, items: [
    { t: 'ไม่แนะนำให้ใช้ RAS blocker 2 ตัวร่วมกัน (ACEI + ARB) เพราะเสี่ยง AKI และ hyperkalemia (Class III, A)' },
    { t: 'ARNI ยังไม่แนะนำเป็นยาแนวแรกของความดันสูงเพราะขาดหลักฐานลดเหตุการณ์หัวใจและหลอดเลือดโดยรวม · อาจเหมาะใน resistant hypertension แทน RAS blocker (IIb, B) · ใน HFrEF ควรใช้แทน RAS blocker (I, A)' },
    { t: 'SGLT2i และ GLP1-RA ใช้เป็นยาเสริมในผู้ที่มีโรคร่วมที่ต้องใช้ยาเหล่านี้ (IIa, A) แต่ไม่แนะนำให้ใช้เพื่อลดความดันอย่างเดียว (III, C) · ยังไม่ได้รับอนุมัติข้อบ่งชี้ลดความดันในประเทศไทย' },
    { t: 'ไม่แนะนำ non-DHP-CCB ใน HFrEF (Class III, C)' },
  ] },
  { kind: 'kv', h: 'ความดันสูงดื้อยา (Resistant / Refractory)', origin: o, items: [
    { k: 'Resistant hypertension', v: 'ความดันยังสูงกว่าเป้าหมายแม้ใช้ยาอย่างน้อย 3 กลุ่ม ซึ่งมักรวม CCB ออกฤทธิ์ยาว, ACEI หรือ ARB และยาขับปัสสาวะ ในขนาดสูงสุดหรือสูงสุดที่ทนได้ · ถ้ายังคุมไม่ได้ด้วยยา 3 ชนิด (ขนาดสูงสุด/ที่ทนได้) ให้ถือเป็น resistant hypertension (I, A)' },
    { k: 'Refractory hypertension', v: 'ความดันยังคุมไม่ได้ทั้งที่ใช้ยาสูงสุดหรือใกล้สูงสุดอย่างน้อย 5 กลุ่ม รวม thiazide-like ออกฤทธิ์ยาวและ spironolactone' },
    { k: 'ยาที่ใช้', v: 'Spironolactone (MRA) มีประสิทธิภาพใน refractory hypertension แต่อาจทำให้ hyperkalemia หรือการทำงานของไตลดลงแบบย้อนกลับได้ · ARNI พิจารณาแทน RAS blocker (IIb, B)' },
    { k: 'หัตถการ', v: 'Renal denervation พิจารณาเฉพาะ refractory hypertension (I, C) หรือ resistant ที่มี ASCVD/HMOD ลุกลาม (IIa, B)' },
  ] },
  { kind: 'kv', h: 'โรคไตเรื้อรัง (CKD)', origin: o, items: [
    { k: 'เริ่มรักษา', v: 'ปรับวิถีชีวิตและให้ยาในผู้ป่วย CKD ส่วนใหญ่ทุกระยะเมื่อความดัน ≥ 140/90 mmHg (I, A) · เป้าหมายที่คลินิก 120–130/70–79 mmHg ในผู้ที่มี albuminuria และเสี่ยงสูง (IIa, A)' },
    { k: 'ACR ≥ 30 mg/g', v: 'ใช้ ACEI หรือ ARB เป็นยาแรก (I, A) ปรับถึงขนาดสูงสุดที่ทนได้' },
    { k: 'ACR < 30 mg/g', v: 'ใช้ยากลุ่มหลักได้ทุกกลุ่ม (I, B)' },
    { k: 'การติดตามหลังเริ่ม/ปรับขนาด ACEI/ARB', v: 'ใช้ต่อได้ เว้นแต่ creatinine เพิ่มขึ้น > 30% ภายใน 4 สัปดาห์หลังเริ่มหรือปรับขนาด · พิจารณาลดขนาดหรือหยุดเมื่อมีความดันต่ำที่มีอาการ หรือ hyperkalemia ที่คุมไม่ได้ · ถ้ามี hyperkalemia อาจใช้ potassium binder เพื่อรักษาระดับโพแทสเซียม < 5.5 mmol/L เพื่อใช้ยาต่อได้' },
    { k: 'ยาร่วมตาม eGFR', v: 'eGFR > 45: ACEI/ARB + CCB หรือ thiazide/thiazide-like · eGFR 30–45: thiazide/thiazide-like มักเปลี่ยนเป็น loop diuretic · ห้ามใช้ ACEI + ARB เพื่อคุมความดัน (III, B)' },
    { k: 'ปลูกถ่ายไต', v: 'ACEI/ARB หรือ DHP-CCB เป็นยาแรก (I, A) · ลดความดัน < 130/80 mmHg ได้ (IIb, B)' },
  ] },
  { kind: 'kv', h: 'หัวใจล้มเหลว (HFrEF / HFpEF)', origin: o, items: [
    { k: 'HFrEF', v: 'ให้ยาที่มีหลักฐานลดเหตุการณ์ในหัวใจล้มเหลวร่วมกัน: ACEI หรือ ARB หรือ ARNI + beta-blocker + MRA + SGLT2i หากไม่มีข้อห้ามและทนได้ (I, A) · ถ้ายังคุมไม่ได้ด้วย 4 กลุ่มและยาขับปัสสาวะ ให้เพิ่ม DHP-CCB (I, B) · ไม่แนะนำ non-DHP-CCB (III, C)' },
    { k: 'ยาขับปัสสาวะ', v: 'Thiazide/thiazide-like เมื่อไม่มีปัญหาน้ำเกินมาก · Loop diuretic เมื่อมีน้ำเกิน โดยเฉพาะปอดบวมน้ำหรือ CKD ขั้นสูง (eGFR < 30)' },
    { k: 'HFpEF', v: 'รักษาความดันสูง (I, A) · พิจารณาแทน RAS blocker ด้วย ARNI โดยเฉพาะที่ดูเหมือนความดันสูงดื้อยา (IIb, B) · พิจารณา spironolactone โดยเฉพาะ LVEF ค่อนข้างต่ำ (IIb, B) · SGLT2i มีหลักฐานปรับปรุงผลลัพธ์ใน HFpEF' },
    { k: 'เป้าหมายความดัน', v: 'ผู้เสี่ยงหัวใจล้มเหลว < 130/80 mmHg (I, A) · HFrEF และ HFpEF SBP < 130 mmHg (I, C) · Stage D ให้เพิ่ม GDMT สูงสุดเท่าที่ทนได้ (I, C)' },
  ] },
  { kind: 'drug', h: 'ยาลดความดันฉุกเฉินในหญิงตั้งครรภ์ (preeclampsia)', origin: o, items: [
    { d: 'Hydralazine', dose: '5 mg IV/IM bolus แล้ว IV bolus 5–10 mg ทุก 20–40 นาที', max: 'รวมสูงสุด 20 mg หรือ IV infusion 0.5–10 mg/h', ae: '-', mon: 'ตามตารางที่ 29 ของแนวทาง (Class I, B)' },
    { d: 'Nifedipine', dose: '10–20 mg รับประทาน ทำซ้ำหลัง 20 นาทีได้ แล้ว 10–20 mg ทุก 2–6 ชั่วโมง', max: 'สูงสุด 180 mg/วัน', ae: '-', mon: 'ตามตารางที่ 29 ของแนวทาง (Class I, B)' },
    { d: 'Labetalol', dose: '10–20 mg IV bolus แล้ว IV bolus 20–80 mg ทุก 10–30 นาที', max: 'รวมสูงสุด 300 mg หรือ IV infusion 1–2 mg/min', ae: '-', mon: 'ตามตารางที่ 29 ของแนวทาง (Class I, B)' },
  ] },
  { kind: 'list', h: 'Aspirin ป้องกัน preeclampsia', origin: o, items: [
    { t: 'Aspirin ขนาดต่ำ 81 mg/วัน เริ่มระหว่างอายุครรภ์ 12–28 สัปดาห์ (เหมาะที่สุดก่อน 16 สัปดาห์) ต่อจนคลอด ในผู้ที่มีปัจจัยเสี่ยง preeclampsia' },
    { t: 'แนะนำเมื่อมีปัจจัยเสี่ยงสูง ≥ 1 ข้อ เช่น เคยเป็น preeclampsia, ครรภ์แฝด, ความดันสูงเรื้อรัง, เบาหวานชนิด 1 หรือ 2, โรคไต, โรคภูมิต้านตนเอง (I, A) หรือมีปัจจัยเสี่ยงปานกลาง ≥ 2 ข้อ (I, A)' },
    { t: 'ไม่แนะนำในผู้ที่เคยคลอดครบกำหนดโดยไม่มีภาวะแทรกซ้อน (III, A)' },
  ] },
  { kind: 'kv', h: 'ความดันสูงร่วมกับเบาหวาน', origin: o, sub: 'ตารางที่ 24 (ฉบับภาษาไทย หน้า 67-68)', items: [
    { k: 'เกณฑ์/เป้าหมาย', v: 'วินิจฉัยเมื่อความดันที่สถานพยาบาล ≥ 130/80 mmHg จากการตรวจมากกว่า 1 ครั้ง (I, A) · เป้าหมายต่ำกว่า 130/80 mmHg (I, B) · ผู้ที่ SBP ≥ 180 และ/หรือ DBP ≥ 110 วินิจฉัยได้ทันที (I, B)' },
    { k: 'เมื่อไหร่ให้ยา', v: 'ให้ยาเมื่อ ≥ 140/90 mmHg หรือ ≥ 130/80 mmHg หลังปรับพฤติกรรมชีวิตมาแล้วอย่างน้อย 3 เดือน (I, A) · ช่วง 130–139/80–89 ให้คำแนะนำปรับพฤติกรรมชีวิตก่อน (I, A)' },
    { k: 'เริ่มยา 2 ชนิด', v: 'เมื่อความดันที่สถานพยาบาล ≥ 150/90 mmHg ควรเริ่มยา 2 ชนิด ยาเม็ดรวมจะยิ่งดี (I, A) · ยาชนิดแรกใช้กลุ่มหลักชนิดใดก็ได้ (I, A)' },
    { k: 'มี albuminuria (UACR ≥ 30 mg/g)', v: 'เลือก ACEI หรือ ARB (I, A) · ไม่ควรใช้ ACEI ร่วมกับ ARB (III, A)' },
    { k: 'SGLT2i / GLP1-RA', v: 'ควรเลือก SGLT2i หรือ GLP1-RA เมื่อมี ASCVD (I, A) · ควรใช้ SGLT2i เมื่อมีหัวใจล้มเหลวหรือ CKD (eGFR < 60 หรือมี albuminuria) (I, A) · น่าจะเลือก GLP1-RA เมื่อมีหัวใจล้มเหลวหรือ CKD (IIa, A)' },
  ] },
  { kind: 'kv', h: 'โรคหลอดเลือดหัวใจ (ระยะสงบ)', origin: o, sub: 'ตารางที่ 16 (หน้า 45-46)', items: [
    { k: 'เมื่อไหร่ให้ยา และเป้าหมาย', v: 'เริ่มยาเมื่อความดัน 130–139 และ/หรือ 85–89 mmHg (I, A) · เป้าหมายเท่ากับผู้ป่วยความดันสูงทั่วไป (I, A)' },
    { k: 'ยาที่เลือก', v: 'ACEI และ/หรือ beta-blocker โดยใช้ ARB แทนถ้าทนต่อ ACEI ไม่ได้ (I, A)' },
    { k: 'มีอาการปวดเค้นอก', v: 'ใช้ beta-blocker และ/หรือ CCB ทั้ง dihydropyridine หรือ non-dihydropyridine (I, A) · ลดอัตราการเต้นของหัวใจให้ 60–80 ครั้ง/นาที ด้วย beta-blocker หรือ non-DHP CCB (I, B)' },
    { k: 'DBP < 70 แต่ SBP ยังสูงกว่าเป้าหมาย', v: 'น่าจะลด SBP ลงอีกด้วยความระมัดระวัง และเฝ้าติดตามอาการขาดเลือดของอวัยวะต่าง ๆ โดยเฉพาะผู้สูงอายุ (IIa, C)' },
  ] },
  { kind: 'kv', h: 'โรคหลอดเลือดสมอง', origin: o, sub: 'ตารางที่ 22 (หน้า 60-61)', items: [
    { k: 'Ischemic stroke ระยะเฉียบพลัน', v: 'ควบคุมความดันให้ต่ำกว่า 180/105 mmHg ภายใน 24 ชั่วโมงแรกหลังทำ reperfusion (I, C) · ลดความดันที่สูงกว่า 185/110 mmHg ก่อนให้ thrombolysis ทางหลอดเลือดดำ และน่าจะลดก่อน mechanical thrombectomy (IIa)' },
    { k: 'ไม่สามารถทำ reperfusion', v: 'น่าจะลดความดันเมื่อสูงเกิน 220/120 mmHg และคุมให้ SBP < 220 และ DBP < 120 (IIa, C)' },
    { k: 'ยาที่ไม่ควรใช้', v: 'ไม่ควรใช้ nifedipine ชนิดออกฤทธิ์สั้นใน ischemic stroke ระยะเฉียบพลัน (III, C)' },
    { k: 'Spontaneous ICH ระยะเฉียบพลัน', v: 'น่าจะให้ยาลดความดันชนิดฉีดเข้าหลอดเลือดดำเมื่อ SBP > 180 mmHg (IIa, B) · อาจลด SBP ถึง 140 mmHg ในผู้ที่ความรุนแรงต่ำถึงปานกลาง (IIb, B)' },
    { k: 'ป้องกัน stroke ซ้ำ', v: 'อาจให้ยาลดความดันชนิดรับประทานเมื่อ > 140/90 mmHg เป้าหมาย 120–130/70–80 mmHg (IIb, B) · ผู้ที่เคยเป็น sICH น่าจะลดความดันถึง 130/80 mmHg (IIa, B)' },
  ] },
  { kind: 'kv', h: 'ผู้สูงอายุและ isolated systolic hypertension (ISH)', origin: o, sub: 'ตารางที่ 35 (หน้า 100-101)', items: [
    { k: 'อายุ 60–79 ปี', v: 'เริ่มยาเมื่อ ≥ 140/90 mmHg (I, A) · เป้าหมายเบื้องต้น 130–140/70–79 mmHg (I, A) แล้วลดถึง 120–129/70–79 mmHg ถ้าทนได้ดี (I, B)' },
    { k: 'อายุ ≥ 80 ปี', v: 'ประเมิน frailty/functionality ก่อนเริ่มรักษาและซ้ำปีละครั้ง (I, C) · เริ่มยาเมื่อ SBP ≥ 160 mmHg (I, A) และอาจเริ่มเมื่อ 140–159 ในบางกรณี (IIb, C) · เป้าหมาย SBP 140–150 และ DBP < 80 mmHg (I, A) · อาจลด SBP ถึง 130–139 ถ้าทนได้ (IIb, B)' },
    { k: 'หลักการใช้ยา', v: 'เริ่มขนาดต่ำและปรับขึ้นช้า ๆ (I, C) · ตรวจหา orthostatic hypertension สม่ำเสมอ (I, C) · ไม่ควรตั้งเป้า SBP < 120 หรือ DBP < 70 mmHg (III, C)' },
    { k: 'ลดหรือหยุดยา', v: 'น่าจะพิจารณาลดหรือหยุดยาในผู้สูงอายุตอนปลายที่ SBP < 120, orthostatic hypotension รุนแรง หรือ frailty รุนแรง (IIa, C) · ถ้า frailty/dementia ระดับปานกลางขึ้นไปให้วางแผนเป็นรายบุคคล (I, C)' },
    { k: 'ISH ในผู้สูงอายุ', v: 'ยาแรกเลือก CCB และ thiazide/thiazide-like โดยใช้กลุ่มหลักอื่นได้ตามข้อบ่งชี้ (I, A) · ISH ที่สุขภาพดีเริ่มด้วยยา 2 ชนิด (I, C) · เป้าหมายเบื้องต้น SBP 140–150 mmHg (I, A)' },
  ] },
  { kind: 'kv', h: 'ขั้นตอนรักษา resistant hypertension (ภาพที่ 6)', origin: o, sub: 'หน้า 113 และตารางที่ 40 (หน้า 118-119)', items: [
    { k: 'ขั้นที่ 1', v: 'ปรับพฤติกรรมชีวิต: จำกัดโซเดียมไม่เกิน 2 g/วัน (เกลือ NaCl ไม่เกิน 5 g/วัน) ร่วมกับอาหาร DASH (I, A) · ควบคุมน้ำหนัก ออกกำลังกาย นอนหลับพอ · ไม่แนะนำ bariatric surgery เพื่อลดความดันอย่างเดียว (III, C) · ตรวจคัดกรอง OSA และพิจารณา CPAP (IIa, B)' },
    { k: 'ขั้นที่ 2: ยากลุ่มหลัก', v: 'ใช้ยาครบ 3 กลุ่มหลักในขนาดเต็มที่หรือเท่าที่ทนได้ · เปลี่ยน thiazide เป็น long-acting thiazide-like (chlorthalidone หรือ indapamide) หรือเปลี่ยนเป็น loop diuretic ถ้า eGFR < 30–45 · เพิ่ม spironolactone หรือ eplerenone เมื่อ eGFR ≥ 30 · เพิ่ม chlorthalidone ในผู้ที่ eGFR 15–30 ถ้ายังไม่ได้ใช้' },
    { k: 'ขั้นที่ 3: ยากลุ่มเพิ่มเติม', v: 'ใช้ ARNI แทน ACEI/ARB ที่ใช้อยู่ · เพิ่ม beta-blocker ถ้าชีพจรตั้งแต่ 70 ครั้ง/นาทีขึ้นไป หรือเพิ่ม alpha-adrenergic blocker หรือ centrally acting agent · เพิ่ม direct acting vasodilator (hydralazine หรือ minoxidil)' },
    { k: 'ขั้นที่ 4', v: 'พิจารณา renal denervation ถ้า eGFR ≥ 30 ใน refractory hypertension หรือ resistant ที่มี ASCVD หรือ HMOD ลุกลาม' },
    { k: 'ก่อนวินิจฉัย', v: 'แยก pseudo-resistant hypertension ก่อน (วัดความดันให้ถูกวิธี ตรวจสอบการกินยาครบถ้วน ตรวจสอบยา/สารที่เพิ่มความดัน ตรวจ ABPM หรือ HBPM) (I, A) และประเมินสาเหตุทุติยภูมิ โดยเริ่มยาได้ทันทีไม่ต้องรอ (I, A)' },
  ] },
  { kind: 'kv', h: 'Hypertensive emergencies — ยาและเป้าหมาย', origin: o, sub: 'ตารางที่ 41 (หน้า 123) · ข้อความดึงจากไฟล์ PDF ลำดับคอลัมน์อาจคลาดเคลื่อน ควรตรวจกับตารางต้นฉบับ', items: [
    { k: 'Acute coronary syndromes', v: 'เป้าหมาย SBP < 140 mmHg เร็วที่สุดที่ทำได้ · Nitroglycerin, labetalol* · ไม่ควรลด SBP ต่ำกว่า 110 หรือ DBP ต่ำกว่า 60 mmHg' },
    { k: 'Acute decompensated heart failure (cardiogenic pulmonary edema)', v: 'เป้าหมาย SBP < 140 mmHg เร็วที่สุดที่ทำได้ · Nitroglycerin, nitroprusside · เพิ่ม loop diuretics ตามความจำเป็น' },
    { k: 'Malignant hypertension', v: 'ลด MAP ลงร้อยละ 20–25 ภายใน 2–3 ชั่วโมง · Nicardipine, labetalol · อาจใช้ nitroprusside ถ้าการรักษาขั้นแรกไม่ได้ผลดี' },
    { k: 'Hypertensive encephalopathy', v: 'ลด MAP ลงร้อยละ 20–25 เร็วที่สุดที่ทำได้ · Nicardipine, labetalol · อาจใช้ nitroprusside ถ้าการรักษาขั้นแรกไม่ได้ผลดี' },
    { k: 'Acute aortic diseases', v: 'เป้าหมาย SBP < 120 mmHg และชีพจร < 60 ครั้ง/นาที เร็วที่สุดที่ทำได้ · Esmolol, labetalol, nicardipine, nitroglycerin · อาจต้องใช้ยาลดความดัน 2 กลุ่มเพื่อคุมทั้ง SBP และชีพจร' },
    { k: 'Acute ischemic / hemorrhagic stroke', v: 'ให้รักษาตามแนวทางผู้ป่วย acute stroke (ดูหัวข้อโรคหลอดเลือดสมอง)' },
    { k: '* หมายเหตุ', v: 'เลี่ยงการใช้ labetalol ในผู้ที่มี pulmonary congestion รุนแรง' },
  ] },
  { kind: 'list', h: 'ยาและสารที่อาจเพิ่มความดันโลหิต (ตรวจสอบก่อนวินิจฉัย resistant)', origin: o, items: [
    { t: 'NSAIDs และ selective COX-2 inhibitors · ยาคุมกำเนิด · Glucocorticoids, mineralocorticoids' },
    { t: 'Sympathomimetic amines: amphetamine, ephedrine, pseudoephedrine, phenylpropanolamine' },
    { t: 'Antidepressants · Erythropoietin-stimulating agents · Cyclosporine, tacrolimus · VEGF inhibitors' },
    { t: 'แอลกอฮอล์ · โคเคน · สมุนไพรบางชนิด (ตารางที่ 39 หน้า 111)' },
  ] },
];

export const HTN_GUIDELINE: Guideline = {
  id: 'htn', title: 'ความดันโลหิตสูง (Hypertension)', category: 'โรคหัวใจ ไต และเมตาบอลิก', accent: '#E5483A', icon: '❤️',
  keywords: ['ความดัน', 'hypertension', 'HT', 'ACEI', 'ARB', 'CCB', 'thiazide', 'chlorthalidone', 'indapamide', 'beta-blocker', 'spironolactone', 'ARNI', 'amlodipine', 'resistant', 'SPC', 'preeclampsia', 'labetalol', 'nifedipine', 'hydralazine'],
  drugs: [
    { name: 'ACEI', group: 'ยาลดความดันกลุ่มหลัก', aliases: ['ACEI', 'ACEIs', 'ACEi'] }, { name: 'ARB', group: 'ยาลดความดันกลุ่มหลัก', aliases: ['ARB'] }, { name: 'CCB (DHP / non-DHP)', group: 'ยาลดความดันกลุ่มหลัก', aliases: ['CCB', 'DHP-CCB', 'non-DHP-CCB'] },
    { name: 'Thiazide / thiazide-like', group: 'ยาลดความดันกลุ่มหลัก', aliases: ['thiazide', 'chlorthalidone', 'indapamide'] }, { name: 'Loop diuretic', group: 'ยาเสริม/ความดันดื้อยา', aliases: ['Loop diuretic'] },
    { name: 'Beta-blocker', group: 'ยาลดความดันกลุ่มหลัก', aliases: ['Beta-blocker', 'beta-blocker'] }, { name: 'Spironolactone / MRA', group: 'ยาเสริม/ความดันดื้อยา', aliases: ['spironolactone', 'MRA', 'mineralocorticoid'] },
    { name: 'ARNI', group: 'ยาเสริม/ความดันดื้อยา', aliases: ['ARNI'] }, { name: 'SGLT2i / GLP1-RA', group: 'ยาเสริม/ความดันดื้อยา', aliases: ['SGLT2i', 'GLP1-RA'] },
    { name: 'Hydralazine', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Hydralazine'] }, { name: 'Nifedipine', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Nifedipine'] }, { name: 'Labetalol', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Labetalol'] },
    { name: 'Aspirin (ป้องกัน preeclampsia)', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Aspirin'] },
    { name: 'Nitroglycerin / Nitroprusside', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Nitroglycerin', 'nitroprusside'] }, { name: 'Nicardipine', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Nicardipine'] }, { name: 'Esmolol', group: 'ยาฉุกเฉินและตั้งครรภ์', aliases: ['Esmolol'] },
    { name: 'Eplerenone', group: 'ยาเสริม/ความดันดื้อยา', aliases: ['eplerenone'] }, { name: 'Hydralazine / Minoxidil', group: 'ยาเสริม/ความดันดื้อยา', aliases: ['hydralazine', 'minoxidil'] },
    { name: 'ยาที่เพิ่มความดัน (NSAIDs ฯลฯ)', group: 'ยาที่เพิ่มความดัน', aliases: ['NSAIDs', 'Glucocorticoids', 'Sympathomimetic'] },
  ],
  source: 'แนวทางการรักษาโรคความดันโลหิตสูงในเวชปฏิบัติทั่วไป พ.ศ. 2567 · สมาคมความดันโลหิตสูงแห่งประเทศไทย',
  cites: [
    'Kunanon S, Kotruchin P, Chattranukulchai P, et al. 2024 Thai guidelines on the treatment of hypertension. Asian Biomed (Res Rev News). 2025. doi:10.2478/abm-2025-0034 · PMC12919385 · CC BY 4.0 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/',
    'แนวทางการรักษาโรคความดันโลหิตสูงในเวชปฏิบัติทั่วไป พ.ศ. 2567 สมาคมความดันโลหิตสูงแห่งประเทศไทย (ฉบับเต็มภาษาไทย 153 หน้า ที่ผู้ใช้ส่งลิงก์) — ใช้เป็นต้นฉบับหลักของการ์ดนี้ อ่านจากไฟล์ทั้งเล่ม เลขหน้าในวงเล็บคือเลขหน้าที่พิมพ์ในเล่ม (PDF หน้า = เลขที่พิมพ์ + 13) ระดับคำแนะนำ (Class/Level) ตามต้นฉบับ',
    'หมายเหตุ: ตัวอักษรบางส่วนในไฟล์ PDF ดึงข้อความได้ไม่สมบูรณ์ (สระซ้อน) ตารางที่ 22 แถว thrombolysis ดึงระดับคำแนะนำไม่ได้จึงไม่ระบุ และตารางที่ 41 ลำดับคอลัมน์อาจคลาดเคลื่อน',
    'หมายเหตุความไม่ตรงกันในต้นฉบับภาษาอังกฤษ: บทคัดย่อระบุความดันเริ่มต้นต่ำ 140–149/90–99 mmHg แต่ตารางที่ 12 ระบุ 140–149/90–95 mmHg — การ์ดนี้ใช้ตามตารางที่ 12',
    'ยังไม่ครอบคลุม: ความดันสูงในโรคอ้วน, มะเร็ง, atrial fibrillation, ก่อนผ่าตัด, pheochromocytoma, primary aldosteronism, และตารางอื่น ๆ ในฉบับเต็ม',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [
    { title: 'เป้าหมาย', blocks: [0] }, { title: 'การเลือกยา', blocks: [1] }, { title: 'ข้อห้าม/ระวัง', blocks: [2] }, { title: 'ดื้อยา', blocks: [3, 12, 14] },
    { title: 'CKD', blocks: [4] }, { title: 'หัวใจล้มเหลว', blocks: [5] }, { title: 'ตั้งครรภ์', blocks: [6, 7] },
    { title: 'เบาหวาน', blocks: [8] }, { title: 'หัวใจ/สมอง', blocks: [9, 10] }, { title: 'ผู้สูงอายุ', blocks: [11] }, { title: 'ฉุกเฉิน', blocks: [13] },
  ],
};
