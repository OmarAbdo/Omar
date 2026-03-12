import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUpVariant } from "../../utils/animations";
import SectionLabel from "../common/SectionLabel";

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 sm:py-32 bg-light-surface dark:bg-dark-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-2xl mx-auto"
        >
          <SectionLabel>{t("home.contact.eyebrow")}</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
            {t("home.contact.title")}
          </h2>
          <p className="mt-6 text-base text-gray-500 dark:text-text-muted leading-relaxed">
            {t("home.contact.subtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary — Book a Call */}
            <a
              href="https://calendly.com/omarabdo/quick-call?back=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-dark-bg font-bold px-6 py-3 rounded-full hover:bg-gold-hover transition-colors duration-200 text-sm w-full sm:w-auto justify-center"
            >
              {t("home.contact.cta")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </a>

            {/* Secondary — LinkedIn */}
            <a
              href="https://www.linkedin.com/in/omar-abdo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-text-muted font-medium px-6 py-3 rounded-full hover:border-gold hover:text-gold dark:hover:text-gold transition-colors duration-200 text-sm w-full sm:w-auto justify-center"
            >
              {t("home.contact.linkedin")}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
