// คลังแนวทางการรักษา: ค้นตามโรค/ตามยา · การ์ดสรุปเน้นยา · แนบไฟล์ต้นฉบับ (ในเครื่อง)
import { useEffect, useMemo, useRef, useState } from 'react';
import { GUIDELINES, reviewState, searchGuidelines } from '../guidelines/registry';
import type { Block, Guideline } from '../guidelines/types';
import { drugHits, DRUG_KIND_ORDER } from '../guidelines/drugs';
import { blockGroup, groupedBlocks, drugGroups } from '../guidelines/groups';
import type { DrugKind } from '../guidelines/drugs';
import { addFile, fmtSize, listFiles, removeFile } from '../guidelines/attachments';
import { CODE, DOI_CHECKED_AT, EVIDENCE, FOREIGN, FOREIGN_LABEL, LEVEL_LABEL, VERIFIED_DOI, groupCites, linkify } from '../guidelines/evidence';
import { DiChecker, DrugList } from './DrugInfo';
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
function Overview({ g, openDrug }: { g: Guideline; openDrug: (n: string) => void }) {
  const kv = g.blocks.find((b) => b.kind === 'kv') as Extract<Block, { kind: 'kv' }> | undefined;
  const drugs = g.blocks.find((b) => b.kind === 'drug') as Extract<Block, { kind: 'drug' }> | undefined;
  const danger = g.blocks.find((b) => b.kind === 'grid3' && b.danger) as Extract<Block, { kind: 'grid3' | 'grid5' }> | undefined;
  const dl = (g.drugs || []).filter((d) => drugHits(g, d.aliases).length);
  return (
    <div className="glov">
      {g.summary && g.summary.length > 0 && <section className="glsum"><h3>สรุปย่อ</h3><ul>{g.summary.map((t, i) => <li key={i}>{t}</li>)}</ul></section>}
      {dl.length > 0 && <section><h3>ยาในแนวทางนี้ — แตะชื่อยาเพื่อดูขนาด ข้อห้าม อันตรกิริยา การติดตาม</h3>
        {drugGroups({ ...g, drugs: dl }).map((gr) => <div key={gr.group} className="gldgrp"><h4>{gr.group}</h4><div className="gldchips">{gr.drugs.map((d) => <button key={d.name} type="button" onClick={() => openDrug(d.name)}>{d.name}</button>)}</div></div>)}</section>}
      {kv && <section><h3>{kv.h}</h3>{kv.sub && <p className="muted">{kv.sub}</p>}<div className="glchips">{kv.items.map((x) => <span key={x.k} className="glchip"><b>{x.k}</b>{x.v.split(' — ')[0]}</span>)}</div></section>}
      {drugs && <section><h3>ยาหลัก — ขนาดโดยย่อ</h3><div className="gltable"><table><thead><tr><th>ยา</th><th>ขนาด</th><th>สูงสุด</th></tr></thead>
        <tbody>{drugs.items.map((d) => <tr key={d.d}><td><b>{d.d}</b></td><td>{d.dose}</td><td>{d.max}</td></tr>)}</tbody></table></div></section>}
      {danger && <section><h3>{danger.h}</h3><ul className="gllist danger">{danger.items.map((r, i) => <li key={i}><b>{r.c1}</b> ({r.c2}) → {r.c3}</li>)}</ul></section>}
    </div>);
}


const KIND_CLS: Record<DrugKind, string> = { 'การ์ดยา': 'k-card', 'ขนาดยา': 'k-dose', 'การใช้/ข้อบ่งชี้': 'k-use', 'ข้อห้าม/ข้อควรระวัง': 'k-warn', 'อันตรกิริยา': 'k-ddi', 'ผลข้างเคียง': 'k-ae', 'การติดตาม': 'k-mon' };

/** มุมมองตามตัวยา: ยาแบ่งเป็นกลุ่ม → เลือกยาในกลุ่ม → เห็นทุกข้อความของแนวทางที่เกี่ยวกับยานั้น แยกตามหัวข้อ */
function DrugTab({ g, pick, setPick, goBlock }: { g: Guideline; pick: string; setPick: (n: string) => void; goBlock: (bi: number) => void }) {
  const list = useMemo(() => (g.drugs || []).map((d) => {
    const members = (d.members || []).map((m) => ({ d: m, hits: drugHits(g, m.aliases) })).filter((x) => x.hits.length);
    return { d, members, hits: drugHits(g, [...d.aliases, ...(d.members || []).flatMap((m) => m.aliases)]) };
  }).filter((x) => x.hits.length), [g]);
  const groups = useMemo(() => drugGroups({ ...g, drugs: list.map((x) => x.d) }), [g, list]);
  const top = list.find((x) => x.d.name === pick || x.members.some((m) => m.d.name === pick)) || list[0];
  if (!top) return <p className="muted">แนวทางนี้ยังไม่มีรายการยา</p>;
  const mem = top.members.find((m) => m.d.name === pick);
  const cur = mem ? { d: mem.d, hits: mem.hits } : { d: top.d, hits: top.hits };
  const kinds = DRUG_KIND_ORDER.filter((k) => cur.hits.some((h) => h.kind === k));
  const detail = (
    <div className="gldetail">
      {top.members.length > 0 && <div className="gldmem"><small>ยาแต่ละตัวในกลุ่ม {top.d.name}</small><div className="gldchips" role="tablist">
        <button type="button" role="tab" aria-selected={!mem} className={!mem ? 'on' : ''} onClick={() => setPick(top.d.name)}>ทั้งกลุ่ม<small>{top.hits.length}</small></button>
        {top.members.map((m) => <button key={m.d.name} type="button" role="tab" aria-selected={mem?.d.name === m.d.name} className={mem?.d.name === m.d.name ? 'on' : ''} onClick={() => setPick(m.d.name)}>{m.d.name}<small>{m.hits.length}</small></button>)}</div></div>}
      <h3 className="gldtitle">{mem ? top.d.name + ' › ' + cur.d.name : cur.d.name}</h3>
      {kinds.map((k) => (
        <section key={k} className={'gldgroup ' + KIND_CLS[k]}>
          <h4><span>{k}</span></h4>
          {cur.hits.filter((h) => h.kind === k).map((h, i) => h.card ? (
            <article key={i} className="gldrug"><h4>{h.card.d}</h4>
              <dl><dt>ขนาด</dt><dd>{h.card.dose} <small>{h.card.max}</small></dd><dt>ผลข้างเคียง</dt><dd>{h.card.ae}</dd><dt>ติดตาม/จัดการ</dt><dd>{h.card.mon}</dd></dl></article>
          ) : (
            <button key={i} type="button" className="gldline" onClick={() => goBlock(h.block)}>
              <small>{h.heading}</small>{h.label && <b>{h.label}</b>}<span>{h.text}</span></button>))}
        </section>))}
    </div>);
  return (
    <div className="gldrugtab">
      {groups.map((gr) => (
        <section key={gr.group} className="gldgrp">
          <h4>{gr.group}<small>{gr.drugs.length} รายการ</small></h4>
          <div className="gldchips" role="tablist" aria-label={'เลือกยาในกลุ่ม ' + gr.group}>{gr.drugs.map((d) => { const x = list.find((y) => y.d.name === d.name)!; return (
            <button key={d.name} type="button" role="tab" aria-selected={d.name === top.d.name} className={d.name === top.d.name ? 'on' : ''} onClick={() => setPick(d.name)}>{d.name}<small>{x.hits.length}</small></button>); })}</div>
          {gr.drugs.some((d) => d.name === top.d.name) && detail}
        </section>))}
    </div>);
}

/** เนื้อหาแนวทางแบบพับได้: ส่วน "การรักษา" และ "ความปลอดภัย" แต่ละหัวข้อเป็นแถบพับ */
function Accordion({ g, ids, openMap, setOpen }: { g: Guideline; ids: number[]; openMap: Record<number, boolean>; setOpen: (m: Record<number, boolean>) => void }) {
  const isOpen = (bi: number) => (bi in openMap ? openMap[bi] : bi === ids[0]);
  const all = ids.every((bi) => isOpen(bi));
  return (
    <div className="glacclist">
      <button type="button" className="glbtn glexp" onClick={() => setOpen({ ...openMap, ...Object.fromEntries(ids.map((bi) => [bi, !all])) })}>{all ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด'}</button>
      {ids.map((bi) => { const b = g.blocks[bi]; return (
        <details key={bi} id={'glb-' + bi} className="glsec glacc" open={isOpen(bi)} onToggle={(e) => { const o = (e.currentTarget as HTMLDetailsElement).open; if (o !== isOpen(bi)) setOpen({ ...openMap, [bi]: o }); }}>
          <summary><h3>{b.h}</h3></summary>
          {'sub' in b && b.sub && <p className="muted">{b.sub}</p>}<BlockView b={b} />
        </details>); })}
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

/** ป้ายระดับหลักฐานและสถานะทบทวน (ใช้ทั้งหัวการ์ดและรายการ) */
function EvBadges({ g, rs }: { g: Guideline; rs: string }) {
  const ev = EVIDENCE[g.id];
  return (
    <span className="glbadges">
      {FOREIGN.has(g.id) && <span className="glev rg-foreign">{FOREIGN_LABEL}</span>}
      {ev && <span className={'glev lv-' + ev.level}>{LEVEL_LABEL[ev.level]}</span>}
      <span className={'glev ' + (rs === 'ok' ? 'rv-ok' : 'rv-pending')}>{rs === 'ok' ? 'ทบทวนโดยเภสัชกรแล้ว' : 'รอเภสัชกรทบทวน'}</span>
    </span>);
}

function Linked({ text }: { text: string }) {
  return <>{linkify(text).map((s, i) => s.href
    ? <a key={i} href={s.href} target="_blank" rel="noopener noreferrer">{s.t}{s.verified ? <span className="glchk" title={'ตรวจ DOI กับ Europe PMC แล้ว ' + DOI_CHECKED_AT}> ✓</span> : null}</a>
    : <span key={i}>{s.t}</span>)}</>;
}

/** แท็บอ้างอิง: แหล่งอ้างอิง (ลิงก์ตรวจสอบได้) · การตรวจสอบเนื้อหา · ข้อจำกัด · สถานะการทบทวน */
function Evidence({ g, rs }: { g: Guideline; rs: string }) {
  const ev = EVIDENCE[g.id]; const c = groupCites(g);
  const checked = c.references.flatMap((r) => linkify(r)).filter((x) => x.verified).length;
  return (
    <div className="glevd">
      {ev && <section><h3>ระดับหลักฐาน</h3><p><span className={'glev lv-' + ev.level}>{LEVEL_LABEL[ev.level]}</span>{FOREIGN.has(g.id) && <span className="glev rg-foreign">{FOREIGN_LABEL}</span>}</p><p>{ev.basis}</p>{FOREIGN.has(g.id) && <p className="muted">จัดทำในต่างประเทศ ข้อมูลเชื้อดื้อยา ยาที่มีใช้ และแนวปฏิบัติในไทยอาจต่างกัน ต้องเทียบข้อมูลของ รพ. และแนวทางไทยก่อนใช้</p>}</section>}
      <section><h3>แหล่งอ้างอิง</h3>
        <ol className="glcites">{c.references.map((t, i) => <li key={i}><Linked text={t} /></li>)}</ol>
        {checked > 0 && <p className="muted">เครื่องหมาย ✓ = ตรวจ DOI กับฐานข้อมูล Europe PMC แล้วว่าตรงกับชื่อบทความ ปี และวารสาร (ตรวจเมื่อ {DOI_CHECKED_AT})</p>}</section>
      {c.verification.length > 0 && <section><h3>การตรวจสอบเนื้อหาและข้อสังเกตต่อต้นฉบับ</h3><ul className="glcites">{c.verification.map((t, i) => <li key={i}>{t}</li>)}</ul></section>}
      {c.limits.length > 0 && <section><h3>ข้อจำกัดและส่วนที่ไม่ครอบคลุม</h3><ul className="glcites">{c.limits.map((t, i) => <li key={i}>{t}</li>)}</ul></section>}
      <section><h3>สถานะการทบทวน</h3><p>{rs === 'ok' ? 'ทบทวนโดย ' + g.review.reviewer + (g.review.reviewedAt ? ' · ' + g.review.reviewedAt : '') : 'อยู่ระหว่างการทบทวนโดยเภสัชกร — ใช้ประกอบการตัดสินใจ ไม่ใช้แทนดุลยพินิจทางวิชาชีพ'}</p></section>
    </div>);
}

function Card({ g, back, goCalc }: { g: Guideline; back: () => void; goCalc: (m: string) => void }) {
  const [tab, setTab] = useState('ภาพรวม');
  const rs = reviewState(g.review, today());
  const [drugPick, setDrugPick] = useState('');
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const gb = useMemo(() => groupedBlocks(g), [g]);
  const tabs = ['ภาพรวม', ...(g.drugs?.length ? ['ยา'] : []), ...(gb.treat.length ? ['การรักษา'] : []), ...(gb.safety.length ? ['ความปลอดภัย'] : []), 'อ้างอิง', 'ไฟล์แนบ'];
  const goBlock = (bi: number) => {
    setTab(blockGroup(g.blocks[bi]) === 'treat' ? 'การรักษา' : 'ความปลอดภัย'); setOpenMap((m) => ({ ...m, [bi]: true }));
    setTimeout(() => document.getElementById('glb-' + bi)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const openDrug = (n: string) => { setDrugPick(n); setTab('ยา'); };
  return (
    <div className="glcard" style={{ ...({ '--gl': g.accent || '#0F5D57' } as React.CSSProperties) }}>
      <button type="button" className="glback" onClick={back}>← รายการแนวทาง</button>
      <header className="glhead">
        <span className="glicon" aria-hidden="true">{CODE[g.id] || 'Rx'}</span><div><span className="glcat">{g.category}</span><h2>{g.title}</h2><p className="muted">{g.source}</p><EvBadges g={g} rs={rs.kind} /></div>
      </header>
      {g.calc && <button type="button" className="glbtn pri" onClick={() => goCalc(g.calc!.mode)}>{g.calc.label} →</button>}
      <nav className="gltabs" role="tablist">{tabs.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
      {tab === 'ภาพรวม' && <Overview g={g} openDrug={openDrug} />}
      {tab === 'ยา' && <DrugTab g={g} pick={drugPick} setPick={setDrugPick} goBlock={goBlock} />}
      {tab === 'การรักษา' && <Accordion g={g} ids={gb.treat} openMap={openMap} setOpen={setOpenMap} />}
      {tab === 'ความปลอดภัย' && <Accordion g={g} ids={gb.safety} openMap={openMap} setOpen={setOpenMap} />}
      {tab === 'อ้างอิง' && <Evidence g={g} rs={rs.kind} />}
      {tab === 'ไฟล์แนบ' && <Attachments g={g} />}
    </div>);
}

const TOP_VIEWS: [string, string][] = [['gl', 'แนวทางรายโรค'], ['drug', 'ข้อมูลยา'], ['di', 'ตรวจอันตรกิริยา']];
export function GuidelineLibrary({ goCalc }: { goCalc: (mode: string) => void }) {
  const [top, setTop] = useState('gl');
  return (
    <div className="gltop">
      <nav className="glseg" role="tablist" aria-label="เลือกหมวด">{TOP_VIEWS.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={top === k} className={top === k ? 'on' : ''} onClick={() => setTop(k)}>{l}</button>)}</nav>
      {top === 'gl' && <Guidelines goCalc={goCalc} />}
      {top === 'drug' && <section className="gllib"><h2>ข้อมูลยาในบัญชี</h2><DrugList /></section>}
      {top === 'di' && <section className="gllib"><h2>ตรวจอันตรกิริยาระหว่างยา</h2><DiChecker /></section>}
    </div>);
}

function Guidelines({ goCalc }: { goCalc: (mode: string) => void }) {
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
            <button key={x.id} type="button" className="glitem" style={{ ...({ '--gl': x.accent || '#0F5D57' } as React.CSSProperties) }} onClick={() => setOpen(x.id)}>
              <span className="glicon" aria-hidden="true">{CODE[x.id] || 'Rx'}</span><b>{x.title}</b><span>{x.source}</span><EvBadges g={x} rs={reviewState(x.review, today()).kind} /></button>); })}</div></section>))}
      {!q.trim() && <p className="muted">ตอนนี้มีแนวทาง {GUIDELINES.length} เรื่อง — เพิ่มโรคอื่นตามลำดับความสำคัญของ รพ.</p>}
    </div>);
}
