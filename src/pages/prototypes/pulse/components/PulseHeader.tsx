import React, { useState, useRef, useEffect } from "react";
import { viewTitles, segments } from "../pulse.data";
import type { PulseState } from "../hooks/usePulseState";

interface Props {
  state: PulseState;
}

const PulseHeader: React.FC<Props> = ({ state }) => {
  const [dateOpen, setDateOpen] = useState(false);
  const [segOpen, setSegOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);

  const viewInfo = viewTitles[state.activeView];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false);
      if (segRef.current && !segRef.current.contains(e.target as Node)) setSegOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left — breadcrumb + title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "#64748B" }}>
          <span>Pulse</span>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>{viewInfo.title}</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "#F1F5F9" }}>
          {viewInfo.title}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          {viewInfo.subtitle}
        </p>
      </div>

      {/* Right — controls */}
      {state.activeView !== "settings" && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range picker */}
          {state.activeView !== "realtime" && (
            <div className="relative" ref={dateRef}>
              <button
                onClick={() => setDateOpen(!dateOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#94A3B8",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {state.dateRange.label}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {dateOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg py-1 z-20"
                  style={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {state.dateRanges.map((dr) => (
                    <button
                      key={dr.label}
                      onClick={() => { state.setDateRange(dr); setDateOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5"
                      style={{ color: state.dateRange.label === dr.label ? "#3B82F6" : "#94A3B8" }}
                    >
                      {dr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Compare toggle */}
          {state.activeView === "overview" && (
            <button
              onClick={() => state.setCompareMode(!state.compareMode)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: state.compareMode ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                color: state.compareMode ? "#3B82F6" : "#94A3B8",
                border: `1px solid ${state.compareMode ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              Compare
            </button>
          )}

          {/* Segment dropdown */}
          {state.activeView !== "realtime" && (
            <div className="relative" ref={segRef}>
              <button
                onClick={() => setSegOpen(!segOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#94A3B8",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {state.segment}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {segOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-36 rounded-lg py-1 z-20"
                  style={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {segments.map((s) => (
                    <button
                      key={s}
                      onClick={() => { state.setSegment(s); setSegOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5"
                      style={{ color: state.segment === s ? "#3B82F6" : "#94A3B8" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Export + Report */}
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "rgba(59,130,246,0.1)",
              color: "#3B82F6",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
};

export default PulseHeader;
