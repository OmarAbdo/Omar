import React from "react";
import { motion } from "framer-motion";
import { transactions, transactionSummary } from "../../vault.data";

const fmtFull = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const PAGE_SIZE = 8;

interface Props {
  filter: "all" | "credit" | "debit" | "investment";
  search: string;
  page: number;
  onFilterChange: (f: "all" | "credit" | "debit" | "investment") => void;
  onSearchChange: (s: string) => void;
  onPageChange: (p: number) => void;
}

const VaultTransactionsView: React.FC<Props> = ({
  filter, search, page, onFilterChange, onSearchChange, onPageChange,
}) => {
  const filtered = transactions
    .filter((tx) => filter === "all" || tx.type === filter)
    .filter((tx) => !search || tx.description.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const typeColors = {
    credit: "#34D399",
    debit: "#FB7185",
    investment: "#C9A96E",
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Total In", value: transactionSummary.totalIn, color: "#34D399" },
          { label: "Total Out", value: Math.abs(transactionSummary.totalOut), color: "#FB7185" },
          { label: "Net", value: transactionSummary.net, color: transactionSummary.net >= 0 ? "#34D399" : "#FB7185" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-5" style={card}>
            <p className="text-xs mb-1" style={{ color: "#71717A" }}>{s.label}</p>
            <p className="text-xl font-semibold tabular-nums" style={{ color: s.color }}>
              {s.value >= 0 ? "+" : "-"}{fmtFull(Math.abs(s.value))}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "#52524E" }}>This month</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="flex gap-1">
          {(["all", "credit", "debit", "investment"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { onFilterChange(f); onPageChange(0); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize"
              style={{
                backgroundColor: filter === f ? "#C9A96E15" : "transparent",
                color: filter === f ? "#C9A96E" : "#71717A",
                border: filter === f ? "1px solid #C9A96E25" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => { onSearchChange(e.target.value); onPageChange(0); }}
            placeholder="Search transactions..."
            className="w-56 px-3 py-1.5 rounded-lg text-xs outline-none"
            style={{
              backgroundColor: "#18181B",
              color: "#FAFAF9",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={card}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Date", "Description", "Account", "Category", "Amount", "Balance"].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                      h === "Amount" || h === "Balance" ? "text-right" : "text-left"
                    }`}
                    style={{ color: "#71717A" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors hover:bg-[#ffffff04]"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="px-6 py-3.5">
                    <span className="text-xs tabular-nums" style={{ color: "#A1A1AA" }}>{tx.date}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-1 h-6 rounded-full shrink-0"
                        style={{ backgroundColor: typeColors[tx.type] + "80" }}
                      />
                      <span className="text-sm" style={{ color: "#FAFAF9" }}>{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs" style={{ color: "#71717A" }}>{tx.account}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        color: "#A1A1AA",
                      }}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className="text-sm font-medium tabular-nums"
                      style={{ color: tx.amount >= 0 ? "#34D399" : "#FAFAF9" }}
                    >
                      {tx.amount >= 0 ? "+" : ""}{fmtFull(Math.abs(tx.amount))}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-xs tabular-nums" style={{ color: "#71717A" }}>{fmtFull(tx.balance)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-xs" style={{ color: "#52524E" }}>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onPageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-2 py-1 rounded text-xs transition-colors disabled:opacity-30"
                style={{ color: "#A1A1AA" }}
              >
                Prev
              </button>
              <button
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-2 py-1 rounded text-xs transition-colors disabled:opacity-30"
                style={{ color: "#A1A1AA" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VaultTransactionsView;
