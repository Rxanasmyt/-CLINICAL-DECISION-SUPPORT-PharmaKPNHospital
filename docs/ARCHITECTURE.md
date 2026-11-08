# สถาปัตยกรรมและวิธีใช้งาน (PharmaKPNHospital v2)

React + TypeScript + Vite · PWA (`vite-plugin-pwa`) · IndexedDB (Dexie) · sync ไป Google Sheets (Apps Script)

```bash
npm install
npm run dev        # พัฒนา
npm test           # unit test (29 ชุด ครอบคลุม 15,000+ กรณีเทียบต้นแบบ)
npm run build      # ได้ dist/ (ต้องเสิร์ฟผ่าน HTTPS สำหรับ PWA)
```

## โครงสร้าง
| ที่ | หน้าที่ |
|---|---|
| `src/data/*.ts` | ค่าคงที่ทางคลินิก **คัดลอกคำต่อคำ** จากต้นแบบด้วย `tools/extract-constants.mjs` (ห้ามแก้ด้วยมือ) |
| `src/logic/*.ts` | ฟังก์ชันคำนวณ: TB/LTBI, Warfarin, ยาน้ำเด็ก, insulin, Naranjo/WHO-UMC/Schumock |
| `src/logic/golden.test.ts` | เทียบผลกับต้นแบบทุกกรณี (`src/logic/__golden__/golden.json` สร้างโดย `tools/gen-golden.mjs` โดยรันโค้ดต้นแบบ) |
| `src/ui/View.generated.tsx` | markup ที่แปลงจาก template ต้นแบบด้วย `tools/dc-to-jsx.mjs` (หน้าตา/ข้อความตรงต้นแบบ) |
| `src/app/App.tsx` | state + view-model (พอร์ตจาก `class Component`) เรียกใช้ `src/logic` |
| `src/ui/Chrome.tsx` | ส่วนที่เพิ่ม: แถบเมนูล่าง, แท็บ กรอก/ใบสรุป, สถานะ sync + หน้าตั้งค่า |
| `src/storage/*` | `Store` (IndexedDB + แคช), `StorageAdapter`, `SheetsAdapter`, `SyncEngine`, PDPA, ไฟล์สำรอง |
| `docs/apps-script/Code.gs` | ฝั่ง Google Apps Script (ตรวจ token ทุกคำขอ) |

สร้างไฟล์อัตโนมัติใหม่จากต้นแบบ: `PROTOTYPE=<path .dc.html> npm run gen:data | gen:view | gen:golden`

## Sync / PDPA
- บันทึก → เขียน IndexedDB ทันที → รายการค้างส่ง (แสดงที่แถบหัว) → POST `text/plain` ไป Apps Script → ดึงข้อมูลล่าสุดมารวม (`updatedAt` ล่าสุดชนะ)
- ไม่ส่งชื่อผู้ป่วย: เคส ADR ส่งเฉพาะรหัสเคส (`cid`) และ HN ที่ผ่าน `sha256(salt:HN)`; label ถูกแทนด้วย "เคส <รหัส>" ; เครื่องต้นทางคงชื่อ/HN ไว้เมื่อรับการแก้ไขจากเครื่องอื่น
- ไม่ตั้ง salt = ไม่ส่งข้อมูลที่มี HN · ข้อความอิสระ (เช่น ประวัติแพ้ยา, หมายเหตุ) ส่งตามที่พิมพ์ — อย่าใส่ชื่อผู้ป่วยในช่องเหล่านี้
- แอปเรียก Apps Script ด้วย POST ทั้งดึงและส่ง (token อยู่ใน body ไม่อยู่ใน URL) — `doGet` ใน Code.gs มีไว้ทดสอบเท่านั้น
- ระยะที่ 2: เขียน `StorageAdapter` ตัวใหม่ (REST → PostgreSQL/MySQL) แล้วเปลี่ยนใน `src/storage/index.ts` ที่เดียว
- ปุ่ม "ลบข้อมูลทั้งหมด" ลบเฉพาะในเครื่องนี้ (ข้อมูลที่ซิงก์ไว้บน Sheets ยังอยู่ และจะกลับมาเมื่อซิงก์)

## หน้าตาของ Google Sheets (เวอร์ชัน 2)
- แท็บชื่อไทย: เคสแพ้ยา (ADR) · โครงการ CQI และ R2R · ติดตามเข้มข้น (Intensive) · การให้ข้อมูลด้านยา · ภาระงานรายเดือน · วันประชุม PTC · ประเมินมาตรฐาน ข้อ 3 และ 9 + แท็บ "อ่านก่อน" (อธิบายแต่ละแท็บ) และ "ภาพรวม" (ตัวเลขสำคัญ + แนวโน้มรายไตรมาส + กราฟ คำนวณด้วยสูตร)
- หัวคอลัมน์และค่าเป็นภาษาไทย (ฝั่งแอป: `src/storage/labels.ts`) เช่น "ระดับ Naranjo = Probable (น่าจะใช่)" "รายงาน HPVC = รอส่ง"; วันที่เป็นรูปแบบ "4 พ.ย. 2569"
- คอลัมน์เทคนิค (`_เวลา(ms)`, `_ข้อมูลเต็ม(JSON)`) ซ่อนอยู่ขวาสุด ห้ามแก้ · รายการที่ลบแล้วเป็นตัวเทาขีดฆ่าและ "ลบแล้ว? = ใช่"
- ถ้าเคยใช้โค้ดเวอร์ชันเก่า: วางโค้ดใหม่ → Run `setup` → Deploy เวอร์ชันใหม่ → ในแอปกด "ส่งข้อมูลทั้งหมดใหม่" → ลบแท็บที่ขึ้นต้นด้วย "เก่า-"
- แก้ชื่อหัวคอลัมน์ที่ `src/storage/labels.ts` ต้องแก้สูตรใน `refreshOverview_` ของ `Code.gs` ให้ตรงกัน (มีเทสต์ใน `appsscript.test.ts` ตรวจ)

## อัปเดตโค้ด Apps Script (เตือนเวอร์ชัน + ปุ่มจัดชีต)
- `docs/apps-script/Code.gs` มี `SCRIPT_VERSION` และแอปมี `REQUIRED_SCRIPT_VERSION` (`src/storage/scriptVersion.ts`) — **แก้ Code.gs ในทางที่แอปต้องพึ่งแล้วต้องเพิ่มเลขทั้งสองที่** (มีเทสต์ตรวจว่าตรงกัน)
- แอปเทียบเลขทุกครั้งที่ซิงก์ ถ้าชีตเก่ากว่า: ป้ายสถานะขึ้น "ต้องอัปเดตโค้ด Apps Script" และหน้าตั้งค่าซิงก์แสดงขั้นตอน (ซิงก์ยังทำงานตามปกติ)
- หลังวางโค้ดใหม่และ Deploy (Manage deployments → New version) กดปุ่ม "จัดชีตใหม่" ในแอป (แทนการ Run `setup` ในตัวแก้ไข) แล้วกด "ส่งข้อมูลทั้งหมดใหม่" เมื่อโครงสร้างคอลัมน์เปลี่ยน
- ไม่ได้ deploy อัตโนมัติ (ตั้งใจ): การวางโค้ดด้วยมือต้องล็อกอิน Google เป็นด่านป้องกันการแก้โค้ดที่เข้าถึงข้อมูลผู้ป่วย
