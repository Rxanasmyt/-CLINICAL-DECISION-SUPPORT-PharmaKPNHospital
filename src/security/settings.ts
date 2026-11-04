// การตั้งค่าความปลอดภัย — เก็บเฉพาะในเครื่องนี้ (ไม่ซิงก์)
export interface PinRecord { salt: string; hash: string; iter: number }
export interface SecuritySettings {
  pin?: PinRecord;
  /** ล็อกอัตโนมัติเมื่อไม่ได้ใช้งานกี่นาที (0 = ไม่ล็อก) */
  autoLockMin: number;
  /** เก็บข้อมูลกี่ปี (ใช้กับรายการ "ลบข้อมูลเกินกำหนด") */
  retentionYears: number;
  /** เภสัชกรผู้ใช้เครื่องนี้ */
  user: { name: string; license: string };
}
const KEY = 'pharmaKpn.security.v1';
export const DEFAULT_SECURITY: SecuritySettings = { autoLockMin: 5, retentionYears: 5, user: { name: '', license: '' } };

export function loadSecurity(): SecuritySettings {
  try { const r = localStorage.getItem(KEY); return r ? { ...DEFAULT_SECURITY, ...JSON.parse(r), user: { ...DEFAULT_SECURITY.user, ...(JSON.parse(r).user || {}) } } : { ...DEFAULT_SECURITY, user: { ...DEFAULT_SECURITY.user } }; } catch { return { ...DEFAULT_SECURITY, user: { ...DEFAULT_SECURITY.user } }; }
}
export function saveSecurity(s: SecuritySettings) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }

/** ชื่อผู้ใช้สำหรับบันทึกประวัติการแก้ไขและช่องลงชื่อเภสัชกร */
export function userDisplay(s: SecuritySettings = loadSecurity()): string {
  const n = s.user.name.trim();
  return n ? n + (s.user.license.trim() ? ' (ว.' + s.user.license.trim() + ')' : '') : '';
}
