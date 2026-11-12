// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect } from 'vitest';
import { StorageWarning } from './StorageWarning';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const mount = async (el: React.ReactElement) => { const host = document.createElement('div'); const root = createRoot(host); await act(async () => { root.render(el); }); return { host, root }; };

describe('StorageWarning', () => {
  it('ปกติไม่แสดงอะไร', async () => { const { host } = await mount(<StorageWarning />); expect(host.textContent).toBe(''); });
  it('เริ่มต้นเก็บข้อมูลไม่ได้ → แสดงคำเตือนทันที', async () => { const { host } = await mount(<StorageWarning initFailed />); expect(host.querySelector('[role=alert]')?.textContent).toContain('ไม่ถูกบันทึกถาวร'); });
  it('เขียนข้อมูลล้มเหลวระหว่างใช้งาน (เหตุการณ์ storage-error) → คำเตือนปรากฏ', async () => {
    const { host } = await mount(<StorageWarning />); expect(host.textContent).toBe('');
    await act(async () => { window.dispatchEvent(new Event('pharmakpn:storage-error')); });
    expect(host.querySelector('[role=alert]')).not.toBeNull();
  });
});
