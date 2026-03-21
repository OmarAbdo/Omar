import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services, clients, weekDays, weekDates, hours } from "../luma.data";

interface Props {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { id: 1, label: "Service" },
  { id: 2, label: "Client" },
  { id: 3, label: "Time" },
  { id: 4, label: "Confirm" },
];

const LumaNewBookingModal: React.FC<Props> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [clientSearch, setClientSearch] = useState("");

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const reset = () => {
    setStep(1);
    setSelectedServiceId(null);
    setSelectedClientId(null);
    setSelectedDay(null);
    setSelectedHour(null);
    setClientSearch("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canNext =
    (step === 1 && selectedServiceId) ||
    (step === 2 && selectedClientId) ||
    (step === 3 && selectedDay !== null && selectedHour !== null) ||
    step === 4;

  const availableHours = hours.filter((h) => h >= 9 && h <= 16);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "#FFFBF7" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F5E6D3" }}>
              <h2 className="text-base font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>New Booking</h2>
              <button onClick={handleClose} className="p-1 rounded-lg hover:bg-[#F5E6D340]" style={{ color: "#A8A29E" }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #F5E6D320" }}>
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: step >= s.id ? "#C2703E" : "#F5E6D3",
                        color: step >= s.id ? "#FFFFFF" : "#A8A29E",
                      }}
                    >
                      {step > s.id ? "✓" : s.id}
                    </div>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: step >= s.id ? "#292524" : "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px" style={{ backgroundColor: step > s.id ? "#C2703E" : "#F5E6D3" }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Content */}
            <div className="px-6 py-5 min-h-[300px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Service */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <p className="text-xs font-semibold mb-3" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
                      Select a service
                    </p>
                    {services.filter((s) => s.active).map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                        style={{
                          backgroundColor: selectedServiceId === service.id ? "#C2703E10" : "transparent",
                          border: `1px solid ${selectedServiceId === service.id ? "#C2703E40" : "#F5E6D3"}`,
                        }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: service.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>{service.name}</p>
                          <p className="text-[11px]" style={{ color: "#A8A29E" }}>{service.duration}h • ${service.price}</p>
                        </div>
                        {selectedServiceId === service.id && (
                          <svg className="w-4 h-4 shrink-0" style={{ color: "#C2703E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 2: Client */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs font-semibold mb-3" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
                      Select a client
                    </p>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-sm mb-3 focus:outline-none"
                      style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3", color: "#292524", fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClientId(client.id)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-150"
                          style={{
                            backgroundColor: selectedClientId === client.id ? "#C2703E10" : "transparent",
                            border: `1px solid ${selectedClientId === client.id ? "#C2703E40" : "#F5E6D320"}`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: "#C2703E15", color: "#C2703E" }}
                          >
                            {client.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: "#292524" }}>{client.name}</p>
                            <p className="text-[11px] truncate" style={{ color: "#A8A29E" }}>{client.email}</p>
                          </div>
                          {selectedClientId === client.id && (
                            <svg className="w-4 h-4 shrink-0" style={{ color: "#C2703E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Time */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs font-semibold mb-3" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
                      Pick a day
                    </p>
                    <div className="grid grid-cols-7 gap-1.5 mb-5">
                      {weekDays.map((day, i) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(i)}
                          className="py-2.5 rounded-xl text-center transition-all duration-150"
                          style={{
                            backgroundColor: selectedDay === i ? "#C2703E" : "#FFF7ED",
                            color: selectedDay === i ? "#FFFFFF" : "#292524",
                            border: `1px solid ${selectedDay === i ? "#C2703E" : "#F5E6D3"}`,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <p className="text-[10px] font-semibold uppercase">{day}</p>
                          <p className="text-xs mt-0.5">{weekDates[i].split(" ")[1]}</p>
                        </button>
                      ))}
                    </div>

                    {selectedDay !== null && (
                      <>
                        <p className="text-xs font-semibold mb-3" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
                          Pick a time
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {availableHours.map((h) => (
                            <button
                              key={h}
                              onClick={() => setSelectedHour(h)}
                              className="py-2 rounded-xl text-sm font-medium text-center transition-all duration-150"
                              style={{
                                backgroundColor: selectedHour === h ? "#C2703E" : "#FFF7ED",
                                color: selectedHour === h ? "#FFFFFF" : "#292524",
                                border: `1px solid ${selectedHour === h ? "#C2703E" : "#F5E6D3"}`,
                                fontFamily: "'DM Sans', sans-serif",
                              }}
                            >
                              {h.toString().padStart(2, "0")}:00
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Confirm */}
                {step === 4 && selectedService && selectedClient && selectedDay !== null && selectedHour !== null && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-xs font-semibold mb-3" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
                      Review booking details
                    </p>

                    <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#A8A29E" }}>Service</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedService.color }} />
                          <span className="text-sm font-semibold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>{selectedService.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#A8A29E" }}>Client</span>
                        <span className="text-sm font-semibold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>{selectedClient.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#A8A29E" }}>When</span>
                        <span className="text-sm font-medium" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
                          {weekDays[selectedDay]} {weekDates[selectedDay]}, {selectedHour.toString().padStart(2, "0")}:00
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#A8A29E" }}>Duration</span>
                        <span className="text-sm font-medium" style={{ color: "#292524" }}>{selectedService.duration}h</span>
                      </div>
                      <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #F5E6D3" }}>
                        <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#A8A29E" }}>Price</span>
                        <span className="text-lg font-bold" style={{ color: "#C2703E", fontFamily: "'DM Sans', sans-serif" }}>${selectedService.price}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #F5E6D3" }}>
              <button
                onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              <button
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                  else handleClose();
                }}
                disabled={!canNext}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: canNext ? "#C2703E" : "#E7E5E4",
                  color: canNext ? "#FFFFFF" : "#A8A29E",
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: canNext ? "pointer" : "not-allowed",
                }}
              >
                {step === 4 ? "Confirm Booking" : "Next"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LumaNewBookingModal;
