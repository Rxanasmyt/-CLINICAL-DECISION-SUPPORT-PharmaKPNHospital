// คลังแนวทางการรักษา: แนวทางรายโรค เน้นยา — เนื้อหาคลินิกมาจากไฟล์ข้อมูลที่มีที่มาและหน้าอ้างอิง ไม่เขียนใหม่ในโค้ดหน้าจอ
/** ที่มาของบล็อกที่ไม่ได้คัดจากไฟล์อ้างอิงมีหน้า — แสดงป้ายเตือนให้ตรวจกับต้นฉบับ */
export type BlockOrigin = { origin?: string };
export type Block = BlockOrigin & (
  | { kind: 'kv'; h: string; sub?: string; items: { k: string; v: string; note?: string }[] }
  | { kind: 'grid3' | 'grid5'; h: string; sub?: string; head: string[]; items: Record<string, string>[]; foot?: string; danger?: boolean }
  | { kind: 'drug'; h: string; items: { d: string; dose: string; max: string; ae: string; mon: string }[] }
  | { kind: 'list'; h: string; danger?: boolean; items: { t: string }[] });

export interface Review { status: 'pending' | 'approved'; reviewer: string; reviewedAt: string; /** วันครบรอบทบทวนถัดไป YYYY-MM-DD */ nextDue: string }

/** ยาที่แนวทางพูดถึง: ชื่อที่แสดง + ชื่อ/ชื่อย่อที่ใช้ค้นข้อความ (ไม่ใช่เนื้อหาคลินิก) */
export interface DrugRef { name: string; aliases: string[] }

export interface Guideline {
  id: string; title: string; category: string; keywords: string[];
  /** สีประจำการ์ดและไอคอน (หน้าตาเท่านั้น ไม่ใช่เนื้อหาคลินิก) */
  accent?: string; icon?: string;
  drugs?: DrugRef[];
  /** แหล่งอ้างอิงหลัก (บรรทัดเดียว) */
  source: string; cites: string[];
  review: Review;
  blocks: Block[];
  /** กลุ่มหัวข้อสำหรับปุ่มเลื่อน: ชื่อ + ลำดับบล็อก */
  sections: { title: string; blocks: number[] }[];
  /** ปุ่มลัดไปเครื่องคำนวณที่เกี่ยวข้อง */
  calc?: { label: string; mode: string };
}
