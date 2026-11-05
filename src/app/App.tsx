// พอร์ตจาก class Component ของต้นแบบ (PharmaCal-KPNHOSPITAL.dc.html) — คงตรรกะและข้อความตามต้นแบบ
// ฟังก์ชันคำนวณทางคลินิกถูกย้ายไปเป็นโมดูลพร้อม unit test ใน src/logic (เรียกใช้จากที่นี่)
/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { View } from '../ui/View.generated';
import { store } from '../storage';
import { BottomNav, AdrTabs } from '../ui/Chrome';
import { BackupBar, userDisplay } from '../ui/Security';
import { CaseListModal } from '../ui/CaseList';
import { markBackup } from '../security/backupReminder';
import { buildBackup, importBackup } from '../storage/backup';
import { C, BARCOL, SEV } from '../data/theme';
import { TB_ADULT, TB_CHILD, LTBI_INH_CHILD, LTBI_RPT_CHILD, FACTORS } from '../data/tb';
import { DAYS, PAT, WCOLOR } from '../data/warfarin';
import { PEDLIQ } from '../data/pediatric';
import { NARANJO, ALTCAUSE, CRIT, XREACT, ADVRULES, PREVQ, TRIGGERS, TRIG_CITE, SERIOUS, INT_GROUPS, DRUGPRESET, SXPRESET, LABPRESET } from '../data/adr';
import { STD_SRC, WL_FIELDS, REF_REVIEW } from '../data/standards';
import { STD } from '../data/standards-merged';
import * as REFS from '../data/references';
import { num, frac, pills, devices } from '../logic/shared';
import { computeTb, computeLtbi, band } from '../logic/tb';
import { wBand, mixedPlans, schedule, planDays, planDaysMixed, comboPills, comboTxt, comboShort } from '../logic/warfarin';
import { computePediatric } from '../logic/pediatric';
import { computeInsulin } from '../logic/insulin';
import { parseD, fmtD, dOf, tOf } from '../logic/dates';
import { latency, refAdvice, autoNaranjo, naranjoScore, whoUmc, prevScore } from '../logic/causality';
const { REF_RASH, REF_RASH_CITE, REF_PGX, REF_PGX_INTERVAL, REF_PGX_NOTES, REF_PGX_CITES, REF_TB_BLOCKS, REF_TB_CITES, REF_WF_BLOCKS, REF_WF_INR, REF_WF_TARGET, REF_WF_INTER, REF_WF_CITES, REF_BL_GROUPS, REF_BL_AVOID, REF_NSAID, REF_NSAID_CMP, REF_AED, REF_SULFA, REF_SULFA_NOTES, REF_CITES } = REFS;

export default class App extends React.Component<any, any> {
  state = {
    mode: null, tokens: [], entry: '0', done: false,
    calcTool: 'calc', cases: [], caseName: '', refTab: 'bl', refCite: false, refSecTb: 0, refSecWf: 0, refOpen: false, refQuery: '',
    dcMode: 'diff', dcFrom: '', dcTo: '', dcBase: '', dcOp: 'add', dcDays: '30',
    insUnits: '', insDays: '90', insSpare: true,
    pdWeight: '', pdAge: '', pdDrug: 'amox', pdReg: 0, pdDays: '', pdCat: null,
    weight: '55', ageGroup: 'adult', phase: 'intensive', factors: [], tbTrack: 'active',
    wDose: '21', inr: '2.4', wTarget: 'std', bleeding: 'none',
    noHalf: false, sameDaily: false, blockDays: false,
    adrView: 'split', adrScale: 'hour', adrTab: 'fill', narrow: false, caseListOpen: false,
    pt: {hn:'', name:'', age:'', sex:'', hx:''},
    drugs: [{id:1, name:'', dose:'', route:'', start:'', stop:'', suspect:true}],
    events: [{id:1, desc:'', onset:'', severity:'moderate', better:''}],
    labs: [{id:1, name:'', date:'', value:''}],
    naranjo: {},
    reactionType: '', outcome: 'recovering', pharmNote: '', seq: 3,
    altCauses: [], altNote: '', crit: {}, critOpen: '', pharmSign: '', doctorSign: '',
    genPick: ['card', 'hosxp', 'alt', 'edu'], prev: {}, triggers: [], regOpen: false, savedFlash: false,
    rep: {medErr: '', medErrNo: '', hpvc: '', hpvcDate: '', rcaCat: [], rcaCause: '', rcaPlan: '', rcaOwner: ''},
    regTab: 'ov', cqi: [], cqiEdit: null, importMsg: '',
    sev2: {type: '', serious: []}, stdA: {}, infoLog: [], intLog: [], ptcLog: [], infoNew: null, intNew: null, ptcDate: '', stdOpen: '', anonCsv: true, wlLog: [], wlMonth: '', wlDraft: null, pageK: 1, fitK: 1
  };

  componentDidMount() {
    this._onResize = () => this.measureSheet();
    window.addEventListener('resize', this._onResize);
    this._mq = window.matchMedia('(max-width:1024px)');
    this._mqf = () => this.setState({narrow: this._mq.matches});
    this._mq.addEventListener('change', this._mqf); this._mqf();
    this.observeWrap();
    this.measureSheet();
    this._kd = (e) => {
      if (this.mode() !== 'calc' || this.state.calcTool !== 'calc') return;
      const t = e.target && e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA') return;
      const k = e.key;
      if (/^[0-9]$/.test(k)) this.digit(k);
      else if (k === '.') this.digit('.');
      else if (k === '+' || k === '-') this.op(k);
      else if (k === '*') this.op('×');
      else if (k === '/') this.op('÷');
      else if (k === '%') this.pct();
      else if (k === 'Enter' || k === '=') this.eq();
      else if (k === 'Backspace') this.back();
      else if (k === 'Escape') this.clear();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', this._kd);
    try {
      window.localStorage.removeItem('adrDraft.v1');
      this.refreshFromStore();
      this._unsub = store.subscribe(() => this.refreshFromStore());
      window.localStorage.removeItem('adrDraft.v2');
      window.localStorage.removeItem('adrDraft.v3');
      this.setState({
        pt: {hn:'', name:'', age:'', sex:'', hx:''},
        drugs: [{id:1, name:'', dose:'', route:'', start:'', stop:'', suspect:true}],
        events: [{id:1, desc:'', onset:'', severity:'moderate', better:''}],
        labs: [{id:1, name:'', date:'', value:''}],
        naranjo: {}, reactionType: '', outcome: 'recovering', pharmNote: '',
        altCauses: [], altNote: '', crit: {}, pharmSign: userDisplay(), doctorSign: ''
      });
    } catch (e) {}
  }
  componentDidUpdate() {
    this.measureSheet();
    const s = this.state;
    try {
      window.localStorage.setItem('adrDraft.v3', JSON.stringify({
        pt: s.pt, drugs: s.drugs, events: s.events, labs: s.labs,
        naranjo: s.naranjo, reactionType: s.reactionType, outcome: s.outcome,
        altCauses: s.altCauses, altNote: s.altNote, crit: s.crit,
        pharmSign: s.pharmSign, doctorSign: s.doctorSign,
        pharmNote: s.pharmNote, seq: s.seq, adrScale: s.adrScale
      }));
    } catch (e) {}
  }
  observeWrap() {
    if (!this._wrapEl) return;
    if (!this._ro && window.ResizeObserver) this._ro = new window.ResizeObserver(() => this.measureSheet());
    if (this._ro && this._observed !== this._wrapEl) {
      this._ro.observe(this._wrapEl);
      this._observed = this._wrapEl;
    }
  }
  measureSheet() {
    const w = this._wrapEl, p = this._sheetEl, f = this._fitEl;
    if (!w || !p || !f) return;
    if (this._raf) window.clearTimeout(this._raf);
    this._raf = window.setTimeout(() => {
      this._raf = null;
      if (!this._wrapEl || !this._sheetEl || !this._fitEl) return;
      const pageW = this._sheetEl.offsetWidth, pageH = this._sheetEl.offsetHeight;
      const colW = this._wrapEl.clientWidth || pageW;
      const k = Math.min(1, colW / pageW);
      const pad = 2 * (11 / 297) * pageH;
      const availH = pageH - pad;
      const cur = this.state.fitK || 1;
      const contentH = this._fitEl.scrollHeight;
      const rendered = contentH * cur;
      let next = rendered > 0 ? Math.min(1, cur * Math.sqrt(availH / rendered)) : 1;
      next = Math.max(0.45, Math.round(next * 1000) / 1000);
      const st = this.state;
      const changed = Math.abs((st.pageK || 1) - k) > 0.002 || Math.abs(cur - next) > 0.004;
      if (changed) this.setState({pageK: k, fitK: next});
    }, 30);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this._kd);
    if (this._unsub) this._unsub();
    if (this._mq) this._mq.removeEventListener('change', this._mqf);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._ro) this._ro.disconnect();
    if (this._raf) window.clearTimeout(this._raf);
  }

  mode() { return this.state.mode === null ? (this.props.defaultMode || 'home') : this.state.mode; }
  loadCases() {
    return store.getJson('adrCases.v1', []);
  }
  saveCases(list) {
    store.setJson('adrCases.v1', list);
    this.setState({cases: list});
  }
  whoUmc() { return whoUmc(this.state); }
  prevScore() { return prevScore(this.state); }
  caseSummary() {
    const st = this.state, nj = this.naranjoScore(), who = this.whoUmc(), pv = this.prevScore();
    const on = st.events.map(e => this.parseD(e.onset)).filter(Boolean).sort((a, b) => a - b)[0];
    const ref = on || new Date();
    return {
      month: ref.getFullYear() + '-' + String(ref.getMonth() + 1).padStart(2, '0'),
      drugs: st.drugs.filter(d => d.suspect && d.name).map(d => d.name.trim()),
      events: st.events.filter(e => e.desc).map(e => e.desc),
      nj: nj.total, njCat: nj.total >= 9 ? 'definite' : (nj.total >= 5 ? 'probable' : (nj.total >= 1 ? 'possible' : 'doubtful')),
      who: who.k, prev: pv.k,
      severe: st.events.some(e => e.severity === 'severe') || ['sjs','dress','ana'].some(k => this.critFlag(k).met),
      repeat: nj.rows[8].val === 'y' || pv.rows[3].val === 'y',
      triggers: (st.triggers || []).slice(),
      type: st.reactionType || '', outcome: st.outcome || '',
      pharm: st.pharmSign || '',
      medErr: (st.rep || {}).medErr || '', hpvc: (st.rep || {}).hpvc || '',
      rca: pv.k === 'prev' ? (((st.rep || {}).rcaCause || '').trim() && ((st.rep || {}).rcaPlan || '').trim() ? 'done' : 'missing') : 'na',
      rcaCat: ((st.rep || {}).rcaCat || []).slice(),
      adrType: (st.sev2 || {}).type || '', serious: ((st.sev2 || {}).serious || []).length > 0
    };
  }
  ls(k, d) { return store.getJson(k, d); }
  lsSet(k, v, stKey) { store.setJson(k, v); this.setState({[stKey]: v}); }
  fyStart() { const n = new Date(); return new Date(n.getMonth() >= 9 ? n.getFullYear() : n.getFullYear() - 1, 9, 1); }
  stdEvidence() {
    const st = this.state;
    const sums = this.loadCases().map(c => c.sum).filter(Boolean);
    const cq = this.loadCqi();
    const info = st.infoLog || [], it = st.intLog || [], ptc = st.ptcLog || [];
    const fy = this.fyStart();
    const qs = new Set(sums.filter(x => x.month).map(x => this.qKey(x.month)));
    const avg = (k) => info.length ? (info.reduce((a, x) => a + (Number(x[k]) || 0), 0) / info.length).toFixed(1) : '—';
    const prevN = sums.filter(x => x.prev === 'prev').length;
    const ptcFy = ptc.filter(d => new Date(d) >= fy).length;
    const E = {
      datasets: 'ทะเบียน ADR ' + sums.length + ' ราย · intensive ' + it.length + ' ราย · การให้ข้อมูล ' + info.length + ' ครั้ง · CQI ' + cq.length + ' เรื่อง',
      collect: (sums.length + it.length + info.length) + ' รายการในระบบ',
      refs: REF_REVIEW.length + ' หมวด · ทบทวนล่าสุด ' + REF_REVIEW[0].d,
      info: 'ให้ข้อมูลด้านยาที่บันทึกไว้ ' + info.length + ' ครั้ง',
      pdpa: 'ข้อมูลเก็บในเครื่องนี้ · CSV ' + (st.anonCsv ? 'ไม่ระบุตัวตน' : 'ระบุตัวตน'),
      cqi: cq.length + ' โครงการ · เสร็จสิ้น ' + cq.filter(x => x.status === 'เสร็จสิ้น').length,
      link: 'เคสที่เชื่อม med error ' + sums.filter(x => x.medErr === 'yes').length + ' · ส่ง HPVC ' + sums.filter(x => x.hpvc === 'sent').length + ' · มี trigger ' + sums.filter(x => (x.triggers || []).length).length,
      r2r: 'R2R / วิจัย ' + cq.filter(x => x.type === 'R2R' || x.type === 'งานวิจัย').length + ' เรื่อง',
      outcome: 'โครงการที่มีผลหลังดำเนินการ ' + cq.filter(x => (x.after || '').trim()).length + ' เรื่อง',
      infoEval: info.length ? 'ประเมิน ' + info.length + ' ครั้ง · ความเข้าใจ ' + avg('und') + ' · พึงพอใจ ' + avg('sat') + ' (เต็ม 5)' : 'ยังไม่มีการประเมิน',
      cases: 'บันทึกเคสแล้ว ' + sums.length + ' ราย',
      srs: 'รายงาน ' + sums.length + ' ราย · ส่ง HPVC แล้ว ' + sums.filter(x => x.hpvc === 'sent').length + ' ราย',
      kpi: 'ตัวชี้วัด 7 ตัว · ข้อมูล ' + qs.size + ' ไตรมาส',
      typeAB: 'type B ' + sums.filter(x => x.adrType === 'B').length + ' · serious type A ' + sums.filter(x => x.adrType === 'A' && x.serious).length + ' · มีรายงาน ' + qs.size + ' ไตรมาส',
      intensive: it.length + ' ราย · ติดตามอยู่ ' + it.filter(x => x.status === 'ติดตามอยู่').length + ' · พบ ADR ' + it.filter(x => x.status === 'พบ ADR').length,
      causality: 'ประเมินแล้ว ' + sums.length + ' ราย (Naranjo + WHO-UMC)',
      prev: 'ประเมินครบ ' + sums.filter(x => x.prev !== 'pending').length + ' ราย · ป้องกันได้ ' + prevN,
      rca: 'RCA ครบ ' + sums.filter(x => x.rca === 'done').length + '/' + prevN + ' เคสที่ป้องกันได้ · เชื่อม med error ' + sums.filter(x => x.medErr === 'yes').length,
      ptc: 'นำเสนอปีงบนี้ ' + ptcFy + ' ครั้ง (เป้าหมาย 3–4)',
      workload: 'ตัวชี้วัดภาระงาน ' + (st.wlLog || []).length + ' เดือน'
    };
    E.datasets = 'ภาระงาน / med error / คลังยา ' + (st.wlLog || []).length + ' เดือน · ' + E.datasets;
    E.collect = E.collect + ' · ตัวชี้วัดภาระงาน ' + (st.wlLog || []).length + ' เดือน';
    const ok = {
      datasets: true, collect: sums.length + it.length + info.length > 0, refs: true, info: info.length > 0, pdpa: true,
      cqi: cq.length > 0, link: sums.length > 0, r2r: cq.some(x => x.type === 'R2R' || x.type === 'งานวิจัย'), outcome: cq.some(x => (x.after || '').trim()),
      infoEval: info.length > 0, cases: sums.length > 0, srs: sums.length > 0, kpi: sums.length > 0, typeAB: sums.some(x => x.adrType),
      intensive: it.length > 0, causality: sums.length > 0, prev: sums.some(x => x.prev !== 'pending'), rca: prevN === 0 ? sums.length > 0 : sums.filter(x => x.rca === 'done').length === prevN,
      ptc: ptcFy >= 3, workload: (st.wlLog || []).length > 0
    };
    ok.datasets = ok.datasets && (st.wlLog || []).length > 0;
    return {E, ok};
  }
  printStdReport() {
    const {E, ok} = this.stdEvidence();
    const A = this.state.stdA || {};
    const esc = (t) => String(t == null ? '' : t).replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[ch]);
    const stTxt = (a) => a.st === 'done' ? '✓ ดำเนินการแล้ว' : (a.st === 'doing' ? 'กำลังดำเนินการ' : 'ยังไม่ดำเนินการ');
    const block = STD.map(sd => {
      let reached = 0, stop = false;
      sd.levels.forEach(L => { const all = L.items.every(it => (A[it.id] || {}).st === 'done'); if (!stop && all) reached = L.lv; else stop = true; });
      return '<h2>ข้อ ' + sd.no + ' ' + esc(sd.title) + ' <span class="tag">เป้าหมายระดับ ' + sd.target + ' · ประเมินตนเองผ่านระดับ ' + reached + '</span></h2>'
        + '<table><tr><th style="width:7%">ข้อ</th><th>เกณฑ์ (แบบประเมิน พ.ศ. 2570)</th><th style="width:30%">หลักฐานจากแอป / เอกสาร</th><th style="width:13%">สถานะ</th></tr>'
        + sd.levels.map(L => '<tr class="lv"><td colspan="4">ระดับ ' + L.lv + '</td></tr>' + L.items.map(it => {
            const a = A[it.id] || {};
            return '<tr><td class="m">' + it.id.split('-')[1] + '</td><td>' + esc(it.t) + '</td><td>' + esc(it.app)
              + (it.ev ? '<div class="ev">ข้อมูลในระบบ: ' + esc(E[it.ev]) + '</div>' : '')
              + (a.note ? '<div class="note">หมายเหตุ: ' + esc(a.note) + '</div>' : '') + '</td><td class="' + (a.st === 'done' ? 'ok' : '') + '">' + stTxt(a) + '</td></tr>';
          }).join('')).join('') + '</table>';
    }).join('');
    const ptc = (this.state.ptcLog || []).slice().sort().map(d => this.fmtD(d, false)).join(' · ') || '—';
    const html = '<!doctype html><html lang="th"><head><meta charset="utf-8"><title>หลักฐานมาตรฐานความปลอดภัยด้านยา ข้อ 3 และ 9</title>'
      + '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">'
      + '<style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:"IBM Plex Sans Thai",sans-serif;color:#16211F;font-size:9.5pt;margin:0;line-height:1.5}'
      + 'h1{font-size:15pt;margin:0 0 2px}h2{font-size:11pt;margin:16px 0 6px}.tag{font-size:9pt;font-weight:600;color:#0F5D57;background:#E4EFEC;padding:2px 8px;border-radius:5px;margin-left:6px}'
      + 'table{width:100%;border-collapse:collapse}td,th{border:1px solid #d5d5d5;padding:5px 6px;text-align:left;vertical-align:top}th{background:#E4EFEC;font-size:9pt}tr{page-break-inside:avoid}'
      + '.lv td{background:#F4F1EA;font-weight:700}.m{font-family:"IBM Plex Mono",monospace}.ev{color:#0F5D57;font-size:8.5pt;margin-top:3px}.note{color:#6B7B77;font-size:8.5pt;margin-top:2px}.ok{color:#2E7D5B;font-weight:700}'
      + '.sub{color:#6B7B77;font-size:9pt}.sign{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:28px;font-size:9.5pt;color:#6B7B77}.sign div{border-top:1px solid #999;padding-top:5px}</style></head><body>'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #16211F;padding-bottom:8px">'
      + '<div><h1>สรุปหลักฐานการดำเนินงานมาตรฐานความปลอดภัยด้านยา ข้อ 3 และข้อ 9</h1><div class="sub">อ้างอิง ' + esc(STD_SRC) + '</div></div>'
      + '<div class="sub" style="text-align:right">' + esc(this.props.hospitalName || 'โรงพยาบาลกรงปินัง') + '<br>พิมพ์ ' + this.fmtD(new Date().toISOString().slice(0, 16), false) + '</div></div>'
      + block
      + '<h2>การนำเสนอคณะกรรมการ (ข้อ 9 · 3.6)</h2><div>' + esc(ptc) + '</div>'
      + '<h2>การทบทวนแหล่งข้อมูลอ้างอิง (ข้อ 3 · 3.3)</h2><table><tr><th>หมวด</th><th>แนวทางที่ใช้</th><th style="width:16%">ทบทวนล่าสุด</th></tr>'
      + REF_REVIEW.map(r => '<tr><td>' + esc(r.k) + '</td><td>' + esc(r.v) + '</td><td>' + esc(r.d) + '</td></tr>').join('') + '</table>'
      + '<div class="sign"><div>ผู้รับผิดชอบมาตรฐาน (เภสัชกร) / วันที่</div><div>หัวหน้ากลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค / วันที่</div></div>'
      + '<script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>';
    const w = window.open('', '_blank');
    if (!w) { window.alert('เบราว์เซอร์บล็อกหน้าต่างใหม่ — อนุญาต pop-up แล้วกดพิมพ์อีกครั้ง'); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }
  loadCqi() { return store.getJson('adrCqi.v1', []); }
  saveCqi(list) { store.setJson('adrCqi.v1', list); this.setState({cqi: list}); }
  qKey(month) { const [y, m] = month.split('-').map(Number); return y + '-Q' + (Math.floor((m - 1) / 3) + 1); }
  qLabel(k) { const [y, q] = k.split('-Q'); return 'Q' + q + '/' + String(Number(y) + 543).slice(2); }
  quarterTrend() {
    const sums = this.loadCases().map(c => c.sum).filter(Boolean);
    const now = new Date();
    const out = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i * 3, 1);
      const k = d.getFullYear() + '-Q' + (Math.floor(d.getMonth() / 3) + 1);
      if (out.some(x => x.k === k)) continue;
      const xs = sums.filter(x => x.month && this.qKey(x.month) === k);
      out.push({k, label: this.qLabel(k), n: xs.length,
        prev: xs.filter(x => x.prev === 'prev').length,
        sev: xs.filter(x => x.severe).length,
        rep: xs.filter(x => x.repeat).length,
        hpvc: xs.filter(x => x.hpvc === 'sent').length});
    }
    return out;
  }
  backupJson() {
    const data = buildBackup(store);
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    markBackup();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ADR-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  importJson(file) {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const r = importBackup(store, JSON.parse(rd.result));
        this.refreshFromStore();
        this.setState({importMsg: 'รวมไฟล์สำเร็จ — เพิ่มเคสใหม่ ' + r.cases + ' ราย · โครงการ CQI ' + r.cqi + ' เรื่อง (ข้ามรายการที่ซ้ำแล้ว)'});
      } catch (e) {
        this.setState({importMsg: 'ไฟล์ไม่ถูกต้อง — ใช้ไฟล์ .json ที่ส่งออกจากปุ่ม "สำรองข้อมูล" ของแอปนี้เท่านั้น'});
      }
    };
    rd.readAsText(file);
  }
  /** ดึงข้อมูลที่บันทึกไว้จาก store เข้า state (หลังนำเข้าไฟล์ หรือหลัง sync รวมข้อมูลจากเครื่องอื่น) */
  refreshFromStore() {
    this.setState({cases: this.loadCases(), cqi: this.loadCqi(), stdA: this.ls('stdAssess.v1', {}), infoLog: this.ls('infoEval.v1', []), intLog: this.ls('intensive.v1', []), ptcLog: this.ls('ptcMeet.v1', []), wlLog: this.ls('workload.v1', [])});
  }
  printQuarterReport() {
    const R = this.registry(), T = this.quarterTrend(), cq = this.loadCqi();
    const sums = this.loadCases().map(c => c.sum).filter(Boolean);
    const now = new Date();
    const qk = now.getFullYear() + '-Q' + (Math.floor(now.getMonth() / 3) + 1);
    const qs = sums.filter(x => x.month && this.qKey(x.month) === qk);
    const n = qs.length;
    const c = (f) => qs.filter(f).length;
    const pct = (a, b) => b ? Math.round(a / b * 100) + '%' : '—';
    const prevN = c(x => x.prev === 'prev');
    const esc = (t) => String(t == null ? '' : t).replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[ch]);
    const drugMap = {};
    qs.forEach(x => x.drugs.forEach(d => { const k = d.toLowerCase(); drugMap[k] = drugMap[k] || {name: d, n: 0}; drugMap[k].n++; }));
    const top = Object.values(drugMap).sort((a, b) => b.n - a.n).slice(0, 5);
    const maxT = Math.max(1, ...T.map(t => t.n));
    const rcaCats = {};
    qs.forEach(x => (x.rcaCat || []).forEach(k => { rcaCats[k] = (rcaCats[k] || 0) + 1; }));
    const kpi = [
      ['จำนวนรายงาน ADR', n + ' ราย', ''],
      ['ADR ที่ป้องกันได้', prevN + ' ราย (' + pct(prevN, n) + ')', ''],
      ['ทำ RCA ครบในเคสที่ป้องกันได้', c(x => x.rca === 'done') + '/' + prevN + ' (' + pct(c(x => x.rca === 'done'), prevN) + ')', 'เป้าหมาย 100%'],
      ['ADR รุนแรง', c(x => x.severe) + ' ราย', ''],
      ['แพ้ยาซ้ำ', c(x => x.repeat) + ' ราย', 'เป้าหมาย 0 ราย'],
      ['ส่งรายงาน อย./HPVC แล้ว', c(x => x.hpvc === 'sent') + '/' + n + ' (' + pct(c(x => x.hpvc === 'sent'), n) + ')', ''],
      ['เชื่อมรายงาน med error ของ รพ.', c(x => x.medErr === 'yes') + ' ราย', 'เฉพาะเคสที่ป้องกันได้']
    ];
    const html = '<!doctype html><html lang="th"><head><meta charset="utf-8"><title>รายงาน ADR ' + this.qLabel(qk) + '</title>'
      + '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">'
      + '<style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:"IBM Plex Sans Thai",sans-serif;color:#16211F;font-size:11pt;margin:0}'
      + 'h1{font-size:16pt;margin:0 0 2px}h2{font-size:11.5pt;margin:14px 0 6px;padding-bottom:3px;border-bottom:1px solid #ccc}'
      + 'table{width:100%;border-collapse:collapse;font-size:10pt}td,th{border:1px solid #d5d5d5;padding:5px 7px;text-align:left;vertical-align:top}th{background:#E4EFEC}'
      + '.m{font-family:"IBM Plex Mono",monospace}.sub{color:#6B7B77;font-size:9.5pt}.bars{display:flex;gap:10px;align-items:flex-end;height:90px;margin-top:6px}'
      + '.bar{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;height:100%;font-size:9pt}.bar i{display:block;width:70%;background:#0F5D57;border-radius:3px 3px 0 0}'
      + '.sign{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:26px;font-size:10pt;color:#6B7B77}.sign div{border-top:1px solid #999;padding-top:5px}</style></head><body>'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #16211F;padding-bottom:8px">'
      + '<div><h1>รายงานสรุปอาการไม่พึงประสงค์จากการใช้ยา ' + this.qLabel(qk) + '</h1><div class="sub">เสนอคณะกรรมการเภสัชกรรมและการบำบัด (PTC) · มาตรฐานความปลอดภัยด้านยา ข้อ 9</div></div>'
      + '<div class="sub" style="text-align:right">' + esc(this.props.hospitalName || 'โรงพยาบาลกรงปินัง') + '<br>พิมพ์ ' + this.fmtD(now.toISOString().slice(0, 16), false) + '</div></div>'
      + '<h2>1. ตัวชี้วัดไตรมาสนี้</h2><table><tr><th>ตัวชี้วัด</th><th style="width:30%">ผล</th><th style="width:24%">หมายเหตุ</th></tr>'
      + kpi.map(k => '<tr><td>' + k[0] + '</td><td class="m">' + k[1] + '</td><td class="sub">' + k[2] + '</td></tr>').join('') + '</table>'
      + '<h2>2. แนวโน้มรายไตรมาส</h2><table><tr><th>ไตรมาส</th>' + T.map(t => '<th class="m">' + t.label + '</th>').join('') + '</tr>'
      + [['รายงาน ADR', 'n'], ['ป้องกันได้', 'prev'], ['รุนแรง', 'sev'], ['แพ้ยาซ้ำ', 'rep'], ['ส่ง HPVC', 'hpvc']].map(([l, k]) => '<tr><td>' + l + '</td>' + T.map(t => '<td class="m">' + t[k] + '</td>').join('') + '</tr>').join('') + '</table>'
      + '<div class="bars">' + T.map(t => '<div class="bar"><span class="m">' + t.n + '</span><i style="height:' + Math.max(t.n / maxT * 70, 2) + 'px"></i><span>' + t.label + '</span></div>').join('') + '</div>'
      + '<h2>3. ยาที่เป็นสาเหตุและสาเหตุรากที่พบ</h2><table><tr><th>ยาที่สงสัยพบบ่อย</th><th style="width:14%">ราย</th><th>หมวดสาเหตุราก (RCA)</th><th style="width:14%">ราย</th></tr>'
      + Array.from({length: Math.max(top.length, Object.keys(rcaCats).length, 1)}).map((_, i) => {
          const d = top[i], rk = Object.keys(rcaCats)[i];
          return '<tr><td>' + (d ? esc(d.name) : (i ? '' : '—')) + '</td><td class="m">' + (d ? d.n : '') + '</td><td>' + (rk ? esc(rk) : (i ? '' : '—')) + '</td><td class="m">' + (rk ? rcaCats[rk] : '') + '</td></tr>';
        }).join('') + '</table>'
      + '<h2>4. โครงการพัฒนาคุณภาพ (CQI)</h2>'
      + (cq.length ? '<table><tr><th>โจทย์จากข้อมูล</th><th>มาตรการ</th><th style="width:18%">ตัวชี้วัด</th><th style="width:16%">ก่อน → หลัง</th><th style="width:11%">สถานะ</th></tr>'
        + cq.map(x => '<tr><td><b>' + esc(x.title) + '</b><div class="sub">' + esc(x.problem) + '</div></td><td>' + esc(x.measure) + '</td><td>' + esc(x.indicator) + '</td><td class="m">' + esc(x.before || '—') + ' → ' + esc(x.after || '—') + '</td><td>' + esc(x.status) + '</td></tr>').join('') + '</table>'
        : '<div class="sub">ยังไม่มีโครงการ CQI ที่บันทึกไว้</div>')
      + '<div class="sign"><div>ผู้จัดทำรายงาน (เภสัชกร) / วันที่</div><div>ประธานคณะกรรมการ PTC / วันที่</div></div>'
      + '<script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>';
    const w = window.open('', '_blank');
    if (!w) { this.setState({importMsg: 'เบราว์เซอร์บล็อกหน้าต่างใหม่ — อนุญาต pop-up แล้วกดพิมพ์อีกครั้ง'}); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }
  registry() {
    const cases = this.loadCases();
    const sums = cases.map(c => c.sum).filter(Boolean);
    const n = sums.length;
    const pct = (x) => n ? Math.round(x / n * 100) + '%' : '—';
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      const TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
      months.push({key, label: TH[d.getMonth()] + ' ' + String(d.getFullYear() + 543).slice(2), n: sums.filter(x => x.month === key).length});
    }
    const maxM = Math.max(1, ...months.map(x => x.n));
    const count = (f) => sums.filter(f).length;
    const drugMap = {};
    sums.forEach(x => (x.drugs || []).forEach(d => { const k = d.toLowerCase(); drugMap[k] = drugMap[k] || {name: d, n: 0}; drugMap[k].n++; }));
    const topDrugs = Object.values(drugMap).sort((a, b) => b.n - a.n).slice(0, 6);
    const trig = TRIGGERS.map(t => ({t: t.t, n: count(x => (x.triggers || []).indexOf(t.id) >= 0)})).filter(t => t.n > 0).sort((a, b) => b.n - a.n);
    const quarter = (() => { const q = Math.floor(now.getMonth() / 3); const keys = [0,1,2].map(i => now.getFullYear() + '-' + String(q * 3 + i + 1).padStart(2, '0')); return count(x => keys.indexOf(x.month) >= 0); })();
    return {
      n, legacy: cases.length - n, quarter,
      months: months.map(x => ({label: x.label, n: String(x.n), h: Math.max(x.n / maxM * 100, x.n ? 8 : 2) + '%', op: x.n ? '1' : '.35'})),
      kpis: [
        {k:'เคสทั้งหมด', v: String(n), sub: 'ไตรมาสนี้ ' + quarter + ' ราย', fg:'#0F5D57'},
        {k:'ป้องกันได้ (Schumock)', v: pct(count(x => x.prev === 'prev')), sub: count(x => x.prev === 'prev') + ' ราย · ประเมินแล้ว ' + count(x => x.prev !== 'pending') + ' ราย', fg:'#B3261E'},
        {k:'ADR รุนแรง', v: String(count(x => x.severe)), sub: pct(count(x => x.severe)) + ' ของเคสทั้งหมด', fg:'#B3261E'},
        {k:'แพ้ยาซ้ำ', v: String(count(x => x.repeat)), sub: 'ตัวชี้วัดที่ผู้ตรวจขอดู · เป้าหมาย 0 ราย', fg: count(x => x.repeat) ? '#B3261E' : '#2E7D5B'},
        {k:'ทำ RCA ครบ', v: count(x => x.rca === 'done') + '/' + count(x => x.rca !== 'na'), sub: 'เฉพาะเคสที่ป้องกันได้ · เป้าหมาย 100%', fg: count(x => x.rca === 'missing') ? '#A66A00' : '#2E7D5B'},
        {k:'ส่ง อย./HPVC แล้ว', v: pct(count(x => x.hpvc === 'sent')), sub: count(x => x.hpvc === 'sent') + ' ราย · รอส่ง ' + count(x => x.hpvc === 'pending') + ' ราย', fg:'#0F5D57'},
        {k:'เข้าระบบ med error', v: String(count(x => x.medErr === 'yes')), sub: 'ยังไม่รายงาน ' + count(x => x.medErr === 'no') + ' ราย', fg: count(x => x.medErr === 'no') ? '#A66A00' : '#0F5D57'}
      ],
      nar: [['definite','Definite (≥ 9)'],['probable','Probable (5–8)'],['possible','Possible (1–4)'],['doubtful','Doubtful (≤ 0)']].map(([k, l]) => ({l, n: String(count(x => x.njCat === k)), w: n ? (count(x => x.njCat === k) / n * 100) + '%' : '0%'})),
      who: [['certain','Certain'],['probable','Probable / Likely'],['possible','Possible'],['unlikely','Unlikely'],['cond','Conditional'],['unclass','Unclassifiable']].map(([k, l]) => ({l, n: String(count(x => x.who === k)), w: n ? (count(x => x.who === k) / n * 100) + '%' : '0%'})),
      topDrugs: topDrugs.map(d => ({name: d.name, n: String(d.n), w: (d.n / Math.max(1, topDrugs[0] ? topDrugs[0].n : 1) * 100) + '%'})),
      trig: trig.map(t => ({t: t.t, n: String(t.n)}))
    };
  }
  exportCsv() {
    const cases = this.loadCases();
    const head = ['เลขที่','วันที่บันทึก','เดือนที่เกิด', this.state.anonCsv ? 'รหัสเคส (ไม่ระบุตัวตน)' : 'ผู้ป่วย','ยาที่สงสัย','อาการ','Naranjo','Naranjo ระดับ','WHO-UMC','Preventability','รุนแรง','แพ้ยาซ้ำ','Trigger','ประเภท','ผลลัพธ์','เภสัชกร','ADR type','ความร้ายแรง'];
    const esc = (x) => '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"';
    const rows = cases.map((c, i) => {
      const x = c.sum || {};
      const who = this.state.anonCsv ? 'ADR-' + String(cases.length - i).padStart(4, '0') : c.label;
      return [i + 1, c.saved, x.month || '', who, (x.drugs || []).join('; '), (x.events || []).join('; '), x.nj == null ? '' : x.nj, x.njCat || '', x.who || '', x.prev || '',
        x.severe ? 'ใช่' : (c.sum ? 'ไม่ใช่' : ''), x.repeat ? 'ใช่' : (c.sum ? 'ไม่ใช่' : ''),
        (x.triggers || []).map(id => (TRIGGERS.find(t => t.id === id) || {}).t).filter(Boolean).join('; '),
        x.type || '', x.outcome || '', x.pharm || '', x.adrType ? 'Type ' + x.adrType : '', x.serious ? 'Serious' : (c.sum ? 'Non-serious' : '')].map(esc).join(',');
    });
    const csv = '\ufeff' + head.map(esc).join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ADR-registry-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  /** ค่าเริ่มต้นของฟิลด์ฟอร์ม — กันเคสจากไฟล์สำรอง/เวอร์ชันเก่าที่ฟิลด์ไม่ครบ ทำให้เปิดแล้วหน้าจอพัง */
  caseDefaults() {
    return {pt: {hn:'', name:'', age:'', sex:'', hx:''}, drugs: [{id:1, name:'', dose:'', route:'', start:'', stop:'', suspect:true}],
      events: [{id:1, desc:'', onset:'', severity:'moderate', better:''}], labs: [{id:1, name:'', date:'', value:''}],
      naranjo: {}, reactionType: '', outcome: 'recovering', pharmNote: '', seq: 3, altCauses: [], altNote: '', crit: {}, prev: {}, triggers: [],
      pharmSign: '', doctorSign: '', rep: {medErr: '', medErrNo: '', hpvc: '', hpvcDate: '', rcaCat: [], rcaCause: '', rcaPlan: '', rcaOwner: ''}, sev2: {type: '', serious: []}};
  }
  openCaseData(c) { this.setState(Object.assign({adrView: 'edit', adrTab: 'fill'}, this.caseDefaults(), c.data)); }
  caseSnapshot() {
    const s = this.state;
    return {pt: s.pt, drugs: s.drugs, events: s.events, labs: s.labs, naranjo: s.naranjo,
      reactionType: s.reactionType, outcome: s.outcome, pharmNote: s.pharmNote, seq: s.seq,
      adrScale: s.adrScale, altCauses: s.altCauses, altNote: s.altNote, crit: s.crit,
      prev: s.prev, triggers: s.triggers, pharmSign: s.pharmSign, doctorSign: s.doctorSign, rep: s.rep, sev2: s.sev2};
  }
  saveCase() {
    const s = this.state;
    const label = (s.pt.name || s.pt.hn || 'เคสไม่ระบุชื่อ') + (s.pt.hn && s.pt.name ? ' · HN ' + s.pt.hn : '');
    const list = this.loadCases().slice();
    const entry = {id: Date.now(), label, saved: new Date().toISOString().slice(0, 16), data: this.caseSnapshot(), sum: this.caseSummary()};
    const i = list.findIndex(c => c.label === label);
    entry.cid = i >= 0 ? String(list[i].cid || list[i].id) : String(entry.id);   // รหัสเคสคงที่ ใช้เป็น id ตอน sync (label มีชื่อผู้ป่วย จึงใช้ไม่ได้)
    if (i >= 0) list[i] = entry; else list.unshift(entry);
    this.saveCases(list.slice(0, 1000));
    this.setState({savedFlash: true});
    clearTimeout(this._sf); this._sf = setTimeout(() => this.setState({savedFlash: false}), 1800);
  }

  /* ---------- calculator ---------- */
  num(s) { return num(s); }
  digit(d) {
    let e = this.state.done ? '0' : this.state.entry;
    const t = this.state.done ? [] : this.state.tokens;
    if (d === '.') { if (e.indexOf('.') >= 0) return; e = e === '' ? '0.' : e + '.'; }
    else e = (e === '0') ? d : (e === '-0' ? '-' + d : e + d);
    this.setState({entry: e, tokens: t, done: false});
  }
  op(o) {
    const s = this.state;
    let tk = s.tokens.slice();
    if (s.done) { tk = [this.num(s.entry)]; }
    else if (s.entry !== '') tk.push(this.num(s.entry));
    else if (tk.length && typeof tk[tk.length-1] === 'string') tk.pop();
    if (!tk.length) tk = [0];
    tk.push(o);
    this.setState({tokens: tk, entry: '', done: false});
  }
  neg() {
    let e = this.state.entry;
    if (e === '' || e === '0') e = '-0'; else e = e.charAt(0) === '-' ? e.slice(1) : '-' + e;
    this.setState({entry: e, done: false});
  }
  pct() {
    const s = this.state;
    const v = this.num(s.entry);
    let out = v / 100;
    const tk = s.tokens;
    if (tk.length >= 2) {
      const lastOp = tk[tk.length-1];
      if (lastOp === '+' || lastOp === '-') {
        const base = this.evaluate(tk.slice(0, -1));
        if (base !== null) out = base * v / 100;
      }
    }
    this.setState({entry: String(out), done: false});
  }
  back() {
    const s = this.state;
    if (s.done) return this.clear();
    if (s.entry !== '') { const e = s.entry.slice(0, -1); return this.setState({entry: e === '' || e === '-' ? '0' : e}); }
    const tk = s.tokens.slice(); const last = tk.pop();
    this.setState({tokens: tk, entry: typeof last === 'number' ? String(last) : '0'});
  }
  clear() { this.setState({tokens: [], entry: '0', done: false}); }
  eq() {
    const s = this.state;
    if (s.done) return;
    const tk = s.tokens.slice();
    if (s.entry !== '') tk.push(this.num(s.entry));
    const r = this.evaluate(tk);
    if (r === null) return this.setState({tokens: [], entry: 'หารด้วย 0 ไม่ได้', done: true});
    this.setState({tokens: [], entry: String(r), done: true});
  }
  evaluate(tk) {
    const t = tk.filter((x, i) => !(i === tk.length - 1 && typeof x === 'string'));
    if (!t.length) return null;
    const a = [t[0]];
    for (let i = 1; i < t.length; i += 2) {
      const o = t[i], b = t[i+1];
      if (typeof b !== 'number') break;
      if (o === '×') a[a.length-1] = a[a.length-1] * b;
      else if (o === '÷') { if (b === 0) return null; a[a.length-1] = a[a.length-1] / b; }
      else { a.push(o); a.push(b); }
    }
    let r = a[0];
    for (let i = 1; i < a.length; i += 2) r = a[i] === '+' ? r + a[i+1] : r - a[i+1];
    if (!isFinite(r)) return null;
    return Math.round(r * 1e10) / 1e10;
  }
  fmt(n) {
    if (typeof n !== 'number') return n;
    if (Math.abs(n) >= 1e12 || (n !== 0 && Math.abs(n) < 1e-6)) return n.toExponential(6);
    return n.toLocaleString('en-US', {maximumFractionDigits: 10});
  }

  /* ---------- shared ---------- */
  frac(n) { return frac(n); }
  pills(n, fill, edge, shape, size) { return pills(n, fill, edge, shape, size); }
  devices(n, shape, fill, edge) { return devices(n, shape, fill, edge); }
  seg(active, label, sub, go) {
    return {label, sub, go, fw: active ? '600' : '500', fg: active ? '#16211F' : C.mut,
      bg: active ? '#FFFFFF' : 'transparent', sh: active ? '0 1px 3px rgba(22,33,31,.13)' : 'none'};
  }
  chip(active, label, toggle) {
    return {label, toggle, fw: active ? '600' : '400', fg: active ? C.teal : C.mut,
      bg: active ? C.tealS : '#FBFAF7', bd: active ? C.teal : 'rgba(22,33,31,.12)'};
  }

  /* ---------- TB ---------- */

  tb() { return computeTb({weight: this.state.weight, ageGroup: this.state.ageGroup, phase: this.state.phase, factors: this.state.factors, allowHalfTablets: this.props.allowHalfTablets}); }

  /* ---------- Warfarin ---------- */
  wBand(inr, lo, hi) { return wBand(inr, lo, hi, this.state.bleeding); }

  mixedPlans(weekly) { return mixedPlans(weekly, this.state.noHalf); }
  schedule(weekly) { return schedule(weekly, this.state.noHalf); }

  planDays(c) { return planDays(c, this.state.blockDays); }
  comboPills(parts, size) { return comboPills(parts, size); }
  comboTxt(parts) { return comboTxt(parts); }
  comboShort(parts) { return comboShort(parts); }
  planDaysMixed(c) { return planDaysMixed(c, this.state.blockDays); }

  band(table, wt) { return band(table, wt); }
  ltbi() { return computeLtbi({weight: this.state.weight, ageGroup: this.state.ageGroup}); }

  /* ---------- ADR timeline ---------- */
  parseD(s) { return parseD(s); }
  fmtD(s, withTime) { return fmtD(s, withTime); }
  setScale(scale) {
    const toHour = scale === 'hour';
    const conv = (s) => {
      if (!s) return s;
      if (toHour) return s.indexOf('T') >= 0 ? s : s + 'T08:00';
      return s.indexOf('T') >= 0 ? s.slice(0, s.indexOf('T')) : s;
    };
    const st = this.state;
    this.setState({
      adrScale: scale,
      drugs: st.drugs.map(d => Object.assign({}, d, {start: conv(d.start), stop: conv(d.stop)})),
      events: st.events.map(e => Object.assign({}, e, {onset: conv(e.onset), better: conv(e.better)})),
      labs: st.labs.map(l => Object.assign({}, l, {date: conv(l.date)}))
    });
  }
  dOf(s) { return dOf(s); }
  tOf(s) { return tOf(s); }
  setPart(key, id, field, part) {
    return (e) => {
      const row = this.state[key].find(r => r.id === id);
      const cur = row ? (row[field] || '') : '';
      const d = part === 'date' ? e.target.value : this.dOf(cur);
      const t = part === 'time' ? e.target.value : this.tOf(cur);
      this.setRow(key, id, field, d ? (t ? d + 'T' + t : d) : '');
    };
  }
  addRow(key, blank) {
    const list = this.state[key].slice();
    list.push(Object.assign({id: this.state.seq + 1}, blank));
    this.setState({[key]: list, seq: this.state.seq + 1});
  }
  delRow(key, id) { this.setState({[key]: this.state[key].filter(r => r.id !== id)}); }
  setRow(key, id, field, val) {
    this.setState({[key]: this.state[key].map(r => r.id === id ? Object.assign({}, r, {[field]: val}) : r)});
  }
  span() {
    const ds = [];
    this.state.drugs.forEach(d => { const a = this.parseD(d.start), b = this.parseD(d.stop); if (a) ds.push(a); if (b) ds.push(b); });
    this.state.events.forEach(e => { const a = this.parseD(e.onset), b = this.parseD(e.better); if (a) ds.push(a); if (b) ds.push(b); });
    this.state.labs.forEach(l => { const a = this.parseD(l.date); if (a) ds.push(a); });
    if (!ds.length) return null;
    let lo = Math.min.apply(null, ds.map(d => d.getTime()));
    let hi = Math.max.apply(null, ds.map(d => d.getTime()));
    const pad = Math.max((hi - lo) * 0.08, 12 * 3600e3);
    lo -= pad; hi += pad;
    return {lo, hi, w: hi - lo};
  }
  pctOf(t, sp) { return Math.max(0, Math.min(100, (t - sp.lo) / sp.w * 100)); }

  latency(drug, ev) { return latency(drug, ev); }
  critHits(key) {
    const c = this.state.crit[key] || {};
    return CRIT[key].items.filter((_, i) => c[i]).length;
  }
  critFlag(key) {
    const hits = this.critHits(key), need = key === 'ana' ? 2 : (key === 'dress' ? 4 : 3);
    return {hits, need, met: hits >= need, total: CRIT[key].items.length};
  }
  buildSOAP() {
    const st = this.state, nj = this.naranjoScore(), wt = true;
    const sus = st.drugs.filter(d => d.suspect && d.name);
    const evs = st.events.filter(e => e.desc);
    const pick = st.genPick || [];
    const has = (k) => pick.indexOf(k) >= 0;
    const sevs = evs.map(e => (SEV[e.severity] || SEV.moderate).label);
    const severe = sevs.indexOf('Severe') >= 0;
    const critMet = ['sjs', 'dress', 'ana'].map(k => ({k, f: this.critFlag(k)})).filter(x => x.f.met);
    const names = sus.map(d => d.name).join(' + ');
    const L = [];

    // S — อาการและเวลาที่เริ่ม
    const sBits = evs.slice(0, 3).map(e => e.desc + (e.onset ? ' (' + this.fmtD(e.onset, wt) + ')' : ''));
    if (st.pt.hx && !/^(ไม่มี|ปฏิเสธ|no|none|nka|ไม่เคย|-)/i.test(st.pt.hx.trim())) sBits.push('ประวัติแพ้เดิม ' + st.pt.hx.trim());
    L.push('S: ' + (sBits.length ? sBits.join('; ') : '—'));

    // O — ยาที่สงสัย latency dechallenge แลป
    const oBits = [];
    if (sus.length) oBits.push(sus.map(d => d.name + (d.dose ? ' ' + d.dose : '')).join('; '));
    const lat = sus.length && evs.length ? this.latency(sus[0], evs[0]) : null;
    if (lat) oBits.push('latency ' + lat.txt);
    if (nj.rows[2].val === 'y') oBits.push('dechallenge +');
    else if (nj.rows[2].val === 'n') oBits.push('dechallenge −');
    if (nj.rows[3].val === 'y') oBits.push('rechallenge +');
    const labs = st.labs.filter(l => l.name && l.value).slice(0, 4);
    if (labs.length) oBits.push(labs.map(l => l.name + ' ' + l.value).join(', '));
    if (critMet.length) oBits.push('เข้าเกณฑ์ ' + critMet.map(x => CRIT[x.k].name).join(', '));
    L.push('O: ' + (oBits.length ? oBits.join(' · ') : '—'));

    // A — ข้อสรุป
    const verdict = nj.total >= 9 ? 'definite' : nj.total >= 5 ? 'probable' : nj.total >= 1 ? 'possible' : 'doubtful';
    const aBits = [(nj.total >= 1 ? 'สงสัย ADR จาก ' : 'ยังไม่สรุปว่าเป็น ADR จาก ') + (names || 'ยาที่ยังไม่ระบุ')
      + ' — ' + verdict + ' (Naranjo ' + nj.total + ')'];
    const who0 = this.whoUmc(), pv0 = this.prevScore();
    if (who0.k !== 'unclass') aBits.push('WHO-UMC ' + who0.label.split(' /')[0].toLowerCase());
    if (pv0.k !== 'pending') aBits.push(pv0.k === 'prev' ? 'ป้องกันได้' : 'ป้องกันไม่ได้');
    if (st.reactionType) aBits.push(st.reactionType);
    if (severe || critMet.length) aBits.push('ปฏิกิริยารุนแรง');
    L.push('A: ' + aBits.join(' · '));

    // P — แผน สั้นเป็นข้อ
    const p = [];
    if (sus.length) p.push(nj.total >= 5 ? 'งด ' + names + ' ถาวร รวมยาโครงสร้างใกล้เคียง'
      : nj.total >= 1 ? 'งด ' + names + ' ระหว่างรอข้อมูลเพิ่ม'
      : 'หยุด ' + names + ' เพื่อสังเกตอาการ');
    if (has('card')) p.push(nj.total >= 1
      ? 'ออกบัตรแพ้ยาระดับ ' + (nj.total >= 9 ? 'confirmed' : nj.total >= 5 ? 'probable' : 'suspected')
      : 'ยังไม่ออกบัตรแพ้ยา รอประเมินซ้ำ');
    if (has('hosxp')) p.push('บันทึกแพ้ยาใน HOSxp + ตั้งแจ้งเตือนสั่งยาซ้ำ');
    if (has('alt')) {
      const adv = this.refAdvice();
      if (adv.length) {
        p.push('เลี่ยง: ' + adv.map(x => x.avoid.split('·')[0].trim()).join('; '));
        p.push('ใช้แทน: ' + adv.map(x => x.use.split('·').slice(0, 2).join(',').trim()).join('; '));
      } else p.push('เลือกยาที่โครงสร้างต่างจากยาที่สงสัย');
    }
    if (has('nurse')) p.push('แจ้งหอผู้ป่วยงดยาและเฝ้าระวังอาการซ้ำ');
    if (has('edu')) p.push('ให้ความรู้ผู้ป่วย/ญาติ ชื่อยาที่ต้องเลี่ยงและการพกบัตร');
    if (has('hpvc')) p.push('รายงาน HPVC');
    if (has('follow')) p.push('นัดติดตามอาการและแลปซ้ำ');
    if (severe || critMet.length) p.push('ห้าม rechallenge');
    L.push('P: ' + (p.length ? p.map((x, i) => (i + 1) + ') ' + x).join(' ') : '—'));
    return L.join('\n');
  }
  refAdvice() { return refAdvice(this.state); }
  crossRefs() {
    const out = [];
    this.state.drugs.filter(d => d.suspect && d.name).forEach(d => {
      const low = d.name.toLowerCase();
      const hit = XREACT.find(x => x.k.some(k => low.indexOf(k) >= 0));
      if (hit) out.push({drug: d.name, avoid: hit.avoid, safe: hit.safe});
    });
    return out;
  }
  autoNaranjo() { return autoNaranjo(this.state); }
  naranjoScore() { return naranjoScore(this.state); }
  asciiTimeline() {
    const sp = this.span();
    if (!sp) return [];
    const st = this.state, W = 34, wt = st.adrScale === 'hour';
    const pad = (s, n) => { s = String(s); return s.length >= n ? s.slice(0, n) : s + new Array(n - s.length + 1).join(' '); };
    const col = (t) => Math.max(0, Math.min(W - 1, Math.round((t - sp.lo) / sp.w * (W - 1))));
    const L = ['TIMELINE ' + this.fmtD(new Date(sp.lo).toISOString().slice(0, 16), false) + ' - ' + this.fmtD(new Date(sp.hi).toISOString().slice(0, 16), false)];
    st.drugs.forEach(d => {
      const a = this.parseD(d.start);
      if (!a || !d.name) return;
      const b = this.parseD(d.stop);
      const s = col(a.getTime()), e = b ? col(b.getTime()) : W - 1;
      let row = '';
      for (let i = 0; i < W; i++) row += (i >= s && i <= e) ? '=' : '.';
      L.push(pad(d.name, 16) + '|' + row + '| ' + this.fmtD(d.start, wt) + ' - ' + (d.stop ? this.fmtD(d.stop, wt) : 'ยังใช้อยู่') + (d.suspect ? ' *สงสัย' : ''));
    });
    st.events.forEach(e0 => {
      const a = this.parseD(e0.onset);
      if (!a || !e0.desc) return;
      const s = col(a.getTime()), b = this.parseD(e0.better);
      const e2 = b ? col(b.getTime()) : -1;
      let row = '';
      for (let i = 0; i < W; i++) row += (i === s ? 'X' : (i === e2 ? 'o' : '.'));
      L.push(pad('> ' + e0.desc, 16) + '|' + row + '| onset ' + this.fmtD(e0.onset, wt) + (b ? ', ดีขึ้น ' + this.fmtD(e0.better, wt) : ''));
    });
    st.labs.forEach(l => {
      const a = this.parseD(l.date);
      if (!a || !l.name) return;
      const s = col(a.getTime());
      let row = '';
      for (let i = 0; i < W; i++) row += (i === s ? '+' : '.');
      L.push(pad('~ ' + l.name, 16) + '|' + row + '| ' + l.value + ' (' + this.fmtD(l.date, false) + ')');
    });
    L.push(pad('', 16) + ' = ใช้ยา  X เริ่มมีอาการ  o อาการดีขึ้น  + ค่าแลป');
    return L;
  }
  hosxpNote() {
    const st = this.state, n = this.naranjoScore(), wt = st.adrScale === 'hour';
    const L = [];
    L.push('[ADR ASSESSMENT] ' + this.fmtD(new Date().toISOString().slice(0, 16), false));
    if (st.pt.hn || st.pt.name) L.push('ผู้ป่วย: ' + [st.pt.name, st.pt.hn ? 'HN ' + st.pt.hn : '', st.pt.age ? 'อายุ ' + st.pt.age + ' ปี' : '', st.pt.sex].filter(Boolean).join(' / '));
    const sus = st.drugs.filter(d => d.suspect && d.name);
    if (sus.length) L.push('Suspected drug: ' + sus.map(d => d.name + (d.dose ? ' ' + d.dose : '') + (d.route ? ' ' + d.route : '')).join(', '));
    const con = st.drugs.filter(d => !d.suspect && d.name);
    if (con.length) L.push('Concurrent drug: ' + con.map(d => d.name).join(', '));
    sus.forEach(d => L.push('- ' + d.name + ': เริ่ม ' + this.fmtD(d.start, wt) + ' / หยุด ' + this.fmtD(d.stop, wt)));
    st.events.filter(e => e.desc).forEach(e => {
      const sev = (SEV[e.severity] || {}).label || '';
      L.push('Reaction: ' + e.desc + ' (' + sev + ') onset ' + this.fmtD(e.onset, wt) + (e.better ? ', ดีขึ้น ' + this.fmtD(e.better, wt) : ''));
      const d0 = sus.map(d => this.latency(d, e)).filter(Boolean)[0];
      if (d0) L.push('  Latency: ' + d0.txt);
    });
    const labs = st.labs.filter(l => l.name && l.value);
    if (labs.length) L.push('Lab: ' + labs.map(l => l.name + ' ' + l.value + ' (' + this.fmtD(l.date, false) + ')').join('; '));
    const tl = this.asciiTimeline();
    if (tl.length) { L.push(''); tl.forEach(r => L.push(r)); L.push(''); }
    const ac = st.altCauses.map(id => (ALTCAUSE.find(a => a.id === id) || {}).label).filter(Boolean);
    if (ac.length) L.push('สาเหตุอื่นที่พิจารณา: ' + ac.join(', ') + (st.altNote ? ' — ' + st.altNote : ''));
    const flags = ['sjs','dress','ana'].map(k => ({k, f: this.critFlag(k)})).filter(x => x.f.hits > 0);
    if (flags.length) L.push('เกณฑ์ภาวะรุนแรง: ' + flags.map(x => CRIT[x.k].name + ' ' + x.f.hits + '/' + x.f.total + (x.f.met ? ' (เข้าเกณฑ์)' : '')).join('; '));
    const adv = this.refAdvice();
    if (adv.length) adv.forEach(a => {
      L.push('ข้อแนะนำเชิงวิชาการ (' + a.drug + ' — ' + a.cls + '):');
      L.push('  โครงสร้าง/กลไก: ' + a.struct);
      L.push('  ต้องหลีกเลี่ยง: ' + a.avoid);
      L.push('  ใช้แทนได้: ' + a.use);
      L.push('  อ้างอิง: ' + a.cite);
    });
    const xr = this.crossRefs();
    if (xr.length) xr.forEach(x => {
      L.push('Cross-reactivity (' + x.drug + '):');
      L.push('  ยาที่ต้องหลีกเลี่ยง: ' + x.avoid);
      L.push('  ยาทางเลือก: ' + x.safe);
    });
    if (st.reactionType) L.push('ประเภทปฏิกิริยา: ' + st.reactionType);
    L.push('Dechallenge: ' + (n.rows[2].val === 'y' ? 'positive' : n.rows[2].val === 'n' ? 'negative' : 'ไม่ทราบ') + ' / Rechallenge: ' + (n.rows[3].val === 'y' ? 'positive' : n.rows[3].val === 'n' ? 'negative' : 'ไม่ได้ทำ'));
    L.push('Naranjo score = ' + n.total + ' (' + n.verdict.split(' — ')[0] + ')');
    L.push('ผลลัพธ์: ' + ({recovering:'กำลังดีขึ้น', recovered:'หายเป็นปกติ', sequelae:'หายแต่มีความผิดปกติเหลืออยู่', ongoing:'ยังคงมีอาการ', death:'เสียชีวิต'})[st.outcome]);
    if (sus.length) L.push('ข้อแนะนำ: หลีกเลี่ยงยา ' + sus.map(d => d.name).join(', ') + ' และยากลุ่มเดียวกัน แจ้งผู้ป่วยและบันทึกบัตรแพ้ยา');
    if (st.pharmNote) L.push('หมายเหตุเภสัชกร: ' + st.pharmNote);
    if (st.pharmSign) L.push('ประเมินโดย: ' + st.pharmSign);
    return L.join('\n');
  }

  /* ---------- render ---------- */
  render() {
    const mode = this.mode();
    return (<>
      <BackupBar hasData={['adrCases.v1','adrCqi.v1','infoEval.v1','intensive.v1','ptcMeet.v1','workload.v1'].some(k => (store.getJson(k, []) || []).length > 0) || Object.keys(store.getJson('stdAssess.v1', {}) || {}).length > 0} onBackup={() => this.backupJson()} />
      <View v={this.renderVals()} />
      <CaseListModal cases={this.state.cases || []} open={!!this.state.caseListOpen} close={() => this.setState({caseListOpen: false})}
        onOpen={(c) => this.openCaseData(c)}
        onDelete={(c) => this.saveCases(this.loadCases().filter(x => x.id !== c.id))}
        onRestore={(c) => this.saveCases(this.loadCases().filter(x => x.id !== c.id).concat([c]).sort((a, b) => String(b.saved).localeCompare(String(a.saved))))} />
      <BottomNav mode={mode} go={(m) => this.setState({mode: m})} />
      {mode === 'adr' && <AdrTabs tab={this.state.adrTab || 'fill'} set={(t) => this.setState({adrTab: t})} />}
    </>);
  }

  renderVals() {
    const st = this.state, mode = this.mode();
    const v = {
      appName: this.props.appName || 'PharmaKPNHospital',
      clinicName: this.props.clinicName || 'ระบบสนับสนุนการตัดสินใจด้านยาสำหรับเภสัชกร',
      showDisclaimer: this.props.showDisclaimer !== false,
      isHome: mode === 'home',
      isCalc: mode === 'calc', isTB: mode === 'tb', isWarf: mode === 'warf', isADR: mode === 'adr', isPed: mode === 'ped', isStd: mode === 'std',
      goHome: () => this.setState({mode: 'home'}),
      homeCalc: [
        {id:'tb', code:'M-01', title:'ขนาดยาวัณโรค', sub:'Active TB สูตร 2HRZE/4HR และวัณโรคระยะแฝง 3HP คำนวณจำนวนเม็ดตามน้ำหนัก', ref:'แนวทางวัณโรคไทย 2564', accent:'#0F5D57', tint:'#E4EFEC', glyph:'TB'},
        {id:'warf', code:'M-02', title:'ปรับขนาด Warfarin', sub:'ปรับขนาดยาตามค่า INR และจัดตารางยารายสัปดาห์ที่ผู้ป่วยกินง่าย', ref:'สมาคมแพทย์โรคหัวใจฯ', accent:'#B5581F', tint:'#F7EBE2', glyph:'INR'},
        {id:'ped', code:'M-03', title:'ขนาดยาน้ำเด็ก', sub:'ปริมาณยาต่อครั้งที่ตวงง่าย และจำนวนขวดที่ต้องจ่าย', ref:'BNFC · AAP · WHO', accent:'#1F7A6B', tint:'#DCEFEA', glyph:'ml'},
        {id:'calc', code:'M-04', title:'เครื่องมือคำนวณ', sub:'เครื่องคิดเลข คำนวณวันที่ และปริมาณ insulin ที่ต้องจ่ายตามวันนัด', ref:'เครื่องมือทั่วไป', accent:'#2F6DA8', tint:'#D8E6F3', glyph:'123'}
      ].map(c => Object.assign({go: () => this.setState({mode: c.id})}, c)),
      homeSafety: [
        {id:'adr', code:'S-01', title:'ประเมินแพ้ยา', sub:'Timeline · Naranjo · WHO-UMC · Preventability พร้อมใบสรุป A4 และ HOSxp note', ref:'มาตรฐานข้อ 9', accent:'#7A5AA8', tint:'#EDE7F5', glyph:'ADR'},
        {id:'reg', code:'S-02', title:'ทะเบียน ADR และตัวชี้วัด', sub:'ตัวชี้วัดรายไตรมาส intensive monitoring การให้ข้อมูลด้านยา CQI และรายงานคณะกรรมการ PTC', ref:'มาตรฐานข้อ 3 และ 9', accent:'#0E3F3B', tint:'#E4EFEC', glyph:'KPI'},
        {id:'std', code:'S-03', title:'มาตรฐานความปลอดภัยด้านยา', sub:'ประเมินตนเองข้อ 3 และข้อ 9 ตามแบบประเมิน พ.ศ. 2570 พร้อมหลักฐานจากแอปและรายงานพิมพ์', ref:'แบบประเมิน สป. 2570', accent:'#A66A00', tint:'#FBF1DE', glyph:'STD'}
      ].map(c => Object.assign({go: () => this.setState(c.id === 'reg' ? {mode: 'adr', regOpen: true, regTab: 'ov'} : {mode: c.id})}, c)),
      appVersion: 'เวอร์ชัน ' + __APP_VERSION__ + ' · ปรับปรุงล่าสุด ' + (d => ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'][d.getMonth()] + ' ' + (d.getFullYear() + 543))(new Date(__BUILD_DATE__)),
      hospitalName: this.props.hospitalName || 'โรงพยาบาลกรงปินัง',
      deptName: this.props.deptName || 'กลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค',
      tbCols: st.narrow ? 'minmax(0,1fr)' : 'minmax(0,340px) minmax(0,1fr)',
      tabs: [['home','หน้าแรก'],['tb','ขนาดยา TB'],['warf','Warfarin'],['ped','ยาน้ำเด็ก'],['adr','ประเมินแพ้ยา'],['calc','เครื่องมือ'],['std','มาตรฐาน']].map(([id, label]) => {
        const a = mode === id;
        return {label, go: () => this.setState({mode: id}), fw: a ? '600' : '500',
          fg: a ? '#FFFFFF' : '#3E4F4C', bg: a ? '#0F5D57' : 'transparent',
          sh: a ? '0 2px 6px -2px rgba(15,93,87,.5)' : 'none'};
      })
    };

    if (mode === 'home') {
      const sums = (st.cases || []).map(c => c.sum).filter(Boolean);
      v.homeHasStats = sums.length > 0;
      if (sums.length) {
        const now = new Date();
        const qk = now.getFullYear() + '-Q' + (Math.floor(now.getMonth() / 3) + 1);
        const inQ = sums.filter(x => x.month && this.qKey(x.month) === qk);
        const rep = sums.filter(x => x.repeat).length;
        const pend = sums.filter(x => x.hpvc === 'pending').length + sums.filter(x => x.rca === 'missing').length;
        v.homeStats = [
          {k: 'เคส ADR ในทะเบียน', v: String(sums.length), fg: '#0E3F3B'},
          {k: 'ไตรมาสนี้', v: String(inQ.length), fg: '#0E3F3B'},
          {k: 'แพ้ยาซ้ำ (เป้าหมาย 0)', v: String(rep), fg: rep ? '#B3261E' : '#2E7D5B'},
          {k: 'งานค้าง (HPVC / RCA)', v: String(pend), fg: pend ? '#A66A00' : '#2E7D5B'}
        ];
      }
    }

    /* pediatric liquid */
    (() => {
      const drug = PEDLIQ.find(d => d.id === st.pdDrug) || PEDLIQ[0];
      const regIdx = Math.min(st.pdReg, drug.regs.length - 1);
      const reg = drug.regs[regIdx];
      const w = parseFloat(st.pdWeight) || 0;
      const age = parseFloat(st.pdAge);
      const conc = drug.mg / drug.ml;
      const du = drug.doseUnit || 'มก.';
      const GRPORDER = ['ยาปฏิชีวนะ', 'ยาลดไข้ / แก้ปวด', 'ยาลดไข้ / แก้ปวด / ต้านอักเสบ', 'ยาละลายเสมหะ', 'ยาขับเสมหะ', 'ยาแก้แพ้', 'ยาแก้ปวดเกร็งท้อง', 'ยาขับลม', 'ยาถ่ายพยาธิ', 'ธาตุเหล็ก'];
      const GRPMERGE = {'ยาลดไข้ / แก้ปวด / ต้านอักเสบ': 'ยาลดไข้ / แก้ปวด', 'ยาขับเสมหะ': 'ยาละลายเสมหะ / ขับเสมหะ', 'ยาละลายเสมหะ': 'ยาละลายเสมหะ / ขับเสมหะ'};
      const GRPICON = {'ยาปฏิชีวนะ':'ATB', 'ยาลดไข้ / แก้ปวด':'ANL', 'ยาละลายเสมหะ / ขับเสมหะ':'MUC', 'ยาแก้แพ้':'AH', 'ยาแก้ปวดเกร็งท้อง':'GI', 'ยาขับลม':'GI', 'ยาถ่ายพยาธิ':'AHM', 'ธาตุเหล็ก':'Fe'};
      const groups = [];
      GRPORDER.forEach(cls => {
        const g = GRPMERGE[cls] || cls;
        PEDLIQ.filter(d => d.cls === cls).forEach(d => {
          let row = groups.find(x => x.g === g);
          if (!row) { row = {g, items: []}; groups.push(row); }
          row.items.push(d);
        });
      });
      const curGrp = groups.find(row => row.items.some(d => d.id === st.pdDrug)) || groups[0];
      const catSel = st.pdCat != null && groups[st.pdCat] ? st.pdCat : groups.indexOf(curGrp);
      v.pdCatChips = groups.map((row, i) => {
        const on = i === catSel;
        return {label: row.g, n: String(row.items.length),
          go: () => this.setState({pdCat: i, pdDrug: row.items[0].id, pdReg: 0, pdDays: ''}),
          fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? '#1F7A6B' : '#FFFFFF',
          bd: on ? '#1F7A6B' : 'rgba(22,33,31,.13)', fw: on ? '600' : '500',
          nFg: on ? 'rgba(255,255,255,.72)' : '#9AA5A2'};
      });
      v.pdCatDrugs = (groups[catSel] || groups[0]).items.map(d => ({
        label: d.name, sub: d.strength,
        go: () => this.setState({pdDrug: d.id, pdReg: 0, pdDays: ''}),
        fg: d.id === st.pdDrug ? '#FFFFFF' : '#16211F',
        subFg: d.id === st.pdDrug ? 'rgba(255,255,255,.78)' : C.mut,
        bg: d.id === st.pdDrug ? '#1F7A6B' : '#FFFFFF',
        bd: d.id === st.pdDrug ? '#1F7A6B' : 'rgba(22,33,31,.11)'
      }));
      v.pdRegOpts = drug.regs.map((r, i) => ({
        label: r.k, on: i === regIdx,
        go: () => this.setState({pdReg: i, pdDays: ''}),
        fg: i === regIdx ? '#1F7A6B' : C.mut,
        bg: i === regIdx ? '#DCEFEA' : '#FBFAF7',
        bd: i === regIdx ? '#1F7A6B' : 'rgba(22,33,31,.12)',
        fw: i === regIdx ? '600' : '500'
      }));
      v.pdHasRegs = drug.regs.length > 1;
      v.pdName = drug.name;
      v.pdStrength = drug.strength;
      v.pdCls = drug.cls;
      v.pdFreqTxt = reg.freqTxt;
      v.pdRegLabel = reg.k;
      v.pdNotes = drug.notes.map(t => ({t}));
      v.pdCite = drug.cite;
      v.pdWeight = st.pdWeight;
      v.pdAge = st.pdAge;
      v.pdDaysVal = st.pdDays === '' ? String(reg.days) : st.pdDays;
      v.setPdWeight = (e) => this.setState({pdWeight: e.target.value.replace(/[^0-9.]/g, '')});
      v.setPdAge = (e) => this.setState({pdAge: e.target.value.replace(/[^0-9.]/g, '')});
      v.setPdDays = (e) => this.setState({pdDays: e.target.value.replace(/[^0-9]/g, '')});
      v.pdIsFixed = !!reg.fixedDose;
      v.pdHasW = w > 0 || !!reg.fixedDose;

      Object.assign(v, computePediatric({drug, reg, w, age, daysVal: v.pdDaysVal}));
    })();

    /* calculator */
    const exprParts = st.tokens.map(t => typeof t === 'number' ? this.fmt(t) : t);
    v.calcExpr = st.done ? '' : exprParts.join(' ');
    let main;
    if (st.done) main = st.entry === 'หารด้วย 0 ไม่ได้' ? st.entry : this.fmt(this.num(st.entry));
    else if (st.entry !== '') main = /[.-]$|\.\d*0$/.test(st.entry) ? st.entry : this.fmt(this.num(st.entry));
    else { const p = this.evaluate(st.tokens); main = p === null ? '0' : this.fmt(p); }
    v.calcMain = main;
    v.calcSize = String(main).length > 14 ? '28px' : (String(main).length > 10 ? '36px' : '46px');

    const dk = {bg:'rgba(244,241,234,.10)', fg:'#F4F1EA'};
    const fn = {bg:'rgba(244,241,234,.20)', fg:'#F4F1EA'};
    const opk = {bg:'rgba(181,88,31,.90)', fg:'#FFFFFF'};
    const mk = (label, press, kind, span) => Object.assign({label, press, span: span || 1, fs: '23px'}, kind);
    v.calcKeys = [
      mk('AC', () => this.clear(), fn), mk('±', () => this.neg(), fn), mk('%', () => this.pct(), fn), mk('÷', () => this.op('÷'), opk),
      mk('7', () => this.digit('7'), dk), mk('8', () => this.digit('8'), dk), mk('9', () => this.digit('9'), dk), mk('×', () => this.op('×'), opk),
      mk('4', () => this.digit('4'), dk), mk('5', () => this.digit('5'), dk), mk('6', () => this.digit('6'), dk), mk('−', () => this.op('-'), opk),
      mk('1', () => this.digit('1'), dk), mk('2', () => this.digit('2'), dk), mk('3', () => this.digit('3'), dk), mk('+', () => this.op('+'), opk),
      mk('0', () => this.digit('0'), dk, 2), mk('.', () => this.digit('.'), dk), mk('=', () => this.eq(), {bg:'#0F5D57', fg:'#FFFFFF'})
    ];

    /* TB */
    v.weight = st.weight;
    v.setWeight = (e) => this.setState({weight: e.target.value});
    const ageL = st.tbTrack === 'ltbi' ? ['อายุ > 14 ปี', 'อายุ 2–14 ปี'] : ['ผู้ใหญ่', 'เด็ก'];
    v.ageOpts = [this.seg(st.ageGroup === 'adult', ageL[0], '', () => this.setState({ageGroup: 'adult'})),
                 this.seg(st.ageGroup === 'child', ageL[1], '', () => this.setState({ageGroup: 'child'}))];
    v.trackOpts = [this.seg(st.tbTrack === 'active', 'วัณโรคระยะแสดงอาการ', 'Active TB · 2HRZE / 4HR', () => this.setState({tbTrack: 'active'})),
                   this.seg(st.tbTrack === 'ltbi', 'วัณโรคระยะแฝง', 'LTBI · 3HP', () => this.setState({tbTrack: 'ltbi'}))];
    v.isActiveTB = st.tbTrack === 'active';
    v.isLTBI = st.tbTrack === 'ltbi';
    v.ageLabels = st.tbTrack === 'ltbi' ? ['อายุ > 14 ปี', 'อายุ 2–14 ปี'] : ['ผู้ใหญ่', 'เด็ก'];
    v.phaseOpts = [this.seg(st.phase === 'intensive', 'Intensive', '2 เดือนแรก · HRZE', () => this.setState({phase: 'intensive'})),
                   this.seg(st.phase === 'continuation', 'Continuation', '4 เดือนต่อมา · HR', () => this.setState({phase: 'continuation'}))];
    v.factorChips = FACTORS.map(f => this.chip(st.factors.indexOf(f.id) >= 0, f.label, () => {
      const cur = st.factors.slice(), i = cur.indexOf(f.id);
      if (i >= 0) cur.splice(i, 1); else cur.push(f.id);
      this.setState({factors: cur});
    }));
    const ltbiOn = st.tbTrack === 'ltbi';
    const tb = ltbiOn ? null : this.tb();
    const lt = ltbiOn ? this.ltbi() : null;
    v.tbBlocked = !ltbiOn && st.factors.indexOf('mdr') >= 0;
    v.tbEmpty = ltbiOn ? !lt : !tb;
    v.tbRows = tb ? tb.rows : [];
    v.tbAlerts = ltbiOn ? (lt ? lt.alerts : []) : (tb ? tb.alerts : []);
    v.tbHasSummary = !ltbiOn && !!tb;
    v.ltbiRows = lt ? lt.rows : [];
    v.ltbiHas = !!(lt && lt.rows.length);
    v.ltbiFdc = lt && lt.fdc ? [lt.fdc] : [];
    v.ltbiCourse = lt && lt.courseTxt ? lt.courseTxt : '';
    v.ltbiHasCourse = !!(lt && lt.courseTxt);
    v.ltbiCourseLabel = lt && lt.fdc ? 'ทางเลือก: ใช้เม็ดเดี่ยวทั้งหมด · 12 ครั้ง' : 'รวมทั้งคอร์ส 12 ครั้ง';
    const wtNow = parseFloat(st.weight);
    const childL = st.ageGroup === 'child';
    v.ltbiTableTitle = childL ? 'ตารางขนาดยา 3HP · อายุ 2–14 ปี' : 'ตารางขนาดยา 3HP · อายุ > 14 ปี';
    v.ltbiTable = childL
      ? LTBI_INH_CHILD.map((b, i) => {
          const on = wtNow >= LTBI_INH_CHILD[0][0] && wtNow <= b[1] && (i === 0 || wtNow > LTBI_INH_CHILD[i - 1][1]);
          return {range: b[3],
            inh: b[2] + ' mg', rpt: LTBI_RPT_CHILD[i][2] + ' mg',
            bg: on ? C.tealS : 'transparent', fg: on ? C.teal : '#3E4F4C', fw: on ? '600' : '400',
            mark: on ? 'ผู้ป่วยรายนี้' : ''};
        })
      : [{range: '≥ 30 กก.', inh: '900 mg', rpt: '900 mg',
          bg: wtNow >= 30 ? C.tealS : 'transparent', fg: wtNow >= 30 ? C.teal : '#3E4F4C',
          fw: wtNow >= 30 ? '600' : '400', mark: wtNow >= 30 ? 'ผู้ป่วยรายนี้' : ''},
         {range: '< 30 กก.', inh: 'ใช้ตารางน้ำหนักเด็ก', rpt: 'ใช้ตารางน้ำหนักเด็ก',
          bg: wtNow > 0 && wtNow < 30 ? C.warnS : 'transparent', fg: wtNow > 0 && wtNow < 30 ? C.warn : '#3E4F4C',
          fw: wtNow > 0 && wtNow < 30 ? '600' : '400', mark: ''}];
    v.tbTotalTxt = tb ? (Math.round(tb.totalTabs * 2) / 2) + ' เม็ด/แคปซูล · ทานพร้อมกันครั้งเดียว' : '';

    /* Warfarin */
    v.wDose = st.wDose; v.inr = st.inr;
    v.setWDose = (e) => this.setState({wDose: e.target.value});
    v.setInr = (e) => this.setState({inr: e.target.value});
    const tgt = st.wTarget === 'mech' ? [2.5, 3.5] : [2.0, 3.0];
    v.targetOpts = [this.seg(st.wTarget === 'std', '2.0 – 3.0', 'ทั่วไป · AF, VTE', () => this.setState({wTarget: 'std'})),
                    this.seg(st.wTarget === 'mech', '2.5 – 3.5', 'ลิ้นหัวใจเทียมกลไก', () => this.setState({wTarget: 'mech'}))];
    v.bleedOpts = [['none','ไม่มี'],['minor','เลือดออกเล็กน้อย'],['major','เลือดออกรุนแรง']].map(([id, label]) => {
      const a = st.bleeding === id, danger = id !== 'none';
      return {label, go: () => this.setState({bleeding: id}), fw: a ? '600' : '400',
        fg: a ? (danger ? C.danger : C.teal) : C.mut,
        bg: a ? (danger ? C.dangerS : C.tealS) : '#FBFAF7',
        bd: a ? (danger ? C.danger : C.teal) : 'rgba(22,33,31,.12)'};
    });
    v.adhOpts = [
      {key:'noHalf', label:'ไม่ต้องหักแบ่งเม็ดยา', sub:'ผู้ป่วยแบ่งเม็ดยาไม่ได้หรือไม่แม่นยำ'},
      {key:'blockDays', label:'จัดวันที่ขนาดสูงให้ติดกัน', sub:'เช่น จันทร์–พุธ จำเป็นก้อนเดียว เหมาะกับผู้สูงอายุหรือผู้ใช้ตลับยารายสัปดาห์'}
    ].map(o => {
      const a = st[o.key];
      return {label:o.label, sub:o.sub, mark: a ? '✓' : '', toggle: () => this.setState({[o.key]: !st[o.key]}),
        bg: a ? C.tealS : '#FBFAF7', bd: a ? C.teal : 'rgba(22,33,31,.12)',
        boxBg: a ? C.teal : '#FFFFFF', boxBd: a ? C.teal : 'rgba(22,33,31,.20)'};
    });

    const dose0 = parseFloat(st.wDose), inr = parseFloat(st.inr);
    const ok = isFinite(dose0) && dose0 > 0 && dose0 <= 200 && isFinite(inr) && inr >= 0.5 && inr <= 20;
    v.wEmpty = !ok; v.wHas = ok;
    v.inrColor = !isFinite(inr) ? C.mut : (inr >= 4 ? C.danger : (inr > tgt[1] || inr < tgt[0] ? C.warn : C.ok));
    v.inrBorder = !isFinite(inr) ? 'rgba(22,33,31,.13)' : v.inrColor;
    v.wPlans = []; v.wAlerts = [];

    if (ok) {
      const b = this.wBand(inr, tgt[0], tgt[1]);
      const bandC = {ok:[C.okS,'rgba(46,125,91,.25)',C.ok], lo:[C.warnS,'rgba(166,106,0,.22)',C.warn],
        hi:[C.warnS,'rgba(166,106,0,.25)',C.copper], crit:[C.dangerS,'rgba(179,38,30,.25)',C.danger], major:[C.dangerS,'rgba(179,38,30,.4)',C.danger]}[b.k];
      v.wBandBg = bandC[0]; v.wBandBd = bandC[1]; v.wBandFg = bandC[2];
      v.wBandLabel = b.label + ' · เป้าหมาย ' + tgt[0].toFixed(1) + '–' + tgt[1].toFixed(1);
      v.wAction = b.action; v.wDetail = b.detail; v.wRecheck = b.recheck;

      const raw = dose0 * (1 + b.pct);
      const plans = b.k === 'major' ? null : this.schedule(raw);
      const best = plans ? plans[0] : null;
      const newDose = raw;
      v.wNewDose = (Math.round(newDose * 10) / 10) + ' mg/wk';
      const dd = newDose - dose0;
      v.wDelta = (dd === 0 ? 'คงเดิม' : (dd > 0 ? '+' : '−') + (Math.round(Math.abs(dd) * 10) / 10) + ' mg (' + (dd > 0 ? '+' : '−') + Math.round(Math.abs(dd) / dose0 * 100) + '%)');

      if (best) {
        v.wPlans = plans.map((c, idx) => {
          const plan = this.planDays(c);
          if (c.mixed) {
            const names = c.strengths.map(s => s + ' mg (สี' + (WCOLOR[s] || {}).name + ')').join(' + ');
            let weekTabs = 0;
            plan.cells.forEach((_, i) => {
              const d = plan.hiNames.indexOf(DAYS[i]) >= 0 ? c.hi : c.lo;
              d.parts.forEach(p => { weekTabs += p.n; });
            });
            return {
              title: 'แผน ' + (idx + 1),
              badge: idx === 0 ? 'แนะนำ' : 'สลับเม็ด ' + c.strengths.join(' / ') + ' mg',
              badgeBg: idx === 0 ? C.tealS : C.copperS,
              badgeFg: idx === 0 ? C.teal : C.copper,
              border: idx === 0 ? C.teal : 'rgba(22,33,31,.10)',
              note: names + ' · ' + (c.halfUsed ? 'มีหักครึ่งเม็ด' : 'เม็ดเต็มทั้งหมด'),
              rule: 'ใช้เม็ด 2 ขนาดสลับวันกัน — วันปกติทาน ' + this.comboTxt(c.lo.parts) + ' = ' + (Math.round(c.lo.mg * 10) / 10) + ' mg และวัน' + plan.hiNames.join(' วัน') + ' เปลี่ยนเป็น ' + this.comboTxt(c.hi.parts) + ' = ' + (Math.round(c.hi.mg * 10) / 10) + ' mg · แยกเม็ดสองสีให้ผู้ป่วยดูง่าย และจัดใส่ตลับยารายสัปดาห์',
              cells: plan.cells,
              summary: (Math.round(c.dose * 10) / 10) + ' mg · ' + this.frac(weekTabs) + ' เม็ด/สัปดาห์ · 2 ขนาด · คลาดเคลื่อน ' + (Math.round(c.err * 1000) / 10) + '%',
              halfWarn: c.halfUsed
            };
          }
          const totalTabs = c.N * c.u / c.s;
          const col = WCOLOR[c.s] || {};
          const rule = c.base === 0
            ? 'ทานเฉพาะวันที่ไฮไลต์ ' + plan.take.length + ' วัน/สัปดาห์ และงดยาวัน' + plan.skip.join(' และวัน') + ' — ย้ำว่าวันที่งดคือวันเดิมทุกสัปดาห์'
            : (c.extra === 0
              ? 'ทานขนาดเท่ากันทุกวัน เวลาเดิมทุกเย็น จำง่ายที่สุดและลดโอกาสทานผิด'
              : 'ทานขนาดพื้นฐานทุกวัน และเพิ่มขนาดเฉพาะวัน' + plan.hiNames.join(' วัน') + ' (' + c.extra + ' วัน/สัปดาห์)');
          let easy = 'ปานกลาง';
          if (c.extra === 0 && !c.halfUsed) easy = 'ง่ายที่สุด';
          else if (c.halfUsed && c.extra > 0) easy = 'ต้องจำมากขึ้น';
          else if (c.base === 0) easy = 'มีวันงดยา';
          return {
            title: 'แผน ' + (idx + 1),
            badge: idx === 0 ? 'แนะนำ' : '',
            badgeBg: idx === 0 ? C.tealS : 'transparent',
            badgeFg: idx === 0 ? C.teal : 'transparent',
            border: idx === 0 ? C.teal : 'rgba(22,33,31,.10)',
            note: 'เม็ด ' + c.s + ' mg (สี' + col.name + ') · ' + easy,
            rule,
            cells: plan.cells,
            summary: (Math.round(c.dose * 10) / 10) + ' mg · ' + this.frac(totalTabs) + ' เม็ด/สัปดาห์ (' + c.s + ' mg) · 1 ขนาด · คลาดเคลื่อน ' + (Math.round(c.err * 1000) / 10) + '%',
            halfWarn: c.halfUsed
          };
        });
      } else {
        v.wPlans = [{title:'หยุดยา', badge:'', badgeBg:'transparent', badgeFg:'transparent', border:'rgba(179,38,30,.25)',
          note:'', rule:'ยังจัดตารางไม่ได้ในภาวะนี้', summary:'—', halfWarn:false,
          cells: DAYS.map(d => ({day:d, mg:'—', pills:[], tabs:'หยุดยา', bg:C.dangerS, bd:'rgba(179,38,30,.25)', dayFg:C.danger, mgFg:C.danger, tabFg:C.danger}))}];
      }

      const A = (kind, title, text) => {
        const m = {d:[C.dangerS,'rgba(179,38,30,.25)',C.danger,'#7A2A24'], w:[C.warnS,'rgba(166,106,0,.22)',C.warn,'#6B4A0F'], i:[C.tealS,'rgba(15,93,87,.18)',C.teal,'#2C4B47']}[kind];
        v.wAlerts.push({title, text, bg:m[0], bd:m[1], fg:m[2], body:m[3]});
      };
      if (b.hold) A('d','ต้องหยุดยาก่อนเริ่มตารางใหม่','เริ่มตารางด้านบนหลังจากงดยาตามคำแนะนำและ INR กลับเข้าช่วงเป้าหมายแล้วเท่านั้น ระหว่างนี้ให้ตรวจ INR ตามรอบที่กำหนด');
      if (best && best.halfUsed && !st.noHalf) A('w','มีการหักแบ่งเม็ดยา','ตารางนี้ต้องหักครึ่งเม็ด ตรวจสอบว่าผู้ป่วยมีที่ตัดยาและทำได้ถูกต้อง หากไม่มั่นใจ ให้เปิดตัวเลือก “ไม่ต้องหักแบ่งเม็ดยา”');
      if (best && best.err > 0.02) A('w','ขนาดจริงคลาดเคลื่อนจากที่คำนวณ','ตารางให้ขนาดรวม ' + (Math.round(best.dose * 10) / 10) + ' mg/wk เทียบกับเป้าหมาย ' + (Math.round(raw * 10) / 10) + ' mg/wk (' + (Math.round(best.err * 1000) / 10) + '%) ยอมรับได้หากน้อยกว่า 5% แต่ควรตรวจ INR ซ้ำตามรอบ');
      A('i','คำแนะนำแก่ผู้ป่วย','ทานยาเวลาเดิมทุกวัน แนะนำช่วงเย็นเพื่อให้ปรับขนาดได้ในวันเดียวกันหลังทราบผล INR · หากลืมยาให้ทานทันทีที่นึกได้ภายในวันเดียวกัน ห้ามทานชดเชยเป็น 2 เท่าในวันถัดไป และบันทึกไว้แจ้งเภสัชกร');
      A('i','สิ่งที่ทำให้ INR แกว่ง','ยาปฏิชีวนะ (โดยเฉพาะ cotrimoxazole, metronidazole, fluconazole), amiodarone, NSAIDs, สมุนไพร (ขมิ้นชัน, แปะก๊วย, โสม), แอลกอฮอล์ และอาหารวิตามินเคสูง (ผักใบเขียวเข้ม) — เน้นให้ทานปริมาณผักสม่ำเสมอ ไม่ใช่งดผัก');
    } else {
      v.wBandBg = '#FFFFFF'; v.wBandBd = C.line; v.wBandFg = C.mut;
      v.wBandLabel = ''; v.wAction = ''; v.wDetail = ''; v.wNewDose = ''; v.wDelta = ''; v.wRecheck = '';
    }

    /* ---- calculator sub-tabs ---- */
    v.toolTabs = [['calc','เครื่องคิดเลข'],['date','คำนวณวันที่'],['insulin','Insulin']].map(([id, label]) => {
      const a = st.calcTool === id;
      return {label, go: () => this.setState({calcTool: id}), fw: a ? '600' : '500',
        fg: a ? '#16211F' : C.mut, bg: a ? '#FFFFFF' : 'transparent',
        sh: a ? '0 1px 3px rgba(22,33,31,.14)' : 'none'};
    });
    v.showCalc = st.calcTool === 'calc';
    v.showDate = st.calcTool === 'date';
    v.showInsulin = st.calcTool === 'insulin';

    /* ---- date calculation ---- */
    const THMON = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const thai = (d) => d ? d.getDate() + ' ' + THMON[d.getMonth()] + ' ' + (d.getFullYear() + 543) : '—';
    const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const pd = (s) => { if (!s) return null; const d = new Date(s + 'T00:00'); return isNaN(d.getTime()) ? null : d; };
    const today = new Date();
    v.dcModeOpts = [this.seg(st.dcMode === 'diff', 'ผลต่างระหว่างวันที่', '', () => this.setState({dcMode: 'diff'})),
                    this.seg(st.dcMode === 'addsub', 'บวก / ลบ จำนวนวัน', '', () => this.setState({dcMode: 'addsub'}))];
    v.dcIsDiff = st.dcMode === 'diff';
    v.dcIsAdd = st.dcMode === 'addsub';
    v.dcFrom = st.dcFrom; v.dcTo = st.dcTo; v.dcBase = st.dcBase; v.dcDays = st.dcDays;
    v.setDcFrom = (e) => this.setState({dcFrom: e.target.value});
    v.setDcTo = (e) => this.setState({dcTo: e.target.value});
    v.setDcBase = (e) => this.setState({dcBase: e.target.value});
    v.setDcDays = (e) => this.setState({dcDays: e.target.value});
    v.dcToday = () => this.setState({dcFrom: iso(today), dcBase: iso(today)});
    v.dcFromLabel = thai(pd(st.dcFrom));
    v.dcToLabel = thai(pd(st.dcTo));
    v.dcBaseLabel = thai(pd(st.dcBase));
    v.dcOpOpts = [['add','บวก'],['sub','ลบ']].map(([id, label]) => ({
      label, go: () => this.setState({dcOp: id}),
      fw: st.dcOp === id ? '600' : '400', fg: st.dcOp === id ? C.teal : C.mut,
      bg: st.dcOp === id ? C.tealS : '#FBFAF7', bd: st.dcOp === id ? C.teal : 'rgba(22,33,31,.12)'
    }));
    if (st.dcMode === 'diff') {
      const a = pd(st.dcFrom), b = pd(st.dcTo);
      if (a && b) {
        const days = Math.round((b - a) / 86400e3);
        const abs = Math.abs(days);
        v.dcResult = abs.toLocaleString('en-US') + ' วัน';
        const wk = Math.floor(abs / 7), rem = abs % 7;
        const mo = Math.floor(abs / 30.44 * 10) / 10;
        v.dcSub = (wk ? wk + ' สัปดาห์' + (rem ? ' ' + rem + ' วัน' : '') : '')
          + (abs >= 14 ? (wk ? ' · ' : '') + 'ประมาณ ' + mo + ' เดือน' : '')
          + (days < 0 ? ' · ปลายทางอยู่ก่อนต้นทาง' : '')
          || 'ช่วงเวลาสั้นกว่า 1 สัปดาห์';
        v.dcHasResult = true;
      } else { v.dcResult = '—'; v.dcSub = 'เลือกวันที่ทั้งสองช่อง'; v.dcHasResult = false; }
    } else {
      const a = pd(st.dcBase), n = parseInt(st.dcDays, 10);
      if (a && isFinite(n)) {
        const out = new Date(a.getTime() + (st.dcOp === 'sub' ? -n : n) * 86400e3);
        v.dcResult = thai(out);
        const wd = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][out.getDay()];
        v.dcSub = 'วัน' + wd + ' · ' + (st.dcOp === 'sub' ? 'ย้อนหลัง ' : 'นับไปข้างหน้า ') + n.toLocaleString('en-US') + ' วัน';
        v.dcHasResult = true;
      } else { v.dcResult = '—'; v.dcSub = 'เลือกวันที่ตั้งต้นและจำนวนวัน'; v.dcHasResult = false; }
    }
    v.dcResultFg = v.dcHasResult ? C.ink : '#9AA5A2';

    /* ---- insulin dispensing ---- */
    v.insUnits = st.insUnits; v.insDays = st.insDays;
    v.setInsUnits = (e) => this.setState({insUnits: e.target.value});
    v.setInsDays = (e) => this.setState({insDays: e.target.value});
    v.insSpareBox = {
      mark: st.insSpare ? '✓' : '',
      toggle: () => this.setState({insSpare: !st.insSpare}),
      bg: st.insSpare ? C.tealS : '#FBFAF7', bd: st.insSpare ? C.teal : 'rgba(22,33,31,.12)',
      boxBg: st.insSpare ? C.teal : '#FFFFFF', boxBd: st.insSpare ? C.teal : 'rgba(22,33,31,.20)'
    };
    Object.assign(v, computeInsulin(st.insUnits, st.insDays));

    /* ---- ADR ---- */
    const withTime = st.adrScale === 'hour';
    v.dtType = withTime ? 'datetime-local' : 'date';
    v.adrEdit = true;
    v.adrSheet = true;
    v.adrSplit = true;
    v.adrLayout = st.narrow ? 'minmax(0,1fr)' : 'minmax(0,1.05fr) minmax(0,1fr)';
    v.viewOpts = [];
    v.scaleOpts = [];
    const pf = (k) => (e) => this.setState({pt: Object.assign({}, st.pt, {[k]: e.target.value})});
    v.pt = st.pt;
    v.setHN = pf('hn'); v.setName = pf('name'); v.setAge = pf('age'); v.setSex = pf('sex'); v.setHx = pf('hx');
    v.setReactionType = (e) => this.setState({reactionType: e.target.value});
    v.setPharmNote = (e) => this.setState({pharmNote: e.target.value});
    v.pharmNote = st.pharmNote;
    v.reactionType = st.reactionType;
    v.typeOpts = ['Type A (คาดเดาได้จากฤทธิ์ยา)','Type B (idiosyncratic / immune)','Type I IgE-mediated','Type II cytotoxic','Type III immune complex','Type IV T-cell mediated (delayed)','ยังระบุไม่ได้'].map(t => ({
      label: t, go: () => this.setState({reactionType: t}),
      fw: st.reactionType === t ? '600' : '400',
      fg: st.reactionType === t ? C.teal : C.mut,
      bg: st.reactionType === t ? C.tealS : '#FBFAF7',
      bd: st.reactionType === t ? C.teal : 'rgba(22,33,31,.12)'
    }));
    v.outcomeOpts = [['recovering','กำลังดีขึ้น'],['recovered','หายเป็นปกติ'],['sequelae','หายแต่มีความผิดปกติเหลือ'],['ongoing','ยังมีอาการ'],['death','เสียชีวิต']].map(([id, label]) => ({
      label, go: () => this.setState({outcome: id}),
      fw: st.outcome === id ? '600' : '400',
      fg: st.outcome === id ? C.teal : C.mut,
      bg: st.outcome === id ? C.tealS : '#FBFAF7',
      bd: st.outcome === id ? C.teal : 'rgba(22,33,31,.12)'
    }));

    v.drugRows = st.drugs.map((d, i) => ({
      id: d.id, name: d.name, dose: d.dose, route: d.route, start: d.start, stop: d.stop,
      color: BARCOL[i % BARCOL.length],
      susLabel: d.suspect ? 'ยาที่สงสัย' : 'ยาที่ใช้ร่วม',
      susBg: d.suspect ? C.dangerS : '#FBFAF7',
      susBd: d.suspect ? C.danger : 'rgba(22,33,31,.12)',
      susFg: d.suspect ? C.danger : C.mut,
      susFw: d.suspect ? '600' : '400',
      toggleSus: () => this.setRow('drugs', d.id, 'suspect', !d.suspect),
      setName: (e) => {
        const val = e.target.value;
        const hit = DRUGPRESET.find(p => p[0].toLowerCase() === val.trim().toLowerCase());
        if (hit && !d.dose && !d.route) {
          this.setState({drugs: this.state.drugs.map(r => r.id === d.id
            ? Object.assign({}, r, {name: hit[0], dose: hit[1], route: hit[2]}) : r)});
        } else this.setRow('drugs', d.id, 'name', val);
      },
      setDose: (e) => this.setRow('drugs', d.id, 'dose', e.target.value),
      setRoute: (e) => this.setRow('drugs', d.id, 'route', e.target.value),
      startD: this.dOf(d.start), startT: this.tOf(d.start),
      stopD: this.dOf(d.stop), stopT: this.tOf(d.stop),
      setStartD: this.setPart('drugs', d.id, 'start', 'date'),
      setStartT: this.setPart('drugs', d.id, 'start', 'time'),
      setStopD: this.setPart('drugs', d.id, 'stop', 'date'),
      setStopT: this.setPart('drugs', d.id, 'stop', 'time'),
      del: () => this.delRow('drugs', d.id)
    }));
    v.addDrug = () => this.addRow('drugs', {name:'', dose:'', route:'', start:'', stop:'', suspect:false});
    v.drugPresets = DRUGPRESET.map(p => p[0]);
    v.sxPresets = SXPRESET;
    v.hxChips = ['ไม่มีประวัติแพ้ยา', 'ไม่ทราบประวัติ', 'มีประวัติแพ้ยา (ระบุด้านล่าง)'].map(t => {
      const val = t === 'มีประวัติแพ้ยา (ระบุด้านล่าง)' ? '' : t;
      const on = st.pt.hx === val && (val !== '' || !!st.pt.hx === false && st.pt.hx === '');
      const active = st.pt.hx === t || (t === 'มีประวัติแพ้ยา (ระบุด้านล่าง)' && st.pt.hx && st.pt.hx !== 'ไม่มีประวัติแพ้ยา' && st.pt.hx !== 'ไม่ทราบประวัติ');
      return {label: t,
        go: () => this.setState({pt: Object.assign({}, this.state.pt, {hx: val})}),
        fw: active ? '600' : '400',
        fg: active ? C.teal : C.mut,
        bg: active ? C.tealS : '#FBFAF7',
        bd: active ? C.teal : 'rgba(22,33,31,.12)'};
    });
    v.routeOpts = [
      ['PO', 'PO — รับประทาน'], ['IV', 'IV — ฉีดเข้าหลอดเลือดดำ'], ['IM', 'IM — ฉีดเข้ากล้ามเนื้อ'],
      ['SC', 'SC — ฉีดใต้ผิวหนัง'], ['SL', 'SL — อมใต้ลิ้น'], ['PR', 'PR — เหน็บทวาร'],
      ['Inhalation', 'Inhalation — สูดพ่น'], ['Nebulized', 'Nebulized — พ่นฝอยละออง'],
      ['Topical', 'Topical — ทาผิวหนัง'], ['Eye drop', 'Eye drop — หยอดตา'],
      ['Ear drop', 'Ear drop — หยอดหู'], ['Intradermal', 'Intradermal — ฉีดในผิวหนัง'],
      ['Intrathecal', 'Intrathecal — ฉีดเข้าไขสันหลัง'], ['Intra-articular', 'Intra-articular — ฉีดเข้าข้อ']
    ].map(([v, t]) => ({v, t}));

    v.eventRows = st.events.map(e0 => ({
      id: e0.id, desc: e0.desc, onset: e0.onset, better: e0.better,
      setDesc: (e) => this.setRow('events', e0.id, 'desc', e.target.value),
      onsetD: this.dOf(e0.onset), onsetT: this.tOf(e0.onset),
      betterD: this.dOf(e0.better), betterT: this.tOf(e0.better),
      setOnsetD: this.setPart('events', e0.id, 'onset', 'date'),
      setOnsetT: this.setPart('events', e0.id, 'onset', 'time'),
      setBetterD: this.setPart('events', e0.id, 'better', 'date'),
      setBetterT: this.setPart('events', e0.id, 'better', 'time'),
      del: () => this.delRow('events', e0.id),
      sevOpts: ['mild','moderate','severe'].map(s => ({
        label: SEV[s].label, go: () => this.setRow('events', e0.id, 'severity', s),
        fg: e0.severity === s ? SEV[s].fg : C.mut,
        bg: e0.severity === s ? SEV[s].bg : '#FBFAF7',
        bd: e0.severity === s ? SEV[s].fg : 'rgba(22,33,31,.12)',
        fw: e0.severity === s ? '600' : '400'
      }))
    }));
    v.addEvent = () => this.addRow('events', {desc:'', onset:'', severity:'moderate', better:''});
    v.sxChips = SXPRESET.slice(0, 10).map(s => ({
      label: s.split(' (')[0],
      go: () => {
        const list = st.events.slice();
        const blank = list.findIndex(e => !e.desc);
        if (blank >= 0) { list[blank] = Object.assign({}, list[blank], {desc: s}); this.setState({events: list}); }
        else { list.push({id: st.seq + 1, desc: s, onset: '', severity: 'moderate', better: ''}); this.setState({events: list, seq: st.seq + 1}); }
      }
    }));
    const miss = [];
    if (!st.drugs.some(d => d.name && d.suspect)) miss.push('ยังไม่ระบุยาที่สงสัย');
    if (!st.drugs.some(d => d.name && d.suspect && d.start)) miss.push('ยาที่สงสัยยังไม่มีวันเริ่มยา');
    if (!st.events.some(e => e.desc)) miss.push('ยังไม่ระบุอาการที่เกิดขึ้น');
    if (!st.events.some(e => e.onset)) miss.push('ยังไม่ระบุวันที่เริ่มมีอาการ');
    if (!st.pt.hn && !st.pt.name) miss.push('ยังไม่ระบุชื่อหรือ HN ผู้ป่วย');
    const njA = this.naranjoScore();
    if (njA.answered < 10) miss.push('Naranjo ตอบแล้ว ' + njA.answered + '/10 ข้อ');
    if (!st.pharmNote) miss.push('ยังไม่มีบันทึกเภสัชกร');
    v.missRows = miss;
    v.hasMiss = miss.length > 0;
    v.missTitle = 'ยังกรอกไม่ครบ ' + miss.length + ' รายการ';
    v.completeTxt = 'ข้อมูลครบถ้วน พร้อมพิมพ์และบันทึกลง HOSxp';

    v.labRows = st.labs.map(l => ({
      id: l.id, name: l.name, date: l.date, value: l.value,
      setName: (e) => this.setRow('labs', l.id, 'name', e.target.value),
      dateD: this.dOf(l.date),
      setDate: this.setPart('labs', l.id, 'date', 'date'),
      setValue: (e) => this.setRow('labs', l.id, 'value', e.target.value),
      del: () => this.delRow('labs', l.id)
    }));
    v.addLab = () => this.addRow('labs', {name:'', date:'', value:''});
    v.labPresets = LABPRESET;
    v.freqPresets = ['OD', 'OD ac', 'OD pc', 'OD hs', 'BID', 'BID ac', 'BID pc', 'TID', 'TID pc', 'QID', 'prn', 'สัปดาห์ละครั้ง', 'q6h', 'q8h', 'q12h', 'q24h', 'stat', 'ครั้งเดียว'];
    v.unitPresets = ['mg/dL', 'mg%', 'U/L', 'cells/mm³', '%', 'x10³/µL', 'g/dL', 'mEq/L', 'µmol/L', 'ng/mL', 'ºC', 'positive', 'negative'];

    const sp = this.span();
    v.hasTimeline = !!sp;
    v.tlBars = []; v.tlTicks = []; v.tlLabs = []; v.tlBands = []; v.tlOnsets = []; v.tlGrid = [];
    v.tlRange = '';
    if (sp) {
      const ordered = st.drugs.map((d, i) => ({d, color: BARCOL[i % BARCOL.length]}))
        .filter(x => this.parseD(x.d.start))
        .sort((x, y) => (y.d.suspect ? 1 : 0) - (x.d.suspect ? 1 : 0));
      const firstOnset = st.events.map(e => this.parseD(e.onset)).filter(Boolean).sort((p, q) => p - q)[0] || null;
      ordered.forEach(x => {
        const d = x.d;
        const s0 = this.parseD(d.start);
        const e0 = this.parseD(d.stop);
        const end = e0 || new Date(sp.hi);
        const l = this.pctOf(s0.getTime(), sp), r = this.pctOf(end.getTime(), sp);
        let lat = '';
        if (firstOnset) {
          const h = (firstOnset - s0) / 3600e3;
          lat = h < 0 ? 'เริ่มยาหลังเกิดอาการ'
            : (h < 48 ? Math.round(h) + ' ชม. ก่อนเกิดอาการ' : Math.round(h / 24) + ' วันก่อนเกิดอาการ');
        }
        v.tlBars.push({
          name: d.name || '(ไม่ระบุชื่อยา)',
          dose: [d.dose, d.route].filter(Boolean).join(' '),
          meta: this.fmtD(d.start, withTime) + '  →  ' + (d.stop ? this.fmtD(d.stop, withTime) : 'ยังใช้อยู่'),
          lat, latFg: /หลังเกิดอาการ/.test(lat) ? C.mut : C.danger,
          left: l + '%', width: Math.max(r - l, 1.2) + '%',
          bg: d.suspect ? x.color : 'rgba(22,33,31,.22)',
          nameFg: d.suspect ? '#16211F' : '#6B7B77',
          nameFw: d.suspect ? '600' : '500',
          rowBg: d.suspect ? 'rgba(179,38,30,.045)' : 'transparent',
          tag: d.suspect ? 'ยาที่สงสัย' : 'ใช้ร่วม',
          tagBg: d.suspect ? C.dangerS : 'rgba(22,33,31,.05)',
          tagFg: d.suspect ? C.danger : C.mut,
          endCapOp: d.stop ? '1' : '0',
          arrowOp: d.stop ? '0' : '1'
        });
      });
      st.events.forEach(ev => {
        const on = this.parseD(ev.onset);
        if (!on) return;
        const sev = SEV[ev.severity] || SEV.moderate;
        const bt = this.parseD(ev.better);
        const l = this.pctOf(on.getTime(), sp);
        const r = bt ? this.pctOf(bt.getTime(), sp) : Math.min(l + 3, 100);
        v.tlBands.push({
          left: l + '%', width: Math.max(r - l, 1.6) + '%',
          label: ev.desc || 'อาการ', sevLabel: sev.label,
          fg: sev.fg, bg: sev.bg, bd: sev.fg,
          onsetTxt: 'เริ่ม ' + this.fmtD(ev.onset, withTime),
          betterTxt: bt ? 'ดีขึ้น ' + this.fmtD(ev.better, withTime) : 'ยังมีอาการ',
          openOp: bt ? '0' : '1'
        });
        v.tlOnsets.push({left: l + '%', color: sev.fg});
        if (bt) v.tlOnsets.push({left: r + '%', color: C.ok});
      });
      const labLanes = [];
      st.labs.forEach(l => {
        const at = this.parseD(l.date);
        if (!at || !l.name) return;
        const p = this.pctOf(at.getTime(), sp);
        let lane = 0;
        while (labLanes[lane] !== undefined && p - labLanes[lane] < 20) lane++;
        labLanes[lane] = p;
        v.tlLabs.push({left: p + '%', label: l.name + ' ' + l.value, top: (lane * 22) + 'px',
          shift: p < 10 ? 'none' : (p > 90 ? 'translateX(-100%)' : 'translateX(-50%)')});
      });
      v.labZone = Math.max(labLanes.length * 22, 20) + 'px';
      const dayMs = 86400e3;
      const spanDays = sp.w / dayMs;
      const stepDays = spanDays <= 4 ? 1 : (spanDays <= 10 ? 2 : (spanDays <= 24 ? 5 : Math.ceil(spanDays / 4)));
      const d0 = new Date(sp.lo); d0.setHours(0, 0, 0, 0);
      let t0 = d0.getTime();
      if (t0 < sp.lo) t0 += dayMs;
      const marks = [];
      for (let t = t0; t <= sp.hi; t += stepDays * dayMs) marks.push(t);
      if (marks.length > 3) {
        const uniq = [];
        [marks[0], marks[Math.floor(marks.length / 2)], marks[marks.length - 1]].forEach(m => {
          if (uniq.indexOf(m) < 0) uniq.push(m);
        });
        marks.length = 0; uniq.forEach(m => marks.push(m));
      }
      if (marks.length === 3) {
        const pm = this.pctOf(marks[1], sp);
        if (pm < 32 || pm > 68) marks.splice(1, 1);
      }
      marks.forEach((t, i) => {
        const p = this.pctOf(t, sp);
        const dd = new Date(t);
        v.tlTicks.push({left: p + '%',
          tickShift: p > 99 ? 'translateX(-1px)' : 'none',
          shift: i === 0 ? 'none' : (i === marks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)'),
          label: String(dd.getDate()).padStart(2, '0') + '/' + String(dd.getMonth() + 1).padStart(2, '0') + '/' + String(dd.getFullYear() + 543).slice(2)});
        if (i > 0 && i < marks.length - 1) v.tlGrid.push({left: p + '%'});
      });
      v.axisStart = v.tlTicks.length ? v.tlTicks[0].label : '';
      v.axisEnd = v.tlTicks.length ? v.tlTicks[v.tlTicks.length - 1].label : '';
      v.tlRange = this.fmtD(new Date(sp.lo).toISOString().slice(0, 16), false) + ' – ' + this.fmtD(new Date(sp.hi).toISOString().slice(0, 16), false);
      v.hasBands = v.tlBands.length > 0;
      v.hasLabsTl = v.tlLabs.length > 0;
    }

    const sus0 = st.drugs.filter(d => d.suspect && d.name);
    const ev0 = st.events.filter(e0 => this.parseD(e0.onset));
    v.latRows = [];
    sus0.forEach(d => ev0.forEach(e0 => {
      const l = this.latency(d, e0);
      if (!l) return;
      v.latRows.push({drug: d.name, ev: e0.desc || 'เหตุการณ์', txt: l.txt,
        fg: l.neg ? C.mut : (l.h <= 24 * 14 ? C.danger : C.warn),
        bg: l.neg ? 'rgba(22,33,31,.05)' : (l.h <= 24 * 14 ? C.dangerS : C.warnS),
        verdict: l.neg ? 'ไม่เข้ากับลำดับเวลา' : (l.h <= 24 * 14 ? 'เข้ากับลำดับเวลา' : 'ช้ากว่าปกติ ควรพิจารณาสาเหตุอื่นร่วม')});
    }));
    v.hasLat = v.latRows.length > 0;

    const nj = this.naranjoScore();
    v.njRows = nj.rows.map(r => ({
      n: r.n + '.', q: r.q,
      autoTag: r.auto ? 'เติมอัตโนมัติ · ' + r.why : '',
      autoFg: r.auto ? C.teal : 'transparent',
      autoBg: r.auto ? C.tealS : 'transparent',
      pts: r.val ? (r.pts > 0 ? '+' + r.pts : String(r.pts)) : '–',
      ptsFg: r.pts > 0 ? C.teal : (r.pts < 0 ? C.danger : C.mut),
      opts: [['y','ใช่'],['n','ไม่ใช่'],['u','ไม่ทราบ']].map(([k, label]) => ({
        label, go: () => this.setState({naranjo: Object.assign({}, st.naranjo, {[r.n]: k})}),
        fw: r.val === k ? '600' : '400',
        fg: r.val === k ? C.teal : C.mut,
        bg: r.val === k ? C.tealS : '#FBFAF7',
        bd: r.val === k ? C.teal : 'rgba(22,33,31,.12)'
      }))
    }));
    const who = this.whoUmc();
    v.whoLabel = who.label; v.whoTh = who.th; v.whoWhy = who.why; v.whoFg = who.fg; v.whoBg = who.bg;
    const pv = this.prevScore();
    v.pvLabel = pv.label; v.pvFg = pv.fg; v.pvBg = pv.bg;
    v.pvProgress = 'ตอบแล้ว ' + pv.answered + '/' + PREVQ.length;
    v.pvRows = pv.rows.map(r => {
      const set = (val) => () => this.setState(s0 => {
        const p = Object.assign({}, s0.prev || {});
        if (p[r.n] === val) delete p[r.n]; else p[r.n] = val;
        return {prev: p};
      });
      const btn = (val, lab, onFg, onBg) => {
        const on = r.val === val;
        return {lab, go: set(val), fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? onBg : '#FFFFFF', bd: on ? onBg : 'rgba(22,33,31,.14)'};
      };
      return {n: r.n + '.', q: r.q, en: r.en,
        yes: btn('y', 'ใช่', '#FFFFFF', '#B3261E'), no: btn('n', 'ไม่ใช่', '#FFFFFF', '#2E7D5B'),
        autoTag: r.auto ? 'เติมอัตโนมัติ · ' + r.why : '', hasAuto: r.auto};
    });
    v.pvAllNo = () => this.setState(s0 => {
      const p = Object.assign({}, s0.prev || {});
      PREVQ.forEach((q, i) => { if (!p[i + 1] && !(pv.rows[i].auto)) p[i + 1] = 'n'; });
      return {prev: p};
    });
    const trig = st.triggers || [];
    const tg = [];
    TRIGGERS.forEach(t => {
      let g = tg.find(x => x.g === t.g);
      if (!g) { g = {g: t.g, items: []}; tg.push(g); }
      const on = trig.indexOf(t.id) >= 0;
      g.items.push({t: t.t, hint: t.hint, mark: on ? '✓' : '',
        go: () => this.setState(s0 => {
          const cur = (s0.triggers || []).slice(), i = cur.indexOf(t.id);
          if (i >= 0) cur.splice(i, 1); else cur.push(t.id);
          return {triggers: cur};
        }),
        bg: on ? '#E4EFEC' : '#FFFFFF', bd: on ? '#0F5D57' : 'rgba(22,33,31,.11)',
        boxBg: on ? '#0F5D57' : '#FFFFFF', boxBd: on ? '#0F5D57' : 'rgba(22,33,31,.22)'});
    });
    v.trigGroups = tg;
    v.trigCount = trig.length ? 'เลือก ' + trig.length + ' รายการ' : 'ยังไม่ได้เลือก';
    v.trigCite = TRIG_CITE;
    v.sheetTrig = trig.map(id => (TRIGGERS.find(t => t.id === id) || {}).t).filter(Boolean).join(' · ');
    v.hasSheetTrig = trig.length > 0;
    v.sheetPvYes = pv.rows.filter(r => r.val === 'y').map(r => r.q).join(' · ');
    v.hasSheetPvYes = pv.yes > 0;
    v.savedFlash = !!st.savedFlash;
    v.saveLabel = st.savedFlash ? 'บันทึกแล้ว ✓' : 'บันทึกเคส';
    v.regOpen = !!st.regOpen;
    v.openReg = () => this.setState({regOpen: true});
    v.closeReg = () => this.setState({regOpen: false});
    v.doExportCsv = () => this.exportCsv();
    /* severity / type (std 9 · 3.1) */
    const xSv = st.sev2 || {type: '', serious: []};
    const xSetSv = (p) => this.setState(s0 => ({sev2: Object.assign({}, s0.sev2 || {type: '', serious: []}, p)}));
    v.adrTypeOpts = [['A', 'Type A', 'เกี่ยวกับฤทธิ์ยา คาดการณ์ได้ ขึ้นกับขนาดยา'], ['B', 'Type B', 'ไม่เกี่ยวกับฤทธิ์ยา เช่น ภูมิแพ้ / idiosyncratic']].map(([k, l, d]) => {
      const on = xSv.type === k;
      return {lab: l, d, go: () => xSetSv({type: on ? '' : k}), fg: on ? '#FFFFFF' : '#16211F', dFg: on ? 'rgba(255,255,255,.8)' : '#6B7B77', bg: on ? '#0F5D57' : '#FFFFFF', bd: on ? '#0F5D57' : 'rgba(22,33,31,.14)'};
    });
    v.seriousOpts = SERIOUS.map(k => {
      const on = (xSv.serious || []).indexOf(k) >= 0;
      return {lab: k, mark: on ? '✓' : '', go: () => xSetSv({serious: on ? xSv.serious.filter(x => x !== k) : (xSv.serious || []).concat([k])}),
        bg: on ? '#FBEAE8' : '#FFFFFF', bd: on ? '#B3261E' : 'rgba(22,33,31,.12)', boxBg: on ? '#B3261E' : '#FFFFFF', boxBd: on ? '#B3261E' : 'rgba(22,33,31,.22)'};
    });
    v.isSerious = (xSv.serious || []).length > 0;
    v.seriousTxt = (xSv.serious || []).length ? 'Serious ADR — ' + xSv.serious.join(', ') : 'Non-serious';
    v.sheetAdrType = (xSv.type ? 'Type ' + xSv.type : 'ยังไม่จำแนก type') + ' · ' + v.seriousTxt;

    /* registry extra tabs */
    const xToday = new Date().toISOString().slice(0, 10);
    const xInfo = st.infoLog || [];
    v.infoRows = xInfo.slice(0, 50).map(x => ({d: this.fmtD(x.date, false), who: x.who, topic: x.topic, how: x.how, und: String(x.und), sat: String(x.sat),
      del: () => this.lsSet('infoEval.v1', (st.infoLog || []).filter(y => y.id !== x.id), 'infoLog')}));
    v.hasInfo = xInfo.length > 0; v.noInfo = xInfo.length === 0;
    const xAvg = (k) => xInfo.length ? (xInfo.reduce((a, x) => a + (Number(x[k]) || 0), 0) / xInfo.length).toFixed(1) : '—';
    v.infoStats = [{k:'ครั้งที่ให้ข้อมูล', v: String(xInfo.length)}, {k:'บุคลากร / ผู้รับบริการ', v: xInfo.filter(x => x.who === 'บุคลากรทางการแพทย์').length + ' / ' + xInfo.filter(x => x.who !== 'บุคลากรทางการแพทย์').length}, {k:'ความเข้าใจเฉลี่ย', v: xAvg('und') + ' / 5'}, {k:'ความพึงพอใจเฉลี่ย', v: xAvg('sat') + ' / 5'}];
    const xInew = st.infoNew || {date: xToday, who: 'ผู้ป่วย / ญาติ', topic: '', how: 'ให้คำปรึกษารายบุคคล', und: 0, sat: 0};
    const xSetI = (p) => this.setState({infoNew: Object.assign({}, xInew, p)});
    const xChip = (opts, cur, fn, color) => opts.map(o => { const on = cur === o; return {lab: o, go: () => fn(o), fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? (color || '#0F5D57') : '#FFFFFF', bd: on ? (color || '#0F5D57') : 'rgba(22,33,31,.14)'}; });
    v.inDate = xInew.date; v.setInDate = (e) => xSetI({date: e.target.value});
    v.inTopic = xInew.topic; v.setInTopic = (e) => xSetI({topic: e.target.value});
    v.inWho = xChip(['ผู้ป่วย / ญาติ', 'บุคลากรทางการแพทย์', 'ชุมชน / ประชาชน'], xInew.who, (o) => xSetI({who: o}));
    v.inHow = xChip(['ให้คำปรึกษารายบุคคล', 'เอกสาร / แผ่นพับ', 'ประชุม / บรรยาย', 'สื่อออนไลน์'], xInew.how, (o) => xSetI({how: o}));
    v.inUnd = [1,2,3,4,5].map(n => { const on = xInew.und === n; return {lab: String(n), go: () => xSetI({und: n}), fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? '#0F5D57' : '#FFFFFF', bd: on ? '#0F5D57' : 'rgba(22,33,31,.14)'}; });
    v.inSat = [1,2,3,4,5].map(n => { const on = xInew.sat === n; return {lab: String(n), go: () => xSetI({sat: n}), fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? '#0F5D57' : '#FFFFFF', bd: on ? '#0F5D57' : 'rgba(22,33,31,.14)'}; });
    v.inCanSave = !!(xInew.topic.trim() && xInew.und && xInew.sat);
    v.inSaveOp = v.inCanSave ? '1' : '.45';
    v.inSave = () => { if (!v.inCanSave) return; this.lsSet('infoEval.v1', [Object.assign({id: Date.now()}, xInew)].concat(st.infoLog || []), 'infoLog'); this.setState({infoNew: Object.assign({}, xInew, {topic: '', und: 0, sat: 0})}); };

    const xItl = st.intLog || [];
    const xSTS = ['ติดตามอยู่', 'ครบกำหนด ไม่พบ ADR', 'พบ ADR', 'หยุดติดตาม'];
    v.intRows = xItl.map(x => {
      const due = x.next && new Date(x.next) < new Date(xToday) && x.status === 'ติดตามอยู่';
      return {hn: x.hn, drug: x.drug, group: x.group, start: this.fmtD(x.start, false), next: x.next ? this.fmtD(x.next, false) : '—', note: x.note, status: x.status,
        dueTxt: due ? 'เลยกำหนดติดตาม' : '', isDue: due,
        stFg: x.status === 'พบ ADR' ? '#B3261E' : (x.status === 'ติดตามอยู่' ? '#A66A00' : '#2E7D5B'),
        stBg: x.status === 'พบ ADR' ? '#FBEAE8' : (x.status === 'ติดตามอยู่' ? '#FBF1DE' : '#EAF4EE'),
        cycle: () => { const list = (st.intLog || []).map(y => y.id === x.id ? Object.assign({}, y, {status: xSTS[(xSTS.indexOf(y.status) + 1) % xSTS.length]}) : y); this.lsSet('intensive.v1', list, 'intLog'); },
        del: () => this.lsSet('intensive.v1', (st.intLog || []).filter(y => y.id !== x.id), 'intLog')};
    });
    v.hasInt = xItl.length > 0; v.noInt = xItl.length === 0;
    v.intStats = INT_GROUPS.map(g => ({k: g.split(' (')[0], v: String(xItl.filter(x => x.group === g).length)}));
    const xTnew = st.intNew || {hn: '', drug: '', group: INT_GROUPS[0], start: xToday, next: '', note: '', status: 'ติดตามอยู่'};
    const xSetT = (p) => this.setState({intNew: Object.assign({}, xTnew, p)});
    v.itHn = xTnew.hn; v.setItHn = (e) => xSetT({hn: e.target.value});
    v.itDrug = xTnew.drug; v.setItDrug = (e) => xSetT({drug: e.target.value});
    v.itStart = xTnew.start; v.setItStart = (e) => xSetT({start: e.target.value});
    v.itNext = xTnew.next; v.setItNext = (e) => xSetT({next: e.target.value});
    v.itNote = xTnew.note; v.setItNote = (e) => xSetT({note: e.target.value});
    v.itGroups = xChip(INT_GROUPS, xTnew.group, (o) => xSetT({group: o}));
    v.itCanSave = !!(xTnew.hn.trim() && xTnew.drug.trim());
    v.itSaveOp = v.itCanSave ? '1' : '.45';
    v.itSave = () => { if (!v.itCanSave) return; this.lsSet('intensive.v1', [Object.assign({id: Date.now()}, xTnew)].concat(st.intLog || []), 'intLog'); this.setState({intNew: null}); };

    v.anonOn = !!st.anonCsv;
    v.anonMark = st.anonCsv ? '✓' : '';
    v.anonBg = st.anonCsv ? '#0F5D57' : '#FFFFFF';
    v.toggleAnon = () => this.setState({anonCsv: !st.anonCsv});
    v.clearAll = () => {
      if (!window.confirm('ลบข้อมูลทั้งหมดในเครื่องนี้ (ทะเบียน ADR, CQI, intensive monitoring, การให้ข้อมูลด้านยา, การประเมินตนเอง)? ควรสำรองไฟล์ก่อน')) return;
      store.clearLocal();
      this.setState({cases: [], cqi: [], infoLog: [], intLog: [], ptcLog: [], stdA: {}, wlLog: [], importMsg: 'ลบข้อมูลทั้งหมดแล้ว'});
    };

    /* standards page */
    if (mode === 'std') {
      const {E, ok} = this.stdEvidence();
      const A = st.stdA || {};
      const setA = (id, p) => this.lsSet('stdAssess.v1', Object.assign({}, A, {[id]: Object.assign({}, A[id] || {}, p)}), 'stdA');
      const goTo = (g) => () => {
        if (!g) return;
        if (g === 'ref') return this.setState({mode: 'adr', refOpen: true, refTab: 'bl'});
        if (g.indexOf('reg:') === 0) return this.setState({mode: 'adr', regOpen: true, regTab: g.slice(4)});
        this.setState({mode: g});
      };
      const KIND = {app: ['แอปรองรับ', '#0F5D57', '#E4EFEC'], doc: ['เอกสารโรงพยาบาล', '#6B7B77', 'rgba(22,33,31,.06)'], both: ['แอป + เอกสาร', '#A66A00', '#FBF1DE']};
      v.stdBlocks = STD.map(sd => {
        let reached = 0, stop = false;
        const levels = sd.levels.map(L => {
          const items = L.items.map(it => {
            const a = A[it.id] || {};
            const done = a.st === 'done';
            const k = KIND[it.kind];
            const evOk = it.ev ? ok[it.ev] : null;
            return {id: it.id.split('-')[1], t: it.t, app: it.app, kind: k[0], kFg: k[1], kBg: k[2],
              ev: it.ev ? E[it.ev] : '', hasEv: !!it.ev, evFg: evOk ? '#2E7D5B' : '#A66A00', evDot: evOk ? '#2E7D5B' : '#C9A24A',
              hasGo: !!it.go, go: goTo(it.go),
              note: a.note || '', setNote: (e) => setA(it.id, {note: e.target.value}),
              s0: {lab: 'ยังไม่ดำเนินการ / กำลังดำเนินการ', go: () => setA(it.id, {st: a.st === 'doing' ? '' : 'doing'}), fg: a.st === 'doing' ? '#FFFFFF' : '#3E4F4C', bg: a.st === 'doing' ? '#A66A00' : '#FFFFFF', bd: a.st === 'doing' ? '#A66A00' : 'rgba(22,33,31,.14)'},
              s1: {lab: 'ดำเนินการแล้ว', go: () => setA(it.id, {st: done ? '' : 'done'}), fg: done ? '#FFFFFF' : '#3E4F4C', bg: done ? '#2E7D5B' : '#FFFFFF', bd: done ? '#2E7D5B' : 'rgba(22,33,31,.14)'},
              rowBd: done ? 'rgba(46,125,91,.35)' : 'rgba(22,33,31,.09)', done};
          });
          const all = items.every(x => x.done);
          if (!stop && all) reached = L.lv; else stop = true;
          const nDone = items.filter(x => x.done).length;
          return {lv: String(L.lv), label: 'ระดับ ' + L.lv, prog: nDone + '/' + items.length, items,
            hFg: all ? '#2E7D5B' : '#16211F', hBg: all ? '#EAF4EE' : '#F4F1EA', isTarget: L.lv === sd.target};
        });
        const meet = reached >= sd.target;
        return {no: String(sd.no), title: sd.title, goal: sd.goal, target: 'เป้าหมายปัจจุบัน ระดับ ' + sd.target,
          reached: String(reached), reachedTxt: reached ? 'ผ่านระดับ ' + reached : 'ยังไม่ผ่านระดับ 1',
          meetTxt: meet ? 'ผ่านเป้าหมาย' : 'ยังไม่ครบเป้าหมาย', meetFg: meet ? '#2E7D5B' : '#A66A00', meetBg: meet ? '#EAF4EE' : '#FBF1DE',
          levels, next: sd.next.map(n => ({id: n.id.split('-')[1], t: n.t, app: n.app})), nextTitle: 'ระดับถัดไป (พัฒนาต่อในอนาคต)',
          open: st.stdOpen !== String(sd.no) ? true : true};
      });
      v.stdSrc = STD_SRC;
      const ptc = (st.ptcLog || []).slice().sort();
      const fy = this.fyStart();
      v.ptcRows = ptc.map(d => ({d: this.fmtD(d, false), inFy: new Date(d) >= fy, fyTag: new Date(d) >= fy ? 'ปีงบนี้' : '',
        del: () => this.lsSet('ptcMeet.v1', (st.ptcLog || []).filter(x => x !== d), 'ptcLog')}));
      v.hasPtc = ptc.length > 0;
      v.ptcDate = st.ptcDate || '';
      v.setPtcDate = (e) => this.setState({ptcDate: e.target.value});
      v.addPtc = () => { if (!st.ptcDate) return; if ((st.ptcLog || []).indexOf(st.ptcDate) < 0) this.lsSet('ptcMeet.v1', (st.ptcLog || []).concat([st.ptcDate]), 'ptcLog'); this.setState({ptcDate: ''}); };
      v.ptcFyCount = 'ปีงบประมาณ ' + (fy.getFullYear() + 544) + ' · นำเสนอแล้ว ' + ptc.filter(d => new Date(d) >= fy).length + ' ครั้ง (เป้าหมาย 3–4 ครั้ง/ปี)';
      v.refReview = REF_REVIEW;
      v.printStd = () => this.printStdReport();
    }

    const rep = st.rep || {};
    const setRep = (patch) => this.setState(s0 => ({rep: Object.assign({}, s0.rep || {}, patch)}));
    const opt = (key, val, lab, onBg) => {
      const on = rep[key] === val;
      return {lab, go: () => setRep({[key]: on ? '' : val}), fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? onBg : '#FFFFFF', bd: on ? onBg : 'rgba(22,33,31,.14)'};
    };
    v.medErrOpts = [opt('medErr', 'yes', 'รายงานแล้ว', '#0F5D57'), opt('medErr', 'no', 'ยังไม่รายงาน', '#A66A00'), opt('medErr', 'na', 'ไม่เข้าข่าย', '#6B7B77')];
    v.hpvcOpts = [opt('hpvc', 'sent', 'ส่งแล้ว', '#0F5D57'), opt('hpvc', 'pending', 'รอส่ง', '#A66A00'), opt('hpvc', 'notreq', 'ไม่ต้องส่ง', '#6B7B77')];
    v.medErrNo = rep.medErrNo || ''; v.setMedErrNo = (e) => setRep({medErrNo: e.target.value});
    v.hpvcDate = rep.hpvcDate || ''; v.setHpvcDate = (e) => setRep({hpvcDate: e.target.value});
    v.showMedErrNo = rep.medErr === 'yes';
    v.showHpvcDate = rep.hpvc === 'sent';
    v.isPrev = pv.k === 'prev';
    v.notPrev = pv.k !== 'prev';
    const RCACAT = ['บุคลากร (ความรู้ / ภาระงาน)', 'การสื่อสารและส่งต่อข้อมูล', 'ระบบเตือนในคอมพิวเตอร์', 'การซักประวัติแพ้ยา', 'กระบวนการสั่งใช้ / จ่ายยา', 'ผู้ป่วย (ความรู้ / ความร่วมมือ)', 'นโยบาย / แนวทางปฏิบัติ'];
    v.rcaCats = RCACAT.map(k => {
      const on = (rep.rcaCat || []).indexOf(k) >= 0;
      return {lab: k, go: () => setRep({rcaCat: on ? (rep.rcaCat || []).filter(x => x !== k) : (rep.rcaCat || []).concat([k])}),
        fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? '#B3261E' : '#FFFFFF', bd: on ? '#B3261E' : 'rgba(22,33,31,.14)'};
    });
    v.rcaCause = rep.rcaCause || ''; v.setRcaCause = (e) => setRep({rcaCause: e.target.value});
    v.rcaPlan = rep.rcaPlan || ''; v.setRcaPlan = (e) => setRep({rcaPlan: e.target.value});
    v.rcaOwner = rep.rcaOwner || ''; v.setRcaOwner = (e) => setRep({rcaOwner: e.target.value});
    const ML = {yes:'รายงานเข้าระบบ med error แล้ว', no:'ยังไม่รายงานเข้าระบบ med error', na:'ไม่เข้าข่ายรายงาน med error'};
    const HL = {sent:'ส่งรายงาน อย./HPVC แล้ว', pending:'รอส่งรายงาน อย./HPVC', notreq:'ไม่ต้องส่งรายงาน อย./HPVC'};
    const repBits = [];
    if (rep.hpvc) repBits.push(HL[rep.hpvc] + (rep.hpvc === 'sent' && rep.hpvcDate ? ' (' + this.fmtD(rep.hpvcDate, false) + ')' : ''));
    if (rep.medErr) repBits.push(ML[rep.medErr] + (rep.medErr === 'yes' && rep.medErrNo ? ' เลขที่ ' + rep.medErrNo : ''));
    v.sheetRep = repBits.join(' · '); v.hasSheetRep = repBits.length > 0;
    v.sheetRca = pv.k === 'prev' && (rep.rcaCause || rep.rcaPlan)
      ? [(rep.rcaCat || []).length ? '[' + rep.rcaCat.join(', ') + ']' : '', rep.rcaCause ? 'สาเหตุ: ' + rep.rcaCause : '', rep.rcaPlan ? 'แผนแก้ไข: ' + rep.rcaPlan : '', rep.rcaOwner ? 'ผู้รับผิดชอบ: ' + rep.rcaOwner : ''].filter(Boolean).join(' · ') : '';
    v.hasSheetRca = !!v.sheetRca;
    v.regTabs = [['ov', 'ภาพรวม'], ['wl', 'ภาระงาน / Med error / คลังยา'], ['trend', 'แนวโน้มรายไตรมาส'], ['intensive', 'Intensive monitoring'], ['info', 'การให้ข้อมูลด้านยา'], ['cqi', 'CQI / R2R'], ['data', 'สำรอง / PDPA']].map(([k, l]) => {
      const on = (st.regTab || 'ov') === k;
      return {lab: l, go: () => this.setState({regTab: k, importMsg: ''}), fg: on ? '#16211F' : '#6B7B77', bg: on ? '#FFFFFF' : 'transparent', fw: on ? '600' : '500', sh: on ? '0 1px 3px rgba(22,33,31,.12)' : 'none'};
    });
    v.regIsOv = (st.regTab || 'ov') === 'ov';
    v.regIsTrend = st.regTab === 'trend';
    v.regIsCqi = st.regTab === 'cqi';
    v.regIsData = st.regTab === 'data';
    v.regIsInt = st.regTab === 'intensive';
    v.regIsWl = st.regTab === 'wl';
    if (st.regOpen && st.regTab === 'wl') {
      const wl = (st.wlLog || []).slice().sort((a, b) => b.month.localeCompare(a.month));
      const nowM = new Date().toISOString().slice(0, 7);
      const month = st.wlMonth || nowM;
      const saved = wl.find(x => x.month === month) || {};
      const draft = st.wlDraft && st.wlDraft.month === month ? st.wlDraft : Object.assign({month}, saved);
      const N = (x) => { const n = parseFloat(String(x == null ? '' : x).replace(/,/g, '')); return isNaN(n) ? 0 : n; };
      const TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
      const ml = (m) => { const [y, mo] = m.split('-').map(Number); return TH[mo - 1] + ' ' + String(y + 543).slice(2); };
      v.wlMonth = month;
      v.setWlMonth = (e) => this.setState({wlMonth: e.target.value.slice(0, 7), wlDraft: null});
      v.wlMonthLabel = ml(month);
      v.wlHasSaved = !!saved.month;
      const groups = [];
      WL_FIELDS.forEach(f => {
        let g = groups.find(x => x.g === f.g);
        if (!g) { g = {g: f.g, items: []}; groups.push(g); }
        g.items.push({l: f.l, u: f.u, val: draft[f.k] == null ? '' : String(draft[f.k]),
          set: (e) => { const val = e.target.value; this.setState(s0 => ({wlDraft: Object.assign({}, s0.wlDraft && s0.wlDraft.month === month ? s0.wlDraft : draft, {[f.k]: val, month})})); }});
      });
      v.wlGroups = groups;
      v.wlSave = () => {
        const list = (st.wlLog || []).filter(x => x.month !== month);
        list.push(Object.assign({}, draft, {month, saved: new Date().toISOString().slice(0, 16)}));
        this.lsSet('workload.v1', list, 'wlLog');
        this.setState({wlDraft: null});
      };
      v.wlSaveLabel = saved.month ? 'บันทึกการแก้ไข' : 'บันทึกเดือนนี้';
      const calc = (x) => {
        const rx = N(x.rxOpd) + N(x.rxIpd);
        const me = N(x.mePre) + N(x.meTx) + N(x.meDis) + N(x.meAdm);
        const staff = N(x.ph);
        return {rx, me,
          rate: rx ? (me / rx * 1000).toFixed(2) : '—',
          harm: String(N(x.meHarm)),
          perPh: staff ? Math.round(rx / staff).toLocaleString('en-US') : '—',
          months: N(x.use) ? (N(x.stock) / N(x.use)).toFixed(1) : '—',
          short: String(N(x.shortage))};
      };
      const c0 = calc(draft);
      v.wlCalc = [
        {k: 'ใบสั่งยารวม', v: c0.rx.toLocaleString('en-US'), u: 'ใบ'},
        {k: 'ใบสั่งยาต่อเภสัชกร', v: c0.perPh, u: 'ใบ/คน'},
        {k: 'Med error ต่อ 1,000 ใบสั่งยา', v: c0.rate, u: ''},
        {k: 'ระยะเวลาสำรองคลัง', v: c0.months, u: 'เดือน'}
      ];
      const last = wl.slice(0, 12).reverse();
      const mx = Math.max(1, ...last.map(x => calc(x).rx));
      v.wlRows = wl.slice(0, 12).map(x => { const c = calc(x); return {m: ml(x.month), rx: c.rx.toLocaleString('en-US'), me: String(c.me), rate: c.rate, harm: c.harm, perPh: c.perPh, months: c.months, short: c.short,
        harmFg: N(x.meHarm) ? '#B3261E' : '#16211F', edit: () => this.setState({wlMonth: x.month, wlDraft: null})}; });
      v.wlBars = last.map(x => { const c = calc(x); return {m: ml(x.month), h: Math.max(c.rx / mx * 100, 3) + '%', rate: c.rate}; });
      v.wlHas = wl.length > 0; v.wlNone = wl.length === 0;
    }
    v.regIsInfo = st.regTab === 'info';
    v.doPrintReport = () => this.printQuarterReport();
    v.doBackup = () => this.backupJson();
    v.onImport = (e) => { const f = e.target.files && e.target.files[0]; this.importJson(f); e.target.value = ''; };
    v.importMsg = st.importMsg || ''; v.hasImportMsg = !!st.importMsg;
    if (st.regOpen && st.regTab === 'trend') {
      const T = this.quarterTrend();
      const mx = Math.max(1, ...T.map(t => t.n));
      v.trendRows = T.map(t => ({label: t.label, n: String(t.n), prev: String(t.prev), sev: String(t.sev), rep: String(t.rep), hpvc: String(t.hpvc),
        h: Math.max(t.n / mx * 100, t.n ? 6 : 2) + '%', ph: t.n ? (t.prev / mx * 100) + '%' : '0%', op: t.n ? '1' : '.35',
        repFg: t.rep ? '#B3261E' : '#16211F'}));
    }
    const cqi = st.cqi || [];
    const ST = ['วางแผน', 'กำลังดำเนินการ', 'ติดตามผล', 'เสร็จสิ้น'];
    v.cqiRows = cqi.map(x => ({
      title: x.title || '(ไม่ระบุชื่อ)', type: x.type || 'CQI', problem: x.problem, measure: x.measure, indicator: x.indicator,
      ba: (x.before || '—') + '  →  ' + (x.after || '—'), status: x.status, start: x.start ? this.fmtD(x.start, false) : '',
      stFg: x.status === 'เสร็จสิ้น' ? '#2E7D5B' : (x.status === 'วางแผน' ? '#6B7B77' : '#A66A00'),
      stBg: x.status === 'เสร็จสิ้น' ? '#EAF4EE' : (x.status === 'วางแผน' ? 'rgba(22,33,31,.05)' : '#FBF1DE'),
      edit: () => this.setState({cqiEdit: Object.assign({}, x)}),
      del: () => this.saveCqi(this.loadCqi().filter(y => y.id !== x.id))
    }));
    v.hasCqi = cqi.length > 0; v.noCqi = cqi.length === 0;
    const blank = {id: 0, title: '', problem: '', measure: '', indicator: '', before: '', after: '', start: '', status: 'วางแผน', type: 'CQI'};
    v.cqiNew = () => this.setState({cqiEdit: Object.assign({}, blank, {id: Date.now()})});
    if (st.regOpen && st.regTab === 'cqi') {
      const R2 = this.registry();
      const sugg = [];
      if (R2.topDrugs[0]) sugg.push({t: 'ลด ADR จาก ' + R2.topDrugs[0].name, p: R2.topDrugs[0].name + ' เป็นยาที่สงสัยพบบ่อยที่สุดในทะเบียน (' + R2.topDrugs[0].n + ' ราย)', i: 'จำนวน ADR จาก ' + R2.topDrugs[0].name + ' ต่อไตรมาส'});
      const prevK = R2.kpis.find(k => k.k.indexOf('ป้องกันได้') === 0);
      if (prevK && prevK.v !== '0%' && prevK.v !== '—') sugg.push({t: 'ลด ADR ที่ป้องกันได้', p: 'ADR ที่ป้องกันได้คิดเป็น ' + prevK.v + ' ของเคสทั้งหมด', i: 'ร้อยละ ADR ที่ป้องกันได้'});
      const repK = R2.kpis.find(k => k.k === 'แพ้ยาซ้ำ');
      if (repK && repK.v !== '0') sugg.push({t: 'ป้องกันการแพ้ยาซ้ำ', p: 'พบผู้ป่วยแพ้ยาซ้ำ ' + repK.v + ' ราย', i: 'จำนวนผู้ป่วยแพ้ยาซ้ำ (เป้าหมาย 0)'});
      v.cqiSugg = sugg.map(x => ({t: x.t, p: x.p, use: () => this.setState({cqiEdit: Object.assign({}, blank, {id: Date.now(), title: x.t, problem: x.p, indicator: x.i})})}));
      v.hasSugg = sugg.length > 0;
    }
    const ce = st.cqiEdit;
    v.cqiEditing = !!ce;
    v.notEditingCqi = !ce;
    if (ce) {
      const f = (k) => (e) => this.setState(s0 => ({cqiEdit: Object.assign({}, s0.cqiEdit, {[k]: e.target.value})}));
      v.ce = ce;
      v.ceTitle = ce.title; v.ceProblem = ce.problem; v.ceMeasure = ce.measure; v.ceIndicator = ce.indicator;
      v.ceBefore = ce.before; v.ceAfter = ce.after; v.ceStart = ce.start;
      v.setCeTitle = f('title'); v.setCeProblem = f('problem'); v.setCeMeasure = f('measure'); v.setCeIndicator = f('indicator');
      v.setCeBefore = f('before'); v.setCeAfter = f('after'); v.setCeStart = f('start');
      v.ceType = ['CQI', 'R2R', 'งานวิจัย', 'นวัตกรรม'].map(x => {
        const on = (ce.type || 'CQI') === x;
        return {lab: x, go: () => this.setState(s0 => ({cqiEdit: Object.assign({}, s0.cqiEdit, {type: x})})),
          fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? '#0F5D57' : '#FFFFFF', bd: on ? '#0F5D57' : 'rgba(22,33,31,.14)'};
      });
      v.ceStatus = ST.map(x => {
        const on = ce.status === x;
        return {lab: x, go: () => this.setState(s0 => ({cqiEdit: Object.assign({}, s0.cqiEdit, {status: x})})),
          fg: on ? '#FFFFFF' : '#3E4F4C', bg: on ? '#0F5D57' : '#FFFFFF', bd: on ? '#0F5D57' : 'rgba(22,33,31,.14)'};
      });
      v.ceSave = () => {
        const list = this.loadCqi();
        const i = list.findIndex(y => y.id === ce.id);
        if (i >= 0) list[i] = ce; else list.unshift(ce);
        this.saveCqi(list);
        this.setState({cqiEdit: null});
      };
      v.ceCancel = () => this.setState({cqiEdit: null});
    }
    if (st.regOpen) {
      const R = this.registry();
      v.regN = R.n; v.regEmpty = R.n === 0; v.regHas = R.n > 0;
      v.regLegacy = R.legacy > 0 ? 'มีเคสเก่า ' + R.legacy + ' รายที่บันทึกก่อนเพิ่มระบบสรุป — เปิดเคสแล้วกดบันทึกอีกครั้งเพื่อนำเข้าตัวชี้วัด' : '';
      v.regHasLegacy = R.legacy > 0;
      v.regKpis = R.kpis; v.regMonths = R.months; v.regNar = R.nar; v.regWho = R.who;
      v.regDrugs = R.topDrugs; v.regHasDrugs = R.topDrugs.length > 0;
      v.regTrig = R.trig; v.regHasTrig = R.trig.length > 0;
    }
    v.njTotal = String(nj.total);
    v.njVerdict = nj.verdict;
    v.njFg = nj.vfg; v.njBg = nj.vbg;
    v.njProgress = nj.answered + ' / 10 ข้อ';
    v.resetNj = () => this.setState({naranjo: {}});

    v.altChips = ALTCAUSE.map(a => {
      const on = st.altCauses.indexOf(a.id) >= 0;
      return {label: a.label, toggle: () => {
        let cur = st.altCauses.slice();
        if (a.id === 'none') cur = on ? [] : ['none'];
        else { cur = cur.filter(x => x !== 'none'); const i = cur.indexOf(a.id); if (i >= 0) cur.splice(i, 1); else cur.push(a.id); }
        this.setState({altCauses: cur});
      }, fw: on ? '600' : '400', fg: on ? C.teal : C.mut,
        bg: on ? C.tealS : '#FBFAF7', bd: on ? C.teal : 'rgba(22,33,31,.12)'};
    });
    v.altNote = st.altNote;
    v.setAltNote = (e) => this.setState({altNote: e.target.value});
    v.altHint = st.altCauses.length === 0 ? 'ยังไม่ได้ระบุ — Naranjo ข้อ 5 จะยังไม่ถูกเติมอัตโนมัติ'
      : (st.altCauses.indexOf('none') >= 0 ? 'ไม่พบสาเหตุอื่น → Naranjo ข้อ 5 ตอบ "ไม่ใช่" (+2)'
      : 'พบสาเหตุอื่นที่เป็นไปได้ → Naranjo ข้อ 5 ตอบ "ใช่" (−1) ควรบันทึกเหตุผลประกอบ');

    v.critCards = ['sjs','dress','ana'].map(k => {
      const f = this.critFlag(k), open = st.critOpen === k;
      return {
        name: CRIT[k].name, hint: CRIT[k].hint,
        count: f.hits + ' / ' + f.total + ' ข้อ',
        verdict: f.met ? 'เข้าเกณฑ์' : (f.hits > 0 ? 'ยังไม่เข้าเกณฑ์' : 'ยังไม่ประเมิน'),
        fg: f.met ? C.danger : (f.hits > 0 ? C.warn : C.mut),
        bg: f.met ? C.dangerS : (f.hits > 0 ? C.warnS : 'rgba(22,33,31,.05)'),
        bd: f.met ? C.danger : (f.hits > 0 ? 'rgba(166,106,0,.3)' : 'rgba(22,33,31,.12)'),
        hintOp: f.hits > 0 ? '1' : '0.55',
        toggle: () => this.setState({critOpen: open ? '' : k}),
        chev: open ? 'ซ่อนรายการ' : 'ดูรายการ',
        bodyH: open ? 'auto' : '0px',
        bodyOp: open ? '1' : '0',
        bodyPad: open ? '11px 0 0' : '0',
        bodyVis: open ? 'visible' : 'hidden',
        items: CRIT[k].items.map((txt, i) => {
          const on = (st.crit[k] || {})[i];
          return {txt, mark: on ? '✓' : '',
            boxBg: on ? C.teal : '#FFFFFF', boxBd: on ? C.teal : 'rgba(22,33,31,.2)',
            rowBg: on ? C.tealS : '#FBFAF7', rowBd: on ? C.teal : 'rgba(22,33,31,.1)',
            toggle: () => {
              const cur = Object.assign({}, st.crit[k] || {});
              cur[i] = !cur[i];
              this.setState({crit: Object.assign({}, st.crit, {[k]: cur})});
            }};
        })
      };
    });
    v.critAlerts = ['sjs','dress','ana'].filter(k => this.critFlag(k).met).map(k => ({
      title: CRIT[k].name + ' — เข้าเกณฑ์', text: CRIT[k].hint
    }));
    v.hasCritAlerts = v.critAlerts.length > 0;

    v.xrefs = this.crossRefs();
    v.hasXrefs = v.xrefs.length > 0;
    v.xrefEmpty = !v.hasXrefs;
    v.xrefEmptyMsg = st.drugs.some(d => d.suspect && d.name)
      ? 'ยังไม่มีข้อมูล cross-reactivity สำหรับยาที่ระบุ — ตรวจสอบกลุ่มยาและ side chain ด้วยตนเอง'
      : 'ระบุชื่อยาที่สงสัยเพื่อดูยาที่ต้องหลีกเลี่ยงข้ามกลุ่มและยาทางเลือก';

    v.sheetAlt = st.altCauses.length
      ? st.altCauses.map(id => (ALTCAUSE.find(a => a.id === id) || {}).label).filter(Boolean).join(', ') + (st.altNote ? ' — ' + st.altNote : '')
      : 'ยังไม่ได้ระบุ';
    v.sheetCrit = ['sjs','dress','ana'].map(k => ({k, f: this.critFlag(k)})).filter(x => x.f.hits > 0)
      .map(x => ({name: CRIT[x.k].name, count: x.f.hits + '/' + x.f.total,
        verdict: x.f.met ? 'เข้าเกณฑ์' : 'ยังไม่เข้าเกณฑ์',
        fg: x.f.met ? C.danger : C.warn, bg: x.f.met ? C.dangerS : C.warnS}));
    v.hasSheetCrit = v.sheetCrit.length > 0;
    v.sheetXrefs = v.xrefs;
    v.hasSheetXrefs = v.hasXrefs;

    v.noteText = this.hosxpNote();
    v.copyLabel = this.state.copied ? 'คัดลอกแล้ว ✓' : 'คัดลอก HOSxp note';
    v.copyBg = this.state.copied ? '#0F5D57' : '#E4EFEC';
    v.copyFg = this.state.copied ? '#FFFFFF' : '#0F5D57';
    v.copyNote = () => {
      const t = this.hosxpNote();
      const flag = () => {
        this.setState({copied: true});
        clearTimeout(this._cpT);
        this._cpT = setTimeout(() => this.setState({copied: false}), 1800);
      };
      const legacy = () => {
        const ta = document.createElement('textarea');
        ta.value = t;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, t.length);
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        if (ok) flag();
        else window.prompt('กด Ctrl+C หรือ Cmd+C เพื่อคัดลอกข้อความนี้', t);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(t).then(flag).catch(legacy);
      } else legacy();
    };
    v.doPrint = () => window.print();
    v.clearAll = () => this.setState({
      pt: {hn:'', name:'', age:'', sex:'', hx:''},
      drugs: [{id:1, name:'', dose:'', route:'', start:'', stop:'', suspect:true}],
      events: [{id:1, desc:'', onset:'', severity:'moderate', better:''}],
      labs: [{id:1, name:'', date:'', value:''}],
      naranjo: {}, reactionType: '', outcome: 'recovering', pharmNote: '', seq: 3,
      altCauses: [], altNote: '', crit: {}, critOpen: '', pharmSign: '', doctorSign: '', prev: {}, triggers: [], rep: {medErr: '', medErrNo: '', hpvc: '', hpvcDate: '', rcaCat: [], rcaCause: '', rcaPlan: '', rcaOwner: ''}, sev2: {type: '', serious: []}
    }, () => { try { window.localStorage.removeItem('adrDraft.v2'); } catch (e) {} });
    let secN = 0;
    const nextSec = () => { secN += 1; return secN + '. '; };
    v.secDrugs = nextSec();
    v.secTimeline = v.hasTimeline ? nextSec() : '';
    v.secEvents = nextSec();
    v.secLabs = st.labs.some(l => l.name && l.value) ? nextSec() : '';
    v.secNaranjo = nextSec();
    v.secSummary = nextSec();
    v.sheetTitle = 'แบบประเมินอาการไม่พึงประสงค์จากการใช้ยา (ADR Assessment)';
    v.sheetPt = [st.pt.name || '—', st.pt.hn ? 'HN ' + st.pt.hn : '', st.pt.age ? 'อายุ ' + st.pt.age + ' ปี' : '', st.pt.sex].filter(Boolean).join('  ·  ');
    v.sheetHx = st.pt.hx || 'ไม่มีประวัติแพ้ยาเดิม';
    v.sheetOutcome = ({recovering:'กำลังดีขึ้น', recovered:'หายเป็นปกติ', sequelae:'หายแต่มีความผิดปกติเหลืออยู่', ongoing:'ยังคงมีอาการ', death:'เสียชีวิต'})[st.outcome];
    v.sheetType = st.reactionType || 'ยังระบุไม่ได้';
    v.sheetDate = this.fmtD(new Date().toISOString().slice(0, 16), false);
    v.sheetDrugs = st.drugs.filter(d => d.name).map(d => ({
      name: d.name, dose: [d.dose, d.route].filter(Boolean).join(' '),
      period: !d.start && !d.stop ? 'ไม่ระบุวันที่'
        : (!d.start ? 'ไม่ระบุวันเริ่ม → ' + this.fmtD(d.stop, withTime)
          : this.fmtD(d.start, withTime) + ' → ' + (d.stop ? this.fmtD(d.stop, withTime) : 'ยังใช้อยู่')),
      role: d.suspect ? 'ยาที่สงสัย' : 'ใช้ร่วม',
      roleFg: d.suspect ? C.danger : C.mut, roleBg: d.suspect ? C.dangerS : 'transparent'
    }));
    v.sheetEvents = st.events.filter(e0 => e0.desc).map(e0 => ({
      desc: e0.desc, sev: (SEV[e0.severity] || SEV.moderate).label,
      sevFg: (SEV[e0.severity] || SEV.moderate).fg, sevBg: (SEV[e0.severity] || SEV.moderate).bg,
      onset: this.fmtD(e0.onset, withTime), better: e0.better ? this.fmtD(e0.better, withTime) : '—'
    }));
    v.sheetLabs = st.labs.filter(l => l.name && l.value).map(l => ({name: l.name, value: l.value, date: this.fmtD(l.date, false)}));
    v.hasSheetLabs = v.sheetLabs.length > 0;
    v.sheetNjRows = nj.rows.map(r => ({n: r.n + '.', q: r.q,
      ans: r.val === 'y' ? 'ใช่' : (r.val === 'n' ? 'ไม่ใช่' : 'ไม่ทราบ'),
      pts: r.val ? (r.pts > 0 ? '+' + r.pts : String(r.pts)) : '0'}));
    /* ---- reference library ---- */
    v.refOpen = st.refOpen;
    v.refPanelH = st.refOpen ? 'auto' : '0px';
    v.refPanelOp = st.refOpen ? '1' : '0';
    v.refPanelVis = st.refOpen ? 'visible' : 'hidden';
    v.refPanelPad = st.refOpen ? '18px 0 0' : '0';
    v.toggleRefPanel = () => this.setState({refOpen: !st.refOpen});
    v.openRefTb = () => this.setState({refOpen: true, refTab: 'tb'});
    v.openRefWf = () => this.setState({refOpen: true, refTab: 'wf'});
    v.refCiteCount = 'ดูเอกสารอ้างอิง';
    v.refBtnTxt = st.refOpen ? 'ปิดข้อมูลอ้างอิง' : 'เปิดข้อมูลอ้างอิงด้านยา';
    v.refBtnBg = st.refOpen ? '#0F5D57' : '#E4EFEC';
    v.refBtnFg = st.refOpen ? '#FFFFFF' : '#0F5D57';
    const ALLTABS = {
      tb: [['tb','ยาวัณโรค']],
      warf: [['wf','Warfarin']],
      adr: [['bl','Beta-lactam'],['nsaid','NSAIDs'],['aed','ยากันชัก'],['sulfa','Sulfonamide'],['rash','ผื่นแพ้ยา'],['pgx','เภสัชพันธุศาสตร์'],['all','ทุกกลุ่มยา (' + ADVRULES.length + ')']]
    };
    const scope = ALLTABS[st.mode] || ALLTABS.adr;
    if (st.refOpen && !scope.some(t => t[0] === st.refTab)) {
      const want = scope[0][0];
      if (this._snapTab !== want) { this._snapTab = want; setTimeout(() => this.setState({refTab: want}), 0); }
    } else this._snapTab = null;
    v.refHasTabs = scope.length > 1;
    v.refScopeTitle = st.mode === 'tb' ? 'ข้อมูลอ้างอิง — ยาวัณโรค'
      : (st.mode === 'warf' ? 'ข้อมูลอ้างอิง — Warfarin' : 'ข้อมูลอ้างอิงด้านยา — การประเมินแพ้ยา');
    v.refTabs = scope.map(([id, label]) => {
      const a = st.refTab === id;
      return {label, go: () => this.setState({refTab: id}), fw: a ? '600' : '500',
        fg: a ? '#16211F' : C.mut, bg: a ? '#FFFFFF' : 'transparent',
        sh: a ? '0 1px 3px rgba(22,33,31,.14)' : 'none'};
    });
    v.refIsBL = st.refTab === 'bl';
    v.refIsNsaid = st.refTab === 'nsaid';
    v.refIsAed = st.refTab === 'aed';
    v.refIsSulfa = st.refTab === 'sulfa';
    v.refIsAll = st.refTab === 'all';
    v.refIsRash = st.refTab === 'rash';
    v.refIsPgx = st.refTab === 'pgx';
    const LVC = {"high":{"fg":"#B3261E","bg":"#FBEAE8"},"mid":{"fg":"#A66A00","bg":"#FBF1DE"},"low":{"fg":"#B3261E","bg":"#FBEAE8"},"ok":{"fg":"#2E7D5B","bg":"#EAF4EE"}};
    const mkBlocks = (arr) => arr.map(b => ({
      h: b.h, sub: b.sub || '', foot: b.foot || '',
      hasSub: !!b.sub, hasFoot: !!b.foot,
      accent: b.danger ? '#B3261E' : '#0F5D57',
      isKv: b.kind === 'kv', isList: b.kind === 'list', isDrug: b.kind === 'drug',
      isG3: b.kind === 'grid3', isG5: b.kind === 'grid5',
      isInr: b.kind === 'inr', isTarget: b.kind === 'target', isInter: b.kind === 'inter',
      items: b.items || [],
      head: (b.head || []).map(t => ({t}))
    }));
    const SHORT = {
      'สูตรยามาตรฐานและระยะเวลาการรักษา':'สูตรยา',
      'ขนาดยาผู้ใหญ่ตามน้ำหนักตัว (อายุมากกว่า 15 ปี)':'ขนาดยาตามน้ำหนัก',
      'ขนาดยาต่อกิโลกรัม ผลข้างเคียง และการติดตาม':'ขนาดยา/กก. รายตัว',
      'อาการไม่พึงประสงค์ — ต้องหยุดยาและส่งปรึกษาผู้เชี่ยวชาญ':'ADR ต้องหยุดยา',
      'อาการไม่พึงประสงค์ — ให้ยาต่อได้ โดยตรวจสอบขนาดยา':'ADR ให้ยาต่อได้',
      'ภาวะตับอักเสบจากยา — เกณฑ์หยุดยาและการเริ่มยาใหม่':'ตับอักเสบ',
      'ปฏิกิริยาทางผิวหนัง — แนวทางจัดการตามความรุนแรง':'ผื่นผิวหนัง',
      'กรณีพิเศษ — โรคไต โรคตับ ตั้งครรภ์ และผู้ติดเชื้อเอชไอวี':'กรณีพิเศษ',
      'การตรวจติดตามระหว่างการรักษา':'การติดตาม',
      'การเริ่มยาและการตรวจติดตาม INR':'เริ่มยา / ติดตาม INR',
      'ตารางปรับขนาดยาเพื่อให้ได้ INR เป้าหมาย 2.0–3.0':'ปรับขนาดตาม INR',
      'สาเหตุที่ทำให้ INR อยู่นอกช่วงเป้าหมาย':'สาเหตุ INR ผิดปกติ',
      'ช่วง INR เป้าหมายตามข้อบ่งใช้':'INR เป้าหมาย',
      'อันตรกิริยาและผลิตภัณฑ์ที่ต้องระวัง':'อันตรกิริยา',
      'การใช้ยาในระยะก่อนและหลังการทำหัตถการ':'ก่อน-หลังหัตถการ',
      'การใช้ยาในหญิงตั้งครรภ์และให้นมบุตร':'ตั้งครรภ์ / ให้นมบุตร',
      'หัวข้อการให้ความรู้ผู้ป่วยและข้อควรปฏิบัติ':'สอนผู้ป่วย',
      'การจัดระบบบริการและตัวชี้วัดคุณภาพ':'ตัวชี้วัดคุณภาพ'
    };
    const secNav = (arr, key) => {
      const sel = st[key] == null ? 0 : st[key];
      return {
        chips: arr.map((b, i) => {
          const on = i === sel;
          return {label: SHORT[b.h] || b.h,
            go: () => this.setState({[key]: i}),
            fg: on ? '#FFFFFF' : C.mut, bg: on ? C.teal : '#FBFAF7',
            bd: on ? C.teal : 'rgba(22,33,31,.13)', fw: on ? '600' : '500'};
        }),
        sel
      };
    };
    const tbNav = secNav(REF_TB_BLOCKS, 'refSecTb');
    const wfNav = secNav(REF_WF_BLOCKS, 'refSecWf');
    v.tbChips = tbNav.chips;
    v.wfChips = wfNav.chips;
    v.tbBlocks = mkBlocks([REF_TB_BLOCKS[tbNav.sel]]);
    v.wfBlocks = mkBlocks([REF_WF_BLOCKS[wfNav.sel]]);
    v.wfInrRows = REF_WF_INR.map(r => Object.assign({}, r, {fg: LVC[r.lv].fg, bg: LVC[r.lv].bg}));
    v.wfTargetRows = REF_WF_TARGET;
    v.wfInterRows = REF_WF_INTER.map(r => Object.assign({}, r, {fg: LVC[r.lv].fg, bg: LVC[r.lv].bg}));
    v.refIsTb = st.refTab === 'tb';
    v.refIsWf = st.refTab === 'wf';
    v.pgxRows = REF_PGX.map(r => Object.assign({}, r, {
      riskFg: r.risk === 'สูง' ? '#B3261E' : '#A66A00',
      riskBg: r.risk === 'สูง' ? '#FBEAE8' : '#FBF1DE',
      thai: /ไทย/.test(r.pop) ? 'พบในคนไทย' : '',
      thaiOp: /ไทย/.test(r.pop) ? '1' : '0'
    }));
    v.pgxInterval = REF_PGX_INTERVAL.map(([k, t]) => ({k, t}));
    v.pgxNotes = REF_PGX_NOTES;
    const rashFg = {'รุนแรงมาก': '#B3261E', 'รุนแรง': '#B3261E', 'ปานกลางถึงรุนแรง': '#A66A00', 'ปานกลาง': '#A66A00', 'เล็กน้อยถึงปานกลาง': '#6B7B77', 'เล็กน้อย': '#2E7D5B'};
    const rashBg = {'รุนแรงมาก': '#FBEAE8', 'รุนแรง': '#FBEAE8', 'ปานกลางถึงรุนแรง': '#FBF1DE', 'ปานกลาง': '#FBF1DE', 'เล็กน้อยถึงปานกลาง': 'rgba(22,33,31,.05)', 'เล็กน้อย': '#E7F2EC'};
    v.rashRows = REF_RASH.map(r => Object.assign({}, r, {sevFg: rashFg[r.sev], sevBg: rashBg[r.sev]}));
    v.rashCite = REF_RASH_CITE;
    v.refQuery = st.refQuery || '';
    v.setRefQuery = (e) => this.setState({refQuery: e.target.value});
    const q = (st.refQuery || '').trim().toLowerCase();
    v.refAllRows = ADVRULES.filter(r => !q || (r.cls + ' ' + r.avoid + ' ' + r.use + ' ' + r.struct + ' ' + String(r.re)).toLowerCase().indexOf(q) >= 0)
      .map(r => ({cls: r.cls, struct: r.struct, avoid: r.avoid, use: r.use, cite: r.cite,
        keys: String(r.re).replace(/^\/|\/i$/g, '').replace(/\|/g, ' · ')}));
    v.refAllCount = v.refAllRows.length + ' กลุ่ม';
    v.refAllEmpty = v.refAllRows.length === 0;
    v.refTitle = ({bl:'Beta-lactam — การแพ้ข้ามกลุ่มตาม R1 side chain',
      nsaid:'NSAIDs — กลุ่มโครงสร้างเคมีและการแยกประเภทการแพ้',
      aed:'ยากันชัก — Aromatic กับ Non-aromatic AED',
      sulfa:'Sulfonamide — โครงสร้างเคมีและการแพ้ข้ามกลุ่ม',
      rash:'ผื่นแพ้ยาที่พบบ่อย — ลักษณะ ระยะเวลาที่เกิด และยาที่เป็นสาเหตุ',
      pgx:'เภสัชพันธุศาสตร์ — คู่ยีน HLA และยาที่สัมพันธ์กับผื่นแพ้ยาแบบรุนแรง',
      tb:'ยาวัณโรค — สูตรยา ขนาดยา ผลข้างเคียง และการติดตาม',
      wf:'Warfarin — ช่วง INR เป้าหมาย การปรับขนาดยา และอันตรกิริยา',
      all:'ทุกกลุ่มยา — ยาที่ต้องเลี่ยงและยาที่ใช้แทนได้'})[st.refTab];
    v.refSub = ({bl:'cross-reactivity ไม่ใช่ class effect — ตัดสินที่ side chain ไม่ใช่รุ่นของยา',
      nsaid:'แยก pseudoallergy (COX-1 mediated) ออกจาก true allergy (IgE / T-cell) ก่อนเลือกยาแทน',
      aed:'ผู้ที่แพ้ aromatic AED มีโอกาสแพ้ aromatic AED ตัวอื่น 40–80% — เลือกกลุ่ม non-aromatic แทน',
      sulfa:'ATB sulfonamide มี N1 ring และ N4 arylamine · non-ATB sulfonamide ไม่มีสองโครงสร้างนี้',
      rash:'ใช้เทียบระยะเวลาที่เกิดอาการกับชนิดผื่น เพื่อประเมินความสมเหตุสมผลของความสัมพันธ์กับยา',
      pgx:'ตรวจยีนก่อนสั่งใช้ยาช่วยลดความเสี่ยง SJS/TEN, DRESS และ AGEP ในกลุ่มประชากรที่มีความถี่แอลลีลสูง',
      tb:'อ้างอิงแนวทางการควบคุมวัณโรคประเทศไทย พ.ศ. 2564 และ WHO 2022',
      wf:'ตารางปรับขนาดยาอ้างอิง ACCP และ ASH — ใช้ร่วมกับดุลพินิจทางคลินิกเสมอ',
      all:'ฐานข้อมูลเดียวกับที่ระบบใช้เติมข้อแนะนำในใบสรุปอัตโนมัติ ค้นด้วยชื่อยาหรือชื่อกลุ่ม'})[st.refTab];
    v.blGroups = REF_BL_GROUPS;
    v.blAvoid = REF_BL_AVOID;
    const nsCol = {c1:{fg:'#B3261E',bg:'#FBEAE8',bd:'rgba(179,38,30,.28)'},
      pref:{fg:'#A66A00',bg:'#FBF1DE',bd:'rgba(166,106,0,.3)'},
      c2:{fg:'#2E7D5B',bg:'#E7F2EC',bd:'rgba(46,125,91,.3)'},
      weak:{fg:'#2F6DA8',bg:'#D8E6F3',bd:'rgba(47,109,168,.3)'}};
    v.nsaidRows = REF_NSAID.map(([cls, drugs]) => ({cls,
      drugs: drugs.map(([name, k]) => Object.assign({name}, nsCol[k]))}));
    v.nsaidLegend = [{label:'ยับยั้ง COX-1 ชัดเจน', k:'c1'},{label:'COX-2 preferential', k:'pref'},
      {label:'COX-2 selective', k:'c2'},{label:'ยับยั้ง COX น้อย', k:'weak'}]
      .map(x => Object.assign({label:x.label}, nsCol[x.k]));
    v.nsaidCmp = REF_NSAID_CMP.map(r => ({topic:r[0], pseudo:r[1], truea:r[2]}));
    v.aedSecs = REF_AED.map(s => ({head:s.head,
      dot: s.arom ? '#B5581F' : '#2E7D5B',
      rows: s.rows.map(([cls, drugs]) => ({cls,
        drugs: drugs.map(n => ({name:n,
          fg: s.arom ? '#B5581F' : '#2E7D5B',
          bg: s.arom ? '#F7EBE2' : '#E7F2EC',
          bd: s.arom ? 'rgba(181,88,31,.3)' : 'rgba(46,125,91,.3)'}))}))}));
    const flag = {C:{txt:'ห้ามใช้', fg:'#B3261E', bg:'#FBEAE8'}, P:{txt:'ระวัง', fg:'#A66A00', bg:'#FBF1DE'}, '-':{txt:'—', fg:C.mut, bg:'transparent'}};
    v.sulfaSecs = REF_SULFA.map(s => ({sec:s.sec,
      secFg: s.atb ? '#B3261E' : '#2F6DA8',
      secBg: s.atb ? '#FBEAE8' : '#D8E6F3',
      rows: s.rows.map(r => ({name:r[0], brand:r[1],
        n1: r[2] ? '✓' : '✕', n1Fg: r[2] ? '#2E7D5B' : '#9AA5A2',
        n4: r[3] ? '✓' : '✕', n4Fg: r[3] ? '#2E7D5B' : '#9AA5A2',
        flagTxt: flag[r[4]].txt, flagFg: flag[r[4]].fg, flagBg: flag[r[4]].bg}))}));
    v.sulfaNotes = REF_SULFA_NOTES;
    const rashCites = [
      'วรรณวรัชญ์ อารีย์, ภัทรรัตน์ แพรเจริญ, เกวลี สินขจร, พรรษมณฑา แก้วพุดซา, ณัฐธิดา สุวรรณวงศ์. Adverse Drug Reactions and Drug Hypersensitivity Review. บทความวิชาการสำหรับการศึกษาต่อเนื่อง สภาเภสัชกรรม รหัส 1015-1-000-006-06-2564 (รับรอง 9 มิถุนายน 2564)',
      'Blumenthal KG, Peter JG, Trubiano JA, Phillips EJ. Antibiotic allergy. Lancet. 2019;393(10167):183-198',
      'Ardern-Jones MR, Friedmann PS. Skin manifestations of drug allergy. Br J Clin Pharmacol. 2011;71(5):672-683',
      'Pichler WJ. Delayed drug hypersensitivity reactions. Ann Intern Med. 2003;139(8):683-693',
      'Pichler WJ, Hausmann O. Classification of drug hypersensitivity into allergic, p-i, and pseudo-allergic forms. Int Arch Allergy Immunol. 2017;171(3-4):166-179',
      'แนวทางเวชปฏิบัติสำหรับการดูแลผู้ป่วยที่มีการแพ้ชนิดรุนแรง พ.ศ. 2560 (Clinical Practice Guidelines for Anaphylaxis 2017) สมาคมโรคภูมิแพ้ โรคหืด และวิทยาภูมิคุ้มกันแห่งประเทศไทย',
      'แนวทางการดูแลรักษากลุ่มอาการ Drug hypersensitivity syndrome. ราชวิทยาลัยกุมารแพทย์แห่งประเทศไทย',
      'Yacoub MR, et al. Drug induced exfoliative dermatitis: state of the art. Clin Mol Allergy. 2016;14:9',
      'Konyoung P, Tassaneeyakul W. Incidence of drug induced-acute generalized exanthematous pustulosis (AGEP) reported in Udonthani Hospital. Srinagarind Med J. 2014;29(3):283-284',
      'Sánchez-Borges M, et al. Diagnosis and treatment of urticaria and angioedema. World Allergy Organ J. 2012;5(11):125-147'
    ];
    const allCites = ADVRULES.map(r => r.cls + ' — ' + r.cite);
    v.refCites = st.refTab === 'tb' ? REF_TB_CITES : st.refTab === 'wf' ? REF_WF_CITES : st.refTab === 'pgx' ? REF_PGX_CITES : st.refTab === 'rash' ? rashCites : (st.refTab === 'all' ? allCites : (REF_CITES[st.refTab] || []));
    v.refCiteOpen = st.refCite;
    v.toggleCite = () => this.setState({refCite: !st.refCite});
    v.citeChev = st.refCite ? 'ซ่อนเอกสารอ้างอิง' : 'ดูเอกสารอ้างอิง (' + v.refCites.length + ')';
    v.citeH = st.refCite ? 'auto' : '0px';
    v.citeOp = st.refCite ? '1' : '0';
    v.citeVis = st.refCite ? 'visible' : 'hidden';
    v.citePad = st.refCite ? '12px 0 0' : '0';

    v.genOpts = [
      {k:'card', label:'ออกบัตรแพ้ยา', sub:'ระบุระดับความมั่นใจตามคะแนน Naranjo'},
      {k:'hosxp', label:'บันทึกในระบบ HOSxp', sub:'ลงข้อมูลแพ้ยาในเวชระเบียนอิเล็กทรอนิกส์'},
      {k:'alt', label:'แจ้งยาทางเลือกแก่แพทย์', sub:'ยาที่ต้องหลีกเลี่ยงและยาที่ใช้แทนได้'},
      {k:'nurse', label:'แจ้งพยาบาลและหอผู้ป่วย', sub:'เฝ้าระวังอาการและงดยาที่สงสัย'},
      {k:'edu', label:'ให้ความรู้ผู้ป่วยและญาติ', sub:'อาการที่ต้องกลับมาพบแพทย์ และการพกบัตรแพ้ยา'},
      {k:'hpvc', label:'รายงาน HPVC / ศูนย์เฝ้าระวัง', sub:'สำหรับปฏิกิริยารุนแรงหรือยาใหม่'},
      {k:'follow', label:'นัดติดตามอาการ', sub:'ตรวจแลปซ้ำหรือประเมินผลการหยุดยา'}
    ].map(o => {
      const on = (st.genPick || []).indexOf(o.k) >= 0;
      return {label:o.label, sub:o.sub, mark: on ? '✓' : '',
        toggle: () => {
          const cur = (st.genPick || []).slice(), i = cur.indexOf(o.k);
          if (i >= 0) cur.splice(i, 1); else cur.push(o.k);
          this.setState({genPick: cur});
        },
        bg: on ? C.tealS : '#FBFAF7', bd: on ? C.teal : 'rgba(22,33,31,.12)',
        boxBg: on ? C.teal : '#FFFFFF', boxBd: on ? C.teal : 'rgba(22,33,31,.20)'};
    });
    v.doGenerate = () => this.setState({pharmNote: this.buildSOAP()});
    v.genPreview = this.buildSOAP();
    const pk = st.pageK || 1, fk = st.fitK || 1;
    v.pageTf = 'scale(' + pk + ')';
    v.fitTf = 'scale(' + fk + ')';
    v.fitW = (100 / fk).toFixed(3) + '%';
    v.wrapH = 'calc(297mm * ' + pk + ')';
    v.wrapRef = (el) => {
      if (this._ro && this._wrapEl && this._wrapEl !== el) this._ro.unobserve(this._wrapEl);
      this._wrapEl = el;
      this.observeWrap();
      this.measureSheet();
    };
    v.sheetRef = (el) => { this._sheetEl = el; this.measureSheet(); };
    v.fitRef = (el) => { this._fitEl = el; this.measureSheet(); };
    v.sheetAdvice = this.refAdvice();
    v.hasSheetAdvice = v.sheetAdvice.length > 0;
    const soapBg = {S: '#6B7B77', O: '#2F6DA8', A: '#B3261E', P: '#0F5D57'};
    const noteTxt = (st.pharmNote || '').trim();
    v.sheetSoap = noteTxt
      ? (/^[SOAP]:/m.test(noteTxt)
        ? noteTxt.split('\n').filter(Boolean).map(l => {
            const m = l.match(/^([SOAP]):\s*([\s\S]*)$/);
            return m ? {k: m[1], txt: m[2], bg: soapBg[m[1]]} : {k: '·', txt: l, bg: '#9AA5A2'};
          })
        : [{k: '·', txt: noteTxt, bg: '#9AA5A2'}])
      : [{k: '·', txt: '—', bg: '#9AA5A2'}];
    v.sheetPharmNote = noteTxt || '—';
    v.pharmSign = st.pharmSign; v.doctorSign = st.doctorSign;
    v.setPharmSign = (e) => this.setState({pharmSign: e.target.value});
    v.setDoctorSign = (e) => this.setState({doctorSign: e.target.value});
    v.pharmSignTxt = st.pharmSign || '';
    v.doctorSignTxt = st.doctorSign || '';
    v.hospitalName = this.props.hospitalName || 'โรงพยาบาลกรงปินัง';
    v.deptName = this.props.deptName || 'กลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค';
    v.docNo = 'ADR-' + new Date().getFullYear() + '-' + String(st.cases.length + 1).padStart(3, '0');
    v.doSaveCase = () => this.saveCase();
    v.caseRows = (st.cases || []).map(c => ({
      label: c.label, saved: this.fmtD(c.saved, false),
      load: () => this.setState(Object.assign({adrView: 'edit'}, c.data)),
      del: () => this.saveCases(this.loadCases().filter(x => x.id !== c.id))
    }));
    v.hasCases = (st.cases || []).length > 0;
    v.caseData = st.cases || [];
    v.openCaseList = () => this.setState({caseListOpen: true});
    v.openCase = (c) => this.openCaseData(c);
    v.caseCount = (st.cases || []).length + ' เคส';

    return v;
  }
}
