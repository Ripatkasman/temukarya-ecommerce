import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Kolom pencarian produk (GET /products?q=). Bekerja tanpa JavaScript. */
export default function SearchBox({ defaultValue = "", className, size = "lg" }) {
  return (
    <form role="search" action="/products" method="get" className={cn("flex w-full gap-2", className)}>
      <div className="relative flex-1">
        <label htmlFor="cari-produk" className="sr-only">Cari produk</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-strong" aria-hidden="true" />
        <input
          id="cari-produk"
          name="q"
          type="search"
          defaultValue={defaultValue}
          maxLength={100}
          placeholder="Cari produk, misalnya tas anyaman atau kopi"
          className="h-12 w-full rounded-btn border border-line bg-surface pl-12 pr-4 text-base placeholder:text-muted-strong/70 focus-visible:border-primary"
        />
      </div>
      <Button type="submit" size={size}>Cari</Button>
    </form>
  );
}
