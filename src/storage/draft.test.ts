import { describe, it, expect } from 'vitest';
import { isMeaningful, parseDraft, serializeDraft, DRAFT_TTL_MS } from './draft';

const blank = { pt: { hn: '', name: '' }, drugs: [{ name: '' }], events: [{ desc: '' }], labs: [{ name: '' }] };
describe('ร่างฟอร์ม', () => {
  it('ฟอร์มว่างไม่เก็บร่าง · มีข้อมูลข้อใดข้อหนึ่งก็เก็บ', () => {
    expect(isMeaningful(blank)).toBe(false); expect(isMeaningful(undefined)).toBe(false);
    expect(isMeaningful({ ...blank, pt: { hn: '123' } })).toBe(true);
    expect(isMeaningful({ ...blank, pt: { name: 'ก' } })).toBe(true);
    expect(isMeaningful({ ...blank, drugs: [{ name: 'Allopurinol' }] })).toBe(true);
    expect(isMeaningful({ ...blank, events: [{ desc: 'ผื่น' }] })).toBe(true);
    expect(isMeaningful({ ...blank, labs: [{ name: 'ALT' }] })).toBe(true);
    expect(isMeaningful({ ...blank, pt: { hn: '   ' } })).toBe(false);
  });
  it('เก็บแล้วอ่านกลับได้ครบ', () => {
    const data = { ...blank, pt: { hn: '66012345', name: 'ก' }, rep: { hpvc: '' } };
    const d = parseDraft(serializeDraft(data, 1000), 2000)!;
    expect(d.savedAt).toBe(1000); expect(d.data).toEqual(data);
  });
  it('ไม่มี/เสียหาย/ว่างเปล่า/หมดอายุ 24 ชม. → ไม่เสนอกู้คืน', () => {
    const ok = serializeDraft({ ...blank, pt: { hn: '1' } }, 1000);
    expect(parseDraft(null)).toBeNull(); expect(parseDraft('{not json')).toBeNull(); expect(parseDraft('{"savedAt":1}')).toBeNull();
    expect(parseDraft(serializeDraft(blank, 1000), 2000)).toBeNull();
    expect(parseDraft(ok, 1000 + DRAFT_TTL_MS)).not.toBeNull();
    expect(parseDraft(ok, 1000 + DRAFT_TTL_MS + 1)).toBeNull();
    expect(parseDraft(ok, 1000 - 3600e3)).toBeNull();            // เวลาในอนาคตผิดปกติ
  });
});
