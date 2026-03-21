import React, { useState } from "react";

interface Props {
  data: number[];
}

const PulseHeatmapRow: React.FC<Props> = ({ data }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data);

  return (
    <div>
      <div className="flex gap-1">
        {data.map((val, i) => {
          const intensity = val / max;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm cursor-pointer transition-all relative"
              style={{
                height: 32,
                backgroundColor: `rgba(59,130,246,${0.08 + intensity * 0.82})`,
                transform: hovered === i ? "scaleY(1.15)" : "scaleY(1)",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === i && (
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono whitespace-nowrap z-10"
                  style={{ backgroundColor: "#1E293B", color: "#F1F5F9", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {val}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex mt-2">
        {data.map((_, i) => (
          <span
            key={i}
            className="flex-1 text-center text-[9px] font-mono"
            style={{ color: "#64748B" }}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PulseHeatmapRow;
