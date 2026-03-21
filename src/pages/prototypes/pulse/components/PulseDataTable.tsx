import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right";
  mono?: boolean;
  format?: (val: any) => string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  defaultSortKey?: keyof T;
  defaultSortDir?: "asc" | "desc";
}

function PulseDataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 8,
  defaultSortKey,
  defaultSortDir = "desc",
}: Props<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const showing = `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, sorted.length)} of ${sorted.length}`;

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`text-xs font-medium pb-2 cursor-pointer select-none transition-colors hover:text-blue-400 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                  style={{ color: sortKey === col.key ? "#3B82F6" : "#64748B" }}
                  onClick={() => col.label && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: i < paged.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
              >
                {columns.map((col) => {
                  const raw = row[col.key];
                  const display = col.format ? col.format(raw) : String(raw);
                  return (
                    <td
                      key={String(col.key)}
                      className={`py-2.5 text-sm ${col.mono ? "font-mono" : ""} ${
                        col.align === "right" ? "text-right" : "text-left"
                      }`}
                      style={{ color: col.align === "right" ? "#F1F5F9" : "#94A3B8" }}
                    >
                      {display}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs" style={{ color: "#64748B" }}>{showing}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30"
              style={{ color: "#94A3B8" }}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30"
              style={{ color: "#94A3B8" }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PulseDataTable;
