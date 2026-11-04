import { Store } from './store';
import { SyncEngine } from './syncEngine';
import { SheetsAdapter } from './sheetsAdapter';
import { isConfigured, loadSettings } from './settings';
import type { SyncSettings } from './types';

/** ที่เก็บข้อมูลในเครื่อง (IndexedDB + แคช) และตัวซิงก์ที่ใช้ร่วมกันทั้งแอป */
export const store = new Store();
export const engine = new SyncEngine(store);

/** ตั้งปลายทางการซิงก์ตามค่าที่ตั้งไว้ (StorageAdapter ตัวเดียว สลับเป็นฐานข้อมูลในเครือข่าย รพ. ภายหลังได้) */
export function applySettings(s: SyncSettings = loadSettings()) {
  engine.setRemote(isConfigured(s) ? new SheetsAdapter({ url: s.url, token: s.token, salt: s.salt }) : null);
}

export async function initStorage() {
  store.setActor(() => { try { const u = JSON.parse(localStorage.getItem('pharmaKpn.security.v1') || '{}').user || {}; return String(u.name || '').trim(); } catch { return ''; } });
  await store.init();
  // ขอให้เบราว์เซอร์เก็บข้อมูลถาวร (ลดโอกาสถูกล้างเมื่อพื้นที่เต็ม)
  try { void navigator.storage?.persist?.(); } catch { /* ignore */ }
  engine.start();
  applySettings();
}

export { loadSettings, saveSettings } from './settings';
