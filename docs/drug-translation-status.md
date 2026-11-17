# สถานะคำแปลไทยของข้อมูลยา

คำแปลทั้งหมดทำโดยระบบ (AI) จากฉลากยา FDA ฉบับภาษาอังกฤษ ยังไม่ได้ตรวจโดยเภสัชกร · เทสต์ `src/drugdata/data.test.ts` ตรวจว่าตัวเลขทุกตัวในต้นฉบับต้องอยู่ในคำแปล

ครอบคลุม 13 ฉลาก จาก 12 สารออกฤทธิ์ (ข้อมูลทั้งหมด 317 สารออกฤทธิ์ที่มีเอกสาร)

| สารออกฤทธิ์ | ฉลาก (setid) | หัวข้อที่แปลแล้ว |
|---|---|---|
| adenosine | 61d9b8f6 | contraindications, indications_and_usage |
| adenosine | 9508caf5 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| amiodarone | 0c9ee15a | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| dopamine | b61fffd0 | contraindications, indications_and_usage |
| epinephrine | 386519ba | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| heparin | 0413f511 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| magnesium-sulfate | 03ebeabb | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| meperidine | b31d1308 | boxed_warning, contraindications, indications_and_usage |
| morphine | 6023606c | boxed_warning, contraindications, indications_and_usage |
| nicardipine | 433dbca3 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| norepinephrine | 6363e9b4 | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| potassium-chloride | 3849b89c | contraindications, dosage_and_administration, drug_interactions, indications_and_usage |
| warfarin | 61ab23a7 | boxed_warning, contraindications, indications_and_usage |

## ยังไม่ได้แปล
หัวข้ออื่นทั้งหมด (คำเตือนและข้อควรระวัง, อาการไม่พึงประสงค์, ประชากรกลุ่มพิเศษ, การใช้เกินขนาด, และขนาดยา/อันตรกิริยาที่ยังเหลือ) และสารออกฤทธิ์ที่เหลือ — ทำเป็นชุดตามลำดับความเสี่ยง (ยากลุ่ม HAD ก่อน)
