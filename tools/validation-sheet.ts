// สร้างเอกสารตรวจสอบสูตรคำนวณ docs/CLINICAL-VALIDATION.md จากโค้ดจริง (ใช้: npx vite-node tools/validation-sheet.ts)
import fs from 'node:fs';
import { computeTb, computeLtbi } from '../src/logic/tb';
import { wBand, schedule, planDays } from '../src/logic/warfarin';
import { computePediatric } from '../src/logic/pediatric';
import { computeInsulin } from '../src/logic/insulin';
import { PEDLIQ } from '../src/data/pediatric';
import { FORMULA_VERSION, VALIDATION } from '../src/data/validation';

const out: string[] = [];
const P = (s = '') => out.push(s);
const row = (...c: string[]) => P('| ' + c.map((x) => String(x).replace(/\|/g, '/').replace(/\n/g, ' ')).join(' | ') + ' |');
const head = (...c: string[]) => { row(...c); row(...c.map(() => '---')); };

P(`# เอกสารตรวจสอบสูตรคำนวณทางคลินิก (สูตรเวอร์ชัน ${FORMULA_VERSION})`);
P();
P('สร้างอัตโนมัติจากโค้ดด้วย `npx vite-node tools/validation-sheet.ts` — **อย่าแก้ตารางผลลัพธ์ด้วยมือ**');
P();
P('## วิธีใช้');
P('1. เภสัชกรผู้เชี่ยวชาญแต่ละด้านเทียบ "ผลที่แอปคำนวณ" กับแนวทางอ้างอิงล่าสุดและรายการยา/ความแรงที่ รพ. มีจริง');
P('2. ทำเครื่องหมายผ่าน/ไม่ผ่านในคอลัมน์สุดท้าย (พิมพ์เอกสารนี้หรือคัดลอกลง Excel) ข้อที่ไม่ผ่านให้แจ้งผู้พัฒนาพร้อมเหตุผลและแหล่งอ้างอิง');
P('3. เมื่อผ่านทุกข้อของหัวข้อใด ให้ลงนามท้ายเอกสาร แล้วแก้ `src/data/validation.ts` (status = approved, reviewer, reviewedAt) ผ่าน Pull Request');
P('4. ทุกครั้งที่แก้สูตร ให้สร้างเอกสารนี้ใหม่ เพิ่มเลขสูตรเวอร์ชัน และตรวจซ้ำเฉพาะส่วนที่เปลี่ยน');
P();
P('## สถานะปัจจุบัน');
head('หัวข้อ', 'แหล่งอ้างอิง', 'สถานะ', 'ผู้ตรวจ', 'วันที่');
VALIDATION.forEach((v) => row(v.name, v.reference, v.status === 'approved' ? 'ตรวจแล้ว' : 'ยังไม่ได้ตรวจสอบ', v.reviewer || '—', v.reviewedAt || '—'));

P(); P('## 1. ขนาดยาวัณโรค (Active TB)');
head('น้ำหนัก / กลุ่ม / ระยะ / ปัจจัย', 'ผลที่แอปคำนวณ (ยา: ขนาด · จำนวนเม็ด · ความถี่)', 'ผ่าน/ไม่ผ่าน');
for (const [w, ag, ph, f] of [['35', 'adult', 'intensive', []], ['45', 'adult', 'intensive', []], ['55', 'adult', 'intensive', []], ['70', 'adult', 'intensive', []], ['55', 'adult', 'continuation', []], ['55', 'adult', 'intensive', ['renal']], ['55', 'adult', 'intensive', ['hepatic']], ['55', 'adult', 'intensive', ['elderly']], ['12', 'child', 'intensive', []], ['25', 'child', 'intensive', []]] as [string, any, any, string[]][]) {
  const r = computeTb({ weight: w, ageGroup: ag, phase: ph, factors: f })!;
  row(`${w} กก. · ${ag === 'adult' ? 'ผู้ใหญ่' : 'เด็ก'} · ${ph}${f.length ? ' · ' + f.join('+') : ''}`, r.rows.map((x: any) => `${x.code}: ${x.doseTxt} · ${x.tabsTxt} · ${x.freq}`).join(' ／ '), '☐ ผ่าน ☐ ไม่ผ่าน');
}

P(); P('## 2. วัณโรคระยะแฝง 3HP');
head('น้ำหนัก / กลุ่ม', 'ผลที่แอปคำนวณ', 'ผ่าน/ไม่ผ่าน');
for (const [w, ag] of [['60', 'adult'], ['31', 'adult'], ['25', 'adult'], ['12', 'child'], ['20', 'child'], ['28', 'child'], ['40', 'child']] as [string, any][]) {
  const r = computeLtbi({ weight: w, ageGroup: ag })!;
  row(`${w} กก. · ${ag === 'adult' ? 'อายุ > 14 ปี' : 'อายุ 2–14 ปี'}`, r.rows.length ? `INH ${r.inh} mg + RPT ${r.rpt} mg ต่อครั้ง (สัปดาห์ละ 1 ครั้ง × 12)` + (r.fdc ? ` · FDC: ${r.fdc.name}` : '') : 'ไม่มีขนาดตามเกณฑ์ (น้ำหนักต่ำกว่าเกณฑ์)', '☐ ผ่าน ☐ ไม่ผ่าน');
}

P(); P('## 3. Warfarin (เม็ด 2/3/5 mg · เป้า INR 2.0–3.0 · ไม่มีเลือดออก)');
head('ขนาดเดิม mg/สัปดาห์ · INR', 'การปรับ', 'ขนาดใหม่', 'แผนแรกที่แอปแนะนำ (จำนวนเม็ด/วัน)', 'ผ่าน/ไม่ผ่าน');
for (const d0 of [21, 28, 35]) for (const inr of [1.5, 1.9, 2.5, 3.4, 4.5, 6]) {
  const b = wBand(inr, 2, 3, 'none'); const raw = d0 * (1 + b.pct); const plans = schedule(raw, false);
  const p = plans?.[0]; const days = p ? planDays(p, false).cells.map((c: any) => `${c.day.slice(0, 2)} ${c.tabs.replace(/\n/g, ' ')}`).join(', ') : '—';
  row(`${d0} · INR ${inr}`, `${b.label}: ${b.action}`, `${Math.round(raw * 10) / 10} mg/wk`, p ? `${Math.round(p.dose * 10) / 10} mg/wk · ${days}` : '—', '☐ ผ่าน ☐ ไม่ผ่าน');
}

P(); P('## 4. ยาน้ำเด็ก (ทุกรายการ ทุกสูตร × น้ำหนักตัวอย่าง 8 และ 20 กก. · อายุ 3 ปี)');
head('ยา / สูตร', 'น้ำหนัก', 'ปริมาณต่อครั้ง (มล.)', 'ขนาดต่อวัน', 'ช่วงที่ยอมรับ (มก.)', 'ขวดที่ต้องจ่าย', 'ผ่าน/ไม่ผ่าน');
for (const d of PEDLIQ as any[]) d.regs.forEach((reg: any) => {
  for (const w of [8, 20]) {
    const o = computePediatric({ drug: d, reg, w, age: 3, daysVal: String(reg.days) });
    row(`${d.name} (${d.strength}) · ${reg.k}`, `${w} กก.`, o.pdMlDose, o.pdMgDay, o.pdRangeMg, o.pdBottles, '☐ ผ่าน ☐ ไม่ผ่าน');
  }
});

P(); P('## 5. จำนวน insulin ที่ต้องจ่าย (ไม่คิดสำรอง · 1 vial = 1,000 U · penfill = 300 U)');
head('ขนาด U/วัน × วัน', 'ยูนิตรวม', 'Vial', 'Penfill', 'ผ่าน/ไม่ผ่าน');
for (const [u, d] of [['14', '28'], ['30', '90'], ['38', '30'], ['50', '60'], ['8', '90']]) {
  const o = computeInsulin(u, d);
  row(`${u} × ${d}`, o.insTotal, o.insRows[0].count, o.insRows[1].count, '☐ ผ่าน ☐ ไม่ผ่าน');
}

P(); P('## 6. เกณฑ์ประเมินแพ้ยา');
P('ตรวจที่หน้า "ประเมินแพ้ยา" ด้วยเคสตัวอย่าง 3–5 เคส (เคสผื่นจากยาเดียว, SJS/TEN, rechallenge, ไม่มีสาเหตุอื่น) เทียบ Naranjo, WHO-UMC และ Schumock & Thornton กับเกณฑ์ต้นฉบับ รวมถึงข้อที่แอปเติมให้อัตโนมัติ (ข้อ 4, 6, 7, 8, 10 ของ Naranjo) ว่าสอดคล้องกับวิธีที่หน่วยงานใช้จริง');
P();
P('## การลงนาม');
head('หัวข้อ', 'ผู้ตรวจสอบ (ชื่อ / เลขที่ ใบอนุญาต)', 'วันที่', 'ลายมือชื่อ');
VALIDATION.forEach((v) => row(v.name, '', '', ''));
P();
fs.writeFileSync('docs/CLINICAL-VALIDATION.md', out.join('\n') + '\n');
console.log('lines', out.length);
