import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActivityEvent } from "../arrow.data";

const typeConfig: Record<string, { color: string; icon: string }> = {
  delivered: { color: "#22C55E", icon: "✓" },
  picked_up: { color: "#3B82F6", icon: "↑" },
  assigned: { color: "#8B5CF6", icon: "→" },
  delayed: { color: "#F59E0B", icon: "!" },
  failed: { color: "#EF4444", icon: "✕" },
};

interface Props {
  events: ActivityEvent[];
}

const ArrowActivityFeed: React.FC<Props> = ({ events }) => (
  <div className="flex flex-col" style={{ borderTop: "1px solid #E2E8F0" }}>
    <div className="px-4 py-2 flex items-center justify-between">
      <h3
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "#94A3B8" }}
      >
        Activity
      </h3>
      <span className="text-[10px] font-medium" style={{ color: "#CBD5E1" }}>
        Live
      </span>
    </div>
    <div className="overflow-y-auto max-h-40">
      <AnimatePresence>
        {events.slice(0, 6).map((event, i) => {
          const config = typeConfig[event.type] || typeConfig.assigned;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="px-4 py-2 flex items-start gap-2.5 hover:bg-[#F8FAFC] transition-colors"
            >
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  backgroundColor: `${config.color}15`,
                  color: config.color,
                }}
              >
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs leading-relaxed truncate"
                  style={{ color: "#334155" }}
                >
                  {event.message}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#CBD5E1" }}>
                  {event.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  </div>
);

export default ArrowActivityFeed;
