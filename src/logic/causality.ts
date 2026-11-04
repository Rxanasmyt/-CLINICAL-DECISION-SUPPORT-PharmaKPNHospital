// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */
import { C } from '../data/theme';
import { NARANJO, PREVQ, ADVRULES } from '../data/adr';
import { parseD, fmtD } from './dates';

/** ข้อมูลฟอร์มประเมินแพ้ยาที่ใช้คำนวณ (ส่วนหนึ่งของ state) */
export interface CaseForm {
  drugs: any[]; events: any[]; labs: any[]; altCauses: string[];
  pt: { hx?: string; [k: string]: any }; naranjo: Record<number, string>; prev: Record<number, string>;
  [k: string]: any;
}

export function latency(drug, ev) {
  const a = parseD(drug.start), b = parseD(ev.onset);
  if (!a || !b) return null;
  const h = (+b - +a) / 3600e3;
  if (h < 0) return {txt: 'เริ่มยาหลังเกิดอาการ', neg: true, h};
  if (h < 48) return {txt: Math.round(h) + ' ชม. หลังเริ่มยา', neg: false, h};
  return {txt: Math.round(h / 24) + ' วันหลังเริ่มยา', neg: false, h};
}

export function refAdvice(f: CaseForm) {
  const out = [], seen = {};
  const rules = ADVRULES;
  f.drugs.filter(d => d.suspect && d.name).forEach(d => {
    for (const r of rules) {
      if (!r.re.test(d.name)) continue;
      if (seen[r.key]) return;
      seen[r.key] = 1;
      out.push({drug: d.name, cls: r.cls, struct: r.struct, avoid: r.avoid, use: r.use, cite: r.cite});
      return;
    }
  });
  return out;
}

export function autoNaranjo(f: CaseForm) {
  const st = f;
  const ev = st.events.find(e => parseD(e.onset)) || null;
  const sus = st.drugs.filter(d => d.suspect && parseD(d.start));
  const susNamed = st.drugs.filter(d => d.suspect && d.name);
  const out = {};
  const set = (n, v, why) => { if (!out[n]) out[n] = {v, why}; };

  // 1 — มีรายงานปฏิกิริยานี้มาก่อน (จากฐานข้อมูลวิชาการในแอป)
  const adv = refAdvice(f);
  if (adv.length) set(1, 'y', 'ยา ' + adv.map(x => x.drug).join(', ') + ' มีรายงานปฏิกิริยาในฐานข้อมูลวิชาการของแอป');

  // 2 — อาการเกิดหลังได้รับยา (latency)
  if (ev && sus.length) {
    const hit = sus.map(d => ({d, l: latency(d, ev)})).filter(x => x.l && !x.l.neg)[0];
    if (hit) set(2, 'y', 'อาการเกิดหลังเริ่ม ' + (hit.d.name || 'ยาที่สงสัย') + ' ' + hit.l.txt);
    else set(2, 'n', 'วันที่เริ่มยาอยู่หลังวันที่เกิดอาการ');

    // 3 — dechallenge
    const stopped = sus.filter(d => parseD(d.stop));
    if (stopped.length && parseD(ev.better)) {
      const t = Math.min.apply(null, stopped.map(d => parseD(d.stop).getTime()));
      const ok = parseD(ev.better).getTime() >= t;
      set(3, ok ? 'y' : 'u', ok ? 'อาการดีขึ้นหลังหยุดยา ' + fmtD(ev.better, false) : 'อาการดีขึ้นก่อนหยุดยา จึงสรุปไม่ได้');
    }

    // 4 — rechallenge: ยาชื่อเดิมถูกสั่งซ้ำหลังหยุด
    const byName = {};
    st.drugs.filter(d => d.name && parseD(d.start)).forEach(d => {
      const k = d.name.trim().toLowerCase();
      (byName[k] = byName[k] || []).push(d);
    });
    let reGiven = false;
    Object.keys(byName).forEach(k => {
      const rows = byName[k].sort((x, y) => +parseD(x.start) - +parseD(y.start));
      if (rows.length < 2 || !rows.some(r => r.suspect)) return;
      reGiven = true;
      const re = parseD(rows[1].start);
      const again = st.events.some(e => { const o = parseD(e.onset); return o && o >= re; });
      set(4, again ? 'y' : 'n', again
        ? 'มีการให้ ' + rows[0].name + ' ซ้ำ ' + fmtD(rows[1].start, false) + ' แล้วเกิดอาการอีก'
        : 'มีการให้ ' + rows[0].name + ' ซ้ำ ' + fmtD(rows[1].start, false) + ' แต่ไม่มีอาการซ้ำที่บันทึกไว้');
    });
    if (!reGiven) set(4, 'u', 'ไม่ได้ให้ยาที่สงสัยซ้ำ จึงประเมินไม่ได้');
  }

  // 5 — สาเหตุอื่น
  if (st.altCauses.length) {
    const onlyNone = st.altCauses.length === 1 && st.altCauses[0] === 'none';
    set(5, onlyNone ? 'n' : 'y', onlyNone ? 'ตรวจสอบแล้วไม่พบสาเหตุอื่น' : 'ระบุสาเหตุอื่นที่เป็นไปได้ไว้ ' + st.altCauses.length + ' ข้อ');
  }

  // 6 — placebo: เวชปฏิบัติทั่วไปไม่มีการให้ยาหลอก
  set(6, 'u', 'ไม่มีการให้ยาหลอกในเวชปฏิบัติ จึงประเมินไม่ได้');

  // 7 — ระดับยาในเลือดถึงระดับพิษ
  const lv = st.labs.filter(l => l.name && l.value && /level|ระดับยา|trough|peak|conc/i.test(l.name));
  if (!lv.length) set(7, 'u', 'ไม่มีผลตรวจระดับยาในเลือด จึงประเมินไม่ได้');

  // 8 — dose-response: ยาชื่อเดิมแต่ขนาดต่างกัน
  const doses = {};
  susNamed.forEach(d => {
    const k = d.name.trim().toLowerCase();
    (doses[k] = doses[k] || []).push(d.dose || '');
  });
  const varied = Object.keys(doses).some(k => doses[k].filter((x, i, arr) => x && arr.indexOf(x) === i).length > 1);
  if (!varied) set(8, 'u', 'ไม่มีการปรับขนาดยาที่บันทึกไว้ จึงประเมินไม่ได้');

  // 9 — เคยเกิดอาการนี้จากยาเดียวกันหรือคล้ายกัน
  const hx = (st.pt.hx || '').trim();
  if (hx) {
    const neg = /^(ไม่มี|ปฏิเสธ|no|none|nka|ไม่เคย|-)/i.test(hx);
    if (neg) set(9, 'n', 'ประวัติระบุว่าไม่เคยแพ้ยามาก่อน');
    else {
      const m = susNamed.filter(d => hx.toLowerCase().indexOf(d.name.trim().toLowerCase().slice(0, 5)) >= 0);
      if (m.length) set(9, 'y', 'ประวัติแพ้ยาเดิมระบุ ' + m.map(d => d.name).join(', '));
    }
  }

  // 10 — หลักฐานเชิงวัตถุวิสัย
  const objLab = st.labs.filter(l => l.name && l.value);
  if (st.events.some(e => e.desc)) set(10, 'y', objLab.length
    ? 'มีอาการทางคลินิกที่บันทึกไว้ และผลแลปยืนยัน ' + objLab.map(l => l.name).join(', ')
    : 'มีอาการทางคลินิกที่ตรวจพบและบันทึกไว้');

  return out;
}

export function naranjoScore(f: CaseForm) {
  const auto = autoNaranjo(f);
  const rows = NARANJO.map((item, i) => {
    const n = i + 1;
    const manual = f.naranjo[n];
    const A = auto[n];
    const val = manual || (A ? A.v : null) || null;
    const pts = val ? item[val] : 0;
    return {n, q: item.q, val, pts, auto: !manual && !!A, why: A ? A.why : '', opts: item};
  });
  const total = rows.reduce((s, r) => s + r.pts, 0);
  const answered = rows.filter(r => r.val).length;
  let verdict, vfg, vbg;
  if (total >= 9) { verdict = 'Definite — ใช่แน่นอน'; vfg = C.danger; vbg = C.dangerS; }
  else if (total >= 5) { verdict = 'Probable — น่าจะใช่'; vfg = C.copper; vbg = C.copperS; }
  else if (total >= 1) { verdict = 'Possible — อาจจะใช่'; vfg = C.warn; vbg = C.warnS; }
  else { verdict = 'Doubtful — น่าสงสัย'; vfg = C.mut; vbg = 'rgba(22,33,31,.05)'; }
  return {rows, total, answered, verdict, vfg, vbg};
}

export function whoUmc(f: CaseForm) {
  const nj = naranjoScore(f);
  const st = f;
  const A = (n) => nj.rows[n - 1].val;
  const hasDrug = st.drugs.some(d => d.suspect && d.name);
  const hasEv = st.events.some(e => e.desc);
  if (!hasDrug || !hasEv) return {k:'unclass', label:'Unclassifiable', th:'ยังจำแนกไม่ได้', why:'ยังไม่มีข้อมูลยาที่สงสัยหรืออาการ', fg:'#6B7B77', bg:'rgba(22,33,31,.05)'};
  const time = A(2), dech = A(3), rech = A(4), alt = A(5);
  if (time === 'n') return {k:'unlikely', label:'Unlikely', th:'ไม่น่าจะเกี่ยวข้อง', why:'ลำดับเวลาไม่สอดคล้อง — อาการเกิดก่อนได้รับยา', fg:'#6B7B77', bg:'rgba(22,33,31,.05)'};
  if (time !== 'y') return {k:'cond', label:'Conditional / Unclassified', th:'รอข้อมูลเพิ่มเติม', why:'ยังไม่มีข้อมูลลำดับเวลาที่ชัดเจน', fg:'#A66A00', bg:'#FBF1DE'};
  if (alt === 'n' && dech === 'y' && rech === 'y') return {k:'certain', label:'Certain', th:'ใช่แน่นอน', why:'ลำดับเวลาสอดคล้อง · ไม่มีสาเหตุอื่น · ดีขึ้นเมื่อหยุดยา · เกิดซ้ำเมื่อให้ยาใหม่', fg:'#B3261E', bg:'#FBEAE8'};
  if (alt === 'n' && dech === 'y') return {k:'probable', label:'Probable / Likely', th:'น่าจะใช่', why:'ลำดับเวลาสอดคล้อง · ไม่น่าเกิดจากสาเหตุอื่น · ดีขึ้นเมื่อหยุดยา (ไม่จำเป็นต้องมี rechallenge)', fg:'#B3261E', bg:'#FBEAE8'};
  return {k:'possible', label:'Possible', th:'อาจจะใช่', why:'ลำดับเวลาสอดคล้อง แต่อาจอธิบายได้จากโรคหรือยาอื่น หรือยังไม่มีข้อมูลการหยุดยา', fg:'#A66A00', bg:'#FBF1DE'};
}

export function prevScore(f: CaseForm) {
  const st = f;
  const nj = naranjoScore(f);
  const man = st.prev || {};
  const auto = {};
  if (nj.rows[8].val === 'y') auto[4] = {v:'y', why:'ประวัติแพ้ยาเดิมระบุยาที่สงสัย'};
  const rows = PREVQ.map((p, i) => {
    const n = i + 1, a = auto[n];
    const val = man[n] || (a ? a.v : null);
    return {n, q: p.q, en: p.en, val, auto: !man[n] && !!a, why: a ? a.why : ''};
  });
  const yes = rows.filter(r => r.val === 'y').length;
  const answered = rows.filter(r => r.val).length;
  let k, label, fg, bg;
  if (yes > 0) { k = 'prev'; label = 'Preventable — ป้องกันได้'; fg = '#B3261E'; bg = '#FBEAE8'; }
  else if (answered === PREVQ.length) { k = 'notprev'; label = 'Not preventable — ป้องกันไม่ได้'; fg = '#2E7D5B'; bg = '#EAF4EE'; }
  else { k = 'pending'; label = 'ยังประเมินไม่ครบ'; fg = '#6B7B77'; bg = 'rgba(22,33,31,.05)'; }
  return {rows, yes, answered, k, label, fg, bg};
}
