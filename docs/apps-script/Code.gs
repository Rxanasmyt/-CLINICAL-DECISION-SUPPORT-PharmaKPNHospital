/**
 * PharmaKPNHospital — Google Apps Script Web App (เวอร์ชัน 2: ชีตอ่านง่าย)
 * ใช้บัญชี Google ของกลุ่มงาน และแชร์ Sheets เฉพาะเภสัชกรที่เกี่ยวข้อง
 *
 * ติดตั้ง:
 *  1) สร้าง Google Sheets ใหม่ → ส่วนขยาย → Apps Script → วางไฟล์นี้ทั้งไฟล์ (ทับของเดิม)
 *  2) Project Settings → Script properties → เพิ่ม TOKEN = (ข้อความลับที่ตั้งเอง ยาว ≥ 24 ตัวอักษร)
 *  3) เลือกฟังก์ชัน setup แล้วกด Run หนึ่งครั้ง (อนุญาตสิทธิ์) — จะสร้างแท็บ "อ่านก่อน" "ภาพรวม" และแท็บข้อมูลทั้งหมด
 *  4) Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone
 *     (แก้โค้ดภายหลังต้อง Deploy → Manage deployments → แก้เป็นเวอร์ชันใหม่ ไม่เช่นนั้นยังใช้โค้ดเดิม)
 *  5) คัดลอก URL (ลงท้าย /exec) ใส่ในแอป: ปุ่มสถานะซิงก์ → URL / token / salt
 *  6) ถ้าเคยซิงก์ด้วยโค้ดเวอร์ชันเก่า: แอปกด "ส่งข้อมูลทั้งหมดใหม่" หนึ่งครั้ง แล้วลบแท็บเก่าที่ขึ้นต้นด้วย "เก่า-"
 *
 * PDPA: แอปส่งเฉพาะรหัสเคส และ HN ที่ผ่าน hash (SHA-256 + salt) — ไม่ส่งชื่อผู้ป่วย
 * แต่ละแท็บ = หนึ่งชุดข้อมูล แถวละหนึ่งรายการ คอลัมน์ที่อ่านได้อยู่ซ้าย · คอลัมน์เทคนิค (ซ่อน) อยู่ขวาสุด
 */
var H = { id: 'รหัสรายการ', at: 'แก้ไขล่าสุด', del: 'ลบแล้ว?', ms: '_เวลา(ms) ห้ามแก้', pay: '_ข้อมูลเต็ม(JSON) ห้ามแก้' };
var TZ = 'Asia/Bangkok';
var MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// ชุดข้อมูล → ชื่อแท็บ + คำอธิบายสำหรับแท็บ "อ่านก่อน"
var TABS = {
  adr_cases: { tab: 'เคสแพ้ยา (ADR)', from: 'หน้า "ประเมินแพ้ยา" → ปุ่ม "บันทึกเคส"', what: 'ผลประเมินอาการไม่พึงประสงค์จากยาแต่ละเคส: ยาที่สงสัย อาการ คะแนน Naranjo ผล WHO-UMC ป้องกันได้หรือไม่ ความรุนแรง การส่ง HPVC และ RCA (ไม่มีชื่อผู้ป่วย)', row: 'ใช้ตอบข้อ 9: 9-2.4, 9-3.1, 9-3.3, 9-3.4, 9-3.5' },
  cqi_projects: { tab: 'โครงการ CQI และ R2R', from: 'ทะเบียน ADR และตัวชี้วัด → โครงการ CQI/R2R', what: 'โครงการพัฒนาคุณภาพ วิจัย นวัตกรรม พร้อมตัวชี้วัดและผลก่อน-หลังดำเนินการ', row: 'ใช้ตอบข้อ 3: 3-3.2, 3-4.2, 3-4.3 · ข้อ 9: 9-5.4' },
  intensive_monitoring: { tab: 'ติดตามเข้มข้น (Intensive)', from: 'ทะเบียน ADR และตัวชี้วัด → Intensive monitoring', what: 'ผู้ป่วยที่เฝ้าติดตามอาการไม่พึงประสงค์อย่างเป็นระบบ (เช่น warfarin, ยาที่เสี่ยง SJS/TEN) HN เป็นค่าเข้ารหัส', row: 'ใช้ตอบข้อ 9: 9-3.2' },
  drug_info_log: { tab: 'การให้ข้อมูลด้านยา', from: 'ทะเบียน ADR และตัวชี้วัด → การให้ข้อมูลด้านยา', what: 'บันทึกครั้งที่เภสัชกรให้ข้อมูลยาแก่บุคลากรหรือผู้ป่วย พร้อมคะแนนความเข้าใจและความพึงพอใจ', row: 'ใช้ตอบข้อ 3: 3-2.3, 3-3.4, 3-4.4' },
  workload_monthly: { tab: 'ภาระงานรายเดือน', from: 'ทะเบียน ADR และตัวชี้วัด → ภาระงาน / Med error / คลังยา', what: 'ตัวเลขภาระงาน ความคลาดเคลื่อนทางยา และมูลค่าคลังยา สรุปรายเดือน', row: 'ใช้ตอบข้อ 3: 3-1, 3-2.1' },
  ptc_meetings: { tab: 'วันประชุม PTC', from: 'ทะเบียน ADR และตัวชี้วัด → รายงานไตรมาส PTC', what: 'วันที่นำเสนอผลงานต่อคณะกรรมการ PTC', row: 'ใช้ตอบข้อ 9: 9-3.6 (เป้าหมาย 3–4 ครั้ง/ปี)' },
  std_assessment: { tab: 'ประเมินมาตรฐาน ข้อ 3 และ 9', from: 'หน้า "มาตรฐาน"', what: 'สถานะการประเมินตนเองรายข้อย่อยของมาตรฐานความปลอดภัยด้านยา พ.ศ. 2570 ข้อ 3 และข้อ 9', row: 'หลักฐานรายงานต่อผู้ประเมิน' }
};
var GUIDE = 'อ่านก่อน', OVERVIEW = 'ภาพรวม';

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function authed_(token) {
  var t = PropertiesService.getScriptProperties().getProperty('TOKEN');
  return !!t && typeof token === 'string' && token.length === t.length && token === t;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var req = JSON.parse(e.postData.contents);
    if (!authed_(req.token)) return json_({ ok: false, error: 'token ไม่ถูกต้อง' });
    lock.waitLock(20000);
    return json_(handle_(req));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// GET ไว้ทดสอบเท่านั้น (token อยู่ใน query — แอปใช้ POST)
function doGet(e) {
  try {
    var p = e.parameter || {};
    if (!authed_(p.token)) return json_({ ok: false, error: 'token ไม่ถูกต้อง' });
    return json_(handle_({ action: p.action || 'ping', collection: p.collection, since: Number(p.since || 0), id: p.id }));
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

function handle_(req) {
  if (req.action === 'ping') return { ok: true, time: Date.now() };
  if (!TABS[req.collection]) return { ok: false, error: 'ไม่รู้จักชุดข้อมูล' };
  var sh = sheet_(req.collection);
  if (req.action === 'push') { var r = push_(sh, req.records || []); try { refreshOverview_(); } catch (e) {} return r; }
  if (req.action === 'pull') return pull_(sh, Number(req.since || 0));
  if (req.action === 'get') { var x = pull_(sh, 0).records.filter(function (y) { return String(y.id) === String(req.id); })[0]; return { ok: true, record: x || null }; }
  return { ok: false, error: 'ไม่รู้จักคำสั่ง' };
}

// ---------- โครงสร้างแท็บ ----------
function sheet_(collection) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = TABS[collection].tab;
  var sh = ss.getSheetByName(name);
  if (sh) return sh;
  // แท็บรูปแบบเก่า (ชื่อรหัสอังกฤษ) → เปลี่ยนชื่อเป็น "เก่า-…" เก็บไว้ให้ตรวจ แล้วสร้างแท็บใหม่
  var legacy = ss.getSheetByName(collection);
  if (legacy) { try { legacy.setName('เก่า-' + collection); } catch (e) {} }
  sh = ss.insertSheet(name);
  sh.appendRow([H.id, H.at, H.del, H.ms, H.pay]);
  style_(sh);
  return sh;
}

function headers_(sh) { return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String); }

// รูปแบบ "4 พ.ย. 2569 10:15"
function thaiStamp_(ms) {
  var d = new Date(Number(ms));
  return Number(Utilities.formatDate(d, TZ, 'd')) + ' ' + MON[Number(Utilities.formatDate(d, TZ, 'M')) - 1] + ' ' + (Number(Utilities.formatDate(d, TZ, 'yyyy')) + 543) + ' ' + Utilities.formatDate(d, TZ, 'HH:mm');
}

// กันสูตร/วันที่แฝง: ข้อความที่ขึ้นต้นด้วย = + - @ หรือมีแต่ตัวเลขและเครื่องหมาย ให้เป็นข้อความล้วน (ใส่ ' นำหน้า)
// ข้อมูลจริงอยู่ในคอลัมน์ _ข้อมูลเต็ม(JSON) ไม่ถูกแก้
function cell_(v) {
  if (typeof v !== 'string' || v === '') return v;
  // ตัวเลขล้วน (เช่น 12) ปล่อยให้เป็นตัวเลขได้ · ที่มีเครื่องหมายคั่น (1/2, 3-4, 9-3.4) หรือขึ้นต้นด้วย 0 (007) ให้เป็นข้อความ
  if (/^[=+\-@\t\r]/.test(v) || /^[\d\s.,:\/\-+]*[.,:\/\-+][\d\s.,:\/\-+]*$/.test(v) || /^0\d+$/.test(v)) return "'" + v;
  return v;
}

function push_(sh, records) {
  var head = headers_(sh);
  // คอลัมน์สรุปใหม่ → แทรกก่อนคอลัมน์ "ลบแล้ว?"
  var added = false;
  records.forEach(function (r) {
    Object.keys(r.summary || {}).forEach(function (k) {
      if (head.indexOf(k) < 0) {
        var di = head.indexOf(H.del);
        sh.insertColumnBefore(di + 1);
        sh.getRange(1, di + 1).setValue(k);
        head.splice(di, 0, k); added = true;
      }
    });
  });
  if (added) style_(sh);
  var iId = head.indexOf(H.id), iMs = head.indexOf(H.ms);
  var last = sh.getLastRow();
  var ids = last > 1 ? sh.getRange(2, iId + 1, last - 1, 1).getValues().map(function (x) { return String(x[0]); }) : [];
  var tsCol = last > 1 ? sh.getRange(2, iMs + 1, last - 1, 1).getValues().map(function (x) { return Number(x[0]); }) : [];
  var saved = 0, newRows = [];
  records.forEach(function (r) {
    var payload = r.deleted ? '' : JSON.stringify(r.data);
    if (payload.length > 49000) return;                  // เกินขีดจำกัดเซลล์ของ Google Sheets (แอปตรวจก่อนส่งอยู่แล้ว)
    var row = head.map(function (h) {
      if (h === H.id) return String(r.id);
      if (h === H.at) return thaiStamp_(r.updatedAt);
      if (h === H.del) return r.deleted ? 'ใช่' : '';
      if (h === H.ms) return Number(r.updatedAt);
      if (h === H.pay) return payload;
      var v = (r.summary || {})[h]; return v === undefined ? '' : cell_(v);
    });
    var i = ids.indexOf(String(r.id));
    if (i >= 0) {
      if (Number(r.updatedAt) < tsCol[i]) return;        // ของในชีตใหม่กว่า — ล่าสุดชนะ
      sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
    } else { newRows.push(row); ids.push(String(r.id)); tsCol.push(Number(r.updatedAt)); }
    saved++;
  });
  // เพิ่มแถวใหม่ทีเดียว (เร็วกว่า appendRow ทีละแถวมากเมื่อส่งข้อมูลทั้งหมดใหม่)
  if (newRows.length) sh.getRange(sh.getLastRow() + 1, 1, newRows.length, head.length).setValues(newRows);
  // เรียงใหม่สุดไว้บน (ตามเวลาแก้ไขล่าสุด) — คอลัมน์วันที่เป็นข้อความภาษาไทย จึงเรียงเองในตัวกรองไม่ได้
  // รายการที่ลบแล้วไว้ล่างสุด
  try { var n = sh.getLastRow(); if (n > 2) sh.getRange(2, 1, n - 1, head.length).sort([{ column: head.indexOf(H.del) + 1, ascending: true }, { column: iMs + 1, ascending: false }]); } catch (e) {}
  return { ok: true, saved: saved };
}

function pull_(sh, since) {
  var last = sh.getLastRow();
  if (last < 2) return { ok: true, records: [] };
  var head = headers_(sh), n = head.length;
  var vals = sh.getRange(2, 1, last - 1, n).getValues();
  var ci = head.indexOf(H.id), cu = head.indexOf(H.ms), cd = head.indexOf(H.del), cp = head.indexOf(H.pay);
  var out = [];
  vals.forEach(function (v) {
    var t = Number(v[cu]);
    if (!isFinite(t) || t < since) return;
    var del = String(v[cd]) === 'ใช่';
    var data = null;
    if (!del && v[cp]) { try { data = JSON.parse(v[cp]); } catch (e) { data = null; } }
    out.push({ id: String(v[ci]), updatedAt: t, deleted: del, data: data });
  });
  return { ok: true, records: out };
}

// ---------- หน้าตา ----------
// ความกว้างคอลัมน์ตามชนิดเนื้อหา และสีสถานะ (ข้อความตรงกับค่าที่แอปส่งมา)
var WIDE = ['อาการที่พบ', 'สาเหตุที่ราก (RCA)', 'แผนป้องกัน', 'เกณฑ์', 'ปัญหาที่พบ', 'การวัดผล', 'ผลก่อนดำเนินการ', 'ผลหลังดำเนินการ', 'หัวข้อ', 'หมายเหตุ',
  'Trigger ที่พบ', 'เกณฑ์ Serious ที่เข้า', 'สาเหตุอื่นที่เป็นไปได้', 'ผลแลปที่บันทึก', 'ขนาดยา/วิธีให้ (ยาที่สงสัย)', 'ประวัติแพ้ยาเดิม', 'ชื่อโครงการ', 'หมวดสาเหตุ RCA', 'ยาที่สงสัย', 'กลุ่มยา', 'ชนิดปฏิกิริยา'];
var NARROW = ['ไตรมาส', 'คะแนน Naranjo', 'เคสรุนแรง', 'แพ้ยาซ้ำ', 'Serious ADR (ร้ายแรง)', 'ประเภท ADR', 'อายุ (ปี)', 'เพศ', 'มาตรฐานข้อ', 'ระดับ', 'ข้อย่อย',
  'ปีงบประมาณ (พ.ศ.)', 'จำนวน Trigger ที่พบ', 'ความเข้าใจ (เต็ม 5)', 'ความพึงพอใจ (เต็ม 5)', 'ลบแล้ว?'];
var AMBER = ['#FBF1DE', '#7A5200'], GREEN = ['#EAF4EE', '#1E6B47'], RED = ['#FBEAE8', '#7A2A24'];
var STATUS = [
  ['รายงาน HPVC', 'รอส่ง', AMBER], ['รายงาน HPVC', 'ส่งแล้ว', GREEN],
  ['เคสรุนแรง', 'ใช่', RED], ['แพ้ยาซ้ำ', 'ใช่', RED], ['Serious ADR (ร้ายแรง)', 'ใช่', RED],
  ['ป้องกันได้หรือไม่ (Schumock)', 'ป้องกันได้', AMBER],
  ['RCA (วิเคราะห์สาเหตุราก)', 'ยังไม่ครบ', AMBER], ['RCA (วิเคราะห์สาเหตุราก)', 'ทำครบ', GREEN],
  ['Med error (ความคลาดเคลื่อนทางยา)', 'ยังไม่รายงาน', AMBER], ['Med error (ความคลาดเคลื่อนทางยา)', 'รายงานแล้ว', GREEN],
  ['สถานะ', 'พบ ADR', RED], ['สถานะ', 'ติดตามอยู่', AMBER], ['สถานะ', 'กำลังดำเนินการ', AMBER], ['สถานะ', 'ดำเนินการแล้ว', GREEN], ['สถานะ', 'เสร็จสิ้น', GREEN]
];
// คำอธิบายหัวคอลัมน์ (เลื่อนเมาส์ไปที่หัวคอลัมน์หรือกดดูโน้ต)
var HELP = {
  'ไตรมาส': 'ไตรมาสปฏิทินของเดือนที่เกิดอาการ เช่น Q2/69 = เม.ย.–มิ.ย. 2569',
  'คะแนน Naranjo': 'คะแนนรวมของ Naranjo ADR probability scale (-4 ถึง 13)',
  'ระดับ Naranjo': '9 ขึ้นไป = Definite · 5–8 = Probable · 1–4 = Possible · 0 หรือต่ำกว่า = Doubtful',
  'ผลประเมิน WHO-UMC': 'การจำแนกความสัมพันธ์ระหว่างยากับอาการตามเกณฑ์ WHO-UMC',
  'ป้องกันได้หรือไม่ (Schumock)': 'ตามเกณฑ์ Schumock & Thornton: ตอบ "ใช่" ข้อใดข้อหนึ่ง = ป้องกันได้ (ต้องทำ RCA)',
  'เคสรุนแรง': 'มีอาการระดับ severe หรือเข้าเกณฑ์ SJS/TEN, DRESS, anaphylaxis',
  'แพ้ยาซ้ำ': 'ผู้ป่วยแพ้ยาเดิมซ้ำ (เป้าหมาย = 0)',
  'ประเภท ADR': 'Type A = เกี่ยวกับฤทธิ์ยา · Type B = ภูมิคุ้มกัน/idiosyncratic (ต้องรายงาน HPVC)',
  'Serious ADR (ร้ายแรง)': 'เข้าเกณฑ์ serious ข้อใดข้อหนึ่ง เช่น เสียชีวิต อันตรายถึงชีวิต ต้องนอนโรงพยาบาล',
  'รายงาน HPVC': 'สถานะการรายงานศูนย์ HPVC · รอส่ง = เป็น type B หรือ serious แต่ยังไม่ส่ง',
  'RCA (วิเคราะห์สาเหตุราก)': 'ใช้กับเคสที่ป้องกันได้: ทำครบ = ระบุสาเหตุที่รากและแผนป้องกันแล้ว',
  'Med error (ความคลาดเคลื่อนทางยา)': 'สถานะการรายงานความคลาดเคลื่อนทางยาที่เกี่ยวข้อง',
  'ระยะเวลาจากเริ่มยาถึงเกิดอาการ': 'คำนวณจากวันเริ่มยาที่สงสัยถึงวันเริ่มมีอาการ (ใช้ประเมินความสัมพันธ์ด้านเวลา)',
  'HN (เข้ารหัส)': 'HN ผ่าน SHA-256 + salt ของ รพ. ไม่ใช่ HN จริง',
  'ปีงบประมาณ (พ.ศ.)': 'ปีงบประมาณเริ่ม 1 ต.ค.',
  'ความเข้าใจ (เต็ม 5)': 'คะแนนความเข้าใจของผู้รับข้อมูล', 'ความพึงพอใจ (เต็ม 5)': 'คะแนนความพึงพอใจของผู้รับข้อมูล',
  'ลบแล้ว?': 'ใช่ = รายการนี้ถูกลบในแอปแล้ว (เก็บแถวไว้ให้เครื่องอื่นซิงก์การลบ) ห้ามลบแถวเอง'
};

function style_(sh) {
  try {
    var head = headers_(sh), n = head.length;
    var iId = head.indexOf(H.id), iDel = head.indexOf(H.del), iMs = head.indexOf(H.ms), iPay = head.indexOf(H.pay);
    var rows = Math.max(2, sh.getMaxRows());
    var hr = sh.getRange(1, 1, 1, n);
    hr.setBackground('#0F5D57').setFontColor('#FFFFFF').setFontWeight('bold').setWrap(true).setVerticalAlignment('middle').setHorizontalAlignment('center');
    sh.setRowHeight(1, 52);
    sh.setFrozenRows(1); sh.setFrozenColumns(2);
    sh.getRange(1, iId + 1, rows, 1).setNumberFormat('@');                       // รหัสเป็นข้อความ (กันถูกแปลงเป็นตัวเลข/วันที่)
    for (var c = 1; c <= n; c++) {
      var h = head[c - 1];
      if (c - 1 === iMs || c - 1 === iPay) continue;
      sh.setColumnWidth(c, c - 1 === iId ? 120 : (h === H.at ? 150 : (h === 'เกณฑ์' ? 440 : (WIDE.indexOf(h) >= 0 ? 300 : (NARROW.indexOf(h) >= 0 ? 95 : 150)))));
      if (HELP[h]) sh.getRange(1, c).setNote(HELP[h]);
    }
    sh.hideColumns(iMs + 1, 2);                                                  // ซ่อน _เวลา และ _ข้อมูลเต็ม
    var body = sh.getRange(2, 1, rows - 1, n);
    body.setWrap(true).setVerticalAlignment('top').setFontSize(10);
    // ตัวเลขตรงกลาง คอลัมน์สั้นตรงกลาง
    head.forEach(function (h, i) { if (NARROW.indexOf(h) >= 0) sh.getRange(2, i + 1, rows - 1, 1).setHorizontalAlignment('center'); });
    // สีสถานะ + รายการที่ลบแล้ว (เทาขีดฆ่า — วางไว้ก่อนเพื่อให้มีลำดับความสำคัญสูงสุด)
    var rules = [SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$' + letter_(iDel) + '2="ใช่"').setFontColor('#9AA5A2').setBackground('#F4F4F2').setStrikethrough(true).setRanges([body]).build()];
    STATUS.forEach(function (st) {
      var i = head.indexOf(st[0]); if (i < 0) return;
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(st[1]).setBackground(st[2][0]).setFontColor(st[2][1]).setBold(true).setRanges([sh.getRange(2, i + 1, rows - 1, 1)]).build());
    });
    sh.setConditionalFormatRules(rules);
    if (!sh.getFilter()) sh.getRange(1, 1, rows, iDel + 1).createFilter();
    if (sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).length === 0) sh.protect().setWarningOnly(true).setDescription('ข้อมูลมาจากแอป — แก้ในแอปเท่านั้น');
  } catch (e) { /* การจัดรูปแบบล้มเหลวไม่กระทบข้อมูล */ }
}

// ลำดับคอลัมน์ (เริ่มที่ 0) → ตัวอักษร A, B, … Z, AA, …
function letter_(i0) {
  var s = '', n = i0 + 1;
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
function colLetter_(sh, header) {
  var i = headers_(sh).indexOf(header);
  return i < 0 ? null : letter_(i);
}

// ---------- แท็บ "อ่านก่อน" และ "ภาพรวม" ----------
function guide_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(GUIDE) || ss.insertSheet(GUIDE, 0);
  sh.clear();
  var rows = [
    ['PharmaKPNHospital — ข้อมูลที่บันทึกจากแอป'],
    ['กลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค โรงพยาบาลกรงปินัง'],
    [''],
    ['วิธีอ่านชีตนี้'],
    ['• ข้อมูลทุกแถวมาจากแอป PharmaKPNHospital แอปส่งขึ้นมาอัตโนมัติเมื่อกดบันทึก และให้ "แก้ไขในแอปเท่านั้น" (แก้ในชีตจะไม่ย้อนกลับเข้าแอป และจะถูกเขียนทับเมื่อมีการบันทึกครั้งต่อไป)'],
    ['• 1 แถว = 1 รายการ · คอลัมน์ "ลบแล้ว?" = ใช่ หมายถึงรายการถูกลบในแอปแล้ว (เก็บแถวไว้เพื่อให้เครื่องอื่นซิงก์การลบ) ห้ามลบแถวเอง'],
    ['• คอลัมน์ที่ซ่อนอยู่ขวาสุด (_เวลา, _ข้อมูลเต็ม) เป็นข้อมูลเทคนิคที่แอปใช้ ห้ามแก้หรือลบ'],
    ['• ความเป็นส่วนตัว: ไม่มีชื่อผู้ป่วยในชีตนี้ · HN แสดงเป็นรหัสเข้ารหัส (sha256:…) · ข้อความอิสระ (หมายเหตุ ประวัติแพ้ยา) แสดงตามที่เภสัชกรพิมพ์ จึงห้ามพิมพ์ชื่อผู้ป่วยลงในแอป'],
    [''],
    ['แท็บ', 'มาจากหน้าไหนของแอป', 'เก็บอะไร', 'ใช้เป็นหลักฐานมาตรฐานข้อ']
  ];
  Object.keys(TABS).forEach(function (k) { var t = TABS[k]; rows.push([t.tab, t.from, t.what, t.row]); });
  rows.push(['']); rows.push(['แท็บ "ภาพรวม" สรุปตัวเลขสำคัญและแนวโน้มรายไตรมาสอัตโนมัติจากข้อมูลในแท็บต่าง ๆ']);
  sh.getRange(1, 1, rows.length, 4).setValues(rows.map(function (r) { while (r.length < 4) r.push(''); return r; }));
  try {
    sh.getRange(1, 1).setFontSize(16).setFontWeight('bold').setFontColor('#0E3F3B');
    sh.getRange(4, 1).setFontWeight('bold');
    sh.getRange(9, 1, 1, 4).setBackground('#0F5D57').setFontColor('#FFFFFF').setFontWeight('bold');
    sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 300); sh.setColumnWidth(3, 480); sh.setColumnWidth(4, 260);
    sh.getRange(1, 1, rows.length, 4).setWrap(true).setVerticalAlignment('top');
    sh.setHiddenGridlines(true);
  } catch (e) {}
}

function qLabels_(n) {
  var out = [], d = new Date();
  for (var i = n - 1; i >= 0; i--) {
    var t = new Date(d.getFullYear(), d.getMonth() - i * 3, 1);
    var l = 'Q' + (Math.floor(t.getMonth() / 3) + 1) + '/' + String(t.getFullYear() + 543).slice(2);
    if (out.indexOf(l) < 0) out.push(l);
  }
  return out;
}

function refreshOverview_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(OVERVIEW) || ss.insertSheet(OVERVIEW, 1);
  var adr = ss.getSheetByName(TABS.adr_cases.tab), cqi = ss.getSheetByName(TABS.cqi_projects.tab), itn = ss.getSheetByName(TABS.intensive_monitoring.tab),
      inf = ss.getSheetByName(TABS.drug_info_log.tab), ptc = ss.getSheetByName(TABS.ptc_meetings.tab);
  // ช่วงคอลัมน์ของแท็บ (ตามหัวคอลัมน์) — ถ้ายังไม่มีแท็บ/คอลัมน์ ค่าเป็น 0
  var R = function (s, h) { if (!s) return null; var L = colLetter_(s, h); return L ? "'" + s.getName() + "'!$" + L + '$2:$' + L : null; };
  var cnt = function (s, conds) {
    var d = R(s, H.del), id = R(s, H.id); if (!d || !id) return '=0';
    var parts = [id, '"<>"', d, '"<>ใช่"'];
    for (var i = 0; i < conds.length; i++) { var r = R(s, conds[i][0]); if (!r) return '=0'; parts.push(r, '"' + conds[i][1] + '"'); }
    return '=COUNTIFS(' + parts.join(',') + ')';
  };
  var fyBE = (function () { var n = new Date(); return n.getFullYear() + 543 + (n.getMonth() >= 9 ? 1 : 0); })();
  var metrics = [
    ['เคส ADR ทั้งหมดในทะเบียน', cnt(adr, []), 'จำนวนเคสที่กด "บันทึกเคส" (ไม่รวมที่ลบ)'],
    ['เคสรุนแรง', cnt(adr, [['เคสรุนแรง', 'ใช่']]), 'มีอาการระดับ severe หรือเข้าเกณฑ์ SJS/TEN, DRESS, anaphylaxis'],
    ['แพ้ยาซ้ำ (เป้าหมาย = 0)', cnt(adr, [['แพ้ยาซ้ำ', 'ใช่']]), 'ผู้ป่วยแพ้ยาเดิมซ้ำ — ควรเป็น 0'],
    ['ป้องกันได้ (Schumock & Thornton)', cnt(adr, [['ป้องกันได้หรือไม่ (Schumock)', 'ป้องกันได้']]), 'เหตุการณ์ที่ป้องกันได้ — ต้องทำ RCA'],
    ['รอส่งรายงาน HPVC', cnt(adr, [['รายงาน HPVC', 'รอส่ง']]), 'งานค้างที่ต้องติดตาม'],
    ['RCA ยังไม่ครบ', cnt(adr, [['RCA (วิเคราะห์สาเหตุราก)', 'ยังไม่ครบ']]), 'เคสที่ป้องกันได้แต่ยังไม่ได้ระบุสาเหตุ/แผนป้องกัน'],
    ['โครงการ CQI / R2R', cnt(cqi, []), 'จำนวนโครงการพัฒนาคุณภาพและวิจัย'],
    ['Intensive monitoring ที่ยังติดตามอยู่', cnt(itn, [['สถานะ', 'ติดตามอยู่']]), 'ผู้ป่วยที่ยังอยู่ในการเฝ้าติดตาม'],
    ['ครั้งที่ให้ข้อมูลด้านยา', cnt(inf, []), 'จำนวนครั้งที่บันทึกการให้ข้อมูล'],
    ['การนำเสนอ PTC ปีงบประมาณ ' + fyBE, cnt(ptc, [['ปีงบประมาณ (พ.ศ.)', String(fyBE)]]), 'เป้าหมาย 3–4 ครั้ง/ปี (มาตรฐานข้อ 9: 9-3.6)']
  ];
  sh.clear();
  var qs = qLabels_(8);
  var qrows = qs.map(function (q) {
    return [q, cnt(adr, [['ไตรมาส', q]]), cnt(adr, [['ไตรมาส', q], ['ป้องกันได้หรือไม่ (Schumock)', 'ป้องกันได้']]),
      cnt(adr, [['ไตรมาส', q], ['เคสรุนแรง', 'ใช่']]), cnt(adr, [['ไตรมาส', q], ['แพ้ยาซ้ำ', 'ใช่']]), cnt(adr, [['ไตรมาส', q], ['รายงาน HPVC', 'ส่งแล้ว']])];
  });
  sh.getRange(1, 1).setValue('ภาพรวมการเฝ้าระวังอาการไม่พึงประสงค์จากยา');
  sh.getRange(2, 1).setValue('คำนวณอัตโนมัติจากแท็บข้อมูล · ปรับปรุงล่าสุด ' + thaiStamp_(Date.now()));
  sh.getRange(4, 1, 1, 3).setValues([['ตัวชี้วัด', 'ค่า', 'ความหมาย']]);
  sh.getRange(5, 1, metrics.length, 3).setValues(metrics.map(function (m) { return [m[0], '', m[2]]; }));
  metrics.forEach(function (m, i) { sh.getRange(5 + i, 2).setFormula(m[1]); });
  var qr = 5 + metrics.length + 2;
  sh.getRange(qr - 1, 1).setValue('แนวโน้มรายไตรมาส (ไตรมาสปฏิทิน)');
  sh.getRange(qr, 1, 1, 6).setValues([['ไตรมาส', 'เคสทั้งหมด', 'ป้องกันได้', 'เคสรุนแรง', 'แพ้ยาซ้ำ', 'ส่ง HPVC แล้ว']]);
  qrows.forEach(function (r, i) { sh.getRange(qr + 1 + i, 1).setValue(r[0]); for (var c = 1; c < 6; c++) sh.getRange(qr + 1 + i, c + 1).setFormula(r[c]); });
  try {
    sh.getRange(1, 1).setFontSize(16).setFontWeight('bold').setFontColor('#0E3F3B');
    sh.getRange(2, 1).setFontColor('#6B7B77');
    [sh.getRange(4, 1, 1, 3), sh.getRange(qr, 1, 1, 6)].forEach(function (r) { r.setBackground('#0F5D57').setFontColor('#FFFFFF').setFontWeight('bold'); });
    sh.getRange(qr - 1, 1).setFontWeight('bold');
    sh.getRange(5, 2, metrics.length, 1).setFontWeight('bold').setHorizontalAlignment('center').setFontSize(13);
    sh.getRange(qr + 1, 2, qrows.length, 5).setHorizontalAlignment('center');
    sh.setColumnWidth(1, 280); sh.setColumnWidth(2, 110); sh.setColumnWidth(3, 380);
    for (var c = 4; c <= 6; c++) sh.setColumnWidth(c, 110);
    sh.setHiddenGridlines(true);
    sh.getCharts().forEach(function (ch) { sh.removeChart(ch); });
    var chart = sh.newChart().setChartType(Charts.ChartType.COLUMN).addRange(sh.getRange(qr, 1, qrows.length + 1, 2))
      .setPosition(qr + qrows.length + 3, 1, 0, 0).setOption('title', 'จำนวนเคส ADR รายไตรมาส').setOption('legend', { position: 'none' }).setOption('colors', ['#0F5D57']).build();
    sh.insertChart(chart);
  } catch (e) {}
}

// รันฟังก์ชันนี้หนึ่งครั้งจากตัวแก้ไข Apps Script เพื่อสร้างแท็บทั้งหมด (และรันซ้ำเพื่อจัดรูปแบบใหม่)
function setup() {
  Object.keys(TABS).forEach(function (k) { var sh = sheet_(k); style_(sh); });
  guide_();
  refreshOverview_();
}
