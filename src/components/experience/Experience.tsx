import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { staggerContainer, fadeUpVariant } from "../../utils/animations";
import SectionLabel from "../common/SectionLabel";
import { experiences } from "./Experience.data";

const typeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  freelance: "Freelance",
  founder: "Founder",
};

const Experience: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="experience" className="py-24 sm:py-32 bg-light-bg dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <motion.div variants={fadeUpVariant} className="max-w-2xl">
            <SectionLabel>{t("home.experience.eyebrow")}</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
              {t("home.experience.title")}
            </h2>
          </motion.div>

          <div className="mt-12 relative">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/10 to-transparent hidden sm:block" />

            <div className="space-y-2">
              {experiences.map((exp) => {
                const isExpanded = expanded === exp.id;
                return (
                  <motion.div
                    key={exp.id}
                    variants={fadeUpVariant}
                    className="relative sm:pl-8"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-6 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold/60 hidden sm:block" />

                    <button
                      onClick={() => setExpanded(isExpanded ? null : exp.id)}
                      className="w-full text-left group rounded-2xl border border-gray-200 dark:border-white/5 bg-light-surface dark:bg-dark-surface p-6 hover:border-gold/30 dark:hover:border-gold/30 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-text-primary group-hover:text-gold dark:group-hover:text-gold transition-colors">
                              {exp.role}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted">
                              {typeLabel[exp.type]}
                            </span>
                            {exp.impact && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-medium">
                                {exp.impact}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-text-muted">
                            {exp.company} · {exp.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-gray-400 dark:text-text-muted whitespace-nowrap">
                            {exp.period}
                          </span>
                          <svg
                            className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                          <ul className="space-y-2">
                            {exp.highlights.map((h, i) => (
                              <li key={i} className="flex gap-3 text-sm text-gray-500 dark:text-text-muted">
                                <span className="text-gold mt-0.5 shrink-0">›</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {exp.tech.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border border-gray-200 dark:border-white/5">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
