// ความปลอดภัยของข้อมูล: ล็อกหน้าจอด้วย PIN, ผู้ใช้, ประวัติการแก้ไข, สำรองข้อมูล, อายุข้อมูล, ทะเบียนตรวจสอบสูตร
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { store } from '../storage';
import { buildBackup } from '../storage/backup';
import { loadSecurity, saveSecurity, userDisplay, type SecuritySettings } from '../security/settings';
import { checkPin, lockoutSeconds, makePin, shouldAutoLock, validPin } from '../security/pin';
import { daysSince, lastBackupAt, markBackup, needsBackup } from '../security/backupReminder';
import { findExpired, purgeExpired, type Expired } from '../security/retention';
import { FORMULA_VERSION, VALIDATION } from '../data/validation';

const FAILS = 'pharmaKpn.pinFails.v1';
const getFails = () => { try { return Number(localStorage.getItem(FAILS)) || 0; } catch { return 0; } };
const setFails = (n: number) => { try { localStorage.setItem(FAILS, String(n)); } catch { /* ignore */ } };

/** ครอบแอป: ถ้าตั้ง PIN จะล็อกตั้งแต่เปิดแอป และล็อกซ้ำเมื่อไม่ได้ใช้งาน (แอปยังทำงานอยู่ใต้หน้าล็อก ฟอร์มที่กรอกค้างไม่หาย) */
export function LockGate({ children }: { children: ReactNode }) {
  const [sec, setSec] = useState<SecuritySettings>(loadSecurity());
  const [locked, setLocked] = useState<boolean>(!!loadSecurity().pin);
  const last = useRef(Date.now());
  const secRef = useRef(sec); secRef.current = sec;

  useEffect(() => {
    const on = () => setSec(loadSecurity());
    window.addEventListener('pharmakpn:security', on);
    return () => window.removeEventListener('pharmakpn:security', on);
  }, []);
  useEffect(() => { if (!sec.pin) setLocked(false); }, [sec.pin]);

  useEffect(() => {
    const touch = () => { last.current = Date.now(); };
    const check = () => { const s = secRef.current; if (s.pin && shouldAutoLock(Date.now() - last.current, s.autoLockMin)) setLocked(true); };
    const vis = () => { if (document.visibilityState === 'visible') check(); };
    const ev = ['pointerdown', 'keydown', 'touchstart'] as const;
    ev.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    document.addEventListener('visibilitychange', vis);
    const iv = setInterval(check, 15_000);
    const lockNow = () => setLocked(true);
    window.addEventListener('pharmakpn:lock', lockNow);
    return () => { ev.forEach((e) => window.removeEventListener(e, touch)); document.removeEventListener('visibilitychange', vis); clearInterval(iv); window.removeEventListener('pharmakpn:lock', lockNow); };
  }, []);

  return (
    <>
      <div aria-hidden={locked} {...(locked ? { inert: '' } : {})} style={locked ? { visibility: 'hidden' } : undefined}>{children}</div>
      {locked && sec.pin && <LockScreen pin={sec.pin} onOpen={() => { last.current = Date.now(); setFails(0); setLocked(false); }} />}
    </>
  );
}

function LockScreen({ pin, onOpen }: { pin: NonNullable<SecuritySettings['pin']>; onOpen: () => void }) {
  const [v, setV] = useState(''); const [msg, setMsg] = useState(''); const [wait, setWait] = useState(0);
  useEffect(() => { const w = lockoutSeconds(getFails()); if (w) setWait(w); }, []);
  useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait(wait - 1), 1000); return () => clearTimeout(t); }, [wait]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wait > 0 || !v) return;
    if (await checkPin(v, pin)) { onOpen(); return; }
    const f = getFails() + 1; setFails(f); setV(''); setWait(lockoutSeconds(f));
    setMsg('PIN ไม่ถูกต้อง');
  };
  return (
    <div className="lockscreen" role="dialog" aria-label="ล็อกหน้าจอ">
      <form onSubmit={submit}>
        <img src="favicon.svg" alt="" width={72} height={72} style={{ borderRadius: 18 }} />
        <h1>PharmaKPNHospital</h1>
        <p>ใส่ PIN เพื่อเปิดใช้งาน</p>
        <input id="pin-input" type="password" inputMode="numeric" autoComplete="off" autoFocus maxLength={8} value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ''))} aria-label="PIN" />
        <button type="submit" disabled={wait > 0 || v.length < 4}>{wait > 0 ? `ลองใหม่ได้ใน ${wait} วินาที` : 'เปิด'}</button>
        {msg && <div className="err" role="alert">{msg}</div>}
      </form>
    </div>
  );
}

/** แถบเตือนสำรองข้อมูล (ไม่แสดงเมื่อยังไม่มีข้อมูล หรือสำรองไว้ภายใน 7 วัน) */
export function BackupBar({ hasData, onBackup }: { hasData: boolean; onBackup: () => void }) {
  const [hide, setHide] = useState(false);
  const [, tick] = useState(0);
  if (hide || !needsBackup(hasData, lastBackupAt())) return null;
  const d = daysSince(lastBackupAt());
  return (
    <div className="backupbar" data-print="hide" role="status">
      <span>{d == null ? 'ยังไม่เคยสำรองข้อมูลในเครื่องนี้' : `สำรองข้อมูลล่าสุดเมื่อ ${d} วันก่อน`} — ข้อมูลอยู่ในเบราว์เซอร์ ถ้าล้างเครื่องหรือเปลี่ยนเครื่องจะหาย</span>
      <button type="button" onClick={() => { onBackup(); tick((x) => x + 1); }}>สำรองเดี๋ยวนี้</button>
      <button type="button" className="ghost" onClick={() => setHide(true)} aria-label="ปิดแถบเตือน">ปิด</button>
    </div>
  );
}

export function SecurityBadge() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="syncbadge" onClick={() => setOpen(true)} title="ความปลอดภัยของข้อมูล">🔒 ความปลอดภัย</button>
      {open && createPortal(<SecurityPanel close={() => setOpen(false)} />, document.body)}
    </>
  );
}

type Tab = 'user' | 'pin' | 'backup' | 'keep' | 'audit' | 'formula';
const TABS: [Tab, string][] = [['user', 'ผู้ใช้'], ['pin', 'PIN'], ['backup', 'สำรอง'], ['keep', 'อายุข้อมูล'], ['audit', 'ประวัติ'], ['formula', 'ตรวจสูตร']];

function SecurityPanel({ close }: { close: () => void }) {
  const [tab, setTab] = useState<Tab>('user');
  const [s, setS] = useState<SecuritySettings>(loadSecurity());
  const [note, setNote] = useState('');
  const save = useCallback((n: SecuritySettings, msg = 'บันทึกแล้ว') => { saveSecurity(n); setS(n); setNote(msg); window.dispatchEvent(new Event('pharmakpn:security')); }, []);
  return (
    <div className="modal" data-print="hide" onClick={close}>
      <div className="card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="ความปลอดภัยของข้อมูล" style={{ maxWidth: 640 }}>
        <h2>ความปลอดภัยของข้อมูล</h2>
        <div className="tabs" role="tablist">{TABS.map(([id, l]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => { setTab(id); setNote(''); }}>{l}</button>)}</div>
        {tab === 'user' && <UserTab s={s} save={save} />}
        {tab === 'pin' && <PinTab s={s} save={save} />}
        {tab === 'backup' && <BackupTab />}
        {tab === 'keep' && <KeepTab s={s} save={save} />}
        {tab === 'audit' && <AuditTab />}
        {tab === 'formula' && <FormulaTab />}
        {note && <p className="muted" role="status">{note}</p>}
        <div className="row"><button type="button" onClick={close}>ปิด</button></div>
      </div>
    </div>
  );
}
type TabProps = { s: SecuritySettings; save: (n: SecuritySettings, m?: string) => void };

function UserTab({ s, save }: TabProps) {
  const [u, setU] = useState(s.user);
  return (<>
    <p className="muted">ชื่อเภสัชกรผู้ใช้เครื่องนี้ ใช้เติมช่องลงชื่อในใบประเมินและบันทึกในประวัติการแก้ไข (เก็บเฉพาะในเครื่อง)</p>
    <label className="fld"><span>ชื่อ-สกุล</span><input id="sec-name" value={u.name} onChange={(e) => setU({ ...u, name: e.target.value })} placeholder="ภก.…" /></label>
    <label className="fld"><span>เลขที่ใบอนุญาตประกอบวิชาชีพ</span><input id="sec-license" value={u.license} onChange={(e) => setU({ ...u, license: e.target.value })} inputMode="numeric" /></label>
    <div className="row"><button type="button" className="pri" onClick={() => save({ ...s, user: u })}>บันทึก</button></div>
  </>);
}

function PinTab({ s, save }: TabProps) {
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [err, setErr] = useState('');
  const set = async () => {
    if (!validPin(a)) return setErr('PIN ต้องเป็นตัวเลข 4–8 หลัก');
    if (a !== b) return setErr('PIN ทั้งสองช่องไม่ตรงกัน');
    setErr(''); setA(''); setB(''); save({ ...s, pin: await makePin(a) }, 'ตั้ง PIN แล้ว — แอปจะล็อกเมื่อเปิดใหม่');
  };
  return (<>
    <p className="muted">PIN ใช้ล็อกหน้าจอเพื่อกันการเปิดดูโดยไม่ตั้งใจ <b>ไม่ใช่การเข้ารหัสข้อมูล</b> ควรเปิดการเข้ารหัสดิสก์ของเครื่อง (BitLocker / FileVault / รหัสผ่านเครื่อง) ร่วมด้วย PIN ที่ลืมกู้คืนไม่ได้ ต้องล้างข้อมูลเบราว์เซอร์ จึงควรสำรองข้อมูลไว้เสมอ</p>
    <p className="muted">สถานะ: {s.pin ? 'ตั้ง PIN แล้ว' : 'ยังไม่ได้ตั้ง PIN'}</p>
    <label className="fld"><span>{s.pin ? 'PIN ใหม่' : 'PIN (ตัวเลข 4–8 หลัก)'}</span><input id="sec-pin1" type="password" inputMode="numeric" maxLength={8} value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, ''))} /></label>
    <label className="fld"><span>ยืนยัน PIN</span><input id="sec-pin2" type="password" inputMode="numeric" maxLength={8} value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, ''))} /></label>
    {err && <p className="err" role="alert">{err}</p>}
    <label className="fld"><span>ล็อกอัตโนมัติเมื่อไม่ได้ใช้งาน (นาที · 0 = ไม่ล็อก)</span><input id="sec-auto" inputMode="numeric" value={s.autoLockMin} onChange={(e) => save({ ...s, autoLockMin: Math.max(0, Math.min(240, Number(e.target.value.replace(/\D/g, '')) || 0)) }, 'บันทึกแล้ว')} /></label>
    <div className="row">
      <button type="button" className="pri" onClick={set}>{s.pin ? 'เปลี่ยน PIN' : 'ตั้ง PIN'}</button>
      {s.pin && <button type="button" onClick={() => window.dispatchEvent(new Event('pharmakpn:lock'))}>ล็อกตอนนี้</button>}
      {s.pin && <button type="button" onClick={() => { const { pin, ...rest } = s; save(rest as SecuritySettings, 'ปิดการล็อกด้วย PIN แล้ว'); }}>ปิด PIN</button>}
    </div>
  </>);
}

function BackupTab() {
  const last = lastBackupAt();
  const d = daysSince(last);
  const run = () => {
    const blob = new Blob([JSON.stringify(buildBackup(store))], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'ADR-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); markBackup();
  };
  return (<>
    <p className="muted">สำรองข้อมูลล่าสุด: {last ? `${new Date(last).toLocaleString('th-TH')} (${d} วันก่อน)` : 'ยังไม่เคยสำรอง'} · แอปจะเตือนเมื่อเกิน 7 วัน</p>
    <p className="muted">ไฟล์สำรองมีข้อมูลผู้ป่วย (ชื่อ, HN) เก็บในที่ปลอดภัยและห้ามส่งทางแชตส่วนตัว</p>
    <div className="row"><button type="button" className="pri" onClick={run}>ดาวน์โหลดไฟล์สำรอง</button></div>
  </>);
}

function KeepTab({ s, save }: TabProps) {
  const [exp, setExp] = useState<Expired[] | null>(null); const [done, setDone] = useState('');
  const total = exp ? exp.reduce((n, e) => n + e.ids.length, 0) : 0;
  return (<>
    <p className="muted">กำหนดอายุการเก็บข้อมูล แล้วตรวจรายการที่เก็บเกินกำหนด (เคสแพ้ยา · intensive monitoring · บันทึกการให้ข้อมูล) การลบจะซิงก์ไปลบบนเซิร์ฟเวอร์ด้วย และกู้คืนไม่ได้นอกจากมีไฟล์สำรอง</p>
    <label className="fld"><span>เก็บข้อมูลกี่ปี</span><input id="sec-years" inputMode="numeric" value={s.retentionYears} onChange={(e) => save({ ...s, retentionYears: Math.max(1, Math.min(30, Number(e.target.value.replace(/\D/g, '')) || 1)) })} /></label>
    <div className="row"><button type="button" onClick={() => { setDone(''); setExp(findExpired(store, s.retentionYears)); }}>ตรวจรายการเกินกำหนด</button></div>
    {exp && (total === 0 ? <p className="muted">ไม่มีรายการเกินกำหนด</p> : (<>
      <ul className="muted">{exp.map((e) => <li key={e.key}>{e.label}: {e.ids.length} รายการ</li>)}</ul>
      <div className="row"><button type="button" className="danger" onClick={() => { const n = purgeExpired(store, exp); setExp(null); setDone(`ลบแล้ว ${n} รายการ`); }}>ลบ {total} รายการนี้ถาวร</button></div>
    </>))}
    {done && <p className="muted" role="status">{done}</p>}
  </>);
}

function AuditTab() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof store.auditList>> | null>(null);
  useEffect(() => { void store.auditList(200).then(setRows); }, []);
  const csv = async () => {
    const all = await store.auditAll();
    const q = (x: unknown) => '"' + String(x ?? '').replace(/"/g, '""') + '"';
    const text = '﻿เวลา,ผู้ใช้,การกระทำ,ชุดข้อมูล,รหัสรายการ\n' + all.map((r) => [new Date(r.at).toISOString(), r.user, r.action, r.collection, r.recordId].map(q).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a');
    a.href = url; a.download = 'audit-log-' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  return (<>
    <p className="muted">บันทึกว่าใครเพิ่ม/แก้ไข/ลบรายการอะไรเมื่อไร (เก็บเฉพาะในเครื่องนี้ · ใช้รหัสรายการ ไม่มีชื่อหรือ HN ผู้ป่วย)</p>
    <div className="auditlist" tabIndex={0}>
      {!rows ? 'กำลังโหลด…' : rows.length === 0 ? 'ยังไม่มีประวัติ' : rows.map((r) => (
        <div key={r.id} className="arow"><span>{new Date(r.at).toLocaleString('th-TH')}</span><span>{r.user || '(ไม่ระบุผู้ใช้)'}</span><b>{r.action}</b><span>{r.collection} · {r.recordId}</span></div>))}
    </div>
    <div className="row"><button type="button" onClick={csv}>ส่งออก CSV (ทั้งหมด)</button></div>
  </>);
}

function FormulaTab() {
  return (<>
    <p className="muted">สูตรคำนวณเวอร์ชัน <b>{FORMULA_VERSION}</b> — เทสต์อัตโนมัติยืนยันว่าผลตรงกับต้นแบบ <b>แต่ยังไม่ได้ยืนยันความถูกต้องทางคลินิก</b> ต้องให้เภสัชกรผู้เชี่ยวชาญตรวจตามเอกสาร <code>docs/CLINICAL-VALIDATION.md</code> และลงนามก่อนใช้กับผู้ป่วยจริง</p>
    <div className="auditlist">
      {VALIDATION.map((v) => (
        <div key={v.id} className="arow" style={{ gridTemplateColumns: '1fr auto' }}>
          <span>{v.name}<br /><small>{v.reference}</small></span>
          <b style={{ color: v.status === 'approved' ? '#2E7D5B' : '#A66A00' }}>{v.status === 'approved' ? `ตรวจแล้ว · ${v.reviewer} · ${v.reviewedAt}` : 'ยังไม่ได้ตรวจสอบ'}</b>
        </div>))}
    </div>
  </>);
}

export { userDisplay };
