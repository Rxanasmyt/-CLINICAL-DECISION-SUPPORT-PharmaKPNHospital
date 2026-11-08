import { describe, it, expect } from 'vitest';
import { thaiDate, thaiMonth, quarterLabel, fiscalYearBE, SUMMARIES } from './labels';
import { WL_FIELDS } from '../data/standards';

describe('ป้ายและค่าอ่านง่ายสำหรับ Google Sheets', () => {
  it('วันที่ไทย (พ.ศ.) ไม่ใช้รูปแบบที่ Sheets แปลงเป็นวันที่เอง', () => {
    expect(thaiDate('2026-11-04T10:00')).toBe('4 พ.ย. 2569');
    expect(thaiMonth('2026-03')).toBe('มี.ค. 2569');
    expect(thaiDate('')).toBe('');
    expect(thaiDate('2026-11-04')).not.toMatch(/\//);
  });
  it('ไตรมาสปฏิทินและปีงบประมาณ', () => {
    expect(['2026-01', '2026-03', '2026-04', '2026-12'].map(quarterLabel)).toEqual(['Q1/69', 'Q1/69', 'Q2/69', 'Q4/69']);
    expect(fiscalYearBE('2026-09-30')).toBe('2569');
    expect(fiscalYearBE('2026-10-01')).toBe('2570');
  });
  it('ทุกชุดข้อมูลมีหัวคอลัมน์ภาษาไทย ไม่มีรหัสอังกฤษภายในแอป', () => {
    const samples: Record<string, [any, string]> = {
      adr_cases: [{ saved: '2026-05-01T10:00', sum: { month: '2026-05', njCat: 'doubtful', who: 'unclass', prev: 'pending', outcome: 'death', medErr: '', hpvc: 'notreq', rca: 'na' } }, '1'],
      cqi_projects: [{ title: 't' }, '1'], intensive_monitoring: [{ hn: 'sha256:x' }, '1'], drug_info_log: [{ date: '2026-01-02' }, '1'],
      workload_monthly: [{ month: '2026-01' }, '2026-01'], ptc_meetings: ['2026-01-02', '2026-01-02'], std_assessment: [{ st: 'doing' }, '3-1'],
    };
    for (const [name, [data, id]] of Object.entries(samples)) {
      const keys = Object.keys(SUMMARIES[name](data, id));
      expect(keys.length, name).toBeGreaterThan(1);
      expect(keys.every((k) => /[ก-๙]/.test(k)), name + ': ' + keys.join(',')).toBe(true);
    }
    const adr = SUMMARIES.adr_cases(samples.adr_cases[0], '1');
    expect([adr['ระดับ Naranjo'], adr['ผลประเมิน WHO-UMC'], adr['ป้องกันได้หรือไม่ (Schumock)'], adr['ผลลัพธ์'], adr['Med error (ความคลาดเคลื่อนทางยา)'], adr['รายงาน HPVC'], adr['RCA (วิเคราะห์สาเหตุราก)']])
      .toEqual(['Doubtful (น่าสงสัย)', 'Unclassifiable (จำแนกไม่ได้)', 'ยังประเมินไม่ครบ', 'เสียชีวิต', '—', 'ไม่ต้องส่ง', 'ไม่เกี่ยวข้อง']);
  });
});

describe('ทุกฟิลด์ที่แอปบันทึกมีที่แสดงในชีต (ชุดข้อมูลที่ไม่ใช่เคสแพ้ยา)', () => {
  const vals = (name: string, rec: any, id: string) => Object.values(SUMMARIES[name](rec, id)).map(String);
  it('CQI/R2R · intensive · การให้ข้อมูล · ภาระงาน · มาตรฐาน', () => {
    const cqi = { id: 1, title: 'T1', type: 'R2R', problem: 'P1', measure: 'M1', indicator: 'I1', before: 'B1', after: 'A1', start: '2026-02-01', status: 'S1' };
    expect(Object.keys(cqi).filter((k) => k !== 'id' && !vals('cqi_projects', cqi, '1').includes(k === 'start' ? thaiDate('2026-02-01') : (cqi as any)[k]))).toEqual([]);
    const it = { id: 2, hn: 'sha256:x', drug: 'D1', group: 'G1', start: '2026-02-01', next: '2026-03-01', note: 'N1', status: 'ST' };
    expect(Object.keys(it).filter((k) => k !== 'id' && !vals('intensive_monitoring', it, '2').includes(['start', 'next'].includes(k) ? thaiDate((it as any)[k]) : (it as any)[k]))).toEqual([]);
    const info = { id: 3, date: '2026-02-02', who: 'W1', topic: 'T1', how: 'H1', und: 5, sat: 4 };
    expect(Object.keys(info).filter((k) => k !== 'id' && !vals('drug_info_log', info, '3').includes(k === 'date' ? thaiDate('2026-02-02') : String((info as any)[k])))).toEqual([]);
    const wl: any = { month: '2026-04' }; (WL_FIELDS as any[]).forEach((f, i) => { wl[f.k] = 100 + i; });
    const wv = vals('workload_monthly', wl, '2026-04');
    expect((WL_FIELDS as any[]).filter((f) => !wv.includes(String(wl[f.k])))).toEqual([]);
    const sd = { st: 'doing', note: 'NOTE' };
    expect(vals('std_assessment', sd, '9-3.4')).toEqual(expect.arrayContaining(['NOTE', 'กำลังดำเนินการ']));
  });
  it('เคสแพ้ยา: ฟิลด์สำคัญของฟอร์มมีคอลัมน์ที่อ่านได้ (ที่เหลืออยู่ในข้อมูลเต็มที่ซ่อน)', () => {
    const c: any = { saved: '2026-05-01T10:00', data: { pt: { age: '45', sex: 'ชาย', hx: 'แพ้ penicillin' }, drugs: [{ name: 'A', dose: '1 g', route: 'IV', start: '2026-04-01', stop: '2026-04-05', suspect: true }],
      events: [{ desc: 'ผื่น', onset: '2026-04-03' }], labs: [{ name: 'ALT', value: '120' }], rep: { medErrNo: 'ME1', hpvcDate: '2026-05-03', rcaCat: ['ก'], rcaCause: 'cause', rcaPlan: 'plan', rcaOwner: 'owner' }, sev2: { serious: ['เสียชีวิต'] }, triggers: ['vitk'], altCauses: ['none'] },
      sum: { month: '2026-04', drugs: ['A'], events: ['ผื่น'], nj: 5, njCat: 'probable', who: 'probable', prev: 'prev', severe: true, repeat: false, type: 'Type IV', outcome: 'recovered', adrType: 'B', serious: true, medErr: 'yes', hpvc: 'sent', rca: 'done', triggers: ['vitk'], pharm: 'ภก.' } };
    const v = SUMMARIES.adr_cases(c, '1');
    expect(v['ขนาดยา/วิธีให้ (ยาที่สงสัย)']).toBe('A 1 g IV'); expect(v['ผลแลปที่บันทึก']).toBe('ALT 120'); expect(v['ประวัติแพ้ยาเดิม']).toBe('แพ้ penicillin');
    expect(v['วันที่หยุดยา']).toBe('5 เม.ย. 2569'); expect(v['ระยะเวลาจากเริ่มยาถึงเกิดอาการ']).toBe('2 วันหลังเริ่มยา');
    const empty = SUMMARIES.adr_cases({ saved: '', data: {}, sum: {} }, '2');
    expect(Object.values(empty).some((x) => x === undefined || x === null)).toBe(false);          // เคสว่างไม่ทำให้เซลล์เป็น undefined
  });
});
