// ส่วนที่เพิ่มจากต้นแบบสำหรับมือถือ/iPad: แถบเมนูล่าง, แท็บ กรอก/ใบสรุป (ประเมินแพ้ยา), สถานะ sync + หน้าตั้งค่า
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { engine, store, applySettings, loadSettings, saveSettings } from '../storage';
import type { SyncSettings, SyncState } from '../storage/types';
import { REQUIRED_SCRIPT_VERSION } from '../storage/scriptVersion';

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
    case 'synced': return s.outdated ? ['#E0A53A', 'ซิงก์แล้ว · ต้องอัปเดตโค้ด Apps Script'] : ['#7FC7B6', 'ซิงก์แล้ว'];
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
  const [setupMsg, setSetupMsg] = useState('');
  const [busy, setBusy] = useState(false);
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
        <label className="chk"><input type="checkbox" checked={s.approved} onChange={(e) => set('approved', e.target.checked)} /> ได้รับอนุมัติจากผู้รับผิดชอบ PDPA / IT ของโรงพยาบาลให้ใช้ Google Sheets แล้ว</label>
        <label className="chk"><input type="checkbox" checked={s.enabled} disabled={!s.approved} onChange={(e) => set('enabled', e.target.checked)} /> เปิดการซิงก์</label>
        {!s.approved && <p className="muted">ต้องยืนยันการอนุมัติก่อนจึงจะเปิดซิงก์ได้ (HN ที่ hash แล้วยังนับเป็นข้อมูลส่วนบุคคลตาม PDPA)</p>}
        {field('url', 'URL ของ Apps Script Web App', 'https://script.google.com/macros/s/…/exec')}
        {field('token', 'Token (ตรงกับ TOKEN ใน Apps Script)', 'ข้อความลับของกลุ่มงาน', 'password')}
        {field('salt', 'Salt ของ รพ. สำหรับ hash HN', 'ต้องตรงกันทุกเครื่อง · ห้ามเปลี่ยนภายหลัง', 'password')}
        {engine.outdated && (
          <div className="warnbox" role="alert">
            <b>โค้ด Apps Script ในชีตเก่ากว่าที่แอปต้องการ</b>{engine.scriptVersion != null ? ` (ชีตเป็นเวอร์ชัน ${engine.scriptVersion} · แอปต้องการ ${REQUIRED_SCRIPT_VERSION})` : ''}
            <br />การซิงก์ยังใช้ได้ แต่คอลัมน์/หน้าตาชีตอาจไม่ครบ วิธีอัปเดต: เปิด Apps Script ของชีต → วางโค้ดจาก <code>docs/apps-script/Code.gs</code> ทั้งไฟล์ทับของเดิม → Deploy → Manage deployments → ไอคอนดินสอ → New version → Deploy แล้วกด "จัดชีตใหม่" ด้านล่าง
          </div>
        )}
        <p className="muted">สถานะ: {label(state)[1]}{state.kind === 'error' ? ` — ${state.message}` : ''} · ค้างส่ง {store.pendingCount()} รายการ</p>
        {setupMsg && <p className="muted" role="status">{setupMsg}</p>}
        <div className="row">
          <button type="button" className="pri" onClick={() => { save(); void engine.syncNow(); }}>บันทึกและซิงก์</button>
          <button type="button" onClick={() => { save(); }}>บันทึก</button>
          <button type="button" disabled={busy || !(s.enabled && s.approved && s.url && s.token)} title="สร้างแท็บ อ่านก่อน/ภาพรวม และจัดรูปแบบชีตใหม่ (ใช้หลังอัปเดตโค้ด Apps Script)" onClick={() => { save(); setBusy(true); setSetupMsg(''); engine.setupRemote().then((m) => setSetupMsg(m)).catch((e) => setSetupMsg('ไม่สำเร็จ: ' + (e?.message || e))).finally(() => setBusy(false)); }}>{busy ? 'กำลังจัดชีต…' : 'จัดชีตใหม่'}</button>
          <button type="button" title="ใช้หลังสร้างชีตใหม่หรือเปลี่ยนโครงสร้างชีต" onClick={() => { if (window.confirm('ส่งข้อมูลทั้งหมดในเครื่องขึ้น Google Sheets ใหม่ใช่ไหม? (รายการเดิมในชีตจะถูกเขียนทับด้วยข้อมูลล่าสุดของเครื่องนี้)')) { save(); store.resetPushed(); void engine.syncNow(); } }}>ส่งข้อมูลทั้งหมดใหม่</button>
          <button type="button" onClick={close}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

/** ตราแอป (ไอคอนแคปซูล) คู่ตรา รพ. — ใช้ในส่วนหัว */
export function BrandMark() {
  return (
    <span className="brandmark" aria-hidden="true">
      <img className="bm-icon" src="favicon.svg" alt="" />
      <span className="bm-badge"><img src="assets/kpn-logo-trim.png" alt="" /></span>
    </span>
  );
}

/** ตราแอปขนาดใหญ่ + ตรา รพ. ในหน้าแรก */
export function HeroMark() {
  return (
    <span className="heromark" role="img" aria-label="PharmaKPNHospital โดยโรงพยาบาลกรงปินัง">
      <img className="hm-icon" src="favicon.svg" alt="" />
      <span className="hm-link" />
      <span className="hm-hosp"><img src="assets/kpn-logo-trim.png" alt="" /></span>
    </span>
  );
}
