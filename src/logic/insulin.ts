// คัดลอกตรรกะจากต้นแบบ PharmaCal-KPNHOSPITAL.dc.html แบบคำต่อคำ — เปลี่ยนเฉพาะ this.state/this.props เป็นพารามิเตอร์
/* eslint-disable */
import { C } from '../data/theme';
import { devices } from './shared';

/** คำนวณจำนวน insulin (vial / penfill) ที่ต้องจ่าย — ไม่คิดสำรอง ไม่คิดยาเหลือทิ้ง
 *  1 vial = 10 ml = 1,000 U (70/30, RI, NPH) · penfill 3 ml = 300 U */
export function computeInsulin(unitsText: string, daysText: string): Record<string, any> {
  const o: Record<string, any> = {};
  const iu = parseFloat(unitsText), idays = parseInt(daysText, 10);

const insOk = isFinite(iu) && iu > 0 && iu <= 300 && isFinite(idays) && idays > 0 && idays <= 400;
o.insHas = insOk; o.insEmpty = !insOk;
o.insRows = []; o.insAlerts = [];
if (insOk) {
  const totalIU = iu * idays;
  o.insTotal = totalIU.toLocaleString('en-US') + ' ยูนิต';
  o.insTotalSub = iu + ' ยูนิต/วัน × ' + idays + ' วัน';
  [{name:'Vial 10 ml', size:'100 IU/ml · 1,000 IU — 70/30, RI, NPH ขนาดเดียวกัน', capacity:1000, accent:'#0F5D57', fill:'#DCEAE7', shape:'vial'},
   {name:'Penfill 3 ml', size:'100 IU/ml · 300 IU — 70/30', capacity:300, accent:'#B5581F', fill:'#F2C9A8', shape:'pen'}]
  .forEach(p => {
    const daysPer = p.capacity / iu;
    const limited = daysPer > 28;
    const n = Math.ceil(totalIU / p.capacity);
    o.insRows.push({
      name: p.name, size: p.size, accent: p.accent,
      count: n + ' ชิ้น',
      countSub: 'ตามที่ใช้จริง',
      coverTxt: 'ใช้ได้ ' + (Math.floor(daysPer * 10) / 10) + ' วัน/ชิ้น',
      devices: devices(Math.min(n, 10), p.shape, p.fill, p.accent),
      isVial: p.shape === 'vial', isPen: p.shape === 'pen',
      xTxt: n > 10 ? '× ' + n : '',
      warnTxt: limited
        ? 'จ่ายตามปริมาณเพื่อประหยัดงบประมาณ · 1 ชิ้นใช้เกิน 28 วัน ให้แจ้งผู้ป่วยเรื่องอายุหลังเปิดใช้และเก็บในตู้เย็นระหว่างใช้'
        : 'ใช้หมดภายใน 28 วันหลังเปิดใช้',
      warnFg: limited ? C.warn : C.ok,
      warnBg: limited ? C.warnS : C.okS
    });
  });
  const A = (kind, title, text) => {
    const m = {w:[C.warnS,'rgba(166,106,0,.22)',C.warn,'#6B4A0F'], i:[C.tealS,'rgba(15,93,87,.18)',C.teal,'#2C4B47']}[kind];
    o.insAlerts.push({title, text, bg:m[0], bd:m[1], fg:m[2], body:m[3]});
  };
  A('i', 'การเก็บรักษา', 'ที่ยังไม่เปิดใช้เก็บในตู้เย็น 2–8 °C ห้ามแช่แข็ง · เปิดใช้แล้วเก็บที่อุณหภูมิห้องไม่เกิน 30 °C ได้ 28 วัน (vial เก็บในตู้เย็นต่อได้ 28 วัน) พ้นกำหนดให้ทิ้งแม้ยาจะเหลือ');
  A('i', 'อุปกรณ์ที่ต้องจ่ายร่วม', 'Vial ต้องจ่าย insulin syringe ตามจำนวนครั้งที่ฉีด · Penfill ต้องมีปากกาฉีดยาและเข็มปากกา (pen needle) 1 เข็มต่อการฉีด 1 ครั้ง · แนะนำเข็มสำรองเพิ่ม 10%');
  if (iu > 0) A('w', 'ตรวจสอบก่อนจ่าย', 'ทวนขนาดที่ใช้จริงกับผู้ป่วยหรือสมุดบันทึกน้ำตาล เพราะขนาด insulin มักถูกปรับระหว่างนัด · ยืนยันว่าเป็นชนิด 70/30 (premixed) ตรงกับที่แพทย์สั่ง และผู้ป่วยฉีดก่อนอาหาร 30 นาที');
} else { o.insTotal = '—'; o.insTotalSub = 'กรอกจำนวนยูนิตต่อวันและจำนวนวันที่นัด'; }
  return o;
}
