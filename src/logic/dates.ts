// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */
export function parseD(s) {
  if (!s) return null;
  const t = s.indexOf('T') >= 0 ? s : s + 'T08:00';
  const d = new Date(t);
  return isNaN(d.getTime()) ? null : d;
}

export function fmtD(s, withTime) {
  const d = parseD(s);
  if (!d) return '—';
  const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0');
  const y = d.getFullYear() + 543;
  const base = dd + '/' + mm + '/' + String(y).slice(2);
  if (!withTime) return base;
  if (!s || s.indexOf('T') < 0) return base + ' (ไม่ทราบเวลา)';
  return base + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

export const dOf = (s: string) => (s ? s.slice(0, 10) : '');
export const tOf = (s: string) => ((s && s.indexOf('T') >= 0) ? s.slice(11, 16) : '');
