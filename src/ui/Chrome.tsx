// ส่วนที่เพิ่มจากต้นแบบสำหรับมือถือ/iPad: แถบเมนูล่าง, แท็บ กรอก/ใบสรุป (ประเมินแพ้ยา), สถานะ sync + หน้าตั้งค่า
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { engine, store, applySettings, loadSettings, saveSettings } from '../storage';
import type { SyncSettings, SyncState } from '../storage/types';

const TABS: [string, string, string][] = [
  ['home', 'หน้าแรก', '⌂'], ['tb', 'TB', '💊'], ['warf', 'Warfarin', '⚖'], ['ped', 'ยาน้ำเด็ก', '🧴'],
  ['adr', 'แพ้ยา', '⚠'], ['calc', 'เครื่องมือ', '🧮'], ['std', 'มาตรฐาน', '✓'],
];

export function BottomNav({ mode, go }: { mode: string; go: (m: string) => void }) {
  return (
    <nav className="bnav" data-print="hide" aria-label="เมนูหลัก">
      {TABS.map(([id, label, ic]) => (
        <button key={id} type="button" onClick={() => go(id)} aria-current={mode === id ? 'page' : undefined} className={mode === id ? 'on' : ''}>
          <span aria-hidden="true">{ic}</span><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function AdrTabs({ tab, set }: { tab: 'fill' | 'sheet'; set: (t: 'fill' | 'sheet') => void }) {
  useEffect(() => { document.body.dataset.adrTab = tab; return () => { delete document.body.dataset.adrTab; }; }, [tab]);
  return (
    <div className="adrtabs" data-print="hide" role="tablist">
      <button type="button" role="tab" aria-selected={tab === 'fill'} className={tab === 'fill' ? 'on' : ''} onClick={() => { set('fill'); window.scrollTo(0, 0); }}>กรอก</button>
      <button type="button" role="tab" aria-selected={tab === 'sheet'} className={tab === 'sheet' ? 'on' : ''} onClick={() => { set('sheet'); window.scrollTo(0, 0); }}>ใบสรุป</button>
    </div>
  );
}

function label(s: SyncState) {
  switch (s.kind) {
    case 'off': return ['#9AA5A2', 'ใช้ในเครื่อง'];
    case 'offline': return ['#A66A00', 'ออฟไลน์' + (s.pending ? ` · รอส่ง ${s.pending} รายการ` : '')];
    case 'syncing': return ['#2F6DA8', 'กำลังซิงก์…'];
    case 'pending': return ['#A66A00', s.pending ? `รอส่ง ${s.pending} รายการ` : 'รอซิงก์'];
    case 'synced': return ['#7FC7B6', 'ซิงก์แล้ว'];
    case 'error': return ['#E0786F', 'ซิงก์ไม่สำเร็จ'];
  }
}

export function SyncBadge() {
  const [st, setSt] = useState<SyncState>(engine.state);
  const [open, setOpen] = useState(false);
  useEffect(() => { const off = engine.subscribe(setSt); return () => { off(); }; }, []);
  const [color, text] = label(st);
  return (
    <>
      <button type="button" className="syncbadge" onClick={() => setOpen(true)} title="ตั้งค่าการซิงก์">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />{text}
      </button>
      {open && createPortal(<SyncPanel state={st} close={() => setOpen(false)} />, document.body)}
    </>
  );
}

function SyncPanel({ state, close }: { state: SyncState; close: () => void }) {
  const [s, setS] = useState<SyncSettings>(loadSettings());
  const set = (k: keyof SyncSettings, v: any) => setS({ ...s, [k]: v });
  const save = () => { saveSettings(s); applySettings(s); };
  const field = (k: 'url' | 'token' | 'salt', lab: string, ph: string, type = 'text') => (
    <label className="fld"><span>{lab}</span>
      <input type={type} value={s[k]} placeholder={ph} autoComplete="off" onChange={(e) => set(k, e.target.value.trim())} /></label>
  );
  return (
    <div className="modal" data-print="hide" onClick={close}>
      <div className="card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="ตั้งค่าการซิงก์">
        <h2>ตั้งค่าการซิงก์ข้อมูล</h2>
        <p className="muted">ข้อมูลบันทึกในเครื่องนี้ทันที (IndexedDB) แล้วส่งไป Google Sheets ของกลุ่มงาน — <b>ไม่ส่งชื่อผู้ป่วย</b> ส่งเฉพาะรหัสเคสและ HN ที่ผ่าน hash (SHA-256 + salt)</p>
        <label className="chk"><input type="checkbox" checked={s.enabled} onChange={(e) => set('enabled', e.target.checked)} /> เปิดการซิงก์</label>
        {field('url', 'URL ของ Apps Script Web App', 'https://script.google.com/macros/s/…/exec')}
        {field('token', 'Token (ตรงกับ TOKEN ใน Apps Script)', 'ข้อความลับของกลุ่มงาน', 'password')}
        {field('salt', 'Salt ของ รพ. สำหรับ hash HN', 'ต้องตรงกันทุกเครื่อง · ห้ามเปลี่ยนภายหลัง', 'password')}
        <p className="muted">สถานะ: {label(state)[1]}{state.kind === 'error' ? ` — ${state.message}` : ''} · ค้างส่ง {store.pendingCount()} รายการ</p>
        <div className="row">
          <button type="button" className="pri" onClick={() => { save(); void engine.syncNow(); }}>บันทึกและซิงก์</button>
          <button type="button" onClick={() => { save(); }}>บันทึก</button>
          <button type="button" onClick={close}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
