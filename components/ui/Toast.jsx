"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, box: "border-success bg-success-soft text-success-strong" },
  error: { icon: AlertCircle, box: "border-error bg-error-soft text-error-strong" },
  info: { icon: Info, box: "border-line bg-surface text-charcoal" },
};

/**
 * Pakai: const toast = useToast(); toast.success("Produk disimpan.")
 * Tampilkan toast sukses HANYA setelah operasinya benar-benar berhasil.
 */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (type, message) => {
      const id = crypto.randomUUID();
      setItems((list) => [...list, { id, type, message }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        {items.map((t) => {
          const { icon: Icon, box } = STYLES[t.type];
          return (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border px-4 py-3 text-sm font-medium shadow-lg",
                box
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p className="flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="-m-1 flex size-8 items-center justify-center rounded-btn hover:bg-black/5"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
}
