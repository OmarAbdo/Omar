import React from "react";
import type { LumaViewId } from "../luma.data";

interface Props {
  activeView: LumaViewId;
  onNewBooking: () => void;
}

const viewTitles: Record<LumaViewId, { title: string; subtitle: string }> = {
  schedule: { title: "Schedule", subtitle: "Manage your weekly appointments" },
  clients: { title: "Clients", subtitle: "Your client directory" },
  services: { title: "Services", subtitle: "Service types and pricing" },
  activity: { title: "Activity", subtitle: "Recent bookings and changes" },
  settings: { title: "Settings", subtitle: "Business configuration" },
};

const LumaHeader: React.FC<Props> = ({ activeView, onNewBooking }) => {
  const view = viewTitles[activeView];

  return (
    <div
      className="px-6 py-4 flex items-center justify-between shrink-0"
      style={{ borderBottom: "1px solid #F5E6D3" }}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium" style={{ color: "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}>
            Luma
          </span>
          <span style={{ color: "#D6D3D1" }}>/</span>
          <span className="text-[11px] font-semibold" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
            {view.title}
          </span>
        </div>
        <h1
          className="text-xl font-bold mt-0.5"
          style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}
        >
          {view.title}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}>
          {view.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {activeView === "schedule" && (
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200"
            style={{ backgroundColor: "#C2703E15", color: "#C2703E", border: "1px solid #C2703E30", fontFamily: "'DM Sans', sans-serif" }}
          >
            Today
          </button>
        )}
        <button
          onClick={onNewBooking}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#C2703E", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}
        >
          + New Booking
        </button>
      </div>
    </div>
  );
};

export default LumaHeader;
