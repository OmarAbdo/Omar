import React from "react";
import { motion } from "framer-motion";
import KpiCard from "../../../shared/KpiCard";
import PulseDataTable from "../PulseDataTable";
import {
  acquisitionChannels,
  acquisitionReferrers,
  acquisitionCampaigns,
} from "../../pulse.data";

const acqKpis = [
  { label: "Total Traffic", value: "13,157", change: "11.4%", changeType: "positive" as const, sparkline: [80, 88, 92, 98, 105, 110, 118, 125, 128, 131] },
  { label: "Organic %", value: "38%", change: "2.1%", changeType: "positive" as const, sparkline: [32, 33, 34, 35, 36, 36, 37, 37, 38, 38] },
  { label: "Paid %", value: "10%", change: "1.2%", changeType: "negative" as const, sparkline: [14, 13, 12, 12, 11, 11, 10, 10, 10, 10] },
  { label: "Conv. Rate", value: "3.4%", change: "0.6%", changeType: "positive" as const, sparkline: [2.4, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.3, 3.4] },
];

const channelColumns = [
  { key: "channel" as const, label: "Channel", align: "left" as const },
  { key: "users" as const, label: "Users", align: "right" as const, mono: true, format: (v: number) => v.toLocaleString() },
  { key: "newUsers" as const, label: "New Users", align: "right" as const, mono: true, format: (v: number) => v.toLocaleString() },
  { key: "sessions" as const, label: "Sessions", align: "right" as const, mono: true, format: (v: number) => v.toLocaleString() },
  { key: "bounceRate" as const, label: "Bounce", align: "right" as const, mono: true, format: (v: number) => `${v}%` },
  { key: "convRate" as const, label: "Conv.", align: "right" as const, mono: true, format: (v: number) => `${v}%` },
  { key: "revenue" as const, label: "Revenue", align: "right" as const, mono: true },
];

const campaignColumns = [
  { key: "name" as const, label: "Campaign", align: "left" as const },
  { key: "source" as const, label: "Source", align: "left" as const },
  { key: "medium" as const, label: "Medium", align: "left" as const },
  { key: "users" as const, label: "Users", align: "right" as const, mono: true, format: (v: number) => v.toLocaleString() },
  { key: "conversions" as const, label: "Conv.", align: "right" as const, mono: true },
  { key: "revenue" as const, label: "Revenue", align: "right" as const, mono: true },
];

const PulseAcquisitionView: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {acqKpis.map((kpi, i) => (
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

    {/* Channels table */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4 rounded-xl p-5"
      style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Acquisition Channels</h3>
      <PulseDataTable
        columns={channelColumns}
        data={acquisitionChannels}
        defaultSortKey="users"
        defaultSortDir="desc"
        pageSize={10}
      />
    </motion.div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
      {/* Top referrers */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Top Referrers</h3>
        <div className="space-y-3">
          {acquisitionReferrers.map((r) => (
            <div key={r.domain}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono" style={{ color: "#94A3B8" }}>{r.domain}</span>
                <span className="text-xs font-mono font-medium" style={{ color: "#F1F5F9" }}>{r.sessions.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.pct}%`, backgroundColor: "#3B82F6" }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Campaign Performance</h3>
        <PulseDataTable
          columns={campaignColumns}
          data={acquisitionCampaigns}
          defaultSortKey="users"
          defaultSortDir="desc"
          pageSize={6}
        />
      </motion.div>
    </div>
  </div>
);

export default PulseAcquisitionView;
