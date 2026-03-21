import { useState } from "react";
import type { ViewId } from "../vault.data";

export function useVaultState() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<"all" | "credit" | "debit" | "investment">("all");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionPage, setTransactionPage] = useState(0);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [performancePeriod, setPerformancePeriod] = useState("1Y");

  return {
    activeView, setActiveView,
    sidebarCollapsed, setSidebarCollapsed,
    transactionFilter, setTransactionFilter,
    transactionSearch, setTransactionSearch,
    transactionPage, setTransactionPage,
    showBenchmark, setShowBenchmark,
    performancePeriod, setPerformancePeriod,
  };
}

export type VaultState = ReturnType<typeof useVaultState>;
