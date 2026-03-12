import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant, staggerContainer } from "../../utils/animations";
import { experiences } from "../../components/experience/Experience.data";

const skills = {
  "AI & ML": ["TensorFlow", "PyTorch", "LangChain", "RAG", "LSTM/GRU/CNN", "LLMs", "OpenRouter"],
  Frontend: ["React", "React Native", "TypeScript", "Next.js", "Vite", "Tailwind CSS"],
  Backend: ["Node.js", "Go", "FastAPI", "tRPC", "PostgreSQL", "Redis", "GraphQL"],
  "DevOps & Cloud": ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions", "EKS"],
};

const typeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  freelance: "Freelance",
  founder: "Founder",
};

const CVPage: React.FC = () => {
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-page { padding: 0 !important; background: white !important; }
          .print-card { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="min-h-screen py-12 sm:py-16 bg-light-bg dark:bg-dark-bg print-page">
        {/* Download button — hidden on print */}
        <div className="no-print mx-auto max-w-4xl px-6 lg:px-8 mb-8 flex justify-end">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-gold text-dark-bg font-bold px-5 py-2.5 rounded-full hover:bg-gold-hover transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download as PDF
          </button>
        </div>

        <motion.div
          className="mx-auto max-w-4xl px-6 lg:px-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* CV Card */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden print-card">

            {/* Header */}
            <motion.div
              variants={fadeUpVariant}
              className="px-10 py-10 border-b border-gray-100 dark:border-white/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-black text-gold tracking-tight">OA</span>
                    <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-text-muted">
                      Senior Software Developer
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
                    Omar Abdo
                  </h1>
                  <p className="mt-2 text-base text-gray-500 dark:text-text-muted">
                    Berlin, Germany · Available for senior engineering & consulting roles
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-gray-500 dark:text-text-muted sm:text-right">
                  <a href="mailto:omareabdo@gmail.com" className="hover:text-gold transition-colors">
                    omareabdo@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/omar-abdo/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    linkedin.com/in/omar-abdo
                  </a>
                  <a href="https://github.com/OmarAbdo" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    github.com/OmarAbdo
                  </a>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-white/5">

              {/* Left column */}
              <div className="lg:col-span-1 px-8 py-8 space-y-8">

                {/* Summary */}
                <motion.div variants={fadeUpVariant}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">Profile</h2>
                  <p className="text-sm text-gray-500 dark:text-text-muted leading-relaxed">
                    Senior software developer with 8+ years building products across fintech, AI, and logistics.
                    I specialise in full-stack architecture, production AI integrations, and scalable distributed systems.
                    Currently building Tafkeer — an Arabic-first AI SaaS — and open to senior engineering roles and consulting engagements.
                  </p>
                </motion.div>

                {/* Skills */}
                <motion.div variants={fadeUpVariant}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">Skills</h2>
                  <div className="space-y-4">
                    {Object.entries(skills).map(([group, items]) => (
                      <div key={group}>
                        <p className="text-xs font-semibold text-gray-400 dark:text-text-muted mb-2">{group}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-text-muted border border-gray-200 dark:border-white/5"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Education */}
                <motion.div variants={fadeUpVariant}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">Education</h2>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-text-primary">M.Sc. International Business Administration</p>
                    <p className="text-xs text-text-muted mt-0.5">Data Science · European University Viadrina</p>
                  </div>
                </motion.div>

                {/* Languages */}
                <motion.div variants={fadeUpVariant}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">Languages</h2>
                  <div className="space-y-1.5">
                    {[
                      { lang: "Arabic", level: "Native" },
                      { lang: "English", level: "Fluent (C1)" },
                      { lang: "German", level: "Professional (B2)" },
                    ].map(({ lang, level }) => (
                      <div key={lang} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-text-primary">{lang}</span>
                        <span className="text-text-muted">{level}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right column — Experience */}
              <div className="lg:col-span-2 px-8 py-8">
                <motion.div variants={fadeUpVariant}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-gold mb-6">Experience</h2>
                </motion.div>

                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent hidden sm:block" />
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <motion.div key={exp.id} variants={fadeUpVariant} className="relative sm:pl-6">
                        <div className="absolute left-0 top-2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold/50 hidden sm:block" />
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-text-primary">
                                {exp.role}
                              </h3>
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted">
                                {typeLabel[exp.type]}
                              </span>
                              {exp.impact && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-medium">
                                  {exp.impact}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                              {exp.company} · {exp.location}
                            </p>
                          </div>
                          <span className="text-xs text-text-muted whitespace-nowrap shrink-0">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="space-y-1 mb-2">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="flex gap-2 text-xs text-gray-500 dark:text-text-muted">
                              <span className="text-gold shrink-0 mt-0.5">›</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1">
                          {exp.tech.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border border-gray-200 dark:border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-4">
              <a
                href="https://calendly.com/omarabdo/quick-call?back=1"
                target="_blank"
                rel="noopener noreferrer"
                className="no-print text-xs text-gold hover:underline"
              >
                Book a call
              </a>
              <a
                href="https://www.linkedin.com/in/omar-abdo/"
                target="_blank"
                rel="noopener noreferrer"
                className="no-print text-xs text-text-muted hover:text-gold transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CVPage;
