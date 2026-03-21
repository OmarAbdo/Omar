import React from "react";
import { motion } from "framer-motion";
import type { Driver, Order, Zone } from "../arrow.data";
import { zones } from "../arrow.data";

interface Props {
  drivers: Driver[];
  orders: Order[];
  selectedDriverId: string | null;
  selectedOrderId: string | null;
  activeZone: Zone;
  onSelectDriver: (id: string | null) => void;
}

const statusColors: Record<string, string> = {
  active: "#22C55E",
  delayed: "#F59E0B",
  idle: "#94A3B8",
};

const zoneRegions: Record<string, { x: number; y: number; w: number; h: number }> = {
  "dubai-marina": { x: 5, y: 8, w: 25, h: 25 },
  jbr: { x: 18, y: 5, w: 22, h: 20 },
  "business-bay": { x: 40, y: 35, w: 25, h: 25 },
  downtown: { x: 28, y: 55, w: 25, h: 25 },
  difc: { x: 60, y: 18, w: 25, h: 25 },
  deira: { x: 72, y: 55, w: 22, h: 25 },
  "al-barsha": { x: 12, y: 65, w: 25, h: 25 },
};

const ArrowMapArea: React.FC<Props> = ({
  drivers,
  orders,
  selectedDriverId,
  selectedOrderId,
  activeZone,
  onSelectDriver,
}) => {
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const filteredDrivers = activeZone === "all"
    ? drivers
    : drivers.filter((d) => d.zone === activeZone);

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={{ backgroundColor: "#1E293B" }}
    >
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        {Array.from({ length: 25 }).map((_, i) => (
          <React.Fragment key={i}>
            <line x1={`${i * 4}%`} y1="0" x2={`${i * 4}%`} y2="100%" stroke="#64748B" strokeWidth={0.5} />
            <line x1="0" y1={`${i * 4}%`} x2="100%" y2={`${i * 4}%`} stroke="#64748B" strokeWidth={0.5} />
          </React.Fragment>
        ))}
      </svg>

      {/* Road network */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
        {/* Major roads */}
        <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#475569" strokeWidth={3} />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#475569" strokeWidth={4} />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#475569" strokeWidth={3} />
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#475569" strokeWidth={4} />
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#475569" strokeWidth={3} />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#475569" strokeWidth={2} />
        {/* Secondary roads */}
        <line x1="35%" y1="10%" x2="35%" y2="90%" stroke="#475569" strokeWidth={1.5} />
        <line x1="62%" y1="5%" x2="62%" y2="95%" stroke="#475569" strokeWidth={1.5} />
        <line x1="5%" y1="45%" x2="95%" y2="45%" stroke="#475569" strokeWidth={1.5} />
        <line x1="10%" y1="70%" x2="90%" y2="70%" stroke="#475569" strokeWidth={1.5} />
        {/* SZR diagonal */}
        <line x1="10%" y1="20%" x2="90%" y2="85%" stroke="#475569" strokeWidth={5} opacity={0.6} />
      </svg>

      {/* Zone highlight */}
      {activeZone !== "all" && zoneRegions[activeZone] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute rounded-lg"
          style={{
            left: `${zoneRegions[activeZone].x}%`,
            top: `${zoneRegions[activeZone].y}%`,
            width: `${zoneRegions[activeZone].w}%`,
            height: `${zoneRegions[activeZone].h}%`,
            border: "1px solid rgba(59, 130, 246, 0.3)",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
          }}
        />
      )}

      {/* Area labels */}
      {zones.filter((z) => z.id !== "all").map((z) => {
        const dimmed = activeZone !== "all" && activeZone !== z.id;
        return (
          <span
            key={z.id}
            className="absolute text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300"
            style={{
              top: `${z.center.y - 6}%`,
              left: `${z.center.x - 5}%`,
              color: "#94A3B8",
              opacity: dimmed ? 0.1 : 0.25,
            }}
          >
            {z.label}
          </span>
        );
      })}

      {/* Route lines */}
      <svg className="absolute inset-0 w-full h-full">
        {filteredDrivers.map((driver) => {
          if (driver.route.length < 2) return null;
          const isHighlighted = selectedDriverId === driver.id;
          const isDimmed = selectedDriverId !== null && !isHighlighted;
          const color = statusColors[driver.status];
          const points = driver.route.map((p) => `${p.x}%,${p.y}%`).join(" ");

          return (
            <motion.polyline
              key={`route-${driver.id}`}
              points={points}
              fill="none"
              stroke={color}
              strokeWidth={isHighlighted ? 3 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={isHighlighted ? "0" : "6 4"}
              opacity={isDimmed ? 0.15 : isHighlighted ? 0.9 : 0.4}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: isDimmed ? 0.15 : isHighlighted ? 0.9 : 0.4,
              }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* Destination markers for selected driver */}
      {selectedDriverId && (() => {
        const driver = drivers.find((d) => d.id === selectedDriverId);
        if (!driver || driver.route.length < 2) return null;
        const dest = driver.route[driver.route.length - 1];
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.6 }}
            className="absolute flex flex-col items-center"
            style={{
              left: `${dest.x}%`,
              top: `${dest.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#3B82F6",
                border: "2px solid #1E293B",
              }}
            >
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </span>
          </motion.div>
        );
      })()}

      {/* Driver markers */}
      {filteredDrivers.map((driver) => {
        const color = statusColors[driver.status];
        const isHighlighted = selectedDriverId === driver.id;
        const isDimmed = selectedDriverId !== null && !isHighlighted;

        return (
          <motion.div
            key={driver.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHighlighted ? 1.2 : 1,
              opacity: isDimmed ? 0.35 : 1,
            }}
            transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
            className="absolute flex flex-col items-center cursor-pointer"
            style={{
              left: `${driver.location.x}%`,
              top: `${driver.location.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isHighlighted ? 20 : 10,
            }}
            onClick={() => onSelectDriver(isHighlighted ? null : driver.id)}
          >
            {/* Pulse ring for active */}
            {driver.status === "active" && !isDimmed && (
              <span
                className="absolute w-8 h-8 rounded-full animate-ping"
                style={{ backgroundColor: color, opacity: 0.2 }}
              />
            )}
            {/* Selection ring */}
            {isHighlighted && (
              <span
                className="absolute w-10 h-10 rounded-full"
                style={{ border: `2px solid ${color}`, opacity: 0.5 }}
              />
            )}
            {/* Dot */}
            <span
              className="relative w-4 h-4 rounded-full border-2 z-10"
              style={{ backgroundColor: color, borderColor: "#1E293B" }}
            />
            {/* Label */}
            <span
              className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap z-10"
              style={{
                backgroundColor: isHighlighted ? color : "#0F172A",
                color: isHighlighted ? "#FFFFFF" : "#E2E8F0",
                border: `1px solid ${color}40`,
              }}
            >
              {driver.name.split(" ")[0]}
              {driver.eta && ` · ${driver.eta}`}
            </span>
          </motion.div>
        );
      })}

      {/* Order destination marker if order selected */}
      {selectedOrder && selectedOrder.driverId && (() => {
        const driver = drivers.find((d) => d.id === selectedOrder.driverId);
        if (!driver) return null;
        // Show a blinking marker near the driver for the selected order
        return null; // The order detail panel handles the context
      })()}

      {/* Map legend */}
      <div
        className="absolute bottom-4 right-4 px-3 py-2 rounded-lg flex gap-4"
        style={{ backgroundColor: "#0F172AE0", border: "1px solid #334155" }}
      >
        {[
          { label: "Active", color: "#22C55E" },
          { label: "Delayed", color: "#F59E0B" },
          { label: "Idle", color: "#94A3B8" },
          { label: "Route", color: "#3B82F6" },
        ].map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-1.5 text-[10px]"
            style={{ color: "#94A3B8" }}
          >
            {item.label === "Route" ? (
              <span
                className="w-4 h-0 inline-block"
                style={{ borderTop: `2px dashed ${item.color}` }}
              />
            ) : (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.label}
          </span>
        ))}
      </div>

      {/* Map controls */}
      <div
        className="absolute top-4 right-4 flex flex-col gap-1"
      >
        {["+", "−"].map((symbol) => (
          <button
            key={symbol}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
            style={{
              backgroundColor: "#0F172AE0",
              color: "#94A3B8",
              border: "1px solid #334155",
            }}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArrowMapArea;
