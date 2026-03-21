import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusPill from "../../shared/StatusPill";
import SafiInvoiceDetail from "./SafiInvoiceDetail";
import { invoices, kpiData } from "../safi.data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

type StatusFilter = "all" | "paid" | "pending" | "overdue";
type SortKey = "number" | "client" | "amount" | "date" | "dueDate";
type SortDir = "asc" | "desc";

const tabs: { id: StatusFilter; label: string; count: number }[] = [
  { id: "all", label: "All", count: kpiData.invoiceCount },
  { id: "paid", label: "Paid", count: kpiData.paidCount },
  { id: "pending", label: "Pending", count: kpiData.pendingCount },
  { id: "overdue", label: "Overdue", count: kpiData.overdueCount },
];

const SafiInvoicesView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.number.toLowerCase().includes(q) ||
          inv.client.toLowerCase().includes(q) ||
          inv.email.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") {
        cmp = a.amount - b.amount;
      } else {
        cmp = (a[sortKey] || "").localeCompare(b[sortKey] || "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [statusFilter, searchQuery, sortKey, sortDir]);

  const selectedInvoice = invoices.find((i) => i.id === selectedId) || null;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon: React.FC<{ columnKey: SortKey }> = ({ columnKey }) => {
    if (sortKey !== columnKey) return null;
    return (
      <svg className="w-3 h-3 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={sortDir === "asc" ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"}
        />
      </svg>
    );
  };

  return (
    <div className="p-6 flex gap-6 h-full overflow-hidden">
      {/* Main list area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#171717" }}>
              Invoices
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#737373" }}>
              Manage and track all your invoices
            </p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 mb-4 p-1 rounded-lg w-fit" style={{ backgroundColor: "#F5F5F5" }}>
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5"
                style={{
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#171717" : "#737373",
                  boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                }}
              >
                {tab.label}
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: isActive ? "#4338CA15" : "#E5E5E5",
                    color: isActive ? "#4338CA" : "#A3A3A3",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search within invoices */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#A3A3A3"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by client, invoice number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
            style={{
              backgroundColor: "#FAFAFA",
              border: "1px solid #E5E5E5",
              color: "#171717",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4338CA40";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E5E5";
            }}
          />
        </div>

        {/* Table */}
        <div
          className="flex-1 rounded-xl overflow-hidden flex flex-col"
          style={{ border: "1px solid #E5E5E5" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-[120px_1fr_140px_110px_110px_90px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E5E5", color: "#A3A3A3" }}
          >
            <button className="text-left flex items-center" onClick={() => handleSort("number")}>
              Invoice <SortIcon columnKey="number" />
            </button>
            <button className="text-left flex items-center" onClick={() => handleSort("client")}>
              Client <SortIcon columnKey="client" />
            </button>
            <button className="text-right flex items-center justify-end" onClick={() => handleSort("amount")}>
              Amount <SortIcon columnKey="amount" />
            </button>
            <button className="text-left flex items-center" onClick={() => handleSort("date")}>
              Date <SortIcon columnKey="date" />
            </button>
            <button className="text-left flex items-center" onClick={() => handleSort("dueDate")}>
              Due <SortIcon columnKey="dueDate" />
            </button>
            <span className="text-center">Status</span>
          </div>

          {/* Table body */}
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#FFFFFF" }}>
            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="#D4D4D4" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h.008v.008h-.008V15zm0 3H9.75m3 0h.008v.008h-.008V18zm-6-6h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18zM10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: "#A3A3A3" }}>
                  No invoices found
                </p>
                <p className="text-xs mt-1" style={{ color: "#D4D4D4" }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredInvoices.map((inv, i) => (
                <motion.button
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedId(inv.id)}
                  className="w-full grid grid-cols-[120px_1fr_140px_110px_110px_90px] gap-4 px-5 py-3.5 text-sm transition-colors duration-100 hover:bg-[#FAFAFA] text-left"
                  style={{
                    borderBottom: "1px solid #F5F5F5",
                    backgroundColor: selectedId === inv.id ? "#F0F0FF" : undefined,
                  }}
                >
                  <span className="font-semibold" style={{ color: "#4338CA" }}>
                    {inv.number}
                  </span>
                  <span className="truncate" style={{ color: "#525252" }}>
                    {inv.client}
                  </span>
                  <span className="text-right font-semibold tabular-nums" style={{ color: "#171717" }}>
                    {fmt(inv.amount)}
                  </span>
                  <span style={{ color: "#737373" }}>{inv.date}</span>
                  <span style={{ color: "#737373" }}>{inv.dueDate}</span>
                  <span className="flex justify-center">
                    <StatusPill status={inv.status} />
                  </span>
                </motion.button>
              ))
            )}
          </div>

          {/* Table footer */}
          <div
            className="px-5 py-3 flex items-center justify-between text-xs"
            style={{ backgroundColor: "#FAFAFA", borderTop: "1px solid #E5E5E5", color: "#737373" }}
          >
            <span>
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </span>
            <span className="font-medium" style={{ color: "#171717" }}>
              Total: {fmt(filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 420, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0 overflow-hidden"
          >
            <div className="w-[420px] h-full overflow-y-auto">
              <SafiInvoiceDetail
                invoice={selectedInvoice}
                onClose={() => setSelectedId(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafiInvoicesView;
