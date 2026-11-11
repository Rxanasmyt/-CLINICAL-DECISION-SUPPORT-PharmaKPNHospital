// คลังแนวทางการรักษา: ค้นตามโรค/ตามยา · การ์ดสรุปเน้นยา · แนบไฟล์ต้นฉบับ (ในเครื่อง)
import { useEffect, useMemo, useRef, useState } from 'react';
import { GUIDELINES, reviewState, searchGuidelines } from '../guidelines/registry';
import type { Block, Guideline } from '../guidelines/types';
import { addFile, fmtSize, listFiles, removeFile } from '../guidelines/attachments';
import { store } from '../storage';
import type { FileRow } from '../storage/db';

const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const hl = (text: string, q: string) => {
  const t = q.trim(); if (!t) return text;
  const i = text.toLowerCase().indexOf(t.toLowerCase()); if (i < 0) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + t.length)}</mark>{text.slice(i + t.length)}</>;
};

function BlockView({ b }: { b: Block }) {
  if (b.kind === 'kv') return (
    <div className="glkv">{b.items.map((x) => (<div key={x.k} className="glkvrow"><b>{x.k}</b><span>{x.v}{x.note && <em>{x.note}</em>}</span></div>))}</div>);
  if (b.kind === 'list') return (<ul className={'gllist' + (b.danger ? ' danger' : '')}>{b.items.map((x, i) => <li key={i}>{x.t}</li>)}</ul>);
  if (b.kind === 'drug') return (
    <div className="gldrugs">{b.items.map((d) => (
      <article key={d.d} className="gldrug">
        <h4>{d.d}</h4>
        <dl><dt>ขนาด</dt><dd>{d.dose} <small>{d.max}</small></dd><dt>ผลข้างเคียง</dt><dd>{d.ae}</dd><dt>ติดตาม/จัดการ</dt><dd>{d.mon}</dd></dl>
      </article>))}</div>);
  const keys = b.kind === 'grid5' ? ['c1', 'c2', 'c3', 'c4', 'c5'] : ['c1', 'c2', 'c3'];
  return (
    <div className="gltable"><table className={b.danger ? 'danger' : ''}><thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{b.items.map((r, i) => <tr key={i}>{keys.map((k) => <td key={k}>{r[k]}</td>)}</tr>)}</tbody></table>
      {b.foot && <p className="glfoot">{b.foot}</p>}</div>);
}

/** สรุปหน้าเดียว: สูตรยา + ตารางยาแบบย่อ + อาการที่ต้องหยุดยา (ทุกข้อความมาจากข้อมูลของแนวทาง) */
function Overview({ g }: { g: Guideline }) {
  const kv = g.blocks.find((b) => b.kind === 'kv') as Extract<Block, { kind: 'kv' }> | undefined;
  const drugs = g.blocks.find((b) => b.kind === 'drug') as Extract<Block, { kind: 'drug' }> | undefined;
  const danger = g.blocks.find((b) => b.kind === 'grid3' && b.danger) as Extract<Block, { kind: 'grid3' | 'grid5' }> | undefined;
  return (
    <div className="glov">
      {kv && <section><h3>{kv.h}</h3>{kv.sub && <p className="muted">{kv.sub}</p>}<div className="glchips">{kv.items.map((x) => <span key={x.k} className="glchip"><b>{x.k}</b>{x.v.split(' — ')[0]}</span>)}</div></section>}
      {drugs && <section><h3>ยาหลัก — ขนาดโดยย่อ</h3><div className="gltable"><table><thead><tr><th>ยา</th><th>ขนาด</th><th>สูงสุด</th></tr></thead>
        <tbody>{drugs.items.map((d) => <tr key={d.d}><td><b>{d.d}</b></td><td>{d.dose}</td><td>{d.max}</td></tr>)}</tbody></table></div></section>}
      {danger && <section><h3>{danger.h}</h3><ul className="gllist danger">{danger.items.map((r, i) => <li key={i}><b>{r.c1}</b> ({r.c2}) → {r.c3}</li>)}</ul></section>}
    </div>);
}

function Attachments({ g }: { g: Guideline }) {
  const [files, setFiles] = useState<FileRow[]>([]); const [msg, setMsg] = useState(''); const input = useRef<HTMLInputElement>(null);
  const load = () => { void listFiles(store.db, g.id).then(setFiles); };
  useEffect(load, [g.id]);
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files || []); setMsg('');
    for (const f of fs) { const err = await addFile(store.db, g.id, f); if (err) { setMsg(f.name + ': ' + err); break; } }
    if (input.current) input.current.value = ''; load();
  };
  const open = (f: FileRow) => { const url = URL.createObjectURL(f.blob); window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 60_000); };
  return (
    <div className="glatt">
      <p className="muted">ไฟล์ที่แนบเก็บ <b>ในเครื่องนี้เท่านั้น</b> (ไม่ส่งขึ้นเว็บหรือ Google Sheets) ใช้ออฟไลน์ได้ · เครื่องอื่นต้องแนบเอง · ใช้กับเอกสารภายใน รพ. หรือที่มีลิขสิทธิ์ได้</p>
      {files.map((f) => (
        <div key={f.id} className="glfile"><button type="button" onClick={() => open(f)}><b>{f.name}</b><span>{fmtSize(f.size)} · แนบ {new Date(f.addedAt).toLocaleDateString('th-TH')}</span></button>
          <button type="button" className="cldel" onClick={() => { if (window.confirm('ลบไฟล์นี้ออกจากเครื่อง?')) void removeFile(store.db, f.id!).then(load); }}>ลบ</button></div>))}
      {files.length === 0 && <p className="muted">ยังไม่มีไฟล์แนบ</p>}
      <input ref={input} id="gl-file" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" multiple onChange={pick} hidden />
      <button type="button" className="glbtn" onClick={() => input.current?.click()}>แนบไฟล์ (PDF / รูป)</button>
      {msg && <p className="err" role="alert">{msg}</p>}
    </div>);
}

function Card({ g, back, goCalc }: { g: Guideline; back: () => void; goCalc: (m: string) => void }) {
  const [tab, setTab] = useState('ภาพรวม');
  const rs = reviewState(g.review, today());
  const tabs = ['ภาพรวม', ...g.sections.map((s) => s.title), 'อ้างอิง', 'ไฟล์แนบ'];
  const sec = g.sections.find((s) => s.title === tab);
  return (
    <div className="glcard">
      <button type="button" className="glback" onClick={back}>← รายการแนวทาง</button>
      <header className="glhead">
        <div><span className="glcat">{g.category}</span><h2>{g.title}</h2><p className="muted">{g.source}</p></div>
      </header>
      {g.calc && <button type="button" className="glbtn pri" onClick={() => goCalc(g.calc!.mode)}>{g.calc.label} →</button>}
      <nav className="gltabs" role="tablist">{tabs.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
      {tab === 'ภาพรวม' && <Overview g={g} />}
      {sec && sec.blocks.map((bi) => { const b = g.blocks[bi]; return <section key={bi} className="glsec"><h3>{b.h}</h3>{'sub' in b && b.sub && <p className="muted">{b.sub}</p>}<BlockView b={b} /></section>; })}
      {tab === 'อ้างอิง' && <><ol className="glcites">{g.cites.map((c, i) => <li key={i}>{c}</li>)}</ol><p className="muted glstatus">{rs.kind === 'ok' ? 'ทบทวนโดย ' + g.review.reviewer + (g.review.reviewedAt ? ' · ' + g.review.reviewedAt : '') : 'อยู่ระหว่างการทบทวนโดยเภสัชกร'}</p></>}
      {tab === 'ไฟล์แนบ' && <Attachments g={g} />}
    </div>);
}

export function GuidelineLibrary({ goCalc }: { goCalc: (mode: string) => void }) {
  const [q, setQ] = useState(''); const [open, setOpen] = useState<string | null>(null);
  const res = useMemo(() => searchGuidelines(q), [q]);
  const g = GUIDELINES.find((x) => x.id === open);
  if (g) return <Card g={g} back={() => setOpen(null)} goCalc={goCalc} />;
  const cats = Array.from(new Set(GUIDELINES.map((x) => x.category)));
  return (
    <div className="gllib">
      <h2>แนวทางการรักษา</h2>
      <p className="muted">ค้นตามโรคหรือชื่อยา เห็นภาพรวมและตารางยาในหน้าเดียว · แนบไฟล์แนวทางต้นฉบับไว้เปิดอ่านได้ในเครื่อง</p>
      <input id="gl-search" className="clsearch" type="search" placeholder="ค้นหาโรคหรือชื่อยา เช่น วัณโรค, rifampicin" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      {q.trim() ? (
        res.length === 0 ? <p className="muted">ไม่พบ “{q}” ในแนวทางที่มี</p> :
          res.map((r) => (
            <section key={r.guideline.id} className="glres">
              <button type="button" className="glrestitle" onClick={() => setOpen(r.guideline.id)}>{r.guideline.title} <small>{r.guideline.category}</small></button>
              {r.hits.slice(0, 8).map((h, i) => <button key={i} type="button" className="glhit" onClick={() => setOpen(r.guideline.id)}><small>{h.heading}</small><span>{hl(h.text, q)}</span></button>)}
              {r.hits.length > 8 && <p className="muted">และอีก {r.hits.length - 8} รายการ — เปิดแนวทางเพื่อดูทั้งหมด</p>}
            </section>))
      ) : cats.map((c) => (
        <section key={c}><h3 className="glcat2">{c}</h3>
          <div className="glgrid">{GUIDELINES.filter((x) => x.category === c).map((x) => { return (
            <button key={x.id} type="button" className="glitem" onClick={() => setOpen(x.id)}>
              <b>{x.title}</b><span>{x.source}</span></button>); })}</div></section>))}
      {!q.trim() && <p className="muted">ตอนนี้มีแนวทางตัวอย่าง 1 เรื่อง (วัณโรค) — เพิ่มโรคอื่นตามลำดับความสำคัญของ รพ.</p>}
    </div>);
}
