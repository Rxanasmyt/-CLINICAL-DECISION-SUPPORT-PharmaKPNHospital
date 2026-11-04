// ลายนิ้วมือของผลลัพธ์ (ใช้กับ unit test เทียบกับต้นแบบ) — ต้องตรงกับ tools/gen-golden.mjs
export function canon(x: any): any {
  if (typeof x === 'function' || x === undefined) return undefined;
  if (typeof x === 'number') return isNaN(x) ? 'NaN' : (x === Infinity ? 'Infinity' : x);
  if (Array.isArray(x)) return x.map(v => { const c = canon(v); return c === undefined ? null : c; });
  if (x && typeof x === 'object') { const o: any = {}; for (const k of Object.keys(x).sort()) { const c = canon(x[k]); if (c !== undefined) o[k] = c; } return o; }
  return x;
}
