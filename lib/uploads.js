import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

/**
 * Upload gambar ke folder `uploads/` (hanya server).
 * Validasi: ukuran maksimal 2 MB dan tipe file diperiksa dari isi file (magic bytes),
 * bukan dari nama atau Content-Type yang bisa dipalsukan.
 */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
// Disimpan di luar /public: file yang ditambahkan ke /public setelah `next build` tidak disajikan oleh `next start`.
// Disajikan lewat route handler app/uploads/[name]/route.js.
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

/** @param {Buffer} b @returns {"jpg"|"png"|"webp"|null} */
function detectType(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.length > 12 && b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

/**
 * Memvalidasi dan menyimpan gambar dari FormData.
 * @param {FormData} formData
 * @param {string} field nama field file
 * @param {{ required?: boolean }} [opts]
 * @returns {Promise<{ url?: string, error?: string, none?: boolean }>} `none` = tidak ada file dipilih (dan tidak wajib)
 */
export async function saveImage(formData, field, { required = false } = {}) {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) {
    return required ? { error: "Gambar wajib diunggah." } : { none: true };
  }
  if (file.size > MAX_IMAGE_BYTES) return { error: "Ukuran gambar maksimal 2 MB." };

  const buffer = Buffer.from(await file.arrayBuffer());
  const type = detectType(buffer);
  if (!type) return { error: "Format gambar harus JPG, PNG, atau WebP." };

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomBytes(12).toString("hex")}.${type}`;
  await writeFile(path.join(UPLOAD_DIR, name), buffer);
  return { url: `/uploads/${name}` };
}

/** Menghapus file unggahan lama. Hanya path di /uploads/ yang disentuh (placeholder bawaan aman). */
export async function removeUploadedFile(url) {
  if (typeof url !== "string" || !/^\/uploads\/[a-f0-9]{24}\.(jpg|png|webp)$/.test(url)) return;
  try {
    await unlink(path.join(UPLOAD_DIR, path.basename(url)));
  } catch {
    /* file sudah tidak ada */
  }
}
