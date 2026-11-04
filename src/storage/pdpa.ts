// PDPA: ข้อมูลสุขภาพเป็นข้อมูลอ่อนไหว
//  - ห้ามส่งชื่อผู้ป่วยขึ้น Google Sheets (ส่งเฉพาะรหัสเคส)
//  - HN ส่งเฉพาะค่าที่ผ่าน hash (SHA-256 + salt ของ รพ.)
import type { CollectionName } from './types';

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** hash ของ HN: SHA-256(salt + ":" + HN ที่ตัดช่องว่าง) — HN ว่างให้ผลว่าง */
export async function hashHn(hn: string, salt: string): Promise<string> {
  const v = String(hn ?? '').trim();
  if (!v) return '';
  if (v.startsWith('sha256:')) return v;   // hash แล้ว (เคสที่รับมาจากเครื่องอื่น) — ไม่ hash ซ้ำ
  return 'sha256:' + (await sha256Hex(salt + ':' + v));
}

/** สำเนาที่ปลอดภัยสำหรับส่งออกนอกเครื่อง */
export async function sanitizeForRemote(collection: CollectionName, id: string, data: any, salt: string): Promise<any> {
  if (data == null) return data;
  if (collection === 'adr_cases') {
    const pt = (data.data && data.data.pt) || {};
    return {
      ...data,
      label: 'เคส ' + id,                                   // label ปกติมีชื่อผู้ป่วย
      data: data.data ? { ...data.data, pt: { ...pt, name: '', hn: await hashHn(pt.hn, salt) } } : data.data,
    };
  }
  if (collection === 'intensive_monitoring') return { ...data, hn: await hashHn(data.hn, salt) };
  return data;
}

/** เมื่อรับรายการจากเครื่องอื่นมาแทนที่ของเดิม ให้คงข้อมูลระบุตัวผู้ป่วยที่เก็บในเครื่องนี้ไว้ */
export function restoreLocalIdentifiers(collection: CollectionName, remote: any, local: any): any {
  if (!local || remote == null) return remote;
  if (collection === 'adr_cases') {
    return {
      ...remote,
      label: local.label ?? remote.label,
      data: remote.data ? { ...remote.data, pt: { ...(remote.data.pt || {}), name: local.data?.pt?.name ?? '', hn: local.data?.pt?.hn ?? remote.data.pt?.hn } } : remote.data,
    };
  }
  if (collection === 'intensive_monitoring') return { ...remote, hn: local.hn ?? remote.hn };
  return remote;
}
