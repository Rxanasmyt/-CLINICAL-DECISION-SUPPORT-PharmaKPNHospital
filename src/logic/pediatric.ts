// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */

export interface PedInput {
  drug: any;          // รายการจาก PEDLIQ
  reg: any;           // สูตรที่เลือก (drug.regs[i])
  w: number;          // น้ำหนัก (กก.) 0 = ยังไม่กรอก
  age: number;        // อายุ (ปี) NaN = ไม่ระบุ
  daysVal: string;    // จำนวนวันที่จ่าย (ข้อความจากช่องกรอก)
}

/** คำนวณขนาดยาน้ำเด็ก — ผลลัพธ์เป็นฟิลด์ pd* ตามที่หน้าจอต้นแบบใช้ */
export function computePediatric({ drug, reg, w, age, daysVal }: PedInput): Record<string, any> {
  const o: Record<string, any> = {};
  const conc = drug.mg / drug.ml;
  const du = drug.doseUnit || 'มก.';
const rnd = (x) => {
  if (x <= 0) return 0;
  if (x < 1) return Math.round(x * 20) / 20;
  if (x < 5) return Math.round(x * 4) / 4;
  return Math.round(x * 2) / 2;
};
const nfm = (x) => {
  const r = Math.round(x * 100) / 100;
  return (Math.abs(r - Math.round(r)) < 0.005 ? String(Math.round(r)) : String(r)).replace(/\.0+$/, '');
};
o.pdFmtHelp = '';

if (reg.fixedDose) {
  const mlDose = Math.round(reg.fixedDose / conc * 100) / 100;
  const days = Math.max(parseInt(daysVal, 10) || reg.days, 1);
  const totalMl = mlDose * reg.freq * days;
  o.pdMlDose = nfm(mlDose);
  o.pdMgDose = nfm(reg.fixedDose) + ' ' + du;
  o.pdMgDay = nfm(reg.fixedDose * reg.freq) + ' ' + du + '/วัน';
  o.pdPerKg = w > 0 ? nfm(Math.round(reg.fixedDose * reg.freq / w * 10) / 10) + ' ' + du + '/กก./วัน' : 'ไม่คิดตามน้ำหนัก';
  o.pdRangeMg = 'ขนาดคงที่ ' + nfm(reg.fixedDose) + ' ' + du + '/ครั้ง';
  o.pdRangeMl = nfm(mlDose);
  o.pdRangeIsSpan = false; o.pdHasStartNote = false; o.pdStartNote = '';
  o.pdHasEasyWhy = false; o.pdEasyWhy = ''; o.pdMlBarPos = '50%';
  o.pdRangeMlLo = nfm(mlDose); o.pdRangeMlHi = nfm(mlDose);
  o.pdTsp = mlDose % 5 === 0 ? '= ' + nfm(mlDose / 5) + ' ช้อนชา (ช้อนยา 5 มล.)'
    : (mlDose % 2.5 === 0 ? '= ' + nfm(mlDose / 2.5) + ' ครึ่งช้อนชา' : 'ใช้กระบอกฉีดยาหรือหลอดหยดตวง');
  o.pdTotalMl = nfm(Math.round(totalMl * 10) / 10) + ' มล.';
  o.pdBottles = String(Math.ceil(totalMl / drug.bottle));
  o.pdBottleSize = String(drug.bottle) + ' มล.';
  o.pdDaysTxt = String(days);
  o.pdDosesTotal = String(reg.freq * days);
  o.pdSig = nfm(mlDose) + ' มล. ' + reg.freqTxt;
  o.pdHasTaper = false; o.pdTaper = '';
  const fw = [{t:'ขนาดยาสูตรนี้กำหนดคงที่ ไม่คำนวณตามน้ำหนักตัว — ตรวจสอบว่าเลือกสูตรตรงกับช่วงอายุและข้อบ่งใช้', fg:'#6B7B77', bg:'rgba(22,33,31,.05)'}];
  if (!isNaN(age)) {
    if (drug.id === 'mebenda' && age < 1) fw.push({t:'ไม่แนะนำ mebendazole ในเด็กอายุน้อยกว่า 1 ปี', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'simeth' && age >= 2 && reg.fixedDose === 20) fw.push({t:'อายุ 2 ปีขึ้นไปใช้ขนาด 40 มก. ต่อครั้งได้ — เลือกสูตรให้ตรงช่วงอายุ', fg:'#A66A00', bg:'#FBF1DE'});
    if (drug.id === 'simeth' && age < 2 && reg.fixedDose === 40) fw.push({t:'อายุน้อยกว่า 2 ปีควรใช้ขนาด 20 มก. ต่อครั้ง', fg:'#B3261E', bg:'#FBEAE8'});
  }
  o.pdWarns = fw; o.pdHasWarns = true;
} else if (w > 0) {
  const perDose = !!(reg.perDose || drug.perDose);
  let loD = perDose ? w * reg.low : w * reg.low / reg.freq;
  let hiD = perDose ? w * reg.high : w * reg.high / reg.freq;
  let capped = false;
  if (reg.capDose) {
    if (loD > reg.capDose) { loD = reg.capDose; capped = true; }
    if (hiD > reg.capDose) { hiD = reg.capDose; capped = true; }
  }
  const loMl = loD / conc, hiMl = hiD / conc;
  // เลือกปริมาณที่ตวงง่ายที่สุดในช่วงที่ยอมรับได้ โดยเอนไปทางขอบล่าง
  const pickEasy = () => {
    const cands = [];
    const push = (val, tier) => {
      const xr = Math.round(val * 100) / 100;
      if (xr < loMl - 1e-9 || xr > hiMl + 1e-9 || xr <= 0) return;
      if (cands.some(c => Math.abs(c.v - xr) < 1e-9 && c.tier <= tier)) return;
      cands.push({v: xr, tier, pos: (xr - loMl) / Math.max(hiMl - loMl, 1e-9)});
    };
    [5, 2.5, 1, 0.5, 0.25].forEach((step, si) => {
      for (let x = Math.ceil(loMl / step) * step; x <= hiMl + 1e-9; x += step) push(x, si);
    });
    if (!cands.length) { push(loMl, 5); push(hiMl, 6); }
    if (!cands.length) {
      const f2 = Math.floor(hiMl * 100) / 100;
      return f2 >= loMl - 1e-9 && f2 > 0 ? f2 : Math.floor(hiMl * 1000) / 1000;
    }
    cands.forEach(c => { c.score = c.tier * 0.9 + c.pos * 2.2; });
    cands.sort((a, b) => (a.score - b.score) || (a.pos - b.pos));
    // ไม่แนะนำค่าที่ชนขอบบนของช่วง ถ้ายังมีตัวเลือกที่ตวงได้ต่ำกว่านั้น
    const lower = cands.filter(c => c.pos <= 0.9);
    return (cands[0].pos > 0.9 && lower.length) ? lower[0].v : cands[0].v;
  };
  const mlDose = reg.taper ? rnd(hiD / conc) : pickEasy();
  o.pdEasyWhy = reg.taper ? '' : (mlDose % 5 === 0 ? 'ตวงด้วยช้อนยาเต็มช้อนได้พอดี'
    : (mlDose % 2.5 === 0 ? 'ตวงด้วยช้อนยาครึ่งช้อนได้พอดี'
    : (mlDose % 1 === 0 ? 'เป็นจำนวนเต็มมิลลิลิตร ตวงด้วยกระบอกฉีดยาได้ง่าย'
    : 'ปริมาณที่ตวงได้ง่ายที่สุดในช่วงที่ยอมรับได้')));
  o.pdHasEasyWhy = !reg.taper;
  const mgActual = mlDose * conc;
  const mgDay = mgActual * reg.freq;
  const perKgDay = mgDay / w;
  const days = Math.max(parseInt(daysVal, 10) || reg.days, 1);
  const mlMaint = reg.taper ? rnd(Math.min(w * reg.low, reg.capDose || Infinity) / conc) : mlDose;
  const totalMl = reg.taper
    ? mlDose * reg.freq + mlMaint * reg.freq * Math.max(days - 1, 0)
    : mlDose * reg.freq * days;
  const bottles = Math.ceil(totalMl / drug.bottle);

  o.pdRangeMg = nfm(Math.round(loD * 10) / 10) + (loD === hiD ? '' : ' – ' + nfm(Math.round(hiD * 10) / 10)) + ' ' + du + '/ครั้ง';
  o.pdStartNote = loD === hiD ? '' : (reg.taper ? 'สูตรนี้กำหนดขนาดวันแรกไว้ชัดเจน' : 'เลือกปริมาณที่ตวงง่ายและใกล้ขอบล่างของช่วง เพื่อลดผลข้างเคียงและเพิ่มความร่วมมือในการใช้ยา');
  o.pdHasStartNote = loD !== hiD;
  o.pdRangeMl = nfm(Math.round(loMl * 100) / 100) + (loD === hiD ? '' : ' – ' + nfm(Math.round(hiMl * 100) / 100));
  o.pdRangeMlLo = nfm(Math.round(loMl * 100) / 100);
  o.pdRangeMlHi = nfm(Math.round(hiMl * 100) / 100);
  o.pdRangeIsSpan = loD !== hiD && !reg.taper;
  o.pdMlBarLeft = '0%';
  o.pdMlBarPos = (loD === hiD ? 50 : Math.max(2, Math.min(98, (mlDose - loMl) / (hiMl - loMl) * 100))) + '%';
  o.pdMlDose = nfm(mlDose);
  o.pdMgDose = nfm(Math.round(mgActual * 10) / 10) + ' ' + du;
  o.pdMgDay = nfm(Math.round(mgDay * 10) / 10) + ' ' + du + '/วัน';
  o.pdPerKg = nfm(Math.round(perKgDay * 10) / 10) + ' ' + du + '/กก./วัน';
  o.pdTsp = mlDose % 5 === 0 ? '= ' + nfm(mlDose / 5) + ' ช้อนชา (ช้อนยา 5 มล.)'
    : (mlDose % 2.5 === 0 ? '= ' + nfm(mlDose / 2.5) + ' ครึ่งช้อนชา' : 'ใช้กระบอกฉีดยาตวง (ไม่ลงตัวกับช้อนชา)');
  o.pdTotalMl = nfm(Math.round(totalMl * 10) / 10) + ' มล.';
  o.pdBottles = String(bottles);
  o.pdBottleSize = String(drug.bottle) + ' มล.';
  o.pdDaysTxt = String(days);
  o.pdDosesTotal = String(reg.freq * days);
  o.pdSig = nfm(mlDose) + ' มล. ' + reg.freqTxt;

  const warns = [];
  if (capped) warns.push({t:'ขนาดยาถูกจำกัดที่ขนาดสูงสุดต่อครั้ง ' + nfm(reg.capDose) + ' ' + du + ' — น้ำหนักตัวมากพอที่จะใช้ขนาดผู้ใหญ่แล้ว', fg:'#A66A00', bg:'#FBF1DE'});
  if (reg.maxDayKg && perKgDay > reg.maxDayKg) warns.push({t:'เกินขนาดสูงสุด ' + reg.maxDayKg + ' ' + du + '/กก./วัน — ต้องลดจำนวนครั้งต่อวันหรือปริมาณต่อครั้ง', fg:'#B3261E', bg:'#FBEAE8'});
  if (reg.maxDay && mgDay > reg.maxDay) warns.push({t:'เกินขนาดสูงสุด ' + nfm(reg.maxDay) + ' ' + du + '/วัน', fg:'#B3261E', bg:'#FBEAE8'});
  if (mlDose < 0.5) warns.push({t:'ปริมาณต่อครั้งน้อยกว่า 0.5 มล. — ต้องใช้กระบอกฉีดยาหรือหลอดหยดที่มีขีดละเอียด ห้ามใช้ช้อนชา', fg:'#A66A00', bg:'#FBF1DE'});
  if (drug.ml < 5 && mlDose >= 0.5) warns.push({t:'ยาความเข้มข้นสูง — ตวงด้วยหลอดหยดหรือกระบอกฉีดยาที่มาพร้อมขวดเท่านั้น ห้ามใช้ช้อนชา', fg:'#6B7B77', bg:'rgba(22,33,31,.05)'});
  if (mlDose > 15) warns.push({t:'ปริมาณต่อครั้งมากกว่า 15 มล. — พิจารณาเปลี่ยนเป็นยาเม็ดหรือยาความเข้มข้นสูงกว่า', fg:'#A66A00', bg:'#FBF1DE'});
  if (!isNaN(age)) {
    if (drug.id === 'bactrim' && age < 0.17) warns.push({t:'ห้ามใช้ co-trimoxazole ในเด็กอายุน้อยกว่า 2 เดือน (เสี่ยง kernicterus)', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'ibu' && age < 0.5) warns.push({t:'ห้ามใช้ ibuprofen ในเด็กอายุน้อยกว่า 6 เดือน', fg:'#B3261E', bg:'#FBEAE8'});
    if ((drug.id === 'cpm' || drug.id === 'carbo' || drug.id === 'gg') && age < 2) warns.push({t:'ไม่แนะนำในเด็กอายุน้อยกว่า 2 ปี — ทบทวนข้อบ่งใช้กับแพทย์', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'hyos' && age < 6) warns.push({t:'ยารับประทานไม่แนะนำในเด็กอายุน้อยกว่า 6 ปี', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'erythro' && age < 0.12) warns.push({t:'ทารกอายุน้อยกว่า 6 สัปดาห์เสี่ยงเกิด infantile hypertrophic pyloric stenosis — ใช้เมื่อจำเป็นเท่านั้นและเฝ้าระวังอาการอาเจียนพุ่ง', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'cpm' && age >= 2 && age < 6 && mgDay > 6) warns.push({t:'เกินขนาดสูงสุด 6 มก./วัน สำหรับอายุ 2–6 ปี', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'cpm' && age >= 6 && age < 12 && mgDay > 12) warns.push({t:'เกินขนาดสูงสุด 12 มก./วัน สำหรับอายุ 6–12 ปี', fg:'#B3261E', bg:'#FBEAE8'});
    if (drug.id === 'gg' && age >= 2 && age < 6 && mgDay > 600) warns.push({t:'เกินขนาดสูงสุด 600 มก./วัน สำหรับอายุ 2–6 ปี', fg:'#B3261E', bg:'#FBEAE8'});
  }
  if (w > 40) warns.push({t:'น้ำหนักมากกว่า 40 กก. — พิจารณาใช้ขนาดผู้ใหญ่และรูปแบบยาเม็ดแทนยาน้ำ', fg:'#6B7B77', bg:'rgba(22,33,31,.05)'});
  o.pdWarns = warns;
  o.pdHasWarns = warns.length > 0;
  o.pdTaper = reg.taper ? 'สูตรนี้ให้ขนาดสองระดับ — วันแรก ' + nfm(reg.high) + ' มก./กก. คือ ' + nfm(mlDose) + ' มล. แล้ววันที่ 2–' + days + ' ลดเหลือ ' + nfm(reg.low) + ' มก./กก. คือ ' + nfm(mlMaint) + ' มล.' : '';
  o.pdHasTaper = !!reg.taper;
} else {
  o.pdWarns = []; o.pdHasWarns = false; o.pdHasTaper = false;
  o.pdRangeMg = '—'; o.pdRangeMl = '—'; o.pdMlDose = '—'; o.pdMgDose = '—';
  o.pdMgDay = '—'; o.pdPerKg = '—'; o.pdTsp = ''; o.pdTotalMl = '—';
  o.pdBottles = '—'; o.pdBottleSize = String(drug.bottle) + ' มล.';
  o.pdHasStartNote = false; o.pdStartNote = ''; o.pdHasEasyWhy = false; o.pdEasyWhy = '';
  o.pdRangeMlLo = '—'; o.pdRangeMlHi = '—'; o.pdRangeIsSpan = false; o.pdMlBarPos = '50%';
  o.pdDaysTxt = daysVal; o.pdDosesTotal = '—'; o.pdSig = '';
}
  return o;
}
