/**
 * PharmaKPNHospital — Google Apps Script Web App (ระยะที่ 1)
 * ใช้บัญชี Google ของกลุ่มงาน และแชร์ Sheets เฉพาะเภสัชกรที่เกี่ยวข้อง
 *
 * ติดตั้ง:
 *  1) สร้าง Google Sheets ใหม่ → ส่วนขยาย → Apps Script → วางไฟล์นี้
 *  2) Project Settings → Script properties → เพิ่ม TOKEN = (ข้อความลับที่ตั้งเอง ยาว ≥ 24 ตัวอักษร)
 *  3) Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone
 *     (ความปลอดภัยอยู่ที่ TOKEN ที่ตรวจทุกคำขอ — ห้ามเผยแพร่ URL และ TOKEN ต่อสาธารณะ)
 *  4) คัดลอก URL ไปใส่ในแอป: ตั้งค่าซิงก์ → URL / token / salt
 *
 * PDPA: แอปส่งเฉพาะรหัสเคส และ HN ที่ผ่าน hash (SHA-256 + salt) — ไม่ส่งชื่อผู้ป่วย
 * แต่ละชุดข้อมูลเป็นหนึ่งแผ่นงาน แถวละหนึ่งรายการ: คอลัมน์ id · updatedAt · deleted · (สรุป…) · payload (JSON เต็ม)
 */
var COLLECTIONS = ['adr_cases', 'cqi_projects', 'intensive_monitoring', 'drug_info_log', 'workload_monthly', 'ptc_meetings', 'std_assessment'];
var FIXED = ['id', 'updatedAt', 'deleted'];

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

// รองรับ GET เพื่อทดสอบการเชื่อมต่อ/ดึงข้อมูล (token อยู่ใน query — แอปใช้ POST แทน)
function doGet(e) {
  try {
    var p = e.parameter || {};
    if (!authed_(p.token)) return json_({ ok: false, error: 'token ไม่ถูกต้อง' });
    return json_(handle_({ action: p.action || 'ping', collection: p.collection, since: Number(p.since || 0), id: p.id }));
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

function handle_(req) {
  if (req.action === 'ping') return { ok: true, time: Date.now() };
  if (COLLECTIONS.indexOf(req.collection) < 0) return { ok: false, error: 'ไม่รู้จักชุดข้อมูล' };
  var sh = sheet_(req.collection);
  if (req.action === 'push') return push_(sh, req.records || []);
  if (req.action === 'pull') return pull_(sh, Number(req.since || 0));
  if (req.action === 'get') { var r = pull_(sh, 0).records.filter(function (x) { return String(x.id) === String(req.id); })[0]; return { ok: true, record: r || null }; }
  return { ok: false, error: 'ไม่รู้จักคำสั่ง' };
}

function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(FIXED.concat(['payload'])); sh.setFrozenRows(1); }
  return sh;
}

function headers_(sh) { return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String); }

function push_(sh, records) {
  var head = headers_(sh);
  // เพิ่มคอลัมน์สรุปใหม่ก่อนคอลัมน์ payload
  records.forEach(function (r) {
    Object.keys(r.summary || {}).forEach(function (k) {
      if (head.indexOf(k) < 0) { var pi = head.indexOf('payload'); sh.insertColumnBefore(pi + 1); sh.getRange(1, pi + 1).setValue(k); head.splice(pi, 0, k); }
    });
  });
  var last = sh.getLastRow();
  var ids = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map(function (x) { return String(x[0]); }) : [];
  var tsCol = last > 1 ? sh.getRange(2, 2, last - 1, 1).getValues().map(function (x) { return Number(x[0]); }) : [];
  var saved = 0;
  records.forEach(function (r) {
    var row = head.map(function (h) {
      if (h === 'id') return String(r.id);
      if (h === 'updatedAt') return Number(r.updatedAt);
      if (h === 'deleted') return !!r.deleted;
      if (h === 'payload') return r.deleted ? '' : JSON.stringify(r.data);
      var v = (r.summary || {})[h]; return v === undefined ? '' : v;
    });
    var i = ids.indexOf(String(r.id));
    if (i >= 0) {
      if (Number(r.updatedAt) < tsCol[i]) return;        // ของในชีตใหม่กว่า — ล่าสุดชนะ
      sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
    } else { sh.appendRow(row); ids.push(String(r.id)); tsCol.push(Number(r.updatedAt)); }
    saved++;
  });
  return { ok: true, saved: saved };
}

function pull_(sh, since) {
  var last = sh.getLastRow();
  if (last < 2) return { ok: true, records: [] };
  var head = headers_(sh), n = head.length;
  var vals = sh.getRange(2, 1, last - 1, n).getValues();
  var ci = head.indexOf('id'), cu = head.indexOf('updatedAt'), cd = head.indexOf('deleted'), cp = head.indexOf('payload');
  var out = [];
  vals.forEach(function (v) {
    var t = Number(v[cu]);
    if (t < since) return;
    var del = v[cd] === true || String(v[cd]).toLowerCase() === 'true';
    var data = null;
    if (!del && v[cp]) { try { data = JSON.parse(v[cp]); } catch (e) { data = null; } }
    out.push({ id: String(v[ci]), updatedAt: t, deleted: del, data: data });
  });
  return { ok: true, records: out };
}
