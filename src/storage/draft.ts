// ร่างฟอร์มประเมินแพ้ยา: บันทึกอัตโนมัติในเครื่อง และถามกู้คืนเมื่อเปิดแอปใหม่ (กันข้อมูลที่กรอกค้างหายเมื่อรีเฟรช/ปิดแอป)
// เก็บเฉพาะในเครื่องนี้ ไม่ซิงก์ · ร่างเก่ากว่า 24 ชั่วโมงถูกทิ้ง (ลดข้อมูลผู้ป่วยค้างในเบราว์เซอร์)
export const DRAFT_KEY = 'adrDraft.v4';
export const DRAFT_TTL_MS = 24 * 3600e3;

export interface Draft { savedAt: number; data: any }

/** ฟอร์มมีข้อมูลที่ควรเก็บร่างหรือยัง (ฟอร์มว่างไม่เก็บ) */
export function isMeaningful(s: any): boolean {
  if (!s) return false;
  const pt = s.pt || {};
  return !!(String(pt.hn || '').trim() || String(pt.name || '').trim()
    || (s.drugs || []).some((d: any) => String(d.name || '').trim())
    || (s.events || []).some((e: any) => String(e.desc || '').trim())
    || (s.labs || []).some((l: any) => String(l.name || '').trim()));
}

export const serializeDraft = (data: any, now = Date.now()) => JSON.stringify({ savedAt: now, data } as Draft);

/** อ่านร่างจากข้อความที่เก็บไว้ — คืน null ถ้าไม่มี เสียหาย หมดอายุ หรือว่างเปล่า */
export function parseDraft(raw: string | null | undefined, now = Date.now()): Draft | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    if (!d || typeof d.savedAt !== 'number' || !d.data) return null;
    if (now - d.savedAt > DRAFT_TTL_MS || now < d.savedAt - 60_000) return null;
    return isMeaningful(d.data) ? d : null;
  } catch { return null; }
}
