import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { staggerContainer, fadeUpVariant } from "../../utils/animations";
import SectionLabel from "../common/SectionLabel";
import { services } from "./Service.data";

const Service: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="services"
      className="py-24 sm:py-32 bg-light-surface dark:bg-dark-surface"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeUpVariant} className="max-w-2xl">
            <SectionLabel>{t("home.services.eyebrow")}</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
              {t("home.services.title")}
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeUpVariant}
                className="group relative rounded-2xl border border-gray-200 dark:border-white/5 bg-light-bg dark:bg-dark-bg p-8 overflow-hidden hover:border-gold/30 dark:hover:border-gold/30 transition-colors duration-300"
              >
                {/* Gold top accent line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-gold/10 transition-colors duration-300">
                  <service.icon
                    className="h-6 w-6 text-gray-500 dark:text-text-muted group-hover:text-gold transition-colors duration-300"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-text-primary group-hover:text-gold dark:group-hover:text-gold transition-colors duration-300">
                  {t(service.titleKey)}
                </h3>

                <p className="mt-3 text-sm text-gray-500 dark:text-text-muted leading-relaxed">
                  {t(service.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Service;
