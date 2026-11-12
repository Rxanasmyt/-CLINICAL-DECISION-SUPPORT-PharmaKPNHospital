import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { LockGate } from './ui/Security';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { StorageWarning } from './ui/StorageWarning';
import { initStorage, store } from './storage';
import './styles.css';

// โหลดข้อมูลจาก IndexedDB เข้าแคชก่อนแสดงหน้าจอ (ตรรกะเดิมอ่านข้อมูลแบบ synchronous)
let initFailed = false;
initStorage().catch((e) => { initFailed = true; console.error('[storage]', e); }).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <ErrorBoundary><StorageWarning initFailed={initFailed} failed={() => store.persistFailed} /><LockGate><App /></LockGate></ErrorBoundary>);
});
