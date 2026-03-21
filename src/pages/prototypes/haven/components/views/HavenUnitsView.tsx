import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Unit } from "../../haven.data";
import type { StatusFilter, UnitViewMode } from "../../hooks/useHavenState";

// ── Status colors ────────────────────────

const statusColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  occupied: { bg: "#F0FDF4", border: "#BBF7D0", dot: "#22C55E", text: "#166534" },
  overdue: { bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B", text: "#92400E" },
  vacant: { bg: "#F8FAFC", border: "#E2E8F0", dot: "#CBD5E1", text: "#64748B" },
};

const filterTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "occupied", label: "Occupied" },
  { id: "overdue", label: "Overdue" },
  { id: "vacant", label: "Vacant" },
];

// ── Props ────────────────────────────────

interface Props {
  units: Unit[];
  allUnits: Unit[];
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
  statusFilter: StatusFilter;
  onSetStatusFilter: (f: StatusFilter) => void;
  viewMode: UnitViewMode;
  onSetViewMode: (m: UnitViewMode) => void;
  searchQuery: string;
  onSetSearchQuery: (q: string) => void;
  stats: { totalRent: number; occupied: number; overdue: number; vacant: number; occupancyRate: number };
}

const HavenUnitsView: React.FC<Props> = ({
  units,
  allUnits,
  selectedUnitId,
  onSelectUnit,
  statusFilter,
  onSetStatusFilter,
  viewMode,
  onSetViewMode,
  searchQuery,
  onSetSearchQuery,
  stats,
}) => {
  // Group by floor
  const floorGroups = useMemo(() => {
    const groups: Record<number, Unit[]> = {};
    units.forEach((u) => {
      if (!groups[u.floor]) groups[u.floor] = [];
      groups[u.floor].push(u);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([floor, floorUnits]) => ({ floor: Number(floor), units: floorUnits }));
  }, [units]);

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Monthly Income", value: `AED ${stats.totalRent.toLocaleString()}`, color: "#0D9488" },
          { label: "Occupied", value: String(stats.occupied), color: "#22C55E" },
          { label: "Overdue", value: String(stats.overdue), color: "#F59E0B" },
          { label: "Vacant", value: String(stats.vacant), color: "#94A3B8" },
          { label: "Occupancy", value: `${stats.occupancyRate}%`, color: "#0D9488" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? allUnits.length
                  : allUnits.filter((u) => u.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSetStatusFilter(tab.id)}
                  className="px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: statusFilter === tab.id ? "#0D9488" : "#FFFFFF",
                    color: statusFilter === tab.id ? "#FFFFFF" : "#64748B",
                    borderRight: "1px solid #E2E8F0",
                  }}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search units..."
              value={searchQuery}
              onChange={(e) => onSetSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs w-44"
              style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#FFFFFF", outline: "none" }}
            />
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
            <button
              onClick={() => onSetViewMode("grid")}
              className="p-1.5 transition-colors"
              style={{ backgroundColor: viewMode === "grid" ? "#0D9488" : "#FFFFFF" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={viewMode === "grid" ? "#FFFFFF" : "#64748B"} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
              </svg>
            </button>
            <button
              onClick={() => onSetViewMode("list")}
              className="p-1.5 transition-colors"
              style={{ backgroundColor: viewMode === "list" ? "#0D9488" : "#FFFFFF", borderLeft: "1px solid #E2E8F0" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={viewMode === "list" ? "#FFFFFF" : "#64748B"} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
            <div className="flex h-full">
              <div style={{ width: `${(stats.occupied / allUnits.length) * 100}%`, backgroundColor: "#22C55E" }} />
              <div style={{ width: `${(stats.overdue / allUnits.length) * 100}%`, backgroundColor: "#F59E0B" }} />
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-[10px]" style={{ color: "#64748B" }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#22C55E" }} /> Occupied
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#F59E0B" }} /> Overdue
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#CBD5E1" }} /> Vacant
          </span>
        </div>
      </div>

      {/* Units */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {floorGroups.map(({ floor, units: floorUnits }) => (
              <div key={floor} className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#94A3B8" }}>
                  {floor === 0 ? "Ground Floor" : `Floor ${floor}`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {floorUnits.map((unit, i) => {
                    const colors = statusColors[unit.status];
                    const isSelected = unit.id === selectedUnitId;
                    return (
                      <motion.button
                        key={unit.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        onClick={() => onSelectUnit(unit.id)}
                        className="text-left p-4 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: isSelected ? "#0D948810" : colors.bg,
                          border: `1.5px solid ${isSelected ? "#0D9488" : colors.border}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.text }}>
                            {unit.label}
                          </span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.dot }} />
                        </div>
                        <p className="text-[11px]" style={{ color: "#64748B" }}>
                          {unit.type} · {unit.area} sqft
                        </p>
                        <p className="text-sm font-semibold mt-1.5" style={{ color: "#0F172A" }}>
                          AED {unit.monthlyRent.toLocaleString()}
                        </p>
                        {unit.tenant && (
                          <p className="text-[11px] mt-1 truncate" style={{ color: "#94A3B8" }}>
                            {unit.tenant.name}
                          </p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    {["Unit", "Type", "Area", "Floor", "Tenant", "Rent", "Status", "Last Payment"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit) => {
                    const colors = statusColors[unit.status];
                    return (
                      <tr
                        key={unit.id}
                        onClick={() => onSelectUnit(unit.id)}
                        className="cursor-pointer transition-colors"
                        style={{ borderBottom: "1px solid #F1F5F9" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF"; }}
                      >
                        <td className="px-4 py-3 font-semibold text-xs" style={{ color: "#0F172A" }}>{unit.label}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>{unit.type}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>{unit.area} sqft</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>{unit.floor === 0 ? "G" : unit.floor}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#0F172A" }}>{unit.tenant?.name ?? "—"}</td>
                        <td className="px-4 py-3 text-xs font-medium" style={{ color: "#0F172A" }}>AED {unit.monthlyRent.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                            {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: unit.status === "overdue" ? "#F59E0B" : "#64748B" }}>{unit.lastPayment ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {units.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "#94A3B8" }}>No units match your filters</p>
        </div>
      )}
    </div>
  );
};

export default HavenUnitsView;
