import React, { useState } from "react";
import { motion } from "framer-motion";
import { teamMembers } from "../../pulse.data";

const PulseSettingsView: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [trafficAlerts, setTrafficAlerts] = useState(false);

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
      style={{ backgroundColor: on ? "#3B82F6" : "rgba(255,255,255,0.1)" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(18px)" : "translateX(3px)" }}
      />
    </button>
  );

  return (
    <div className="max-w-3xl">
      {/* General */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-6" style={{ color: "#F1F5F9" }}>General</h3>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium" style={{ color: "#64748B" }}>Site Name</label>
            <input
              type="text"
              value="pulse-analytics.io"
              readOnly
              className="mt-1.5 w-full px-3 py-2 rounded-lg text-sm font-mono cursor-not-allowed"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#94A3B8",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium" style={{ color: "#64748B" }}>Timezone</label>
              <select
                className="mt-1.5 w-full px-3 py-2 rounded-lg text-sm appearance-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#F1F5F9",
                }}
                defaultValue="Europe/Berlin"
              >
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "#64748B" }}>Data Retention</label>
              <select
                className="mt-1.5 w-full px-3 py-2 rounded-lg text-sm appearance-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#F1F5F9",
                }}
                defaultValue="14"
              >
                <option value="14">14 months</option>
                <option value="26">26 months</option>
                <option value="38">38 months</option>
                <option value="50">50 months</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 rounded-xl p-6"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-6" style={{ color: "#F1F5F9" }}>Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "Email Alerts", desc: "Receive alerts for anomalies", on: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
            { label: "Weekly Digest", desc: "Summary every Monday 9:00 AM", on: weeklyDigest, toggle: () => setWeeklyDigest(!weeklyDigest) },
            { label: "Traffic Spike Alerts", desc: "Notify when traffic exceeds 2x baseline", on: trafficAlerts, toggle: () => setTrafficAlerts(!trafficAlerts) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
              <Toggle on={item.on} onToggle={item.toggle} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 rounded-xl p-6"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Team</h3>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            Invite Member
          </button>
        </div>
        <div className="space-y-0">
          {teamMembers.map((member, i) => (
            <div
              key={member.email}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < teamMembers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#3B82F620", color: "#3B82F6" }}
                >
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{member.name}</p>
                  <p className="text-xs" style={{ color: "#64748B" }}>{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: "#64748B" }}>{member.role}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: member.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(251,191,36,0.1)",
                    color: member.status === "active" ? "#10B981" : "#F59E0B",
                    border: `1px solid ${member.status === "active" ? "rgba(16,185,129,0.2)" : "rgba(251,191,36,0.2)"}`,
                  }}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 rounded-xl p-6"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(248,113,113,0.2)" }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: "#F43F5E" }}>Danger Zone</h3>
        <p className="text-xs mb-4" style={{ color: "#64748B" }}>
          Once you delete a property, all data will be permanently removed. This action cannot be undone.
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: "rgba(244,63,94,0.1)", color: "#F43F5E", border: "1px solid rgba(244,63,94,0.2)" }}
        >
          Delete Property
        </button>
      </motion.div>
    </div>
  );
};

export default PulseSettingsView;
