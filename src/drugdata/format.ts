// จัดรูปข้อความฉลากยาให้อ่านง่าย: ตัดเป็นประโยค/หัวข้อย่อย และเน้นตัวเลขขนาดยา — ไม่เปลี่ยนถ้อยคำ (เฉพาะการแบ่งบรรทัดและตัวหนา)
export interface Line { kind: 'h' | 'p' | 'b'; text: string }
export type Piece = { t: string; strong?: boolean };

const ABBR = /(?:e\.g|i\.e|vs|approx|Dr|St|No|Fig|etc|USP|Inj|spp|sp|cf|al)\.$/i;
const NUM_HEAD = /^(\d{1,2}(?:\.\d{1,2}){1,2})\s+(.*)$/;

/** แบ่งเป็นบรรทัด: หัวข้อย่อย (เช่น 2.1 ...), ข้อความ, และรายการ (•) */
export function toLines(raw: string): Line[] {
  let t = raw.replace(/\s+/g, ' ').trim();
  t = t.replace(/\(\s+\d{1,2}(?:\.\d{1,2})*(?:\s*,\s*\d{1,2}(?:\.\d{1,2})*)*\s*\)/g, ' ').replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1');   // ตัดเลขอ้างอิงภายในฉลากแบบ ( 5.1 ) ที่ติดมากับส่วนสรุป
  t = t.replace(/^\d{1,2}\s+[A-Z][A-Z &,/()-]{4,}\s+(?=[A-Z])/, '');          // ตัดหัวข้อหลักซ้ำ เช่น "2 DOSAGE AND ADMINISTRATION"
  t = t.replace(/\s+(?=\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\s+[A-Z])/g, '\n');      // หัวข้อย่อยขึ้นบรรทัดใหม่
  t = t.replace(/\s+•\s+/g, '\n• ').replace(/\s+(?=\([a-z0-9]\)\s)/g, '\n');
  const out: Line[] = [];
  for (const blk of t.split('\n')) {
    const s = blk.trim(); if (!s) continue;
    if (s.startsWith('• ')) { out.push({ kind: 'b', text: s.slice(2) }); continue; }
    const m = NUM_HEAD.exec(s);
    const body = m ? m[2] : s;
    if (m) {
      // หัวข้อย่อย = วลีต้นประโยคก่อนประโยคแรก (ตัดที่ประโยคแรกจบ หรือไม่เกิน 8 คำ)
      const words = body.split(' '); const head = words.slice(0, Math.min(words.length, 7)).join(' ');
      out.push({ kind: 'h', text: m[1] + ' ' + head }); const rest = words.slice(7).join(' ');
      if (rest) pushSentences(out, rest);
    } else pushSentences(out, body);
  }
  return dedupe(out);
}

/** ตัดประโยคที่ซ้ำกับประโยคก่อนหน้า (ฉลาก FDA มีส่วนสรุป Highlights ซ้ำกับเนื้อหาเต็ม) */
function dedupe(lines: Line[]): Line[] {
  const seen = new Set<string>(); const out: Line[] = [];
  for (const l of lines) {
    const key = l.text.toLowerCase().replace(/\[see [^\]]*\]/g, '').replace(/[^a-z0-9ก-๙]+/g, ' ').trim();
    if (l.kind !== 'h' && key.length > 25) { if (seen.has(key)) continue; seen.add(key); }
    out.push(l);
  }
  return out;
}

function pushSentences(out: Line[], text: string) {
  const parts: string[] = []; let cur = '';
  for (const w of text.split(' ')) {
    cur += (cur ? ' ' : '') + w;
    if (/[.!?]$/.test(w) && !ABBR.test(w) && cur.length > 40) { parts.push(cur); cur = ''; }
  }
  if (cur) parts.push(cur);
  for (const p of parts) out.push({ kind: 'p', text: p });
}

const DOSE = /(\d+(?:[.,]\d+)?(?:\s?[–-]\s?\d+(?:[.,]\d+)?)?\s?(?:mg\/kg\/day|mg\/kg|mcg\/kg\/min|mcg\/kg|µg\/kg|mg\/mL|mg\/day|mg|mcg|µg|g|mL|mEq|units?|IU|hours?|hrs?|days?|weeks?|minutes?|min|%|mmHg|mmol\/L|mg\/dL))(?![A-Za-z])/gi;
/** แยกตัวเลขขนาดยา/ระยะเวลา เพื่อเน้นตัวหนา */
export function emphasize(text: string): Piece[] {
  const out: Piece[] = []; let last = 0; let m: RegExpExecArray | null; DOSE.lastIndex = 0;
  while ((m = DOSE.exec(text))) { if (m.index > last) out.push({ t: text.slice(last, m.index) }); out.push({ t: m[0], strong: true }); last = m.index + m[0].length; }
  if (last < text.length) out.push({ t: text.slice(last) });
  return out;
}
