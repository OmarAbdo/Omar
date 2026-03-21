import React, { useState } from "react";
import { motion } from "framer-motion";
import { businessProfile, notificationSettings } from "../safi.data";

const SafiSettingsView: React.FC = () => {
  const [notifications, setNotifications] = useState(notificationSettings);

  const toggleNotif = (key: keyof typeof notificationSettings) => {
    if (typeof notifications[key] === "boolean") {
      setNotifications({ ...notifications, [key]: !notifications[key] });
    }
  };

  const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className="relative w-10 h-[22px] rounded-full transition-colors duration-200"
      style={{ backgroundColor: enabled ? "#4338CA" : "#D4D4D4" }}
    >
      <motion.div
        className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white"
        animate={{ left: enabled ? 20 : 2 }}
        transition={{ duration: 0.15 }}
      />
    </button>
  );

  return (
    <div className="p-6 overflow-y-auto max-w-3xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold" style={{ color: "#171717" }}>
          Settings
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#737373" }}>
          Manage your business profile and preferences
        </p>
      </div>

      {/* Business Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
      >
        <h3 className="text-sm font-semibold mb-5" style={{ color: "#171717" }}>
          Business Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", value: businessProfile.name },
            { label: "Title", value: businessProfile.title },
            { label: "Email", value: businessProfile.email },
            { label: "Phone", value: businessProfile.phone },
            { label: "Address", value: businessProfile.address },
            { label: "Tax ID", value: businessProfile.taxId },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.value}
                className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{
                  border: "1px solid #E5E5E5",
                  color: "#171717",
                  backgroundColor: "#FFFFFF",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4338CA40"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Defaults */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
      >
        <h3 className="text-sm font-semibold mb-5" style={{ color: "#171717" }}>
          Payment Defaults
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
              Currency
            </label>
            <select
              defaultValue={businessProfile.currency}
              className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E5E5E5", color: "#171717", backgroundColor: "#FFFFFF" }}
            >
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="AED">AED — UAE Dirham</option>
              <option value="SAR">SAR — Saudi Riyal</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#A3A3A3" }}>
              Payment Terms
            </label>
            <select
              defaultValue={businessProfile.paymentTerms}
              className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E5E5E5", color: "#171717", backgroundColor: "#FFFFFF" }}
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
        </div>

        {/* Bank details */}
        <div className="mt-5 pt-5" style={{ borderTop: "1px solid #E5E5E5" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#A3A3A3" }}>
            Bank Details (shown on invoices)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>Bank</label>
              <input
                type="text"
                defaultValue={businessProfile.bankName}
                className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E5E5E5", color: "#171717", backgroundColor: "#FFFFFF" }}
              />
            </div>
            <div>
              <label className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>IBAN</label>
              <input
                type="text"
                defaultValue={businessProfile.iban}
                className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none tabular-nums"
                style={{ border: "1px solid #E5E5E5", color: "#171717", backgroundColor: "#FFFFFF" }}
              />
            </div>
            <div>
              <label className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>BIC</label>
              <input
                type="text"
                defaultValue={businessProfile.bic}
                className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none tabular-nums"
                style={{ border: "1px solid #E5E5E5", color: "#171717", backgroundColor: "#FFFFFF" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
      >
        <h3 className="text-sm font-semibold mb-5" style={{ color: "#171717" }}>
          Notifications
        </h3>
        <div className="space-y-5">
          {[
            { key: "emailOnPayment" as const, label: "Payment received", desc: "Get notified when a client pays an invoice" },
            { key: "emailOnOverdue" as const, label: "Invoice overdue", desc: "Alert when an invoice passes its due date" },
            { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary of invoicing activity every Monday" },
            { key: "reminderBeforeDue" as const, label: "Payment reminders", desc: "Auto-send reminder before invoice due date" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#171717" }}>
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#A3A3A3" }}>
                  {item.desc}
                </p>
              </div>
              <Toggle
                enabled={notifications[item.key] as boolean}
                onToggle={() => toggleNotif(item.key)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save button */}
      <div className="flex justify-end gap-3 pb-6">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#737373", border: "1px solid #E5E5E5" }}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: "#4338CA" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SafiSettingsView;
