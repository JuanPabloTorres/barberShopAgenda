import React from "react";

type DataTableColumn = { key: string; label: string; className?: string };

export function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available.",
  emptyState,
  pagination,
}: {
  columns: DataTableColumn[];
  data: Array<Record<string, React.ReactNode>>;
  loading?: boolean;
  emptyMessage?: string;
  emptyState?: React.ReactNode;
  pagination?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-cream-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slatewood-600 ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`loading-${rowIndex}`} className="border-t border-cream-200">
                  {columns.map((col) => (
                    <td key={`${col.key}-${rowIndex}`} className="px-4 py-3">
                      <div className="h-4 w-full rounded bg-cream-200 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slatewood-500">
                  {emptyState || emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-cream-200 hover:bg-cream-50">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-slatewood-800 ${col.className || ""}`}>
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between border-t border-cream-200 px-4 py-3 text-sm text-slatewood-600">
          {pagination}
        </div>
      )}
    </div>
  );
}
