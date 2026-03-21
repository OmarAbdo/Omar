import React from "react";
import { motion } from "framer-motion";
import { activityFeed } from "../safi.data";

const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  payment: {
    color: "#10B981",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  sent: {
    color: "#4338CA",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  reminder: {
    color: "#F59E0B",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  created: {
    color: "#6366F1",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  overdue: {
    color: "#F43F5E",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
};

interface Props {
  limit?: number;
}

const SafiActivityFeed: React.FC<Props> = ({ limit }) => {
  const items = limit ? activityFeed.slice(0, limit) : activityFeed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #E5E5E5" }}>
        <h3 className="text-sm font-semibold" style={{ color: "#171717" }}>
          Recent Activity
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: "#F5F5F5" }}>
        {items.map((item, i) => {
          const config = typeConfig[item.type] || typeConfig.created;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.04, duration: 0.3 }}
              className="px-5 py-3.5 flex items-start gap-3 transition-colors duration-150 hover:bg-white cursor-default"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${config.color}10`, color: config.color }}
              >
                {config.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: "#171717" }}>
                  {item.title}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "#737373" }}>
                  {item.description}
                </p>
              </div>
              <span className="text-[10px] shrink-0 pt-1" style={{ color: "#A3A3A3" }}>
                {item.time}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SafiActivityFeed;
