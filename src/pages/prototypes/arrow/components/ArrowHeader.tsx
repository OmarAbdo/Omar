import React from "react";
import { motion } from "framer-motion";
import type { Zone } from "../arrow.data";
import { zones } from "../arrow.data";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeZone: Zone;
  onZoneChange: (z: Zone) => void;
  activeCount: number;
}

const ArrowHeader: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  activeZone,
  onZoneChange,
  activeCount,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-center gap-3 px-4 py-3"
    style={{ borderBottom: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}
  >
    {/* Search */}
    <div className="relative flex-1 max-w-xs">
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: "#94A3B8" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search orders, drivers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none transition-colors"
        style={{
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          color: "#0F172A",
        }}
      />
    </div>

    {/* Zone filter */}
    <select
      value={activeZone}
      onChange={(e) => onZoneChange(e.target.value as Zone)}
      className="px-3 py-2 text-sm rounded-lg outline-none cursor-pointer"
      style={{
        backgroundColor: "#F8FAFC",
        border: "1px solid #E2E8F0",
        color: "#0F172A",
      }}
    >
      {zones.map((z) => (
        <option key={z.id} value={z.id}>
          {z.label}
        </option>
      ))}
    </select>

    {/* Spacer */}
    <div className="flex-1" />

    {/* Live indicator */}
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: "#22C55E" }}
        />
        <span
          className="relative inline-flex rounded-full h-2.5 w-2.5"
          style={{ backgroundColor: "#22C55E" }}
        />
      </span>
      <span className="text-xs font-semibold" style={{ color: "#166534" }}>
        {activeCount} Active
      </span>
    </div>

    {/* Date */}
    <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>
      Today, Mar 21
    </span>
  </motion.div>
);

export default ArrowHeader;
