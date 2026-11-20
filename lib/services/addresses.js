import { validateAddress } from "@/lib/validation";
import * as repo from "@/lib/repositories/addresses";

/** Logika buku alamat Buyer. `me` = buyer dari sesi. */

/** `id` kosong = alamat baru. */
export async function save(me, id, fd) {
  const { values, errors } = validateAddress(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors, values };
  if (!id) {
    const r = await repo.createAddress(me.id, values);
    if (r.status === "limit") return { ok: false, status: 409, message: `Maksimal ${repo.MAX_ADDRESSES} alamat tersimpan. Hapus salah satu terlebih dahulu.` };
    return { ok: true, status: 201, message: "Alamat ditambahkan.", data: { id: r.id } };
  }
  if (!(await repo.updateAddress(me.id, id, values))) return { ok: false, status: 404, message: "Alamat tidak ditemukan." };
  return { ok: true, message: "Alamat diperbarui." };
}

export async function setDefault(me, id) {
  if (!(await repo.setDefaultAddress(me.id, id))) return { ok: false, status: 404, message: "Alamat tidak ditemukan." };
  return { ok: true, message: "Alamat utama diubah." };
}

export async function remove(me, id) {
  if (!(await repo.deleteAddress(me.id, id))) return { ok: false, status: 404, message: "Alamat tidak ditemukan." };
  return { ok: true, message: "Alamat dihapus." };
}
