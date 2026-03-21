import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property, HavenView, HavenNotification } from "../haven.data";
import { navItems, notifications } from "../haven.data";

// ── SVG Icons ────────────────────────────

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  ),
  users: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  dollar: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  wrench: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.648 5.648a2.835 2.835 0 01-4.01-4.01l5.649-5.648m4.009 4.01l4.01-4.01m-4.01 4.01l-1.414-1.414m5.424-5.424l-1.414-1.414m1.414 1.414l1.415-1.415a2.835 2.835 0 00-4.01-4.01L12.836 6.01m4.01-4.01l-4.01 4.01M7.5 7.5l3 3" />
    </svg>
  ),
  folder: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  cog: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const notifTypeColors: Record<HavenNotification["type"], string> = {
  overdue: "#F59E0B",
  maintenance: "#EF4444",
  lease: "#8B5CF6",
  payment: "#10B981",
};

// ── Component ────────────────────────────

interface Props {
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  activeView: HavenView;
  onSelectView: (view: HavenView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
}

const HavenSidebar: React.FC<Props> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  activeView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  notificationsOpen,
  onToggleNotifications,
}) => {
  const [propertiesExpanded, setPropertiesExpanded] = useState(true);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <aside
      className="shrink-0 h-full flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 64 : 256,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
      }}
    >
      {/* Header */}
      <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #F1F5F9" }}>
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: "#0F172A" }}>Haven</h2>
                <p className="text-[10px]" style={{ color: "#94A3B8" }}>Property Manager</p>
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto"
            style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
        )}
        {!collapsed && (
          <div className="flex items-center gap-1">
            {/* Notification bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-1.5 rounded-md hover:bg-gray-50 transition-colors"
              title="Notifications"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notification dropdown */}
      <AnimatePresence>
        {notificationsOpen && !collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            style={{ borderBottom: "1px solid #E2E8F0" }}
          >
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto" style={{ backgroundColor: "#FAFAFA" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider px-1" style={{ color: "#94A3B8" }}>
                Notifications
              </p>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderLeft: `3px solid ${notifTypeColors[n.type]}`,
                    opacity: n.unread ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold" style={{ color: "#0F172A" }}>{n.title}</p>
                    {n.unread && (
                      <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: "#3B82F6" }} />
                    )}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{n.description}</p>
                  <p className="text-[10px] mt-1" style={{ color: "#94A3B8" }}>{n.time}</p>
                </div>
              ))}
              <button className="w-full text-center text-[11px] font-medium py-1.5" style={{ color: "#0D9488" }}>
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* Navigation */}
        <div className="pt-4 pb-2">
          {!collapsed && (
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Navigation
            </p>
          )}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.id === activeView;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className="w-full flex items-center gap-2.5 rounded-lg transition-all duration-200"
                  style={{
                    padding: collapsed ? "8px" : "7px 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    backgroundColor: isActive ? "#0D948812" : "transparent",
                    color: isActive ? "#0D9488" : "#64748B",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  {icons[item.icon]}
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="mx-2 my-2" style={{ borderTop: "1px solid #F1F5F9" }} />

        {/* Properties section */}
        <div>
        <button
          onClick={() => setPropertiesExpanded(!propertiesExpanded)}
          className="w-full flex items-center justify-between px-2 py-1.5"
        >
          {!collapsed && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                Properties
              </p>
              <svg
                className="w-3 h-3 transition-transform duration-200"
                style={{ color: "#94A3B8", transform: propertiesExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {propertiesExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <nav className="space-y-0.5 pb-2">
                {properties.map((prop) => {
                  const occupied = prop.units.filter((u) => u.status !== "vacant").length;
                  const total = prop.units.length;
                  const isActive = prop.id === selectedPropertyId;

                  return (
                    <button
                      key={prop.id}
                      onClick={() => onSelectProperty(prop.id)}
                      className="w-full text-left rounded-lg transition-all duration-200"
                      style={{
                        padding: collapsed ? "8px 4px" : "8px 10px",
                        backgroundColor: isActive ? "#0D948810" : "transparent",
                        border: isActive ? "1px solid #0D948820" : "1px solid transparent",
                      }}
                      title={collapsed ? prop.name : undefined}
                    >
                      {collapsed ? (
                        <div
                          className="w-6 h-6 mx-auto rounded flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: isActive ? "#0D948820" : "#F1F5F9",
                            color: isActive ? "#0D9488" : "#64748B",
                          }}
                        >
                          {prop.name.charAt(0)}
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold" style={{ color: isActive ? "#0D9488" : "#0F172A" }}>
                            {prop.name}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>
                            {prop.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(occupied / total) * 100}%`,
                                  backgroundColor: "#0D9488",
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-medium" style={{ color: "#64748B" }}>
                              {occupied}/{total}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <div style={{ borderTop: "1px solid #E2E8F0" }}>
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center py-2.5 hover:bg-gray-50 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className="w-4 h-4 transition-transform duration-300"
            style={{ color: "#94A3B8", transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* User section */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid #E2E8F0" }}>
        <div className="flex items-center gap-2.5" style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "#0D948815", color: "#0D9488" }}
            >
              OA
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ backgroundColor: "#22C55E", borderColor: "#FFFFFF" }}
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#0F172A" }}>Omar Abdo</p>
              <p className="text-[10px]" style={{ color: "#94A3B8" }}>Owner · Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default HavenSidebar;
