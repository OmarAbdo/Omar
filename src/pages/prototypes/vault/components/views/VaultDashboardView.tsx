import React from "react";
import { motion } from "framer-motion";
import {
  accounts, totalNetWorth, recentActivity, advisorNote,
  marketIndices, type ViewId,
} from "../../vault.data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
const fmtFull = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.5 },
});

interface Props {
  onNavigate: (view: ViewId) => void;
}

const VaultDashboardView: React.FC<Props> = ({ onNavigate }) => (
  <div className="space-y-6">
    {/* Net Worth hero */}
    <motion.div {...anim(0.1)} className="rounded-2xl p-8 text-center" style={card}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] mb-3" style={{ color: "#71717A" }}>
        Total Net Worth
      </p>
      <h2
        className="text-4xl sm:text-5xl font-semibold tracking-tight"
        style={{ color: "#FAFAF9", fontFamily: "'Playfair Display', serif" }}
      >
        {fmtFull(totalNetWorth)}
      </h2>
      <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
        {accounts.map((acc) => (
          <div key={acc.id} className="text-center">
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#52524E" }}>
              {acc.name}
            </p>
            <p className="text-sm font-medium" style={{ color: "#A1A1AA" }}>{fmt(acc.balance)}</p>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Quick actions */}
    <motion.div {...anim(0.2)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Transfer", icon: "↗", view: "transfers" as ViewId },
        { label: "Invest", icon: "◈", view: "portfolio" as ViewId },
        { label: "Cards", icon: "▭", view: "cards" as ViewId },
        { label: "Advisor", icon: "◉", view: "advisor" as ViewId },
      ].map((action) => (
        <button
          key={action.label}
          onClick={() => onNavigate(action.view)}
          className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "#18181B",
            border: "1px solid rgba(201,169,110,0.08)",
          }}
        >
          <span className="text-lg block mb-1" style={{ color: "#C9A96E" }}>{action.icon}</span>
          <span className="text-xs font-medium" style={{ color: "#A1A1AA" }}>{action.label}</span>
        </button>
      ))}
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent activity */}
      <motion.div {...anim(0.3)} className="lg:col-span-2 rounded-2xl overflow-hidden" style={card}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Recent Activity</h3>
          <button
            onClick={() => onNavigate("transactions")}
            className="text-xs font-medium transition-colors"
            style={{ color: "#C9A96E" }}
          >
            View All
          </button>
        </div>
        <div>
          {recentActivity.map((tx, i) => (
            <div
              key={tx.id}
              className="px-6 py-3.5 flex items-center justify-between transition-colors hover:bg-[#ffffff03]"
              style={{ borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{
                    backgroundColor:
                      tx.type === "credit" ? "#34D39980" : tx.type === "investment" ? "#C9A96E80" : "#FB718580",
                  }}
                />
                <div>
                  <p className="text-sm" style={{ color: "#FAFAF9" }}>{tx.description}</p>
                  <p className="text-xs" style={{ color: "#52524E" }}>{tx.account} · {tx.date}</p>
                </div>
              </div>
              <span
                className="text-sm font-medium tabular-nums"
                style={{ color: tx.amount >= 0 ? "#34D399" : "#FAFAF9" }}
              >
                {tx.amount >= 0 ? "+" : ""}{fmtFull(Math.abs(tx.amount))}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Market snapshot */}
        <motion.div {...anim(0.4)} className="rounded-2xl p-5" style={card}>
          <h3 className="text-sm font-medium mb-4" style={{ color: "#FAFAF9" }}>Market Snapshot</h3>
          <div className="space-y-3">
            {marketIndices.map((idx) => (
              <div key={idx.name} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#A1A1AA" }}>{idx.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium tabular-nums" style={{ color: "#FAFAF9" }}>
                    {idx.value}
                  </span>
                  <span
                    className="text-[10px] font-medium tabular-nums"
                    style={{ color: idx.change >= 0 ? "#34D399" : "#FB7185" }}
                  >
                    {idx.change >= 0 ? "+" : ""}{idx.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Advisor note */}
        <motion.div {...anim(0.5)} className="rounded-2xl p-5" style={{ ...card, borderColor: "rgba(201,169,110,0.1)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ backgroundColor: "#C9A96E20", color: "#C9A96E" }}
            >
              SC
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "#FAFAF9" }}>{advisorNote.author}</p>
              <p className="text-[10px]" style={{ color: "#52524E" }}>{advisorNote.role}</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#A1A1AA" }}>
            "{advisorNote.text}"
          </p>
          <button
            onClick={() => onNavigate("advisor")}
            className="mt-3 text-[10px] font-semibold uppercase tracking-wider transition-colors"
            style={{ color: "#C9A96E" }}
          >
            Reply →
          </button>
        </motion.div>
      </div>
    </div>
  </div>
);

export default VaultDashboardView;
