// สร้างอัตโนมัติจาก 64694f64-PharmaCal-KPNHOSPITAL.dc.html ด้วย tools/extract-constants.mjs — ห้ามแก้ด้วยมือ
// คัดลอกแบบคำต่อคำจากต้นแบบ (README: ห้ามเขียนใหม่จากความจำ)
/* eslint-disable */
// @ts-nocheck

export const PEDLIQ = [
  {id:'amox', name:'Amoxicillin', strength:'250 mg/5 ml', mg:250, ml:5, bottle:60, cls:'ยาปฏิชีวนะ',
   regs:[
     {k:'ขนาดปกติ 40–50 มก./กก./วัน', low:40, high:50, freq:3, freqTxt:'วันละ 3 ครั้ง (ทุก 8 ชม.)', capDose:500, days:7},
     {k:'ขนาดสูง 80–90 มก./กก./วัน — หูชั้นกลางอักเสบ / ปอดอักเสบ', low:80, high:90, freq:2, freqTxt:'วันละ 2 ครั้ง (ทุก 12 ชม.)', capDose:1000, days:10}
   ],
   notes:['รับประทานพร้อมอาหารหรือไม่พร้อมอาหารก็ได้ · เขย่าขวดก่อนใช้ทุกครั้ง',
     'ยาผงผสมน้ำแล้วเก็บในตู้เย็น (2–8 องศาเซลเซียส) ใช้ได้ 14 วัน — ห้ามแช่ช่องแข็ง',
     'ขนาดสูงสุดในผู้ใหญ่ 500 มก. ต่อครั้ง (ขนาดปกติ) หรือ 1,000 มก. ต่อครั้ง (ขนาดสูง)'],
   cite:'Nelson Textbook of Pediatrics, 21st ed · AAP clinical practice guideline: acute otitis media. Pediatrics. 2013;131(3):e964-e999'},
  {id:'azi', name:'Azithromycin', strength:'200 mg/5 ml', mg:200, ml:5, bottle:15, cls:'ยาปฏิชีวนะ',
   regs:[
     {k:'10 มก./กก./วัน × 3 วัน', low:10, high:10, freq:1, freqTxt:'วันละ 1 ครั้ง', capDose:500, days:3},
     {k:'10 มก./กก. วันแรก แล้ว 5 มก./กก. วันที่ 2–5', low:5, high:10, freq:1, freqTxt:'วันละ 1 ครั้ง', capDose:500, days:5, taper:true}
   ],
   notes:['รับประทานก่อนอาหาร 1 ชั่วโมง หรือหลังอาหาร 2 ชั่วโมง',
     'ขนาดสูงสุด 500 มก. ต่อวัน · ยาผสมน้ำแล้วเก็บที่อุณหภูมิห้อง ใช้ได้ 5 วัน (ห้ามแช่เย็น)',
     'สูตรวันแรก 10 มก./กก. แล้วลดเหลือ 5 มก./กก. — ต้องแจ้งผู้ปกครองให้ชัดเจนว่าปริมาณยาไม่เท่ากันทุกวัน'],
   cite:'Nelson Textbook of Pediatrics, 21st ed · Bradley JS, et al. IDSA/PIDS guideline: community-acquired pneumonia in children. Clin Infect Dis. 2011;53(7):e25-e76'},
  {id:'bactrim', name:'Co-trimoxazole (Bactrim)', strength:'TMP 40 mg + SMX 200 mg/5 ml', mg:40, ml:5, bottle:60, cls:'ยาปฏิชีวนะ', doseUnit:'มก. TMP',
   regs:[
     {k:'8 มก. TMP/กก./วัน (ช่วง 6–12)', low:6, high:12, freq:2, freqTxt:'วันละ 2 ครั้ง (ทุก 12 ชม.)', capDose:160, days:7},
     {k:'ป้องกัน PCP — 5 มก. TMP/กก./วัน', low:4, high:6, freq:1, freqTxt:'วันละ 1 ครั้ง หรือสัปดาห์ละ 3 วัน', capDose:160, days:30}
   ],
   notes:['คำนวณขนาดจากส่วน trimethoprim (TMP) เท่านั้น — ยาน้ำ 5 มล. มี TMP 40 มก.',
     'ห้ามใช้ในเด็กอายุน้อยกว่า 2 เดือน (เสี่ยง kernicterus)',
     'ให้ดื่มน้ำมาก ๆ เพื่อป้องกันผลึกในทางเดินปัสสาวะ · ระวังผื่นแพ้ยารุนแรง (SJS/TEN)'],
   cite:'Nelson Textbook of Pediatrics, 21st ed · AAP Red Book: 2021-2024 Report of the Committee on Infectious Diseases'},
  {id:'cepha', name:'Cephalexin', strength:'250 mg/5 ml', mg:250, ml:5, bottle:60, cls:'ยาปฏิชีวนะ',
   regs:[
     {k:'25–50 มก./กก./วัน', low:25, high:50, freq:3, freqTxt:'วันละ 3 ครั้ง (ทุก 8 ชม.)', capDose:500, days:7},
     {k:'ผิวหนังอักเสบ / ต่อมน้ำเหลืองอักเสบ 50 มก./กก./วัน', low:50, high:50, freq:4, freqTxt:'วันละ 4 ครั้ง (ทุก 6 ชม.)', capDose:500, days:10}
   ],
   notes:['ขนาดสูงสุด 2,000 มก. ต่อวัน (4,000 มก. ในการติดเชื้อรุนแรง)',
     'ยาผสมน้ำแล้วเก็บในตู้เย็น ใช้ได้ 14 วัน',
     'ปรับขนาดเมื่อการทำงานของไตลดลง (CrCl น้อยกว่า 30 มล./นาที)'],
   cite:'Nelson Textbook of Pediatrics, 21st ed · Stevens DL, et al. IDSA practice guidelines for skin and soft tissue infections. Clin Infect Dis. 2014;59(2):e10-e52'},
  {id:'augmentin', name:'Amoxicillin/Clavulanate (Augmentin)', strength:'400 + 57 mg/5 ml', mg:400, ml:5, bottle:70, cls:'ยาปฏิชีวนะ', doseUnit:'มก. amoxicillin',
   regs:[
     {k:'45 มก./กก./วัน (ช่วง 40–50) — ขนาดปกติ', low:40, high:50, freq:2, freqTxt:'วันละ 2 ครั้ง (ทุก 12 ชม.)', capDose:875, days:7},
     {k:'90 มก./กก./วัน — หูชั้นกลางอักเสบ / ไซนัสอักเสบ / ปอดอักเสบ', low:80, high:90, freq:2, freqTxt:'วันละ 2 ครั้ง (ทุก 12 ชม.)', capDose:1000, days:10}
   ],
   notes:['คำนวณขนาดจากส่วน amoxicillin เท่านั้น — สูตร 400/57 มีอัตราส่วน 7:1 เหมาะกับขนาดสูงเพราะได้ clavulanate ไม่มากเกินไป',
     'ห้ามใช้สูตรความเข้มข้นต่างกันสลับกันโดยไม่คำนวณใหม่ (125/31.25 มีอัตราส่วน 4:1 ให้ clavulanate สูงกว่าเมื่อเทียบขนาด amoxicillin เท่ากัน)',
     'รับประทานพร้อมอาหารเพื่อลดอาการท้องเสียและคลื่นไส้ · ยาผสมน้ำแล้วเก็บในตู้เย็น ใช้ได้ 7–10 วัน',
     'ผลข้างเคียงที่พบบ่อยคือถ่ายเหลว หากรุนแรงหรือมีเลือดปนต้องหยุดยาและปรึกษาแพทย์'],
   cite:'AAP clinical practice guideline: acute otitis media. Pediatrics. 2013;131(3):e964-e999 · Nelson Textbook of Pediatrics, 21st ed'},
  {id:'erythro', name:'Erythromycin', strength:'125 mg/ml (drops)', mg:125, ml:1, bottle:15, cls:'ยาปฏิชีวนะ',
   regs:[
     {k:'40 มก./กก./วัน (ช่วง 30–50)', low:30, high:50, freq:4, freqTxt:'วันละ 4 ครั้ง (ทุก 6 ชม.)', capDose:500, maxDay:2000, days:7},
     {k:'ไอกรน 40–50 มก./กก./วัน', low:40, high:50, freq:4, freqTxt:'วันละ 4 ครั้ง (ทุก 6 ชม.)', capDose:500, maxDay:2000, days:14}
   ],
   notes:['ความเข้มข้นสูงถึง 125 มก./มล. — ปริมาณต่อครั้งน้อยมาก ต้องใช้กระบอกฉีดยาหรือหลอดหยดที่มีขีดละเอียด ห้ามใช้ช้อนชา',
     'ทารกอายุน้อยกว่า 6 สัปดาห์เสี่ยงเกิด infantile hypertrophic pyloric stenosis — ใช้เมื่อจำเป็นเท่านั้นและเฝ้าระวังอาการอาเจียนพุ่ง',
     'รับประทานพร้อมอาหารเพื่อลดการระคายเคืองกระเพาะอาหาร (สูตร ethylsuccinate ดูดซึมได้ไม่ขึ้นกับอาหาร)',
     'เป็นตัวยับยั้ง CYP3A4 — ต้องทบทวนยาที่ใช้ร่วม เช่น carbamazepine, theophylline, warfarin และห้ามใช้ร่วมกับ ergotamine'],
   cite:'AAP Red Book: 2021-2024 Report of the Committee on Infectious Diseases · Nelson Textbook of Pediatrics, 21st ed'},
  {id:'mebenda', name:'Mebendazole', strength:'100 mg/5 ml', mg:100, ml:5, bottle:30, cls:'ยาถ่ายพยาธิ', fixed:true,
   regs:[
     {k:'พยาธิเส้นด้าย (Enterobius) — 100 มก. ครั้งเดียว', fixedDose:100, freq:1, freqTxt:'ครั้งเดียว แล้วซ้ำอีกครั้งใน 2 สัปดาห์', days:1},
     {k:'พยาธิไส้เดือน / ปากขอ / แส้ม้า — 100 มก. วันละ 2 ครั้ง 3 วัน', fixedDose:100, freq:2, freqTxt:'วันละ 2 ครั้ง ติดต่อกัน 3 วัน', days:3},
     {k:'ถ่ายพยาธิหมู่ — 500 มก. ครั้งเดียว', fixedDose:500, freq:1, freqTxt:'ครั้งเดียว', days:1}
   ],
   notes:['ขนาดยาคงที่ไม่ขึ้นกับน้ำหนักตัวสำหรับเด็กอายุมากกว่า 1 ปี — 100 มก. เท่ากับยาน้ำ 5 มล.',
     'ไม่แนะนำในเด็กอายุน้อยกว่า 1 ปี และห้ามใช้ในหญิงตั้งครรภ์ไตรมาสแรก',
     'พยาธิเส้นด้ายต้องให้ซ้ำอีกครั้งใน 2 สัปดาห์ และควรรักษาสมาชิกในบ้านพร้อมกันเพื่อป้องกันการติดซ้ำ',
     'เคี้ยวหรือกลืนได้ ไม่ต้องอดอาหารหรือให้ยาถ่ายร่วม'],
   cite:'WHO Model Formulary for Children 2010 · British National Formulary for Children (BNFC) 2023-2024'},
  {id:'ferrous', name:'Ferrous fumarate', strength:'15 mg elemental iron/0.6 ml', mg:15, ml:0.6, bottle:15, cls:'ธาตุเหล็ก', doseUnit:'มก. เหล็ก',
   regs:[
     {k:'ป้องกันภาวะขาดเหล็ก 1–2 มก./กก./วัน', low:1, high:2, freq:1, freqTxt:'วันละ 1 ครั้ง', capDose:15, days:30},
     {k:'รักษาภาวะซีดจากขาดเหล็ก 3–6 มก./กก./วัน', low:3, high:6, freq:1, freqTxt:'วันละ 1 ครั้ง (แบ่ง 2 ครั้งได้หากระคายเคืองกระเพาะ)', capDose:60, days:30}
   ],
   notes:['คำนวณขนาดจากธาตุเหล็ก (elemental iron) — หลอดหยด 0.6 มล. มีเหล็ก 15 มก.',
     'ปริมาณต่อครั้งน้อยมาก ต้องใช้หลอดหยดที่มาพร้อมขวดเท่านั้น ห้ามใช้ช้อนชา',
     'ให้ระหว่างมื้ออาหารพร้อมน้ำผลไม้ที่มีวิตามินซี เพื่อเพิ่มการดูดซึม · หลีกเลี่ยงการให้พร้อมนม ชา หรือยาลดกรด',
     'อุจจาระสีดำเป็นเรื่องปกติ · ทำให้ฟันมีคราบดำได้ ให้หยดที่โคนลิ้นและบ้วนปากหรือแปรงฟันตามหลังให้ยา',
     'เก็บให้พ้นมือเด็ก — เหล็กเกินขนาดเป็นสาเหตุการเสียชีวิตจากพิษยาที่พบบ่อยในเด็ก',
     'รักษาภาวะซีดต่อเนื่องอีก 2–3 เดือนหลังค่าฮีโมโกลบินกลับเป็นปกติ เพื่อเติมคลังเหล็กในร่างกาย'],
   cite:'Baker RD, Greer FR; AAP Committee on Nutrition. Diagnosis and prevention of iron deficiency anemia in infants and young children. Pediatrics. 2010;126(5):1040-1050 · WHO Model Formulary for Children 2010'},
  {id:'simeth', name:'Simethicone', strength:'40 mg/0.6 ml', mg:40, ml:0.6, bottle:15, cls:'ยาขับลม', fixed:true,
   regs:[
     {k:'อายุน้อยกว่า 2 ปี — 20 มก. ต่อครั้ง', fixedDose:20, freq:4, freqTxt:'วันละไม่เกิน 4 ครั้ง หลังอาหารและก่อนนอน', days:5},
     {k:'อายุ 2–12 ปี — 40 มก. ต่อครั้ง', fixedDose:40, freq:4, freqTxt:'วันละไม่เกิน 4 ครั้ง หลังอาหารและก่อนนอน', days:5}
   ],
   notes:['ขนาดยาคงที่ตามช่วงอายุ ไม่คำนวณตามน้ำหนักตัว — ขนาดสูงสุด 240 มก./วัน',
     'ไม่ถูกดูดซึมเข้ากระแสเลือด จึงปลอดภัยสูงและใช้ในทารกได้',
     'ผสมในนมหรือน้ำได้ · เขย่าขวดก่อนใช้ทุกครั้ง',
     'หลักฐานประสิทธิภาพในภาวะโคลิคของทารกยังจำกัด — ควรให้คำแนะนำการดูแลแบบประคับประคองร่วมด้วย'],
   cite:'British National Formulary for Children (BNFC) 2023-2024 · Hall B, et al. Infantile colic: a systematic review. J Paediatr Child Health. 2012;48(2):128-137'},
  {id:'para', name:'Paracetamol', strength:'120 mg/5 ml', mg:120, ml:5, bottle:60, cls:'ยาลดไข้ / แก้ปวด', perDose:true,
   regs:[
     {k:'10–15 มก./กก./ครั้ง', low:10, high:15, freq:4, freqTxt:'ทุก 4–6 ชม. เมื่อมีไข้หรือปวด (ไม่เกิน 5 ครั้ง/วัน)', capDose:1000, maxDayKg:75, days:3}
   ],
   notes:['ขนาดสูงสุด 75 มก./กก./วัน และไม่เกิน 4,000 มก./วัน — ห้ามให้เกิน 5 ครั้งใน 24 ชั่วโมง',
     'ตรวจสอบยาลดไข้ตัวอื่นที่ผู้ป่วยได้รับร่วม เพื่อไม่ให้ paracetamol เกินขนาดโดยไม่รู้ตัว',
     'ยาน้ำเชื่อมความเข้มข้นในตลาดมีหลายแบบ (120 และ 250 มก./5 มล.) ต้องย้ำความเข้มข้นกับผู้ปกครองทุกครั้ง'],
   cite:'Nelson Textbook of Pediatrics, 21st ed · WHO Model Formulary for Children 2010'},
  {id:'ibu', name:'Ibuprofen', strength:'100 mg/5 ml', mg:100, ml:5, bottle:60, cls:'ยาลดไข้ / แก้ปวด / ต้านอักเสบ', perDose:true,
   regs:[
     {k:'ลดไข้ 5–10 มก./กก./ครั้ง', low:5, high:10, freq:3, freqTxt:'ทุก 6–8 ชม. เมื่อมีไข้', capDose:400, maxDayKg:40, days:3},
     {k:'ต้านอักเสบ 10 มก./กก./ครั้ง', low:10, high:10, freq:4, freqTxt:'ทุก 6 ชม.', capDose:600, maxDayKg:40, days:5}
   ],
   notes:['ห้ามใช้ในเด็กอายุน้อยกว่า 6 เดือน · ขนาดสูงสุด 40 มก./กก./วัน และไม่เกิน 1,200 มก./วัน',
     'รับประทานพร้อมอาหารหรือนมเพื่อลดการระคายเคืองกระเพาะอาหาร',
     'หลีกเลี่ยงในภาวะขาดน้ำ ไข้เลือดออก เกล็ดเลือดต่ำ และโรคไต — เลือก paracetamol แทน'],
   cite:'Nelson Textbook of Pediatrics, 21st ed · แนวทางการวินิจฉัยและรักษาโรคไข้เลือดออกเดงกี กรมการแพทย์'},
  {id:'carbo', name:'Carbocysteine', strength:'250 mg/5 ml', mg:250, ml:5, bottle:60, cls:'ยาละลายเสมหะ',
   regs:[
     {k:'20–30 มก./กก./วัน', low:20, high:30, freq:3, freqTxt:'วันละ 3 ครั้ง', capDose:250, days:5}
   ],
   notes:['ขนาดตามอายุที่ใช้ทั่วไป — 2–5 ปี 62.5–125 มก. วันละ 3 ครั้ง · มากกว่า 5 ปี 250 มก. วันละ 3 ครั้ง',
     'ให้ดื่มน้ำมากขึ้นร่วมด้วยเพื่อช่วยละลายเสมหะ',
     'ไม่ใช้ในเด็กอายุน้อยกว่า 2 ปี · หลีกเลี่ยงในผู้มีแผลในกระเพาะอาหาร'],
   cite:'British National Formulary for Children (BNFC) 2023-2024 · WHO Model Formulary for Children 2010'},
  {id:'gg', name:'Guaifenesin (GG)', strength:'100 mg/5 ml', mg:100, ml:5, bottle:60, cls:'ยาขับเสมหะ',
   regs:[
     {k:'12 มก./กก./วัน (ช่วง 10–15)', low:10, high:15, freq:4, freqTxt:'ทุก 6 ชม.', capDose:200, maxDay:1200, days:5}
   ],
   notes:['ขนาดตามอายุที่ใช้ทั่วไป — 2–6 ปี 50–100 มก. ทุก 4 ชม. (ไม่เกิน 600 มก./วัน) · 6–12 ปี 100–200 มก. ทุก 4 ชม. (ไม่เกิน 1,200 มก./วัน)',
     'ไม่แนะนำในเด็กอายุน้อยกว่า 2 ปี — ประโยชน์ยังไม่ชัดเจนและเสี่ยงผลข้างเคียง',
     'ให้ดื่มน้ำมากขึ้นร่วมด้วย · ประสิทธิภาพจำกัด ควรเน้นการดูแลแบบประคับประคองเป็นหลัก'],
   cite:'British National Formulary for Children (BNFC) 2023-2024 · AAP: Use of codeine- and dextromethorphan-containing cough remedies in children. Pediatrics. 1997;99(6):918-920'},
  {id:'cpm', name:'Chlorpheniramine (CPM)', strength:'2 mg/5 ml', mg:2, ml:5, bottle:60, cls:'ยาแก้แพ้',
   regs:[
     {k:'0.35 มก./กก./วัน', low:0.3, high:0.4, freq:3, freqTxt:'วันละ 3 ครั้ง (ทุก 8 ชม.)', capDose:4, days:5},
     {k:'0.1 มก./กก./ครั้ง', low:0.1, high:0.1, freq:4, freqTxt:'ทุก 6 ชม.', capDose:4, days:5, perDose:true}
   ],
   notes:['ขนาดสูงสุดต่อวัน — 2–6 ปี ไม่เกิน 6 มก./วัน · 6–12 ปี ไม่เกิน 12 มก./วัน · มากกว่า 12 ปี ไม่เกิน 24 มก./วัน',
     'ทำให้ง่วงซึม — เตือนผู้ปกครองเรื่องการดูแลใกล้ชิด และไม่ใช้ร่วมกับยากดประสาทอื่น',
     'ไม่ใช้ในเด็กอายุน้อยกว่า 2 ปี (เสี่ยงกดการหายใจและกระสับกระส่าย)'],
   cite:'British National Formulary for Children (BNFC) 2023-2024 · Nelson Textbook of Pediatrics, 21st ed'},
  {id:'hyos', name:'Hyoscine butylbromide', strength:'5 mg/5 ml', mg:5, ml:5, bottle:60, cls:'ยาแก้ปวดเกร็งท้อง', perDose:true,
   regs:[
     {k:'0.3–0.5 มก./กก./ครั้ง', low:0.3, high:0.5, freq:3, freqTxt:'วันละ 3 ครั้ง เมื่อปวดเกร็ง', capDose:10, days:3}
   ],
   notes:['ขนาดตามอายุที่ใช้ทั่วไป — 6–12 ปี 10 มก. วันละ 3 ครั้ง · ไม่แนะนำในเด็กอายุน้อยกว่า 6 ปีสำหรับยารับประทาน',
     'ห้ามใช้ในภาวะลำไส้อุดตัน ต้อหินมุมปิด และ myasthenia gravis',
     'ผลข้างเคียงจากฤทธิ์ต้าน cholinergic — ปากแห้ง ใจสั่น ตาพร่า ปัสสาวะคั่ง'],
   cite:'British National Formulary for Children (BNFC) 2023-2024 · Tytgat GN. Hyoscine butylbromide: a review. Drugs. 2007;67(9):1343-1357'}
];

