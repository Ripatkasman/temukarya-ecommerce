import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  { key: "awaiting_payment", label: "Menunggu Pembayaran" },
  { key: "processing", label: "Diproses" },
  { key: "shipped", label: "Dikirim" },
  { key: "completed", label: "Selesai" },
];

/** Pelacakan status satu sub-order. Status dibatalkan ditampilkan terpisah. */
export default function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-error-strong">
        <X className="size-4" aria-hidden="true" />Pesanan dibatalkan
      </p>
    );
  }
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <ol aria-label="Pelacakan pesanan" className="grid grid-cols-4 gap-1">
      {STEPS.map((s, i) => {
        const done = i < current || status === "completed";
        const active = i === current && status !== "completed";
        return (
          <li key={s.key} aria-current={active ? "step" : undefined} className="flex flex-col items-center gap-1.5 text-center">
            <span className={cn("flex size-7 items-center justify-center rounded-full border text-xs font-bold", done ? "border-primary bg-primary text-white" : active ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-muted-strong")}>
              {done ? <Check className="size-4" aria-hidden="true" /> : i + 1}
            </span>
            <span className={cn("text-caption leading-tight", active || done ? "font-semibold text-charcoal" : "text-muted-strong")}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
