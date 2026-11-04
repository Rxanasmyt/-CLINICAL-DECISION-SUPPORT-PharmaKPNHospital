// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */
import { C } from '../data/theme';
import { TB_ADULT, TB_CHILD, LTBI_INH_CHILD, LTBI_RPT_CHILD } from '../data/tb';
import { frac, pills } from './shared';

export interface TbInput { weight: string; ageGroup: 'adult' | 'child'; phase: 'intensive' | 'continuation'; factors: string[]; allowHalfTablets?: boolean }
export interface LtbiInput { weight: string; ageGroup: 'adult' | 'child' }

export function solve(drug, wt, allowHalf) {
  const single = search(drug, wt, allowHalf, true);
  if (single && single.inR) return single;
  const mixed = search(drug, wt, allowHalf, false);
  if (mixed && mixed.inR) return mixed;
  return single || mixed;
}

export function search(drug, wt, allowHalf, singleOnly) {
  const lo = Math.min(drug.low * wt, drug.max), hi = Math.min(drug.high * wt, drug.max);
  const tgt = Math.min(lo + (hi - lo) * 0.2, drug.max);
  const steps = (f) => { const inc = (f.half && allowHalf) ? 0.5 : 1; const out = []; for (let x = 0; x <= 10; x += inc) out.push(x); return out; };
  const f0 = drug.forms[0], f1 = drug.forms[1] || null;
  const s0 = steps(f0), s1 = f1 ? steps(f1) : [0];
  let best = null, bestOut = null;
  for (const a of s0) for (const b of s1) {
    if (singleOnly && a > 0 && b > 0) continue;
    const dose = a * f0.s + (f1 ? b * f1.s : 0);
    if (dose <= 0) continue;
    const tabs = a + b;
    if (tabs > 6) continue;
    const inR = dose >= lo - 0.01 && dose <= hi + 0.01;
    const half = (a % 1 !== 0) || (b % 1 !== 0);
    const two = a > 0 && b > 0;
    let sc = Math.abs(dose - tgt) / Math.max(tgt, 1) * 3 + tabs * 0.06 + (half ? 0.5 : 0) + (two ? 1.5 : 0) + (inR ? 0 : 8);
    if (best === null || sc < best) {
      best = sc;
      const parts = [], combo = [];
      if (a > 0) { parts.push(f0.s + ' mg × ' + frac(a)); combo.push({s: f0.s, n: a}); }
      if (b > 0 && f1) { parts.push(f1.s + ' mg × ' + frac(b)); combo.push({s: f1.s, n: b}); }
      bestOut = {dose, inR, tabs, combo, parts: parts.join(' + ') + ' ' + drug.unit, lo, hi, tgt};
    }
  }
  return bestOut;
}

export function computeTb(s: TbInput) {
  const wt = parseFloat(s.weight);
  if (!wt || wt <= 0 || wt > 250) return null;
  const child = s.ageGroup === 'child';
  const src = child ? TB_CHILD : TB_ADULT;
  const f = s.factors;
  const has = (x) => f.indexOf(x) >= 0;
  const codes = s.phase === 'intensive' ? ['INH','RIF','PZA','EMB'] : ['INH','RIF'];
  const allowHalf = s.allowHalfTablets !== false;
  const rows = [], alerts = [];
  let totalTabs = 0;

  for (const c of codes) {
    const d = Object.assign({}, src[c]);
    let freq = 'ทุกวัน', freqColor = C.teal, freqBg = C.tealS, note = '', noteColor = C.warn, noteBg = C.warnS, skip = false;

    if (has('renal') && (c === 'PZA' || c === 'EMB')) {
      if (c === 'PZA') { d.low = 25; d.high = 35; d.typ = 30; } else { d.low = 15; d.high = 25; d.typ = 20; }
      freq = 'สัปดาห์ละ 3 ครั้ง'; freqColor = C.warn; freqBg = C.warnS;
      note = 'CrCl < 30 mL/min หรือฟอกไต: ให้สัปดาห์ละ 3 ครั้ง และให้หลังฟอกไตเสมอ';
    }
    if (has('renal') && c === 'INH') note = 'ขนาดปกติ ไม่ต้องปรับตามการทำงานของไต แต่ให้ pyridoxine 25 mg/วัน ป้องกันปลายประสาทอักเสบ';
    if (has('hepatic') && c === 'PZA') { skip = true; note = 'ตับบกพร่อง: หลีกเลี่ยง PZA — พิจารณาสูตร 2HRE/7HR หรือสูตรไม่มียาพิษต่อตับ'; }
    if (has('hepatic') && (c === 'INH' || c === 'RIF')) note = 'ตรวจ LFT ก่อนเริ่มและทุก 2 สัปดาห์ในเดือนแรก หยุดยาเมื่อ ALT > 3× ULN ร่วมกับอาการ หรือ > 5× ULN';
    if (has('elderly')) { d.typ = Math.round((d.low + d.typ) / 2 * 10) / 10; }
    if (c === 'EMB' && (has('elderly') || has('renal'))) note = (note ? note + ' · ' : '') + 'ตรวจ visual acuity และการมองสีก่อนเริ่มและทุกเดือน';

    const r = solve(d, wt, allowHalf);
    if (!r) continue;
    totalTabs += r.tabs;
    const perKg = r.dose / wt;
    const accent = skip ? '#9AA5A2' : d.accent;
    let pillList = [];
    if (!skip) r.combo.forEach(g => { pillList = pillList.concat(pills(g.n, d.fill, d.accent, d.shape, 22)); });
    const halfUsed = r.combo.some(g => g.n % 1 !== 0);
    const multi = r.combo.length > 1;
    let easeTxt, easeFg, easeBg;
    if (!r.inR) { easeTxt = 'ไม่มีชุดเม็ดยาที่อยู่ในช่วงเป้าหมาย'; easeFg = C.danger; easeBg = C.dangerS; }
    else if (!halfUsed && !multi) { easeTxt = 'ทานง่าย — เม็ดเต็มขนาดเดียว'; easeFg = C.ok; easeBg = C.okS; }
    else if (multi && halfUsed) { easeTxt = 'ต้องผสม 2 ขนาดและหักครึ่ง — ทวนวิธีทานกับผู้ป่วย'; easeFg = C.warn; easeBg = C.warnS; }
    else if (multi) { easeTxt = 'ผสม 2 ขนาด — จัดยาแยกซองต่อมื้อ'; easeFg = C.warn; easeBg = C.warnS; }
    else { easeTxt = 'ต้องหักครึ่งเม็ด — ตรวจสอบว่าผู้ป่วยมีที่ตัดยา'; easeFg = C.warn; easeBg = C.warnS; }
    const rangePos = r.hi > r.lo ? Math.max(0, Math.min(100, (r.dose - r.lo) / (r.hi - r.lo) * 100)) : 50;
    const tgtPos = r.hi > r.lo ? Math.max(0, Math.min(100, (r.tgt - r.lo) / (r.hi - r.lo) * 100)) : 50;
    rows.push({
      code: d.code, name: d.name, accent, pills: pillList,
      rangeMg: skip ? '' : Math.round(r.lo) + ' – ' + Math.round(r.hi) + ' mg/วัน',
      startTxt: skip ? '' : (rangePos <= 34 ? 'เริ่มที่ขอบล่างของช่วงเพื่อลดผลข้างเคียง'
        : 'ไม่มีชุดเม็ดยาที่ต่ำกว่านี้ในช่วงเป้าหมาย' + (rangePos > 50 ? ' — ขนาดนี้อยู่ค่อนไปทางสูงของช่วง' : '')),
      startFg: rangePos <= 34 ? C.mut : C.warn,
      rangeTint: accent + '14',
      rangeLo: Math.round(r.lo) + ' mg', rangeHi: Math.round(r.hi) + ' mg',
      showRange: !skip,
      dotLeft: rangePos + '%', tgtLeft: tgtPos + '%',
      dotColor: r.inR ? accent : C.danger,
      easeTxt, easeFg, easeBg,
      targetTxt: 'ช่วง ' + d.low + '–' + d.high + ' mg/kg' + (d.max < 9999 ? ' · สูงสุด ' + d.max + ' mg' : ''),
      doseTxt: skip ? 'งดใช้' : Math.round(r.dose) + ' mg',
      actualTxt: skip ? '' : (Math.round(perKg * 10) / 10) + ' mg/kg' + (r.inR ? '' : ' · นอกช่วงเป้าหมาย'),
      tabsTxt: skip ? 'ไม่จ่ายยานี้' : r.parts,
      freq: skip ? 'ตัดออกจากสูตร' : freq,
      freqColor: skip ? C.danger : freqColor, freqBg: skip ? C.dangerS : freqBg,
      hasNote: !!note, note, noteColor: skip ? C.danger : noteColor, noteBg: skip ? C.dangerS : noteBg
    });
  }

  const A = (kind, title, text) => {
    const m = {d:[C.dangerS,'rgba(179,38,30,.25)',C.danger,'#7A2A24'], w:[C.warnS,'rgba(166,106,0,.22)',C.warn,'#6B4A0F'], i:[C.tealS,'rgba(15,93,87,.18)',C.teal,'#2C4B47']}[kind];
    alerts.push({title, text, bg:m[0], bd:m[1], fg:m[2], body:m[3]});
  };
  if (has('mdr')) A('d','ส่งต่อผู้เชี่ยวชาญ','ผลตรวจดื้อยา rifampicin ทำให้สูตร first-line ใช้ไม่ได้ ต้องเลือกสูตรตามผล DST และรายงานเข้าระบบ PMDT');
  if (has('hiv')) A('w','ปฏิกิริยากับยาต้านไวรัส','Rifampicin ลดระดับ PI, INSTI และ NNRTI — ปรับ dolutegravir เป็นวันละ 2 ครั้ง หลีกเลี่ยง PI เริ่ม ART ภายใน 2 สัปดาห์หลังเริ่มยาวัณโรค และให้ co-trimoxazole ป้องกัน');
  if (has('pregnancy')) A('w','ตั้งครรภ์ / ให้นมบุตร','HRZE ใช้ได้ตามปกติ ห้ามใช้ streptomycin และกลุ่ม aminoglycoside ให้ pyridoxine 25 mg/วัน และวิตามินเค 10 mg แก่มารดาช่วง 1 เดือนก่อนคลอด');
  if (has('dm')) A('i','เบาหวานร่วม','Rifampicin เร่ง metabolism ของ sulfonylurea และ repaglinide ทำให้น้ำตาลสูงขึ้น ติดตาม HbA1c และพิจารณาขยายการรักษาเป็น 9 เดือนหากตอบสนองช้า');
  if (has('malnutrition')) A('i','น้ำหนักน้อย / ทุพโภชนาการ','คำนวณจากน้ำหนักจริงและคำนวณใหม่ทุกครั้งที่น้ำหนักเปลี่ยน ≥ 5% ให้ pyridoxine 25 mg/วัน และประเมินภาวะโภชนาการร่วม');
  if (has('elderly')) A('i','ผู้สูงอายุ','เริ่มที่ขอบล่างของช่วงขนาดยา ประเมิน CrCl ก่อนเริ่ม และเฝ้าระวังพิษต่อตับและเส้นประสาทตาใกล้ชิด');
  const needB6 = ['hiv','pregnancy','malnutrition','dm','renal','elderly'].some(has);
  if (needB6) A('i','Pyridoxine (วิตามิน B6)', (child ? 'เด็ก 5–10 mg/วัน' : 'ผู้ใหญ่ 25 mg/วัน') + ' ร่วมกับ isoniazid ตลอดการรักษา เพื่อป้องกัน peripheral neuropathy');
  if (child) A('i','ข้อควรระวังในเด็ก','ใช้ขนาด mg/kg สำหรับเด็กตาม WHO 2022 ชั่งน้ำหนักทุกเดือนและปรับขนาดยาตาม หากต้องแบ่งเม็ดยาน้อยกว่าครึ่งเม็ด ให้ใช้ยาน้ำหรือสูตรผสมสำหรับเด็กแทน');
  A('i','การให้ยาและติดตาม','ทานยาพร้อมกันครั้งเดียวขณะท้องว่าง (ก่อนอาหาร 1 ชม. หรือหลังอาหาร 2 ชม.) แจ้งผู้ป่วยว่าปัสสาวะจะเป็นสีส้มแดงจาก rifampicin · ตรวจเสมหะเมื่อสิ้นเดือนที่ 2, 5 และ 6');

  return {rows, alerts, totalTabs};
}

export function band(table, wt) {
  if (wt < table[0][0]) return null;
  const r = table.find(b => wt <= b[1]);
  return r ? r[2] : table[table.length - 1][2];
}

export function computeLtbi(s: LtbiInput) {
  const wt = parseFloat(s.weight);
  if (!wt || wt <= 0 || wt > 250) return null;
  const child = s.ageGroup === 'child';
  const inh = child ? band(LTBI_INH_CHILD, wt) : (wt >= 30 ? 900 : null);
  const rpt = child ? band(LTBI_RPT_CHILD, wt) : (wt >= 30 ? 900 : null);
  const rows = [], alerts = [];
  const A = (kind, title, text) => {
    const m = {d:[C.dangerS,'rgba(179,38,30,.25)',C.danger,'#7A2A24'], w:[C.warnS,'rgba(166,106,0,.22)',C.warn,'#6B4A0F'], i:[C.tealS,'rgba(15,93,87,.18)',C.teal,'#2C4B47']}[kind];
    alerts.push({title, text, bg:m[0], bd:m[1], fg:m[2], body:m[3]});
  };
  if (!inh || !rpt) {
    A('d', 'น้ำหนักต่ำกว่าเกณฑ์ของสูตร 3HP', child
      ? 'ตารางขนาดยา 3HP สำหรับเด็กเริ่มที่น้ำหนัก 10 กก. ผู้ป่วยที่เบากว่านี้ให้ใช้สูตร 6H หรือ 3HR แทน และปรึกษาผู้เชี่ยวชาญ'
      : 'ผู้ป่วยอายุมากกว่า 14 ปีที่น้ำหนักน้อยกว่า 30 กก. ให้ใช้ตารางน้ำหนักของเด็ก หรือเลือกสูตร 6H แทน');
    return {rows, alerts, fdc: null, inh, rpt, doses: 12};
  }
  let best = null;
  const kMax = Math.min(Math.floor(inh / 300), Math.floor(rpt / 300));
  for (let k = 0; k <= kMax; k++) {
    const rH = inh - k * 300, rP = rpt - k * 300;
    if (rH % 100 !== 0 || rP % 150 !== 0) continue;
    const nH = rH / 100, nP = rP / 150, total = k + nH + nP;
    if (!best || total < best.total) best = {k, nH, nP, total};
  }
  const mk = (name, code, dose, tabSize, fill, accent, source) => {
    const n = dose / tabSize;
    return {code, name, accent,
      doseTxt: dose + ' mg',
      perDose: 'ต่อครั้ง สัปดาห์ละ 1 ครั้ง',
      tabsTxt: tabSize + ' mg × ' + frac(n) + ' เม็ด',
      pills: pills(n, fill, accent, 'tab', 20),
      source};
  };
  rows.push(mk('Isoniazid', 'H', inh, 100, '#DCEAE7', '#0F5D57', child ? 'ตารางน้ำหนักเด็ก อายุ 2–14 ปี' : 'อายุ > 14 ปี น้ำหนัก ≥ 30 กก.'));
  rows.push(mk('Rifapentine', 'P', rpt, 150, '#F2C9A8', '#B5581F', child ? 'ตารางน้ำหนักเด็กตามเกณฑ์ 3HP' : 'อายุ > 14 ปี น้ำหนัก ≥ 30 กก.'));
  const plain = inh / 100 + rpt / 150;
  let fdc = null;
  if (best && best.k > 0) {
    const parts = [], groups = [];
    const g = (label, n, fill, edge) => {
      parts.push(label + ' × ' + n + ' เม็ด');
      groups.push({label, pills: pills(n, fill, edge, 'tab', 20),
        perDose: n + ' เม็ด/ครั้ง', perCourse: (n * 12) + ' เม็ด/คอร์ส'});
    };
    if (best.k) g('Isoniazid/Rifapentine 300/300 mg', best.k, '#E6DCCB', '#8A6A3A');
    if (best.nH) g('Isoniazid 100 mg', best.nH, '#DCEAE7', '#0F5D57');
    if (best.nP) g('Rifapentine 150 mg', best.nP, '#F2C9A8', '#B5581F');
    fdc = {
      name: parts.join('  +  '),
      groups,
      tabsTxt: 'แผนที่แนะนำ — รวม ' + best.total + ' เม็ดต่อครั้ง',
      total: 'ลดจาก ' + plain + ' เม็ด เหลือ ' + best.total + ' เม็ดต่อครั้ง · จ่ายยาทั้งคอร์ส 12 ครั้ง = ' +
        (best.k ? 'FDC ' + best.k * 12 + ' เม็ด' : '') +
        (best.nH ? (best.k ? ' + ' : '') + 'INH ' + best.nH * 12 + ' เม็ด' : '') +
        (best.nP ? ((best.k || best.nH) ? ' + ' : '') + 'RPT ' + best.nP * 12 + ' เม็ด' : '')
    };
  }
  const totalH = inh / 100 * 12, totalP = rpt / 150 * 12;
  A('i', 'วิธีให้ยาและการติดตาม', 'ให้ยาพร้อมกันครั้งเดียวต่อสัปดาห์ วันเดิมทุกสัปดาห์ ครบ 12 ครั้งภายใน 16 สัปดาห์ · ทานพร้อมอาหารเพื่อลดอาการคลื่นไส้ · ให้ pyridoxine 25 mg/วัน (เด็ก 5–10 mg/วัน) ร่วมด้วยตลอดคอร์ส');
  A('w', 'ปฏิกิริยาต่อยาอื่น', 'Rifapentine เป็น CYP3A4 inducer — ลดระดับยาต้านไวรัส (PI, NNRTI) ยาคุมกำเนิดชนิดฮอร์โมน warfarin และยากันชัก · ผู้ติดเชื้อ HIV ใช้ 3HP ได้เฉพาะกับ efavirenz หรือ dolutegravir ห้ามใช้ร่วมกับ PI');
  A('d', 'ข้อห้ามและข้อควรระวัง', 'ห้ามใช้ในเด็กอายุน้อยกว่า 2 ปี ผู้ตั้งครรภ์หรือวางแผนตั้งครรภ์ระหว่างคอร์ส ผู้ที่แพ้ rifamycin หรือ isoniazid และผู้ที่สงสัยวัณโรคระยะแสดงอาการ — ต้องคัดกรองให้แน่ใจว่าไม่ใช่ active TB ก่อนเริ่มยาทุกราย');
  A('i', 'อาการที่ต้องหยุดยาและพบแพทย์', 'ไข้ ปวดเมื่อยคล้ายไข้หวัดใหญ่หลังทานยา (flu-like syndrome) ผื่น ตาเหลือง ปัสสาวะเข้ม คลื่นไส้อาเจียนต่อเนื่อง หรือปวดชายโครงขวา · แจ้งผู้ป่วยว่าปัสสาวะและน้ำตาจะเป็นสีส้มแดง และคอนแทคเลนส์ชนิดนิ่มอาจติดสี');
  return {rows, alerts, fdc, inh, rpt, doses: 12,
    courseTxt: 'Isoniazid 100 mg รวม ' + frac(totalH) + ' เม็ด · Rifapentine 150 mg รวม ' + frac(totalP) + ' เม็ด'};
}
