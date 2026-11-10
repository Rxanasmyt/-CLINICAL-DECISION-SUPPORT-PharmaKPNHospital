// แนบไฟล์แนวทาง (PDF/รูป) ในเครื่องนี้เท่านั้น — ไม่ส่งขึ้นเว็บหรือ Google Sheets (เอกสารภายใน/มีลิขสิทธิ์ห้ามอยู่ใน repo สาธารณะ)
import type { AppDb, FileRow } from '../storage/db';

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES_PER_GUIDELINE = 8;
export const ALLOWED = /^(application\/pdf|image\/(png|jpeg|webp))$/;

export function validateFile(f: { name: string; type: string; size: number }, existing: number): string | null {
  if (!ALLOWED.test(f.type) && !/\.pdf$/i.test(f.name)) return 'รองรับเฉพาะไฟล์ PDF หรือรูป (PNG/JPG/WebP)';
  if (f.size > MAX_FILE_BYTES) return `ไฟล์ใหญ่เกิน ${MAX_FILE_BYTES / 1024 / 1024} MB — แบ่งไฟล์เป็นส่วนๆ หรือแนบเฉพาะบทที่ต้องใช้`;
  if (existing >= MAX_FILES_PER_GUIDELINE) return `แนบได้สูงสุด ${MAX_FILES_PER_GUIDELINE} ไฟล์ต่อแนวทาง`;
  return null;
}
export const listFiles = (db: AppDb, guidelineId: string): Promise<FileRow[]> => db.files.where('guidelineId').equals(guidelineId).toArray();
export async function addFile(db: AppDb, guidelineId: string, file: File): Promise<string | null> {
  const err = validateFile(file, await db.files.where('guidelineId').equals(guidelineId).count());
  if (err) return err;
  await db.files.add({ guidelineId, name: file.name, type: file.type || 'application/pdf', size: file.size, blob: file, addedAt: Date.now() });
  return null;
}
export const removeFile = (db: AppDb, id: number) => db.files.delete(id);
export const fmtSize = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
