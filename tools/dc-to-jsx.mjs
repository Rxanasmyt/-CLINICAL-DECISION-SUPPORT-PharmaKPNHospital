// แปลง template ของต้นแบบ (.dc.html: sc-if / sc-for / {{ }}) → JSX  (src/ui/View.generated.tsx)
// ใช้: node tools/dc-to-jsx.mjs <PharmaCal-KPNHOSPITAL.dc.html>
import fs from 'node:fs';
import { parseDocument } from 'htmlparser2';

const srcFile = process.argv[2];
const lines = fs.readFileSync(srcFile, 'utf8').split('\n');
const s = lines.findIndex(l => l.startsWith('<div style="min-height:100vh'));
const e = lines.findIndex(l => l.startsWith('<script type="text/x-dc"'));
let html = lines.slice(s, e).join('\n');
// ตัดปิดท้าย </x-dc> ถ้ามี
const doc = parseDocument(html, { lowerCaseTags: false, lowerCaseAttributeNames: false, decodeEntities: true, recognizeSelfClosing: false });

const BIND = /\{\{\s*([^}]+?)\s*\}\}/g;
const VOID = new Set(['input', 'img', 'br', 'hr']);
const ATTR = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', colspan: 'colSpan', rowspan: 'rowSpan', maxlength: 'maxLength', inputmode: 'inputMode', autocomplete: 'autoComplete', readonly: 'readOnly', contenteditable: 'contentEditable' };
const DROP = new Set(['hint-placeholder-count', 'hint-placeholder-val']);

const esc = (t) => t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
let uid = 0;

function ref(expr, scope) {
  const root = expr.split(/[.\[]/)[0];
  if (/^[A-Za-z_$][\w$]*$/.test(root) === false) throw new Error('bad expr ' + expr);
  return scope.has(root) ? expr : 'v.' + expr;
}
// ข้อความที่มี {{ }} → นิพจน์ JS (string หรือ template literal)
function interp(str, scope) {
  const m = [...str.matchAll(BIND)];
  if (!m.length) return JSON.stringify(str);
  if (m.length === 1 && m[0][0] === str.trim() && str.trim() === str) return ref(m[0][1], scope);
  return '`' + esc(str).replace(BIND, (_, x) => '${' + ref(x.trim(), scope) + ' ?? \'\'}') + '`';
}
const camel = (p) => p.startsWith('--') ? p : p.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^(webkit|moz)/, (x) => x[0].toUpperCase() + x.slice(1));
function splitDecl(css) {
  const out = []; let depth = 0, cur = '';
  for (const ch of css) {
    if (ch === '(') depth++; if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}
function styleObj(css, scope) {
  const parts = [];
  for (const d of splitDecl(css)) {
    const i = d.indexOf(':'); if (i < 0) continue;
    const k = d.slice(0, i).trim(), val = d.slice(i + 1).trim();
    if (!k) continue;
    parts.push(JSON.stringify(camel(k)) + ': ' + interp(val, scope));
  }
  return '{' + parts.join(', ') + '}';
}

function attrs(el, scope) {
  const out = []; let hover, focus, active;
  for (const [k0, val] of Object.entries(el.attribs)) {
    if (DROP.has(k0)) continue;
    if (k0 === 'style') { out.push(`style={${styleObj(val, scope)}}`); continue; }
    if (k0 === 'style-hover') { hover = styleObj(val, scope); continue; }
    if (k0 === 'style-focus') { focus = styleObj(val, scope); continue; }
    if (k0 === 'style-active') { active = styleObj(val, scope); continue; }
    const k = ATTR[k0] || k0;
    if (val === '' && !BIND.test(val)) { out.push(k); continue; }
    BIND.lastIndex = 0;
    const m = val.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    if (m) out.push(`${k}={${ref(m[1], scope)}}`);
    else if (BIND.test(val)) { BIND.lastIndex = 0; out.push(`${k}={${interp(val, scope)}}`); }
    else out.push(`${k}=${JSON.stringify(val)}`);
    BIND.lastIndex = 0;
  }
  if (hover || focus || active) out.push(`{...fx(${hover || 'null'}, ${focus || 'null'}, ${active || 'null'})}`);
  return out.length ? ' ' + out.join(' ') : '';
}

function kids(nodes, scope, parentTag) {
  // ตัดช่องว่างล้วนที่หัว/ท้าย และใน select/datalist
  let list = nodes.slice();
  const isWs = (n) => n.type === 'text' && !n.data.trim();
  while (list.length && isWs(list[0])) list.shift();
  while (list.length && isWs(list[list.length - 1])) list.pop();
  if (parentTag === 'select' || parentTag === 'datalist') list = list.filter(n => !isWs(n));
  return list.map(n => node(n, scope, parentTag)).join('');
}

function node(n, scope, parentTag) {
  if (n.type === 'text') {
    const raw = n.data;
    if (!raw.trim()) return raw.includes('\n') || raw.length ? '{" "}' : '';
    const t = raw.replace(/\s+/g, ' ');
    // แยกส่วน {{ }}
    let out = '', last = 0; BIND.lastIndex = 0;
    for (const m of t.matchAll(BIND)) {
      if (m.index > last) out += lit(t.slice(last, m.index));
      out += '{' + ref(m[1].trim(), scope) + '}';
      last = m.index + m[0].length;
    }
    if (last < t.length) out += lit(t.slice(last));
    return out;
  }
  if (n.type === 'comment' || n.type === 'directive') return '';
  if (n.type !== 'tag') return '';
  const tag = n.name;
  if (tag === 'sc-if') {
    const m = n.attribs.value.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    return `{(${ref(m[1], scope)}) ? (<>${kids(n.children, scope, parentTag)}</>) : null}`;
  }
  if (tag === 'sc-for') {
    const m = n.attribs.list.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    const as = n.attribs.as, i = '_i' + (uid++);
    const inner = new Set(scope); inner.add(as);
    return `{(${ref(m[1], scope)} || []).map((${as}: any, ${i}: number) => (<Fragment key={K(${as}, ${i})}>${kids(n.children, inner, parentTag)}</Fragment>))}`;
  }
  const a = attrs(n, scope);
  if (VOID.has(tag)) return `<${tag}${a} />`;
  if (tag === 'textarea') {
    // textarea: เนื้อหาเป็น value
    return `<${tag}${a} />`;
  }
  return `<${tag}${a}>${kids(n.children, scope, tag)}</${tag}>`;
}
function lit(t) { return /[{}<>]/.test(t) ? '{' + JSON.stringify(t) + '}' : t; }

let body = kids(doc.children, new Set(), null);
// เพิ่มสถานะ sync ในแถบหน่วยงาน (ไม่มีในต้นแบบ)
const MARK = 'สำหรับเภสัชกร · ใช้ภายในหน่วยงาน</span>';
if (!body.includes(MARK)) throw new Error('marker not found');
body = body.replace(MARK, MARK + '<SyncBadge /><SecurityBadge />');
// ตราแอป + ตรา รพ. ในส่วนหัวและหน้าแรก (แทนรูปโลโก้เดี่ยวของต้นแบบ)
const swap = (re, jsx) => { if (!re.test(body)) throw new Error('logo marker not found: ' + re); body = body.replace(re, jsx); };
swap(/<img src="assets\/kpn-logo\.png" alt="โรงพยาบาลกรงปินัง" style=\{\{"width": "40px"[^>]*\/>/, '<BrandMark />');
swap(/<img src="assets\/kpn-logo\.png" alt="โรงพยาบาลกรงปินัง" style=\{\{"width": "86px"[^>]*\/>/, '<HeroMark />');
const out = `// สร้างอัตโนมัติจาก ${srcFile.split('/').pop()} (template) ด้วย tools/dc-to-jsx.mjs — ห้ามแก้ด้วยมือ
// แก้ไข markup ที่ต้นฉบับ แล้วรัน: npm run gen:view
/* eslint-disable */
// @ts-nocheck
import { Fragment } from 'react';
import { fx, K } from './runtime';
import { SyncBadge, BrandMark, HeroMark } from './Chrome';\nimport { SecurityBadge } from './Security';

export function View({ v }: { v: any }) {
  return (<>${body}</>);
}
`;
fs.mkdirSync('src/ui', { recursive: true });
fs.writeFileSync('src/ui/View.generated.tsx', out);
console.log('written', out.length, 'bytes');
