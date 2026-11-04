// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */
export const num = (s: any) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };

export function frac(n) {
  const w = Math.floor(n + 1e-9), h = n - w > 0.25;
  if (!w && !h) return '0';
  return (w ? String(w) : '') + (h ? '½' : '');
}

export function pills(n, fill, edge, shape, size) {
  const out = [];
  const full = Math.floor(n + 1e-9), half = n - full > 0.25;
  const cap = shape === 'cap';
  const w = cap ? Math.round(size * 1.45) : size, h = cap ? Math.round(size * 0.62) : size;
  const mk = (isHalf, i) => ({
    key: i,
    w: (isHalf ? Math.round(w / 2) : w) + 'px',
    h: h + 'px',
    radius: cap ? (isHalf ? '999px 0 0 999px' : '999px') : (isHalf ? '999px 0 0 999px' : '50%'),
    bg: 'linear-gradient(160deg,' + fill + ' 0%,' + fill + ' 45%,rgba(0,0,0,.07) 100%)',
    bd: edge,
    scoreOp: (!cap && !isHalf) ? '.28' : '0'
  });
  for (let i = 0; i < Math.min(full, 15); i++) out.push(mk(false, i));
  if (half) out.push(mk(true, 99));
  return out;
}

export function devices(n, shape, fill, edge) {
  const out = [];
  for (let i = 0; i < n; i++) {
    if (shape === 'vial') {
      out.push({key: i, w: '18px', h: '40px',
        capW: '11px', capH: '5px', capBg: edge, capR: '2px 2px 1px 1px',
        neckW: '9px', neckH: '4px', neckBg: fill, neckR: '0',
        bodyW: '18px', bodyH: '29px', bodyBg: 'linear-gradient(105deg,' + fill + ' 0%,' + fill + ' 55%,rgba(0,0,0,.09) 100%)',
        bodyR: '3px 3px 4px 4px', bodyBd: edge,
        bandTop: '17px', bandBg: edge});
    } else {
      out.push({key: i, w: '12px', h: '44px',
        capW: '12px', capH: '15px', capBg: edge, capR: '6px 6px 1px 1px',
        neckW: '12px', neckH: '0', neckBg: 'transparent', neckR: '0',
        bodyW: '12px', bodyH: '29px', bodyBg: 'linear-gradient(105deg,' + fill + ' 0%,' + fill + ' 55%,rgba(0,0,0,.09) 100%)',
        bodyR: '1px 1px 5px 5px', bodyBd: edge,
        bandTop: '22px', bandBg: edge});
    }
  }
  return out;
}
