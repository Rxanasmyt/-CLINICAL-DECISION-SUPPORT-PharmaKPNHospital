// Google Sheets จำลองในหน่วยความจำ สำหรับทดสอบ docs/apps-script/Code.gs (ใช้ในเทสต์เท่านั้น)
import fs from 'node:fs';
import vm from 'node:vm';

const noop = (): any => new Proxy(function () {}, { get: (_t, p) => (p === 'then' ? undefined : noop()), apply: () => noop() });

class Range {
  constructor(public sh: Sheet, public r: number, public c: number, public nr: number, public nc: number) {}
  sort(spec: { column: number; ascending?: boolean } | { column: number; ascending?: boolean }[]) {
    const specs = Array.isArray(spec) ? spec : [spec];
    const rows = this.getValues();
    rows.sort((a, b) => { for (const sp of specs) { const k = sp.column - this.c, dir = sp.ascending === false ? -1 : 1; const x = a[k], y = b[k]; if (x !== y) return (x > y ? 1 : -1) * dir; } return 0; });
    this.setValues(rows); return this;
  }
  getValues() { return Array.from({ length: this.nr }, (_, i) => Array.from({ length: this.nc }, (_, j) => this.sh.cell(this.r + i, this.c + j))); }
  setValues(v: any[][]) { v.forEach((row, i) => row.forEach((x, j) => this.sh.put(this.r + i, this.c + j, x))); return this; }
  setValue(x: any) { this.sh.put(this.r, this.c, x); return this; }
  setFormula(f: string) { this.sh.put(this.r, this.c, f); return this; }
}
class Sheet {
  grid: any[][] = []; maxRows = 1000; name: string;
  constructor(name: string) { this.name = name; }
  cell(r: number, c: number) { return this.grid[r - 1]?.[c - 1] ?? ''; }
  put(r: number, c: number, x: any) { while (this.grid.length < r) this.grid.push([]); const row = this.grid[r - 1]; while (row.length < c) row.push(''); row[c - 1] = x; }
  getName() { return this.name; } setName(n: string) { this.name = n; }
  getLastRow() { return this.grid.length; }
  getLastColumn() { return this.grid.reduce((m, r) => Math.max(m, r.length), 0); }
  getMaxRows() { return this.maxRows; }
  log: any[][] = []; rules: any[] = []; appended = 0;
  getRange(r: any, c?: number, nr = 1, nc = 1) {
    const rg = new Range(this, r, c!, nr, nc);
    // เมธอดจัดรูปแบบที่ไม่ได้จำลอง: บันทึกการเรียกไว้ให้เทสต์ตรวจ และคืนตัวเองเพื่อให้เรียกต่อกันเป็นลูกโซ่ได้
    const px: any = new Proxy(rg, { get: (t: any, p) => (p in t ? (typeof t[p] === 'function' ? t[p].bind(t) : t[p]) : p === 'then' ? undefined : (...a: any[]) => { this.log.push([String(p), t.c, t.r, ...a]); return px; }) });
    return px;
  }
  setConditionalFormatRules(rules: any[]) { this.rules = rules; }
  setColumnWidth(c: number, w: number) { this.log.push(['setColumnWidth', c, 0, w]); }
  appendRow(row: any[]) { this.appended++; this.grid.push(row.slice()); return this; }
  insertColumnBefore(pos: number) { this.grid.forEach((r) => { while (r.length < pos - 1) r.push(''); r.splice(pos - 1, 0, ''); }); }
  clear() { this.grid = []; }
  getCharts() { return []; } getProtections() { return []; } getFilter() { return null; }
}
const sheetProxy = (s: Sheet) => new Proxy(s, { get: (t: any, p) => (p in t ? (typeof t[p] === 'function' ? t[p].bind(t) : t[p]) : noop()) });

class RuleBuilder {
  cfg: any = {};
  whenTextEqualTo(t: string) { this.cfg.text = t; return this; }
  whenFormulaSatisfied(f: string) { this.cfg.formula = f; return this; }
  setBackground(c: string) { this.cfg.bg = c; return this; } setFontColor(c: string) { this.cfg.fg = c; return this; }
  setBold(b: boolean) { this.cfg.bold = b; return this; } setStrikethrough(b: boolean) { this.cfg.strike = b; return this; }
  setRanges(r: any[]) { this.cfg.ranges = r; return this; }
  build() { return this.cfg; }
}

export function load() {
  const sheets: Sheet[] = [];
  const ss = {
    getSheetByName: (n: string) => { const s = sheets.find((x) => x.name === n); return s ? sheetProxy(s) : null; },
    insertSheet: (n: string) => { const s = new Sheet(n); sheets.push(s); return sheetProxy(s); },
  };
  const fmt = (d: Date, _tz: string, f: string) => {
    const t = new Date(d.getTime() + 7 * 3600e3); const p = (n: number) => String(n).padStart(2, '0');
    return f === 'd' ? String(t.getUTCDate()) : f === 'M' ? String(t.getUTCMonth() + 1) : f === 'yyyy' ? String(t.getUTCFullYear()) : f === 'HH:mm' ? p(t.getUTCHours()) + ':' + p(t.getUTCMinutes()) : f;
  };
  const ctx: any = {
    console, JSON, Date, Math, Number, String, Object, Array, isFinite,
    SpreadsheetApp: new Proxy({ getActiveSpreadsheet: () => ss, newConditionalFormatRule: () => new RuleBuilder() }, { get: (t: any, p) => (p in t ? t[p] : noop()) }),
    ContentService: { createTextOutput: (s: string) => ({ s, setMimeType() { return this; } }), MimeType: { JSON: 'json' } },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'secret-token-1234567890abcd' }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { formatDate: fmt }, Charts: noop(),
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('docs/apps-script/Code.gs', 'utf8'), ctx);
  const post = (body: any) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ token: 'secret-token-1234567890abcd', ...body }) } }).s);
  return { sheets, post, ctx };
}
