import React, { useState, useMemo } from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  format?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  defaultSortKey?: keyof T;
  defaultSortDir?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

function HavenDataTable<T>({
  columns,
  data,
  pageSize = 8,
  defaultSortKey,
  defaultSortDir = "asc",
  onRowClick,
  rowKey,
  emptyMessage = "No data found",
}: Props<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null || bv == null) return 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider"
                  style={{
                    color: "#94A3B8",
                    textAlign: col.align || "left",
                    cursor: col.sortable !== false ? "pointer" : "default",
                    width: col.width,
                    userSelect: "none",
                  }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && sortKey === col.key && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={sortDir === "asc" ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"}
                        />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className="transition-colors duration-150"
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    cursor: onRowClick ? "pointer" : "default",
                    backgroundColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3"
                      style={{ textAlign: col.align || "left", color: "#0F172A" }}
                    >
                      {col.format ? col.format(row[col.key], row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}
        >
          <p className="text-xs" style={{ color: "#64748B" }}>
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
              style={{
                backgroundColor: page === 0 ? "#F1F5F9" : "#FFFFFF",
                color: page === 0 ? "#CBD5E1" : "#0F172A",
                border: "1px solid #E2E8F0",
              }}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
              style={{
                backgroundColor: page >= totalPages - 1 ? "#F1F5F9" : "#FFFFFF",
                color: page >= totalPages - 1 ? "#CBD5E1" : "#0F172A",
                border: "1px solid #E2E8F0",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HavenDataTable;
