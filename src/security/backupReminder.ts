// เตือนสำรองข้อมูล — ข้อมูลอยู่ในเบราว์เซอร์ ล้างเครื่อง/เปลี่ยนเครื่องแล้วยังไม่ซิงก์ = หาย
const KEY = 'pharmaKpn.lastBackup.v1';
export const BACKUP_EVERY_DAYS = 7;

export function markBackup(at = Date.now()) { try { localStorage.setItem(KEY, String(at)); } catch { /* ignore */ } }
export function lastBackupAt(): number | null { try { const v = Number(localStorage.getItem(KEY)); return v > 0 ? v : null; } catch { return null; } }

/** จำนวนวันนับจากสำรองครั้งล่าสุด (null = ยังไม่เคยสำรอง) */
export function daysSince(last: number | null, now = Date.now()): number | null {
  return last == null ? null : Math.floor((now - last) / 86_400_000);
}
export function needsBackup(hasData: boolean, last: number | null, now = Date.now(), every = BACKUP_EVERY_DAYS): boolean {
  if (!hasData) return false;
  const d = daysSince(last, now);
  return d == null || d >= every;
}
