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
