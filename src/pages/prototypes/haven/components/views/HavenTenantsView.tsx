import React, { useState, useMemo } from "react";
import { properties } from "../../haven.data";
import HavenDataTable, { type Column } from "../HavenDataTable";

interface TenantRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitLabel: string;
  propertyName: string;
  type: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  status: "occupied" | "overdue";
  nationality: string;
  daysUntilExpiry: number;
}

const HavenTenantsView: React.FC = () => {
  const [search, setSearch] = useState("");

  const tenants = useMemo<TenantRow[]>(() => {
    const rows: TenantRow[] = [];
    for (const prop of properties) {
      for (const unit of prop.units) {
        if (unit.tenant && unit.status !== "vacant") {
          const leaseEnd = new Date(unit.tenant.leaseEnd);
          const now = new Date("2024-03-22");
          const diffDays = Math.ceil((leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          rows.push({
            id: unit.id,
            name: unit.tenant.name,
            email: unit.tenant.email,
            phone: unit.tenant.phone,
            unitLabel: unit.label,
            propertyName: prop.name,
            type: unit.type,
            monthlyRent: unit.monthlyRent,
            leaseStart: unit.tenant.leaseStart,
            leaseEnd: unit.tenant.leaseEnd,
            status: unit.status as "occupied" | "overdue",
            nationality: unit.tenant.nationality,
            daysUntilExpiry: diffDays,
          });
        }
      }
    }
    return rows;
  }, []);

  const filtered = useMemo(() => {
    if (!search) return tenants;
    const q = search.toLowerCase();
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.unitLabel.toLowerCase().includes(q) ||
        t.propertyName.toLowerCase().includes(q) ||
        t.nationality.toLowerCase().includes(q),
    );
  }, [tenants, search]);

  const expiringSoon = tenants.filter((t) => t.daysUntilExpiry > 0 && t.daysUntilExpiry <= 90);

  const columns: Column<TenantRow>[] = [
    {
      key: "name",
      label: "Tenant",
      format: (_, row) => (
        <div>
          <p className="font-semibold text-xs" style={{ color: "#0F172A" }}>{row.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{row.nationality}</p>
        </div>
      ),
    },
    {
      key: "unitLabel",
      label: "Unit",
      format: (_, row) => (
        <div>
          <p className="text-xs font-medium" style={{ color: "#0F172A" }}>{row.unitLabel}</p>
          <p className="text-[10px]" style={{ color: "#94A3B8" }}>{row.propertyName}</p>
        </div>
      ),
    },
    { key: "type", label: "Type" },
    {
      key: "monthlyRent",
      label: "Rent",
      align: "right",
      format: (v) => <span className="font-medium">AED {(v as number).toLocaleString()}</span>,
    },
    { key: "leaseStart", label: "Lease Start" },
    {
      key: "leaseEnd",
      label: "Lease End",
      format: (_, row) => (
        <span style={{ color: row.daysUntilExpiry <= 90 ? "#F59E0B" : "#0F172A" }}>
          {row.leaseEnd}
          {row.daysUntilExpiry <= 90 && row.daysUntilExpiry > 0 && (
            <span className="text-[10px] ml-1">({row.daysUntilExpiry}d)</span>
          )}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      format: (v) => {
        const s = v as string;
        const isOverdue = s === "overdue";
        return (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              backgroundColor: isOverdue ? "#FFFBEB" : "#F0FDF4",
              color: isOverdue ? "#92400E" : "#166534",
              border: `1px solid ${isOverdue ? "#FDE68A" : "#BBF7D0"}`,
            }}
          >
            {isOverdue ? "Overdue" : "Active"}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Expiring soon banner */}
      {expiringSoon.length > 0 && (
        <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                {expiringSoon.length} lease{expiringSoon.length > 1 ? "s" : ""} expiring within 90 days
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>
                {expiringSoon.map((t) => `${t.name} (${t.unitLabel})`).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Tenants", value: String(tenants.length), color: "#0D9488" },
          { label: "Active", value: String(tenants.filter((t) => t.status === "occupied").length), color: "#22C55E" },
          { label: "Overdue", value: String(tenants.filter((t) => t.status === "overdue").length), color: "#F59E0B" },
          { label: "Total Monthly", value: `AED ${tenants.reduce((s, t) => s + t.monthlyRent, 0).toLocaleString()}`, color: "#0D9488" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative w-64">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-xs w-full"
            style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#FFFFFF", outline: "none" }}
          />
        </div>
      </div>

      {/* Table */}
      <HavenDataTable<TenantRow>
        columns={columns}
        data={filtered}
        rowKey={(r) => r.id}
        defaultSortKey="name"
        pageSize={10}
        emptyMessage="No tenants found"
      />
    </div>
  );
};

export default HavenTenantsView;
