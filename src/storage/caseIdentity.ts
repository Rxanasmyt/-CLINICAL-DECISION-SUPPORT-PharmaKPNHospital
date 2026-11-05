// ระบุว่า "เคสเดียวกัน" ข้ามเครื่อง: ใช้ HN (เทียบในรูป hash) แทนชื่อ
// เหตุผล: เคสที่รับมาจากเครื่องอื่นไม่มีชื่อ (ปกปิดตาม PDPA) ป้ายชื่อเคสจึงไม่ตรงกัน ทำให้บันทึกผู้ป่วยรายเดิมแล้วได้เคสซ้ำ
// กติกาเดิมคงไว้: ผู้ป่วย (HN เดียวกัน) 1 คน = 1 เคสในทะเบียน บันทึกซ้ำคือแก้เคสเดิม
import { hashHn } from './pdpa';

/** กุญแจเทียบ HN: มี salt → hash (เทียบกับ HN ที่เป็น hash จากเครื่องอื่นได้) · ไม่มี salt → เทียบเฉพาะ HN ดิบด้วยกัน · HN ว่าง → '' */
export async function hnKey(hn: unknown, salt: string): Promise<string> {
  const v = String(hn ?? '').trim();
  if (!v) return '';
  if (v.startsWith('sha256:')) return v;
  return salt ? hashHn(v, salt) : 'raw:' + v;
}

/** หาเคสเดิมของผู้ป่วยคนเดียวกัน: ป้ายชื่อตรงกัน (กติกาเดิม) หรือ HN ตรงกัน */
export async function findSameCase(list: any[], label: string, hn: unknown, salt: string): Promise<any | undefined> {
  const byLabel = list.find((c) => c.label === label);
  if (byLabel) return byLabel;
  const k = await hnKey(hn, salt);
  if (!k) return undefined;
  for (const c of list) { if ((await hnKey(c?.data?.pt?.hn, salt)) === k) return c; }
  return undefined;
}

/** ใส่เคสใหม่ลงรายการ: ผู้ป่วยเดิม → แก้เคสเดิมและคงรหัสเคส (cid) เดิม · ผู้ป่วยใหม่ → เพิ่มที่หัวรายการ */
export function upsertCase(list: any[], entry: any, hit: any | undefined): any[] {
  const out = list.slice();
  const i = hit ? out.findIndex((c) => c.id === hit.id) : -1;
  entry.cid = i >= 0 ? String(out[i].cid || out[i].id) : String(entry.id);   // รหัสเคสคงที่ ใช้เป็น id ตอน sync (label มีชื่อผู้ป่วย จึงใช้ไม่ได้)
  if (i >= 0) out[i] = entry; else out.unshift(entry);
  return out;
}

/** HN ซ้ำกันกี่เคส (เทียบด้วย hnKey) — ใช้ติดป้าย "HN ซ้ำ" ในรายการเคสเดิมที่เคยซ้ำก่อนแก้ */
export async function duplicateKeys(cases: any[], salt: string): Promise<Set<string>> {
  const count = new Map<string, number>();
  for (const c of cases) { const k = await hnKey(c?.data?.pt?.hn, salt); if (k) count.set(k, (count.get(k) || 0) + 1); }
  return new Set([...count].filter(([, n]) => n > 1).map(([k]) => k));
}
