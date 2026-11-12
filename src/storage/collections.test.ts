import { describe, it, expect } from 'vitest';
import { BY_KEY, toEntries, applyEntry } from './collections';

describe('ข้อมูลในเครื่องที่ผิดรูปแบบต้องไม่ทำให้พัง', () => {
  const def = BY_KEY['adrCases.v1'];
  it('อาร์เรย์ที่มี null / undefined ข้ามรายการนั้นแทนที่จะ error', () => {
    const m = toEntries(def, [null, { id: 7, cid: '7' }, undefined]);
    expect([...m.keys()]).toEqual([def.idOf!({ id: 7, cid: '7' })]);
    expect(applyEntry(def, [null, { id: 7, cid: '7' }], '9', { id: 9, cid: '9' }).length).toBe(2);
  });
  it('ค่าที่ไม่ใช่อาร์เรย์ถือเป็นรายการว่าง', () => {
    expect(toEntries(def, 'abc').size).toBe(0); expect(toEntries(def, { a: 1 }).size).toBe(0);
  });
});
