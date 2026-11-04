// ที่เก็บข้อมูลในเครื่อง: อ่านเร็วแบบ synchronous จากแคชในหน่วยความจำ + เขียน IndexedDB ทันที
// หน้าจอ (ตรรกะเดิมจากต้นแบบ) ใช้ getJson/setJson แทน localStorage โดยไม่ต้องเปลี่ยนรูปแบบข้อมูล
import { AppDb, type AuditRow, type RecRow } from './db';
import { BY_KEY, COLLECTIONS, applyEntry, toEntries, type CollectionDef } from './collections';
import { restoreLocalIdentifiers } from './pdpa';
import type { CollectionName, StoredRecord } from './types';

const pkOf = (c: CollectionName, id: string) => c + '|' + id;
const fpOf = (d: unknown) => JSON.stringify(d);

export class Store {
  private cache = new Map<string, any>();
  private rec = new Map<string, RecRow>();
  private cursors: Record<string, number> = {};
  private listeners = new Set<(keys: string[]) => void>();
  private chain: Promise<unknown> = Promise.resolve();
  ready = false;
  private actor: () => string = () => '';
  /** กำหนดชื่อผู้ใช้ที่ลงในประวัติการแก้ไข */
  setActor(fn: () => string) { this.actor = fn; }

  constructor(public db: AppDb = new AppDb(), private legacy: Storage | null = safeLocalStorage()) {}

  /** โหลดจาก IndexedDB เข้าแคช (เรียกก่อนแสดงหน้าจอ) และย้ายข้อมูลเดิมจาก localStorage ครั้งแรก */
  async init() {
    const [kv, rec, meta] = await Promise.all([this.db.kv.toArray(), this.db.rec.toArray(), this.db.meta.get('cursors')]);
    kv.forEach((r) => this.cache.set(r.key, r.value));
    rec.forEach((r) => this.rec.set(r.pk, r));
    this.cursors = (meta?.value as any) || {};
    this.ready = true;
    // ย้ายข้อมูลที่เคยเก็บใน localStorage (ครั้งแรกเท่านั้น: คีย์ที่ยังไม่มีใน IndexedDB)
    if (this.legacy) {
      for (const def of COLLECTIONS) {
        if (this.cache.has(def.key)) continue;
        try {
          const raw = this.legacy.getItem(def.key);
          if (raw) this.setJson(def.key, JSON.parse(raw), true);
        } catch { /* ข้ามคีย์ที่อ่านไม่ได้ */ }
      }
    }
    await this.chain;
  }

  getJson<T>(key: string, fallback: T): T {
    return this.cache.has(key) ? this.cache.get(key) : fallback;
  }

  /** เขียนค่าทั้งชุด (รูปแบบเดียวกับต้นแบบ) — ตรวจว่ารายการใดเปลี่ยน/ถูกลบ เพื่อใส่คิวส่งขึ้นเซิร์ฟเวอร์ */
  setJson(key: string, value: unknown, silent = false, source?: string) {
    const def = BY_KEY[key];
    this.cache.set(key, value);
    const writes: RecRow[] = [];
    const audits: AuditRow[] = [];
    if (def) {
      const now = Date.now();
      const next = toEntries(def, value);
      const bump = (prev: RecRow | undefined) => Math.max(now, (prev?.updatedAt ?? 0) + 1);
      next.forEach((data, id) => {
        const pk = pkOf(def.name, id), prev = this.rec.get(pk), fp = fpOf(data);
        if (!prev || prev.deleted || prev.fp !== fp) {
          const row: RecRow = { pk, collection: def.name, id, updatedAt: bump(prev), pushedAt: prev?.pushedAt ?? 0, deleted: false, fp };
          this.rec.set(pk, row); writes.push(row);
          audits.push({ at: now, user: this.actor(), action: source ?? (prev && !prev.deleted ? 'แก้ไข' : 'เพิ่ม'), collection: def.name, recordId: id });
        }
      });
      this.rec.forEach((prev, pk) => {
        if (prev.collection !== def.name || prev.deleted || next.has(prev.id)) return;
        const row: RecRow = { ...prev, deleted: true, updatedAt: bump(prev), fp: '' };
        this.rec.set(pk, row); writes.push(row);
        audits.push({ at: now, user: this.actor(), action: source ?? 'ลบ', collection: def.name, recordId: prev.id });
      });
    }
    this.persist(async () => {
      await this.db.kv.put({ key, value });
      if (writes.length) await this.db.rec.bulkPut(writes);
      if (audits.length) await this.db.audit.bulkAdd(audits);
    });
    if (!silent) this.emit([key]);
    return writes.length;
  }

  /** ลบข้อมูลทั้งหมดในเครื่องนี้ (ไม่ส่ง tombstone — ข้อมูลที่ซิงก์ไว้ในเซิร์ฟเวอร์ยังอยู่) */
  async clearLocal() {
    this.cache.clear(); this.rec.clear(); this.cursors = {};
    this.persist(async () => { await this.db.kv.clear(); await this.db.rec.clear(); await this.db.meta.clear(); await this.db.audit.add({ at: Date.now(), user: this.actor(), action: 'ลบข้อมูลทั้งหมดในเครื่อง', collection: '*', recordId: '*' }); });
    await this.chain;
    for (const def of COLLECTIONS) { try { this.legacy?.removeItem(def.key); } catch { /* ignore */ } }
    this.emit(COLLECTIONS.map((c) => c.key));
  }

  // ---------- สำหรับ SyncEngine ----------
  pendingRows(): RecRow[] { return [...this.rec.values()].filter((r) => r.updatedAt > r.pushedAt); }
  pendingCount() { return this.pendingRows().length; }
  getCursor(c: CollectionName) { return this.cursors[c] ?? 0; }

  /** ข้อมูลเต็มของรายการ (ตามค่าปัจจุบันในแคช) */
  recordOf(row: RecRow): StoredRecord {
    if (row.deleted) return { collection: row.collection, id: row.id, updatedAt: row.updatedAt, deleted: true };
    const def = COLLECTIONS.find((c) => c.name === row.collection)!;
    const data = toEntries(def, this.cache.get(def.key)).get(row.id);
    return { collection: row.collection, id: row.id, updatedAt: row.updatedAt, data };
  }

  /** ส่งข้อมูลทั้งหมดขึ้นเซิร์ฟเวอร์ใหม่ (ใช้เมื่อเปลี่ยนโครงสร้างชีต หรือสร้างชีตใหม่) — คืนจำนวนรายการ */
  resetPushed(): number {
    const writes: RecRow[] = [];
    this.rec.forEach((r, pk) => { const n = { ...r, pushedAt: 0 }; this.rec.set(pk, n); writes.push(n); });
    this.persist(() => this.db.rec.bulkPut(writes));
    this.emit([]);
    return writes.length;
  }

  markPushed(rows: { pk: string; updatedAt: number }[]) {
    const writes: RecRow[] = [];
    for (const r of rows) {
      const cur = this.rec.get(r.pk);
      if (cur && cur.pushedAt < r.updatedAt) { const n = { ...cur, pushedAt: r.updatedAt }; this.rec.set(r.pk, n); writes.push(n); }
    }
    if (writes.length) this.persist(() => this.db.rec.bulkPut(writes));
  }

  /** รวมรายการจากเซิร์ฟเวอร์: updatedAt ล่าสุดชนะ (เท่ากัน = ใช้ของเครื่องนี้) — คืนคีย์ที่เปลี่ยน */
  applyRemote(collection: CollectionName, records: StoredRecord[]): string[] {
    const def = COLLECTIONS.find((c) => c.name === collection) as CollectionDef;
    let value = this.cache.get(def.key) ?? (def.kind === 'object' ? {} : []);
    let changed = false, maxT = this.cursors[collection] ?? 0;
    const writes: RecRow[] = [];
    const audits: AuditRow[] = [];
    for (const r of records) {
      maxT = Math.max(maxT, r.updatedAt);
      const pk = pkOf(collection, r.id), local = this.rec.get(pk);
      if (local && local.updatedAt >= r.updatedAt) { if (local.updatedAt === r.updatedAt && local.pushedAt < r.updatedAt) { const n = { ...local, pushedAt: r.updatedAt }; this.rec.set(pk, n); writes.push(n); } continue; }
      let data: any;
      if (!r.deleted) {
        const localData = toEntries(def, value).get(r.id);
        data = restoreLocalIdentifiers(collection, r.data, localData);
      }
      value = applyEntry(def, value, r.id, r.deleted ? undefined : data);
      const row: RecRow = { pk, collection, id: r.id, updatedAt: r.updatedAt, pushedAt: r.updatedAt, deleted: !!r.deleted, fp: r.deleted ? '' : fpOf(data) };
      this.rec.set(pk, row); writes.push(row); changed = true;
      audits.push({ at: Date.now(), user: 'ซิงก์', action: r.deleted ? 'รับการลบจากซิงก์' : 'รับจากซิงก์', collection, recordId: r.id });
    }
    if (changed && def.sort && def.kind === 'array') value = (value as any[]).slice().sort(def.sort);
    this.cursors[collection] = maxT;
    const keys: string[] = [];
    if (changed) { this.cache.set(def.key, value); keys.push(def.key); }
    this.persist(async () => {
      if (changed) await this.db.kv.put({ key: def.key, value });
      if (writes.length) await this.db.rec.bulkPut(writes);
      await this.db.meta.put({ key: 'cursors', value: { ...this.cursors } });
      if (audits.length) await this.db.audit.bulkAdd(audits);
    });
    if (keys.length) this.emit(keys);
    return keys;
  }

  /** ประวัติการแก้ไขล่าสุด (ใหม่สุดก่อน) */
  async auditList(limit = 200): Promise<AuditRow[]> { const all = await this.auditAll(); return all.reverse().slice(0, limit); }
  /** เรียงตามเวลา แล้วตามลำดับที่บันทึก (เหตุการณ์ในมิลลิวินาทีเดียวกันต้องไม่สลับลำดับ) */
  async auditAll(): Promise<AuditRow[]> { await this.chain; return (await this.db.audit.toArray()).sort((a, b) => a.at - b.at || (a.id ?? 0) - (b.id ?? 0)); }

  subscribe(fn: (keys: string[]) => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  private emit(keys: string[]) { this.listeners.forEach((f) => f(keys)); }
  /** รอให้การเขียน IndexedDB ที่ค้างอยู่เสร็จ (ใช้ในทดสอบ) */
  flush() { return this.chain; }
  private persist(fn: () => Promise<unknown>) {
    this.chain = this.chain.then(fn).catch((e) => console.error('[store] เขียน IndexedDB ไม่สำเร็จ', e));
  }
}

function safeLocalStorage(): Storage | null {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; }
}
