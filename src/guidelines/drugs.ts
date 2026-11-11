// มุมมอง "ยา" ของแนวทาง: รวมทุกข้อความในแนวทางที่พูดถึงยาตัวนั้นเข้าด้วยกัน จัดกลุ่มตามหัวข้อที่ข้อความอยู่
// ไม่มีเนื้อหาคลินิกใหม่ — ข้อความมาจากบล็อกของแนวทางเท่านั้น (ชื่อ/ชื่อย่อของยาเป็นเพียงตัวค้น)
import type { Block, Guideline } from './types';

export type DrugKind = 'ขนาดยา' | 'การใช้/ข้อบ่งชี้' | 'ข้อห้าม/ข้อควรระวัง' | 'อันตรกิริยา' | 'ผลข้างเคียง' | 'การติดตาม' | 'การ์ดยา';
export const DRUG_KIND_ORDER: DrugKind[] = ['การ์ดยา', 'ขนาดยา', 'การใช้/ข้อบ่งชี้', 'ข้อห้าม/ข้อควรระวัง', 'อันตรกิริยา', 'ผลข้างเคียง', 'การติดตาม'];

export interface DrugHit { kind: DrugKind; block: number; heading: string; label?: string; text: string; card?: Extract<Block, { kind: 'drug' }>['items'][number] }

/** จัดกลุ่มตามหัวข้อของบล็อก (และคำนำของข้อความ) */
export function kindOf(heading: string, text: string): DrugKind {
  if (/อันตรกิริยา/.test(heading)) return 'อันตรกิริยา';
  if (/ข้อควรระวัง|ข้อห้าม|ห้ามใช้/.test(heading) || /^(ห้ามใช้|ข้อห้าม|ไม่แนะนำ|หลีกเลี่ยง)/.test(text)) return 'ข้อห้าม/ข้อควรระวัง';
  if (/ขนาด|ตามน้ำหนัก/.test(heading)) return 'ขนาดยา';
  if (/ติดตาม/.test(heading)) return 'การติดตาม';
  if (/อาการไม่พึงประสงค์|ตับอักเสบ|ผิวหนัง/.test(heading)) return 'ผลข้างเคียง';
  return 'การใช้/ข้อบ่งชี้';
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** ชื่อละตินต้องไม่ติดกับตัวอักษรอื่น (กัน "ART" ไปติดคำว่า start) ส่วนข้อความไทยค้นตรง ๆ */
export function aliasRe(aliases: string[]): RegExp {
  const parts = aliases.map((a) => /[A-Za-z]/.test(a) ? `(?<![A-Za-z])${esc(a)}(?![A-Za-z])` : esc(a));
  return new RegExp(parts.join('|'), 'i');
}

export function drugHits(g: Guideline, aliases: string[]): DrugHit[] {
  const re = aliasRe(aliases); const out: DrugHit[] = [];
  g.blocks.forEach((b, bi) => {
    if (b.kind === 'kv') b.items.forEach((x) => { const t = [x.v, x.note].filter(Boolean).join(' — '); if (re.test(x.k + ' ' + t)) out.push({ kind: kindOf(b.h, x.k + ' ' + t), block: bi, heading: b.h, label: x.k, text: t }); });
    else if (b.kind === 'list') b.items.forEach((x) => { if (re.test(x.t)) out.push({ kind: kindOf(b.h, x.t), block: bi, heading: b.h, text: x.t }); });
    else if (b.kind === 'drug') b.items.forEach((d) => { if (re.test(d.d)) out.push({ kind: 'การ์ดยา', block: bi, heading: b.h, label: d.d, text: '', card: d }); });
    else b.items.forEach((r) => { const t = Object.values(r).join(' · '); if (re.test(t)) out.push({ kind: kindOf(b.h, t), block: bi, heading: b.h, text: t }); });
  });
  return out.sort((a, b) => DRUG_KIND_ORDER.indexOf(a.kind) - DRUG_KIND_ORDER.indexOf(b.kind));
}
