# สถานะคำแปลไทยของข้อมูลยา

คำแปลทั้งหมดทำโดยระบบ (AI) จากฉลากยา FDA ฉบับภาษาอังกฤษ ยังไม่ได้ตรวจโดยเภสัชกร · เทสต์ `src/drugdata/data.test.ts` ตรวจว่าตัวเลขทุกตัวในต้นฉบับต้องอยู่ในคำแปล

ครอบคลุม 13 ฉลาก จาก 12 สารออกฤทธิ์ (ข้อมูลทั้งหมด 317 สารออกฤทธิ์ที่มีเอกสาร)

| สารออกฤทธิ์ | ฉลาก (setid) | หัวข้อที่แปลแล้ว |
|---|---|---|
| adenosine | 61d9b8f6 | adverse_reactions, contraindications, geriatric_use, indications_and_usage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |
| adenosine | 9508caf5 | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, geriatric_use, indications_and_usage, pediatric_use, pregnancy, warnings |
| amiodarone | 0c9ee15a | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, use_in_specific_populations, warnings_and_cautions |
| dopamine | b61fffd0 | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, pediatric_use, warnings |
| epinephrine | 386519ba | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, geriatric_use, indications_and_usage, overdosage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |
| heparin | 0413f511 | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, geriatric_use, indications_and_usage, overdosage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |
| magnesium-sulfate | 03ebeabb | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |
| meperidine | b31d1308 | adverse_reactions, boxed_warning, contraindications, dosage_and_administration, drug_interactions, geriatric_use, indications_and_usage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |
| morphine | 6023606c | adverse_reactions, boxed_warning, contraindications, dosage_and_administration, drug_interactions, geriatric_use, indications_and_usage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |
| nicardipine | 433dbca3 | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, use_in_specific_populations, warnings_and_cautions |
| norepinephrine | 6363e9b4 | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, use_in_specific_populations, warnings_and_cautions |
| potassium-chloride | 3849b89c | adverse_reactions, contraindications, dosage_and_administration, drug_interactions, indications_and_usage, overdosage, pediatric_use, pregnancy, warnings |
| warfarin | 61ab23a7 | adverse_reactions, boxed_warning, contraindications, dosage_and_administration, drug_interactions, geriatric_use, indications_and_usage, pediatric_use, pregnancy, use_in_specific_populations, warnings_and_cautions |

## ยังไม่ได้แปล
หัวข้อที่เหลือ (อาการไม่พึงประสงค์, ประชากรกลุ่มพิเศษ, การใช้เกินขนาด, คำเตือนของ amiodarone/heparin/morphine/meperidine และขนาดยา/อันตรกิริยาของ dopamine/morphine/meperidine) และสารออกฤทธิ์ที่เหลือ — ทำเป็นชุดตามลำดับความเสี่ยง (ยากลุ่ม HAD ก่อน)
