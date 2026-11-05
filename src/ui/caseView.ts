// รายการเคสที่บันทึกไว้: แปลงเป็นแถวอ่านง่าย (วันที่ + HN + ยาที่สงสัย + ผลประเมิน) ค้นหา กรอง แบ่งหน้า
import { thaiDate, quarterLabel, NJ, WHO } from '../storage/labels';

export type Flag = 'all' | 'severe' | 'repeat' | 'prev' | 'hpvc' | 'rca' | 'dup';
export const FLAGS: [Flag, string][] = [['all', 'ทั้งหมด'], ['severe', 'รุนแรง'], ['repeat', 'แพ้ยาซ้ำ'], ['prev', 'ป้องกันได้'], ['hpvc', 'รอส่ง HPVC'], ['rca', 'RCA ยังไม่ครบ'], ['dup', 'HN ซ้ำ']];

export interface CaseRow {
  key: string; raw: any; title: string; hnShown: string; name: string; date: string; drugs: string; assess: string;
  quarter: string; flags: Set<Flag>; chips: string[]; hay: string; hnRaw: string;
}
const short = (s: string) => s.split(' (')[0];

/** dup = HN เดียวกันมีหลายเคส (เคสที่ซ้ำก่อนแก้ หรือบันทึกจากหลายเครื่อง) */
export function toRow(c: any, opts: { dup?: boolean } = {}): CaseRow {
  const dup = !!opts.dup;
  const s = c?.sum || {}, pt = c?.data?.pt || {};
  const hnRaw = String(pt.hn || '').trim(), name = String(pt.name || '').trim();
  const hnShown = !hnRaw ? 'ไม่ระบุ HN' : hnRaw.startsWith('sha256:') ? `HN เข้ารหัส …${hnRaw.slice(-6)}` : `HN ${hnRaw}`;
  const drugs = (s.drugs || []).join(', ');
  const nj = s.nj != null ? `Naranjo ${s.nj}${s.njCat ? ' ' + short((NJ as any)[s.njCat] || s.njCat) : ''}` : '';
  const who = s.who ? `WHO-UMC ${short((WHO as any)[s.who] || s.who)}` : '';
  const flags = new Set<Flag>(['all']);
  const chips: string[] = [];
  if (s.severe) { flags.add('severe'); chips.push('รุนแรง'); }
  if (s.repeat) { flags.add('repeat'); chips.push('แพ้ยาซ้ำ'); }
  if (s.prev === 'prev') { flags.add('prev'); chips.push('ป้องกันได้'); }
  if (s.hpvc === 'pending') { flags.add('hpvc'); chips.push('รอส่ง HPVC'); }
  if (s.rca === 'missing') { flags.add('rca'); chips.push('RCA ยังไม่ครบ'); }
  if (dup) { flags.add('dup'); chips.push('HN ซ้ำ — ตรวจและลบเคสที่ซ้ำ'); }
  return {
    key: String(c.cid ?? c.id), raw: c, hnShown, name, hnRaw,
    title: hnShown + (name ? ' · ' + name : ''),
    date: thaiDate(c.saved), drugs: drugs || 'ไม่ระบุยา', assess: [nj, who].filter(Boolean).join(' · ') || 'ยังไม่ได้ประเมิน',
    quarter: quarterLabel(s.month), flags, chips,
    hay: [hnRaw, name, drugs, (s.events || []).join(' '), c.label].join(' ').toLowerCase(),
  };
}

export interface Query { q: string; hnHash?: string; quarter: string; flag: Flag }
export function filterRows(rows: CaseRow[], f: Query): CaseRow[] {
  const q = f.q.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.quarter && r.quarter !== f.quarter) return false;
    if (f.flag !== 'all' && !r.flags.has(f.flag)) return false;
    if (!q) return true;
    return r.hay.includes(q) || (!!f.hnHash && r.hnRaw === f.hnHash);
  });
}
export const PAGE_SIZE = 20;
export function paginate<T>(rows: T[], page: number, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(Math.max(1, page), pages);
  return { pages, page: p, items: rows.slice((p - 1) * size, p * size) };
}
