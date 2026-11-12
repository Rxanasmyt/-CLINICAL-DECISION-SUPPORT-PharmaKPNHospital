import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { AppDb } from './db';
import { Store } from './store';
import { importBackup, BackupFormatError } from './backup';

const fresh = async () => { const s = new Store(new AppDb('bk-' + Math.random()), null); await s.init(); return s; };

describe('นำเข้าไฟล์สำรองที่รูปแบบผิดบางส่วน', () => {
  it('รายการ null / ไม่ใช่ออบเจ็กต์ / ชุดที่ไม่ใช่อาร์เรย์ ถูกข้าม ส่วนที่ถูกต้องนำเข้าครบ ไม่ error กลางทาง', async () => {
    const s = await fresh();
    const r = importBackup(s, {
      kind: 'adr-registry', cases: [null, 5, { id: 1, label: 'a', saved: '2026-01-01' }], cqi: { x: 1 }, info: [null, { id: 'i1' }],
      intensive: 'abc', ptc: ['2026-02-10', null, 7], workload: [null, { month: '2026-01' }], std: [1, 2],
    });
    expect(r).toMatchObject({ cases: 1, cqi: 0, info: 1, intensive: 0, ptc: 1, workload: 1, std: 0 });
    expect(s.getJson<any[]>('adrCases.v1', []).length).toBe(1);
    expect(s.getJson<any[]>('ptcMeet.v1', [])).toEqual(['2026-02-10']);
  });
  it('ไม่ใช่ไฟล์สำรองของแอป → BackupFormatError และไม่แตะข้อมูล', async () => {
    const s = await fresh();
    for (const bad of [null, [], {}, { kind: 'adr-registry' }, { kind: 'x', cases: [] }]) expect(() => importBackup(s, bad)).toThrow(BackupFormatError);
    expect(s.getJson<any[]>('adrCases.v1', []).length).toBe(0);
  });
});
