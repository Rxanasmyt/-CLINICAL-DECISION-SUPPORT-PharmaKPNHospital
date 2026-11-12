// กันหน้าขาวทั้งแอป: ถ้าหน้าจอส่วนใดเกิดข้อผิดพลาดตอนแสดงผล (เช่น ข้อมูลที่บันทึกไว้ผิดรูปแบบ) แสดงข้อความและให้โหลดใหม่ได้
// ข้อมูลที่บันทึกในเครื่องไม่ถูกลบ
import React from 'react';

type State = { error: Error | null };
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('[app] แสดงผลผิดพลาด', error, info.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ maxWidth: 520, margin: '12vh auto', padding: '0 20px', fontFamily: 'inherit', lineHeight: 1.6 }}>
        <h2 style={{ margin: '0 0 8px' }}>หน้านี้เปิดไม่สำเร็จ</h2>
        <p>เกิดข้อผิดพลาดขณะแสดงผล ข้อมูลที่บันทึกไว้ในเครื่องนี้ยังอยู่ครบ ลองโหลดหน้าใหม่ ถ้ายังเป็นอีกให้แจ้งผู้ดูแลระบบพร้อมข้อความด้านล่าง</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, opacity: 0.7 }}>{String(this.state.error.message || this.state.error)}</pre>
        <button type="button" onClick={() => location.reload()} style={{ padding: '10px 18px', fontSize: 16 }}>โหลดหน้าใหม่</button>
      </div>);
  }
}
