// อายุการเก็บข้อมูล (PDPA): หารายการที่เก็บเกินกำหนด แล้วลบเมื่อผู้ใช้ยืนยัน
// การลบเขียน tombstone จึงซิงก์ไปลบบนเซิร์ฟเวอร์ด้วย
import type { Store } from './../storage/store';

interface Rule { key: string; label: string; dateOf: (x: any) => string | undefined }
export const RETENTION_RULES: Rule[] = [
  { key: 'adrCases.v1', label: 'เคสประเมินแพ้ยา', dateOf: (c) => c.saved },
  { key: 'intensive.v1', label: 'Intensive monitoring', dateOf: (x) => x.start },
  { key: 'infoEval.v1', label: 'บันทึกการให้ข้อมูลด้านยา', dateOf: (x) => x.date },
];

export interface Expired { key: string; label: string; ids: (string | number)[] }

export function findExpired(store: Store, years: number, now = Date.now()): Expired[] {
  const cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - years);
  return RETENTION_RULES.map((r) => {
    const list = store.getJson<any[]>(r.key, []);
    const ids = list.filter((x) => { const d = r.dateOf(x); const t = d ? new Date(d).getTime() : NaN; return isFinite(t) && t < cutoff.getTime(); }).map((x) => x.id);
    return { key: r.key, label: r.label, ids };
  }).filter((e) => e.ids.length > 0);
}

export function purgeExpired(store: Store, expired: Expired[]): number {
  let n = 0;
  for (const e of expired) {
    const drop = new Set(e.ids);
    const list = store.getJson<any[]>(e.key, []);
    const keep = list.filter((x) => !drop.has(x.id));
    n += list.length - keep.length;
    store.setJson(e.key, keep, false, 'ลบตามอายุข้อมูล');
  }
  return n;
}
