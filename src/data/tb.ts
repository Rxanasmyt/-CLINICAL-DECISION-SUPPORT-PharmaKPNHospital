// สร้างอัตโนมัติจาก 64694f64-PharmaCal-KPNHOSPITAL.dc.html ด้วย tools/extract-constants.mjs — ห้ามแก้ด้วยมือ
// คัดลอกแบบคำต่อคำจากต้นแบบ (README: ห้ามเขียนใหม่จากความจำ)
/* eslint-disable */
// @ts-nocheck

export const TB_ADULT = {
  INH:{code:'H',name:'Isoniazid',low:4,high:6,typ:5,max:300,unit:'เม็ด',shape:'tab',fill:'#DCEAE7',forms:[{s:100,half:true}],accent:'#0F5D57'},
  RIF:{code:'R',name:'Rifampicin',low:8,high:12,typ:10,max:600,unit:'แคปซูล',shape:'cap',fill:'#F2C9A8',forms:[{s:450,half:false},{s:300,half:false}],accent:'#B5581F'},
  PZA:{code:'Z',name:'Pyrazinamide',low:20,high:30,typ:25,max:2000,unit:'เม็ด',shape:'tab',fill:'#E4DCF0',forms:[{s:400,half:true}],accent:'#7A5AA8'},
  EMB:{code:'E',name:'Ethambutol',low:15,high:20,typ:15,max:1600,unit:'เม็ด',shape:'tab',fill:'#D8E6F3',forms:[{s:400,half:true},{s:500,half:true}],accent:'#2F6DA8'}
};

export const TB_CHILD = {
  INH:{code:'H',name:'Isoniazid',low:7,high:15,typ:10,max:300,unit:'เม็ด',shape:'tab',fill:'#DCEAE7',forms:[{s:100,half:true}],accent:'#0F5D57'},
  RIF:{code:'R',name:'Rifampicin',low:10,high:20,typ:15,max:600,unit:'แคปซูล',shape:'cap',fill:'#F2C9A8',forms:[{s:300,half:false},{s:450,half:false}],accent:'#B5581F'},
  PZA:{code:'Z',name:'Pyrazinamide',low:30,high:40,typ:35,max:2000,unit:'เม็ด',shape:'tab',fill:'#E4DCF0',forms:[{s:400,half:true}],accent:'#7A5AA8'},
  EMB:{code:'E',name:'Ethambutol',low:15,high:25,typ:20,max:1600,unit:'เม็ด',shape:'tab',fill:'#D8E6F3',forms:[{s:400,half:true},{s:500,half:true}],accent:'#2F6DA8'}
};

export const LTBI_INH_CHILD = [[10, 15, 300, '10 – 15 กก.'], [15.1, 23, 500, '16 – 23 กก.'], [23.1, 30, 600, '24 – 30 กก.'], [30.1, 999, 700, '> 30 กก.']];

export const LTBI_RPT_CHILD = [[10, 15, 300], [15.1, 23, 450], [23.1, 30, 600], [30.1, 999, 750]];

export const FACTORS = [
  {id:'renal',label:'ไตบกพร่อง (CrCl<30 / HD)'},
  {id:'hepatic',label:'ตับบกพร่อง'},
  {id:'hiv',label:'ติดเชื้อ HIV ร่วม'},
  {id:'pregnancy',label:'ตั้งครรภ์ / ให้นมบุตร'},
  {id:'elderly',label:'ผู้สูงอายุ'},
  {id:'dm',label:'เบาหวาน'},
  {id:'malnutrition',label:'น้ำหนักน้อย / ทุพโภชนาการ'},
  {id:'mdr',label:'ดื้อยา (MDR / RR)'}
];

