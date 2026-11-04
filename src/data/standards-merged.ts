// ข้อความของแต่ละข้อใช้ตามเอกสารต้นฉบับ (STD_2570) — ต้นแบบย่อ/ปรับถ้อยคำไว้บางข้อ (3-1, 9-3.4, 9-3.5, 9-3.6, 9-4.1, 9-4.2)
// STD ของต้นแบบ (ระดับ 1 ถึงเป้าหมาย + next) เติมข้อของระดับที่เหลือจาก STD_2570 ให้ครบทุกระดับ (ข้อ 3 และข้อ 9)
// รายการที่ต้นแบบไม่มี จะอยู่ใน `next` (ระดับถัดไป · พัฒนาต่อในอนาคต)
import { STD as PROTO } from './standards';
import { STD_2570 } from './standards-2570';

const NEW_APP = 'ยังไม่มีเครื่องมือในแอป — เก็บเอกสารหลักฐานและบันทึกหมายเหตุเอง (พัฒนาต่อในอนาคต)';

export const STD: any[] = (PROTO as any[]).map((sd0) => {
  let sd = sd0;
  const full = STD_2570.find((s) => s.no === sd.no)!;
  const official = new Map(full.levels.flatMap((L) => L.items).map((i) => [i.id, i.t]));
  const useDoc = (it: any) => ({ ...it, t: official.get(it.id) ?? it.t });
  sd = { ...sd, levels: sd.levels.map((L: any) => ({ ...L, items: L.items.map(useDoc) })), next: (sd.next || []).map(useDoc) };
  const have = new Set<string>([...sd.levels.flatMap((L: any) => L.items.map((i: any) => i.id)), ...(sd.next || []).map((n: any) => n.id)]);
  const added = full.levels.flatMap((L) => L.items).filter((i) => !have.has(i.id)).map((i) => ({ id: i.id, t: i.t, app: NEW_APP }));
  return { ...sd, next: [...(sd.next || []), ...added] };
});
