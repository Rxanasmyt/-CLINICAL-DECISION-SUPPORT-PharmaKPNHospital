// เยื่อหุ้มสมองอักเสบจากแบคทีเรียในผู้ใหญ่ (community-acquired): ยา empiric ตามเชื้อ ขนาดยา dexamethasone และยาป้องกันผู้สัมผัส
// คัดจาก "German guidelines on community-acquired acute bacterial meningitis in adults" (Klein M, et al. Neurol Res Pract 2023;5:44; doi:10.1186/s42466-023-00264-6; PMC10470134; open access)
// แนวทางต่างประเทศ (เยอรมัน/ออสเตรีย/สวิส) ไม่ได้ปรับตามบริบทไทย · สรุปเป็นไทย ตารางที่ 3–6 และข้อแนะนำเรื่องยา · ขนาดยาสำหรับผู้ใหญ่ · รอเภสัชกรทบทวน
import type { Block, Guideline } from './types';

const o = 'แนวทางต่างประเทศ (เยอรมัน 2023, open access) ไม่ได้ปรับตามบริบทไทย — รอเภสัชกรทบทวน';

const blocks: Block[] = [
  { kind: 'kv', h: 'ยา empiric เริ่มต้นตามสถานการณ์', origin: o, sub: 'ตารางที่ 3 และข้อแนะนำ · ให้ยาปฏิชีวนะร่วมกับ dexamethasone ภายใน 1 ชม.หลังถึงโรงพยาบาล', items: [
    { k: 'เกิดในชุมชน ไม่มีภูมิคุ้มกันต่ำ', v: 'Ceftriaxone (หรือ cefotaxime) 2 g วันละ 2 ครั้ง + Ampicillin 2 g วันละ 6 ครั้ง · พื้นที่ที่ pneumococcus ดื้อ cephalosporin สูง (หรือมีประวัติเดินทาง) เพิ่ม Vancomycin 1 g วันละ 2 ครั้ง (ค่าอ้างอิง ต้องวัดระดับยา) หรือ Rifampicin 600 mg วันละครั้ง' },
    { k: 'หลังผ่าตัดประสาทหรือบาดเจ็บศีรษะ', v: 'Vancomycin + Meropenem · หรือ Vancomycin + Ceftazidime (หรือ cefepime) · ถ้าการผ่าตัดผ่านเยื่อบุ เพิ่ม Metronidazole' },
    { k: 'ภูมิคุ้มกันต่ำ', v: 'Vancomycin + Meropenem · อาจต้องครอบคลุมเชื้ออื่น เช่น เชื้อรา ตามสถานการณ์' },
    { k: 'ติดเชื้อที่สายระบายน้ำไขสันหลัง (shunt)', v: 'Vancomycin + Meropenem · หรือ Vancomycin + Ceftazidime' },
    { k: 'ลำดับการให้ยาและ dexamethasone', v: 'เจาะเลือดเพาะเชื้อ 2 ชุด → เจาะน้ำไขสันหลัง (LP) → ให้ dexamethasone และยาปฏิชีวนะทันที · ถ้า LP ล่าช้า (เช่นต้องทำ CT ก่อน) ให้ยาทันทีหลังเจาะเลือด ไม่รอผล · ไม่ควรล่าช้าเกิน 3 ชม.' },
  ] },
  { kind: 'kv', h: 'ยาตามเชื้อที่พบ', origin: o, sub: 'ตารางที่ 4 · การเลือกยาขึ้นกับความไวของเชื้อ', items: [
    { k: 'Neisseria meningitidis', v: 'Ceftriaxone (ไวต่อ ceftriaxone/cefotaxime MIC ≤ 0.125 mg/L) · Meropenem (MIC > 0.125 mg/L) · ไม่ควรเริ่มด้วย penicillin ก่อนทราบผลความไวยา เพราะพบเชื้อดื้อ penicillin เพิ่มขึ้น' },
    { k: 'Streptococcus pneumoniae', v: 'ไวต่อ (MIC ≤ 0.5 mg/L): Ceftriaxone หรือ Meropenem · ดื้อ (MIC > 0.5 mg/L): Ceftriaxone + Vancomycin, หรือ Ceftriaxone + Rifampicin, หรือ Meropenem' },
    { k: 'Haemophilus influenzae', v: 'Ceftriaxone หรือ Ampicillin' },
    { k: 'Group B streptococci', v: 'Penicillin G, Ceftriaxone, Ampicillin หรือ Vancomycin' },
    { k: 'Gram-negative enterobacterales (Klebsiella, E. coli, Proteus)', v: 'Ceftriaxone, Meropenem หรือ Cefepime' },
    { k: 'Pseudomonas aeruginosa', v: 'Ceftazidime, Meropenem หรือ Cefepime · พิจารณาเพิ่ม Fosfomycin' },
    { k: 'Staphylococci', v: 'ไวต่อ methicillin: Cefazolin หรือ Flucloxacillin · ดื้อ methicillin: Vancomycin หรือ Linezolid · พิจารณาเพิ่ม Fosfomycin หรือ Rifampicin' },
    { k: 'Listeria monocytogenes', v: 'Ampicillin, Trimethoprim-sulfamethoxazole หรือ Meropenem · พิจารณาเพิ่ม Fosfomycin หรือ Rifampicin' },
    { k: 'ข้อควรจำ', v: 'Rifampicin, Fosfomycin และ Aminoglycoside ไม่ควรใช้เป็นยาเดี่ยว' },
  ] },
  { kind: 'grid3', h: 'ขนาดยาผู้ใหญ่ต่อวัน (ตารางที่ 5)', origin: o, sub: 'ขนาดสำหรับผู้ใหญ่ ไม่ได้ระบุเกณฑ์ปรับตามไต', head: ['ยา', 'ขนาดต่อวัน', 'หมายเหตุ'], items: [
    { c1: 'Penicillin G', c2: '5 ล้านหน่วย (IU) วันละ 6 ครั้ง', c3: '' },
    { c1: 'Ampicillin', c2: '2 g วันละ 6 ครั้ง', c3: '' },
    { c1: 'Cefotaxime', c2: '2 g วันละ 4 (ถึง 6) ครั้ง', c3: '' },
    { c1: 'Ceftazidime', c2: '2 g วันละ 3 ครั้ง', c3: '' },
    { c1: 'Ceftriaxone', c2: '4 g วันละครั้ง หรือ 2 g วันละ 2 ครั้ง', c3: '' },
    { c1: 'Meropenem', c2: '2 g วันละ 3 ครั้ง', c3: '' },
    { c1: 'Fosfomycin', c2: '5 g วันละ 3 ครั้ง', c3: 'ventriculitis อาจต้อง 8 g วันละ 3 ครั้ง' },
    { c1: 'Rifampicin', c2: '600 mg วันละครั้ง', c3: 'ไม่ใช้เป็นยาเดี่ยว' },
    { c1: 'Vancomycin', c2: '1 g วันละ 2 ครั้ง', c3: 'ต้องวัดระดับยา · dexamethasone อาจลดการซึมเข้าน้ำไขสันหลัง' },
    { c1: 'Linezolid', c2: '600 mg วันละ 2 ครั้ง', c3: '' },
    { c1: 'Gentamicin', c2: '240–360 mg วันละครั้ง (3–6 mg/kg/วัน)', c3: 'ต้องวัดระดับยา · ไม่ใช้เป็นยาเดี่ยว' },
    { c1: 'Metronidazole', c2: '500 mg วันละ 3 ครั้ง', c3: '' },
  ] },
  { kind: 'kv', h: 'Dexamethasone และระยะเวลาการรักษา', origin: o, sub: 'ข้อแนะนำที่ 22 และตารางที่ 4', items: [
    { k: 'Dexamethasone', v: 'แนะนำในเยอรมนี ออสเตรีย สวิตเซอร์แลนด์: 10 mg IV วันละ 4 ครั้ง ร่วมกับยาปฏิชีวนะ · ให้ครั้งแรกก่อนหรือพร้อมยาปฏิชีวนะ · ถ้าเริ่มยาปฏิชีวนะไปแล้วโดยไม่ได้ให้ อาจให้ได้ภายในไม่กี่ชั่วโมงหลังเริ่มยา' },
    { k: 'ระยะเวลาให้ dexamethasone', v: 'ให้ต่อ 4 วันเมื่อพบ pneumococcus หรือยังสงสัย pneumococcal meningitis (เช่นไม่พบเชื้อแต่มีแหล่งจากหู) · ในเยื่อหุ้มสมองอักเสบจาก meningococcus อาจพิจารณาเมื่อมีการได้ยินบกพร่อง' },
    { k: 'ระยะเวลายาปฏิชีวนะ (ไม่ซับซ้อน)', v: 'H. influenzae 7–10 วัน · Pneumococcus 10–14 วัน · Meningococcus 7–10 วัน · Listeria และ Gram-negative enterobacteria มักให้ยา 3 สัปดาห์ขึ้นไป' },
  ] },
  { kind: 'kv', h: 'ยาป้องกันผู้สัมผัสเชื้อ meningococcus', origin: o, sub: 'ตารางที่ 6 (คำแนะนำของ RKI)', items: [
    { k: 'Rifampicin (กิน)', v: 'วัยรุ่นและผู้ใหญ่ > 60 กก.: 600 mg ทุก 12 ชม. นาน 2 วัน · เด็ก/วัยรุ่น < 60 กก.: 10 mg/kg ทุก 12 ชม. นาน 2 วัน · ทารกแรกเกิด: 5 mg/kg ทุก 12 ชม. นาน 2 วัน' },
    { k: 'Ciprofloxacin (กิน)', v: 'ผู้ใหญ่ 500 mg ครั้งเดียว' },
    { k: 'Ceftriaxone (ฉีดเข้ากล้าม)', v: 'อายุ ≥ 12 ปีและผู้ใหญ่ 250 mg ครั้งเดียว · อายุ < 12 ปี 125 mg ครั้งเดียว' },
    { k: 'Azithromycin (กิน)', v: 'ผู้ใหญ่ 500 mg ครั้งเดียว' },
  ] },
  { kind: 'list', h: 'ข้อควรระวังด้านยา', origin: o, danger: true, items: [
    { t: 'ไม่ควรใช้ rifampicin, fosfomycin หรือ aminoglycoside เป็นยาเดี่ยว' },
    { t: 'Vancomycin และ gentamicin ต้องวัดระดับยา และ dexamethasone อาจลดการซึมของ vancomycin เข้าน้ำไขสันหลัง' },
    { t: 'ไม่ควรเริ่มรักษา meningococcal meningitis ด้วย penicillin ก่อนทราบผลความไวยา เพราะเชื้อดื้อ penicillin พบเพิ่มขึ้นในเยอรมนี (ร้อยละ 3.9–8.5 ในปี 2019–2021)' },
    { t: 'ขนาดยาในตารางสำหรับผู้ใหญ่ ต้นฉบับไม่ได้ระบุเกณฑ์ปรับตามการทำงานของไต ให้ดูฉลากยาและข้อมูลอ้างอิงยา' },
    { t: 'คำแนะนำ dexamethasone ในแนวทางนี้ระบุสำหรับเยอรมนี ออสเตรีย และสวิตเซอร์แลนด์ — ประโยชน์ในพื้นที่ที่ต่างกันอาจต่างกัน ต้องตัดสินใจร่วมกับแพทย์ผู้รักษา' },
  ] },
];

export const MENING_GUIDELINE: Guideline = {
  id: 'mening', title: 'เยื่อหุ้มสมองอักเสบจากแบคทีเรีย: ยาและ dexamethasone', category: 'โรคติดเชื้อ', accent: '#7C2D12', icon: '🧠',
  keywords: ['meningitis', 'เยื่อหุ้มสมองอักเสบ', 'bacterial meningitis', 'ceftriaxone', 'ampicillin', 'vancomycin', 'meropenem', 'dexamethasone', 'rifampicin', 'ceftazidime', 'cefepime', 'linezolid', 'meningococcus', 'pneumococcus', 'listeria', 'chemoprophylaxis'],
  drugs: [
    { name: 'Ceftriaxone', group: 'Cephalosporin และ penicillin', aliases: ['Ceftriaxone'] }, { name: 'Cefotaxime', group: 'Cephalosporin และ penicillin', aliases: ['Cefotaxime'] },
    { name: 'Ceftazidime', group: 'Cephalosporin และ penicillin', aliases: ['Ceftazidime'] }, { name: 'Cefepime', group: 'Cephalosporin และ penicillin', aliases: ['Cefepime'] }, { name: 'Cefazolin', group: 'Cephalosporin และ penicillin', aliases: ['Cefazolin'] },
    { name: 'Ampicillin', group: 'Cephalosporin และ penicillin', aliases: ['Ampicillin'] }, { name: 'Penicillin G', group: 'Cephalosporin และ penicillin', aliases: ['Penicillin G'] },
    { name: 'Meropenem', group: 'ยากลุ่มอื่น', aliases: ['Meropenem'] }, { name: 'Vancomycin', group: 'ยากลุ่มอื่น', aliases: ['Vancomycin'] }, { name: 'Linezolid', group: 'ยากลุ่มอื่น', aliases: ['Linezolid'] },
    { name: 'Gentamicin', group: 'ยากลุ่มอื่น', aliases: ['Gentamicin'] }, { name: 'Metronidazole', group: 'ยากลุ่มอื่น', aliases: ['Metronidazole'] }, { name: 'Trimethoprim-sulfamethoxazole', group: 'ยากลุ่มอื่น', aliases: ['Trimethoprim-sulfamethoxazole'] },
    { name: 'Rifampicin', group: 'ยาป้องกันและยาเสริม', aliases: ['Rifampicin'] }, { name: 'Ciprofloxacin', group: 'ยาป้องกันและยาเสริม', aliases: ['Ciprofloxacin'] }, { name: 'Azithromycin', group: 'ยาป้องกันและยาเสริม', aliases: ['Azithromycin'] },
    { name: 'Fosfomycin', group: 'ยาป้องกันและยาเสริม', aliases: ['Fosfomycin'] }, { name: 'Dexamethasone', group: 'ยาป้องกันและยาเสริม', aliases: ['Dexamethasone'] },
  ],
  source: 'แนวทางเยอรมัน 2023: Community-acquired acute bacterial meningitis in adults · แนวทางต่างประเทศ',
  cites: [
    'Klein M, Abdel-Hadi C, Bühler R, et al. German guidelines on community-acquired acute bacterial meningitis in adults. Neurol Res Pract. 2023;5:44. doi:10.1186/s42466-023-00264-6 · PMC10470134 · open access · https://pmc.ncbi.nlm.nih.gov/articles/PMC10470134/',
    'สรุปเป็นภาษาไทยจากตารางที่ 3–6 และข้อแนะนำเรื่อง empiric therapy และ dexamethasone ของบทความ (ฉบับภาษาอังกฤษ ไม่มีเลขหน้าพิมพ์) · อ่านตารางจากไฟล์ XML ของบทความโดยตรง',
    'ยังไม่ครอบคลุม: การวินิจฉัย การเจาะน้ำไขสันหลังและภาพถ่ายรังสี การรักษาภาวะแทรกซ้อน (สมองบวม ชัก) และเยื่อหุ้มสมองอักเสบในเด็ก · ไม่ได้ปรับตามเชื้อดื้อยาและยาที่มีใช้ในไทย ต้องเทียบ antibiogram ของโรงพยาบาลก่อนใช้',
  ],
  summary: [
    'สงสัยเยื่อหุ้มสมองอักเสบจากแบคทีเรีย: เจาะเลือดเพาะเชื้อ → LP → ให้ dexamethasone และยาปฏิชีวนะ ภายใน 1 ชม. หลังถึงโรงพยาบาล (ไม่ควรล่าช้าเกิน 3 ชม.)',
    'เกิดในชุมชน: Ceftriaxone 2 g วันละ 2 ครั้ง + Ampicillin 2 g วันละ 6 ครั้ง · พื้นที่ pneumococcus ดื้อ cephalosporin สูง เพิ่ม Vancomycin 1 g วันละ 2 ครั้ง หรือ Rifampicin 600 mg วันละครั้ง',
    'หลังผ่าตัดประสาท/ภูมิคุ้มกันต่ำ/shunt: Vancomycin + Meropenem 2 g วันละ 3 ครั้ง (หรือ Ceftazidime 2 g วันละ 3 ครั้ง)',
    'Dexamethasone 10 mg IV วันละ 4 ครั้ง ต่อ 4 วันเมื่อพบหรือสงสัย pneumococcus',
    'ระยะเวลา: H. influenzae 7–10 วัน · pneumococcus 10–14 วัน · meningococcus 7–10 วัน · Listeria/Gram-negative 3 สัปดาห์ขึ้นไป',
    'ป้องกันผู้สัมผัส meningococcus: Rifampicin 600 mg ทุก 12 ชม. 2 วัน หรือ Ciprofloxacin 500 mg ครั้งเดียว หรือ Ceftriaxone 250 mg IM ครั้งเดียว',
  ],
  review: { status: 'pending', reviewer: '', reviewedAt: '', nextDue: '' },
  blocks,
  sections: [{ title: 'ยา empiric', blocks: [0] }, { title: 'ตามเชื้อ', blocks: [1] }, { title: 'ขนาดยา', blocks: [2] }, { title: 'Dexamethasone/ระยะเวลา', blocks: [3] }, { title: 'ยาป้องกัน', blocks: [4] }, { title: 'ข้อควรระวัง', blocks: [5] }],
};
