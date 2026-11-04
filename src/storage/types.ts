// ชั้นเก็บข้อมูล: interface เดียว (StorageAdapter) เพื่อสลับ Google Sheets → ฐานข้อมูลในเครือข่าย รพ. โดยไม่แก้หน้าจอ

export type CollectionName =
  | 'adr_cases' | 'cqi_projects' | 'intensive_monitoring' | 'drug_info_log'
  | 'workload_monthly' | 'ptc_meetings' | 'std_assessment';

/** หนึ่งรายการ (แถวละหนึ่งรายการใน Sheets / หนึ่งแถวในตาราง DB) */
export interface StoredRecord {
  collection: CollectionName;
  id: string;
  /** เวลาแก้ไขล่าสุด (ms) — ใช้ตัดสิน "ล่าสุดชนะ" */
  updatedAt: number;
  /** ลบแล้ว (tombstone) */
  deleted?: boolean;
  /** ข้อมูลเต็มของรายการ (JSON) — ว่างเมื่อ deleted */
  data?: unknown;
}

export interface StorageAdapter {
  /** รายการทั้งหมดในชุดข้อมูล (since = เอาเฉพาะที่แก้หลังเวลานี้) */
  list(collection: CollectionName, since?: number): Promise<StoredRecord[]>;
  get(collection: CollectionName, id: string): Promise<StoredRecord | undefined>;
  /** เขียน/แทนที่หลายรายการ */
  put(records: StoredRecord[]): Promise<void>;
  /** ลบ (เขียน tombstone) */
  delete(collection: CollectionName, id: string, updatedAt: number): Promise<void>;
  /** เปิดการเชื่อมต่อ/ตรวจสอบสิทธิ์ — โยน error ถ้าใช้งานไม่ได้ */
  sync(): Promise<void>;
}

export interface SyncSettings {
  enabled: boolean;
  /** ยืนยันว่าได้รับอนุมัติจากผู้รับผิดชอบ PDPA / IT ของ รพ. แล้ว (ไม่ติ๊ก = ไม่ซิงก์) */
  approved: boolean;
  /** URL ของ Apps Script Web App */
  url: string;
  /** token ที่ตั้งไว้ใน Apps Script (ตรวจทุกคำขอ) */
  token: string;
  /** salt ของ รพ. สำหรับ hash HN (SHA-256) */
  salt: string;
}

export type SyncState =
  | { kind: 'off' }                       // ยังไม่ตั้งค่า
  | { kind: 'offline'; pending: number }
  | { kind: 'syncing'; pending: number }
  | { kind: 'pending'; pending: number }
  | { kind: 'synced'; at: number }
  | { kind: 'error'; message: string; pending: number };
