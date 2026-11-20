"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseId, text } from "@/lib/validation";
import * as svc from "@/lib/services/addresses";

const bad = (message) => ({ ok: false, status: 422, message });

/** Menambah alamat (tanpa `id`) atau mengubah alamat milik sendiri (dengan `id`). */
export async function saveAddressAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const idRaw = text(fd, "id");
  const id = idRaw ? parseId(idRaw) : null;
  if (idRaw && !id) return bad("Alamat tidak valid.");
  const r = await svc.save(me, id, fd);
  if (r.ok) { revalidatePath("/buyer/addresses"); revalidatePath("/buyer/cart"); }
  return r;
}

export async function setDefaultAddressAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Alamat tidak valid.");
  const r = await svc.setDefault(me, id);
  if (r.ok) { revalidatePath("/buyer/addresses"); revalidatePath("/buyer/cart"); }
  return r;
}

export async function deleteAddressAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Alamat tidak valid.");
  const r = await svc.remove(me, id);
  if (r.ok) { revalidatePath("/buyer/addresses"); revalidatePath("/buyer/cart"); }
  return r;
}
