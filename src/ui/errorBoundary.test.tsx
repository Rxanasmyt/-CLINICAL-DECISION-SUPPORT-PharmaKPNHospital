// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const Boom = (): React.ReactElement => { throw new Error('ข้อมูลผิดรูปแบบ'); };

describe('ErrorBoundary', () => {
  it('ส่วนที่แสดงผลพังต้องไม่ทำให้หน้าขาว: แสดงข้อความ ปุ่มโหลดใหม่ และเนื้อหาปกติยังแสดงเมื่อไม่มีข้อผิดพลาด', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const host = document.createElement('div'); const root = createRoot(host);
    await act(async () => { root.render(<ErrorBoundary><p>ปกติ</p></ErrorBoundary>); });
    expect(host.textContent).toContain('ปกติ');
    await act(async () => { root.render(<ErrorBoundary><Boom /></ErrorBoundary>); });
    expect(host.querySelector('[role=alert]')).not.toBeNull();
    expect(host.textContent).toContain('ข้อมูลผิดรูปแบบ'); expect(host.textContent).toContain('โหลดหน้าใหม่');
    await act(async () => { root.unmount(); }); spy.mockRestore();
  });
});
