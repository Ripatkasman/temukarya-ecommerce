import Link from "next/link";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Pencarian + filter dropdown untuk tabel dashboard (form GET, tanpa JavaScript).
 * `filters`: [{ name, label, value, options: [{ value, label }] }]
 */
export default function SearchFilterBar({ basePath, q = "", placeholder = "Cari…", filters = [] }) {
  const active = q || filters.some((f) => f.value);
  return (
    <form action={basePath} method="get" role="search" className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <label htmlFor="q" className="sr-only">Cari</label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-strong" aria-hidden="true" />
        <input
          id="q" name="q" type="search" defaultValue={q} maxLength={100} placeholder={placeholder}
          className="h-11 w-full rounded-btn border border-line bg-surface pl-11 pr-3 text-sm placeholder:text-muted-strong/70 focus-visible:border-primary"
        />
      </div>
      {filters.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="sr-only">{f.label}</label>
          <select id={f.name} name={f.name} defaultValue={f.value} className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-sm sm:w-48">
            <option value="">{f.label}</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 sm:flex-none">Terapkan</Button>
        {active && (
          <Link href={basePath} className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-primary underline-offset-4 hover:underline">Atur ulang</Link>
        )}
      </div>
    </form>
  );
}
