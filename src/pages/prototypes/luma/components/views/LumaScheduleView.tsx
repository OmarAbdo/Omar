import React, { useState } from "react";
import LumaCalendarGrid from "../LumaCalendarGrid";
import LumaClientPanel from "../LumaClientPanel";
import { appointments, stats } from "../../luma.data";

const LumaScheduleView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAppointment = appointments.find((a) => a.id === selectedId) || null;

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Stats row */}
        <div className="px-6 py-3 flex gap-6 shrink-0" style={{ borderBottom: "1px solid #F5E6D320" }}>
          {[
            { label: "This week", value: stats.totalThisWeek, color: "#292524" },
            { label: "Confirmed", value: stats.confirmed, color: "#166534" },
            { label: "Pending", value: stats.pending, color: "#C2703E" },
            { label: "Completed", value: stats.completed, color: "#4338CA" },
            { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "#292524" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold" style={{ color: s.color, fontFamily: "'DM Sans', sans-serif" }}>{s.value}</span>
              <span className="text-[11px]" style={{ color: "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <LumaCalendarGrid
          appointments={appointments}
          selectedId={selectedId}
          onSelectAppointment={setSelectedId}
        />
      </div>

      {/* Client panel */}
      <LumaClientPanel
        appointment={selectedAppointment}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default LumaScheduleView;
