import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clients } from "../safi.data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SafiNewInvoiceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [lineItems, setLineItems] = useState([
    { description: "", qty: 1, rate: 0 },
  ]);

  const total = lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", qty: 1, rate: 0 }]);
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="w-full max-w-2xl rounded-2xl overflow-hidden pointer-events-auto max-h-[85vh] flex flex-col"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #E5E5E5" }}>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#171717" }}>
                    New Invoice
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "#A3A3A3" }}>
                    Step {step} of 3 — {step === 1 ? "Client" : step === 2 ? "Line Items" : "Review"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-50"
                  style={{ color: "#A3A3A3" }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step indicator */}
              <div className="px-6 pt-4 shrink-0">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: s <= step ? "#4338CA" : "#E5E5E5" }}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Step 1: Client */}
                {step === 1 && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                      Select Client
                    </label>
                    <div className="mt-3 space-y-2">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client.id)}
                          className="w-full text-left px-4 py-3 rounded-lg transition-all duration-150 flex items-center justify-between"
                          style={{
                            border: selectedClient === client.id ? "1.5px solid #4338CA" : "1px solid #E5E5E5",
                            backgroundColor: selectedClient === client.id ? "#4338CA08" : "#FAFAFA",
                          }}
                        >
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#171717" }}>
                              {client.name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
                              {client.email} · {client.city}, {client.country}
                            </p>
                          </div>
                          {selectedClient === client.id && (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#4338CA" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Line Items */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                        Line Items
                      </label>
                    </div>
                    <div className="space-y-3">
                      {lineItems.map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex-1">
                            {i === 0 && (
                              <label className="text-[10px] font-medium uppercase tracking-wider mb-1 block" style={{ color: "#A3A3A3" }}>
                                Description
                              </label>
                            )}
                            <input
                              type="text"
                              placeholder="Service description"
                              value={item.description}
                              onChange={(e) => updateLineItem(i, "description", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                              style={{ border: "1px solid #E5E5E5", color: "#171717" }}
                            />
                          </div>
                          <div className="w-16">
                            {i === 0 && (
                              <label className="text-[10px] font-medium uppercase tracking-wider mb-1 block" style={{ color: "#A3A3A3" }}>
                                Qty
                              </label>
                            )}
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => updateLineItem(i, "qty", parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 rounded-lg text-sm outline-none text-center tabular-nums"
                              style={{ border: "1px solid #E5E5E5", color: "#171717" }}
                            />
                          </div>
                          <div className="w-28">
                            {i === 0 && (
                              <label className="text-[10px] font-medium uppercase tracking-wider mb-1 block" style={{ color: "#A3A3A3" }}>
                                Rate ($)
                              </label>
                            )}
                            <input
                              type="number"
                              min={0}
                              value={item.rate || ""}
                              onChange={(e) => updateLineItem(i, "rate", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded-lg text-sm outline-none text-right tabular-nums"
                              style={{ border: "1px solid #E5E5E5", color: "#171717" }}
                            />
                          </div>
                          <div className="w-8 pt-0.5 flex items-end">
                            {i === 0 && <div className="mb-1 h-3.5" />}
                            <button
                              onClick={() => removeLineItem(i)}
                              className="p-1.5 rounded transition-colors hover:bg-gray-100"
                              style={{ color: lineItems.length > 1 ? "#A3A3A3" : "#E5E5E5" }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addLineItem}
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150"
                      style={{ color: "#4338CA" }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Line Item
                    </button>

                    {/* Running total */}
                    <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid #E5E5E5" }}>
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#737373" }}>
                        Subtotal
                      </span>
                      <span className="text-lg font-bold tabular-nums" style={{ color: "#171717" }}>
                        {fmt(total)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div>
                    <div className="rounded-xl p-5" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold" style={{ color: "#171717" }}>
                          Invoice Preview
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#4338CA15", color: "#4338CA" }}>
                          Draft
                        </span>
                      </div>

                      <div className="text-sm space-y-3">
                        <div className="flex justify-between">
                          <span style={{ color: "#737373" }}>Client</span>
                          <span className="font-medium" style={{ color: "#171717" }}>
                            {clients.find((c) => c.id === selectedClient)?.name || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#737373" }}>Invoice Number</span>
                          <span className="font-medium" style={{ color: "#4338CA" }}>
                            INV-2024-015
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#737373" }}>Items</span>
                          <span className="font-medium" style={{ color: "#171717" }}>
                            {lineItems.filter((i) => i.description).length} line items
                          </span>
                        </div>
                        <div className="pt-3 flex justify-between" style={{ borderTop: "1px solid #E5E5E5" }}>
                          <span className="font-semibold" style={{ color: "#171717" }}>Total</span>
                          <span
                            className="text-lg font-bold tabular-nums"
                            style={{ color: "#171717", borderBottom: "2px solid #C9A96E", paddingBottom: "1px" }}
                          >
                            {fmt(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes input */}
                    <div className="mt-5">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                        Notes (optional)
                      </label>
                      <textarea
                        placeholder="Add a note for the client..."
                        rows={3}
                        className="w-full mt-2 px-3 py-2 rounded-lg text-sm outline-none resize-none"
                        style={{ border: "1px solid #E5E5E5", color: "#171717" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ borderTop: "1px solid #E5E5E5" }}>
                <button
                  onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{ color: "#737373", border: "1px solid #E5E5E5" }}
                >
                  {step > 1 ? "Back" : "Cancel"}
                </button>
                <button
                  onClick={() => (step < 3 ? setStep(step + 1) : onClose())}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
                  style={{ backgroundColor: step === 3 ? "#10B981" : "#4338CA" }}
                >
                  {step === 3 ? "Create Invoice" : "Continue"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SafiNewInvoiceModal;
