import { describe, it, expect } from 'vitest';
import { checkPairs, type Shard } from './di';

const h = (s: any, t: string) => ({ s, sec: 'drug_interactions', t, setid: 'x' });
const sh = (ingredient: string, partners: any = {}, classes: any = {}): Shard => ({ ingredient, hasLabel: true, partners, classes });

describe('checkPairs', () => {
  it('ใช้ข้อมูลจากฉลากทั้งสองฝั่ง ระดับของคู่ = ระดับสูงสุด และเรียงจากรุนแรงไปเบา', () => {
    const r = checkPairs(['warfarin', 'aspirin', 'metformin'], {
      warfarin: sh('warfarin', { aspirin: [h('monitor', 'Monitor INR.')] }),
      aspirin: sh('aspirin', { warfarin: [h('avoid', 'Avoid concomitant use.')] }),
      metformin: sh('metformin'),
    }, {});
    expect(r).toHaveLength(1); expect(r[0].sev).toBe('avoid'); expect(r[0].sides).toHaveLength(2);
  });
  it('การกล่าวถึงเป็นกลุ่มยาจับคู่ผ่านสมาชิกกลุ่ม', () => {
    const r = checkPairs(['lisinopril', 'ibuprofen'], { lisinopril: sh('lisinopril', {}, { nsaid: [h('monitor', 'NSAIDs may reduce effect.')] }), ibuprofen: sh('ibuprofen') }, { ibuprofen: ['nsaid'] }, () => 'NSAIDs');
    expect(r[0]).toMatchObject({ a: 'lisinopril', b: 'ibuprofen', sev: 'monitor' }); expect(r[0].sides[0].via).toBe('NSAIDs');
  });
  it('ไม่พบข้อความ → ไม่คืนคู่ (ไม่ได้แปลว่าไม่มีอันตรกิริยา) และไม่นับซ้ำสารเดียวกัน', () => {
    expect(checkPairs(['a', 'b', 'a'], { a: sh('a'), b: sh('b') }, {})).toEqual([]);
    expect(checkPairs(['a', 'a'], { a: sh('a', { a: [h('avoid', 'x')] }) }, {})).toEqual([]);
  });
  it('เรียงลำดับความรุนแรง', () => {
    const r = checkPairs(['a', 'b', 'c'], { a: sh('a', { b: [h('info', 'i')], c: [h('contraindicated', 'c')] }), b: sh('b'), c: sh('c') }, {});
    expect(r.map((x) => x.sev)).toEqual(['contraindicated', 'info']);
  });
});
