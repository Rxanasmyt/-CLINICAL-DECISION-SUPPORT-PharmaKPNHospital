// Google Sheets + Apps Script Web App (ระยะที่ 1) — แต่ละชุดข้อมูลเป็นหนึ่งแผ่นงาน แถวละหนึ่งรายการ
// ส่งแบบ POST Content-Type: text/plain เพื่อเลี่ยง CORS preflight · ตรวจ token ทุกคำขอ
import { BY_NAME } from './collections';
import { sanitizeForRemote } from './pdpa';
import type { CollectionName, StorageAdapter, StoredRecord } from './types';

export interface SheetsConfig { url: string; token: string; salt: string }

/** ขีดจำกัดของ Google Sheets คือ 50,000 ตัวอักษรต่อเซลล์ — เผื่อไว้ */
export const MAX_PAYLOAD_CHARS = 45_000;

export class SheetsAdapter implements StorageAdapter {
  constructor(private cfg: SheetsConfig, private fetchImpl: typeof fetch = (input, init) => fetch(input, init)) {}

  private async call(body: Record<string, unknown>): Promise<any> {
    if (!this.cfg.url) throw new Error('ยังไม่ได้ตั้งค่า URL ของ Apps Script');
    if (!this.cfg.token) throw new Error('ยังไม่ได้ตั้งค่า token');
    const res = await this.fetchImpl(this.cfg.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ token: this.cfg.token, ...body }),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('เซิร์ฟเวอร์ตอบ HTTP ' + res.status);
    let json: any;
    try { json = await res.json(); } catch { throw new Error('เซิร์ฟเวอร์ตอบกลับในรูปแบบที่ไม่ถูกต้อง (ตรวจ URL ว่าเป็น Web App ที่ deploy แล้ว)'); }
    if (!json || json.ok !== true) throw new Error(json?.error || 'เซิร์ฟเวอร์ปฏิเสธคำขอ');
    return json;
  }

  /** เลขเวอร์ชันโค้ด Apps Script ที่ตอบกลับล่าสุด (โค้ดเก่าไม่ส่งเลข = 0) */
  scriptVersion: number | null = null;
  async sync() { const j = await this.call({ action: 'ping' }); this.scriptVersion = Number(j.version) || 0; }

  /** สั่งให้ Apps Script จัดแท็บและรูปแบบใหม่ทั้งหมด — คืนรายชื่อแท็บ */
  async setup(): Promise<string[]> {
    try { return (await this.call({ action: 'setup' })).tabs || []; }
    catch (e: any) {
      if (/ไม่รู้จัก/.test(String(e?.message))) throw new Error('โค้ด Apps Script ยังเป็นเวอร์ชันเก่า ไม่มีคำสั่งนี้ — วางโค้ดใหม่ทั้งไฟล์และ Deploy เวอร์ชันใหม่ก่อน');
      throw e;
    }
  }

  async list(collection: CollectionName, since = 0): Promise<StoredRecord[]> {
    const j = await this.call({ action: 'pull', collection, since });
    return (j.records || []).map((r: any) => ({ collection, id: String(r.id), updatedAt: Number(r.updatedAt), deleted: !!r.deleted, data: r.data }));
  }

  async get(collection: CollectionName, id: string) {
    const j = await this.call({ action: 'get', collection, id });
    const r = j.record;
    return r ? { collection, id: String(r.id), updatedAt: Number(r.updatedAt), deleted: !!r.deleted, data: r.data } as StoredRecord : undefined;
  }

  async put(records: StoredRecord[]) {
    if (!records.length) return;
    const out: any[] = [];
    const tooBig: string[] = [];
    const ok: StoredRecord[] = [];
    for (const r of records) {
      let data: any, summary: Record<string, unknown> = {};
      if (!r.deleted) {
        if ((r.collection === 'adr_cases' || r.collection === 'intensive_monitoring') && !this.cfg.salt) {
          throw new Error('ยังไม่ได้ตั้งค่า salt สำหรับ hash HN — ไม่ส่งข้อมูลขึ้น Sheets');
        }
        data = await sanitizeForRemote(r.collection, r.id, r.data, this.cfg.salt);
        summary = BY_NAME[r.collection].summary(data, r.id);
        if (JSON.stringify(data).length > MAX_PAYLOAD_CHARS) { tooBig.push(`${r.collection}/${r.id}`); continue; }
      }
      out.push({ id: r.id, updatedAt: r.updatedAt, deleted: !!r.deleted, summary, data });
      ok.push(r);
    }
    // แบ่งชุดตามชุดข้อมูล ครั้งละไม่เกิน 100 รายการ
    const byCol = new Map<string, any[]>();
    ok.forEach((r, i) => { const a = byCol.get(r.collection) ?? []; a.push(out[i]); byCol.set(r.collection, a); });
    for (const [collection, rows] of byCol) for (let i = 0; i < rows.length; i += 100) await this.call({ action: 'push', collection, records: rows.slice(i, i + 100) });
    // รายการที่ใหญ่เกินส่งไม่ได้ แต่ไม่ให้ขวางรายการอื่น — แจ้งผู้ใช้ให้ตัดข้อความ
    if (tooBig.length) throw new Error(`รายการ ${tooBig.join(', ')} ใหญ่เกินที่ Google Sheets เก็บได้ในเซลล์เดียว (50,000 ตัวอักษร) — ตัดข้อความยาวๆ ในรายการนั้นออก แล้วซิงก์ใหม่ (รายการอื่นส่งแล้ว)`);
  }

  async delete(collection: CollectionName, id: string, updatedAt: number) {
    await this.put([{ collection, id, updatedAt, deleted: true }]);
  }
}
