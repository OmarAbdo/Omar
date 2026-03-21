import React from "react";
import { motion } from "framer-motion";
import { insights, marketIndices } from "../../vault.data";

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const categoryColors: Record<string, string> = {
  Equities: "#3B82F6",
  Commodities: "#F59E0B",
  "Fixed Income": "#A78BFA",
  Macro: "#34D399",
};

const VaultInsightsView: React.FC = () => (
  <div className="space-y-6">
    {/* Research notes */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#52524E" }}>
        Latest Research
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((insight, i) => {
          const catColor = categoryColors[insight.category] || "#C9A96E";
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="rounded-2xl p-6 group transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              style={card}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: catColor + "15", color: catColor }}
                >
                  {insight.category}
                </span>
                <span className="text-[10px]" style={{ color: "#52524E" }}>{insight.date}</span>
              </div>
              <h4
                className="text-base font-semibold mb-2 group-hover:text-[#C9A96E] transition-colors duration-300"
                style={{ color: "#FAFAF9" }}
              >
                {insight.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "#A1A1AA" }}>
                {insight.summary}
              </p>
              <button
                className="mt-4 text-[10px] font-semibold uppercase tracking-wider transition-colors"
                style={{ color: "#C9A96E" }}
              >
                Read Full Report →
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>

    {/* Market data table */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={card}
    >
      <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Market Overview</h3>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {["Index", "Value", "Change"].map((h) => (
              <th
                key={h}
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                  h !== "Index" ? "text-right" : "text-left"
                }`}
                style={{ color: "#71717A" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ...marketIndices,
            { name: "DFM General", value: "4,128.50", change: 0.34 },
            { name: "ADX General", value: "9,821.30", change: -0.18 },
            { name: "Brent Crude", value: "$82.45", change: 1.56 },
            { name: "EUR/USD", value: "1.0842", change: -0.08 },
          ].map((idx, i) => (
            <tr
              key={idx.name}
              className="transition-colors hover:bg-[#ffffff04]"
              style={{
                borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.03)" : "none",
              }}
            >
              <td className="px-6 py-3">
                <span className="text-sm" style={{ color: "#FAFAF9" }}>{idx.name}</span>
              </td>
              <td className="px-6 py-3 text-right">
                <span className="text-sm tabular-nums" style={{ color: "#FAFAF9" }}>{idx.value}</span>
              </td>
              <td className="px-6 py-3 text-right">
                <span
                  className="text-xs font-medium tabular-nums"
                  style={{ color: idx.change >= 0 ? "#34D399" : "#FB7185" }}
                >
                  {idx.change >= 0 ? "+" : ""}{idx.change}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

export default VaultInsightsView;
