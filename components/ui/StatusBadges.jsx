import { Shield, Store, ShoppingBag, Clock, PackageCheck, Truck, CheckCircle2, XCircle, Hourglass, ShieldCheck, ShieldX } from "lucide-react";
import Badge from "./Badge";

const ORDER = {
  awaiting_payment: { label: "Menunggu Pembayaran", tone: "warning", icon: Clock },
  processing: { label: "Diproses", tone: "brand", icon: PackageCheck },
  shipped: { label: "Dikirim", tone: "accent", icon: Truck },
  completed: { label: "Selesai", tone: "success", icon: CheckCircle2 },
  cancelled: { label: "Dibatalkan", tone: "error", icon: XCircle },
};

const SELLER = {
  pending: { label: "Menunggu Verifikasi", tone: "warning", icon: Hourglass },
  approved: { label: "Disetujui", tone: "success", icon: ShieldCheck },
  rejected: { label: "Ditolak", tone: "error", icon: ShieldX },
};

export function OrderStatusBadge({ status }) {
  const s = ORDER[status] ?? { label: status, tone: "neutral" };
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

export function SellerStatusBadge({ status }) {
  const s = SELLER[status] ?? { label: status, tone: "neutral" };
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

const ROLE = {
  admin: { label: "Admin", tone: "brand", icon: Shield },
  seller: { label: "Penjual", tone: "accent", icon: Store },
  buyer: { label: "Pembeli", tone: "neutral", icon: ShoppingBag },
};

export function RoleBadge({ role }) {
  const r = ROLE[role] ?? { label: role, tone: "neutral" };
  return <Badge tone={r.tone} icon={r.icon}>{r.label}</Badge>;
}
