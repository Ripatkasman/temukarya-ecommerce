import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function PriceDisplay({ value, size = "md", className }) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };
  return (
    <span className={cn("font-heading font-bold text-primary", sizes[size], className)}>
      {formatRupiah(value)}
    </span>
  );
}
