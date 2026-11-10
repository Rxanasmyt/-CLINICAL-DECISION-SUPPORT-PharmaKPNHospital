// งานค้างวันนี้: รวมสิ่งที่เภสัชกรต้องติดตามจากข้อมูลที่บันทึกไว้ (เคส ADR และ intensive monitoring)
import { thaiDate } from '../storage/labels';
import type { Flag } from './caseView';

export type TodoKind = 'hpvc' | 'rca' | 'repeat' | 'intDue' | 'intSoon';
export interface TodoItem { kind: TodoKind; title: string; count: number; examples: string[]; tone: 'red' | 'amber' | 'blue'; flag?: Flag }

const short = (c: any) => { const h = String(c?.data?.pt?.hn || '').trim(); return h && !h.startsWith('sha256:') ? 'HN ' + h : (h ? 'HN เข้ารหัส …' + h.slice(-6) : 'ไม่ระบุ HN'); };
const dayDiff = (iso: string, today: string) => Math.round((Date.parse(iso.slice(0, 10)) - Date.parse(today)) / 86400e3);
const ex = (xs: string[]) => xs.slice(0, 3);

/** today = 'YYYY-MM-DD' (เวลาท้องถิ่น) */
export function buildTodos(cases: any[], intLog: any[], today: string): TodoItem[] {
  const out: TodoItem[] = [];
  const sums = (cases || []).filter((c) => c && c.sum);
  const sel = (f: (s: any) => boolean) => sums.filter((c) => f(c.sum));
  const hp = sel((s) => s.hpvc === 'pending'); if (hp.length) out.push({ kind: 'hpvc', title: 'รอส่งรายงาน HPVC', count: hp.length, examples: ex(hp.map((c) => short(c))), tone: 'amber', flag: 'hpvc' });
  const rc = sel((s) => s.rca === 'missing'); if (rc.length) out.push({ kind: 'rca', title: 'RCA ยังไม่ครบ (เคสที่ป้องกันได้)', count: rc.length, examples: ex(rc.map((c) => short(c))), tone: 'amber', flag: 'rca' });
  const rp = sel((s) => s.repeat); if (rp.length) out.push({ kind: 'repeat', title: 'แพ้ยาซ้ำ (เป้าหมาย = 0) — ทบทวนสาเหตุ', count: rp.length, examples: ex(rp.map((c) => short(c))), tone: 'red', flag: 'repeat' });
  const act = (intLog || []).filter((x) => x && x.status === 'ติดตามอยู่' && x.next);
  const due = act.filter((x) => dayDiff(x.next, today) <= 0).sort((a, b) => String(a.next).localeCompare(String(b.next)));
  if (due.length) out.push({ kind: 'intDue', title: 'ถึงกำหนด/เลยกำหนดติดตาม (intensive)', count: due.length, tone: 'red',
    examples: ex(due.map((x) => `${x.drug || 'ยา'} · นัด ${thaiDate(x.next)}${dayDiff(x.next, today) < 0 ? ` (เลย ${-dayDiff(x.next, today)} วัน)` : ' (วันนี้)'}`)) });
  const soon = act.filter((x) => { const d = dayDiff(x.next, today); return d > 0 && d <= 7; });
  if (soon.length) out.push({ kind: 'intSoon', title: 'ใกล้ถึงกำหนดติดตามใน 7 วัน (intensive)', count: soon.length, tone: 'blue',
    examples: ex(soon.map((x) => `${x.drug || 'ยา'} · นัด ${thaiDate(x.next)}`)) });
  return out;
}
export const localToday = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
