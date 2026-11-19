import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/uploads";

const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/**
 * Menyajikan gambar unggahan. Nama file dibatasi ketat (24 hex + ekstensi gambar),
 * jadi path traversal seperti "../../.env" tidak mungkin sampai ke filesystem.
 */
export async function GET(_req, { params }) {
  const { name } = await params;
  const m = /^[a-f0-9]{24}\.(jpg|png|webp)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(file, {
      headers: {
        "Content-Type": TYPES[m[1]],
        "Cache-Control": "public, max-age=31536000, immutable", // nama acak: isi tidak pernah berubah
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
