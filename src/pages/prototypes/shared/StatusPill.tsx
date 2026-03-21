import React from "react";

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot?: string;
}

const statusStyles: Record<string, StatusConfig> = {
  paid: { label: "Paid", bg: "#10B98115", text: "#10B981", border: "#10B98130", dot: "#10B981" },
  pending: { label: "Pending", bg: "#F59E0B15", text: "#F59E0B", border: "#F59E0B30", dot: "#F59E0B" },
  overdue: { label: "Overdue", bg: "#F43F5E15", text: "#F43F5E", border: "#F43F5E30", dot: "#F43F5E" },
  active: { label: "Active", bg: "#22C55E15", text: "#22C55E", border: "#22C55E30", dot: "#22C55E" },
  delayed: { label: "Delayed", bg: "#F59E0B15", text: "#F59E0B", border: "#F59E0B30", dot: "#F59E0B" },
  failed: { label: "Failed", bg: "#EF444415", text: "#EF4444", border: "#EF444430", dot: "#EF4444" },
  delivered: { label: "Delivered", bg: "#10B98115", text: "#10B981", border: "#10B98130", dot: "#10B981" },
  vacant: { label: "Vacant", bg: "#CBD5E115", text: "#94A3B8", border: "#CBD5E130", dot: "#CBD5E1" },
  occupied: { label: "Occupied", bg: "#10B98115", text: "#10B981", border: "#10B98130", dot: "#10B981" },
  available: { label: "Available", bg: "#22C55E15", text: "#22C55E", border: "#22C55E30", dot: "#22C55E" },
  booked: { label: "Booked", bg: "#FECDD315", text: "#FB7185", border: "#FECDD330", dot: "#FB7185" },
};

interface StatusPillProps {
  status: string;
  size?: "sm" | "md";
}

const StatusPill: React.FC<StatusPillProps> = ({ status, size = "sm" }) => {
  const config = statusStyles[status] || statusStyles.pending;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.dot }}
        />
      )}
      {config.label}
    </span>
  );
};

export default StatusPill;
