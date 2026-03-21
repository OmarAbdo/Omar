import { useState } from "react";

export type ViewId = "overview" | "realtime" | "audience" | "acquisition" | "events" | "settings";
export type Granularity = "hourly" | "daily" | "weekly";

export interface DateRange {
  label: string;
  start: string;
  end: string;
}

const dateRanges: DateRange[] = [
  { label: "Today", start: "Mar 22, 2024", end: "Mar 22, 2024" },
  { label: "Last 7 days", start: "Mar 16, 2024", end: "Mar 22, 2024" },
  { label: "Last 14 days", start: "Mar 9, 2024", end: "Mar 22, 2024" },
  { label: "Last 30 days", start: "Feb 21, 2024", end: "Mar 22, 2024" },
  { label: "Last 90 days", start: "Dec 23, 2023", end: "Mar 22, 2024" },
];

export function usePulseState() {
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [dateRange, setDateRange] = useState<DateRange>(dateRanges[3]);
  const [compareMode, setCompareMode] = useState(false);
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [segment, setSegment] = useState("All Users");

  return {
    activeView, setActiveView,
    dateRange, setDateRange,
    dateRanges,
    compareMode, setCompareMode,
    granularity, setGranularity,
    sidebarCollapsed, setSidebarCollapsed,
    searchOpen, setSearchOpen,
    notificationsOpen, setNotificationsOpen,
    segment, setSegment,
  };
}

export type PulseState = ReturnType<typeof usePulseState>;
