import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Appointment } from "../luma.data";
import { clients, appointments as allAppointments, getService } from "../luma.data";

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
}

type TabId = "details" | "history" | "notes";

const tabs: { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "history", label: "History" },
  { id: "notes", label: "Notes" },
];

const statusDot: Record<string, string> = {
  confirmed: "#22C55E",
  completed: "#6366F1",
  pending: "#F59E0B",
  cancelled: "#EF4444",
};

const LumaClientPanel: React.FC<Props> = ({ appointment, onClose }) => {
  const client = appointment ? clients.find((c) => c.id === appointment.clientId) : null;
  const [activeTab, setActiveTab] = useState<TabId>("details");

  // Get all appointments for this client
  const clientAppointments = client
    ? allAppointments.filter((a) => a.clientId === client.id)
    : [];
  const upcoming = clientAppointments.filter((a) => a.status === "confirmed" || a.status === "pending");
  const past = clientAppointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <AnimatePresence>
      {appointment && client && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-80 shrink-0 h-screen sticky top-0 overflow-y-auto flex flex-col"
          style={{ backgroundColor: "#FFFBF7", borderLeft: "1px solid #F5E6D3" }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #F5E6D3" }}>
            <h3 className="text-sm font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
              Appointment
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors hover:bg-[#F5E6D340]"
              style={{ color: "#A8A29E" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Client quick info */}
          <div className="px-4 py-4 flex items-center gap-3 shrink-0" style={{ borderBottom: "1px solid #F5E6D3" }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: "#C2703E15", color: "#C2703E" }}
            >
              {client.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
                {client.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
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
          </div>

          {/* Tabs */}
          <div className="flex px-4 pt-3 gap-0 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-3 py-2 text-xs font-semibold transition-colors duration-200"
                style={{
                  color: activeTab === tab.id ? "#C2703E" : "#A8A29E",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="panel-tab-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                    style={{ backgroundColor: "#C2703E" }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Service info */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>
                    Service
                  </p>
                  <p className="text-base font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
                    {appointment.service}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        backgroundColor: appointment.status === "confirmed" ? "#D1FAE540" : appointment.status === "completed" ? "#E0E7FF40" : "#FED7AA40",
                        color: appointment.status === "confirmed" ? "#166534" : appointment.status === "completed" ? "#3730A3" : "#92400E",
                      }}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    <span className="text-[11px]" style={{ color: "#A8A29E" }}>
                      {appointment.duration}h • ${getService(appointment.serviceId).price}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div style={{ borderTop: "1px solid #F5E6D3", paddingTop: 16 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>
                    Time
                  </p>
                  <p className="text-sm font-medium" style={{ color: "#292524" }}>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][appointment.day]},{" "}
                    {Math.floor(appointment.startHour)}:{appointment.startHour % 1 === 0 ? "00" : "30"} –{" "}
                    {Math.floor(appointment.startHour + appointment.duration)}:
                    {(appointment.startHour + appointment.duration) % 1 === 0 ? "00" : "30"}
                  </p>
                </div>

                {/* Contact */}
                <div style={{ borderTop: "1px solid #F5E6D3", paddingTop: 16 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>
                    Contact
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-xs" style={{ color: "#57534E" }}>{client.email}</p>
                    <p className="text-xs" style={{ color: "#57534E" }}>{client.phone}</p>
                  </div>
                </div>

                {/* Client stats */}
                <div style={{ borderTop: "1px solid #F5E6D3", paddingTop: 16 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#A8A29E" }}>
                    Client Stats
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
                      <p className="text-lg font-bold" style={{ color: "#292524" }}>{client.totalBookings}</p>
                      <p className="text-[10px]" style={{ color: "#A8A29E" }}>Total bookings</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
                      <p className="text-lg font-bold" style={{ color: "#292524" }}>${client.totalSpent.toLocaleString()}</p>
                      <p className="text-[10px]" style={{ color: "#A8A29E" }}>Total spent</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: "#C2703E", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Reschedule
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200"
                    style={{ backgroundColor: "#F5E6D340", color: "#292524", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {upcoming.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>
                      Upcoming
                    </p>
                    <div className="space-y-2">
                      {upcoming.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg"
                          style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: statusDot[a.status] }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate" style={{ color: "#292524" }}>{a.service}</p>
                            <p className="text-[10px]" style={{ color: "#A8A29E" }}>
                              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][a.day]} {Math.floor(a.startHour)}:{a.startHour % 1 === 0 ? "00" : "30"}
                            </p>
                          </div>
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0"
                            style={{
                              backgroundColor: a.status === "confirmed" ? "#D1FAE5" : "#FEF3C7",
                              color: a.status === "confirmed" ? "#065F46" : "#92400E",
                            }}
                          >
                            {a.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {past.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>
                      Past
                    </p>
                    <div className="space-y-2">
                      {past.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg"
                          style={{ backgroundColor: "#FAFAF9", border: "1px solid #F5F5F4" }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: statusDot[a.status] }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate" style={{ color: "#57534E" }}>{a.service}</p>
                            <p className="text-[10px]" style={{ color: "#A8A29E" }}>{a.duration}h • ${getService(a.serviceId).price}</p>
                          </div>
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0"
                            style={{
                              backgroundColor: a.status === "completed" ? "#E0E7FF" : "#FECDD3",
                              color: a.status === "completed" ? "#3730A3" : "#9F1239",
                            }}
                          >
                            {a.status === "completed" ? "Completed" : "Cancelled"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {upcoming.length === 0 && past.length === 0 && (
                  <p className="text-xs text-center py-8" style={{ color: "#A8A29E" }}>No appointment history</p>
                )}
              </motion.div>
            )}

            {activeTab === "notes" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {client.notes && (
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#A8A29E" }}>
                      Note
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#57534E" }}>
                      {client.notes}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#A8A29E" }}>
                    Add Note
                  </p>
                  <textarea
                    placeholder="Write a note..."
                    rows={3}
                    className="w-full rounded-xl px-3 py-2.5 text-xs resize-none focus:outline-none"
                    style={{
                      backgroundColor: "#FAFAF9",
                      border: "1px solid #F5E6D3",
                      color: "#292524",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                  <button
                    className="mt-2 w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: "#C2703E", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Save Note
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LumaClientPanel;
