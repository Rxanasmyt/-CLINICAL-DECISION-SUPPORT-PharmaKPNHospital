// โหลดข้อมูลยาที่สร้างไว้ล่วงหน้า (public/drugdata) แบบ lazy และแคชในหน่วยความจำ
import type { Shard } from './di';

export interface Ingredient { name: string; slug: string; hasLabel: boolean }
export interface DrugItem { no: number; name: string; form: string; unit: string; had: boolean; notInFormulary: boolean; route: string; status: string; why: string; ingredients: Ingredient[] }
export interface DrugIndex { source: string; items: DrugItem[]; membership: Record<string, string[]> }
export interface LabelSection { t: string; trunc?: boolean }
export interface MonoLabel { route: string; setid: string; effective: string; brands: string[]; manufacturer: string; sections: Record<string, LabelSection> }
export interface Monograph { ingredient: string; rxcui: string; classes: string[]; labels: MonoLabel[] }

const cache = new Map<string, Promise<any>>();
function get<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    const url = new URL('drugdata/' + path, typeof document !== 'undefined' ? document.baseURI : 'http://localhost/').toString();
    cache.set(path, fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).catch((e) => { cache.delete(path); throw e; }));
  }
  return cache.get(path)!;
}
export const loadIndex = () => get<DrugIndex>('index.json');
export const loadMonograph = (slug: string) => get<Monograph>('monographs/' + slug + '.json');
export const loadShard = (slug: string) => get<Shard>('di/' + slug + '.json');

export const dailyMedUrl = (setid: string) => 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=' + encodeURIComponent(setid);
export const effectiveTh = (e: string) => (/^\d{8}$/.test(e) ? `${e.slice(6, 8)}/${e.slice(4, 6)}/${+e.slice(0, 4) + 543}` : e || '—');

export const SECTION_TH: [string, string][] = [
  ['boxed_warning', 'คำเตือนกรอบดำ (Boxed warning)'], ['indications_and_usage', 'ข้อบ่งใช้'], ['dosage_and_administration', 'ขนาดและการให้ยา'], ['contraindications', 'ข้อห้ามใช้'],
  ['warnings_and_cautions', 'คำเตือนและข้อควรระวัง'], ['warnings', 'คำเตือนและข้อควรระวัง'], ['drug_interactions', 'อันตรกิริยา'], ['adverse_reactions', 'อาการไม่พึงประสงค์'],
  ['use_in_specific_populations', 'ประชากรกลุ่มพิเศษ'], ['pregnancy', 'การตั้งครรภ์'], ['lactation', 'ให้นมบุตร'], ['pediatric_use', 'เด็ก'], ['geriatric_use', 'ผู้สูงอายุ'],
  ['renal_impairment', 'ไตบกพร่อง'], ['hepatic_impairment', 'ตับบกพร่อง'], ['overdosage', 'การใช้เกินขนาด'], ['mechanism_of_action', 'กลไกการออกฤทธิ์'],
];
export const ROUTE_TH: Record<string, string> = { oral: 'ชนิดรับประทาน', inj: 'ชนิดฉีด', inh: 'ชนิดสูดพ่น/พ่นจมูก', eye: 'ยาหยอดตา/ป้ายตา', top: 'ยาใช้ภายนอก/เหน็บ/อื่น ๆ' };
export const CLASS_TH: Record<string, string> = {
  nsaid: 'กลุ่ม NSAIDs', acei: 'กลุ่ม ACE inhibitors', arb: 'กลุ่ม ARBs', bb: 'กลุ่ม beta-blockers', ccb: 'กลุ่ม calcium channel blockers', kspare: 'ยาขับปัสสาวะที่เก็บโพแทสเซียม', thiazide: 'กลุ่ม thiazide',
  loop: 'ยาขับปัสสาวะ loop', anticoag: 'ยาต้านการแข็งตัวของเลือด', antiplt: 'ยาต้านเกล็ดเลือด', ssri: 'กลุ่ม SSRIs', maoi: 'กลุ่ม MAOIs', tca: 'กลุ่ม tricyclic antidepressants', bzd: 'กลุ่ม benzodiazepines',
  opioid: 'กลุ่ม opioids', statin: 'กลุ่ม statins', sulfonylurea: 'กลุ่ม sulfonylureas', cortico: 'กลุ่ม corticosteroids', antacid: 'ยาลดกรด/ยาที่มี Al-Mg', cyp3a4_inh: 'CYP3A4 inhibitors', cyp3a4_ind: 'CYP3A4 inducers',
  cyp2d6_inh: 'CYP2D6 inhibitors', cyp2c9_inh: 'CYP2C9 inhibitors', cyp2c19_inh: 'CYP2C19 inhibitors', pgp_inh: 'P-gp inhibitors', qt: 'ยาที่ยืดช่วง QT', anticonv: 'ยากันชัก', cns_dep: 'ยากดระบบประสาทส่วนกลาง',
};
