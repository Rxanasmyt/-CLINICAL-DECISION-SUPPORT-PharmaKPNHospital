// ไฟล์สำรอง JSON  { app?, kind:'adr-registry', v:2, exported?, cases, cqi, info, intensive, ptc, workload, std }
// รูปแบบเดียวกับ backupJson() ของต้นแบบ — นำเข้าไฟล์จากต้นแบบได้ครบทุกชุด
import type { Store } from './store';

export const BACKUP_KEYS = { cases: 'adrCases.v1', cqi: 'adrCqi.v1', info: 'infoEval.v1', intensive: 'intensive.v1', ptc: 'ptcMeet.v1', workload: 'workload.v1', std: 'stdAssess.v1' } as const;

export function buildBackup(store: Store) {
  return {
    app: 'PharmaKPNHospital', kind: 'adr-registry', v: 2, exported: new Date().toISOString(),
    cases: store.getJson<any[]>('adrCases.v1', []), cqi: store.getJson<any[]>('adrCqi.v1', []),
    info: store.getJson<any[]>('infoEval.v1', []), intensive: store.getJson<any[]>('intensive.v1', []),
    ptc: store.getJson<any[]>('ptcMeet.v1', []), workload: store.getJson<any[]>('workload.v1', []),
    std: store.getJson<Record<string, any>>('stdAssess.v1', {}),
  };
}

export class BackupFormatError extends Error {}

export interface ImportResult { cases: number; cqi: number; info: number; intensive: number; ptc: number; workload: number; std: number }

/** รวมข้อมูลจากไฟล์สำรองเข้ากับข้อมูลในเครื่อง (ข้ามรายการที่ซ้ำ ไม่ทับของเดิม) */
export function importBackup(store: Store, d: any): ImportResult {
  if (!d || d.kind !== 'adr-registry' || !Array.isArray(d.cases)) throw new BackupFormatError('bad');
  const res: ImportResult = { cases: 0, cqi: 0, info: 0, intensive: 0, ptc: 0, workload: 0, std: 0 };
  // ไฟล์ที่รูปแบบผิดบางส่วน (null, ค่าที่ไม่ใช่ออบเจ็กต์, ชุดที่ไม่ใช่อาร์เรย์) — ตัดรายการเสียทิ้งก่อนเริ่ม เพื่อไม่ให้นำเข้าได้ครึ่งเดียวแล้ว error กลางทาง
  const objs = (a: any): any[] => (Array.isArray(a) ? a.filter((x) => x != null && typeof x === 'object' && !Array.isArray(x)) : []);
  d = { ...d, cases: objs(d.cases), cqi: objs(d.cqi), info: objs(d.info), intensive: objs(d.intensive), workload: objs(d.workload), ptc: Array.isArray(d.ptc) ? d.ptc.filter((x: any) => typeof x === 'string') : [] };

  const cur = store.getJson<any[]>('adrCases.v1', []).slice();
  const ids = new Set(cur.map((c) => c.id + '|' + c.label));
  d.cases.forEach((c: any) => { const k = c.id + '|' + c.label; if (!ids.has(k)) { cur.push(c); ids.add(k); res.cases++; } });
  cur.sort((a, b) => String(b.saved).localeCompare(String(a.saved)));
  store.setJson('adrCases.v1', cur.slice(0, 3000));

  const cq = store.getJson<any[]>('adrCqi.v1', []).slice();
  const cids = new Set(cq.map((x) => x.id));
  (d.cqi || []).forEach((x: any) => { if (!cids.has(x.id)) { cq.push(x); res.cqi++; } });
  store.setJson('adrCqi.v1', cq);

  const mergeList = (key: string, arr: any, idf: (x: any) => any) => {
    if (!Array.isArray(arr)) return 0;
    const cur2 = store.getJson<any[]>(key, []).slice();
    const seen = new Set(cur2.map(idf));
    let n = 0;
    arr.forEach((x) => { if (!seen.has(idf(x))) { cur2.push(x); seen.add(idf(x)); n++; } });
    store.setJson(key, cur2);
    return n;
  };
  res.info = mergeList('infoEval.v1', d.info, (x) => x.id);
  res.intensive = mergeList('intensive.v1', d.intensive, (x) => x.id);
  res.ptc = mergeList('ptcMeet.v1', d.ptc, (x) => x);

  if (Array.isArray(d.workload)) {
    const wl = store.getJson<any[]>('workload.v1', []).slice();
    d.workload.forEach((x: any) => { const i = wl.findIndex((y) => y.month === x.month); if (i < 0) { wl.push(x); res.workload++; } else wl[i] = Object.assign({}, x, wl[i]); });
    store.setJson('workload.v1', wl);
  }

  // ต้นแบบส่งออกชุด std แต่ไม่นำเข้า — ที่นี่นำเข้าด้วย (เติมเฉพาะข้อที่ยังไม่มี ไม่ทับของเดิม)
  if (d.std && typeof d.std === 'object' && !Array.isArray(d.std)) {
    const cs = { ...store.getJson<Record<string, any>>('stdAssess.v1', {}) };
    Object.entries(d.std).forEach(([k, v]) => { if (!(k in cs)) { cs[k] = v; res.std++; } });
    store.setJson('stdAssess.v1', cs);
  }
  return res;
}
