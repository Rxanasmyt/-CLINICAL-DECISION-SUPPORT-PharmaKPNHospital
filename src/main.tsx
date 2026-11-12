import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { LockGate } from './ui/Security';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { initStorage } from './storage';
import './styles.css';

// โหลดข้อมูลจาก IndexedDB เข้าแคชก่อนแสดงหน้าจอ (ตรรกะเดิมอ่านข้อมูลแบบ synchronous)
initStorage().catch((e) => console.error('[storage]', e)).finally(() => {
  createRoot(document.getElementById('root')!).render(<ErrorBoundary><LockGate><App /></LockGate></ErrorBoundary>);
});
