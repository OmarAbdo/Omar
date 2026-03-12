import React from "react";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block text-gold text-xs font-semibold tracking-widest uppercase mb-4">
    {children}
  </span>
);

export default SectionLabel;
