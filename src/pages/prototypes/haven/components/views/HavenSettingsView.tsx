import React from "react";
import { properties } from "../../haven.data";

const HavenSettingsView: React.FC<{ currentPropertyId: string }> = ({ currentPropertyId }) => {
  const property = properties.find((p) => p.id === currentPropertyId) || properties[0];

  return (
    <div className="max-w-2xl">
      {/* General */}
      <SettingsSection title="General" description="Basic property information">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Property Name" value={property.name} />
          <FormField label="Address" value={property.address} />
          <FormField label="Property Type" value={property.type === "villa" ? "Villa Compound" : "Apartment Building"} />
          <FormField label="Year Built" value={String(property.yearBuilt)} />
          <FormField label="Total Area" value={`${property.totalArea.toLocaleString()} sqft`} />
          <FormField label="Total Units" value={String(property.units.length)} />
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" description="Configure alert preferences">
        <div className="space-y-3">
          <ToggleRow label="Payment reminders" description="Send automatic payment reminders to tenants" defaultOn />
          <ToggleRow label="Overdue alerts" description="Notify me when a payment is more than 5 days overdue" defaultOn />
          <ToggleRow label="Lease expiry alerts" description="Alert 90 days before lease expiry" defaultOn />
          <ToggleRow label="Maintenance updates" description="Notify when maintenance status changes" defaultOn={false} />
          <ToggleRow label="Weekly summary" description="Send weekly portfolio summary email" defaultOn />
        </div>
      </SettingsSection>

      {/* Team */}
      <SettingsSection title="Team" description="People with access to this property">
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
          {[
            { name: "Omar Abdo", email: "omar@example.com", role: "Owner", status: "active" },
            { name: "Sara Admin", email: "sara@example.com", role: "Property Manager", status: "active" },
            { name: "Ali Contractor", email: "ali@example.com", role: "Maintenance", status: "invited" },
          ].map((member, i, arr) => (
            <div
              key={member.email}
              className="flex items-center justify-between px-4 py-3"
              style={{
                backgroundColor: "#FFFFFF",
                borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#0D948815", color: "#0D9488" }}
                >
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{member.name}</p>
                  <p className="text-[11px]" style={{ color: "#94A3B8" }}>{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: "#64748B" }}>{member.role}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: member.status === "active" ? "#F0FDF4" : "#FFFBEB",
                    color: member.status === "active" ? "#166534" : "#92400E",
                    border: `1px solid ${member.status === "active" ? "#BBF7D0" : "#FDE68A"}`,
                  }}
                >
                  {member.status === "active" ? "Active" : "Invited"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 text-xs font-medium" style={{ color: "#0D9488" }}>
          + Invite team member
        </button>
      </SettingsSection>

      {/* Danger zone */}
      <div className="mt-8 rounded-xl p-5" style={{ border: "1px solid #FECACA", backgroundColor: "#FEF2F2" }}>
        <h3 className="text-sm font-semibold" style={{ color: "#991B1B" }}>Danger Zone</h3>
        <p className="text-xs mt-1 mb-3" style={{ color: "#B91C1C" }}>
          These actions are irreversible. Proceed with caution.
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: "1px solid #FECACA", color: "#991B1B", backgroundColor: "#FFFFFF" }}>
            Archive Property
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}>
            Delete Property
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Helpers ──────────────────────────────

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{title}</h3>
    <p className="text-xs mb-4" style={{ color: "#64748B" }}>{description}</p>
    {children}
  </div>
);

const FormField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label className="block text-[11px] font-medium uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>
      {label}
    </label>
    <input
      type="text"
      defaultValue={value}
      readOnly
      className="w-full px-3 py-2 rounded-lg text-sm"
      style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#F8FAFC", outline: "none" }}
    />
  </div>
);

const ToggleRow: React.FC<{ label: string; description: string; defaultOn?: boolean }> = ({ label, description, defaultOn = false }) => {
  const [on, setOn] = React.useState(defaultOn);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{label}</p>
        <p className="text-[11px]" style={{ color: "#94A3B8" }}>{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className="w-9 h-5 rounded-full transition-colors duration-200 relative"
        style={{ backgroundColor: on ? "#0D9488" : "#CBD5E1" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ left: on ? "18px" : "2px" }}
        />
      </button>
    </div>
  );
};

export default HavenSettingsView;
