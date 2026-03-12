import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { staggerContainer, fadeUpVariant } from "../../utils/animations";
import SectionLabel from "../common/SectionLabel";
import ProjectCard from "./ProjectCard";
import { projects } from "./Projects.data";

const Projects: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="projects"
      className="py-24 sm:py-32 bg-light-bg dark:bg-dark-bg"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeUpVariant}>
            <SectionLabel>{t("home.projects.eyebrow")}</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
              {t("home.projects.title")}
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
