"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { parseId, text } from "@/lib/validation";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/repositories/notifications";

export async function markReadAction(_prev, fd) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const id = parseId(text(fd, "id"));
  if (!id) return { ok: false };
  await markNotificationAsRead(user.id, id);
  revalidatePath("/seller/notifications");
  revalidatePath("/buyer/notifications");
  return { ok: true };
}

export async function markAllReadAction() {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await markAllNotificationsAsRead(user.id);
  revalidatePath("/seller/notifications");
  revalidatePath("/buyer/notifications");
  return { ok: true, message: "Semua notifikasi ditandai sudah dibaca." };
}