// IndexedDB (Dexie) — แทน localStorage (จุ ~5 MB และหายเมื่อล้างเบราว์เซอร์)
import Dexie, { type Table } from 'dexie';
import type { CollectionName } from './types';

export interface KvRow { key: string; value: unknown }
/** metadata การซิงก์ของแต่ละรายการ (ข้อมูลจริงอยู่ใน kv ตามลำดับที่หน้าจอใช้) */
export interface RecRow {
  pk: string;               // `${collection}|${id}`
  collection: CollectionName;
  id: string;
  updatedAt: number;
  /** updatedAt ที่ส่งขึ้นเซิร์ฟเวอร์สำเร็จล่าสุด (0 = ยังไม่เคยส่ง) */
  pushedAt: number;
  deleted: boolean;
  /** ลายนิ้วมือของข้อมูล ณ การแก้ไขล่าสุด ใช้ตรวจว่ามีการแก้จริง */
  fp: string;
}
/** ประวัติการแก้ไข (เก็บเฉพาะในเครื่อง · ไม่มีข้อมูลระบุตัวผู้ป่วย: ใช้รหัสรายการเท่านั้น) */
export interface AuditRow { id?: number; at: number; user: string; action: string; collection: string; recordId: string }
export interface MetaRow { key: string; value: unknown }

export class AppDb extends Dexie {
  kv!: Table<KvRow, string>;
  rec!: Table<RecRow, string>;
  meta!: Table<MetaRow, string>;
  audit!: Table<AuditRow, number>;
  constructor(name = 'pharmakpn') {
    super(name);
    this.version(1).stores({ kv: 'key', rec: 'pk, collection', meta: 'key' });
    this.version(2).stores({ kv: 'key', rec: 'pk, collection', meta: 'key', audit: '++id, at' });
  }
}
