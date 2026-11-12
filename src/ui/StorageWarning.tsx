// เตือนเมื่อที่เก็บข้อมูลในเครื่องใช้ไม่ได้ (โหมดส่วนตัว / IndexedDB ถูกปิด / พื้นที่เต็ม) — ข้อมูลที่กรอกจะไม่ถูกเก็บถาวร
import { useEffect, useState } from 'react';

export function StorageWarning({ initFailed = false, failed = () => false }: { initFailed?: boolean; failed?: () => boolean }) {
  const [bad, setBad] = useState(initFailed || failed());
  useEffect(() => {
    const on = () => setBad(true);
    window.addEventListener('pharmakpn:storage-error', on);
    return () => window.removeEventListener('pharmakpn:storage-error', on);
  }, []);
  if (!bad) return null;
  return (
    <div role="alert" data-print="hide" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#7A1F16', color: '#fff', padding: '10px 14px', fontSize: 14, lineHeight: 1.5 }}>
      <b>ข้อมูลอาจไม่ถูกบันทึกถาวร</b> — เบราว์เซอร์นี้เก็บข้อมูลในเครื่องไม่ได้ (เช่น โหมดส่วนตัว หรือพื้นที่เต็ม) ข้อมูลที่กรอกจะหายเมื่อปิดหรือโหลดหน้าใหม่ ให้ใช้เบราว์เซอร์ปกติ หรือกด "สำรองข้อมูล" ทุกครั้งหลังกรอก
    </div>);
}
