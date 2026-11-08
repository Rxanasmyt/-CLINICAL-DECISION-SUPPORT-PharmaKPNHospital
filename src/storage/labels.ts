// คอลัมน์สรุปที่ส่งไป Google Sheets: หัวคอลัมน์และค่าเป็นภาษาไทยที่อ่านรู้เรื่อง (ไม่ใช่รหัสภายในของแอป)
// ห้ามมีข้อมูลระบุตัวผู้ป่วย — ฟังก์ชันรับข้อมูลที่ผ่าน sanitizeForRemote แล้วเท่านั้น
import { WL_FIELDS } from '../data/standards';
import { STD_2570 } from '../data/standards-2570';
import { TRIGGERS, ALTCAUSE } from '../data/adr';
import { latency } from '../logic/causality';

const MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
// รูปแบบ "4 พ.ย. 2569" — ไม่ใช้ dd/mm/yyyy เพราะ Google Sheets แปลงเป็นวันที่เองแล้วค่าเพี้ยน
export function thaiDate(s?: string): string {
  if (!s) return '';
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return String(s);
  return `${Number(m[3])} ${MON[Number(m[2]) - 1]} ${Number(m[1]) + 543}`;
}
export function thaiMonth(s?: string): string {
  const m = String(s || '').match(/^(\d{4})-(\d{2})/);
  return m ? `${MON[Number(m[2]) - 1]} ${Number(m[1]) + 543}` : '';
}
/** ไตรมาสปฏิทิน เช่น 2026-03 → Q1/69 (ตรงกับแนวโน้มรายไตรมาสในแอป) */
export function quarterLabel(month?: string): string {
  const m = String(month || '').match(/^(\d{4})-(\d{2})/);
  return m ? `Q${Math.floor((Number(m[2]) - 1) / 3) + 1}/${String(Number(m[1]) + 543).slice(2)}` : '';
}
/** ปีงบประมาณ (พ.ศ.) ของวันที่ — เริ่ม 1 ต.ค. */
export function fiscalYearBE(iso?: string): string {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})/);
  return m ? String(Number(m[1]) + 543 + (Number(m[2]) >= 10 ? 1 : 0)) : '';
}
/** ยาที่สงสัย + เหตุการณ์แรกที่มีวันเกิดอาการ → ข้อมูลลำดับเวลาสำหรับอ่านในชีต */
function timeline(c: any) {
  const drugs = ((c?.data?.drugs) || []).filter((d: any) => d.suspect && d.name);
  const events = ((c?.data?.events) || []).filter((e: any) => e.desc);
  const ev = events.find((e: any) => e.onset);
  const dr = drugs.find((d: any) => d.start);
  const lat = dr && ev ? latency(dr, ev) : null;
  return {
    dose: drugs.map((d: any) => [d.name, d.dose, d.route].filter(Boolean).join(' ')).join(' ; '),
    start: thaiDate(dr?.start), stop: thaiDate(drugs.find((d: any) => d.stop)?.stop), onset: thaiDate(ev?.onset),
    lat: lat ? lat.txt : '',
    labs: ((c?.data?.labs) || []).filter((l: any) => l.name && String(l.value || '').trim()).map((l: any) => `${l.name} ${l.value}`).join(' ; '),
  };
}
const yn = (b: unknown) => (b ? 'ใช่' : 'ไม่ใช่');
const pick = (map: Record<string, string>, k: unknown, dflt = '—') => (k && map[String(k)]) || dflt;

export const NJ = { definite: 'Definite (ใช่แน่นอน)', probable: 'Probable (น่าจะใช่)', possible: 'Possible (อาจจะใช่)', doubtful: 'Doubtful (น่าสงสัย)' };
export const WHO = { certain: 'Certain (ใช่แน่นอน)', probable: 'Probable / Likely (น่าจะใช่)', possible: 'Possible (อาจจะใช่)', unlikely: 'Unlikely (ไม่น่าจะเกี่ยวข้อง)', cond: 'Conditional (รอข้อมูลเพิ่ม)', unclass: 'Unclassifiable (จำแนกไม่ได้)' };
const PREV = { prev: 'ป้องกันได้', notprev: 'ป้องกันไม่ได้', pending: 'ยังประเมินไม่ครบ' };
const OUT = { recovering: 'กำลังดีขึ้น', recovered: 'หายเป็นปกติ', sequelae: 'หายแต่มีความผิดปกติเหลือ', ongoing: 'ยังมีอาการ', death: 'เสียชีวิต' };
const ME = { yes: 'รายงานแล้ว', no: 'ยังไม่รายงาน', na: 'ไม่เข้าข่าย' };
const HP = { sent: 'ส่งแล้ว', pending: 'รอส่ง', notreq: 'ไม่ต้องส่ง' };
const RCA = { done: 'ทำครบ', missing: 'ยังไม่ครบ', na: 'ไม่เกี่ยวข้อง' };

type Row = Record<string, string | number>;

export const SUMMARIES: Record<string, (data: any, id: string) => Row> = {
  adr_cases: (c) => {
    const s = c?.sum || {}, rep = c?.data?.rep || {}, tl = timeline(c);
    return {
      'วันที่บันทึกเคส': thaiDate(c?.saved), 'ไตรมาส': quarterLabel(s.month), 'เดือนที่เกิดอาการ': thaiMonth(s.month),
      'ยาที่สงสัย': (s.drugs || []).join(' · '), 'ขนาดยา/วิธีให้ (ยาที่สงสัย)': tl.dose || '—', 'วันที่เริ่มยา': tl.start || '—', 'วันที่หยุดยา': tl.stop || '—',
      'อาการที่พบ': (s.events || []).join(' · '), 'วันที่เริ่มมีอาการ': tl.onset || '—', 'ระยะเวลาจากเริ่มยาถึงเกิดอาการ': tl.lat || '—', 'ผลแลปที่บันทึก': tl.labs || '—',
      'ประวัติแพ้ยาเดิม': (c?.data?.pt?.hx || '').trim() || '—',
      'คะแนน Naranjo': s.nj ?? '', 'ระดับ Naranjo': pick(NJ, s.njCat), 'ผลประเมิน WHO-UMC': pick(WHO, s.who),
      'ป้องกันได้หรือไม่ (Schumock)': pick(PREV, s.prev), 'เคสรุนแรง': yn(s.severe), 'แพ้ยาซ้ำ': yn(s.repeat),
      'ชนิดปฏิกิริยา': s.type || '—', 'ผลลัพธ์': pick(OUT, s.outcome),
      'ประเภท ADR': s.adrType ? 'Type ' + s.adrType : '—', 'Serious ADR (ร้ายแรง)': yn(s.serious),
      'Med error (ความคลาดเคลื่อนทางยา)': pick(ME, s.medErr), 'รายงาน HPVC': pick(HP, s.hpvc), 'RCA (วิเคราะห์สาเหตุราก)': pick(RCA, s.rca),
      'เกณฑ์ Serious ที่เข้า': ((c?.data?.sev2?.serious) || []).join(' · ') || '—',
      'เลขที่รายงาน Med error': rep.medErrNo || '—', 'วันที่ส่ง HPVC': thaiDate(rep.hpvcDate) || '—',
      'หมวดสาเหตุ RCA': (rep.rcaCat || []).join(' · ') || '—', 'สาเหตุที่ราก (RCA)': rep.rcaCause || '—', 'แผนป้องกัน': rep.rcaPlan || '—', 'ผู้รับผิดชอบ RCA': rep.rcaOwner || '—',
      'จำนวน Trigger ที่พบ': (s.triggers || []).length, 'Trigger ที่พบ': ((c?.data?.triggers) || []).map((t: string) => (TRIGGERS as any[]).find((x) => x.id === t)?.t ?? t).join(' · ') || '—',
      'สาเหตุอื่นที่เป็นไปได้': ((c?.data?.altCauses) || []).map((t: string) => (ALTCAUSE as any[]).find((x) => x.id === t)?.label ?? t).join(' · ') || '—',
      'อายุ (ปี)': c?.data?.pt?.age || '—', 'เพศ': c?.data?.pt?.sex || '—', 'เภสัชกรผู้ประเมิน': s.pharm || '—',
    };
  },
  cqi_projects: (x) => ({
    'ชื่อโครงการ': x.title ?? '', 'ประเภท': x.type ?? '', 'ปัญหาที่พบ': x.problem ?? '', 'การวัดผล': x.measure ?? '', 'ตัวชี้วัด': x.indicator ?? '',
    'ผลก่อนดำเนินการ': x.before ?? '', 'ผลหลังดำเนินการ': x.after ?? '', 'วันที่เริ่ม': thaiDate(x.start), 'สถานะ': x.status ?? '',
  }),
  intensive_monitoring: (x) => ({
    'HN (เข้ารหัส)': x.hn ?? '', 'ยาที่ติดตาม': x.drug ?? '', 'กลุ่มยา': x.group ?? '', 'วันที่เริ่มติดตาม': thaiDate(x.start),
    'วันนัดติดตามครั้งถัดไป': thaiDate(x.next), 'สถานะ': x.status ?? '', 'หมายเหตุ': x.note ?? '',
  }),
  drug_info_log: (x) => ({
    'วันที่': thaiDate(x.date), 'ผู้รับข้อมูล': x.who ?? '', 'หัวข้อ': x.topic ?? '', 'วิธีให้ข้อมูล': x.how ?? '',
    'ความเข้าใจ (เต็ม 5)': x.und ?? '', 'ความพึงพอใจ (เต็ม 5)': x.sat ?? '',
  }),
  workload_monthly: (x) => {
    const o: Row = { 'เดือน': thaiMonth(x.month) };
    for (const f of WL_FIELDS as any[]) o[`${f.l} (${f.u})`] = x[f.k] ?? '';
    return o;
  },
  ptc_meetings: (d) => ({ 'วันที่ประชุม PTC': thaiDate(String(d)), 'ปีงบประมาณ (พ.ศ.)': fiscalYearBE(String(d)) }),
  std_assessment: (x, id) => {
    const item = STD_2570.flatMap((s) => s.levels.flatMap((L) => L.items.map((i) => ({ ...i, no: s.no, lv: L.lv })))).find((i) => i.id === id);
    return {
      'มาตรฐานข้อ': item ? String(item.no) : id.split('-')[0], 'ระดับ': item ? String(item.lv) : '',
      'เกณฑ์': item?.t ?? '', 'สถานะ': x?.st === 'done' ? 'ดำเนินการแล้ว' : x?.st === 'doing' ? 'กำลังดำเนินการ' : 'ยังไม่ดำเนินการ', 'หมายเหตุ': x?.note ?? '',
    };
  },
};
