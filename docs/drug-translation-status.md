# สถานะคำแปลไทยของข้อมูลยา

คำแปลทั้งหมดทำโดยระบบ (AI) จากฉลากยา FDA ฉบับภาษาอังกฤษ ยังไม่ได้ตรวจโดยเภสัชกร · เทสต์ `src/drugdata/data.test.ts` ตรวจว่าตัวเลขทุกตัวในต้นฉบับต้องอยู่ในคำแปล

ครอบคลุม 13 ฉลาก จาก 12 สารออกฤทธิ์ (ข้อมูลทั้งหมด 317 สารออกฤทธิ์ที่มีเอกสาร)

| สารออกฤทธิ์ | ฉลาก (setid) | หัวข้อที่แปลแล้ว |
|---|---|---|
| adenosine | 61d9b8f6 | contraindications, indications_and_usage, warnings_and_cautions |
| adenosine | 9508caf5 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings |
| amiodarone | 0c9ee15a | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |
| dopamine | b61fffd0 | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, warnings |
| epinephrine | 386519ba | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |
| heparin | 0413f511 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |
| magnesium-sulfate | 03ebeabb | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |
| meperidine | b31d1308 | boxed_warning, contraindications, indications_and_usage |
| morphine | 6023606c | boxed_warning, contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| nicardipine | 433dbca3 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |
| norepinephrine | 6363e9b4 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |
| potassium-chloride | 3849b89c | contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings |
| warfarin | 61ab23a7 | boxed_warning, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, warnings_and_cautions |

## ยังไม่ได้แปล
หัวข้อที่เหลือ (อาการไม่พึงประสงค์, ประชากรกลุ่มพิเศษ, การใช้เกินขนาด, คำเตือนของ amiodarone/heparin/morphine/meperidine และขนาดยา/อันตรกิริยาของ dopamine/morphine/meperidine) และสารออกฤทธิ์ที่เหลือ — ทำเป็นชุดตามลำดับความเสี่ยง (ยากลุ่ม HAD ก่อน)
