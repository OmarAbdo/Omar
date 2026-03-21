import React from "react";
import { motion } from "framer-motion";
import MockChart from "../../shared/MockChart";
import { revenueData, sessionsData, channelData, topPages } from "../pulse.data";

const PulseChartPanel: React.FC = () => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
    {/* Revenue chart — large */}
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
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Last 22 days</p>
        </div>
        <div className="flex gap-2">
          {["7D", "14D", "30D"].map((label, i) => (
            <button
              key={label}
              className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: i === 2 ? "rgba(59,130,246,0.15)" : "transparent",
                color: i === 2 ? "#3B82F6" : "#64748B",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-48">
        <MockChart
          data={revenueData}
          type="area"
          color="#3B82F6"
          secondaryColor="#06B6D4"
          gridColor="rgba(255,255,255,0.04)"
        />
      </div>
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
      <div className="space-y-0">
        {topPages.map((page, i) => (
          <div
            key={page.path}
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: i < topPages.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
          >
            <span className="text-sm font-mono" style={{ color: "#94A3B8" }}>{page.path}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono font-medium" style={{ color: "#F1F5F9" }}>
                {page.views.toLocaleString()}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: page.change.startsWith("+") ? "#10B981" : "#F43F5E" }}
              >
                {page.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default PulseChartPanel;
