import React from "react";
import KpiCard from "../../shared/KpiCard";
import { kpis, kpisPreviousPeriod } from "../pulse.data";

interface Props {
  compareMode?: boolean;
}

const PulseKpiBar: React.FC<Props> = ({ compareMode = false }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {kpis.map((kpi, i) => (
      <KpiCard
        key={kpi.label}
        label={kpi.label}
        value={kpi.value}
        change={kpi.change}
        changeType={kpi.changeType}
        sparklineData={kpi.sparkline}
        bgColor="#111827"
        borderColor="rgba(255,255,255,0.06)"
        textColor="#F1F5F9"
        mutedColor="#64748B"
        accentColor={kpi.changeType === "negative" ? "#F43F5E" : "#3B82F6"}
        delay={i * 0.08}
        compareValue={compareMode ? kpisPreviousPeriod[i]?.value : undefined}
      />
    ))}
  </div>
);

export default PulseKpiBar;
