import React from "react";
import { motion } from "framer-motion";
import PulseKpiBar from "../PulseKpiBar";
import MockChart from "../../../shared/MockChart";
import { revenueData, revenuePreviousData, sessionsData, channelData, topPages } from "../../pulse.data";
import type { PulseState } from "../../hooks/usePulseState";

interface Props {
  state: PulseState;
}

const PulseOverviewView: React.FC<Props> = ({ state }) => (
  <div>
    <PulseKpiBar compareMode={state.compareMode} />

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="xl:col-span-2 rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Revenue</h3>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
              {state.dateRange.start} — {state.dateRange.end}
            </p>
          </div>
          <div className="flex gap-2">
            {(["hourly", "daily", "weekly"] as const).map((g) => (
              <button
                key={g}
                onClick={() => state.setGranularity(g)}
                className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: state.granularity === g ? "rgba(59,130,246,0.15)" : "transparent",
                  color: state.granularity === g ? "#3B82F6" : "#64748B",
                }}
              >
                {g[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48 relative">
          {state.compareMode && (
            <div className="absolute inset-0 opacity-40">
              <MockChart
                data={revenuePreviousData}
                type="line"
                color="#64748B"
                gridColor="transparent"
                showGrid={false}
              />
            </div>
          )}
          <MockChart
            data={revenueData}
            type="area"
            color="#3B82F6"
            secondaryColor="#06B6D4"
            gridColor="rgba(255,255,255,0.04)"
          />
        </div>
        {state.compareMode && (
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#64748B" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: "#3B82F6" }} />
              Current period
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: "#64748B" }} />
              Previous period
            </span>
          </div>
        )}
      </motion.div>

      {/* Channel breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Traffic Sources</h3>
        <div className="space-y-3">
          {channelData.map((ch) => (
            <div key={ch.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "#94A3B8" }}>{ch.label}</span>
                <span className="text-xs font-mono font-medium" style={{ color: "#F1F5F9" }}>{ch.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${ch.pct}%`, backgroundColor: "#3B82F6" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sessions chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>Sessions</h3>
        <p className="text-xs mb-4" style={{ color: "#64748B" }}>Daily active sessions</p>
        <div className="h-36">
          <MockChart
            data={sessionsData}
            type="bar"
            color="#06B6D4"
            gridColor="rgba(255,255,255,0.04)"
          />
        </div>
      </motion.div>

      {/* Top pages */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="xl:col-span-2 rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Top Pages</h3>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th className="text-left text-xs font-medium pb-2" style={{ color: "#64748B" }}>Page</th>
              <th className="text-right text-xs font-medium pb-2" style={{ color: "#64748B" }}>Views</th>
              <th className="text-right text-xs font-medium pb-2" style={{ color: "#64748B" }}>Bounce</th>
              <th className="text-right text-xs font-medium pb-2" style={{ color: "#64748B" }}>Change</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((page, i) => (
              <tr
                key={page.path}
                className="transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: i < topPages.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
              >
                <td className="py-2.5 text-sm font-mono" style={{ color: "#94A3B8" }}>{page.path}</td>
                <td className="py-2.5 text-sm font-mono font-medium text-right" style={{ color: "#F1F5F9" }}>
                  {page.views.toLocaleString()}
                </td>
                <td className="py-2.5 text-sm font-mono text-right" style={{ color: "#64748B" }}>
                  {page.bounceRate}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className="text-xs font-medium"
                    style={{ color: page.change.startsWith("+") ? "#10B981" : "#F43F5E" }}
                  >
                    {page.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  </div>
);

export default PulseOverviewView;
