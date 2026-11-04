// แผนผัง: คีย์เดิมใน localStorage ของต้นแบบ → ชุดข้อมูล (ตาราง/แผ่นงาน)
import type { CollectionName } from './types';

type Kind = 'array' | 'object';

export interface CollectionDef {
  name: CollectionName;
  /** คีย์เดิมในต้นแบบ */
  key: string;
  kind: Kind;
  /** id ของรายการ (array) */
  idOf?: (item: any) => string;
  /** คอลัมน์สรุปสำหรับดูใน Sheets (ห้ามมีข้อมูลระบุตัวผู้ป่วย) */
  summary: (data: any, id: string) => Record<string, string | number | boolean>;
  /** เรียงลำดับหลังรวมข้อมูลจากเครื่องอื่น */
  sort?: (a: any, b: any) => number;
}

const join = (x: any) => (Array.isArray(x) ? x.join(', ') : x ?? '');
const idDesc = (a: any, b: any) => Number(b.id) - Number(a.id);

export const COLLECTIONS: CollectionDef[] = [
  { name: 'adr_cases', key: 'adrCases.v1', kind: 'array',
    idOf: (c) => String(c.cid ?? c.id),
    sort: (a, b) => String(b.saved).localeCompare(String(a.saved)),
    summary: (c) => { const s = c.sum || {}; return {
      saved: c.saved ?? '', month: s.month ?? '', drugs: join(s.drugs), events: join(s.events), naranjo: s.nj ?? '', naranjoCat: s.njCat ?? '',
      whoUmc: s.who ?? '', preventability: s.prev ?? '', severe: !!s.severe, repeat: !!s.repeat, type: s.type ?? '', outcome: s.outcome ?? '',
      adrType: s.adrType ?? '', serious: !!s.serious, medError: s.medErr ?? '', hpvc: s.hpvc ?? '', rca: s.rca ?? '',
    }; } },
  { name: 'cqi_projects', key: 'adrCqi.v1', kind: 'array', idOf: (x) => String(x.id), sort: idDesc,
    summary: (x) => ({ title: x.title ?? '', type: x.type ?? '', indicator: x.indicator ?? '', start: x.start ?? '', status: x.status ?? '' }) },
  { name: 'intensive_monitoring', key: 'intensive.v1', kind: 'array', idOf: (x) => String(x.id), sort: idDesc,
    summary: (x) => ({ hn_hash: x.hn ?? '', drug: x.drug ?? '', group: x.group ?? '', start: x.start ?? '', next: x.next ?? '', status: x.status ?? '' }) },
  { name: 'drug_info_log', key: 'infoEval.v1', kind: 'array', idOf: (x) => String(x.id), sort: idDesc,
    summary: (x) => ({ date: x.date ?? '', who: x.who ?? '', topic: x.topic ?? '', how: x.how ?? '', understanding: x.und ?? '', satisfaction: x.sat ?? '' }) },
  { name: 'workload_monthly', key: 'workload.v1', kind: 'array', idOf: (x) => String(x.month),
    summary: (x) => ({ ...x }) },
  { name: 'ptc_meetings', key: 'ptcMeet.v1', kind: 'array', idOf: (x) => String(x),
    summary: (x) => ({ date: String(x) }) },
  { name: 'std_assessment', key: 'stdAssess.v1', kind: 'object',
    summary: (x, id) => ({ item: id, status: x?.st ?? '', note: x?.note ?? '' }) },
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
