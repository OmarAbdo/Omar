import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUpVariant, staggerContainer } from "../../utils/animations";
import HeroCanvas from "./HeroCanvas";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-light-bg dark:bg-dark-bg"
    >
      <HeroCanvas />

      {/* Radial gold glow at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 30% 10%, rgba(201,184,150,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-block text-gold text-xs font-semibold tracking-widest uppercase mb-6"
          >
            {t("home.hero.eyebrow")}
          </motion.span>

          <motion.h1
            variants={fadeUpVariant}
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] text-gray-900 dark:text-text-primary"
          >
            {t("home.hero.name")}
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="mt-8 text-lg sm:text-xl text-gray-500 dark:text-text-muted max-w-xl leading-relaxed"
          >
            {t("home.hero.tagline")}
          </motion.p>

          <motion.div
            variants={fadeUpVariant}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-gold text-dark-bg font-bold px-6 py-3 rounded-full hover:bg-gold-hover transition-colors duration-200 text-sm"
            >
              {t("home.hero.ctaPrimary")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-text-muted px-6 py-3 rounded-full hover:border-gold hover:text-gold dark:hover:text-gold transition-colors duration-200 text-sm font-medium"
            >
              {t("home.hero.ctaSecondary")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
