// รันตรรกะ "ต้นแบบ" (class Component ใน .dc.html) บนชุดกรณีทดสอบ แล้วบันทึกลายนิ้วมือ (SHA-1) ของผลลัพธ์
// เป็นค่าที่คาดหวังของ unit test ใน src/logic/*.test.ts  (README: ใช้ผลจากต้นแบบเป็นค่าที่คาดหวัง)
// ใช้: node tools/gen-golden.mjs <PharmaCal-KPNHOSPITAL.dc.html>
import fs from 'node:fs';
import crypto from 'node:crypto';

const file = process.argv[2];
const text = fs.readFileSync(file, 'utf8');
const a = text.indexOf('>', text.indexOf('<script type="text/x-dc"')) + 1;
const code = text.slice(a, text.lastIndexOf('</script>'));
class DCLogic {
  constructor(props) { this.props = props || {}; }
  setState(p) { Object.assign(this.state, typeof p === 'function' ? p(this.state) : p); }
}
const win = { localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} }, addEventListener() {}, removeEventListener() {} };
const mod = new Function('DCLogic', 'window', code + '\n;return {Component, PEDLIQ};')(DCLogic, win);
const Component = mod.Component;
const mk = (props = {}) => new Component(props);
// แปลงเป็น JSON แบบเรียงคีย์ (ไม่ขึ้นกับลำดับ) — ต้องตรงกับ src/logic/hash.ts
const canon = (x) => {
  if (typeof x === 'function' || x === undefined) return undefined;
  if (typeof x === 'number') return isNaN(x) ? 'NaN' : (x === Infinity ? 'Infinity' : x);
  if (Array.isArray(x)) return x.map(v => { const c = canon(v); return c === undefined ? null : c; });
  if (x && typeof x === 'object') { const o = {}; for (const k of Object.keys(x).sort()) { const c = canon(x[k]); if (c !== undefined) o[k] = c; } return o; }
  return x;
};
const h = (x) => crypto.createHash('sha1').update(JSON.stringify(canon(x))).digest('hex').slice(0, 12);
const G = { tb: {}, ltbi: {}, wf: {}, ped: {}, ins: {}, causal: {} };

// ---- TB ----
const weights = [3, 5, 8, 10, 12.5, 14, 15, 16, 20, 23, 25, 30, 33, 35, 38, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100, 120, 150, 200, 250];
const factorSets = [[], ['renal'], ['hepatic'], ['elderly'], ['hiv', 'dm'], ['renal', 'elderly', 'hepatic'], ['pregnancy', 'malnutrition'], ['mdr']];
for (const wt of weights) for (const ag of ['adult', 'child']) for (const ph of ['intensive', 'continuation']) for (const f of factorSets) for (const half of [true, false]) {
  const c = mk({ allowHalfTablets: half });
  Object.assign(c.state, { weight: String(wt), ageGroup: ag, phase: ph, factors: f });
  G.tb[[wt, ag, ph, f.join('+'), half].join('|')] = h(c.tb());
}
for (const bad of ['', '0', '-5', '251', 'abc']) { const c = mk(); c.state.weight = bad; G.tb['bad|' + bad] = h(c.tb()); G.ltbi['bad|' + bad] = h(c.ltbi()); }
for (const wt of weights.concat([9.9, 10.5, 15.1, 23.1, 29.9, 30.1, 31])) for (const ag of ['adult', 'child']) {
  const c = mk(); Object.assign(c.state, { weight: String(wt), ageGroup: ag }); G.ltbi[wt + '|' + ag] = h(c.ltbi());
}

// ---- Warfarin ----
const wd = [3, 5, 7, 10.5, 14, 17.5, 21, 24.5, 28, 31.5, 35, 42, 56];
const inrs = [0.8, 1.2, 1.4, 1.6, 1.9, 2.0, 2.4, 3.0, 3.2, 3.6, 4.0, 4.5, 5.0, 7.5, 9.0, 12];
for (const tg of ['std', 'mech']) for (const bl of ['none', 'minor', 'major']) for (const noHalf of [false, true]) for (const blk of [false, true]) for (const d0 of wd) for (const inr of inrs) {
  const c = mk(); Object.assign(c.state, { wTarget: tg, bleeding: bl, noHalf, blockDays: blk, wDose: String(d0), inr: String(inr) });
  const t = tg === 'mech' ? [2.5, 3.5] : [2.0, 3.0];
  const b = c.wBand(inr, t[0], t[1]);
  const raw = d0 * (1 + b.pct);
  const plans = b.k === 'major' ? null : c.schedule(raw);
  const days = plans ? plans.map(p => c.planDays(p)) : null;
  G.wf[[tg, bl, noHalf, blk, d0, inr].join('|')] = h({ b, raw, plans, days });
}

// ---- Pediatric liquid ----
const PEDW = [2.5, 4, 5.5, 7, 9, 11, 13, 15, 18, 21, 25, 30, 38, 45];
const PEDA = [undefined, 0.1, 0.4, 1, 3, 7, 12];
const ids = [];
const PEDLIQ = mod.PEDLIQ;
for (const d of PEDLIQ) d.regs.forEach((_, ri) => { ids.push([d.id, ri]); });
for (const [id, ri] of ids) for (const w of PEDW) for (const age of PEDA) for (const days of ['', '3', '14']) {
  const c = mk(); Object.assign(c.state, { mode: 'ped', pdDrug: id, pdReg: ri, pdWeight: String(w), pdAge: age === undefined ? '' : String(age), pdDays: days });
  const v = c.renderVals();
  const o = {}; for (const k of Object.keys(v)) if (k.startsWith('pd') && !/^pd(CatChips|CatDrugs|RegOpts|Name|Strength|Cls|FreqTxt|RegLabel|Notes|Cite|HasRegs|Weight|Age|DaysVal)$/.test(k) && typeof v[k] !== 'function') o[k] = v[k];
  G.ped[[id, ri, w, age, days].join('|')] = h(o);
}
// ไม่ใส่น้ำหนัก (สูตรขนาดคงที่ + ไม่มีข้อมูล)
for (const [id, ri] of ids) { const c = mk(); Object.assign(c.state, { mode: 'ped', pdDrug: id, pdReg: ri, pdWeight: '', pdAge: '' }); const v = c.renderVals(); const o = {}; for (const k of Object.keys(v)) if (k.startsWith('pd') && !/^pd(CatChips|CatDrugs|RegOpts|Name|Strength|Cls|FreqTxt|RegLabel|Notes|Cite|HasRegs|Weight|Age|DaysVal)$/.test(k) && typeof v[k] !== 'function') o[k] = v[k]; G.ped[[id, ri, 'none'].join('|')] = h(o); }

// ---- Insulin ----
for (const u of ['', '0', '8', '10', '14', '20', '25', '30', '38', '45', '60', '100', '300', '301', 'x']) for (const d of ['', '0', '14', '28', '30', '60', '90', '120', '180', '400', '401']) {
  const c = mk(); Object.assign(c.state, { mode: 'calc', calcTool: 'insulin', insUnits: u, insDays: d });
  const v = c.renderVals(); const o = {}; for (const k of Object.keys(v)) if (k.startsWith('ins') && typeof v[k] !== 'function' && !/^ins(Units|Days|SpareBox)$/.test(k)) o[k] = v[k];
  G.ins[u + '|' + d] = h(o);
}

// ---- Naranjo / WHO-UMC / Schumock ----
const base = () => ({ pt: { hn: '', name: '', age: '', sex: '', hx: '' }, drugs: [{ id: 1, name: '', dose: '', route: '', start: '', stop: '', suspect: true }], events: [{ id: 1, desc: '', onset: '', severity: 'moderate', better: '' }], labs: [{ id: 1, name: '', date: '', value: '' }], naranjo: {}, prev: {}, altCauses: [] });
const scen = {
  empty: s => s,
  basic: s => { s.drugs[0] = { id: 1, name: 'Allopurinol', dose: '100 mg', route: 'PO', start: '2026-01-01', stop: '2026-01-20', suspect: true }; s.events[0] = { id: 1, desc: 'ผื่น SJS', onset: '2026-01-15', severity: 'severe', better: '2026-01-27' }; return s; },
  hours: s => { s.drugs[0] = { id: 1, name: 'Ceftriaxone', dose: '2 g', route: 'IV', start: '2026-03-01T08:00', stop: '2026-03-01T20:00', suspect: true }; s.events[0] = { id: 1, desc: 'Anaphylaxis', onset: '2026-03-01T08:40', severity: 'severe', better: '2026-03-02T10:00' }; s.altCauses = ['none']; return s; },
  negtime: s => { s.drugs[0] = { id: 1, name: 'Amoxicillin', dose: '500', route: 'PO', start: '2026-02-10', stop: '', suspect: true }; s.events[0] = { id: 1, desc: 'ผื่น', onset: '2026-02-05', severity: 'mild', better: '' }; return s; },
  rechallenge: s => { s.drugs = [{ id: 1, name: 'Carbamazepine', dose: '200', route: 'PO', start: '2026-01-01', stop: '2026-01-10', suspect: true }, { id: 2, name: 'carbamazepine', dose: '400', route: 'PO', start: '2026-02-01', stop: '', suspect: true }]; s.events = [{ id: 1, desc: 'ผื่น', onset: '2026-01-08', severity: 'moderate', better: '2026-01-15' }, { id: 2, desc: 'ผื่นซ้ำ', onset: '2026-02-04', severity: 'moderate', better: '' }]; s.altCauses = ['viral']; s.pt.hx = 'แพ้ carbamazepine'; s.labs = [{ id: 1, name: 'Eosinophil', date: '2026-02-05', value: '12%' }, { id: 2, name: 'Phenytoin level', date: '2026-02-05', value: '30' }]; return s; },
  manual: s => { const x = scen.basic(s); x.naranjo = { 1: 'y', 2: 'y', 3: 'n', 5: 'y' }; x.prev = { 1: 'n', 2: 'n' }; return x; },
  hxneg: s => { const x = scen.basic(s); x.pt.hx = 'ปฏิเสธการแพ้ยา'; return x; },
};
G.scenarios = {};
for (const [k, f] of Object.entries(scen)) {
  const st0 = f(base()); G.scenarios[k] = JSON.parse(JSON.stringify(st0));
  const c = mk(); Object.assign(c.state, st0);
  G.causal[k] = h({ nj: c.naranjoScore(), who: c.whoUmc(), prev: c.prevScore(), auto: c.autoNaranjo(), ref: c.refAdvice() });
}
fs.writeFileSync('src/logic/__golden__/golden.json', JSON.stringify(G));
const n = Object.fromEntries(Object.entries(G).map(([k, v]) => [k, Object.keys(v).length]));
console.log('golden cases', n, 'total', Object.values(n).reduce((a, b) => a + b, 0));
