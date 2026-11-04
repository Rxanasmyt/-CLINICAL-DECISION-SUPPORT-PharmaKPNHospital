// Sync (ระยะที่ 1): บันทึก → เขียน IndexedDB ทันที → ใส่คิว → ส่งขึ้นเซิร์ฟเวอร์
// เปิดแอป/กลับมาออนไลน์ → ส่งคิวค้าง → ดึงข้อมูลล่าสุดมารวม (id + updatedAt ล่าสุดชนะ)
import { COLLECTIONS } from './collections';
import type { Store } from './store';
import type { StorageAdapter, SyncState } from './types';

export class SyncEngine {
  state: SyncState = { kind: 'off' };
  private remote: StorageAdapter | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running: Promise<void> | null = null;
  private lastOk: number | null = null;
  private listeners = new Set<(s: SyncState) => void>();
  private cleanup: (() => void)[] = [];

  constructor(private store: Store, private isOnline: () => boolean = () => (typeof navigator === 'undefined' || navigator.onLine !== false)) {}

  /** ตั้งปลายทาง (null = ปิดซิงก์ ใช้งานในเครื่องอย่างเดียว) */
  setRemote(remote: StorageAdapter | null) {
    this.remote = remote;
    if (!remote) { this.set({ kind: 'off' }); return; }
    this.refreshIdle();
    this.schedule(300);
  }

  /** เรียกเมื่อมีการบันทึกในเครื่อง */
  notifyLocalChange() {
    if (!this.remote) return;
    this.refreshIdle();
    this.schedule(1500);
  }

  start() {
    if (typeof window === 'undefined') return;
    const on = () => { this.refreshIdle(); this.schedule(200); };
    const off = () => this.refreshIdle();
    const vis = () => { if (document.visibilityState === 'visible') this.schedule(500); };
    window.addEventListener('online', on); window.addEventListener('offline', off); document.addEventListener('visibilitychange', vis);
    const iv = setInterval(() => this.schedule(0), 5 * 60_000);
    this.cleanup.push(() => { window.removeEventListener('online', on); window.removeEventListener('offline', off); document.removeEventListener('visibilitychange', vis); clearInterval(iv); });
    this.store.subscribe(() => this.notifyLocalChange());
  }
  stop() { this.cleanup.forEach((f) => f()); this.cleanup = []; if (this.timer) clearTimeout(this.timer); }

  subscribe(fn: (s: SyncState) => void) { this.listeners.add(fn); fn(this.state); return () => this.listeners.delete(fn); }
  private set(s: SyncState) { this.state = s; this.listeners.forEach((f) => f(s)); }

  private refreshIdle() {
    if (!this.remote) return this.set({ kind: 'off' });
    if (this.running) return;
    const pending = this.store.pendingCount();
    if (!this.isOnline()) return this.set({ kind: 'offline', pending });
    if (pending > 0) return this.set({ kind: 'pending', pending });
    if (this.lastOk) return this.set({ kind: 'synced', at: this.lastOk });
    return this.set({ kind: 'pending', pending: 0 });
  }

  private schedule(delay: number) {
    if (!this.remote) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { void this.syncNow(); }, delay);
  }

  /** ส่งคิวค้างแล้วดึงข้อมูลล่าสุดมารวม */
  syncNow(): Promise<void> {
    if (this.running) return this.running;
    const remote = this.remote;
    if (!remote) return Promise.resolve();
    if (!this.isOnline()) { this.refreshIdle(); return Promise.resolve(); }
    this.running = (async () => {
      this.set({ kind: 'syncing', pending: this.store.pendingCount() });
      try {
        await remote.sync();
        // 1) ส่งคิวค้าง
        const rows = this.store.pendingRows();
        if (rows.length) {
          await remote.put(rows.map((r) => this.store.recordOf(r)));
          this.store.markPushed(rows);
        }
        // 2) ดึงข้อมูลล่าสุดมารวม
        for (const def of COLLECTIONS) {
          const since = this.store.getCursor(def.name);
          const recs = await remote.list(def.name, since);
          if (recs.length) this.store.applyRemote(def.name, recs);
        }
        await this.store.flush();
        this.lastOk = Date.now();
        this.running = null;
        this.refreshIdle();
      } catch (e: any) {
        this.running = null;
        this.set({ kind: 'error', message: String(e?.message || e), pending: this.store.pendingCount() });
      }
    })();
    return this.running;
  }
}
