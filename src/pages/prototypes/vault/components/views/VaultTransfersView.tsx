import React, { useState } from "react";
import { motion } from "framer-motion";
import { beneficiaries, recentTransfers, accounts } from "../../vault.data";

const fmtFull = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: "#34D39915", text: "#34D399" },
  pending: { bg: "#F59E0B15", text: "#F59E0B" },
  scheduled: { bg: "#3B82F615", text: "#3B82F6" },
};

const VaultTransfersView: React.FC = () => {
  const [fromAccount, setFromAccount] = useState("Current Account");
  const [toBeneficiary, setToBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const inputStyle = {
    backgroundColor: "#0C0C0E",
    color: "#FAFAF9",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6"
          style={card}
        >
          <h3 className="text-sm font-medium mb-6" style={{ color: "#FAFAF9" }}>New Transfer</h3>

          <div className="space-y-5">
            {/* From */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#71717A" }}>From</label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              >
                {accounts.filter((a) => a.type !== "fixed-deposit" && a.type !== "investment").map((a) => (
                  <option key={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* To */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#71717A" }}>To Beneficiary</label>
              <select
                value={toBeneficiary}
                onChange={(e) => setToBeneficiary(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              >
                <option value="">Select beneficiary...</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} — {b.bank}</option>
                ))}
              </select>
            </div>

            {/* Amount + currency */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs mb-1.5" style={{ color: "#71717A" }}>Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none tabular-nums"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#71717A" }}>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                >
                  <option>USD</option>
                  <option>AED</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>

            {/* Reference */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#71717A" }}>Reference (optional)</label>
              <input
                type="text"
                placeholder="Payment reference..."
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <button
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.01]"
              style={{
                backgroundColor: "#C9A96E",
                color: "#09090B",
              }}
            >
              Review Transfer
            </button>
          </div>
        </motion.div>

        {/* Saved beneficiaries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-2xl overflow-hidden"
          style={card}
        >
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Saved Beneficiaries</h3>
          </div>
          {beneficiaries.map((b, i) => (
            <div
              key={b.id}
              className="px-6 py-4 flex items-center justify-between transition-colors hover:bg-[#ffffff03]"
              style={{
                borderBottom: i < beneficiaries.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ backgroundColor: "#C9A96E15", color: "#C9A96E" }}
                >
                  {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#FAFAF9" }}>{b.name}</p>
                  <p className="text-xs" style={{ color: "#52524E" }}>{b.bank} · ****{b.accountLast4}</p>
                </div>
              </div>
              <span className="text-[10px]" style={{ color: "#52524E" }}>{b.lastTransfer}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Recent transfers */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={card}
      >
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Recent Transfers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Recipient", "Amount", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                      h === "Amount" ? "text-right" : "text-left"
                    }`}
                    style={{ color: "#71717A" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransfers.map((rt) => {
                const sc = statusColors[rt.status];
                return (
                  <tr
                    key={rt.id}
                    className="transition-colors hover:bg-[#ffffff04]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td className="px-6 py-3.5">
                      <span className="text-sm" style={{ color: "#FAFAF9" }}>{rt.to}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-medium tabular-nums" style={{ color: "#FAFAF9" }}>
                        {fmtFull(rt.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs tabular-nums" style={{ color: "#71717A" }}>{rt.date}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {rt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default VaultTransfersView;
