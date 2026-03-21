import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clients, invoices } from "../safi.data";
import type { Client } from "../safi.data";
import StatusPill from "../../shared/StatusPill";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const ratingConfig: Record<string, { label: string; color: string; bg: string }> = {
  excellent: { label: "Excellent", color: "#10B981", bg: "#10B98110" },
  good: { label: "Good", color: "#3B82F6", bg: "#3B82F610" },
  fair: { label: "Fair", color: "#F59E0B", bg: "#F59E0B10" },
  poor: { label: "Poor", color: "#F43F5E", bg: "#F43F5E10" },
};

const SafiClientsView: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = searchQuery.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  const clientInvoices = selectedClient
    ? invoices.filter((inv) => inv.clientId === selectedClient.id)
    : [];

  return (
    <div className="p-6 flex gap-6 h-full overflow-hidden">
      {/* Client list */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#171717" }}>
            Clients
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "#737373" }}>
            {clients.length} clients · {fmt(clients.reduce((s, c) => s + c.totalBilled, 0))} total billed
          </p>
        </div>

        {/* Search */}
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
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5", color: "#171717" }}
          />
        </div>

        {/* Table */}
        <div className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ border: "1px solid #E5E5E5" }}>
          <div
            className="grid grid-cols-[1fr_140px_140px_100px_90px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E5E5", color: "#A3A3A3" }}
          >
            <span>Client</span>
            <span className="text-right">Total Billed</span>
            <span className="text-right">Outstanding</span>
            <span className="text-center">Invoices</span>
            <span className="text-center">Rating</span>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#FFFFFF" }}>
            {filteredClients.map((client, i) => {
              const rating = ratingConfig[client.paymentRating];
              const outstanding = client.totalBilled - client.totalPaid;
              return (
                <motion.button
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedClient(client)}
                  className="w-full grid grid-cols-[1fr_140px_140px_100px_90px] gap-4 px-5 py-4 text-sm transition-colors duration-100 hover:bg-[#FAFAFA] text-left"
                  style={{
                    borderBottom: "1px solid #F5F5F5",
                    backgroundColor: selectedClient?.id === client.id ? "#F0F0FF" : undefined,
                  }}
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate" style={{ color: "#171717" }}>
                      {client.name}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#A3A3A3" }}>
                      {client.city}, {client.country}
                    </p>
                  </div>
                  <span className="text-right font-semibold tabular-nums self-center" style={{ color: "#171717" }}>
                    {fmt(client.totalBilled)}
                  </span>
                  <span
                    className="text-right font-medium tabular-nums self-center"
                    style={{ color: outstanding > 0 ? "#F59E0B" : "#10B981" }}
                  >
                    {outstanding > 0 ? fmt(outstanding) : "—"}
                  </span>
                  <span className="text-center self-center" style={{ color: "#737373" }}>
                    {client.invoiceCount}
                  </span>
                  <span className="flex justify-center self-center">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: rating.color, backgroundColor: rating.bg }}
                    >
                      {rating.label}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Client detail panel */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0 overflow-hidden"
          >
            <div
              className="w-[380px] h-full rounded-xl overflow-y-auto flex flex-col"
              style={{ border: "1px solid #E5E5E5", backgroundColor: "#FFFFFF" }}
            >
              {/* Client header */}
              <div className="px-6 py-5 shrink-0" style={{ borderBottom: "1px solid #F5F5F5" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: "#4338CA" }}
                    >
                      {selectedClient.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold" style={{ color: "#171717" }}>
                        {selectedClient.name}
                      </h3>
                      <p className="text-xs" style={{ color: "#737373" }}>
                        {selectedClient.city}, {selectedClient.country}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
                    style={{ color: "#A3A3A3" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="px-6 py-4 space-y-2.5 text-sm" style={{ borderBottom: "1px solid #F5F5F5" }}>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#A3A3A3" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span style={{ color: "#525252" }}>{selectedClient.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#A3A3A3" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span style={{ color: "#525252" }}>{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#A3A3A3" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span style={{ color: "#525252" }}>{selectedClient.address}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 grid grid-cols-2 gap-4" style={{ borderBottom: "1px solid #F5F5F5" }}>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
                    Total Billed
                  </p>
                  <p className="text-lg font-bold tabular-nums mt-0.5" style={{ color: "#171717" }}>
                    {fmt(selectedClient.totalBilled)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
                    Total Paid
                  </p>
                  <p className="text-lg font-bold tabular-nums mt-0.5" style={{ color: "#10B981" }}>
                    {fmt(selectedClient.totalPaid)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
                    Outstanding
                  </p>
                  <p className="text-lg font-bold tabular-nums mt-0.5" style={{ color: selectedClient.totalBilled - selectedClient.totalPaid > 0 ? "#F59E0B" : "#10B981" }}>
                    {fmt(selectedClient.totalBilled - selectedClient.totalPaid)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
                    Payment Rating
                  </p>
                  <div className="mt-1.5">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        color: ratingConfig[selectedClient.paymentRating].color,
                        backgroundColor: ratingConfig[selectedClient.paymentRating].bg,
                      }}
                    >
                      {ratingConfig[selectedClient.paymentRating].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice history */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-3" style={{ borderBottom: "1px solid #F5F5F5" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A3A3A3" }}>
                    Invoice History ({clientInvoices.length})
                  </p>
                </div>
                {clientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="px-6 py-3 flex items-center justify-between"
                    style={{ borderBottom: "1px solid #F5F5F5" }}
                  >
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#4338CA" }}>
                        {inv.number}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#A3A3A3" }}>
                        {inv.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <StatusPill status={inv.status} />
                      <span className="text-sm font-semibold tabular-nums" style={{ color: "#171717" }}>
                        {fmt(inv.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafiClientsView;
