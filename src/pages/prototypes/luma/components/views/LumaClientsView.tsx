import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clients, appointments } from "../../luma.data";
import type { Client } from "../../luma.data";

type SortKey = "name" | "totalBookings" | "totalSpent" | "lastVisit";

const LumaClientsView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filtered = clients
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "totalBookings") cmp = a.totalBookings - b.totalBookings;
      else if (sortKey === "totalSpent") cmp = a.totalSpent - b.totalSpent;
      else if (sortKey === "lastVisit") cmp = a.lastVisit.localeCompare(b.lastVisit);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: string }) => (
    <svg className="w-3 h-3 inline ml-1" viewBox="0 0 12 12" fill="none" stroke={active ? "#C2703E" : "#D6D3D1"} strokeWidth={1.5}>
      {dir === "asc" || !active ? <path d="M3 8l3-4 3 4" /> : <path d="M3 4l3 4 3-4" />}
    </svg>
  );

  const clientAppointments = selectedClient
    ? appointments.filter((a) => a.clientId === selectedClient.id)
    : [];

  return (
    <div className="flex flex-1 min-h-0">
      {/* Main list */}
      <div className="flex-1 flex flex-col min-h-0 px-6 py-5">
        {/* Search + count */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#A8A29E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
              style={{
                backgroundColor: "#FFF7ED",
                border: "1px solid #F5E6D3",
                color: "#292524",
                fontFamily: "'DM Sans', sans-serif",
                width: 260,
              }}
            />
          </div>
          <span className="text-xs" style={{ color: "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}>
            {filtered.length} client{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-xl" style={{ border: "1px solid #F5E6D3" }}>
          <table className="w-full text-left" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr style={{ backgroundColor: "#FFF7ED" }}>
                {([
                  { key: "name" as SortKey, label: "Client" },
                  { key: "totalBookings" as SortKey, label: "Bookings" },
                  { key: "totalSpent" as SortKey, label: "Spent" },
                  { key: "lastVisit" as SortKey, label: "Last Visit" },
                ]).map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                    style={{ color: "#A8A29E", borderBottom: "1px solid #F5E6D3" }}
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </th>
                ))}
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#A8A29E", borderBottom: "1px solid #F5E6D3" }}>
                  Tags
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, i) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedClient(client)}
                  className="cursor-pointer transition-colors duration-150"
                  style={{
                    backgroundColor: selectedClient?.id === client.id ? "#C2703E08" : "transparent",
                    borderBottom: "1px solid #F5E6D320",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedClient?.id !== client.id) (e.currentTarget as HTMLElement).style.backgroundColor = "#FFF7ED";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedClient?.id !== client.id) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: "#C2703E15", color: "#C2703E" }}
                      >
                        {client.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "#292524" }}>{client.name}</p>
                        <p className="text-[11px] truncate" style={{ color: "#A8A29E" }}>{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#292524" }}>{client.totalBookings}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#292524" }}>${client.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#78716C" }}>{client.lastVisit}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                          style={{
                            backgroundColor: tag === "VIP" ? "#FEF3C7" : tag === "New" ? "#D1FAE5" : tag === "Enterprise" ? "#E0E7FF" : tag === "Recurring" ? "#FFF7ED" : "#F5F5F4",
                            color: tag === "VIP" ? "#92400E" : tag === "New" ? "#065F46" : tag === "Enterprise" ? "#3730A3" : tag === "Recurring" ? "#C2703E" : "#57534E",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client detail panel */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-80 shrink-0 h-full overflow-y-auto"
            style={{ backgroundColor: "#FFFBF7", borderLeft: "1px solid #F5E6D3" }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F5E6D3" }}>
              <h3 className="text-sm font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Client Profile</h3>
              <button onClick={() => setSelectedClient(null)} className="p-1 rounded-lg hover:bg-[#F5E6D340]" style={{ color: "#A8A29E" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Avatar + info */}
              <div className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mx-auto"
                  style={{ backgroundColor: "#C2703E15", color: "#C2703E" }}
                >
                  {selectedClient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="text-base font-bold mt-3" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>{selectedClient.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#A8A29E" }}>{selectedClient.email}</p>
                <p className="text-xs mt-0.5" style={{ color: "#A8A29E" }}>{selectedClient.phone}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {selectedClient.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        backgroundColor: tag === "VIP" ? "#FEF3C7" : tag === "New" ? "#D1FAE5" : tag === "Enterprise" ? "#E0E7FF" : "#F5F5F4",
                        color: tag === "VIP" ? "#92400E" : tag === "New" ? "#065F46" : tag === "Enterprise" ? "#3730A3" : "#57534E",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
                  <p className="text-base font-bold" style={{ color: "#292524" }}>{selectedClient.totalBookings}</p>
                  <p className="text-[9px]" style={{ color: "#A8A29E" }}>Bookings</p>
                </div>
                <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
                  <p className="text-base font-bold" style={{ color: "#292524" }}>${selectedClient.totalSpent.toLocaleString()}</p>
                  <p className="text-[9px]" style={{ color: "#A8A29E" }}>Spent</p>
                </div>
                <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
                  <p className="text-base font-bold" style={{ color: "#292524" }}>{selectedClient.joinDate.slice(0, 4)}</p>
                  <p className="text-[9px]" style={{ color: "#A8A29E" }}>Since</p>
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div style={{ borderTop: "1px solid #F5E6D3", paddingTop: 16 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#A8A29E" }}>Notes</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#57534E" }}>{selectedClient.notes}</p>
                </div>
              )}

              {/* Appointments */}
              <div style={{ borderTop: "1px solid #F5E6D3", paddingTop: 16 }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>Appointments this week</p>
                {clientAppointments.length > 0 ? (
                  <div className="space-y-1.5">
                    {clientAppointments.map((a) => (
                      <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "#FFF7ED" }}>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                          backgroundColor: a.status === "confirmed" ? "#22C55E" : a.status === "pending" ? "#F59E0B" : a.status === "completed" ? "#6366F1" : "#EF4444"
                        }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium truncate" style={{ color: "#292524" }}>{a.service}</p>
                        </div>
                        <span className="text-[10px]" style={{ color: "#A8A29E" }}>
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][a.day]}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "#A8A29E" }}>No appointments this week</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LumaClientsView;
