import { TB_GUIDELINE } from './tb';
import { COPD_GUIDELINE } from './copd';
import { ASTHMA_GUIDELINE } from './asthma';
import { HTN_GUIDELINE } from './htn';
import { CAP_GUIDELINE } from './cap';
import { DM_GUIDELINE } from './dm';
import { CKD_GUIDELINE } from './ckd';
import { LIPID_GUIDELINE } from './lipid';
import { WARFARIN_GUIDELINE } from './warfarin';
import type { Block, Guideline, Review } from './types';

export const GUIDELINES: Guideline[] = [TB_GUIDELINE, COPD_GUIDELINE, ASTHMA_GUIDELINE, HTN_GUIDELINE, CAP_GUIDELINE, DM_GUIDELINE, CKD_GUIDELINE, LIPID_GUIDELINE, WARFARIN_GUIDELINE];

/** สถานะการทบทวน: ยังไม่ทบทวน / ทบทวนแล้ว / เลยรอบทบทวน */
export function reviewState(r: Review, today: string): { kind: 'pending' | 'ok' | 'overdue'; label: string } {
  if (r.status !== 'approved') return { kind: 'pending', label: 'ตัวอย่าง · ยังไม่ได้ทบทวนโดยเภสัชกร' };
  if (r.nextDue && r.nextDue < today) return { kind: 'overdue', label: `เลยรอบทบทวน (กำหนด ${r.nextDue})` };
  return { kind: 'ok', label: `ทบทวนแล้วโดย ${r.reviewer} · ${r.reviewedAt}` };
}

/** ข้อความที่ค้นได้ของแต่ละบล็อก (แยกเป็นบรรทัด) */
export function blockLines(b: Block): string[] {
  switch (b.kind) {
    case 'kv': return b.items.map((x) => [x.k, x.v, x.note].filter(Boolean).join(' — '));
    case 'list': return b.items.map((x) => x.t);
    case 'drug': return b.items.map((x) => [x.d, x.dose, x.max, x.ae, x.mon].join(' · '));
    default: return b.items.map((r) => Object.values(r).join(' · ')).concat(b.foot ? [b.foot] : []);
  }
}

/** ค้นทุกแนวทางด้วยคำ (ชื่อโรค/ชื่อยา/ข้อความ) — คืนรายการที่พบ จัดกลุ่มตามแนวทาง */
export function searchGuidelines(q: string, list: Guideline[] = GUIDELINES): { guideline: Guideline; titleMatch: boolean; hits: { block: number; heading: string; text: string }[] }[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return list.map((g) => {
    const titleMatch = (g.title + ' ' + g.keywords.join(' ')).toLowerCase().includes(t);
    const hits = g.blocks.flatMap((b, bi) => blockLines(b).filter((l) => l.toLowerCase().includes(t)).map((text) => ({ block: bi, heading: b.h, text })));
    return { guideline: g, titleMatch, hits };
  }).filter((r) => r.titleMatch || r.hits.length);
}
