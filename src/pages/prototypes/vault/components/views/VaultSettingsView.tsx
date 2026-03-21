import React, { useState } from "react";
import { motion } from "framer-motion";
import { settingsData } from "../../vault.data";

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const Toggle: React.FC<{ label: string; defaultOn?: boolean }> = ({ label, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm" style={{ color: "#A1A1AA" }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        className="w-10 h-5 rounded-full relative transition-colors duration-200"
        style={{ backgroundColor: on ? "#C9A96E" : "rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-200"
          style={{
            backgroundColor: on ? "#09090B" : "#71717A",
            left: on ? 22 : 2,
          }}
        />
      </button>
    </div>
  );
};

const VaultSettingsView: React.FC = () => (
  <div className="max-w-2xl space-y-6">
    {/* Profile */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6"
      style={card}
    >
      <h3 className="text-sm font-medium mb-5" style={{ color: "#FAFAF9" }}>Profile</h3>
      <div className="space-y-4">
        {Object.entries(settingsData.profile).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs capitalize" style={{ color: "#71717A" }}>
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="text-sm" style={{ color: "#FAFAF9" }}>{value}</span>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Security */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="rounded-2xl p-6"
      style={card}
    >
      <h3 className="text-sm font-medium mb-5" style={{ color: "#FAFAF9" }}>Security</h3>
      <div className="space-y-4">
        <Toggle label="Two-Factor Authentication" defaultOn />
        <Toggle label="Biometric Login" defaultOn />
        <div className="flex items-center justify-between py-2">
          <span className="text-sm" style={{ color: "#A1A1AA" }}>Change Password</span>
          <button
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#A1A1AA" }}
          >
            Update
          </button>
        </div>
      </div>
    </motion.div>

    {/* Notifications */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl p-6"
      style={card}
    >
      <h3 className="text-sm font-medium mb-5" style={{ color: "#FAFAF9" }}>Notifications</h3>
      <div className="space-y-1">
        <Toggle label="Transaction Alerts" defaultOn />
        <Toggle label="Market Alerts" defaultOn />
        <Toggle label="Advisor Messages" defaultOn />
        <Toggle label="Weekly Digest" />
        <Toggle label="Promotional Offers" />
      </div>
    </motion.div>

    {/* Team */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={card}
    >
      <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Your Banking Team</h3>
      </div>
      {settingsData.team.map((member, i) => (
        <div
          key={member.id}
          className="px-6 py-3.5 flex items-center gap-3 transition-colors hover:bg-[#ffffff03]"
          style={{
            borderBottom: i < settingsData.team.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
            style={{ backgroundColor: "#C9A96E15", color: "#C9A96E" }}
          >
            {member.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm" style={{ color: "#FAFAF9" }}>{member.name}</p>
            <p className="text-xs truncate" style={{ color: "#52524E" }}>{member.email}</p>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#71717A" }}
          >
            {member.role}
          </span>
        </div>
      ))}
    </motion.div>

    {/* Preferences */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-2xl p-6"
      style={card}
    >
      <h3 className="text-sm font-medium mb-5" style={{ color: "#FAFAF9" }}>Preferences</h3>
      <div className="space-y-4">
        {[
          { label: "Display Currency", value: "USD" },
          { label: "Language", value: "English" },
          { label: "Statement Frequency", value: "Monthly" },
          { label: "Timezone", value: "GST (UTC+4)" },
        ].map((pref) => (
          <div key={pref.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#71717A" }}>{pref.label}</span>
            <span className="text-sm" style={{ color: "#FAFAF9" }}>{pref.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default VaultSettingsView;
