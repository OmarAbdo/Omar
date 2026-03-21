import React from "react";
import { motion } from "framer-motion";
import KpiCard from "../../../shared/KpiCard";
import Sparkline from "../../../shared/Sparkline";
import MockChart from "../../../shared/MockChart";
import { eventTypes, eventTimelineData } from "../../pulse.data";

const eventsKpis = [
  { label: "Total Events", value: "79,529", change: "15.3%", changeType: "positive" as const, sparkline: [52, 55, 58, 60, 64, 66, 70, 72, 76, 79] },
  { label: "Unique Events", value: "8", change: "", changeType: "positive" as const, sparkline: [] },
  { label: "Events / Session", value: "3.2", change: "0.3", changeType: "positive" as const, sparkline: [2.6, 2.7, 2.8, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2, 3.2] },
  { label: "Top Event", value: "page_view", change: "48,210", changeType: "positive" as const, sparkline: [] },
];

const eventColors: Record<string, string> = {
  page_view: "#3B82F6",
  button_click: "#06B6D4",
  form_submit: "#10B981",
  purchase: "#F59E0B",
  scroll_depth_75: "#8B5CF6",
  video_play: "#EC4899",
  file_download: "#14B8A6",
  error: "#F43F5E",
};

const PulseEventsView: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {eventsKpis.map((kpi, i) => (
        <KpiCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change || undefined}
          changeType={kpi.changeType}
          sparklineData={kpi.sparkline.length > 0 ? kpi.sparkline : undefined}
          bgColor="#111827"
          borderColor="rgba(255,255,255,0.06)"
          textColor="#F1F5F9"
          mutedColor="#64748B"
          accentColor="#3B82F6"
          delay={i * 0.08}
        />
      ))}
    </div>

    {/* Event timeline */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4 rounded-xl p-5"
      style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>Event Volume</h3>
      <p className="text-xs mb-4" style={{ color: "#64748B" }}>Total events over time</p>
      <div className="h-44">
        <MockChart
          data={eventTimelineData}
          type="area"
          color="#8B5CF6"
          secondaryColor="#8B5CF6"
          gridColor="rgba(255,255,255,0.04)"
        />
      </div>
    </motion.div>

    {/* Event types table */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-4 rounded-xl p-5"
      style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Event Types</h3>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <th className="text-left text-xs font-medium pb-2" style={{ color: "#64748B" }}>Event</th>
            <th className="text-right text-xs font-medium pb-2" style={{ color: "#64748B" }}>Total Count</th>
            <th className="text-right text-xs font-medium pb-2" style={{ color: "#64748B" }}>Users</th>
            <th className="text-right text-xs font-medium pb-2 w-24" style={{ color: "#64748B" }}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {eventTypes.map((event, i) => (
            <tr
              key={event.name}
              className="transition-colors hover:bg-white/[0.02]"
              style={{ borderBottom: i < eventTypes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
            >
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: eventColors[event.name] || "#64748B" }} />
                  <span className="text-sm font-mono" style={{ color: "#F1F5F9" }}>{event.name}</span>
                </div>
              </td>
              <td className="py-3 text-sm font-mono text-right" style={{ color: "#F1F5F9" }}>
                {event.count.toLocaleString()}
              </td>
              <td className="py-3 text-sm font-mono text-right" style={{ color: "#94A3B8" }}>
                {event.usersTriggered.toLocaleString()}
              </td>
              <td className="py-3 text-right">
                <div className="flex justify-end">
                  <Sparkline data={event.trend} color={eventColors[event.name] || "#64748B"} width={64} height={20} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

export default PulseEventsView;
