"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Modal berbasis elemen <dialog> native: fokus terkunci di dalam dialog,
 * tombol Esc menutup, dan klik di luar dialog menutup.
 * Isi dialog tetap terjaga sesaat saat ditutup agar transisi fade-out berjalan mulus.
 */
export default function Modal({ open, onClose, title, description, children, footer, className }) {
  const ref = useRef(null);
  const titleId = useId();
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      setRendered(true);
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (dialog.open) dialog.close();
    const timer = setTimeout(() => setRendered(false), 220);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.();
      }}
      aria-labelledby={titleId}
      className={cn(
        "modal-smooth m-auto w-[calc(100%-2rem)] max-w-lg rounded-card border border-line bg-surface p-0 text-charcoal shadow-xl",
        className
      )}
    >
      {rendered && (
        <>
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 id={titleId} className="text-section-title">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted-strong">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-btn text-muted-strong hover:bg-cream hover:text-charcoal"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}