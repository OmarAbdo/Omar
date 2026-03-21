import React, { useState } from "react";
import { motion } from "framer-motion";
import { activityFeed } from "../../luma.data";
import type { ActivityType } from "../../luma.data";

type FilterId = "all" | "booked" | "cancelled" | "rescheduled" | "completed";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "booked", label: "Bookings" },
  { id: "cancelled", label: "Cancellations" },
  { id: "rescheduled", label: "Reschedules" },
  { id: "completed", label: "Completed" },
];

const typeConfig: Record<ActivityType, { icon: React.ReactNode; dotColor: string }> = {
  booked: {
    dotColor: "#22C55E",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    ),
  },
  confirmed: {
    dotColor: "#3B82F6",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    ),
  },
  cancelled: {
    dotColor: "#EF4444",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ),
  },
  rescheduled: {
    dotColor: "#F59E0B",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    ),
  },
  completed: {
    dotColor: "#6366F1",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
};

const dateGroupLabels: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  thisWeek: "This Week",
  earlier: "Earlier",
};

const LumaActivityView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filtered = activeFilter === "all"
    ? activityFeed
    : activityFeed.filter((a) => {
        if (activeFilter === "booked") return a.type === "booked" || a.type === "confirmed";
        return a.type === activeFilter;
      });

  const groups = ["today", "yesterday", "thisWeek", "earlier"].filter(
    (g) => filtered.some((a) => a.dateGroup === g)
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: activeFilter === f.id ? "#C2703E" : "transparent",
              color: activeFilter === f.id ? "#FFFFFF" : "#78716C",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity timeline */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}
            >
              {dateGroupLabels[group]}
            </p>
            <div className="space-y-1">
              {filtered
                .filter((a) => a.dateGroup === group)
                .map((entry, i) => {
                  const config = typeConfig[entry.type];
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl transition-colors duration-150"
                      style={{ backgroundColor: "transparent" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FFF7ED"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      {/* Icon */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${config.dotColor}15` }}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={config.dotColor}
                          strokeWidth={2}
                        >
                          {config.icon}
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
                          <span className="font-semibold">{entry.clientName}</span>{" "}
                          <span style={{ color: "#78716C" }}>
                            {entry.type === "booked" && "booked"}
                            {entry.type === "confirmed" && "confirmed"}
                            {entry.type === "cancelled" && "cancelled"}
                            {entry.type === "rescheduled" && "rescheduled"}
                            {entry.type === "completed" && "completed"}
                          </span>{" "}
                          <span className="font-medium">{entry.service}</span>
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "#A8A29E" }}>{entry.timestamp}</p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LumaActivityView;
