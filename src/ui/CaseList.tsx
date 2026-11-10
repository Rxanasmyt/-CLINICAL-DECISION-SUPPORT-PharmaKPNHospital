// รายการเคสที่บันทึกไว้ (แยกจากฟอร์ม): ค้นหา HN/ชื่อ/ยา · กรองไตรมาสและงานค้าง · แบ่งหน้า · ลบแบบยืนยัน + เลิกทำ
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FLAGS, filterRows, paginate, toRow, type Flag } from './caseView';
import type { TodoItem } from './todos';
import { hashHn } from '../storage/pdpa';
import { loadSettings } from '../storage/settings';
import { duplicateKeys, hnKey } from '../storage/caseIdentity';

interface Props { cases: any[]; initialFlag?: Flag; open: boolean; close: () => void; onOpen: (c: any) => void; onDelete: (c: any) => void; onRestore: (c: any) => void }

export function CaseListModal({ cases, initialFlag = 'all', open, close, onOpen, onDelete, onRestore }: Props) {
  const [q, setQ] = useState(''); const [quarter, setQuarter] = useState(''); const [flag, setFlag] = useState<Flag>('all');
  const [page, setPage] = useState(1); const [confirm, setConfirm] = useState<string | null>(null);
  const [undo, setUndo] = useState<any | null>(null); const [hnHash, setHnHash] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dupIds, setDupIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    let live = true;
    void (async () => {
      const salt = loadSettings().salt, dk = await duplicateKeys(cases, salt), ids = new Set<string>();
      for (const c of cases) { const k = await hnKey(c?.data?.pt?.hn, salt); if (k && dk.has(k)) ids.add(String(c.cid ?? c.id)); }
      if (live) setDupIds(ids);
    })();
    return () => { live = false; };
  }, [cases]);
  const rows = useMemo(() => cases.map((c) => toRow(c, { dup: dupIds.has(String(c.cid ?? c.id)) })), [cases, dupIds]);
  const quarters = useMemo(() => Array.from(new Set(rows.map((r) => r.quarter).filter(Boolean))), [rows]);
  // ค้นด้วย HN ได้แม้เป็นเคสจากเครื่องอื่น (ในเครื่องนี้ HN เป็นค่าเข้ารหัส): hash คำค้นด้วย salt เดียวกันแล้วเทียบ
  useEffect(() => {
    const s = loadSettings().salt, t = q.trim();
    if (!s || !/^\d{3,}$/.test(t)) { setHnHash(''); return; }
    let live = true; void hashHn(t, s).then((h) => { if (live) setHnHash(h); });
    return () => { live = false; };
  }, [q]);
  useEffect(() => { setPage(1); }, [q, quarter, flag, hnHash]);
  useEffect(() => { if (open) { setFlag(initialFlag); setQ(''); setQuarter(''); } }, [open, initialFlag]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  if (!open) return null;

  const list = filterRows(rows, { q, hnHash, quarter, flag });
  const pg = paginate(list, page);
  const del = (r: ReturnType<typeof toRow>) => {
    setConfirm(null); onDelete(r.raw); setUndo(r.raw);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setUndo(null), 8000);
  };
  return createPortal(
    <div className="modal" data-print="hide" onClick={close}>
      <div className="card caselist" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="รายการเคสที่บันทึกไว้">
        <div className="clhead"><h2>เคสที่บันทึกไว้ · {cases.length} เคส</h2><button type="button" onClick={close}>ปิด</button></div>
        <input id="case-search" className="clsearch" type="search" placeholder="ค้นหา HN · ชื่อ · ยาที่สงสัย · อาการ" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <div className="clfilters">
          <select id="case-quarter" value={quarter} onChange={(e) => setQuarter(e.target.value)} aria-label="ไตรมาส">
            <option value="">ทุกไตรมาส</option>{quarters.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
          {FLAGS.map(([k, l]) => <button key={k} type="button" className={flag === k ? 'on' : ''} onClick={() => setFlag(k)}>{l}</button>)}
        </div>
        {undo && <div className="clundo" role="status">ลบเคสแล้ว <button type="button" onClick={() => { onRestore(undo); setUndo(null); }}>เลิกทำ</button></div>}
        <div className="clrows">
          {pg.items.length === 0 && <p className="muted">{cases.length === 0 ? 'ยังไม่มีเคสที่บันทึกไว้ — กรอกฟอร์มแล้วกด "บันทึกเคส"' : 'ไม่พบเคสที่ตรงกับเงื่อนไข'}</p>}
          {pg.items.map((r) => (
            <div key={r.key} className="clrow">
              <button type="button" className="clmain" onClick={() => { onOpen(r.raw); close(); }}>
                <b>{r.title}</b>
                <span>{r.date} · {r.drugs}</span>
                <span>{r.assess}</span>
                {r.chips.length > 0 && <span className="clchips">{r.chips.map((c) => <i key={c}>{c}</i>)}</span>}
              </button>
              {confirm === r.key
                ? <span className="clconf">ลบเคสนี้?<button type="button" className="danger" onClick={() => del(r)}>ลบ</button><button type="button" onClick={() => setConfirm(null)}>ยกเลิก</button></span>
                : <button type="button" className="cldel" aria-label="ลบเคส" onClick={() => setConfirm(r.key)}>ลบ</button>}
            </div>
          ))}
        </div>
        {pg.pages > 1 && (
          <div className="clpager">
            <button type="button" disabled={pg.page <= 1} onClick={() => setPage(pg.page - 1)}>ก่อนหน้า</button>
            <span>หน้า {pg.page}/{pg.pages} · {list.length} เคส</span>
            <button type="button" disabled={pg.page >= pg.pages} onClick={() => setPage(pg.page + 1)}>ถัดไป</button>
          </div>
        )}
      </div>
    </div>, document.body);
}

/** ปุ่มแทนรายการเคสในแผงฟอร์ม + เคสล่าสุด 3 รายการ */
export function CaseShelf({ cases, open, onOpen }: { cases: any[]; open: () => void; onOpen: (c: any) => void }) {
  const recent = useMemo(() => cases.slice(0, 3).map((c) => toRow(c)), [cases]);
  return (
    <div className="shelf">
      <button type="button" className="shelfbtn" onClick={open}>เคสที่บันทึกไว้ ({cases.length}) — ค้นหา / เปิดดู</button>
      {recent.map((r) => (
        <button key={r.key} type="button" className="shelfrow" onClick={() => onOpen(r.raw)}>
          <b>{r.title}</b><span>{r.date} · {r.drugs}</span>
        </button>
      ))}
    </div>
  );
}

/** งานค้างวันนี้ (หน้าแรก) — กดที่รายการเพื่อไปยังเคส/ทะเบียนที่เกี่ยวข้อง */
export function TodoBoard({ todos, openCases, openIntensive }: { todos: TodoItem[]; openCases: (f: Flag) => void; openIntensive: () => void }) {
  const tone = { red: ['#FBEAE8', '#B3261E'], amber: ['#FBF1DE', '#A66A00'], blue: ['#E4EEF7', '#2F6DA8'] } as const;
  return (
    <section className="todoboard" data-print="hide" aria-label="งานค้างวันนี้">
      <div className="tdhead"><h2>งานค้างวันนี้</h2><span>{todos.length ? `${todos.reduce((n, t) => n + t.count, 0)} รายการที่ต้องติดตาม` : 'ไม่มีงานค้าง'}</span></div>
      {todos.length === 0
        ? <p className="tdok">ไม่มีงานค้าง — เคสที่บันทึกไว้ไม่มีรายการรอส่ง HPVC, RCA ที่ยังไม่ครบ หรือผู้ป่วย intensive ที่ถึงกำหนดติดตาม</p>
        : (
          <div className="tdgrid">
            {todos.map((t) => (
              <button key={t.kind} type="button" className="tdcard" style={{ background: tone[t.tone][0], borderColor: tone[t.tone][1] + '55' }}
                onClick={() => (t.flag ? openCases(t.flag) : openIntensive())}>
                <b style={{ color: tone[t.tone][1] }}>{t.count}</b>
                <span><strong>{t.title}</strong><em>{t.examples.join(' · ')}{t.count > t.examples.length ? ` และอีก ${t.count - t.examples.length}` : ''}</em></span>
              </button>
            ))}
          </div>
        )}
    </section>
  );
}
