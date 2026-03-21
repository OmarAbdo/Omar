import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Appointment } from "../luma.data";
import { weekDays, weekDates, hours, getService } from "../luma.data";

interface Props {
  appointments: Appointment[];
  onSelectAppointment: (id: string) => void;
  selectedId: string | null;
}

const statusStyles: Record<string, { badge: string; badgeBg: string }> = {
  confirmed: { badge: "Confirmed", badgeBg: "#D1FAE5" },
  pending: { badge: "Pending", badgeBg: "#FEF3C7" },
  cancelled: { badge: "Cancelled", badgeBg: "#FECDD3" },
  completed: { badge: "Completed", badgeBg: "#E0E7FF" },
};

const LumaCalendarGrid: React.FC<Props> = ({ appointments, onSelectAppointment, selectedId }) => {
  const hourHeight = 64;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Simulated "current time" — Thursday 11:30 AM
  const currentDayIndex = 3;
  const currentHour = 11.5;
  const currentTimeTop = (currentHour - hours[0]) * hourHeight;

  const handleMouseEnter = (e: React.MouseEvent, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
    setHoveredId(id);
  };

  return (
    <div className="flex-1 overflow-auto relative">
      <div className="min-w-[700px]">
        {/* Day headers */}
        <div
          className="grid grid-cols-[60px_repeat(7,1fr)] sticky top-0 z-20"
          style={{ backgroundColor: "#FFFBF7" }}
        >
          <div />
          {weekDays.map((day, i) => {
            const isToday = i === currentDayIndex;
            return (
              <div
                key={day}
                className="text-center py-3"
                style={{
                  borderBottom: "1px solid #F5E6D3",
                  borderLeft: "1px solid #F5E6D320",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: isToday ? "#C2703E" : "#A8A29E" }}
                >
                  {day}
                </p>
                <div className="flex items-center justify-center mt-1">
                  {isToday ? (
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ backgroundColor: "#C2703E", color: "#FFFFFF" }}
                    >
                      {weekDates[i].split(" ")[1]}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium" style={{ color: "#78716C" }}>
                      {weekDates[i]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
          {/* Hour rows */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-right pr-3 relative" style={{ height: hourHeight }}>
                <span
                  className="absolute -top-2 right-3 text-[11px] font-medium"
                  style={{ color: "#A8A29E" }}
                >
                  {hour.toString().padStart(2, "0")}:00
                </span>
              </div>
              {Array.from({ length: 7 }).map((_, dayIdx) => (
                <div
                  key={dayIdx}
                  className="relative group/cell"
                  style={{
                    height: hourHeight,
                    borderTop: "1px solid #F5E6D318",
                    borderLeft: "1px solid #F5E6D315",
                  }}
                >
                  {/* Hover "+" indicator on empty cells */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ color: "#C2703E40" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Current time indicator */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              top: currentTimeTop,
              left: `calc(${((currentDayIndex + 1) / 8) * 100}% + 60px - 4px)`,
              right: 0,
              width: `calc(${(1 / 8) * 100}%)`,
            }}
          >
            {/* Red dot */}
            <div className="absolute -left-1 -top-[3px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#DC2626" }} />
              <div className="w-2 h-2 rounded-full absolute top-0 left-0 animate-ping" style={{ backgroundColor: "#DC262660" }} />
            </div>
            {/* Red line spanning full width */}
            <div
              className="absolute top-[1px] -left-1"
              style={{
                height: "1px",
                backgroundColor: "#DC262680",
                width: "2000px",
              }}
            />
          </div>

          {/* Appointment blocks */}
          {appointments.map((appt, i) => {
            if (appt.status === "cancelled") {
              // Show cancelled with reduced opacity and strikethrough
              const top = (appt.startHour - hours[0]) * hourHeight;
              const height = appt.duration * hourHeight - 4;
              return (
                <motion.button
                  key={appt.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                  onClick={() => onSelectAppointment(appt.id)}
                  className="absolute rounded-xl px-2.5 py-1.5 text-left"
                  style={{
                    top: top + 2,
                    height,
                    left: `calc(${((appt.day + 1) / 8) * 100}% + 60px + 3px)`,
                    width: `calc(${(1 / 8) * 100}% - 6px)`,
                    backgroundColor: "#F5F5F4",
                    border: "1px solid #E7E5E4",
                    color: "#A8A29E",
                  }}
                >
                  <p className="text-[11px] font-semibold truncate line-through">{appt.clientName}</p>
                  <p className="text-[10px] truncate line-through opacity-75">{appt.service}</p>
                </motion.button>
              );
            }

            const svc = getService(appt.serviceId);
            const top = (appt.startHour - hours[0]) * hourHeight;
            const height = appt.duration * hourHeight - 4;
            const isSelected = appt.id === selectedId;
            const isCompleted = appt.status === "completed";

            return (
              <motion.button
                key={appt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                onClick={() => onSelectAppointment(appt.id)}
                onMouseEnter={(e) => handleMouseEnter(e, appt.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="absolute rounded-xl px-2.5 py-1.5 text-left transition-all duration-200 z-[5]"
                style={{
                  top: top + 2,
                  height,
                  left: `calc(${((appt.day + 1) / 8) * 100}% + 60px + 3px)`,
                  width: `calc(${(1 / 8) * 100}% - 6px)`,
                  backgroundColor: isSelected ? svc.color : svc.bgColor,
                  border: `1px solid ${isSelected ? svc.color : svc.borderColor}`,
                  color: isSelected ? "#FFFFFF" : svc.textColor,
                  opacity: isCompleted ? 0.65 : 1,
                }}
              >
                <div className="flex items-center gap-1">
                  {isCompleted && (
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  <p className="text-[11px] font-semibold truncate">{appt.clientName}</p>
                </div>
                <p className="text-[10px] truncate opacity-75">{appt.service}</p>
                {height > 50 && (
                  <p className="text-[10px] mt-0.5 opacity-60">
                    {Math.floor(appt.startHour)}:{appt.startHour % 1 === 0 ? "00" : "30"} –{" "}
                    {Math.floor(appt.startHour + appt.duration)}:
                    {(appt.startHour + appt.duration) % 1 === 0 ? "00" : "30"}
                  </p>
                )}
                {/* Service color indicator strip */}
                <div
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                  style={{ backgroundColor: isSelected ? "#FFFFFF80" : svc.color }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredId && (() => {
          const appt = appointments.find((a) => a.id === hoveredId);
          if (!appt || appt.id === selectedId) return null;
          const svc = getService(appt.serviceId);
          const status = statusStyles[appt.status];
          return (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div
                className="rounded-xl px-3 py-2.5 shadow-lg"
                style={{
                  backgroundColor: "#292524",
                  color: "#FAFAF9",
                  fontFamily: "'DM Sans', sans-serif",
                  minWidth: 180,
                }}
              >
                <p className="text-xs font-bold">{appt.clientName}</p>
                <p className="text-[11px] opacity-70 mt-0.5">{appt.service}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px]">
                    {Math.floor(appt.startHour)}:{appt.startHour % 1 === 0 ? "00" : "30"} –{" "}
                    {Math.floor(appt.startHour + appt.duration)}:{(appt.startHour + appt.duration) % 1 === 0 ? "00" : "30"}
                  </span>
                  <span className="text-[10px] opacity-50">•</span>
                  <span className="text-[10px]">{appt.duration}h</span>
                  <span className="text-[10px] opacity-50">•</span>
                  <span className="text-[10px]">${svc.price}</span>
                </div>
                <div className="mt-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                    style={{ backgroundColor: status.badgeBg, color: "#292524" }}
                  >
                    {status.badge}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default LumaCalendarGrid;
