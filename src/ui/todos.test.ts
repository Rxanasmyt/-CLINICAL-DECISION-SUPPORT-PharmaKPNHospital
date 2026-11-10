import { describe, it, expect } from 'vitest';
import { buildTodos, localToday } from './todos';

const c = (id: number, hn: string, s: any) => ({ id, cid: String(id), data: { pt: { hn } }, sum: s });
const TODAY = '2026-11-10';
describe('งานค้างวันนี้', () => {
  it('ไม่มีข้อมูล = ไม่มีงานค้าง', () => { expect(buildTodos([], [], TODAY)).toEqual([]); });
  it('นับ HPVC รอส่ง / RCA ไม่ครบ / แพ้ซ้ำ จากเคส พร้อมตัวอย่าง HN (ไม่เกิน 3)', () => {
    const cases = [c(1, '111', { hpvc: 'pending' }), c(2, '222', { hpvc: 'pending', rca: 'missing' }), c(3, 'sha256:abcdef123456', { hpvc: 'pending', repeat: true }), c(4, '444', { hpvc: 'pending' }), c(5, '555', { hpvc: 'sent', rca: 'done' })];
    const t = buildTodos(cases, [], TODAY);
    const by = (k: string) => t.find((x) => x.kind === k)!;
    expect(by('hpvc')).toMatchObject({ count: 4, tone: 'amber', flag: 'hpvc' }); expect(by('hpvc').examples).toEqual(['HN 111', 'HN 222', 'HN เข้ารหัส …123456']);
    expect(by('rca')).toMatchObject({ count: 1, flag: 'rca' }); expect(by('repeat')).toMatchObject({ count: 1, tone: 'red', flag: 'repeat' });
  });
  it('intensive: ถึงกำหนด/เลยกำหนด และใกล้ถึงใน 7 วัน เฉพาะที่ยังติดตามอยู่', () => {
    const it = [
      { id: 1, drug: 'Warfarin', next: '2026-11-08', status: 'ติดตามอยู่' }, { id: 2, drug: 'Allopurinol', next: '2026-11-10', status: 'ติดตามอยู่' },
      { id: 3, drug: 'CBZ', next: '2026-11-15', status: 'ติดตามอยู่' }, { id: 4, drug: 'Far', next: '2026-12-30', status: 'ติดตามอยู่' },
      { id: 5, drug: 'Done', next: '2026-11-01', status: 'หยุดติดตาม' }, { id: 6, drug: 'NoDate', next: '', status: 'ติดตามอยู่' },
    ];
    const t = buildTodos([], it, TODAY);
    const due = t.find((x) => x.kind === 'intDue')!, soon = t.find((x) => x.kind === 'intSoon')!;
    expect(due.count).toBe(2); expect(due.examples[0]).toMatch(/Warfarin.*เลย 2 วัน/); expect(due.examples[1]).toMatch(/วันนี้/);
    expect(soon.count).toBe(1); expect(soon.examples[0]).toMatch(/CBZ/);
    expect(t.some((x) => x.examples.join().includes('Done') || x.examples.join().includes('NoDate'))).toBe(false);
  });
  it('วันที่ท้องถิ่น', () => { expect(localToday(new Date(2026, 10, 5))).toBe('2026-11-05'); });
});
