// จัดกลุ่มเนื้อหาในการ์ดให้เหลือ 2 ส่วนอ่านง่าย: "การรักษา" (เลือกยา ขนาดยา ข้อบ่งชี้) และ "ความปลอดภัย" (ข้อห้าม ข้อควรระวัง ติดตาม อันตรกิริยา ผลข้างเคียง)
// จัดตามหัวข้อของบล็อก (หน้าจอเท่านั้น ไม่เปลี่ยนเนื้อหาคลินิก)
import type { Block, Guideline } from './types';

export type BlockGroup = 'treat' | 'safety';
const SAFETY = /ข้อห้าม|ระวัง|หลีกเลี่ยง|ติดตาม|อันตรกิริยา|ผลข้างเคียง|อาการไม่พึงประสงค์|พิษ|ตับอักเสบ|ผิวหนัง|สอนผู้ป่วย|ให้ความรู้|ยาที่เพิ่มความดัน|สาเหตุ INR/;

export function blockGroup(b: Block): BlockGroup {
  if ('danger' in b && b.danger) return 'safety';
  return SAFETY.test(b.h) ? 'safety' : 'treat';
}

export function groupedBlocks(g: Guideline): { treat: number[]; safety: number[] } {
  const out = { treat: [] as number[], safety: [] as number[] };
  g.blocks.forEach((b, i) => out[blockGroup(b)].push(i));
  return out;
}

/** กลุ่มยา → รายการยา (เรียงตามลำดับที่ระบุในแนวทาง) */
export function drugGroups(g: Guideline): { group: string; drugs: NonNullable<Guideline['drugs']> }[] {
  const order: string[] = []; const map = new Map<string, NonNullable<Guideline['drugs']>>();
  for (const d of g.drugs || []) { const k = d.group || 'ยาอื่น ๆ'; if (!map.has(k)) { map.set(k, []); order.push(k); } map.get(k)!.push(d); }
  return order.map((group) => ({ group, drugs: map.get(group)! }));
}
