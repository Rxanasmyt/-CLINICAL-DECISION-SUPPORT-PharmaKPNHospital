// เทียบผลคำนวณของโมดูลใหม่กับ "ต้นแบบ" ทุกกรณี (golden สร้างโดย tools/gen-golden.mjs จากไฟล์ .dc.html)
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import golden from './__golden__/golden.json';
import { canon } from './hash';
import { computeTb, computeLtbi } from './tb';
import { wBand, schedule, planDays } from './warfarin';
import { computePediatric } from './pediatric';
import { computeInsulin } from './insulin';
import { naranjoScore, whoUmc, prevScore, autoNaranjo, refAdvice } from './causality';
import { PEDLIQ } from '../data/pediatric';

const G: any = golden;
const h = (x: any) => createHash('sha1').update(JSON.stringify(canon(x))).digest('hex').slice(0, 12);
const checkAll = (group: string, fn: (key: string[]) => any) => {
  const bad: string[] = [];
  for (const k of Object.keys(G[group])) if (h(fn(k.split('|'))) !== G[group][k]) bad.push(k);
  expect(bad.slice(0, 10), `${bad.length} กรณีไม่ตรงต้นแบบ`).toEqual([]);
};

describe('TB · Active (2HRZE/4HR)', () => {
  it(`ตรงต้นแบบทุกกรณี (${Object.keys(G.tb).length})`, () => checkAll('tb', ([w, ag, ph, f, half]) => {
    if (w === 'bad') return computeTb({ weight: ag, ageGroup: 'adult', phase: 'intensive', factors: [] });
    return computeTb({ weight: w, ageGroup: ag as any, phase: ph as any, factors: f ? f.split('+') : [], allowHalfTablets: half === 'true' });
  }));
  it('ตัวอย่าง: 55 กก. ผู้ใหญ่ Intensive = H 250 / R 450 / Z 1200 / E 1000 mg', () => {
    const r = computeTb({ weight: '55', ageGroup: 'adult', phase: 'intensive', factors: [] })!;
    expect(r.rows.map((x: any) => x.doseTxt)).toEqual(['250 mg', '450 mg', '1200 mg', '1000 mg']);
    expect(r.totalTabs).toBe(8.5);
  });
  it('Rifampicin ใช้เฉพาะ 300/450 mg · Pyrazinamide 400 · Isoniazid 100', () => {
    for (let w = 20; w <= 120; w += 5) {
      const r = computeTb({ weight: String(w), ageGroup: 'adult', phase: 'intensive', factors: [] })!;
      const tabs = (code: string) => r.rows.find((x: any) => x.code === code).tabsTxt as string;
      expect(tabs('R')).toMatch(/^(300|450) mg/);
      expect(tabs('Z')).toMatch(/^400 mg/);
      expect(tabs('H')).toMatch(/^100 mg/);
    }
  });
});

describe('TB · LTBI 3HP', () => {
  it(`ตรงต้นแบบทุกกรณี (${Object.keys(G.ltbi).length})`, () => checkAll('ltbi', ([w, ag]) =>
    w === 'bad' ? computeLtbi({ weight: ag, ageGroup: 'adult' }) : computeLtbi({ weight: w, ageGroup: ag as any })));
  it('ผู้ใหญ่ ≥ 30 กก. = INH 900 + RPT 900 mg · < 30 กก. ไม่มีขนาด', () => {
    const a = computeLtbi({ weight: '60', ageGroup: 'adult' })!;
    expect([a.inh, a.rpt]).toEqual([900, 900]);
    expect(computeLtbi({ weight: '25', ageGroup: 'adult' })!.rows).toEqual([]);
  });
});

describe('Warfarin', () => {
  it(`ตรงต้นแบบทุกกรณี (${Object.keys(G.wf).length}: band + ตาราง + วัน)`, () => checkAll('wf', ([tg, bl, noHalf, blk, d0, inr]) => {
    const t = tg === 'mech' ? [2.5, 3.5] : [2.0, 3.0];
    const b = wBand(+inr, t[0], t[1], bl as any);
    const raw = +d0 * (1 + b.pct);
    const plans = b.k === 'major' ? null : schedule(raw, noHalf === 'true');
    const days = plans ? plans.map((p: any) => planDays(p, blk === 'true')) : null;
    return { b, raw, plans, days };
  }));
  it('ใช้เม็ด 2/3/5 mg เท่านั้น', () => {
    for (const w of [14, 21, 24.5, 31.5, 35]) for (const p of schedule(w, false) || []) {
      const strengths = p.mixed ? p.strengths : [p.s];
      for (const s of strengths) expect([2, 3, 5]).toContain(s);
    }
  });
  it('INR 2.4 เป้า 2–3 = คงขนาดเดิม', () => expect(wBand(2.4, 2, 3, 'none')).toMatchObject({ k: 'ok', pct: 0, hold: false }));
});

describe('ยาน้ำเด็ก', () => {
  it(`ตรงต้นแบบทุกกรณี (${Object.keys(G.ped).length})`, () => checkAll('ped', ([id, ri, w, age, days]) => {
    const drug = PEDLIQ.find((d: any) => d.id === id)!;
    const reg = drug.regs[+ri];
    const wt = w === 'none' ? 0 : +w;
    const ageN = w === 'none' ? NaN : (age === '' ? NaN : +age);
    const dv = days === '' || w === 'none' ? String(reg.days) : days;
    return { pdIsFixed: !!reg.fixedDose, pdHasW: wt > 0 || !!reg.fixedDose, ...computePediatric({ drug, reg, w: wt, age: ageN, daysVal: dv }) };
  }));
  it('ปริมาณต่อครั้งไม่เกินขอบบนของช่วงที่ยอมรับได้ (เกินขอบบน = 0)', () => {
    let n = 0, over = 0;
    for (const drug of PEDLIQ as any[]) drug.regs.forEach((reg: any) => {
      if (reg.fixedDose || reg.taper) return;
      const conc = drug.mg / drug.ml;
      for (let w = 3; w <= 40; w += 1) {
        const o = computePediatric({ drug, reg, w, age: NaN, daysVal: String(reg.days) });
        const perDose = !!(reg.perDose || drug.perDose);
        let hi = perDose ? w * reg.high : w * reg.high / reg.freq;
        if (reg.capDose && hi > reg.capDose) hi = reg.capDose;
        const hiMl = hi / conc;
        const ml = parseFloat(o.pdMlDose);
        n++;
        if (ml > hiMl + 0.0051) over++;
      }
    });
    expect(n).toBeGreaterThan(700);
    expect(over).toBe(0);
  });
});

describe('Insulin', () => {
  it(`ตรงต้นแบบทุกกรณี (${Object.keys(G.ins).length})`, () => checkAll('ins', ([u, d]) => computeInsulin(u, d)));
  it('1 vial = 1,000 U · penfill = 300 U · ไม่คิดสำรอง', () => {
    const o = computeInsulin('30', '90');
    expect(o.insTotal).toBe('2,700 ยูนิต');
    expect(o.insRows.map((r: any) => r.count)).toEqual(['3 ชิ้น', '9 ชิ้น']);
  });
});

describe('Naranjo / WHO-UMC / Schumock', () => {
  it('ตรงต้นแบบทุกสถานการณ์', () => {
    for (const [k, form] of Object.entries<any>(G.scenarios)) {
      const got = h({ nj: naranjoScore(form), who: whoUmc(form), prev: prevScore(form), auto: autoNaranjo(form), ref: refAdvice(form) });
      expect(got, k).toBe(G.causal[k]);
    }
  });
  it('เติมอัตโนมัติ: ข้อ 6,7,8 = ไม่ทราบ · ข้อ 10 = ใช่ เมื่อมีอาการ', () => {
    const a = autoNaranjo(G.scenarios.basic);
    expect([a[6].v, a[7].v, a[8].v, a[10].v]).toEqual(['u', 'u', 'u', 'y']);
  });
  it('Schumock: ตอบ "ใช่" ข้อใดข้อหนึ่ง = ป้องกันได้', () => {
    expect(prevScore({ ...G.scenarios.basic, prev: { 2: 'y' } }).k).toBe('prev');
  });
});
