import React from "react";
import { motion } from "framer-motion";
import type { Driver } from "../arrow.data";

interface Props {
  drivers: Driver[];
  selectedDriverId: string | null;
  onSelectDriver: (id: string | null) => void;
}

const statusColors: Record<string, { dot: string; bg: string; text: string }> = {
  active: { dot: "#22C55E", bg: "#F0FDF4", text: "#166534" },
  delayed: { dot: "#F59E0B", bg: "#FFFBEB", text: "#92400E" },
  idle: { dot: "#94A3B8", bg: "#F8FAFC", text: "#64748B" },
};

const ArrowDriverRow: React.FC<Props> = ({ drivers, selectedDriverId, onSelectDriver }) => (
  <div className="px-4 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
    <div className="flex items-center justify-between mb-3">
      <h3
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "#94A3B8" }}
      >
        Drivers ({drivers.length})
      </h3>
      {selectedDriverId && (
        <button
          onClick={() => onSelectDriver(null)}
          className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors"
          style={{ color: "#3B82F6", backgroundColor: "#EFF6FF" }}
        >
          Clear filter
        </button>
      )}
    </div>
    <div className="space-y-1.5">
      {drivers.map((driver, i) => {
        const colors = statusColors[driver.status];
        const isSelected = selectedDriverId === driver.id;
        const progress = driver.ordersTotal > 0
          ? Math.round((driver.ordersCompleted / driver.ordersTotal) * 100)
          : 100;

        return (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
            onClick={() => onSelectDriver(isSelected ? null : driver.id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: isSelected ? "#F0FDF4" : "transparent",
              border: isSelected ? "1px solid #BBF7D0" : "1px solid transparent",
            }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: isSelected ? "#DCFCE7" : "#F1F5F9",
                  color: isSelected ? "#166534" : "#475569",
                }}
              >
                {driver.avatar}
              </div>
              {/* Status dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: colors.dot,
                  borderColor: isSelected ? "#F0FDF4" : "#FFFFFF",
                }}
              />
              {driver.status === "active" && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: colors.dot, opacity: 0.3 }}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "#0F172A" }}
              >
                {driver.name}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
                {driver.vehicle}
              </p>
            </div>

            {/* Progress + ETA */}
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: "#0F172A" }}
                >
                  {driver.ordersCompleted}/{driver.ordersTotal}
                </span>
              </div>
              {/* Progress bar */}
              <div
                className="w-16 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "#E2E8F0" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.dot }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: "easeOut" }}
                />
              </div>
              {driver.eta && (
                <span className="text-[10px] font-medium" style={{ color: colors.text }}>
                  ETA {driver.eta}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default ArrowDriverRow;
