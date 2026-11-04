import { describe, it, expect } from 'vitest';
import { thaiDate, thaiMonth, quarterLabel, fiscalYearBE, SUMMARIES } from './labels';

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
