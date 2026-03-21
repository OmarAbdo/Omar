import React from "react";
import { motion } from "framer-motion";
import KpiCard from "../../../shared/KpiCard";
import PulseDataTable from "../PulseDataTable";
import PulseDonutChart from "../charts/PulseDonutChart";
import PulseHeatmapRow from "../charts/PulseHeatmapRow";
import {
  audienceByCountry,
  audienceByDevice,
  audienceByBrowser,
  audienceNewVsReturning,
  hourlyActivity,
} from "../../pulse.data";

const audienceKpis = [
  { label: "Total Users", value: "12,847", change: "8.2%", changeType: "positive" as const, sparkline: [80, 85, 90, 88, 95, 100, 105, 110, 108] },
  { label: "New Users", value: "7,421", change: "14.1%", changeType: "positive" as const, sparkline: [40, 45, 48, 52, 55, 60, 62, 68, 74] },
  { label: "Sessions", value: "24,832", change: "6.8%", changeType: "positive" as const, sparkline: [180, 190, 200, 195, 210, 220, 230, 240, 248] },
  { label: "Avg. Duration", value: "3:12", change: "0.4%", changeType: "negative" as const, sparkline: [3.5, 3.4, 3.3, 3.35, 3.3, 3.25, 3.2, 3.18, 3.12] },
];

const countryColumns = [
  { key: "flag" as const, label: "", align: "left" as const, format: (v: string) => v },
  { key: "country" as const, label: "Country", align: "left" as const },
  { key: "users" as const, label: "Users", align: "right" as const, mono: true, format: (v: number) => v.toLocaleString() },
  { key: "sessions" as const, label: "Sessions", align: "right" as const, mono: true, format: (v: number) => v.toLocaleString() },
  { key: "bounceRate" as const, label: "Bounce Rate", align: "right" as const, mono: true, format: (v: number) => `${v}%` },
  { key: "avgDuration" as const, label: "Avg. Duration", align: "right" as const, mono: true },
];

const PulseAudienceView: React.FC = () => (
  <div>
    {/* KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {audienceKpis.map((kpi, i) => (
        <KpiCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          changeType={kpi.changeType}
          sparklineData={kpi.sparkline}
          bgColor="#111827"
          borderColor="rgba(255,255,255,0.06)"
          textColor="#F1F5F9"
          mutedColor="#64748B"
          accentColor={kpi.changeType === "negative" ? "#F43F5E" : "#3B82F6"}
          delay={i * 0.08}
        />
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
      {/* Country table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="xl:col-span-2 rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Users by Country</h3>
        <PulseDataTable
          columns={countryColumns}
          data={audienceByCountry}
          pageSize={7}
          defaultSortKey="users"
          defaultSortDir="desc"
        />
      </motion.div>

      {/* Device + Browser donuts */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Device Breakdown</h3>
          <PulseDonutChart
            segments={audienceByDevice.map((d, i) => ({
              label: d.device,
              value: d.pct,
              color: ["#3B82F6", "#06B6D4", "#8B5CF6"][i],
            }))}
            centerLabel="56%"
            centerSub="Desktop"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>New vs Returning</h3>
          <PulseDonutChart
            segments={[
              { label: "New", value: audienceNewVsReturning.new, color: "#3B82F6" },
              { label: "Returning", value: audienceNewVsReturning.returning, color: "#64748B" },
            ]}
            centerLabel={`${audienceNewVsReturning.new}%`}
            centerSub="New Users"
          />
        </motion.div>
      </div>

      {/* Browser share */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Browser Share</h3>
        <div className="space-y-3">
          {audienceByBrowser.map((b) => (
            <div key={b.browser}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "#94A3B8" }}>{b.browser}</span>
                <span className="text-xs font-mono font-medium" style={{ color: "#F1F5F9" }}>{b.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hourly heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="xl:col-span-2 rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Activity by Hour</h3>
        <PulseHeatmapRow data={hourlyActivity} />
      </motion.div>
    </div>
  </div>
);

export default PulseAudienceView;
