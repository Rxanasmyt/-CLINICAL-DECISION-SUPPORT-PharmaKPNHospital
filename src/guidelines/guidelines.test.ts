import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { GUIDELINES, reviewState, searchGuidelines, blockLines } from './registry';
import { TB_GUIDELINE } from './tb';
import { REF_TB_BLOCKS, REF_TB_CITES } from '../data/references';
import { validateFile, addFile, listFiles, removeFile, MAX_FILE_BYTES, MAX_FILES_PER_GUIDELINE } from './attachments';
import { AppDb } from '../storage/db';

describe('แนวทางวัณโรค (ตัวอย่างแรก)', () => {
  it('เนื้อหาคือข้อมูลอ้างอิงเดิมทุกบล็อก ไม่ถูกแก้/เขียนใหม่ และหมวดนำทางครอบคลุมทุกบล็อกครั้งเดียว', () => {
    expect(TB_GUIDELINE.blocks).toBe(REF_TB_BLOCKS as any); expect(TB_GUIDELINE.cites).toBe(REF_TB_CITES);
    const used = TB_GUIDELINE.sections.flatMap((s) => s.blocks).sort((a, b) => a - b);
    expect(used).toEqual(TB_GUIDELINE.blocks.map((_, i) => i));
  });
  it('มีที่มาและสถานะ "ยังไม่ได้ทบทวน" จนกว่าจะลงนาม', () => {
    expect(TB_GUIDELINE.cites.length).toBeGreaterThan(3); expect(TB_GUIDELINE.cites[0]).toMatch(/พ\.ศ\. 2564/);
    expect(reviewState(TB_GUIDELINE.review, '2026-11-10').kind).toBe('pending');
  });
  it('สถานะทบทวน: ทบทวนแล้ว / เลยรอบ', () => {
    const r = { status: 'approved' as const, reviewer: 'ภก.ก', reviewedAt: '2026-01-01', nextDue: '2027-01-01' };
    expect(reviewState(r, '2026-11-10')).toMatchObject({ kind: 'ok' });
    expect(reviewState(r, '2027-01-02')).toMatchObject({ kind: 'overdue' });
    expect(reviewState({ ...r, nextDue: '' }, '2030-01-01').kind).toBe('ok');
  });
});

describe('ค้นแนวทางตามโรคและตามยา', () => {
  it('ค้นชื่อโรค/คำสำคัญ → พบแนวทาง', () => {
    expect(searchGuidelines('วัณโรค').map((r) => r.guideline.id)).toEqual(['tb']);
    expect(searchGuidelines('tuberculosis')[0].titleMatch).toBe(true);
    expect(searchGuidelines('')).toEqual([]); expect(searchGuidelines('ไม่มีโรคนี้แน่นอน')).toEqual([]);
  });
  it('ค้นชื่อยา → พบทุกตำแหน่งที่กล่าวถึงยานั้น (ขนาด ADR กรณีพิเศษ) ไม่ตกหล่น', () => {
    const r = searchGuidelines('rifampicin')[0];
    const total = TB_GUIDELINE.blocks.flatMap((b) => blockLines(b)).filter((l) => l.toLowerCase().includes('rifampicin')).length;
    expect(r.hits.length).toBe(total); expect(total).toBeGreaterThanOrEqual(4);
    expect(r.hits.some((h) => /ขนาดยาต่อกิโลกรัม/.test(h.heading))).toBe(true);
    expect(searchGuidelines('Pyridoxine')[0].hits.length).toBeGreaterThan(0);
  });
  it('ทุกแนวทางในคลังมี id ไม่ซ้ำ', () => { expect(new Set(GUIDELINES.map((g) => g.id)).size).toBe(GUIDELINES.length); });
});

describe('แนบไฟล์ (ในเครื่อง)', () => {
  const f = (name: string, type: string, size: number) => ({ name, type, size });
  it('ตรวจชนิด ขนาด และจำนวน', () => {
    expect(validateFile(f('a.pdf', 'application/pdf', 1000), 0)).toBeNull();
    expect(validateFile(f('a.png', 'image/png', 1000), 0)).toBeNull();
    expect(validateFile(f('a.pdf', '', 1000), 0)).toBeNull();                       // บางเครื่องไม่ส่ง type
    expect(validateFile(f('a.exe', 'application/x-msdownload', 1000), 0)).toMatch(/PDF/);
    expect(validateFile(f('big.pdf', 'application/pdf', MAX_FILE_BYTES + 1), 0)).toMatch(/แบ่งไฟล์/);
    expect(validateFile(f('a.pdf', 'application/pdf', 1000), MAX_FILES_PER_GUIDELINE)).toMatch(/สูงสุด/);
  });
  it('เพิ่ม/อ่าน/ลบ ในฐานข้อมูลของเครื่อง แยกตามแนวทาง', async () => {
    const db = new AppDb('gl-' + Math.random());
    const file = new File([new Uint8Array([37, 80, 68, 70])], 'tb-guideline.pdf', { type: 'application/pdf' });
    expect(await addFile(db, 'tb', file)).toBeNull();
    expect(await addFile(db, 'other', file)).toBeNull();
    const rows = await listFiles(db, 'tb');
    expect(rows.map((r) => [r.name, r.size, r.guidelineId])).toEqual([['tb-guideline.pdf', 4, 'tb']]);
    await removeFile(db, rows[0].id!);
    expect(await listFiles(db, 'tb')).toEqual([]); expect(await listFiles(db, 'other')).toHaveLength(1);
  });
});
