import React from "react";
import type { ViewId } from "../vault.data";

const viewTitles: Record<ViewId, string> = {
  dashboard: "Dashboard",
  portfolio: "Portfolio",
  transactions: "Transactions",
  accounts: "Accounts",
  insights: "Market Insights",
  advisor: "Relationship Manager",
  cards: "Cards",
  transfers: "Transfers",
  settings: "Settings",
};

interface Props {
  activeView: ViewId;
}

const VaultTopBar: React.FC<Props> = ({ activeView }) => {
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: "#71717A" }}>
          Vault &nbsp;/&nbsp; {viewTitles[activeView]}
        </p>
        {activeView === "dashboard" ? (
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#FAFAF9", fontFamily: "'Playfair Display', serif" }}
          >
            {greeting}, Omar
          </h1>
        ) : (
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#FAFAF9", fontFamily: "'Playfair Display', serif" }}
          >
            {viewTitles[activeView]}
          </h1>
        )}
      </div>

      {/* Right side: notifications + date */}
      <div className="flex items-center gap-4">
        <span className="text-xs" style={{ color: "#71717A" }}>
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </span>
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#18181B", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <svg className="w-4 h-4" style={{ color: "#A1A1AA" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <div
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#C9A96E" }}
          />
        </button>
      </div>
    </div>
  );
};

export default VaultTopBar;
