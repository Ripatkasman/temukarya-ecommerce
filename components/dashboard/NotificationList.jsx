"use client";

import { useTransition } from "react";
import { Bell, CheckCheck, TriangleAlert, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { markReadAction, markAllReadAction } from "@/lib/actions/notifications";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function NotificationList({ notifications }) {
  const [pending, startTransition] = useTransition();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function handleMarkRead(id) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      await markReadAction(null, fd);
    });
  }

  function handleMarkAll() {
    startTransition(async () => {
      await markAllReadAction();
    });
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Belum ada notifikasi"
        description="Pemberitahuan penting terkait akun, pesanan, atau moderasi produk akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3 text-sm">
          <span>
            Anda memiliki <strong>{unreadCount}</strong> notifikasi belum dibaca.
          </span>
          <Button type="button" variant="outline" size="sm" disabled={pending} onClick={handleMarkAll}>
            <CheckCheck className="size-4" aria-hidden="true" />
            Tandai semua dibaca
          </Button>
        </div>
      )}

      <ul className="space-y-3">
        {notifications.map((n) => {
          const isAlert = n.type === "product_removed";
          return (
            <li
              key={n.id}
              className={cn(
                "rounded-card border p-4 transition-colors sm:p-5",
                n.is_read
                  ? "border-line bg-surface"
                  : isAlert
                  ? "border-error/40 bg-error-soft/40"
                  : "border-primary/40 bg-primary-soft/30"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                      isAlert ? "bg-error-soft text-error-strong" : "bg-cream text-primary"
                    )}
                  >
                    {isAlert ? <TriangleAlert className="size-4" /> : <Info className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-charcoal">{n.title}</h2>
                      {!n.is_read && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
                          Baru
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-charcoal">
                      {n.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-strong">{formatDateTime(n.created_at)}</p>
                  </div>
                </div>

                {!n.is_read && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    Tandai dibaca
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}