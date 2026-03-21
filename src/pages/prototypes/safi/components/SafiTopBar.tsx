import React, { useState } from "react";
import type { SafiView } from "./SafiSidebar";

interface Props {
  activeView: SafiView;
}

const viewLabels: Record<SafiView, string> = {
  dashboard: "Dashboard",
  invoices: "Invoices",
  clients: "Clients",
  reports: "Reports",
  settings: "Settings",
};

const SafiTopBar: React.FC<Props> = ({ activeView }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header
      className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{ borderBottom: "1px solid #E5E5E5", backgroundColor: "#FFFFFF" }}
    >
      {/* Left — Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: "#A3A3A3" }}>Safi</span>
        <span style={{ color: "#D4D4D4" }}>/</span>
        <span className="font-semibold" style={{ color: "#171717" }}>
          {viewLabels[activeView]}
        </span>
      </div>

      {/* Right — Search + actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#A3A3A3"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-56 pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2"
            style={{
              backgroundColor: "#FAFAFA",
              border: "1px solid #E5E5E5",
              color: "#171717",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4338CA40";
              e.currentTarget.style.boxShadow = "0 0 0 3px #4338CA10";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E5E5";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg transition-colors duration-150 hover:bg-gray-50"
          style={{ color: "#737373" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#F43F5E" }}
          />
        </button>

        {/* Quick period selector */}
        <div
          className="flex items-center gap-1 px-1 py-1 rounded-lg"
          style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
        >
          {["7D", "30D", "90D"].map((period, i) => (
            <button
              key={period}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-150"
              style={{
                backgroundColor: i === 1 ? "#4338CA" : "transparent",
                color: i === 1 ? "#FFFFFF" : "#737373",
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default SafiTopBar;
