import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { staggerContainer, fadeUpVariant } from "../../utils/animations";
import SectionLabel from "../common/SectionLabel";

const stats = [
  { value: "8+", labelKey: "home.about.stats.experience" },
  { value: "20+", labelKey: "home.about.stats.projects" },
  { value: "5+", labelKey: "home.about.stats.countries" },
];

const techGroups = [
  {
    label: "AI & ML",
    color: "text-amber-500 dark:text-amber-400",
    border: "border-amber-500/20 hover:border-amber-400",
    techs: ["TensorFlow", "PyTorch", "LangChain", "RAG", "LSTM/GRU/CNN", "LLMs"],
  },
  {
    label: "Frontend",
    color: "text-blue-500 dark:text-blue-400",
    border: "border-blue-500/20 hover:border-blue-400",
    techs: ["React", "React Native", "TypeScript", "Next.js", "Vite"],
  },
  {
    label: "Backend",
    color: "text-emerald-500 dark:text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-400",
    techs: ["Node.js", "Go", "FastAPI", "tRPC", "PostgreSQL", "Redis"],
  },
  {
    label: "DevOps & Cloud",
    color: "text-violet-500 dark:text-violet-400",
    border: "border-violet-500/20 hover:border-violet-400",
    techs: ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions"],
  },
];

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 sm:py-32 bg-light-bg dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left — bio + stats */}
          <motion.div variants={fadeUpVariant}>
            <SectionLabel>{t("home.about.eyebrow")}</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
              {t("home.about.title")}
            </h2>
            <p className="mt-6 text-base text-gray-500 dark:text-text-muted leading-relaxed">
              {t("home.about.bio")}
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.labelKey}>
                  <p className="text-4xl font-black text-gold">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-text-muted leading-snug">
                    {t(stat.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — grouped tech stack */}
          <motion.div variants={fadeUpVariant} className="space-y-6">
            {techGroups.map((group) => (
              <div key={group.label}>
                <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${group.color}`}>
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.techs.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-light-surface dark:bg-dark-surface text-gray-600 dark:text-text-muted ${group.border} transition-colors duration-200 cursor-default`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
