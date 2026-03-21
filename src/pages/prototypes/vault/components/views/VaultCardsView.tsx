import React from "react";
import { motion } from "framer-motion";
import { cardData } from "../../vault.data";

const fmtFull = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const VaultCardsView: React.FC = () => {
  const spendPct = (cardData.monthlySpend / cardData.monthlyLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card visual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div
            className="w-full max-w-[420px] aspect-[1.586/1] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, #1A1A1D 0%, #0C0C0E 50%, #18181B 100%)",
              border: "1px solid rgba(201,169,110,0.15)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
          >
            {/* Decorative pattern */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.03]"
              style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-[0.02]"
              style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
            />

            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "#C9A96E" }}
                >
                  Vault
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "#71717A" }}>Private Banking</p>
              </div>
              <p
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "#C9A96E80" }}
              >
                {cardData.type}
              </p>
            </div>

            {/* Card number */}
            <div className="relative z-10">
              <p
                className="text-xl font-light tracking-[0.15em] tabular-nums"
                style={{ color: "#FAFAF9", letterSpacing: "0.2em" }}
              >
                {cardData.cardNumber}
              </p>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-[9px] uppercase mb-0.5" style={{ color: "#52524E" }}>Card Holder</p>
                <p className="text-xs font-medium tracking-wider" style={{ color: "#FAFAF9" }}>
                  {cardData.cardHolder}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase mb-0.5" style={{ color: "#52524E" }}>Expires</p>
                <p className="text-xs font-medium tabular-nums" style={{ color: "#FAFAF9" }}>
                  {cardData.expiry}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-5"
        >
          {/* Status */}
          <div className="rounded-xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Card Status</h3>
              <span
                className="text-[10px] font-medium px-2.5 py-1 rounded-full capitalize"
                style={{ backgroundColor: "#34D39915", color: "#34D399", border: "1px solid #34D39925" }}
              >
                {cardData.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#71717A" }}>Daily Limit</span>
                <span className="text-xs font-medium tabular-nums" style={{ color: "#FAFAF9" }}>
                  {fmtFull(cardData.dailyLimit)}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: "#71717A" }}>Monthly Spend</span>
                  <span className="text-xs tabular-nums" style={{ color: "#A1A1AA" }}>
                    {fmtFull(cardData.monthlySpend)} / {fmtFull(cardData.monthlyLimit)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#C9A96E" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${spendPct}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            {["Freeze Card", "Change PIN", "Replace"].map((action) => (
              <button
                key={action}
                className="rounded-xl py-3 text-center text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: "#18181B",
                  color: "#A1A1AA",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent card transactions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={card}
      >
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Recent Card Transactions</h3>
        </div>
        {cardData.recentTransactions.map((tx, i) => (
          <div
            key={i}
            className="px-6 py-3.5 flex items-center justify-between transition-colors hover:bg-[#ffffff03]"
            style={{
              borderBottom: i < cardData.recentTransactions.length - 1
                ? "1px solid rgba(255,255,255,0.03)"
                : "none",
            }}
          >
            <div>
              <p className="text-sm" style={{ color: "#FAFAF9" }}>{tx.description}</p>
              <p className="text-xs" style={{ color: "#52524E" }}>{tx.date}</p>
            </div>
            <span className="text-sm font-medium tabular-nums" style={{ color: "#FAFAF9" }}>
              {fmtFull(Math.abs(tx.amount))}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VaultCardsView;
