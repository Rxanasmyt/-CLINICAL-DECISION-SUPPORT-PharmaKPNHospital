// เติมอัตโนมัติ: ชนิด ADR (Rawlins–Thompson: A/B) · Serious ADR · สถานะรายงาน HPVC · คำแนะนำ Preventability (Schumock & Thornton)
// เป็น "ค่าแนะนำ" ที่เภสัชกรแก้ได้เสมอ — ค่าที่เภสัชกรเลือกเองมีผลเหนือค่าอัตโนมัติ
// กฎทั้งหมดอยู่ในไฟล์นี้ และอยู่ในรายการที่ต้องให้เภสัชกรผู้เชี่ยวชาญตรวจ (docs/CLINICAL-VALIDATION.md)

/** ชนิดปฏิกิริยา → ประเภท ADR: Type A = ผลเกี่ยวกับฤทธิ์ยา · Type B / Gell & Coombs I–IV = ภูมิคุ้มกัน/idiosyncratic */
export function suggestAdrType(reactionType: string | undefined): { type: 'A' | 'B' | ''; why: string } {
  const t = String(reactionType || '');
  if (/^Type A\b/.test(t)) return { type: 'A', why: 'ชนิดปฏิกิริยา = Type A' };
  if (/^Type (B|I|II|III|IV)\b/.test(t)) return { type: 'B', why: 'ชนิดปฏิกิริยา = ' + t.split(' ')[0] + ' ' + t.split(' ')[1] };
  return { type: '', why: '' };
}

export interface SeriousSuggestion { item: string; why: string }
/** เกณฑ์ serious ที่แนะนำจากผลลัพธ์และเกณฑ์ SJS/TEN, DRESS, anaphylaxis ที่ครบในฟอร์ม */
export function suggestSerious(input: { outcome?: string; crit?: { sjs?: boolean; dress?: boolean; ana?: boolean } }): SeriousSuggestion[] {
  const out: SeriousSuggestion[] = [];
  if (input.outcome === 'death') out.push({ item: 'เสียชีวิต', why: 'ผลลัพธ์ = เสียชีวิต' });
  const c = input.crit || {};
  const names = [c.sjs && 'SJS/TEN', c.dress && 'DRESS', c.ana && 'anaphylaxis'].filter(Boolean) as string[];
  if (names.length) out.push({ item: 'อันตรายถึงชีวิต', why: 'เข้าเกณฑ์ ' + names.join(', ') });
  return out;
}

export interface Sev2Manual { type?: string; typeOff?: boolean; serious?: string[]; removed?: string[] }
export interface Sev2Effective { type: 'A' | 'B' | ''; typeAuto: boolean; typeWhy: string; serious: string[]; seriousAuto: Record<string, string> }

/** ค่าที่ใช้จริง = ที่เภสัชกรเลือกเอง ถ้าไม่ได้เลือกใช้ค่าอัตโนมัติ (sev2.serious เก่า = เลือกเองทั้งหมด) */
export function effectiveSev2(sev2: Sev2Manual | undefined, reactionType: string | undefined, sug: SeriousSuggestion[]): Sev2Effective {
  const m = sev2 || {};
  const at = suggestAdrType(reactionType);
  const manualType = m.type === 'A' || m.type === 'B' ? m.type : '';
  const type = manualType || (m.typeOff ? '' : at.type);
  const removed = new Set(m.removed || []);
  const auto = sug.filter((s) => !removed.has(s.item));
  const serious = Array.from(new Set([...auto.map((s) => s.item), ...(m.serious || [])]));
  return {
    type: type as 'A' | 'B' | '', typeAuto: !manualType && !m.typeOff && !!at.type, typeWhy: at.why,
    serious, seriousAuto: Object.fromEntries(auto.filter((s) => !(m.serious || []).includes(s.item)).map((s) => [s.item, s.why])),
  };
}

/** ต้องรายงาน HPVC ตามข้อ 9-3.1: ADR type B และ serious ADR */
export const needsHpvc = (e: { type: string; serious: string[] }) => e.type === 'B' || e.serious.length > 0;
/** สถานะ HPVC: ที่เลือกเองมีผลเหนือ · ไม่ได้เลือกและเข้าเกณฑ์ต้องรายงาน = "รอส่ง" อัตโนมัติ */
export function effectiveHpvc(manual: string | undefined, e: { type: string; serious: string[] }): { value: string; auto: boolean } {
  if (manual) return { value: manual, auto: false };
  return needsHpvc(e) ? { value: 'pending', auto: true } : { value: '', auto: false };
}

// ---------- คำแนะนำ Preventability ----------
/** ยาที่ต้องติดตามผลแลป/ระดับยาในเลือด (ข้อ 3 และ 6) — ชื่อยา (regex) → สิ่งที่ต้องติดตาม และชื่อแลปที่ถือว่าตรวจแล้ว */
export const MONITOR_RULES: { re: RegExp; what: string; lab: RegExp }[] = [
  { re: /warfarin|วาร์ฟาริน/i, what: 'INR', lab: /inr|pt\b/i },
  { re: /phenytoin|เฟนิโทอิน|carbamazepine|คาร์บามาเซปีน|valpro|วัลโปร|lithium|ลิเทียม|digoxin|ดิจอกซิน|theophylline|ธีโอฟิลลีน/i, what: 'ระดับยาในเลือด', lab: /level|ระดับยา|trough|peak|conc|inr/i },
  { re: /vancomycin|แวนโคมัยซิน|gentamicin|เจนตามัยซิน|amikacin|อะมิคาซิน/i, what: 'ระดับยาในเลือด/การทำงานของไต', lab: /level|ระดับยา|trough|peak|conc|scr|creat|egfr/i },
];
const LEVEL_LAB = /level|ระดับยา|trough|peak|conc/i;

export interface HintForm { drugs: any[]; labs: any[] }
/** คำแนะนำรายข้อ (เลขข้อ → ข้อความ) — ไม่ตอบแทนเภสัชกร ข้อ 1, 2, 4(มีเติมอัตโนมัติอยู่แล้ว), 7 ต้องใช้ดุลยพินิจ */
export function prevHints(f: HintForm): Record<number, string> {
  const out: Record<number, string> = {};
  const sus = (f.drugs || []).filter((d) => d.suspect && d.name);
  const labs = (f.labs || []).filter((l) => l.name && String(l.value || '').trim());
  // ข้อ 3: ยาที่ต้องติดตาม แต่ไม่พบผลตรวจที่เกี่ยวข้องในเคส
  const miss = sus.flatMap((d) => MONITOR_RULES.filter((r) => r.re.test(d.name)).map((r) => ({ d: d.name, r })))
    .filter(({ r }) => !labs.some((l) => r.lab.test(l.name)));
  if (miss.length) out[3] = `${miss.map((m) => `${m.d} ควรติดตาม ${m.r.what}`).join('; ')} — ไม่พบผลตรวจในเคส โปรดตรวจว่าเคยตรวจก่อนเกิดอาการหรือไม่`;
  // ข้อ 5: มียาใช้ร่วมหลายรายการ
  const named = (f.drugs || []).filter((d) => d.name && String(d.name).trim());
  if (named.length >= 2) out[5] = `มียา ${named.length} รายการในเคส โปรดตรวจปฏิกิริยาระหว่างยาก่อนตอบ`;
  // ข้อ 6: มีผลระดับยาในเลือด / INR สูง
  const lv = labs.filter((l) => LEVEL_LAB.test(l.name));
  const inrHigh = sus.some((d) => /warfarin|วาร์ฟาริน/i.test(d.name)) ? labs.filter((l) => /inr/i.test(l.name) && parseFloat(l.value) > 4) : [];
  const parts = [...lv.map((l) => `${l.name} = ${l.value}`), ...inrHigh.map((l) => `${l.name} = ${l.value} (สูงกว่า 4)`)];
  if (parts.length) out[6] = `มีผลตรวจ ${parts.join(', ')} โปรดเทียบกับช่วงที่เป็นพิษ`;
  return out;
}
