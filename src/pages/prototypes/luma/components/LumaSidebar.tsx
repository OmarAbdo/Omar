import React from "react";
import { motion } from "framer-motion";
import type { LumaViewId } from "../luma.data";
import { navItems } from "../luma.data";

interface Props {
  activeView: LumaViewId;
  onChangeView: (id: LumaViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const iconPaths: Record<string, React.ReactNode> = {
  calendar: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  ),
  users: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  ),
  clock: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
  ),
  bell: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  ),
  settings: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
  ),
};

const LumaSidebar: React.FC<Props> = ({ activeView, onChangeView, collapsed, onToggleCollapse }) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="shrink-0 h-screen sticky top-0 flex flex-col"
      style={{
        width: collapsed ? 64 : 220,
        backgroundColor: "#FFF7ED",
        borderRight: "1px solid #F5E6D3",
        transition: "width 0.25s ease",
      }}
    >
      {/* Brand */}
      <div className="px-4 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid #F5E6D3" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#C2703E", color: "#FFFFFF" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Luma</p>
            <p className="text-[10px]" style={{ color: "#A8A29E" }}>Time, well spent.</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isActive ? "#C2703E12" : "transparent",
                borderLeft: isActive ? "3px solid #C2703E" : "3px solid transparent",
                color: isActive ? "#C2703E" : "#78716C",
              }}
              title={collapsed ? item.label : undefined}
            >
              <svg
                className="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isActive ? 2 : 1.5}
              >
                {iconPaths[item.icon]}
              </svg>
              {!collapsed && (
                <span
                  className="text-sm"
                  style={{
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-2" style={{ borderTop: "1px solid #F5E6D3" }}>
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-colors duration-200"
          style={{ color: "#A8A29E" }}
        >
          <svg
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
          {!collapsed && (
            <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Collapse</span>
          )}
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-3 flex items-center gap-3" style={{ borderTop: "1px solid #F5E6D3" }}>
        <div className="relative shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "#C2703E18", color: "#C2703E" }}
          >
            OA
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
            style={{ backgroundColor: "#22C55E", borderColor: "#FFF7ED" }}
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>Omar Abdo</p>
            <p className="text-[10px] truncate" style={{ color: "#A8A29E" }}>Professional</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default LumaSidebar;
