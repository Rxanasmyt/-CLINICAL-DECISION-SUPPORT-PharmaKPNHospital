// ข้อมูลยาในบัญชียา รพ. และตรวจอันตรกิริยา (DI) — เนื้อหาทางคลินิกคัดจากฉลากยา FDA (ภาษาอังกฤษต้นฉบับ) พร้อมที่มา
import { useEffect, useMemo, useState } from 'react';
import { CLASS_TH, ROUTE_TH, SECTION_TH, dailyMedUrl, effectiveTh, loadIndex, loadMonograph, loadShard, type DrugIndex, type DrugItem, type Monograph } from '../drugdata/load';
import { SEV_LABEL, checkPairs, type PairResult, type Shard } from '../drugdata/di';

const NOTE = 'ข้อมูลคัดจากฉลากยาที่ FDA สหรัฐฯ อนุมัติ (ภาษาอังกฤษต้นฉบับ ไม่ได้ปรับตามบริบทไทย) — ใช้ประกอบการตัดสินใจ ไม่ใช้แทนดุลยพินิจทางวิชาชีพ และยังไม่ได้ทบทวนโดยเภสัชกร';
const STATUS_TH: Record<string, string> = { mapped: 'มีข้อมูลฉลาก', manual: 'มีข้อมูลฉลาก', nonlabel: 'ไม่มีฉลากรายสารออกฤทธิ์', herbal: 'สมุนไพร/ชื่อไทย', unmapped: 'ยังจับคู่สารออกฤทธิ์ไม่ได้' };

function useIndex() {
  const [idx, setIdx] = useState<DrugIndex | null>(null); const [err, setErr] = useState('');
  useEffect(() => { let on = true; loadIndex().then((d) => on && setIdx(d)).catch((e) => on && setErr(String(e.message || e))); return () => { on = false; }; }, []);
  return { idx, err };
}
const norm = (s: string) => s.toLowerCase();
const hasData = (it: DrugItem) => it.ingredients.some((i) => i.hasLabel);

function Search({ idx, onPick, placeholder }: { idx: DrugIndex; onPick: (it: DrugItem) => void; placeholder: string }) {
  const [q, setQ] = useState(''); const [onlyData, setOnlyData] = useState(false); const [max, setMax] = useState(40);
  const res = useMemo(() => { const t = norm(q.trim()); return idx.items.filter((it) => (!onlyData || hasData(it)) && (!t || norm(it.name).includes(t) || it.ingredients.some((i) => i.name.includes(t)))); }, [idx, q, onlyData]);
  return (
    <div className="dsearch">
      <input type="search" className="clsearch" value={q} placeholder={placeholder} onChange={(e) => { setQ(e.target.value); setMax(40); }} autoComplete="off" />
      <label className="chk"><input type="checkbox" checked={onlyData} onChange={(e) => setOnlyData(e.target.checked)} /> เฉพาะรายการที่มีข้อมูลฉลาก</label>
      <p className="muted">{res.length} รายการ</p>
      <ul className="dlist">{res.slice(0, max).map((it) => (
        <li key={it.no}><button type="button" onClick={() => onPick(it)}>
          <b>{it.name}</b><small>{it.form || '—'} · {it.unit || '—'}</small>
          <span className="dtags">{it.had && <em className="tg had">HAD</em>}{it.notInFormulary && <em className="tg off">ไม่อยู่ในบัญชี รพ.</em>}<em className={'tg ' + (hasData(it) ? 'ok' : 'no')}>{hasData(it) ? 'มีข้อมูลฉลาก' : STATUS_TH[it.status] || '—'}</em></span>
        </button></li>))}</ul>
      {res.length > max && <button type="button" className="glbtn" onClick={() => setMax(max + 60)}>แสดงเพิ่ม</button>}
    </div>);
}

function Monograph_({ slug, route }: { slug: string; route: string }) {
  const [m, setM] = useState<Monograph | null>(null); const [err, setErr] = useState('');
  useEffect(() => { let on = true; setM(null); setErr(''); loadMonograph(slug).then((d) => on && setM(d)).catch((e) => on && setErr(String(e.message || e))); return () => { on = false; }; }, [slug]);
  if (err) return <p className="warnbox" role="alert">โหลดข้อมูลไม่สำเร็จ ({err}) — ต้องเชื่อมต่ออินเทอร์เน็ตครั้งแรก</p>;
  if (!m) return <p className="muted">กำลังโหลด…</p>;
  const label = m.labels.find((l) => l.route === route) || m.labels[0];
  if (!label) return <p className="warnbox">ไม่พบฉลากยาของ {m.ingredient} ในฐานข้อมูล FDA — ต้องใช้แหล่งข้อมูลอื่น</p>;
  const seen = new Set<string>(); const secs = SECTION_TH.filter(([k, th]) => { if (!label.sections[k] || seen.has(th)) return false; seen.add(th); return true; });
  return (
    <div className="dmono">
      <p className="muted">{m.classes.length ? 'กลุ่มยา: ' + m.classes.slice(0, 5).join(' · ') : ''}</p>
      <p className="muted dsrc">ที่มา: ฉลาก{ROUTE_TH[label.route] ? ' ' + ROUTE_TH[label.route] : ''} · {label.brands.join(', ') || m.ingredient} · {label.manufacturer} · ปรับปรุงฉลาก {effectiveTh(label.effective)} · <a href={dailyMedUrl(label.setid)} target="_blank" rel="noopener noreferrer">เปิดฉลากเต็มที่ DailyMed</a></p>
      {m.labels.length > 1 && <p className="muted">ยานี้มีฉลากอีก {m.labels.length - 1} รูปแบบ ({m.labels.filter((l) => l !== label).map((l) => ROUTE_TH[l.route] || l.route).join(', ')}) — เลือกจากรายการยาตามรูปแบบที่ใช้จริง</p>}
      {secs.map(([k, th]) => (
        <details key={k} open={k === 'boxed_warning' || k === 'contraindications'} className="dsec"><summary>{th}</summary>
          <p className="dtext">{label.sections[k].t}</p>{label.sections[k].trunc && <p className="muted">ข้อความยาว ตัดทอนไว้ — ดูฉบับเต็มที่ DailyMed</p>}</details>))}
    </div>);
}

function Detail({ it, onBack }: { it: DrugItem; onBack: () => void }) {
  const [pick, setPick] = useState(it.ingredients.find((i) => i.hasLabel)?.slug || it.ingredients[0]?.slug || '');
  return (
    <div className="ddetail">
      <button type="button" className="glback" onClick={onBack}>← รายการยา</button>
      <h3>{it.name}</h3>
      <p className="muted">{it.form || '—'} · {it.unit || '—'}{it.had ? ' · ยาความเสี่ยงสูง (HAD)' : ''}{it.notInFormulary ? ' · รายการนี้บันทึกว่าไม่อยู่ในบัญชียา รพ.' : ''}</p>
      {it.ingredients.length === 0 && <p className="warnbox">{it.why || 'ยังไม่มีข้อมูล'}</p>}
      {it.ingredients.length > 0 && <div className="gldchips">{it.ingredients.map((i) => <button key={i.slug} type="button" className={pick === i.slug ? 'on' : ''} onClick={() => setPick(i.slug)}>{i.name}{i.hasLabel ? '' : ' (ไม่มีฉลาก)'}</button>)}</div>}
      {pick && <Monograph_ slug={pick} route={it.route} />}
      <p className="muted dnote">{NOTE}</p>
    </div>);
}

export function DrugList() {
  const { idx, err } = useIndex(); const [it, setIt] = useState<DrugItem | null>(null);
  if (err) return <p className="warnbox" role="alert">โหลดบัญชียาไม่สำเร็จ ({err}) — ต้องเชื่อมต่ออินเทอร์เน็ตอย่างน้อยหนึ่งครั้ง</p>;
  if (!idx) return <p className="muted">กำลังโหลดบัญชียา…</p>;
  if (it) return <Detail it={it} onBack={() => setIt(null)} />;
  return <><p className="muted">{idx.items.length} รายการจากบัญชียา รพ. · {NOTE}</p><Search idx={idx} onPick={setIt} placeholder="ค้นชื่อยา/สารออกฤทธิ์ เช่น warfarin, amlodipine" /></>;
}

export function DiChecker() {
  const { idx, err } = useIndex(); const [sel, setSel] = useState<DrugItem[]>([]); const [shards, setShards] = useState<Record<string, Shard | undefined>>({}); const [busy, setBusy] = useState(false); const [serr, setSerr] = useState('');
  const ings = useMemo(() => Array.from(new Set(sel.flatMap((s) => s.ingredients.map((i) => i.name)))), [sel]);
  const slugOf = (n: string) => sel.flatMap((s) => s.ingredients).find((i) => i.name === n)?.slug || '';
  useEffect(() => {
    let on = true; const need = ings.filter((n) => !(n in shards));
    if (!need.length) return; setBusy(true); setSerr('');
    Promise.all(need.map((n) => loadShard(slugOf(n)).then((d) => [n, d] as const).catch(() => [n, undefined] as const)))
      .then((rs) => { if (!on) return; if (rs.some(([, d]) => !d)) setSerr('โหลดข้อมูล DI ของบางรายการไม่สำเร็จ (ไม่มีฉลากหรือออฟไลน์)'); setShards((s) => ({ ...s, ...Object.fromEntries(rs) })); setBusy(false); });
    return () => { on = false; };
  }, [ings]); // eslint-disable-line react-hooks/exhaustive-deps
  const res: PairResult[] = useMemo(() => (idx ? checkPairs(ings, shards, idx.membership, (k) => CLASS_TH[k] || k) : []), [ings, shards, idx]);
  if (err) return <p className="warnbox" role="alert">โหลดบัญชียาไม่สำเร็จ ({err})</p>;
  if (!idx) return <p className="muted">กำลังโหลด…</p>;
  const noLabel = sel.filter((s) => !hasData(s));
  return (
    <div className="ddi">
      <p className="muted">เลือกยาที่ผู้ป่วยใช้ร่วมกัน (จากบัญชียา รพ.) ระบบแสดงข้อความอันตรกิริยาและวิธีจัดการ <b>ตามถ้อยคำในฉลากยา FDA</b> ของแต่ละตัว · {NOTE}</p>
      <div className="gldchips">{sel.map((s) => <button key={s.no} type="button" className="on" onClick={() => setSel(sel.filter((x) => x.no !== s.no))} title="เอาออก">{s.name.slice(0, 34)} ✕</button>)}</div>
      <Search idx={idx} onPick={(it) => !sel.some((s) => s.no === it.no) && setSel([...sel, it])} placeholder="ค้นยาแล้วแตะเพื่อเพิ่ม" />
      {sel.length >= 2 && <section className="dres">
        <h3>ผลการตรวจ {busy ? '(กำลังโหลด…)' : ''}</h3>
        {serr && <p className="warnbox" role="alert">{serr}</p>}
        {noLabel.length > 0 && <p className="warnbox" role="alert">ไม่มีข้อมูลฉลากสำหรับ: {noLabel.map((s) => s.name).join(', ')} — ผลด้านล่างไม่ครอบคลุมยาเหล่านี้ ต้องตรวจจากแหล่งอื่น</p>}
        {!busy && res.length === 0 && <p className="dok">ไม่พบข้อความที่กล่าวถึงอันตรกิริยาระหว่างยาที่เลือกในหัวข้อที่ตรวจ <b>ซึ่งไม่ได้หมายความว่าไม่มีอันตรกิริยา</b> — ฉลากอาจไม่ได้กล่าวถึง หรือกล่าวถึงเป็นกลุ่มยาที่ระบบจับไม่ได้ ควรตรวจกับฐานข้อมูล DI มาตรฐาน</p>}
        {res.map((r) => (
          <article key={r.a + '|' + r.b} className={'dpair sv-' + r.sev}>
            <h4>{r.a} + {r.b}<span className={'dsev sv-' + r.sev}>{SEV_LABEL[r.sev]}</span></h4>
            {r.sides.map((sd, i) => sd.hits.map((h, k) => (
              <blockquote key={i + '-' + k}><small>จากฉลากของ <b>{sd.from}</b>{sd.via !== sd.about ? ` (กล่าวถึงเป็น ${sd.via})` : ''} · {h.sec.replace(/_/g, ' ')} · <a href={dailyMedUrl(h.setid)} target="_blank" rel="noopener noreferrer">ฉลาก</a></small><p>{h.t}</p></blockquote>)))}
          </article>))}
        <p className="muted">ระดับความรุนแรงจัดอัตโนมัติจากถ้อยคำในประโยคของฉลาก ไม่ใช่ระดับจากฐานข้อมูล DI — ผู้ใช้ต้องอ่านข้อความต้นฉบับและตัดสินใจร่วมกับเภสัชกร</p>
      </section>}
    </div>);
}
