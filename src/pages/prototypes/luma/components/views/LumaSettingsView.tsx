import React from "react";
import { motion } from "framer-motion";
import { businessHours } from "../../luma.data";

const teamMembers = [
  { name: "Omar Abdo", email: "omar@luma.app", role: "Owner", status: "active" },
  { name: "Sarah Al-Maktoum", email: "sarah@luma.app", role: "Admin", status: "active" },
  { name: "David Reiter", email: "david@luma.app", role: "Staff", status: "invited" },
];

const LumaSettingsView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 max-w-3xl">
      <div className="space-y-8">
        {/* General */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>General</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#A8A29E" }}>
                Business Name
              </label>
              <input
                type="text"
                disabled
                value="Luma Professional Services"
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ backgroundColor: "#FAFAF9", border: "1px solid #F5E6D3", color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#A8A29E" }}>
                  Timezone
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl text-sm appearance-none"
                  style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3", color: "#292524", fontFamily: "'DM Sans', sans-serif" }}
                  defaultValue="gst"
                >
                  <option value="gst">GST (UTC+4) — Dubai</option>
                  <option value="cet">CET (UTC+1) — Berlin</option>
                  <option value="est">EST (UTC-5) — New York</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#A8A29E" }}>
                  Buffer Between Sessions
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl text-sm appearance-none"
                  style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3", color: "#292524", fontFamily: "'DM Sans', sans-serif" }}
                  defaultValue="15"
                >
                  <option value="0">No buffer</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Business hours */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Business Hours</h3>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #F5E6D3" }}>
            {businessHours.map((bh, i) => (
              <div
                key={bh.day}
                className="flex items-center px-4 py-3 gap-4"
                style={{
                  borderBottom: i < businessHours.length - 1 ? "1px solid #F5E6D320" : "none",
                  backgroundColor: bh.enabled ? "transparent" : "#FAFAF9",
                }}
              >
                <div className="w-24">
                  <span
                    className="text-sm font-medium"
                    style={{ color: bh.enabled ? "#292524" : "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {bh.day}
                  </span>
                </div>
                {/* Toggle */}
                <button
                  className="w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0"
                  style={{ backgroundColor: bh.enabled ? "#C2703E" : "#E7E5E4" }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all duration-200"
                    style={{ left: bh.enabled ? 20 : 3 }}
                  />
                </button>
                {bh.enabled ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: "#FFF7ED", color: "#292524", border: "1px solid #F5E6D3" }}>
                      {bh.open}
                    </span>
                    <span className="text-[10px]" style={{ color: "#A8A29E" }}>to</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: "#FFF7ED", color: "#292524", border: "1px solid #F5E6D3" }}>
                      {bh.close}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs" style={{ color: "#A8A29E" }}>Closed</span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Notifications</h3>
          <div className="space-y-3">
            {[
              { label: "Email confirmations", desc: "Send email when a booking is confirmed", on: true },
              { label: "SMS reminders", desc: "Send SMS 1 hour before appointment", on: true },
              { label: "Cancellation alerts", desc: "Get notified when a client cancels", on: true },
              { label: "Weekly digest", desc: "Summary of the week's bookings every Monday", on: false },
            ].map((n) => (
              <div
                key={n.label}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>{n.label}</p>
                  <p className="text-[11px]" style={{ color: "#A8A29E" }}>{n.desc}</p>
                </div>
                <button
                  className="w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0"
                  style={{ backgroundColor: n.on ? "#C2703E" : "#E7E5E4" }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all duration-200"
                    style={{ left: n.on ? 20 : 3 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Team</h3>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #F5E6D3" }}>
            {teamMembers.map((m, i) => (
              <div
                key={m.email}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < teamMembers.length - 1 ? "1px solid #F5E6D320" : "none" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: "#C2703E15", color: "#C2703E" }}
                >
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#292524" }}>{m.name}</p>
                  <p className="text-[11px] truncate" style={{ color: "#A8A29E" }}>{m.email}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ color: "#78716C", backgroundColor: "#F5F5F4" }}>
                  {m.role}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{
                    backgroundColor: m.status === "active" ? "#D1FAE5" : "#FEF3C7",
                    color: m.status === "active" ? "#065F46" : "#92400E",
                  }}
                >
                  {m.status === "active" ? "Active" : "Invited"}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Danger zone */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pb-8">
          <h3 className="text-sm font-bold mb-4" style={{ color: "#DC2626", fontFamily: "'DM Sans', sans-serif" }}>Danger Zone</h3>
          <div className="rounded-xl px-4 py-4" style={{ border: "1px solid #FECDD3" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Delete Workspace</p>
                <p className="text-[11px]" style={{ color: "#A8A29E" }}>Permanently delete all data and bookings</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200"
                style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "1px solid #FECDD3", fontFamily: "'DM Sans', sans-serif" }}
              >
                Delete
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LumaSettingsView;
