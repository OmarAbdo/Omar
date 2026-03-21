import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Unit } from "../haven.data";
import { paymentRecords, maintenanceRequests, documents } from "../haven.data";

interface Props {
  unit: Unit | null;
  onClose: () => void;
}

type Tab = "details" | "payments" | "maintenance" | "documents";

const tabs: { id: Tab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "payments", label: "Payments" },
  { id: "maintenance", label: "Maintenance" },
  { id: "documents", label: "Documents" },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  occupied: { bg: "#F0FDF4", color: "#166534" },
  overdue: { bg: "#FFFBEB", color: "#92400E" },
  vacant: { bg: "#F8FAFC", color: "#64748B" },
};

const HavenTenantPanel: React.FC<Props> = ({ unit, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  // Reset tab when unit changes
  React.useEffect(() => {
    setActiveTab("details");
  }, [unit?.id]);

  const unitPayments = useMemo(
    () => (unit ? paymentRecords.filter((p) => p.unitLabel === unit.label).sort((a, b) => b.date.localeCompare(a.date)) : []),
    [unit],
  );

  const unitMaintenance = useMemo(
    () => (unit ? maintenanceRequests.filter((m) => m.unitId === unit.id) : []),
    [unit],
  );

  const unitDocuments = useMemo(
    () => (unit ? documents.filter((d) => d.unitId === unit.id || (d.tenantName && unit.tenant && d.tenantName === unit.tenant.name)) : []),
    [unit],
  );

  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-80 shrink-0 h-full overflow-y-auto"
          style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid #E2E8F0" }}
        >
          {/* Header */}
          <div className="p-5" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ color: "#0F172A" }}>{unit.label}</h3>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors" style={{ color: "#94A3B8" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: statusColors[unit.status].bg, color: statusColors[unit.status].color }}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </span>
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                {unit.type}
              </span>
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                {unit.area} sqft
              </span>
            </div>
          </div>

          {/* Tabs */}
          {unit.tenant && (
            <div className="flex" style={{ borderBottom: "1px solid #E2E8F0" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2.5 text-[11px] font-medium transition-colors relative"
                  style={{ color: activeTab === tab.id ? "#0D9488" : "#94A3B8" }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="haven-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "#0D9488" }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <div className="p-5">
            {!unit.tenant ? (
              /* Vacant unit */
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "#F1F5F9" }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: "#0F172A" }}>Unit Vacant</p>
                <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>AED {unit.monthlyRent.toLocaleString()}/month</p>
                <button className="mt-4 w-full py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}>
                  List Unit
                </button>
              </div>
            ) : activeTab === "details" ? (
              /* Details tab */
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Tenant</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#0D948815", color: "#0D9488" }}>
                      {unit.tenant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{unit.tenant.name}</p>
                      <p className="text-[11px]" style={{ color: "#94A3B8" }}>{unit.tenant.nationality}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <InfoRow icon="email" value={unit.tenant.email} />
                    <InfoRow icon="phone" value={unit.tenant.phone} />
                    <InfoRow icon="id" value={unit.tenant.idType} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Lease Details</p>
                  <div className="space-y-2">
                    {[
                      ["Monthly Rent", `AED ${unit.monthlyRent.toLocaleString()}`],
                      ["Lease Start", unit.tenant.leaseStart],
                      ["Lease End", unit.tenant.leaseEnd],
                      ["Last Payment", unit.lastPayment || "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-xs" style={{ color: "#64748B" }}>{label}</span>
                        <span className="text-xs font-medium" style={{ color: label === "Last Payment" && unit.status === "overdue" ? "#F59E0B" : "#0F172A" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}>Message</button>
                  <button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#F1F5F9", color: "#0F172A" }}>View Lease</button>
                </div>

                {unit.status === "overdue" && (
                  <button className="w-full py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
                    Send Payment Reminder
                  </button>
                )}
              </div>
            ) : activeTab === "payments" ? (
              /* Payments tab */
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#94A3B8" }}>Payment History</p>
                {unitPayments.length === 0 ? (
                  <p className="text-xs text-center py-6" style={{ color: "#94A3B8" }}>No payment records</p>
                ) : (
                  <div className="space-y-2">
                    {unitPayments.map((p) => (
                      <div key={p.id} className="p-3 rounded-lg" style={{ border: "1px solid #F1F5F9" }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "#0F172A" }}>AED {p.amount.toLocaleString()}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{p.date} · {p.method.replace("_", " ")}</p>
                          </div>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: p.status === "completed" ? "#F0FDF4" : p.status === "failed" ? "#FEF2F2" : "#FFFBEB",
                              color: p.status === "completed" ? "#166534" : p.status === "failed" ? "#991B1B" : "#92400E",
                            }}
                          >
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[10px] mt-1 font-mono" style={{ color: "#CBD5E1" }}>{p.reference}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button className="w-full mt-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}>
                  Record Payment
                </button>
              </div>
            ) : activeTab === "maintenance" ? (
              /* Maintenance tab */
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#94A3B8" }}>Maintenance Requests</p>
                {unitMaintenance.length === 0 ? (
                  <p className="text-xs text-center py-6" style={{ color: "#94A3B8" }}>No maintenance requests</p>
                ) : (
                  <div className="space-y-2">
                    {unitMaintenance.map((m) => {
                      const pColors: Record<string, string> = { low: "#22C55E", medium: "#3B82F6", high: "#F59E0B", urgent: "#EF4444" };
                      return (
                        <div key={m.id} className="p-3 rounded-lg" style={{ border: "1px solid #F1F5F9" }}>
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-medium" style={{ color: "#0F172A" }}>{m.title}</p>
                            <span
                              className="w-2 h-2 rounded-full shrink-0 mt-1"
                              style={{ backgroundColor: pColors[m.priority] }}
                            />
                          </div>
                          <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
                            {m.category} · {m.dateSubmitted} · {m.status.replace("_", " ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button className="w-full mt-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "#F1F5F9", color: "#0F172A" }}>
                  New Request
                </button>
              </div>
            ) : (
              /* Documents tab */
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#94A3B8" }}>Documents</p>
                {unitDocuments.length === 0 ? (
                  <p className="text-xs text-center py-6" style={{ color: "#94A3B8" }}>No documents</p>
                ) : (
                  <div className="space-y-2">
                    {unitDocuments.map((d) => (
                      <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ border: "1px solid #F1F5F9" }}>
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "#0F172A" }}>{d.name}</p>
                          <p className="text-[10px]" style={{ color: "#94A3B8" }}>{d.fileSize} · {d.uploadDate}</p>
                        </div>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium shrink-0"
                          style={{
                            backgroundColor: d.status === "valid" ? "#F0FDF4" : d.status === "expiring" ? "#FFFBEB" : "#FEF2F2",
                            color: d.status === "valid" ? "#166534" : d.status === "expiring" ? "#92400E" : "#991B1B",
                          }}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Info row helper ──────────────────────

const InfoRow: React.FC<{ icon: string; value: string }> = ({ icon, value }) => (
  <div className="flex items-center gap-2">
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
      {icon === "email" && <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />}
      {icon === "phone" && <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />}
      {icon === "id" && <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />}
    </svg>
    <span className="text-xs" style={{ color: "#64748B" }}>{value}</span>
  </div>
);

export default HavenTenantPanel;
