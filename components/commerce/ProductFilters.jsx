import Link from "next/link";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { Search } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/repositories/catalog";

/**
 * Pencarian + filter kategori, rentang harga, dan urutan (opsional di PDF, "Advanced Requirements").
 * Berupa form GET biasa sehingga URL bisa dibagikan dan halaman tetap Server Component.
 */
export default function ProductFilters({ categories, values }) {
  const hasFilter = values.q || values.category || values.min || values.max || values.rating || values.stok || (values.sort && values.sort !== "newest");

  return (
    <form action="/products" method="get" className="space-y-4 rounded-card border border-line bg-surface p-4 sm:p-5">
      <div className="relative">
        <label htmlFor="cari-produk" className="sr-only">Cari produk</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-strong" aria-hidden="true" />
        <input
          id="cari-produk"
          name="q"
          type="search"
          defaultValue={values.q}
          maxLength={100}
          placeholder="Cari berdasarkan nama produk, toko, atau kategori"
          className="h-12 w-full rounded-btn border border-line bg-surface pl-12 pr-4 text-base placeholder:text-muted-strong/70 focus-visible:border-primary"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          id="category"
          name="category"
          label="Kategori"
          defaultValue={values.category ?? ""}
          placeholder="Semua kategori"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Input id="min" name="min" type="number" inputMode="numeric" min={0} label="Harga minimum (Rp)" defaultValue={values.min ?? ""} placeholder="0" />
        <Input id="max" name="max" type="number" inputMode="numeric" min={0} label="Harga maksimum (Rp)" defaultValue={values.max ?? ""} placeholder="Tanpa batas" />
        <Select id="sort" name="sort" label="Urutkan" defaultValue={values.sort ?? "newest"} options={SORT_OPTIONS} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          id="rating"
          name="rating"
          label="Rating minimum"
          defaultValue={values.rating ? String(values.rating) : ""}
          placeholder="Semua rating"
          options={[{ value: "4", label: "4 bintang ke atas" }, { value: "3", label: "3 bintang ke atas" }]}
        />
        <Checkbox id="stok" name="stok" value="1" label="Hanya yang tersedia" hint="Sembunyikan produk yang stoknya habis" defaultChecked={Boolean(values.stok)} className="sm:col-span-1 lg:col-span-2 sm:items-center sm:pt-6" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Terapkan</Button>
        {hasFilter && (
          <Link href="/products" className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
            Atur ulang
          </Link>
        )}
      </div>
    </form>
  );
}
