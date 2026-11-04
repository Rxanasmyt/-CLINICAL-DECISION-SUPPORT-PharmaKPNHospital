// ตัวช่วยรันไทม์สำหรับ View ที่แปลงจากต้นแบบ
import type { CSSProperties, SyntheticEvent } from 'react';

type Style = CSSProperties | null;

/** key ของรายการใน sc-for: ใช้ id/key ถ้ามี ไม่เช่นนั้นใช้ลำดับ */
export function K(item: any, i: number): string | number {
  if (item && typeof item === 'object') {
    if (item.id != null) return item.id;
    if (item.key != null) return item.key;
  }
  return i;
}

const saved = new WeakMap<HTMLElement, Record<string, string>>();
function apply(el: HTMLElement, st: Style) {
  if (!st) return;
  const prev = saved.get(el) ?? {};
  for (const k of Object.keys(st)) {
    if (!(k in prev)) prev[k] = (el.style as any)[k];
    (el.style as any)[k] = (st as any)[k];
  }
  saved.set(el, prev);
}
function restore(el: HTMLElement, st: Style) {
  if (!st) return;
  const prev = saved.get(el);
  if (!prev) return;
  for (const k of Object.keys(st)) {
    if (k in prev) { (el.style as any)[k] = prev[k]; delete prev[k]; }
  }
}

/** style-hover / style-focus / style-active ของต้นแบบ */
export function fx(hover: Style, focus: Style, active: Style) {
  const t = (e: SyntheticEvent) => e.currentTarget as HTMLElement;
  const p: Record<string, any> = {};
  if (hover) { p.onMouseEnter = (e: SyntheticEvent) => apply(t(e), hover); p.onMouseLeave = (e: SyntheticEvent) => restore(t(e), hover); }
  if (focus) { p.onFocus = (e: SyntheticEvent) => apply(t(e), focus); p.onBlur = (e: SyntheticEvent) => restore(t(e), focus); }
  if (active) { p.onMouseDown = (e: SyntheticEvent) => apply(t(e), active); p.onMouseUp = (e: SyntheticEvent) => restore(t(e), active); }
  return p;
}
