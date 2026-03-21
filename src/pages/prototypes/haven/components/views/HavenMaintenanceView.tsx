import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { maintenanceRequests } from "../../haven.data";

// ── Config ───────────────────────────────

const statusFilters = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "cancelled", label: "Cancelled" },
] as const;

const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  medium: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  high: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  urgent: { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  open: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  in_progress: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  resolved: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  cancelled: { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" },
};

const categoryIcons: Record<string, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  hvac: "❄️",
  general: "🏠",
  pest_control: "🐛",
  painting: "🎨",
};

const categoryLabels: Record<string, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  hvac: "HVAC",
  general: "General",
  pest_control: "Pest Control",
  painting: "Painting",
};

// ── Component ────────────────────────────

const HavenMaintenanceView: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return maintenanceRequests;
    return maintenanceRequests.filter((r) => r.status === filter);
  }, [filter]);

  const selected = maintenanceRequests.find((r) => r.id === selectedId) || null;

  const stats = useMemo(() => {
    const open = maintenanceRequests.filter((r) => r.status === "open").length;
    const inProgress = maintenanceRequests.filter((r) => r.status === "in_progress").length;
    const resolved = maintenanceRequests.filter((r) => r.status === "resolved").length;
    const totalCost = maintenanceRequests
      .filter((r) => r.cost)
      .reduce((s, r) => s + (r.cost || 0), 0);
    return { open, inProgress, resolved, totalCost };
  }, []);

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Open", value: String(stats.open), color: "#3B82F6" },
            { label: "In Progress", value: String(stats.inProgress), color: "#F59E0B" },
            { label: "Resolved", value: String(stats.resolved), color: "#22C55E" },
            { label: "Total Cost", value: `AED ${stats.totalCost.toLocaleString()}`, color: "#0F172A" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{stat.label}</p>
              <p className="text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
            {statusFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: filter === f.id ? "#0D9488" : "#FFFFFF",
                  color: filter === f.id ? "#FFFFFF" : "#64748B",
                  borderRight: "1px solid #E2E8F0",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}>
            New Request
          </button>
        </div>

        {/* Request list */}
        <div className="space-y-2">
          {filtered.map((req) => {
            const pColor = priorityColors[req.priority];
            const sColor = statusColors[req.status];
            const isSelected = req.id === selectedId;

            return (
              <motion.button
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedId(isSelected ? null : req.id)}
                className="w-full text-left p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? "#0D948808" : "#FFFFFF",
                  border: `1px solid ${isSelected ? "#0D9488" : "#E2E8F0"}`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-lg">{categoryIcons[req.category]}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#0F172A" }}>{req.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>
                        {req.unitLabel} · {req.tenantName} · {req.dateSubmitted}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: pColor.bg, color: pColor.text, border: `1px solid ${pColor.border}` }}
                    >
                      {req.priority}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: sColor.bg, color: sColor.text, border: `1px solid ${sColor.border}` }}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "#94A3B8" }}>No requests match this filter</p>
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="w-80 shrink-0 sticky top-6 self-start"
          >
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              {/* Header */}
              <div className="p-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{categoryIcons[selected.category]}</span>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1 rounded hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-sm font-bold mt-2" style={{ color: "#0F172A" }}>{selected.title}</h3>
                <div className="flex gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      backgroundColor: priorityColors[selected.priority].bg,
                      color: priorityColors[selected.priority].text,
                      border: `1px solid ${priorityColors[selected.priority].border}`,
                    }}
                  >
                    {selected.priority}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor: statusColors[selected.status].bg,
                      color: statusColors[selected.status].text,
                      border: `1px solid ${statusColors[selected.status].border}`,
                    }}
                  >
                    {selected.status.replace("_", " ")}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
                  >
                    {categoryLabels[selected.category]}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Description</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{selected.description}</p>
                </div>

                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Details</p>
                  <div className="space-y-2">
                    {[
                      ["Unit", selected.unitLabel],
                      ["Tenant", selected.tenantName],
                      ["Submitted", selected.dateSubmitted],
                      ...(selected.assignedTo ? [["Assigned To", selected.assignedTo]] : []),
                      ...(selected.dateResolved ? [["Resolved", selected.dateResolved]] : []),
                      ...(selected.cost ? [["Cost", `AED ${selected.cost.toLocaleString()}`]] : []),
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span style={{ color: "#64748B" }}>{label}</span>
                        <span className="font-medium" style={{ color: "#0F172A" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#94A3B8" }}>Timeline</p>
                  <div className="space-y-3">
                    <TimelineItem label="Submitted" date={selected.dateSubmitted} active />
                    {selected.assignedTo && (
                      <TimelineItem label={`Assigned to ${selected.assignedTo}`} date={selected.dateSubmitted} active />
                    )}
                    {selected.status === "in_progress" && (
                      <TimelineItem label="Work in progress" date="Ongoing" active />
                    )}
                    {selected.dateResolved && (
                      <TimelineItem label="Resolved" date={selected.dateResolved} active />
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selected.status !== "resolved" && selected.status !== "cancelled" && (
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}>
                      {selected.status === "open" ? "Assign" : "Mark Resolved"}
                    </button>
                    <button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#F1F5F9", color: "#0F172A" }}>
                      Contact Tenant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Timeline item ────────────────────────

const TimelineItem: React.FC<{ label: string; date: string; active?: boolean }> = ({ label, date, active }) => (
  <div className="flex items-start gap-2.5">
    <div className="flex flex-col items-center">
      <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: active ? "#0D9488" : "#CBD5E1" }} />
      <div className="w-px h-4" style={{ backgroundColor: "#E2E8F0" }} />
    </div>
    <div>
      <p className="text-xs font-medium" style={{ color: "#0F172A" }}>{label}</p>
      <p className="text-[10px]" style={{ color: "#94A3B8" }}>{date}</p>
    </div>
  </div>
);

export default HavenMaintenanceView;
