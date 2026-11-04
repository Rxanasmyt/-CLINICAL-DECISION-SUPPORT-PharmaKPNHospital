import { describe, it, expect } from 'vitest';
import { STD as PROTO } from './standards';
import { STD_2570 } from './standards-2570';
import { STD } from './standards-merged';

describe('มาตรฐานความปลอดภัยด้านยา พ.ศ. 2570 ข้อ 3 และข้อ 9', () => {
  it('ทุกข้อของต้นแบบมีในเอกสารต้นฉบับ และข้อความที่แอปใช้ตรงกับเอกสารทุกข้อ', () => {
    const doc = new Map(STD_2570.flatMap((s) => s.levels.flatMap((L) => L.items)).map((i) => [i.id, i.t]));
    const missing = (PROTO as any[]).flatMap((sd) => [...sd.levels.flatMap((L: any) => L.items), ...sd.next]).filter((it: any) => !doc.has(it.id));
    expect(missing).toEqual([]);
    const bad = (STD as any[]).flatMap((sd) => [...sd.levels.flatMap((L: any) => L.items), ...sd.next]).filter((it: any) => doc.get(it.id) !== it.t).map((it: any) => it.id);
    expect(bad).toEqual([]);
  });
  it('ครบทุกระดับ 0–5 และจำนวนข้อตามเอกสาร', () => {
    const count = (no: number) => STD_2570.find((s) => s.no === no)!.levels.map((L) => L.items.length);
    expect(count(3)).toEqual([0, 1, 4, 4, 4, 2]);
    expect(count(9)).toEqual([0, 1, 5, 6, 2, 4]);
  });
  it('STD ที่แอปใช้มีครบทุกข้อ (ไม่ซ้ำ) และข้อใหม่อยู่ใน next', () => {
    for (const sd of STD) {
      const ids = [...sd.levels.flatMap((L: any) => L.items.map((i: any) => i.id)), ...sd.next.map((n: any) => n.id)];
      const doc = STD_2570.find((s) => s.no === sd.no)!.levels.flatMap((L) => L.items.map((i) => i.id));
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.sort()).toEqual(doc.sort());
    }
    expect(STD.find((s) => s.no === 9).next.map((n: any) => n.id)).toEqual(['9-4.1', '9-4.2', '9-5.1', '9-5.2', '9-5.3', '9-5.4']);
  });
});
