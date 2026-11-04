// ดึงค่าคงที่ทางคลินิกจากต้นแบบ (.dc.html) แบบคำต่อคำ → src/data/*.ts
// ใช้: node tools/extract-constants.mjs <path/to/PharmaCal-KPNHOSPITAL.dc.html>
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
if (!src) { console.error('usage: extract-constants.mjs <prototype.dc.html>'); process.exit(1); }
const lines = fs.readFileSync(src, 'utf8').split('\n');
const start = lines.findIndex(l => l.startsWith('const DAYS')); // บรรทัดแรกของค่าคงที่
const end = lines.findIndex(l => l.startsWith('class Component'));
const body = lines.slice(start, end);

// แยกเป็นบล็อก const ระดับบนสุด
const blocks = [];
let cur = null;
for (const l of body) {
  const m = l.match(/^const ([A-Za-z_][A-Za-z0-9_]*)\s*=/);
  if (m) { cur = { name: m[1], text: [l] }; blocks.push(cur); }
  else if (cur) cur.text.push(l);
}

const GROUPS = {
  theme: ['C', 'BARCOL', 'SEV'],
  tb: ['TB_ADULT', 'TB_CHILD', 'LTBI_INH_CHILD', 'LTBI_RPT_CHILD', 'FACTORS'],
  warfarin: ['DAYS', 'PAT', 'WCOLOR'],
  pediatric: ['PEDLIQ'],
  adr: ['NARANJO', 'ALTCAUSE', 'CRIT', 'XREACT', 'ADVRULES', 'PREVQ', 'TRIGGERS', 'TRIG_CITE', 'SERIOUS', 'INT_GROUPS', 'DRUGPRESET', 'SXPRESET', 'LABPRESET'],
  standards: ['STD_SRC', 'STD', 'WL_FIELDS', 'REF_REVIEW'],
  references: null, // ที่เหลือทั้งหมด (REF_*)
};
const assigned = new Set(Object.values(GROUPS).filter(Boolean).flat());
GROUPS.references = blocks.map(b => b.name).filter(n => !assigned.has(n));

const outDir = path.resolve('src/data');
fs.mkdirSync(outDir, { recursive: true });
const byName = Object.fromEntries(blocks.map(b => [b.name, b]));
const report = [];
for (const [file, names] of Object.entries(GROUPS)) {
  let out = `// สร้างอัตโนมัติจาก ${path.basename(src)} ด้วย tools/extract-constants.mjs — ห้ามแก้ด้วยมือ\n// คัดลอกแบบคำต่อคำจากต้นแบบ (README: ห้ามเขียนใหม่จากความจำ)\n/* eslint-disable */\n// @ts-nocheck\n\n`;
  for (const n of names) {
    const b = byName[n];
    if (!b) { console.error('missing', n); process.exit(1); }
    out += b.text.join('\n').replace(/^const /, 'export const ').replace(/\s+$/, '') + '\n\n';
  }
  fs.writeFileSync(path.join(outDir, file + '.ts'), out);
  report.push(`${file}: ${names.join(', ')}`);
}
console.log(report.join('\n'));
