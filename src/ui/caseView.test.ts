import { describe, it, expect } from 'vitest';
import { toRow, filterRows, paginate } from './caseView';
import { hashHn } from '../storage/pdpa';

const mk = (i: number, o: any = {}) => ({
  id: i, cid: String(i), label: 'x', saved: `2026-0${(i % 9) + 1}-15T10:00`,
  data: { pt: { hn: o.hn ?? String(660000 + i), name: o.name ?? 'ผู้ป่วย' + i } },
  sum: { month: `2026-0${(i % 9) + 1}`, drugs: o.drugs ?? ['Allopurinol'], events: ['ผื่น'], nj: 7, njCat: 'probable', who: 'probable', prev: o.prev ?? 'notprev', severe: !!o.severe, repeat: !!o.repeat, hpvc: o.hpvc ?? 'sent', rca: o.rca ?? 'na' },
});

describe('รายการเคส', () => {
  it('แถวแสดง HN + วันที่ + ยาที่สงสัย + ผลประเมิน', () => {
    const r = toRow(mk(1));
    expect(r.title).toBe('HN 660001 · ผู้ป่วย1');
    expect(r.date).toMatch(/2569$/);
    expect(r.drugs).toBe('Allopurinol');
    expect(r.assess).toBe('Naranjo 7 Probable · WHO-UMC Probable / Likely');
  });
  it('เคสจากเครื่องอื่น (ไม่มีชื่อ · HN เข้ารหัส) ยังมีข้อความระบุตัวเคสได้', () => {
    const r = toRow(mk(2, { hn: 'sha256:abcdef0123456789', name: '' }));
    expect(r.title).toBe('HN เข้ารหัส …456789');
    expect(toRow(mk(3, { hn: '', name: '' })).title).toBe('ไม่ระบุ HN');
  });
  it('ค้นหาด้วย HN ชื่อ ยา และกรองไตรมาส/งานค้าง', () => {
    const rows = [mk(1), mk(2, { drugs: ['Carbamazepine'], severe: true }), mk(3, { hpvc: 'pending' }), mk(4, { prev: 'prev', rca: 'missing' })].map((c) => toRow(c));
    const f = (q: string, flag: any = 'all', quarter = '') => filterRows(rows, { q, quarter, flag }).map((r) => r.key);
    expect(f('660002')).toEqual(['2']);
    expect(f('ผู้ป่วย3')).toEqual(['3']);
    expect(f('carba')).toEqual(['2']);
    expect(f('', 'severe')).toEqual(['2']);
    expect(f('', 'hpvc')).toEqual(['3']);
    expect(f('', 'rca')).toEqual(['4']);
    expect(f('', 'prev')).toEqual(['4']);
    expect(f('', 'all', rows[0].quarter)).toEqual(['1', '2']);   // ก.พ. และ มี.ค. อยู่ไตรมาสเดียวกัน
    expect(f('ไม่มีอยู่จริง')).toEqual([]);
  });
  it('ค้นด้วย HN ได้แม้เคสเก็บเป็นค่าเข้ารหัส (เทียบ hash ของคำค้น)', async () => {
    const h = await hashHn('660123', 'KPN');
    const rows = [toRow(mk(1, { hn: h, name: '' })), toRow(mk(2))];
    expect(filterRows(rows, { q: '660123', hnHash: h, quarter: '', flag: 'all' }).map((r) => r.key)).toEqual(['1']);
    expect(filterRows(rows, { q: '660123', quarter: '', flag: 'all' }).map((r) => r.key)).toEqual([]);   // ไม่มี salt = ค้นไม่เจอ
  });
  it('แบ่งหน้า 20 เคสต่อหน้า', () => {
    const a = Array.from({ length: 45 }, (_, i) => i);
    expect(paginate(a, 1).items.length).toBe(20); expect(paginate(a, 3).items.length).toBe(5);
    expect(paginate(a, 9)).toMatchObject({ page: 3, pages: 3 }); expect(paginate([], 1)).toMatchObject({ page: 1, pages: 1, items: [] });
  });
});

describe('ติดป้าย HN ซ้ำ', () => {
  it('toRow ติดป้ายและ flag dup เฉพาะเมื่อสั่ง · filter "HN ซ้ำ" · map(toRow) ตรงๆ ไม่ติดป้ายผิด', () => {
    const a = toRow(mk(1), { dup: true }), b = toRow(mk(2));
    expect(a.flags.has('dup')).toBe(true); expect(a.chips.join()).toMatch(/HN ซ้ำ/);
    expect(b.flags.has('dup')).toBe(false);
    expect(filterRows([a, b], { q: '', quarter: '', flag: 'dup' }).map((r) => r.key)).toEqual(['1']);
    expect(([mk(1), mk(2), mk(3)].map(toRow as any) as any[]).some((r) => r.flags.has("dup"))).toBe(false);
  });
});
