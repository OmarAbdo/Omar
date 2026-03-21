import React from "react";
import { motion } from "framer-motion";
import MockChart from "../../../shared/MockChart";
import Sparkline from "../../../shared/Sparkline";
import VaultDonutChart from "../VaultDonutChart";
import {
  portfolioValue, portfolioChange, portfolioDayChange,
  performanceData, benchmarkData, holdings, allocationGroups, riskMetrics,
} from "../../vault.data";

const fmt = (n: number) =>
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
  showBenchmark: boolean;
  onToggleBenchmark: () => void;
  performancePeriod: string;
  onSetPeriod: (p: string) => void;
}

const VaultPortfolioView: React.FC<Props> = ({
  showBenchmark, onToggleBenchmark, performancePeriod, onSetPeriod,
}) => {
  const assetClasses = ["Equities", "Fixed Income", "Alternatives"] as const;

  return (
    <div className="space-y-6">
      {/* Portfolio header */}
      <motion.div {...anim(0.1)} className="rounded-2xl p-8 text-center" style={card}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] mb-3" style={{ color: "#71717A" }}>
          Portfolio Value
        </p>
        <h2
          className="text-4xl sm:text-5xl font-semibold tracking-tight"
          style={{ color: "#FAFAF9", fontFamily: "'Playfair Display', serif" }}
        >
          {fmt(portfolioValue)}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="text-sm font-medium" style={{ color: portfolioChange >= 0 ? "#34D39980" : "#FB718580" }}>
            {portfolioChange >= 0 ? "+" : ""}{portfolioChange}%
          </span>
          <span className="text-xs" style={{ color: "#71717A" }}>·</span>
          <span className="text-sm" style={{ color: portfolioDayChange >= 0 ? "#34D39980" : "#FB718580" }}>
            {portfolioDayChange >= 0 ? "+" : ""}{fmt(portfolioDayChange)} today
          </span>
        </div>
      </motion.div>

      {/* Performance chart */}
      <motion.div {...anim(0.2)} className="rounded-2xl p-6" style={card}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Performance</h3>
            <button
              onClick={onToggleBenchmark}
              className="text-[10px] font-medium px-2 py-1 rounded-md transition-colors"
              style={{
                backgroundColor: showBenchmark ? "#C9A96E20" : "transparent",
                color: showBenchmark ? "#C9A96E" : "#71717A",
                border: showBenchmark ? "1px solid #C9A96E25" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              vs S&P 500
            </button>
          </div>
          <div className="flex gap-1">
            {["1M", "3M", "6M", "1Y", "All"].map((label) => (
              <button
                key={label}
                onClick={() => onSetPeriod(label)}
                className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: performancePeriod === label ? "#C9A96E20" : "transparent",
                  color: performancePeriod === label ? "#C9A96E" : "#71717A",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-56 relative">
          <MockChart
            data={performanceData}
            type="area"
            color="#C9A96E"
            secondaryColor="#B8924A"
            gridColor="rgba(255,255,255,0.03)"
            showGrid
          />
          {showBenchmark && (
            <div className="absolute inset-0">
              <MockChart
                data={benchmarkData}
                type="line"
                color="#71717A"
                gridColor="transparent"
                showGrid={false}
              />
            </div>
          )}
        </div>
        {showBenchmark && (
          <div className="mt-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: "#C9A96E" }} />
              <span className="text-[10px]" style={{ color: "#71717A" }}>Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: "#71717A" }} />
              <span className="text-[10px]" style={{ color: "#71717A" }}>S&P 500</span>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings table */}
        <motion.div {...anim(0.3)} className="lg:col-span-2 rounded-2xl overflow-hidden" style={card}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            {assetClasses.map((assetClass) => {
              const items = holdings.filter((h) => h.assetClass === assetClass);
              if (items.length === 0) return null;
              return (
                <React.Fragment key={assetClass}>
                  <div className="px-6 py-2" style={{ backgroundColor: "#ffffff03" }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#52524E" }}>
                      {assetClass}
                    </span>
                  </div>
                  <table className="w-full">
                    <tbody>
                      {items.map((h) => {
                        const value = h.shares * h.currentPrice;
                        return (
                          <tr
                            key={h.id}
                            className="transition-colors hover:bg-[#ffffff04]"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                          >
                            <td className="px-6 py-3.5">
                              <p className="text-sm font-medium" style={{ color: "#FAFAF9" }}>{h.name}</p>
                              <p className="text-xs" style={{ color: "#71717A" }}>{h.ticker}</p>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-sm tabular-nums" style={{ color: "#FAFAF9" }}>{fmt(h.currentPrice)}</span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-sm font-medium tabular-nums" style={{ color: h.change24h >= 0 ? "#34D39980" : "#FB718580" }}>
                                {h.change24h >= 0 ? "+" : ""}{h.change24h}%
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                              <span className="text-sm tabular-nums" style={{ color: "#A1A1AA" }}>{h.shares}</span>
                            </td>
                            <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                              <span className="text-sm font-medium tabular-nums" style={{ color: "#FAFAF9" }}>{fmt(value)}</span>
                            </td>
                            <td className="px-4 py-3.5 text-right hidden md:table-cell">
                              <span
                                className="text-xs font-medium tabular-nums"
                                style={{ color: h.unrealizedPL >= 0 ? "#34D399" : "#FB7185" }}
                              >
                                {h.unrealizedPL >= 0 ? "+" : ""}{fmt(h.unrealizedPL)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                              <Sparkline
                                data={h.sparkline}
                                color={h.change24h >= 0 ? "#C9A96E" : "#FB7185"}
                                width={64}
                                height={24}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* Right column: allocation + risk */}
        <div className="space-y-6">
          {/* Allocation donut */}
          <motion.div {...anim(0.4)} className="rounded-2xl p-6" style={card}>
            <h3 className="text-sm font-medium mb-5" style={{ color: "#FAFAF9" }}>Allocation</h3>
            <div className="flex justify-center mb-5">
              <VaultDonutChart
                segments={allocationGroups}
                centerValue="100%"
                centerLabel="Allocated"
              />
            </div>
            <div className="space-y-2.5">
              {allocationGroups.map((g) => (
                <div key={g.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="text-xs" style={{ color: "#A1A1AA" }}>{g.label}</span>
                  </div>
                  <span className="text-xs font-medium tabular-nums" style={{ color: "#FAFAF9" }}>{g.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risk metrics */}
          <motion.div {...anim(0.5)} className="rounded-2xl p-6" style={card}>
            <h3 className="text-sm font-medium mb-4" style={{ color: "#FAFAF9" }}>Risk Profile</h3>

            {/* Risk gauge */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "#71717A" }}>Risk Level</span>
                <span className="text-xs font-medium" style={{ color: "#C9A96E" }}>{riskMetrics.riskScore}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #34D399, #C9A96E, #FB7185)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${riskMetrics.riskLevel}%` }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {[
                { label: "Sharpe Ratio", value: riskMetrics.sharpeRatio.toFixed(2) },
                { label: "Beta", value: riskMetrics.beta.toFixed(2) },
                { label: "Volatility", value: `${riskMetrics.volatility}%` },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#71717A" }}>{m.label}</span>
                  <span className="text-xs font-medium tabular-nums" style={{ color: "#FAFAF9" }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Currency exposure */}
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-xs mb-3" style={{ color: "#71717A" }}>Currency Exposure</p>
              <div className="space-y-2">
                {riskMetrics.currencyExposure.map((c) => (
                  <div key={c.currency} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-8" style={{ color: "#A1A1AA" }}>{c.currency}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: "#C9A96E" }} />
                    </div>
                    <span className="text-xs tabular-nums w-8 text-right" style={{ color: "#FAFAF9" }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VaultPortfolioView;
