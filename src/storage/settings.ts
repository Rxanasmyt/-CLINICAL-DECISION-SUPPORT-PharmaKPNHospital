// การตั้งค่าการซิงก์ — เก็บเฉพาะในเครื่องนี้ (ไม่ซิงก์)
import type { SyncSettings } from './types';

const KEY = 'pharmaKpn.sync.v1';
export const DEFAULT_SETTINGS: SyncSettings = { enabled: false, url: '', token: '', salt: '' };

export function loadSettings(): SyncSettings {
  try { const r = localStorage.getItem(KEY); return r ? { ...DEFAULT_SETTINGS, ...JSON.parse(r) } : { ...DEFAULT_SETTINGS }; } catch { return { ...DEFAULT_SETTINGS }; }
}
export function saveSettings(s: SyncSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
export const isConfigured = (s: SyncSettings) => !!(s.enabled && s.url && s.token);
