import React from "react";
import { motion } from "framer-motion";
import type { Unit } from "../haven.data";

interface Props {
  units: Unit[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  occupied: { bg: "#F0FDF4", border: "#BBF7D0", dot: "#22C55E", text: "#166534" },
  overdue: { bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B", text: "#92400E" },
  vacant: { bg: "#F8FAFC", border: "#E2E8F0", dot: "#CBD5E1", text: "#64748B" },
};

const HavenUnitGrid: React.FC<Props> = ({ units, selectedId, onSelect }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {units.map((unit, i) => {
      const colors = statusColors[unit.status];
      const isSelected = unit.id === selectedId;

      return (
        <motion.button
          key={unit.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          onClick={() => onSelect(unit.id)}
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
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.dot }}
            />
          </div>
          <p className="text-xs" style={{ color: "#64748B" }}>
            {unit.type} · Floor {unit.floor}
          </p>
          <p className="text-sm font-semibold mt-1.5" style={{ color: "#0F172A" }}>
            AED {unit.monthlyRent.toLocaleString()}
          </p>
          {unit.tenant && (
            <p className="text-xs mt-1 truncate" style={{ color: "#94A3B8" }}>
              {unit.tenant.name}
            </p>
          )}
        </motion.button>
      );
    })}
  </div>
);

export default HavenUnitGrid;
