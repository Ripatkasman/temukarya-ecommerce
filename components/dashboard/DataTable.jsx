import { EmptyState } from "@/components/ui/States";

/**
 * Tabel data responsif (scroll horizontal di dalam wadahnya, halaman tidak ikut melebar).
 * columns: [{ key, header, render?: (row) => node, className? }]
 */
export default function DataTable({ columns, rows, rowKey = "id", empty }) {
  if (!rows || rows.length === 0) {
    return <EmptyState {...(empty ?? { title: "Belum ada data", description: "Data akan muncul di sini." })} />;
  }
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead className="bg-cream text-charcoal">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="align-middle">
              {columns.map((c) => (
                <td key={c.key} className={c.className ?? "px-4 py-3"}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
