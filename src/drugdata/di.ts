// เครื่องตรวจอันตรกิริยา (DI) จากข้อมูลฉลากยา FDA ที่ดึงไว้ล่วงหน้า (tools/drugdata) — ไม่มีเนื้อหาคลินิกในโค้ดนี้
// ข้อความและระดับมาจากข้อมูลที่สร้างไว้ ระดับจัดอัตโนมัติจากถ้อยคำในฉลาก ไม่ใช่ระดับจากฐานข้อมูล DI
export type Sev = 'contraindicated' | 'avoid' | 'monitor' | 'info';
export const SEV_RANK: Record<Sev, number> = { contraindicated: 3, avoid: 2, monitor: 1, info: 0 };
export const SEV_LABEL: Record<Sev, string> = {
  contraindicated: 'ห้ามใช้ร่วมกัน (ตามถ้อยคำในฉลาก)', avoid: 'หลีกเลี่ยงการใช้ร่วมกัน', monitor: 'ใช้ร่วมได้โดยเฝ้าระวัง/ปรับขนาด', info: 'มีการกล่าวถึงในฉลาก (ข้อมูลทั่วไป)',
};
export interface Hit { s: Sev; sec: string; t: string; setid: string }
export interface Shard { ingredient: string; hasLabel: boolean; partners: Record<string, Hit[]>; classes: Record<string, Hit[]> }
export interface PairSide { from: string; about: string; via: string; hits: Hit[] }
export interface PairResult { a: string; b: string; sev: Sev; sides: PairSide[] }

const maxSev = (hs: Hit[]): Sev => hs.reduce<Sev>((m, h) => (SEV_RANK[h.s] > SEV_RANK[m] ? h.s : m), 'info');

/** ตรวจทุกคู่ของสารออกฤทธิ์ที่เลือก: ใช้ทั้งฉลากของ A ที่กล่าวถึง B และฉลากของ B ที่กล่าวถึง A (รวมการกล่าวถึงเป็นกลุ่มยา) */
export function checkPairs(ings: string[], shards: Record<string, Shard | undefined>, membership: Record<string, string[]>, classLabel: (k: string) => string = (k) => k): PairResult[] {
  const out: PairResult[] = []; const uniq = Array.from(new Set(ings));
  for (let i = 0; i < uniq.length; i++) for (let j = i + 1; j < uniq.length; j++) {
    const a = uniq[i], b = uniq[j]; const sides: PairSide[] = [];
    for (const [x, y] of [[a, b], [b, a]] as const) {
      const sh = shards[x]; if (!sh) continue;
      const direct = sh.partners[y]; if (direct?.length) sides.push({ from: x, about: y, via: y, hits: direct });
      for (const ck of membership[y] || []) { const h = sh.classes[ck]; if (h?.length) sides.push({ from: x, about: y, via: classLabel(ck), hits: h }); }
    }
    if (!sides.length) continue;
    out.push({ a, b, sev: maxSev(sides.flatMap((s) => s.hits)), sides });
  }
  return out.sort((p, q) => SEV_RANK[q.sev] - SEV_RANK[p.sev] || p.a.localeCompare(q.a));
}
