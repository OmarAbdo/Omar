import React from "react";
import { motion } from "framer-motion";
import { accounts, totalNetWorth } from "../../vault.data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const accountIcons: Record<string, string> = {
  current: "◈",
  savings: "◇",
  investment: "△",
  "fixed-deposit": "▣",
};

const accountColors: Record<string, string> = {
  current: "#C9A96E",
  savings: "#34D399",
  investment: "#3B82F6",
  "fixed-deposit": "#A78BFA",
};

const VaultAccountsView: React.FC = () => (
  <div className="space-y-6">
    {/* Total summary */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 text-center"
      style={card}
    >
      <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "#71717A" }}>
        Total Across All Accounts
      </p>
      <p
        className="text-3xl font-semibold tabular-nums"
        style={{ color: "#FAFAF9", fontFamily: "'Playfair Display', serif" }}
      >
        {fmt(totalNetWorth)}
      </p>
    </motion.div>

    {/* Account cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {accounts.map((acc, i) => (
        <motion.div
          key={acc.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          className="rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
          style={card}
        >
          {/* Left accent */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: accountColors[acc.type] }}
          />

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className="text-lg"
                style={{ color: accountColors[acc.type] }}
              >
                {accountIcons[acc.type]}
              </span>
              <div>
                <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>{acc.name}</h3>
                <p className="text-[10px]" style={{ color: "#52524E" }}>{acc.accountNumber}</p>
              </div>
            </div>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase"
              style={{
                backgroundColor: accountColors[acc.type] + "15",
                color: accountColors[acc.type],
              }}
            >
              {acc.type.replace("-", " ")}
            </span>
          </div>

          <p
            className="text-2xl font-semibold tabular-nums mb-4"
            style={{ color: "#FAFAF9" }}
          >
            {fmt(acc.balance)}
          </p>

          {/* IBAN */}
          <div className="mb-4">
            <p className="text-[10px] mb-0.5" style={{ color: "#52524E" }}>IBAN</p>
            <p className="text-xs font-mono tabular-nums" style={{ color: "#71717A" }}>{acc.iban}</p>
          </div>

          {/* Details */}
          <div className="space-y-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {Object.entries(acc.details).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#71717A" }}>{key}</span>
                <span className="text-xs font-medium" style={{ color: "#A1A1AA" }}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default VaultAccountsView;
