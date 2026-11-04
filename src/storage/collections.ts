// แผนผัง: คีย์เดิมใน localStorage ของต้นแบบ → ชุดข้อมูล (ตาราง/แผ่นงาน)
import type { CollectionName } from './types';
import { SUMMARIES } from './labels';

type Kind = 'array' | 'object';

export interface CollectionDef {
  name: CollectionName;
  /** คีย์เดิมในต้นแบบ */
  key: string;
  kind: Kind;
  /** id ของรายการ (array) */
  idOf?: (item: any) => string;
  /** คอลัมน์สรุปสำหรับดูใน Sheets (ห้ามมีข้อมูลระบุตัวผู้ป่วย) */
  summary: (data: any, id: string) => Record<string, string | number>;
  /** เรียงลำดับหลังรวมข้อมูลจากเครื่องอื่น */
  sort?: (a: any, b: any) => number;
}

const idDesc = (a: any, b: any) => Number(b.id) - Number(a.id);

export const COLLECTIONS: CollectionDef[] = [
  { name: 'adr_cases', key: 'adrCases.v1', kind: 'array', idOf: (c) => String(c.cid ?? c.id),
    sort: (a, b) => String(b.saved).localeCompare(String(a.saved)), summary: SUMMARIES.adr_cases },
  { name: 'cqi_projects', key: 'adrCqi.v1', kind: 'array', idOf: (x) => String(x.id), sort: idDesc, summary: SUMMARIES.cqi_projects },
  { name: 'intensive_monitoring', key: 'intensive.v1', kind: 'array', idOf: (x) => String(x.id), sort: idDesc, summary: SUMMARIES.intensive_monitoring },
  { name: 'drug_info_log', key: 'infoEval.v1', kind: 'array', idOf: (x) => String(x.id), sort: idDesc, summary: SUMMARIES.drug_info_log },
  { name: 'workload_monthly', key: 'workload.v1', kind: 'array', idOf: (x) => String(x.month), summary: SUMMARIES.workload_monthly },
  { name: 'ptc_meetings', key: 'ptcMeet.v1', kind: 'array', idOf: (x) => String(x), summary: SUMMARIES.ptc_meetings },
  { name: 'std_assessment', key: 'stdAssess.v1', kind: 'object', summary: SUMMARIES.std_assessment },
];

export const BY_KEY: Record<string, CollectionDef> = Object.fromEntries(COLLECTIONS.map((c) => [c.key, c]));
export const BY_NAME: Record<string, CollectionDef> = Object.fromEntries(COLLECTIONS.map((c) => [c.name, c]));

/** แยกค่าของคีย์เดิมเป็น id → data */
export function toEntries(def: CollectionDef, value: any): Map<string, any> {
  const m = new Map<string, any>();
  if (def.kind === 'object') {
    for (const [k, v] of Object.entries(value || {})) m.set(k, v);
  } else {
    for (const it of Array.isArray(value) ? value : []) m.set(def.idOf!(it), it);
  }
  return m;
}

/** ใส่ (data) หรือลบ (data === undefined) รายการหนึ่งในค่าของคีย์เดิม */
export function applyEntry(def: CollectionDef, value: any, id: string, data: any | undefined): any {
  if (def.kind === 'object') {
    const o = { ...(value || {}) };
    if (data === undefined) delete o[id]; else o[id] = data;
    return o;
  }
  const list: any[] = Array.isArray(value) ? value.slice() : [];
  const i = list.findIndex((x) => def.idOf!(x) === id);
  if (data === undefined) { if (i >= 0) list.splice(i, 1); }
  else if (i >= 0) list[i] = data; else list.push(data);
  return list;
}
