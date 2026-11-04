// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */
import { C } from '../data/theme';
import { DAYS, PAT, WCOLOR } from '../data/warfarin';
import { frac, pills } from './shared';

export type Bleeding = 'none' | 'minor' | 'major';

export function wBand(inr, lo, hi, bleeding: Bleeding) {
  const b = bleeding;
  if (b === 'major') return {k:'major', label:'ภาวะฉุกเฉิน', pct:0, hold:true, recheck:'ทันที',
    action:'หยุด warfarin และรักษาภาวะเลือดออกทันที',
    detail:'ให้ vitamin K1 5–10 mg IV ช้า ๆ ร่วมกับ 4-factor PCC (หรือ FFP หากไม่มี PCC) ส่งต่อห้องฉุกเฉินและตรวจ INR ซ้ำหลังให้ยาแก้ฤทธิ์ 15–30 นาที ห้ามคำนวณขนาดยาต่อจนกว่าจะควบคุมภาวะเลือดออกได้'};
  if (b === 'minor' && inr > hi) return {k:'hi', label:'เลือดออกเล็กน้อยร่วมกับ INR สูง', pct:-0.15, hold:true, recheck:'1–3 วัน',
    action:'หยุดยา 1–2 มื้อ แล้วลดขนาดลง 10–20%',
    detail:'หาสาเหตุของเลือดออก (แผล, ยาร่วม, NSAIDs) พิจารณา vitamin K1 1–2.5 mg รับประทานหากมีความเสี่ยงสูง และนัดตรวจ INR ซ้ำเร็วขึ้น'};
  if (inr >= 9) return {k:'crit', label:'INR ≥ 9.0', pct:-0.2, hold:true, recheck:'24 ชั่วโมง',
    action:'หยุดยาและให้ vitamin K1 2.5–5 mg รับประทาน',
    detail:'ตรวจ INR ซ้ำใน 24 ชม. ให้ vitamin K1 ซ้ำได้หาก INR ยังสูง เริ่มยาใหม่ที่ขนาดลดลง 20% เมื่อ INR กลับเข้าช่วงเป้าหมาย'};
  if (inr >= 5) return {k:'crit', label:'INR 5.0–8.9', pct:-0.15, hold:true, recheck:'1–3 วัน',
    action:'หยุดยา 1–2 มื้อ แล้วลดขนาดลง 10–20%',
    detail:'ไม่มีเลือดออก: งดยาและติดตาม INR ทุกวันหรือวันเว้นวัน พิจารณา vitamin K1 1–2.5 mg รับประทานเมื่อมีความเสี่ยงเลือดออกสูง (สูงอายุ, เคยเลือดออก, ต้องผ่าตัด)'};
  if (inr >= 4) return {k:'hi', label:'INR 4.0–4.9', pct:-0.1, hold:true, recheck:'3–7 วัน',
    action:'หยุดยา 1 มื้อ แล้วลดขนาดลง 10%',
    detail:'ทบทวนยาที่เพิ่งเริ่มใหม่ อาหารที่มีวิตามินเคสูง สมุนไพร แอลกอฮอล์ และภาวะเจ็บป่วยเฉียบพลันที่อาจทำให้ INR สูงขึ้น'};
  if (inr > hi) return {k:'hi', label:'สูงกว่าเป้าหมาย', pct:-0.075, hold:false, recheck:'1–2 สัปดาห์',
    action:'ลดขนาดยาลง 5–10%',
    detail:'ไม่ต้องหยุดยา ปรับขนาดรายสัปดาห์แล้วนัดตรวจซ้ำ หาก INR สูงกว่าเป้าเพียงเล็กน้อยและผู้ป่วยคงที่ อาจคงขนาดเดิมแล้วตรวจซ้ำใน 1 สัปดาห์'};
  if (inr >= lo) return {k:'ok', label:'อยู่ในช่วงเป้าหมาย', pct:0, hold:false, recheck:'4 สัปดาห์',
    action:'คงขนาดยาเดิม',
    detail:'ไม่ต้องปรับขนาด ย้ำเรื่องการทานยาเวลาเดิมทุกวันและความสม่ำเสมอของอาหารที่มีวิตามินเค หาก INR อยู่ในช่วงเป้าหมายต่อเนื่อง 3 ครั้ง อาจยืดการตรวจเป็น 8–12 สัปดาห์'};
  if (inr >= lo - 0.5) return {k:'lo', label:'ต่ำกว่าเป้าหมายเล็กน้อย', pct:0.075, hold:false, recheck:'1–2 สัปดาห์',
    action:'เพิ่มขนาดยาขึ้น 5–10%',
    detail:'ตรวจสอบการลืมทานยาก่อนปรับขนาด หากผู้ป่วยลืมยาในสัปดาห์ที่ผ่านมา ให้คงขนาดเดิมและตรวจซ้ำแทนการเพิ่มขนาด'};
  return {k:'lo', label:'ต่ำกว่าเป้าหมายมาก', pct:0.15, hold:false, recheck:'4–7 วัน',
    action:'เพิ่มขนาดยาขึ้น 10–20%',
    detail:'ประเมินความเสี่ยงลิ่มเลือดอุดตัน หากเป็นผู้ป่วยความเสี่ยงสูง (ลิ้นหัวใจเทียมกลไก, VTE ภายใน 3 เดือน) พิจารณา bridging ด้วย LMWH จนกว่า INR จะเข้าช่วงเป้าหมาย'};
}

export function doseSet(allowHalf) {
  const strengths = [5, 3, 2], step = allowHalf ? 0.5 : 1, map = {};
  const add = (mg, parts, tabs) => {
    const k = Math.round(mg * 10);
    const half = parts.some(p => p.n % 1 !== 0);
    const sc = tabs + parts.length * 0.4 + (half ? 0.5 : 0);
    if (!map[k] || sc < map[k].sc) map[k] = {mg, parts, tabs, sc, half, mixed: parts.length > 1};
  };
  const out = [];
  for (const s of strengths) {
    for (let a = step; a <= 3; a += step) {
      const mg = s * a;
      if (mg <= 0 || mg > 15) continue;
      out.push({mg, parts: [{s, n: a}], tabs: a, half: a % 1 !== 0, mixed: false, s});
    }
  }
  return out;
}

export function mixedPlans(weekly: number, noHalf: boolean) {
  const doses = doseSet(!noHalf);
  const out = [];
  for (const lo of doses) for (const hi of doses) {
    if (hi.mg <= lo.mg) continue;
    if (lo.s === hi.s) continue;
    if (hi.mg > lo.mg * 1.5 || hi.mg - lo.mg > 2.5) continue;
    const strengthList = [lo.s, hi.s];
    for (let E = 1; E <= 3; E++) {
      const total = (7 - E) * lo.mg + E * hi.mg;
      const err = Math.abs(total - weekly) / weekly;
      if (err > 0.05) continue;
      const sc = err * 70 + lo.tabs * 0.5 + hi.tabs * 0.35 + E * 0.25 +
        ((lo.half || hi.half) ? 0.8 : 0);
      out.push({mixed: true, lo, hi, E, dose: total, err, sc,
        halfUsed: lo.half || hi.half, s: null, strengths: strengthList});
    }
  }
  out.sort((a, b) => a.sc - b.sc);
  const seen = {}, uniq = [];
  for (const c of out) {
    const k = Math.round(c.lo.mg * 10) + '/' + Math.round(c.hi.mg * 10) + '/' + c.E;
    if (seen[k]) continue; seen[k] = 1; uniq.push(c);
  }
  return uniq.slice(0, 3);
}

export function schedule(weekly: number, noHalf: boolean) {
  const cands = [];
  const strengths = [5, 3, 2];
  for (const s of strengths) {
    const halfOpts = noHalf ? [false] : [true, false];
    for (const ah of halfOpts) {
      const u = ah ? s / 2 : s;
      let N = Math.round(weekly / u);
      if (N < 1) continue;
      const base = Math.floor(N / 7), extra = N % 7;
      if (base === 0 && extra < 4) continue;
      const dose = N * u;
      const err = Math.abs(dose - weekly) / weekly;
      if (err > 0.07) continue;
      const halfUsed = ah && ((base % 2 !== 0) || (extra > 0 && (base + 1) % 2 !== 0));
      const maxTabs = (base + (extra ? 1 : 0)) * u / s;
      if (maxTabs > 4) continue;
      const sc = err * 60 + (extra === 0 ? 0 : 1.1) + (halfUsed ? 0.9 : 0) + maxTabs * 0.35 + (base === 0 ? 2.5 : 0);
      cands.push({s, u, N, base, extra, dose, err, sc, halfUsed});
    }
  }
  if (!cands.length) return null;
  cands.sort((a, b) => a.sc - b.sc);
  const seen = {}, uniq = [];
  for (const c of cands) {
    const k = c.s + '/' + Math.round(c.dose * 100) + '/' + c.extra + '/' + Math.round(c.base * c.u * 100);
    if (seen[k]) continue; seen[k] = 1; uniq.push(c);
  }
  const out = [], byStrength = {};
  for (const c of uniq) { if ((byStrength[c.s] || 0) >= 1) continue; byStrength[c.s] = 1; out.push(c); }
  for (const c of uniq) { if (out.length >= 3) break; if (out.indexOf(c) < 0) out.push(c); }
  const all = out.slice(0, 4).concat(mixedPlans(weekly, noHalf));
  all.forEach(c => {
    c.weekTabs = c.mixed
      ? (7 - c.E) * c.hi.tabs * 0 + (7 - c.E) * c.lo.tabs + c.E * c.hi.tabs
      : c.N * c.u / c.s;
    c.nStrength = c.mixed ? 2 : 1;
    c.rank = c.err * 120 + c.weekTabs * 0.45 + (c.nStrength - 1) * 2.2 +
      (c.halfUsed ? 0.5 : 0) + (c.mixed ? 0 : (c.base === 0 ? 1.2 : 0));
  });
  all.sort((a, b) => a.rank - b.rank);
  return all.slice(0, 5);
}

export function planDays(c, blockDays: boolean) {
  if (c.mixed) return planDaysMixed(c, blockDays);
  let hiDays = [];
  if (c.extra > 0) {
    if (blockDays) { for (let i = 0; i < c.extra; i++) hiDays.push(i); }
    else if (c.extra <= 3) hiDays = PAT[c.extra].slice();
    else { const low = PAT[7 - c.extra] || []; for (let i = 0; i < 7; i++) if (low.indexOf(i) < 0) hiDays.push(i); }
  }
  const out = [], skip = [], take = [];
  for (let i = 0; i < 7; i++) {
    const units = c.base + (hiDays.indexOf(i) >= 0 ? 1 : 0);
    if (units === 0) skip.push(DAYS[i]); else take.push(DAYS[i]);
    const mg = units * c.u;
    const tabs = mg / c.s;
    const isHi = hiDays.indexOf(i) >= 0 && c.extra > 0;
    const col = WCOLOR[c.s] || WCOLOR[3];
    out.push({
      day: DAYS[i], mg: mg === 0 ? '—' : String(Math.round(mg * 10) / 10),
      pills: mg === 0 ? [] : pills(tabs, col.fill, col.edge, 'tab', 19),
      tabs: mg === 0 ? 'งดยา' : frac(tabs) + ' เม็ด',
      bg: mg === 0 ? '#FBFAF7' : (isHi ? C.tealS : '#FFFFFF'),
      bd: mg === 0 ? 'rgba(22,33,31,.10)' : (isHi ? C.teal : 'rgba(22,33,31,.13)'),
      dayFg: isHi ? C.teal : C.mut,
      mgFg: mg === 0 ? '#9AA5A2' : C.ink,
      tabFg: mg === 0 ? '#9AA5A2' : (isHi ? C.teal : '#3E4F4C')
    });
  }
  const hiNames = hiDays.map(i => DAYS[i]);
  return {cells: out, skip, take, hiNames};
}

export function comboPills(parts, size) {
  let out = [];
  parts.forEach(p => {
    const col = WCOLOR[p.s] || WCOLOR[3];
    out = out.concat(pills(p.n, col.fill, col.edge, 'tab', size));
  });
  return out;
}

export function comboTxt(parts) { return parts.map(p => frac(p.n) + ' เม็ด (' + p.s + ' mg)').join(' + '); }

export function comboShort(parts) { return parts.map(p => frac(p.n) + ' × ' + p.s + ' mg').join('\n') + '\nรวม ' + frac(parts.reduce((s, p) => s + p.n, 0)) + ' เม็ด'; }

export function planDaysMixed(c, blockDays: boolean) {
  let hiDays = [];
  if (blockDays) { for (let i = 0; i < c.E; i++) hiDays.push(i); }
  else hiDays = (PAT[c.E] || [0]).slice();
  const out = [], take = [], skip = [];
  for (let i = 0; i < 7; i++) {
    const isHi = hiDays.indexOf(i) >= 0;
    const d = isHi ? c.hi : c.lo;
    take.push(DAYS[i]);
    out.push({
      day: DAYS[i], mg: String(Math.round(d.mg * 10) / 10),
      pills: comboPills(d.parts, 19),
      tabs: comboShort(d.parts),
      bg: isHi ? C.tealS : '#FFFFFF',
      bd: isHi ? C.teal : 'rgba(22,33,31,.13)',
      dayFg: isHi ? C.teal : C.mut,
      mgFg: C.ink,
      tabFg: isHi ? C.teal : '#3E4F4C'
    });
  }
  return {cells: out, skip, take, hiNames: hiDays.map(i => DAYS[i])};
}
