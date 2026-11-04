// สร้างอัตโนมัติจาก 64694f64-PharmaCal-KPNHOSPITAL.dc.html ด้วย tools/extract-constants.mjs — ห้ามแก้ด้วยมือ
// คัดลอกแบบคำต่อคำจากต้นแบบ (README: ห้ามเขียนใหม่จากความจำ)
/* eslint-disable */
// @ts-nocheck

export const REF_RASH = [
  {name:'Anaphylaxis / anaphylactoid', mech:'Type I (IgE) และแบบไม่ผ่าน IgE — WAO รวมสองภาวะนี้เป็นประเภทเดียวกันเพราะรุนแรงถึงชีวิตเท่ากัน',
   onset:'5–30 นาทีหลังได้รับยา', sev:'รุนแรง',
   feat:'อาการหลายระบบพร้อมกัน — ผื่นลมพิษและ angioedema (พบบ่อยที่สุด) หายใจหอบเสียงหวีด บวมทางเดินหายใจส่วนบน ความดันโลหิตต่ำ เวียนศีรษะเป็นลม คลื่นไส้อาเจียนปวดท้อง',
   drugs:'beta-lactam · sulfonamide · quinolone · macrolide · NSAIDs'},
  {name:'Urticaria (ลมพิษ)', mech:'Type I (IgE) หรือ pseudoallergy', onset:'5 นาที – 1 ชั่วโมง', sev:'ปานกลาง',
   feat:'ผื่นนูนแดงขอบเขตไม่ชัด ตรงกลางซีด รูปร่างไม่แน่นอน คันมาก อาจมีใจสั่น หอบ หน้ามืดร่วมด้วย · ผื่นแต่ละตำแหน่งอยู่ไม่เกิน 24 ชั่วโมง',
   drugs:'beta-lactam · NSAIDs · sulfonamide · opioid · สารทึบรังสี'},
  {name:'Angioedema', mech:'Type I (IgE) หรือ bradykinin-mediated (ACE inhibitor)', onset:'1–2 ชั่วโมง (ACEI เกิดได้ถึงหลายปีหลังใช้ยา)', sev:'ปานกลางถึงรุนแรง',
   feat:'บวมนูนใต้ผิวหนัง ขอบเขตไม่ชัด มักที่ริมฝีปาก เปลือกตา หรืออวัยวะเพศ · ถ้าบวมที่ลิ้นหรือกล่องเสียงถือเป็นภาวะฉุกเฉิน',
   drugs:'ACE inhibitor · NSAIDs · beta-lactam'},
  {name:'Maculopapular rash / morbilliform', mech:'Type IVa–IVb (T-cell)', onset:'5–14 วัน (1–2 วันหากเคยไวต่อยานั้นมาก่อน)', sev:'เล็กน้อยถึงปานกลาง',
   feat:'ผื่นราบและนูนปนกัน คันทั่วตัว ขอบเขตแยกจากผิวปกติไม่ชัด สีแดง ม่วง หรือน้ำตาล · เป็นผื่นแพ้ยาที่พบบ่อยที่สุด',
   drugs:'พบได้จากยาหลายชนิดมาก โดยเฉพาะ beta-lactam, sulfonamide, ยากันชัก, allopurinol'},
  {name:'Fixed drug eruption', mech:'Type IVc (cytotoxic T cell)', onset:'ประมาณ 30 นาที – 2 วัน (เร็วขึ้นมากเมื่อได้รับยาซ้ำ)', sev:'เล็กน้อย',
   feat:'ผื่นกลมขอบชัด แดงจัด ต่อมาเปลี่ยนเป็นแดงคล้ำหรือม่วง คันร่วมด้วย · ลักษณะเด่นคือเกิดซ้ำที่ตำแหน่งเดิมทุกครั้งที่ได้รับยา และทิ้งรอยดำนานเป็นเดือน',
   drugs:'co-trimoxazole · NSAIDs · ยากันชัก · allopurinol'},
  {name:'SJS / TEN', mech:'Type IVc (cytotoxic T cell) — สัมพันธ์กับ HLA ในคนเอเชีย', onset:'1–28 วัน (1–4 สัปดาห์) มีอาการนำคล้ายไข้หวัด 1–2 สัปดาห์ก่อนผื่นขึ้น', sev:'รุนแรงมาก',
   feat:'ไข้ ไอ ปวดเมื่อย เบื่ออาหารนำมาก่อน แล้วผื่นแดงลามเร็ว กลางผื่นเป็นถุงน้ำ รวมเป็นปื้นใหญ่ ผิวหนังลอกเป็นแผ่น มีแผลที่เยื่อบุปากและตา · SJS ลอก < 10% BSA, overlap 10–29%, TEN > 30% BSA · ไม่ตอบสนองต่อ antihistamine หรือ corticosteroid',
   drugs:'sulfonamide · ยากันชักกลุ่ม aromatic · allopurinol · nevirapine · cyclophosphamide · cyclosporin · IVIG'},
  {name:'AGEP', mech:'Type IVd (neutrophil-mediated)', onset:'ส่วนใหญ่ภายใน 2 วัน (ช่วง 1–28 วัน)', sev:'ปานกลางถึงรุนแรง',
   feat:'ผื่นนูนแดงทั่วตัวร่วมกับตุ่มหนองจำนวนมาก มักเริ่มที่ข้อพับ เช่น รักแร้ · ไข้สูง neutrophil และ eosinophil สูง ค่าตับและไตผิดปกติ',
   drugs:'penicillin · macrolide · tetracycline · sulfonamide · terbinafine และยาต้านเชื้อราชนิดกิน · calcium channel blocker · hydroxychloroquine · carbamazepine · paracetamol'},
  {name:'DRESS / DHS', mech:'Type IVb (eosinophil-mediated)', onset:'2–6 สัปดาห์ — ช้ากว่าผื่นแพ้ยาชนิดอื่นมาก', sev:'รุนแรงมาก',
   feat:'ไข้นำ 1–2 วัน แล้วผื่นราบหรือนูนแบบ morbilliform อาจมีตุ่มน้ำหรือตุ่มหนอง · อวัยวะภายในอักเสบอย่างน้อยหนึ่งระบบ (ตับ ปอด ไต ข้อ) ต่อมน้ำเหลืองโต · eosinophil ≥ 1,500 เซลล์/ลบ.มม. หรือพบ atypical lymphocyte · มักวินิจฉัยล่าช้าเพราะอาการช่วงแรกไม่จำเพาะ',
   drugs:'ยากันชักกลุ่ม aromatic · allopurinol · sulfonamide · dapsone · vancomycin · minocycline'},
  {name:'Serum sickness / vasculitis', mech:'Type III (immune complex)', onset:'1–3 สัปดาห์หลังได้รับยา', sev:'ปานกลาง',
   feat:'ไข้ ผื่นคัน ปวดตามข้อ · พบหลังได้รับเซรุ่มแก้พิษที่ผลิตจากสัตว์ เช่น เซรุ่มแก้พิษงูหรือ botulism antitoxin',
   drugs:'เซรุ่มจากสัตว์ · beta-lactam · sulfonamide'},
  {name:'Drug fever', mech:'Type IV (T-cell)', onset:'7–10 วันโดยเฉลี่ย', sev:'เล็กน้อยถึงปานกลาง',
   feat:'ไข้โดยไม่มีแหล่งติดเชื้อชัดเจน ผู้ป่วยดูไม่ป่วยหนักเท่าระดับไข้ · ไข้ลงภายใน 48–72 ชั่วโมงหลังหยุดยา',
   drugs:'co-trimoxazole · beta-lactam · phenytoin · allopurinol'}
];

export const REF_RASH_CITE = 'วรรณวรัชญ์ อารีย์ และคณะ. Adverse Drug Reactions and Drug Hypersensitivity Review. บทความวิชาการสำหรับการศึกษาต่อเนื่อง รหัส 1015-1-000-006-06-2564 · Blumenthal KG, et al. Lancet. 2019;393(10167):183-198 · Ardern-Jones MR, Friedmann PS. Br J Clin Pharmacol. 2011;71(5):672-683 · แนวทางเวชปฏิบัติสำหรับการดูแลผู้ป่วยที่มีการแพ้ชนิดรุนแรง พ.ศ. 2560';

export const REF_PGX = [
  {drug:'Allopurinol', allele:'HLA-B*58:01', scar:'SJS / TEN / DRESS', pop:'จีนฮั่น ไทย ญี่ปุ่น เกาหลี ยุโรป โปรตุเกส', risk:'สูง'},
  {drug:'Carbamazepine', allele:'HLA-B*15:02', scar:'SJS / TEN', pop:'จีนฮั่น ไทย อินเดีย มาเลเซีย เวียดนาม', risk:'สูง'},
  {drug:'Carbamazepine', allele:'HLA-B*15:11', scar:'SJS / TEN', pop:'ญี่ปุ่น เกาหลี', risk:'ปานกลาง'},
  {drug:'Carbamazepine', allele:'HLA-A*31:01', scar:'SJS / TEN / DRESS / MPE', pop:'ญี่ปุ่น ยุโรป เกาหลี จีนฮั่น', risk:'ปานกลาง'},
  {drug:'Oxcarbazepine', allele:'HLA-B*15:02', scar:'SJS / TEN', pop:'จีนฮั่น', risk:'ปานกลาง'},
  {drug:'Phenytoin', allele:'HLA-B*15:02', scar:'SJS / TEN', pop:'จีนฮั่น ไทย', risk:'สูง'},
  {drug:'Nevirapine', allele:'HLA-B*35:05', scar:'DRESS / MPE', pop:'ไทย', risk:'สูง'},
  {drug:'Nevirapine', allele:'HLA-DRB1*01:01', scar:'MPE / DRESS', pop:'ออสเตรเลีย ฝรั่งเศส', risk:'ปานกลาง'},
  {drug:'Dapsone', allele:'HLA-B*13:01', scar:'SJS / TEN / DRESS', pop:'ไทย จีนฮั่น', risk:'สูง'},
  {drug:'Abacavir', allele:'HLA-B*57:01', scar:'Hypersensitivity syndrome', pop:'ทุกเชื้อชาติ', risk:'สูง'},
  {drug:'Sulfamethoxazole', allele:'HLA-B*38', scar:'SJS / TEN', pop:'ยุโรป', risk:'ปานกลาง'},
  {drug:'Sulfonamide', allele:'HLA-A29, B12, DR7', scar:'TEN', pop:'ยุโรป', risk:'ปานกลาง'},
  {drug:'Oxicam NSAIDs', allele:'HLA-B*73, A*2, B*12', scar:'TEN', pop:'ยุโรป', risk:'ปานกลาง'},
  {drug:'Methazolamide', allele:'HLA-B*59:01, CW*01:02', scar:'SJS / TEN', pop:'เกาหลี ญี่ปุ่น', risk:'ปานกลาง'}
];

export const REF_PGX_INTERVAL = [
  ['SJS / TEN', '4–28 วันหลังเริ่มยาที่เป็นสาเหตุ'],
  ['DRESS', '2–6 สัปดาห์หลังเริ่มยาที่เป็นสาเหตุ'],
  ['AGEP', '1–11 วันหลังเริ่มยาที่เป็นสาเหตุ']
];

export const REF_PGX_NOTES = [
  'SCARs พบประมาณร้อยละ 2–3 ของผู้ป่วยที่นอนโรงพยาบาล แต่มีอัตราการเสียชีวิตสูงถึงร้อยละ 10–40 และก่อให้เกิดทุพพลภาพตามมาได้',
  'ความถี่ของ HLA-B*15:02 สูงในชาวเอเชียตะวันออกเฉียงใต้ร้อยละ 8–13 จีนฮั่นร้อยละ 8 อินเดียร้อยละ 4–6 แต่พบน้อยกว่าร้อยละ 1 ในญี่ปุ่น เกาหลี และยุโรป — ในสองกลุ่มหลังให้ดู HLA-A*31:01 แทน',
  'ประเทศไทยบรรจุการตรวจ HLA-B*15:02 ก่อนเริ่ม carbamazepine ในผู้ป่วยโรคลมชักไว้ในสิทธิประโยชน์ของ สปสช. แล้ว และ US FDA แนะนำให้ตรวจในกลุ่มประชากรเสี่ยงสูง',
  'กลไกการกระตุ้นภูมิคุ้มกันมี 3 สมมติฐาน — hapten/pro-hapten (benzylpenicillin, piperacillin, meropenem, sulfamethoxazole, dapsone) · p-i concept ที่ยาจับ TCR หรือ HLA โดยตรง (carbamazepine, dapsone, sulfamethoxazole) · altered repertoire model (abacavir)',
  'รูปแบบการตรวจมี 2 แบบ — reactive testing สั่งตรวจเมื่อจำเป็นต้องใช้ยานั้น (ข้อจำกัดคือรอผลไม่ทันเมื่อต้องเริ่มยาเร่งด่วน) และ pre-emptive testing ตรวจล่วงหน้าเพื่อให้มีข้อมูล genotype พร้อมใช้',
  'ผลตรวจเป็นบวกหมายถึงความเสี่ยงสูงขึ้น ไม่ได้แปลว่าจะเกิดผื่นทุกราย และผลลบไม่ได้รับประกันว่าจะไม่เกิด — ยังต้องเฝ้าระวังอาการทางคลินิกร่วมเสมอ',
  'แหล่งข้อมูลสำหรับแปลผลและแนวปฏิบัติ — Clinical Pharmacogenetics Implementation Consortium (CPIC) และ PharmGKB (pharmgkb.org)'
];

export const REF_PGX_CITES = [
  'นเรนทร์ฤทธิ์ กรุณา. การตรวจทางเภสัชพันธุศาสตร์ในการป้องกันผื่นแพ้ยาแบบรุนแรง (SCARs). บทความวิชาการสำหรับการศึกษาต่อเนื่อง สภาเภสัชกรรม รหัส 1003-1-000-002-11-2562 (รับรอง 12 พฤศจิกายน 2562) คณะเภสัชศาสตร์ มหาวิทยาลัยเชียงใหม่',
  'Su SC, Hung SI, Fan WL, Dao RL, Chung WH. Severe cutaneous adverse reactions: the pharmacogenomics from research to clinical implementation. Int J Mol Sci. 2016;17(11):1890',
  'Fricke-Galindo I, LLerena A, López-López M. An update on HLA alleles associated with adverse drug reactions. Drug Metab Pers Ther. 2017;32(2):73-87',
  'Locharernkul C, et al. Carbamazepine and phenytoin induced Stevens-Johnson syndrome is associated with HLA-B*1502 allele in Thai population. Epilepsia. 2008;49(12):2087-2091',
  'Hung SI, et al. Genetic susceptibility to carbamazepine-induced cutaneous adverse drug reactions. Pharmacogenet Genomics. 2006;16(4):297-306',
  'Chang CC, Too CL, Murad S, Hussein SH. Association of HLA-B*1502 allele with carbamazepine-induced TEN and SJS in the multi-ethnic Malaysian population. Int J Dermatol. 2011;50(2):221-224',
  'Khan DA. Pharmacogenomics and adverse drug reactions. J Allergy Clin Immunol. 2016;138(4):943-955',
  'Pichler WJ. Immune pathomechanism and classification of drug hypersensitivity. Allergy. 2019;74(8):1457-1471',
  'Clinical Pharmacogenetics Implementation Consortium (CPIC) guidelines · PharmGKB (https://www.pharmgkb.org)',
  'ประกาศคณะกรรมการหลักประกันสุขภาพแห่งชาติ เรื่อง ประเภทและขอบเขตของบริการสาธารณสุข — การตรวจคัดกรองยีน HLA-B*15:02 ก่อนเริ่มยา carbamazepine ในผู้ป่วยโรคลมชัก'
];

export const REF_TB_BLOCKS = [
  {h:'สูตรยามาตรฐานและระยะเวลาการรักษา', kind:'kv', sub:'สูตรยาแนวที่ 1 ใช้สำหรับผู้ป่วยรายใหม่ที่ไม่เคยรักษา หรือรักษามาไม่เกิน 1 เดือน และไม่พบเชื้อดื้อยา', items:[
    {k:'2HRZE / 4HR', v:'สูตรมาตรฐานสำหรับผู้ป่วยใหม่ที่เชื้อไวต่อยา — ระยะเข้มข้น 2 เดือน (HRZE) ตามด้วยระยะต่อเนื่อง 4 เดือน (HR) รวม 6 เดือน', note:'ยืดระยะต่อเนื่องจาก 4 เป็น 7 เดือนได้ในผู้ที่มีแผลโพรงขนาดใหญ่ หรือ AFB smear/culture เดือนที่ 2–3 ยังเป็นบวก โดยปรึกษาผู้เชี่ยวชาญ'},
    {k:'2HRZE / 10HR', v:'วัณโรคเยื่อหุ้มสมอง วัณโรคกระดูกและข้อ — รวม 12 เดือน', note:'วัณโรคเยื่อหุ้มสมองและเยื่อหุ้มหัวใจให้ corticosteroid ร่วมด้วย'},
    {k:'2HRE / 7HR', v:'ผู้ป่วยโรคตับ — สูตรที่มียาพิษต่อตับ 2 ชนิด (ตัด pyrazinamide ออก) รวม 9 เดือน', note:'ทางเลือกในกลุ่มเดียวกันคือ 6-9RZE (ตัด isoniazid ออก)'},
    {k:'2AmHE / 16HE หรือ 12-18HE + Lfx', v:'โรคตับรุนแรง — สูตรที่มียาพิษต่อตับเพียง 1 ชนิด', note:'เลือกตามระดับความรุนแรงของโรคตับ ควรปรึกษาผู้เชี่ยวชาญ'},
    {k:'6-9RZE + Lfx', v:'แพ้หรือทนต่อ isoniazid ไม่ได้ — ใช้ levofloxacin แทน', note:'ตาม WHO Module 4 (2022)'},
    {k:'3HP', v:'วัณโรคระยะแฝง — isoniazid + rifapentine สัปดาห์ละครั้ง 3 เดือน (12 doses)', note:'ห้ามใช้ในหญิงตั้งครรภ์ และตรวจสอบอันตรกิริยากับยาต้านเอชไอวีก่อนใช้'},
    {k:'6H หรือ 9H', v:'วัณโรคระยะแฝง เมื่อใช้ rifamycin ไม่ได้', note:'ให้ pyridoxine ร่วมด้วยทุกราย'}
  ]},
  {h:'ขนาดยาผู้ใหญ่ตามน้ำหนักตัว (อายุมากกว่า 15 ปี)', kind:'grid5', sub:'ตารางที่ 5.1 แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 — น้ำหนักก่อนเริ่มการรักษา',
   head:['น้ำหนัก (กก.)','H (มก.)','R (มก.)','Z (มก.)','E (มก.)'], items:[
    {c1:'35–49', c2:'300', c3:'450', c4:'1,000', c5:'800'},
    {c1:'50–69', c2:'300', c3:'600', c4:'1,500', c5:'1,000'},
    {c1:'มากกว่า 70', c2:'300', c3:'600', c4:'2,000', c5:'1,200'}
  ], foot:'กรณีน้ำหนักน้อยกว่า 35 กก. หรือมากกว่า 70 กก. ให้คำนวณขนาดยาตามน้ำหนักตัว · ขนาด H ปรับได้ตามน้ำหนักตัวและชนิด acetylator gene (NAT2 genotype) · ยาเม็ดรวม (FDC) เช่น HR และ HRZE ช่วยเพิ่มความร่วมมือและป้องกันการเลือกกินยาบางตัว แต่ต้องให้ขนาดตามน้ำหนักอย่างถูกต้อง'},
  {h:'ขนาดยาต่อกิโลกรัม ผลข้างเคียง และการติดตาม', kind:'drug', items:[
    {d:'Isoniazid (H)', dose:'ผู้ใหญ่ 4–6 มก./กก./วัน · เด็ก 10 มก./กก./วัน (7–15)', max:'สูงสุด 300 มก./วัน', ae:'ตับอักเสบ · ชาหรือแสบปลายมือปลายเท้า (peripheral neuropathy) · ง่วงนอน · ผื่น', mon:'AST/ALT เมื่อมีอาการสงสัยตับอักเสบ · ชาปลายมือปลายเท้าให้ pyridoxine 50–75 มก./วัน · ง่วงนอนให้ย้ายไปกินก่อนนอน'},
    {d:'Rifampicin (R)', dose:'ผู้ใหญ่ 8–12 มก./กก./วัน · เด็ก 15 มก./กก./วัน (10–20)', max:'สูงสุด 600 มก./วัน', ae:'ปัสสาวะสีส้มแดง (ไม่อันตราย) · ตับอักเสบ · อาการคล้ายไข้หวัดใหญ่ · ภาวะช็อก ผื่น purpura ไตวายเฉียบพลัน', mon:'หยุด rifampicin ทันทีเมื่อเกิดช็อก purpura หรือไตวายเฉียบพลัน · ทบทวนอันตรกิริยาทุกครั้ง (enzyme inducer ที่รุนแรง)'},
    {d:'Pyrazinamide (Z)', dose:'ผู้ใหญ่ 20–30 มก./กก./วัน · เด็ก 35 มก./กก./วัน (30–40)', max:'สูงสุด 2,000 มก./วัน', ae:'ปวดข้อจากกรดยูริกสูง · ตับอักเสบ · คลื่นไส้ เบื่ออาหาร', mon:'ปวดข้อรักษาด้วย NSAIDs หรือ paracetamol โดยไม่ต้องหยุดยา · AST/ALT เมื่อมีอาการ'},
    {d:'Ethambutol (E)', dose:'ผู้ใหญ่ 15 มก./กก./วัน (ไม่เกิน 20)', max:'สูงสุด 1,600 มก./วัน', ae:'optic neuritis — ตาพร่า มองสีผิดปกติ', mon:'สอบถามการมองเห็นทุกครั้งที่มาติดตาม · เฝ้าระวังพิเศษในผู้สูงอายุ ผู้มีโรคไต และผู้ที่ต้องใช้ยาเกิน 2 เดือน · แจ้งผู้ป่วยหยุดยาทันทีเมื่อมองเห็นผิดปกติ แล้วปรึกษาจักษุแพทย์'},
    {d:'Rifapentine (P)', dose:'ผู้ใหญ่ 900 มก. สัปดาห์ละครั้ง (นน. ≥ 30 กก.) · เด็ก 2–14 ปี ตามน้ำหนัก', max:'สูงสุด 900 มก./ครั้ง', ae:'อาการคล้ายไข้หวัดใหญ่ · ปัสสาวะสีส้ม · ตับอักเสบ', mon:'ใช้ในสูตร 3HP เท่านั้น · ตรวจสอบอันตรกิริยาเช่นเดียวกับ rifampicin'}
  ]},
  {h:'อาการไม่พึงประสงค์ — ต้องหยุดยาและส่งปรึกษาผู้เชี่ยวชาญ', kind:'grid3', sub:'ตารางที่ 5.2 อาการรุนแรงหรือมีแนวโน้มจะรุนแรง',
   head:['อาการ','ยาที่เป็นสาเหตุได้','แนวทางดำเนินการ'], danger:true, items:[
    {c1:'ผื่นคันและผื่นที่ไม่มีอาการคัน', c2:'H, R, Z', c3:'หยุดยารักษาวัณโรค'},
    {c1:'ภาวะดีซ่าน (ไม่พบสาเหตุอื่น) และตับอักเสบ', c2:'H, Z, R', c3:'หยุดยารักษาวัณโรค'},
    {c1:'อาการสับสน (สงสัยยาเป็นสาเหตุหากเกิดร่วมกับตับอักเสบ)', c2:'ยารักษาวัณโรคเกือบทุกตัว', c3:'หยุดยารักษาวัณโรค'},
    {c1:'การมองเห็นบกพร่อง (ไม่พบสาเหตุอื่น)', c2:'E', c3:'หยุดยา ethambutol'},
    {c1:'ภาวะช็อก ผื่นผิวหนังชนิด purpura ไตวายเฉียบพลัน', c2:'R', c3:'หยุดยา rifampicin'}
  ]},
  {h:'อาการไม่พึงประสงค์ — ให้ยาต่อได้ โดยตรวจสอบขนาดยา', kind:'grid3',
   head:['อาการ','ยาที่เป็นสาเหตุได้','แนวทางดำเนินการ'], items:[
    {c1:'เบื่ออาหาร คลื่นไส้ ปวดท้อง', c2:'Z, R, H', c3:'กินยาร่วมกับอาหารปริมาณน้อยหรือกินก่อนนอน · กลืนยาช้า ๆ จิบน้ำตามเล็กน้อย · หากอาเจียนพุ่งหรือมีเลือดออกให้ถือเป็นอาการรุนแรงและส่งต่อทันที'},
    {c1:'ปวดข้อ', c2:'Z', c3:'ให้ NSAIDs หรือ paracetamol'},
    {c1:'อาการแสบ ชา เจ็บปลายมือปลายเท้า', c2:'H', c3:'ให้ pyridoxine 50–75 มก./วัน'},
    {c1:'ง่วงนอน', c2:'H', c3:'ย้ายไปให้ยาก่อนนอน'},
    {c1:'ปัสสาวะสีส้มแดง', c2:'R', c3:'ไม่อันตราย ให้ยาต่อได้ อธิบายให้ผู้ป่วยทราบล่วงหน้า'},
    {c1:'อาการคล้ายไข้หวัดใหญ่', c2:'R', c3:'พิจารณาหยุดยาถ้าอาการรุนแรง'}
  ]},
  {h:'ภาวะตับอักเสบจากยา — เกณฑ์หยุดยาและการเริ่มยาใหม่', kind:'list', danger:true, items:[
    {t:'ก่อนเริ่มรักษา พิจารณาเจาะการทำงานของตับในผู้ที่มีความเสี่ยง — อายุมากกว่า 60 ปี ดื่มสุราเป็นประจำ มีประวัติโรคตับหรือไวรัสตับอักเสบ ติดเชื้อเอชไอวี ทุพโภชนาการ และหญิงตั้งครรภ์'},
    {t:'ผู้ที่ไม่มีความเสี่ยงชัดเจน ตรวจ AST/ALT และ total bilirubin เฉพาะเมื่อมีอาการสงสัย เช่น คลื่นไส้ อาเจียน กินไม่ได้ ตาเหลือง ท้องอืด แน่นท้อง'},
    {t:'ผู้ที่มีความเสี่ยง ตรวจ AST/ALT และ total bilirubin ทุก 1–2 สัปดาห์ในเดือนแรก หลังจากนั้นตามความเหมาะสม'},
    {t:'มีอาการคลื่นไส้อาเจียน ให้เจาะการทำงานของตับทุกราย — หาก AST/ALT มากกว่า 3 เท่าของค่าปกติ ให้หยุด H, R และ Z และพิจารณาให้ E, Lfx และ Am ไปก่อน'},
    {t:'มีอาการแต่ AST/ALT ไม่เกิน 3 เท่า ให้ยาต่อ สืบค้นสาเหตุอื่นร่วม และติดตามการทำงานของตับภายใน 3 วัน'},
    {t:'ผลเลือดผิดปกติโดยไม่มีอาการ — total bilirubin มากกว่า 3 มก./ดล. โดย AST/ALT ปกติหรือไม่เกิน 3 เท่า ให้หยุดเฉพาะ rifampicin'},
    {t:'ผลเลือดผิดปกติโดยไม่มีอาการ — AST/ALT น้อยกว่า 5 เท่า ให้ยาต่อและเจาะซ้ำทุก 1 สัปดาห์ · มากกว่า 5 เท่า ให้หยุด H, R และ Z'},
    {t:'การเริ่มยาใหม่ (re-challenge) เริ่มเมื่อ AST/ALT ลดลงต่ำกว่า 2 เท่าของค่าปกติ และ total bilirubin ต่ำกว่า 1.5 มก./ดล. — ให้เรียงลำดับ H แล้ว R แล้ว Z ห่างกันชนิดละ 1 สัปดาห์ เริ่มจากขนาดปกติได้เลย และเจาะ AST/ALT กับ total bilirubin ภายใน 1 สัปดาห์หลังเริ่มยาแต่ละชนิด'},
    {t:'หากค่าตับสูงขึ้นอีกระหว่าง re-challenge ให้หยุดยาตัวนั้นและห้ามใช้ยาตัวนั้นอีก · กรณี fulminant hepatitis ห้ามใช้ยาในกลุ่มนี้อีกเลย'},
    {t:'พิจารณาส่งตรวจ NAT2 genotype ในรายที่เกิดตับอักเสบ เพื่อกำหนดขนาด isoniazid ที่เหมาะสมต่อไป'}
  ]},
  {h:'ปฏิกิริยาทางผิวหนัง — แนวทางจัดการตามความรุนแรง', kind:'list', items:[
    {t:'คันแต่ไม่มีผื่น — ให้ยาต้าน histamine และรับประทานยาวัณโรคต่อได้ อาการจะค่อย ๆ ดีขึ้น อาจใช้เวลาหลายสัปดาห์'},
    {t:'ผื่นลักษณะคล้ายสิว อาจคันโดยไม่มีอาการตามระบบ — ให้ยาต่อได้ ไม่เป็นอันตราย'},
    {t:'ผื่น maculopapular หลายตำแหน่ง — หยุดยาทุกชนิด ให้ยาต้าน histamine และพิจารณา prednisolone ขนาดต่ำ 20–40 มก./วัน'},
    {t:'ผื่นรุนแรงมากที่มีรอยโรคในเยื่อบุร่วมด้วย — หยุดยาทุกชนิด รับไว้ในโรงพยาบาล ให้ systemic steroid ขนาดสูง เช่น prednisolone 40–60 มก./วัน แล้วค่อย ๆ ลดขนาดตามการตอบสนอง และปรึกษาผู้เชี่ยวชาญ'},
    {t:'เมื่อผื่นชนิดไม่รุนแรงหายดี ให้เริ่มยาใหม่ทีละตัว เรียงจาก H หรือ R ก่อน แล้วต่อด้วย E และ Z เป็นตัวสุดท้าย'},
    {t:'ยาแต่ละชนิดเริ่มจาก 1/3 ถึง 1/2 ของขนาดสูงสุด แล้วเพิ่มถึงขนาดสูงสุดภายใน 2–3 วัน ถ้าไม่มีปัญหาจึงเริ่มยาตัวถัดไป'},
    {t:'ถ้าผื่นขึ้นขณะได้ยาตัวใด ให้หยุดยาตัวนั้น รอผื่นยุบหมด แล้วเริ่มยาตัวถัดไป และปรับสูตรยาให้เหมาะสม'}
  ]},
  {h:'กรณีพิเศษ — โรคไต โรคตับ ตั้งครรภ์ และผู้ติดเชื้อเอชไอวี', kind:'kv', items:[
    {k:'โรคไต (CrCl < 30 มล./นาที หรือฟอกไต)', v:'H และ R ไม่ต้องปรับขนาด · E ปรับเป็น 15–20 มก./กก. สัปดาห์ละ 3 วัน · Z ปรับเป็น 20–30 มก./กก. สัปดาห์ละ 3 วัน', note:'ตารางที่ 5.9 — ให้ยาในวันที่ไม่ฟอกไตหรือหลังฟอกไต'},
    {k:'โรคตับเรื้อรังที่ ALT มากกว่า 3 เท่า', v:'เลือกสูตรที่มียาพิษต่อตับน้อยลง — 2HRE/7HR หรือ 6-9RZE (พิษต่อตับ 2 ชนิด) หรือ 2AmHE/16HE หรือ 12-18HE + Lfx (พิษต่อตับ 1 ชนิด)', note:'นัดติดตามอาการทุก 1 สัปดาห์ในช่วง 2–3 สัปดาห์แรก และทุก 2 สัปดาห์ในช่วง 2 เดือนแรก'},
    {k:'หญิงตั้งครรภ์', v:'ให้สูตรมาตรฐานได้ตามปกติ คำนวณขนาดยาตามน้ำหนักก่อนตั้งครรภ์ · ให้ pyridoxine 50–100 มก./วัน ร่วมกับ isoniazid', note:'หลีกเลี่ยง aminoglycoside (พิษต่อหูทารก) และ fluoroquinolone — หากจำเป็นต้องใช้ให้ปรึกษาผู้เชี่ยวชาญเป็นรายกรณี'},
    {k:'หญิงให้นมบุตร', v:'ให้นมได้ตามปกติเพราะยาผ่านน้ำนมปริมาณน้อย', note:'ระวังการแพร่เชื้อสู่บุตร — หากยังไอมากและเสมหะเป็นบวก ให้บีบน้ำนมใส่ขวดแทน'},
    {k:'ผู้ติดเชื้อเอชไอวี — เวลาเริ่มยาต้านไวรัส', v:'วัณโรคทุกชนิด เริ่มยาต้านไวรัสภายใน 2 สัปดาห์ อย่างช้าไม่เกิน 4 สัปดาห์ · วัณโรคเยื่อหุ้มสมอง เริ่มหลังรักษาวัณโรคอย่างน้อย 4 สัปดาห์ อย่างช้าไม่เกิน 8 สัปดาห์', note:'ตารางที่ 5.7 — หญิงตั้งครรภ์ให้เริ่มเร็วที่สุดเท่าที่เป็นไปได้ · ให้ co-trimoxazole preventive therapy โดยเฉพาะเมื่อ CD4 < 200 cells/µL'},
    {k:'ผู้ติดเชื้อเอชไอวี — อันตรกิริยากับ rifampicin', v:'ไม่แนะนำให้ร่วมกับ R — tenofovir alafenamide, nevirapine, etravirine, rilpivirine, protease inhibitor ทุกตัว และ elvitegravir', note:'ตารางที่ 5.8 — ต้องปรับขนาดยาเมื่อให้ร่วมกับ R ได้แก่ raltegravir, dolutegravir และ maraviroc'}
  ]},
  {h:'การตรวจติดตามระหว่างการรักษา', kind:'list', items:[
    {t:'อาการทางคลินิกและชั่งน้ำหนัก — ทุกเดือนตั้งแต่ก่อนเริ่มรักษาจนสิ้นสุดการรักษา (ปรับขนาดยาเมื่อน้ำหนักเปลี่ยนข้ามช่วง)'},
    {t:'AFB smear — ก่อนเริ่มรักษา สิ้นเดือนที่ 2 สิ้นเดือนที่ 5 และเดือนสุดท้าย · ตรวจเพิ่มเดือนที่ 3 หากผลเดือนที่ 2 ยังเป็นบวก'},
    {t:'การตรวจทางอณูชีววิทยาและทดสอบความไวต่อยา — ก่อนเริ่มรักษาทุกราย และเมื่อ AFB ยังเป็นบวกที่สิ้นเดือนที่ 2 หรือเดือนที่ 5'},
    {t:'รักษาหาย (cured) — ผู้ป่วย AFB บวกก่อนรักษา ที่รักษาครบกำหนดและ AFB smear หรือ culture เป็นลบในเดือนสุดท้าย ร่วมกับเป็นลบก่อนนั้นอีกอย่างน้อย 1 ครั้ง'},
    {t:'ขาดยา (lost to follow-up) — ขาดยาติดต่อกันเกิน 2 เดือนด้วยสาเหตุใดก็ตาม ต้องติดตามผู้ป่วยกลับเข้าระบบและประเมินเชื้อดื้อยาซ้ำ'},
    {t:'ไม่ใช้ยาเดี่ยวและไม่เพิ่มยาเพียงตัวเดียวเข้าสูตรที่ล้มเหลว เพราะทำให้เกิดเชื้อดื้อยา'}
  ]}
];

export const REF_TB_CITES = [
  'แนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 (National Tuberculosis Control Programme Guideline, Thailand 2021) กองวัณโรค กรมควบคุมโรค กระทรวงสาธารณสุข — บทที่ 5 การรักษาวัณโรคที่ไวต่อยา ตารางที่ 5.1–5.9',
  'WHO consolidated guidelines on tuberculosis. Module 4: treatment — drug-susceptible tuberculosis treatment. Geneva: World Health Organization; 2022',
  'WHO consolidated guidelines on tuberculosis. Module 1: prevention — tuberculosis preventive treatment, 2nd ed. Geneva: WHO; 2024',
  'WHO operational handbook on tuberculosis. Module 4: treatment — drug-susceptible tuberculosis treatment. Geneva: WHO; 2022',
  'Nahid P, Dorman SE, Alipanah N, et al. Official ATS/CDC/IDSA clinical practice guidelines: treatment of drug-susceptible tuberculosis. Clin Infect Dis. 2016;63(7):e147-e195',
  'Sterling TR, Njie G, Zenner D, et al. Guidelines for the treatment of latent tuberculosis infection: recommendations from the NTCA and CDC, 2020. MMWR Recomm Rep. 2020;69(1):1-11',
  'Saukkonen JJ, Cohn DL, Jasmer RM, et al. An official ATS statement: hepatotoxicity of antituberculosis therapy. Am J Respir Crit Care Med. 2006;174(8):935-952'
];

export const REF_WF_BLOCKS = [
  {h:'การเริ่มยาและการตรวจติดตาม INR', kind:'list', items:[
    {t:'ภาวะไม่เร่งด่วน เช่น chronic stable AF — เริ่ม 3 มก./วัน จะเห็นผลการรักษาใน 5–7 วัน หรือเริ่มต่ำกว่านี้หากมีความเสี่ยงเลือดออกสูง (คำแนะนำระดับ ++)'},
    {t:'ต้องการผลเร็ว — ให้ heparin ตามข้อบ่งชี้ร่วมกับ warfarin 3 มก. และหยุด heparin เมื่อ INR อยู่ในช่วงเป้าหมายติดกัน 2 วัน'},
    {t:'ตรวจ INR ครั้งแรกหลังเริ่มยา 2–3 วัน · อาจต้องเจาะทุกวันจนกว่า INR เข้าช่วงเป้าหมาย'},
    {t:'หลังจากนั้นเจาะสัปดาห์ละ 3 ครั้งอีก 1–2 สัปดาห์ แล้วยืดระยะออกไปตามความคงที่ของค่า'},
    {t:'ตรวจ INR ซ้ำภายใน 1 สัปดาห์ทุกครั้งที่ปรับขนาดยา'},
    {t:'ผู้ที่ขนาดยาคงที่และ INR อยู่ในช่วงเป้าหมายสม่ำเสมอ — ตรวจอย่างน้อยทุก 4 สัปดาห์'},
    {t:'ผู้ที่ INR ไม่คงที่เป็นประจำ — ตรวจอย่างน้อยทุก 2 สัปดาห์'}
  ]},
  {h:'ตารางปรับขนาดยาเพื่อให้ได้ INR เป้าหมาย 2.0–3.0', kind:'inr', sub:'ตารางที่ 3 แนวทางการรักษาผู้ป่วยด้วยยาต้านการแข็งตัวของเลือดชนิดรับประทาน สมาคมแพทย์โรคหัวใจแห่งประเทศไทย',
   foot:'ปรับขนาดขึ้นหรือลงครั้งละ 5–20% โดยคำนวณจากขนาดรวมต่อสัปดาห์ · เมื่อ INR อยู่นอกช่วงเป้าหมาย ต้องหาสาเหตุก่อนปรับขนาดยาเสมอ · หาก INR อยู่นอกช่วงไม่มาก (1.5–2 หรือ 3–4) และไม่มีสาเหตุชัดเจน อาจยังไม่ปรับยาแต่ติดตาม INR บ่อยขึ้นเพื่อดูแนวโน้ม เหมาะกับผู้ที่ความเสี่ยงเลือดออกและลิ่มเลือดอุดตันไม่สูง'},
  {h:'สาเหตุที่ทำให้ INR อยู่นอกช่วงเป้าหมาย', kind:'list', sub:'ตารางที่ 2 — ต้องหาสาเหตุก่อนปรับขนาดยาทุกครั้ง', items:[
    {t:'ความผิดพลาดของการตรวจทางห้องปฏิบัติการ หรือการเปลี่ยนชนิด thromboplastin ที่ใช้ทดสอบ'},
    {t:'ปริมาณวิตามินเคในอาหารที่บริโภคเปลี่ยนแปลง หรือการดูดซึมวิตามินเคและ warfarin เปลี่ยนไป'},
    {t:'การสังเคราะห์และการสลายของ coagulation factor เปลี่ยนแปลง เช่น ภาวะไข้ ตับบกพร่อง ทุพโภชนาการ'},
    {t:'อันตรกิริยาของยาที่ใช้ร่วม — โดยเฉพาะ paracetamol NSAIDs และยาปฏิชีวนะ'},
    {t:'การกินยาไม่ถูกต้องหรือไม่สม่ำเสมอ — ลืมกิน กินผิดขนาด หรือปรับยาเอง'},
    {t:'การดื่มแอลกอฮอล์ การติดเชื้อ และอุจจาระร่วง'}
  ]},
  {h:'ช่วง INR เป้าหมายตามข้อบ่งใช้', kind:'target', sub:'ตารางที่ 1 ระดับ INR ที่เหมาะสมในแต่ละกลุ่ม'},
  {h:'อันตรกิริยาและผลิตภัณฑ์ที่ต้องระวัง', kind:'inter'},
  {h:'การใช้ยาในระยะก่อนและหลังการทำหัตถการ', kind:'list', items:[
    {t:'หัตถการที่ต้องให้ INR ต่ำกว่า 1.5 — หยุด warfarin 4–5 วันก่อนทำหัตถการ (คำแนะนำระดับ ++)'},
    {t:'เริ่ม warfarin ใหม่ 12–24 ชั่วโมงหลังหัตถการ ถ้าไม่มีเลือดออก'},
    {t:'หัตถการทางทันตกรรมเล็กน้อย หัตถการผิวหนังเล็กน้อย และการผ่าตัดต้อกระจก — ทำได้โดยไม่ต้องหยุดยา'},
    {t:'ผู้ที่มีลิ้นหัวใจเทียมชนิดโลหะ atrial fibrillation หรือ VTE ที่มีความเสี่ยง thromboembolism สูง — ให้ bridging anticoagulation ระหว่างหยุด warfarin'},
    {t:'ความเสี่ยงต่ำ — หยุดยาโดยไม่ต้องให้ bridging · ความเสี่ยงปานกลาง — พิจารณาให้ bridging'},
    {t:'หยุดยาแล้ว INR ยังสูงกว่า 1.5 ใน 1–2 วันก่อนหัตถการ — พิจารณา vitamin K 1–2 มก. รับประทาน'},
    {t:'หัตถการเร่งด่วน (urgent) — ให้ vitamin K 2.5–5.0 มก. รับประทานหรือทางหลอดเลือดดำ ยกเว้นผู้ที่มีลิ้นหัวใจเทียมชนิดโลหะ'},
    {t:'หัตถการฉุกเฉิน (emergency) — ให้ FFP หรือ prothrombin complex concentrate ร่วมกับ vitamin K ขนาดต่ำ ยกเว้นผู้ที่มีลิ้นหัวใจเทียมชนิดโลหะซึ่งไม่ควรได้รับ vitamin K ร่วมด้วย'},
    {t:'ขนาดยา bridging — enoxaparin 1.5 มก./กก. วันละครั้ง หรือ 1 มก./กก. วันละ 2 ครั้ง (therapeutic) · enoxaparin 30 มก. วันละ 2 ครั้ง (low dose) · IV UFH ปรับให้ aPTT 1.5–2 เท่าของค่าควบคุม'},
    {t:'หยุด therapeutic LMWH 12–24 ชั่วโมงก่อนหัตถการ (ให้ครึ่งขนาดในมื้อเช้า) และหยุด IV UFH 4–6 ชั่วโมงก่อนหัตถการ'},
    {t:'ผ่าตัดเล็กหรือเสี่ยงเลือดออกน้อย — เริ่ม LMWH ประมาณ 24 ชั่วโมงหลังหัตถการ · ผ่าตัดใหญ่หรือเสี่ยงเลือดออกสูง — เริ่มหลัง 48–72 ชั่วโมง'},
    {t:'หลังหัตถการให้ LMWH หรือ UFH ต่อจนกระทั่ง INR อยู่ในระดับที่ต้องการครบ 3 วัน'}
  ]},
  {h:'การใช้ยาในหญิงตั้งครรภ์และให้นมบุตร', kind:'list', danger:true, items:[
    {t:'Warfarin ผ่านรกและมี teratogenic effect — เป็นข้อห้ามในการตั้งครรภ์ โอกาสเกิด warfarin embryopathy (nasal hypoplasia, stippled epiphyses) ร้อยละ 6.4 สูงสุดในไตรมาสแรก แต่พบน้อยมากเมื่อขนาดยาต่ำกว่า 5 มก./วัน'},
    {t:'ได้รับ warfarin ช่วงใดก็ตามของการตั้งครรภ์ — ทารกเสี่ยงความผิดปกติของระบบประสาทส่วนกลางจาก intracranial hemorrhage ร้อยละ 3 · ได้รับในระยะใกล้คลอดเสี่ยงถึงร้อยละ 12'},
    {t:'ผู้ป่วยที่ได้ warfarin เพื่อรักษา VTE และตั้งครรภ์ — เปลี่ยนเป็น LMWH หรือ UFH ตลอดช่วงตั้งครรภ์ (คำแนะนำระดับ ++ หลักฐานระดับ 1)'},
    {t:'ผู้ที่มีลิ้นหัวใจเทียมชนิดโลหะและตั้งครรภ์ — พิจารณาให้ adjusted dose LMWH หรือ UFH ตลอดการตั้งครรภ์ หรือให้ในสัปดาห์ที่ 6 ถึง 13 แล้วกลับมาใช้ warfarin จนถึงระยะใกล้คลอด 2–3 สัปดาห์จึงเปลี่ยนกลับ'},
    {t:'ลิ้นหัวใจเทียมชนิดโลหะที่ความเสี่ยงสูง (ลิ้นรุ่นเก่า ตำแหน่งไมตรัล หรือเคยมี thromboembolism) — ใช้ warfarin ตลอดการตั้งครรภ์โดยคุม INR 2.5–3.5 และพิจารณาให้ aspirin 75–100 มก./วัน ร่วมด้วย'},
    {t:'ผู้ที่วางแผนตั้งครรภ์ — ตรวจ urine pregnancy test สม่ำเสมอ และเปลี่ยนเป็น UFH หรือ LMWH เมื่อพบว่าตั้งครรภ์'},
    {t:'การใช้ warfarin หรือ heparin ทำให้เสี่ยงแท้งหรือทารกเสียชีวิตในครรภ์ประมาณร้อยละ 20–25 — ควรให้ผู้ป่วยมีส่วนร่วมในการตัดสินใจ'},
    {t:'ให้นมบุตรได้ทั้ง warfarin, UFH และ LMWH'}
  ]},
  {h:'หัวข้อการให้ความรู้ผู้ป่วยและข้อควรปฏิบัติ', kind:'list', items:[
    {t:'อธิบายว่า warfarin คืออะไร ออกฤทธิ์อย่างไร ทำไมต้องรับประทาน และต้องรับประทานนานเท่าใด'},
    {t:'อธิบายความหมายและเป้าหมายของค่า INR พร้อมความสำคัญของการตรวจเลือดสม่ำเสมอ เพื่อลดความเสี่ยงเลือดออกและลิ่มเลือดอุดตัน'},
    {t:'ข้อปฏิบัติหากลืมรับประทานยา · อันตรกิริยาระหว่างยา อาหารเสริม และสมุนไพร · ชนิดอาหารที่มีวิตามินเคสูงและผลต่อค่า INR'},
    {t:'การคุมกำเนิดและผลของ warfarin ต่อทารกในครรภ์ · อาการและอาการแสดงของภาวะเลือดออกง่ายและลิ่มเลือดอุดตัน · ช่องทางติดต่อกรณีฉุกเฉิน'},
    {t:'ข้อควรปฏิบัติ — หลีกเลี่ยงกีฬาที่มีการกระทบกระแทก สวมถุงมือเมื่อใช้อุปกรณ์มีคม ลดหรือเลิกแอลกอฮอล์ ระวังการลื่นล้มโดยเฉพาะผู้สูงอายุ'},
    {t:'ข้อควรปฏิบัติ — สวมหมวกกันน็อกทุกครั้งที่ขับขี่รถจักรยานยนต์ หลีกเลี่ยงการนวดที่รุนแรง หลีกเลี่ยงการฉีดยาเข้ากล้าม และแจ้งแพทย์หรือทันตแพทย์ทุกครั้งว่ารับประทาน warfarin'},
    {t:'ข้อผิดพลาดที่พบบ่อยในการรักษา — ปรับขนาดยาไม่เหมาะสม (เร็วเกินไป) ขาดความระวังเรื่องอันตรกิริยา และให้ความรู้ผู้ป่วยไม่เพียงพอ'}
  ]},
  {h:'การจัดระบบบริการและตัวชี้วัดคุณภาพ', kind:'list', items:[
    {t:'ควรจัดระบบดูแลผู้ป่วยโดยทีมสหสาขาวิชาชีพ ประกอบด้วยแพทย์ เภสัชกร และพยาบาลหรือ case manager (คำแนะนำระดับ ++ หลักฐานระดับ 2)'},
    {t:'จัดระบบให้ระยะเวลาที่ค่า INR อยู่ในช่วงการรักษา (time in therapeutic range) สูงสุด คำนวณด้วย Rosendaal linear interpolation method'},
    {t:'เพิ่มร้อยละของจำนวนค่า INR ที่อยู่ในช่วงรักษา — เป้าหมายไม่ต่ำกว่าร้อยละ 65'},
    {t:'ลดอัตราการขาดนัดของผู้ป่วย · ลดอัตราการเกิดภาวะเลือดออกหรือลิ่มเลือดอุดตันให้ต่ำสุด'},
    {t:'ลดอัตราการมีค่า INR อยู่นอกเป้าหมายมาก (INR ต่ำกว่า 1.5 หรือมากกว่า 5) ให้ต่ำสุด'}
  ]}
];

export const REF_WF_INR = [
  {r:'INR น้อยกว่า 1.5', act:'เพิ่มขนาดยา 10–20% ของขนาดต่อสัปดาห์', fu:'ตรวจ INR ซ้ำอย่างน้อยทุก 2 สัปดาห์ในช่วงปรับยา — ถี่ขึ้นหากเสี่ยง thromboembolism สูง เช่น ลิ้นหัวใจเทียม หรือมะเร็ง', lv:'low'},
  {r:'INR 1.5–1.9', act:'เพิ่มขนาดยา 5–10% ของขนาดต่อสัปดาห์ หรืออาจไม่ปรับยาแต่ติดตามค่า INR บ่อยขึ้นเพื่อดูแนวโน้ม', fu:'ตรวจ INR ซ้ำภายใน 1–2 สัปดาห์', lv:'mid'},
  {r:'INR 2.0–3.0', act:'คงขนาดยาเดิม (อยู่ในช่วงเป้าหมาย)', fu:'ตรวจซ้ำทุก 4 สัปดาห์เมื่อค่าคงที่ · ทุก 2 สัปดาห์เมื่อค่าไม่คงที่', lv:'ok'},
  {r:'INR 3.1–3.9', act:'ลดขนาดยา 5–10% ของขนาดต่อสัปดาห์', fu:'ตรวจ INR ซ้ำภายใน 1–2 สัปดาห์', lv:'mid'},
  {r:'INR 4.0–4.9 ไม่มีเลือดออก', act:'งดยา 1 วัน แล้วเริ่มใหม่ที่ขนาดต่ำลง 10% ของขนาดต่อสัปดาห์เดิม', fu:'ติดตาม INR จนเข้าช่วงรักษาก่อนเริ่มยาใหม่', lv:'mid'},
  {r:'INR 5.0–8.9 ไม่มีเลือดออก', act:'งดยา 2 วัน แล้วเริ่มใหม่ที่ขนาดต่ำลงประมาณ 20% · มีปัจจัยเสี่ยงเลือดออกร่วม พิจารณา vitamin K1 1–2.5 มก. รับประทาน · ต้องแก้ไขเร่งด่วน เช่น ต้องผ่าตัด ให้ vitamin K1 2.5–5 มก. เพื่อให้ INR กลับเข้าช่วงใน 24 ชั่วโมง', fu:'ติดตาม INR อย่างใกล้ชิดจนเข้าช่วงรักษา', lv:'high'},
  {r:'INR มากกว่า 9.0 ไม่มีเลือดออก', act:'หยุด warfarin และให้ vitamin K1 2.5–5 มก. ชนิดรับประทาน · หาก INR ยังสูงอยู่ ให้ vitamin K1 1–2 มก. รับประทานซ้ำอีกครั้ง', fu:'คาดว่า INR กลับเข้าช่วงรักษาใน 24–48 ชั่วโมง ติดตามอย่างใกล้ชิด', lv:'high'},
  {r:'เลือดออกรุนแรง (ทุกค่า INR)', act:'ให้ vitamin K1 10 มก. ทางหลอดเลือดดำอย่างช้า ๆ ร่วมกับ fresh frozen plasma หรือ prothrombin complex concentrate หรือ recombinant factor VIIa ตามความรุนแรงและความเร่งด่วน', fu:'อาจให้ vitamin K1 ซ้ำได้ทุก 12 ชั่วโมง — ส่งต่อทันที', lv:'high'}
];

export const REF_WF_TARGET = [
  {ind:'Prophylaxis of venous thrombosis (high-risk surgery)', t:'2.0–3.0'},
  {ind:'Treatment of venous thrombosis', t:'2.0–3.0'},
  {ind:'Treatment of pulmonary embolism', t:'2.0–3.0'},
  {ind:'Prevention of systemic embolism', t:'2.0–3.0'},
  {ind:'Tissue heart valves (ลิ้นหัวใจเทียมชนิดเนื้อเยื่อ)', t:'2.0–3.0'},
  {ind:'Mechanical prosthetic heart valves (ทั่วไป)', t:'2.0–3.0'},
  {ind:'Mechanical prosthetic valves (high risk)', t:'2.5–3.5'},
  {ind:'Acute myocardial infarction (ป้องกัน systemic embolism)', t:'2.0–3.0'},
  {ind:'Valvular heart disease', t:'2.0–3.0'},
  {ind:'Atrial fibrillation (รวม valvular AF และ paroxysmal AF)', t:'2.0–3.0'},
  {ind:'Embolic stroke หรือ recurrent cerebral infarction', t:'2.0–3.0'},
  {ind:'Dilated cardiomyopathy with intracardiac thrombus', t:'2.0–3.0'},
  {ind:'Pre-cardioversion — 3 สัปดาห์ก่อนและ 4 สัปดาห์หลัง', t:'2.0–3.0'},
  {ind:'Bioprosthetic valve หรือ mitral valve repair ที่มี annuloplasty ring — 3 เดือนแรกหลังผ่าตัด', t:'2.0–3.0'}
];

export const REF_WF_INTER = [
  {d:'ยาเสริมฤทธิ์ warfarin ที่พบบ่อย (เพิ่ม INR)', list:'ยาปฏิชีวนะ — erythromycin, clarithromycin, co-trimoxazole, ciprofloxacin, cefoperazone, metronidazole · ยาต้านเชื้อรา — ketoconazole, itraconazole, fluconazole · ยาลดกรด — cimetidine และ proton-pump inhibitor · ยาหัวใจ — amiodarone, propafenone, fluvastatin, rosuvastatin, propranolol', act:'ลดขนาด warfarin ล่วงหน้าและตรวจ INR ภายใน 3–5 วันหลังเริ่มยาร่วม', lv:'high'},
  {d:'ยาต้านฤทธิ์ warfarin ที่พบบ่อย (ลด INR)', list:'Enzyme inducer — rifampicin, phenytoin, carbamazepine, phenobarbital, griseofulvin · ยาที่ลดการดูดซึม — cholestyramine, sucralfate', act:'อาจต้องเพิ่มขนาดยามากเมื่อใช้ rifampicin ร่วม และตรวจ INR ถี่ขึ้นทั้งช่วงเริ่มและช่วงหยุดยาร่วม', lv:'mid'},
  {d:'ยาที่เพิ่มความเสี่ยงเลือดออกโดยไม่เปลี่ยน INR', list:'NSAIDs ทุกชนิดรวมกลุ่ม coxib · aspirin (รวมยาชุดและยาแก้ปวดที่มี ASA เช่น ทัมใจ บูรา ปวดหาย) · steroid รวมถึงยาลูกกลอน · clopidogrel · heparin', act:'หลีกเลี่ยง หากจำเป็นให้ใช้ร่วมกับยาป้องกันแผลในกระเพาะอาหารและเฝ้าระวังอาการเลือดออกอย่างใกล้ชิด', lv:'high'},
  {d:'สมุนไพรและอาหารเสริมที่ควรหลีกเลี่ยง', list:'แปะก๊วย (Ginkgo biloba) และโสม (ginseng) · ผักสกัดอัดเม็ด คลอโรฟิลล์อัดเม็ด อัลฟัลฟา ชาเขียว · น้ำมันปลาและวิตามินอี (รบกวนการทำงานของเกล็ดเลือด) · วิตามินเคขนาดสูงและผลิตภัณฑ์ที่มีวิตามินเค เช่น Glakay · โคเอนไซม์คิวเทน', act:'แนะนำให้หยุดใช้ และให้ผู้ป่วยแจ้งทุกครั้งที่จะเริ่มผลิตภัณฑ์ใหม่ เพราะไม่มีข้อมูลขนาดที่ปลอดภัย', lv:'high'},
  {d:'อาหารที่มีวิตามินเคสูง', list:'ผักใบเขียวเข้ม เช่น คะน้า ผักโขม บรอกโคลี ผักกวางตุ้ง ตำลึง · ชาเขียว · น้ำมันถั่วเหลือง', act:'ไม่ต้องงด แต่ให้รับประทานในปริมาณสม่ำเสมอทุกสัปดาห์ เพราะการเปลี่ยนปริมาณคือสาเหตุที่พบบ่อยของ INR แกว่ง', lv:'mid'}
];

export const REF_WF_CITES = [
  'แนวทางการรักษาผู้ป่วยด้วยยาต้านการแข็งตัวของเลือดชนิดรับประทาน (วอร์ฟาริน) สมาคมแพทย์โรคหัวใจแห่งประเทศไทย ในพระบรมราชูปถัมภ์ — ตารางที่ 1–6 และแผนภาพที่ 1',
  '8th ACCP Conference on Antithrombotic and Thrombolytic Therapy. Chest. 2008;133(6 Suppl)',
  'Holbrook A, Schulman S, Witt DM, et al. Evidence-based management of anticoagulant therapy: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: ACCP Guidelines. Chest. 2012;141(2 Suppl):e152S-e184S',
  'Ageno W, Gallus AS, Wittkowsky A, et al. Oral anticoagulant therapy: ACCP evidence-based clinical practice guidelines. Chest. 2012;141(2 Suppl):e44S-e88S',
  'Witt DM, Nieuwlaat R, Clark NP, et al. American Society of Hematology 2018 guidelines for management of venous thromboembolism: optimal management of anticoagulation therapy. Blood Adv. 2018;2(22):3257-3291',
  'Schulman S. Clinical practice: care of patients receiving long-term anticoagulant therapy. N Engl J Med. 2003;349(7):675-683',
  'Dunn AS, Turpie AG. Perioperative management of patients receiving oral anticoagulants: a systematic review. Arch Intern Med. 2003;163(8):901-908',
  'Chan WS, Anand S, Ginsberg JS. Anticoagulation of pregnant women with mechanical heart valves: a systematic review of the literature. Arch Intern Med. 2000;160(2):191-196',
  'ACC/AHA Foundation guide to warfarin therapy. Circulation. 2003;107(12):1692-1711',
  'Nutescu EA, Shapiro NL, Ibrahim S, West P. Warfarin and its interactions with foods, herbs and other dietary supplements. Expert Opin Drug Saf. 2006;5(3):433-451'
];

export const REF_BL_GROUPS = [
  {g:'Aminopenicillin / R1 เหมือนกัน', pale:'#F7EBE2', items:'Amoxicillin ↔ Cefadroxil, Cefprozil · Ampicillin ↔ Cephalexin, Cefaclor, Cefradine', risk:'X1 — มีหลักฐานทางคลินิกของการแพ้ข้ามกัน ห้ามสั่งใช้', fg:'#B3261E'},
  {g:'Aminothiazolyl-methoxyimino / R1 เหมือนกัน', pale:'#F7EBE2', items:'Ceftriaxone ↔ Cefotaxime ↔ Cefpodoxime ↔ Cefepime', risk:'X1–X2 — side chain เดียวกัน ห้ามสั่งใช้', fg:'#B3261E'},
  {g:'Aminothiazolyl-oxyimino / R1 คล้ายกัน', pale:'#FBF1DE', items:'Cefixime · Cefuroxime — คล้ายกับ ceftriaxone, cefotaxime, ceftazidime, cefepime', risk:'X3 — side chain คล้ายกัน มีโอกาสแพ้ข้ามกัน ห้ามสั่งใช้', fg:'#A66A00'},
  {g:'Aminothiazolyl-dimethylacetic / R1 เหมือนกัน', pale:'#FBF1DE', items:'Ceftazidime ↔ Aztreonam', items2:'', risk:'X2 — side chain เดียวกัน (ทฤษฎี ยังไม่มีหลักฐานคลินิก) ห้ามสั่งใช้', fg:'#A66A00'},
  {g:'Natural penicillin (ปฏิกิริยาที่ beta-lactam ring)', pale:'#F7EBE2', items:'Penicillin G/V ↔ Ampicillin ↔ Amoxicillin ↔ Piperacillin ↔ Cloxacillin', risk:'X4–X5 — แพ้ข้ามกันได้แม้ side chain ต่าง เพราะปฏิกิริยาเกิดที่วง beta-lactam', fg:'#B3261E'},
  {g:'R2 (3-position side chain) เหมือนกัน', pale:'#FBF1DE', items:'Cephalexin ↔ Cefradine · Cefdinir ↔ Cefixime · Cefuroxime ↔ Cefoxitin', risk:'มีโอกาสแพ้ข้ามกันจาก R2 แม้ R1 ต่างกัน — เลี่ยงเมื่อการแพ้เดิมรุนแรง', fg:'#A66A00'},
  {g:'R1 เหมือนกันข้ามกลุ่ม penicillin–cephalosporin', pale:'#FBF1DE', items:'Penicillin G ↔ Cefoxitin', risk:'R1 เหมือนกัน — พิจารณาเลี่ยงเมื่อแพ้ penicillin G แบบรุนแรง', fg:'#A66A00'},
  {g:'Side chain เฉพาะตัว — ไม่เหมือนยาใดในกลุ่ม', pale:'#E7F2EC', items:'Cefazolin · Cefoxitin', risk:'ถือว่าปลอดภัย สั่งใช้ได้ (cefazolin: dual allergy กับ penicillin < 1%)', fg:'#2E7D5B'},
  {g:'Carbapenem — side chain ต่างจากทุกกลุ่ม', pale:'#E7F2EC', items:'Meropenem · Imipenem · Ertapenem (ทั้งสามมี side chain ใกล้กัน ระวังข้ามกันเองเมื่อแพ้ตัวใดตัวหนึ่ง)', risk:'cross-reactivity กับ penicillin/cephalosporin < 1% สั่งใช้ได้', fg:'#2E7D5B'}
];

export const REF_BL_AVOID = ['ปฏิกิริยาเดิมทำให้ต้องเข้ารักษาใน ICU','Interstitial nephritis จากยากลุ่ม beta-lactam','Hepatitis จากยากลุ่ม beta-lactam','Hemolytic anemia จากยากลุ่ม beta-lactam','Stevens-Johnson syndrome (SJS)','Toxic epidermal necrolysis (TEN)','Exfoliative dermatitis','Acute generalized exanthematous pustulosis (AGEP)','DRESS (drug reaction with eosinophilia and systemic symptoms)'];

export const REF_NSAID = [
  ['Salicylate', [['Aspirin','c1']]],
  ['Propionic acid', [['Ibuprofen','c1'],['Naproxen','c1'],['Ketoprofen','c1'],['Flurbiprofen','c1']]],
  ['Phenylacetic acid', [['Diclofenac','c1']]],
  ['Indole acetic acid', [['Indomethacin','c1'],['Sulindac','c1']]],
  ['Pyrrole acetic acid', [['Ketorolac','c1']]],
  ['Heteroaryl acetic acid', [['Etodolac','pref']]],
  ['Oxicam (Enolic)', [['Piroxicam','c1'],['Meloxicam','pref'],['Tenoxicam','c1']]],
  ['Fenamate (Anthranilic)', [['Mefenamic acid','c1']]],
  ['Coxib (Sulfonamide)', [['Celecoxib','c2'],['Etoricoxib','c2'],['Parecoxib','c2']]],
  ['Sulfonanilide', [['Nimesulide','pref']]],
  ['Pyrazolone', [['Metamizole','c1']]],
  ['Para-aminophenol', [['Paracetamol','weak']]]
];

export const REF_NSAID_CMP = [
  ['อาการ', 'Angioedema, urticaria, anaphylaxis — มักเกิดภายใน 24 ชม. หลังได้รับยา', 'เฉียบพลัน (≤ 24 ชม.): angioedema, urticaria, anaphylaxis · ล่าช้า (> 24 ชม.): MP rash, SJS, TEN, AGEP, DRESS, fixed drug eruption, photo/contact dermatitis'],
  ['กลไก', 'ยับยั้ง COX-1 ทำให้ PGE2 ลดลง (pharmacological)', 'ภูมิคุ้มกัน 2 แบบ — Type I: IgE-mediated · Type IV: T-cell mediated'],
  ['การแพ้ข้ามกัน', 'ข้ามกันในยาที่ยับยั้ง COX-1 ทุกตัว ไม่ขึ้นกับโครงสร้างเคมี', 'ข้ามกันเฉพาะตัวยา หรือกลุ่มยาที่มีโครงสร้างเคมีเหมือนกัน'],
  ['การจัดการ', 'หลีกเลี่ยง NSAIDs ที่ยับยั้ง COX-1 ทุกตัว · ใช้ COX-2 selective หรือ paracetamol แทน', 'หลีกเลี่ยง NSAIDs ตัวที่แพ้และตัวที่มีโครงสร้างเคมีเดียวกัน · ตัวที่โครงสร้างต่างกลุ่มมักใช้ได้'],
  ['ลักษณะที่บ่งชี้', 'เคยแพ้ NSAIDs มากกว่า 1 ตัว โดยอยู่ต่างกลุ่มโครงสร้าง', 'เคยแพ้ NSAIDs > 1 ตัวที่อยู่กลุ่มโครงสร้างเดียวกัน หรือแพ้เพียงตัวเดียวโดยใช้ตัวอื่นที่โครงสร้างต่างกันได้']
];

export const REF_AED = [
  {head:'Aromatic AED — มีวง aromatic / phenyl', arom:true, rows:[
    ['Iminostilbene (Dibenzazepine)', ['Carbamazepine','Oxcarbazepine','Eslicarbazepine']],
    ['Hydantoin', ['Phenytoin','Fosphenytoin']],
    ['Barbiturate', ['Phenobarbital','Primidone']],
    ['Phenyltriazine', ['Lamotrigine']],
    ['Sulfonamide AED', ['Zonisamide']]]},
  {head:'Non-aromatic AED — ไม่มีวง aromatic', arom:false, rows:[
    ['Branched-chain fatty acid', ['Valproic acid']],
    ['Pyrrolidone (Racetam)', ['Levetiracetam','Brivaracetam']],
    ['Sulfamate-monosaccharide', ['Topiramate']],
    ['GABA analog', ['Gabapentin','Pregabalin','Vigabatrin']],
    ['Nipecotic acid derivative', ['Tiagabine']],
    ['Functionalized amino acid', ['Lacosamide']],
    ['Succinimide', ['Ethosuximide']]]}
];

export const REF_SULFA = [
  {sec:'Antibiotic (ATB) sulfonamide', atb:true, rows:[
    ['Sulfamethoxazole', 'Bactrim', true, true, 'C'],
    ['Sulfadiazine', '', true, true, 'C'],
    ['Sulfasalazine', 'Salazopyrin EN', true, true, 'C']]},
  {sec:'Non-ATB sulfonamide', atb:false, rows:[
    ['Hydrochlorothiazide', 'HCTZ · Thiazide diuretic', false, false, 'C'],
    ['Indapamide', 'Natrilix SR · Thiazide-like', false, false, 'C'],
    ['Furosemide', 'Lasix · Loop diuretic', false, false, 'C'],
    ['Torsemide', 'Unat · Loop diuretic', false, false, '-'],
    ['Acetazolamide', 'Carbonic anhydrase inhibitor', false, false, '-'],
    ['Brinzolamide', 'Azopt · CAI', false, false, 'C'],
    ['Dorzolamide', 'Cosopt · CAI', false, false, 'P'],
    ['Chlorpropamide', 'Dibenese · Sulfonylurea', false, false, 'C'],
    ['Glibenclamide', 'Daonil · Sulfonylurea', false, false, 'P'],
    ['Glipizide', 'Minidiab · Sulfonylurea', false, false, 'C'],
    ['Gliclazide', 'Diamicron · Sulfonylurea', false, false, 'C'],
    ['Glimepiride', 'Amaryl · Sulfonylurea', false, false, 'C'],
    ['Celecoxib', 'Celebrex · COX-2 inhibitor', false, false, 'C'],
    ['Parecoxib', 'Dynastat · COX-2 inhibitor', false, false, 'C'],
    ['Topiramate', 'Topamax', false, false, '-'],
    ['Zonisamide', '', false, false, 'C'],
    ['Dapsone', '', false, true, 'P']]}
];

export const REF_SULFA_NOTES = [
  'ทบทวนรายงานการแพ้ซ้ำกันในกลุ่ม ATB sulfonamide เนื่องจากมี arylamine ที่ตำแหน่ง N4 และ nitrogen-containing ring ที่ตำแหน่ง N1 ซึ่งเป็นโครงสร้างที่ทำให้เกิดการแพ้',
  'เอกสารกำกับยาของ non-ATB sulfonamide หลายรายการยังระบุข้อห้ามใช้ในผู้ป่วยที่มีประวัติแพ้ sulfa ทั้งที่ไม่มีหลักฐานสนับสนุน จึงควรตัดสินใจร่วมกับแพทย์และบันทึกเหตุผลไว้',
  'ยาที่ไม่ใช่กลุ่ม sulfonamide แต่มีโครงสร้าง arylamine เช่น benzocaine และ dapsone อาจทำให้เกิดการแพ้ข้ามกลุ่มกับ ATB sulfonamide ได้'
];

export const REF_CITES = {
  bl: ['Interior Health Authority. Beta-lactam antibiotic cross-allergy chart.',
       'Sousa-Pinto B, Blumenthal KG, et al. Assessment of the frequency of dual allergy to penicillins and cefazolin: a systematic review and meta-analysis. JAMA Surg. 2021;156(4):e210021.',
       'Khan DA, Phillips EJ, Banerji A, et al. Drug allergy: a 2022 practice parameter update. Ann Allergy Asthma Immunol. 2022;129(2):136-152.',
       'Zagursky RJ, Pichichero ME. Cross-reactivity in beta-lactam allergy. J Allergy Clin Immunol Pract. 2018;6(1):72-81.'],
  nsaid: ['Kowalski ML, Asero R, Bavbek S, et al. Classification and practical approach to the diagnosis and management of hypersensitivity to NSAIDs. Allergy. 2013;68(10):1219-1232. (EAACI/ENDA position paper)',
       'Kowalski ML, Woessner K, Sanak M. Approaches to the diagnosis and management of patients with a history of NSAID-related urticaria and angioedema. J Allergy Clin Immunol. 2015;136(2):245-251.',
       'Doña I, Pérez-Sánchez N, Eguiluz-Gracia I, et al. Progress in understanding hypersensitivity reactions to NSAIDs. Allergy. 2020;75(3):561-575.',
       'Khan DA, Phillips EJ, Banerji A, et al. Drug allergy: a 2022 practice parameter update. Ann Allergy Asthma Immunol. 2022;129(2):136-152.',
       'Quiralte J, Blanco C, Castillo R, et al. Intolerance to nonsteroidal anti-inflammatory drugs: results of controlled drug challenges in 98 patients. J Allergy Clin Immunol. 1996;98(4):678-685.'],
  aed: ['Shear NH, Spielberg SP. Anticonvulsant hypersensitivity syndrome: in vitro assessment of risk. J Clin Invest. 1988;82(6):1826-1832.',
       'Hirsch LJ, Arif H, Nahm EA, et al. Cross-sensitivity of skin rashes with antiepileptic drug use. Neurology. 2008;71(19):1527-1534.',
       'Wang XQ, Lang SY, Shi XB, et al. Cross-reactivity of skin rashes with current antiepileptic drugs in Chinese population. Seizure. 2010;19(9):562-566.',
       'Hung SI, Chung WH, Liu ZS, et al. Common risk allele in aromatic antiepileptic-drug induced Stevens-Johnson syndrome and toxic epidermal necrolysis in Han Chinese. Pharmacogenomics. 2010;11(3):349-356.',
       'Mockenhaupt M, Viboud C, Dunant A, et al. Stevens-Johnson syndrome and toxic epidermal necrolysis: assessment of medication risks with emphasis on recently marketed drugs (EuroSCAR). J Invest Dermatol. 2008;128(1):35-44.',
       'Chen P, Lin JJ, Lu CS, et al. Carbamazepine-induced toxic effects and HLA-B*1502 screening in Taiwan. N Engl J Med. 2011;364(12):1126-1133.',
       'Locharernkul C, Loplumlert J, Limotai C, et al. Carbamazepine and phenytoin induced Stevens-Johnson syndrome is associated with HLA-B*1502 allele in Thai population. Epilepsia. 2008;49(12):2087-2091.'],
  sulfa: ['Strom BL, Schinnar R, Apter AJ, et al. Absence of cross-reactivity between sulfonamide antibiotics and sulfonamide nonantibiotics. N Engl J Med. 2003;349(17):1628-1635. (landmark cohort n > 30,000)',
       'Brackett CC, Singh H, Block JH. Likelihood and mechanisms of cross-allergenicity between sulfonamide antibiotics and other drugs containing a sulfonamide functional group. Pharmacotherapy. 2004;24(7):856-870.',
       'Giles A, Foushee J, Lantz E, Gumina G. Sulfonamide allergies. Pharmacy (Basel). 2019;7(3):132.',
       'Wulf NR, Matuszewski KA. Sulfonamide cross-reactivity: is there evidence to support broad cross-allergenicity? Am J Health Syst Pharm. 2013;70(17):1483-1494.',
       'ศูนย์ข้อมูลข่าวสารด้านยา โรงพยาบาลมหาราชนครราชสีมา. แนวทางการจัดการการแพ้ยากลุ่ม sulfonamide. เมษายน 2564.']
};

