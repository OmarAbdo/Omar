import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, notifications } from "../pulse.data";
import type { ViewId } from "../hooks/usePulseState";

const icons: Record<string, React.ReactNode> = {
  chart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  activity: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  cursor: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  cog: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

interface Props {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onToggleSearch: () => void;
}

const PulseSidebar: React.FC<Props> = ({
  activeView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  notificationsOpen,
  onToggleNotifications,
  onToggleSearch,
}) => {
  const [sectionsOpen, setSectionsOpen] = useState<Record<string, boolean>>({
    analytics: true,
    configure: true,
  });

  const toggleSection = (key: string) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const analyticsItems = navItems.filter((n) => n.section === "analytics");
  const configItems = navItems.filter((n) => n.section === "configure");
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <aside
      className="shrink-0 h-full flex flex-col py-6 overflow-hidden transition-all duration-300"
      style={{
        width: collapsed ? 64 : 224,
        backgroundColor: "#070A12",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className={`${collapsed ? "px-2" : "px-4"} mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            {!collapsed && (
              <h2 className="text-lg font-bold" style={{ color: "#F1F5F9" }}>
                Pulse
              </h2>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleSearch}
                className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                style={{ color: "#64748B" }}
                title="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              <button
                onClick={onToggleNotifications}
                className="relative p-1.5 rounded-md transition-colors hover:bg-white/5"
                style={{ color: "#64748B" }}
                title="Notifications"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: "#F43F5E" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
        {!collapsed && (
          <p className="text-[10px] mt-1 tracking-wider uppercase" style={{ color: "#64748B" }}>
            See what matters.
          </p>
        )}
      </div>

      {/* Notification dropdown */}
      <AnimatePresence>
        {notificationsOpen && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mb-3 rounded-lg overflow-hidden"
            style={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="p-3">
              <p className="text-xs font-semibold mb-2" style={{ color: "#F1F5F9" }}>Notifications</p>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-2 py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span
                    className="w-1 shrink-0 rounded-full mt-1"
                    style={{
                      backgroundColor: n.type === "alert" ? "#F43F5E" : n.type === "milestone" ? "#10B981" : "#3B82F6",
                      height: 32,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "#F1F5F9" }}>
                      {n.title}
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#3B82F6" }} />}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>{n.desc}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#475569" }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <button className="text-[10px] font-medium mt-2 transition-colors hover:text-blue-300" style={{ color: "#3B82F6" }}>
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav sections */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto px-2">
        {/* Analytics section */}
        {!collapsed && (
          <button
            onClick={() => toggleSection("analytics")}
            className="flex items-center justify-between px-2 py-1 mb-1"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
              Analytics
            </span>
            <svg
              className="w-3 h-3 transition-transform"
              style={{ color: "#475569", transform: sectionsOpen.analytics ? "rotate(0)" : "rotate(-90deg)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}
        <AnimatePresence initial={false}>
          {(collapsed || sectionsOpen.analytics) && analyticsItems.map((item) => (
            <motion.button
              key={item.view}
              initial={collapsed ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onClick={() => onViewChange(item.view)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
              style={{
                backgroundColor: activeView === item.view ? "rgba(59,130,246,0.1)" : "transparent",
                color: activeView === item.view ? "#3B82F6" : "#64748B",
              }}
              title={collapsed ? item.label : undefined}
            >
              {icons[item.icon]}
              {!collapsed && item.label}
              {item.view === "realtime" && !collapsed && (
                <span className="ml-auto relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Configure section */}
        {!collapsed && (
          <button
            onClick={() => toggleSection("configure")}
            className="flex items-center justify-between px-2 py-1 mt-4 mb-1"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
              Configure
            </span>
            <svg
              className="w-3 h-3 transition-transform"
              style={{ color: "#475569", transform: sectionsOpen.configure ? "rotate(0)" : "rotate(-90deg)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}
        <AnimatePresence initial={false}>
          {(collapsed || sectionsOpen.configure) && configItems.map((item) => (
            <motion.button
              key={item.view}
              initial={collapsed ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onClick={() => onViewChange(item.view)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
              style={{
                backgroundColor: activeView === item.view ? "rgba(59,130,246,0.1)" : "transparent",
                color: activeView === item.view ? "#64748B" : "#64748B",
              }}
              title={collapsed ? item.label : undefined}
            >
              {icons[item.icon]}
              {!collapsed && item.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 mb-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "#475569" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className="w-4 h-4 transition-transform"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* User section */}
      <div className={`${collapsed ? "px-2" : "px-4"} pt-4`} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#3B82F620", color: "#3B82F6" }}>
              OA
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: "#10B981", borderColor: "#070A12" }} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#F1F5F9" }}>Omar Abdo</p>
              <p className="text-[10px]" style={{ color: "#64748B" }}>Admin · Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default PulseSidebar;
